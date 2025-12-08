"use client";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import {
  FaBell,
  FaCheck,
  FaTimes,
  FaTrash,
  FaEye,
  FaEyeSlash,
  FaCalendar,
  FaUser,
  FaExclamationTriangle,
  FaInfoCircle,
  FaCheckCircle,
  FaClock,
  FaStar,
  FaPhone,
  FaUndo,
} from "react-icons/fa";
import {
  MdNotifications,
  MdNotificationsActive,
  MdNotificationsOff,
} from "react-icons/md";
import { toast } from "react-toastify";
import {
  subscribeToUserNotificationsPaged,
  fetchMoreUserNotifications,
  markNotificationRead,
  softDeleteNotification,
  deleteNotification as deleteNotificationFromFirebase,
  db,
} from "@/firebase";

// No placeholder data; use live subscription

const getApiUrl = (path) => {
  const baseUrl = process.env.NEXT_PUBLIC_URL || (typeof window !== 'undefined' ? window.location.origin : '');
  return `${baseUrl}${path}`;
};

export default function NotificationManager() {
  const { user } = useSelector((state) => state.user);
  const [notifications, setNotifications] = useState([]);
  const [filter, setFilter] = useState("all");
  const [lastVisible, setLastVisible] = useState(null);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [declineConfirmId, setDeclineConfirmId] = useState(null);
  const [approvedNotifications, setApprovedNotifications] = useState(new Set());
  const [declinedNotifications, setDeclinedNotifications] = useState(new Set());
  const [loadingReservationStatuses, setLoadingReservationStatuses] = useState(new Set());

  useEffect(() => {
    if (!user?.uid) return;
    const unsubscribe = subscribeToUserNotificationsPaged(
      user.uid,
      20,
      async ({ list, lastVisible }) => {
        setNotifications(list);
        setLastVisible(lastVisible);
        
        // Fetch reservation statuses for notifications with reservationId
        const notificationsWithReservationId = list.filter(n => n.reservationId);
        if (notificationsWithReservationId.length > 0) {
          // Mark all as loading
          const loadingIds = new Set(notificationsWithReservationId.map(n => n.id));
          setLoadingReservationStatuses((prev) => {
            const newSet = new Set(prev);
            loadingIds.forEach(id => newSet.add(id));
            return newSet;
          });
          
          try {
            const reservationStatuses = await Promise.all(
              notificationsWithReservationId.map(async (notification) => {
                try {
                  const res = await fetch(getApiUrl(`/api/reservations/${encodeURIComponent(notification.reservationId)}`));
                  if (res.ok) {
                    const reservation = await res.json();
                    return { notificationId: notification.id, status: reservation.status };
                  }
                } catch (error) {
                  console.error(`Error fetching reservation ${notification.reservationId}:`, error);
                }
                return null;
              })
            );
            
            // Update local state based on reservation statuses
            // Merge with existing state to preserve manually set states
            setApprovedNotifications((prev) => {
              const newSet = new Set(prev);
              reservationStatuses.forEach((item) => {
                if (!item) return;
                if (item.status === "confirmed") {
                  newSet.add(item.notificationId);
                } else if (item.status === "cancelled") {
                  newSet.delete(item.notificationId);
                } else if (item.status === "pending") {
                  newSet.delete(item.notificationId);
                }
              });
              return newSet;
            });
            setDeclinedNotifications((prev) => {
              const newSet = new Set(prev);
              reservationStatuses.forEach((item) => {
                if (!item) return;
                if (item.status === "cancelled") {
                  newSet.add(item.notificationId);
                } else if (item.status === "confirmed") {
                  newSet.delete(item.notificationId);
                } else if (item.status === "pending") {
                  newSet.delete(item.notificationId);
                }
              });
              return newSet;
            });
            
            // Remove from loading set
            setLoadingReservationStatuses((prev) => {
              const newSet = new Set(prev);
              loadingIds.forEach(id => newSet.delete(id));
              return newSet;
            });
          } catch (error) {
            console.error("Error fetching reservation statuses:", error);
            // Remove from loading set on error
            setLoadingReservationStatuses((prev) => {
              const newSet = new Set(prev);
              loadingIds.forEach(id => newSet.delete(id));
              return newSet;
            });
          }
        }
      }
    );
    return () => unsubscribe && unsubscribe();
  }, [user?.uid]);

  // Calculate unread count
  const unreadCount = notifications.filter(
    (n) => !n.isRead && !n.isDeleted
  ).length;

  const getNotificationIcon = (type, isApproved, isDeclined) => {
    // Override icon color based on status
    if (isApproved) {
      return <FaCheckCircle className="text-green-600" />;
    }
    if (isDeclined) {
      return <FaTimes className="text-red-600" />;
    }
    
    switch (type) {
      case "reservation_confirmed":
        return <FaCheckCircle className="text-green-500" />;
      case "reservation_request":
        return <FaCalendar className="text-blue-600" />;
      case "reservation_reminder":
        return <FaClock className="text-blue-600" />;
      case "reservation_cancelled":
        return <FaTimes className="text-red-500" />;
      case "welcome":
        return <FaUser className="text-blue-600" />;
      case "specialist_available":
        return <FaStar className="text-yellow-500" />;
      case "service_completed":
        return <FaCheck className="text-green-500" />;
      default:
        return <FaInfoCircle className="text-gray-500" />;
    }
  };

  const getNotificationColor = (type) => {
    switch (type) {
      case "reservation_confirmed":
        return "border-l-green-500 bg-green-50";
      case "reservation_request":
        return "border-l-blue-600 bg-blue-100";
      case "reservation_reminder":
        return "border-l-blue-600 bg-blue-100";
      case "reservation_cancelled":
        return "border-l-red-500 bg-red-50";
      case "welcome":
        return "border-l-blue-600 bg-blue-100";
      case "specialist_available":
        return "border-l-yellow-500 bg-yellow-50";
      case "service_completed":
        return "border-l-green-500 bg-green-50";
      default:
        return "border-l-gray-500 bg-gray-50";
    }
  };

  const formatTimestamp = (ts) => {
    let timestamp = ts;
    if (typeof ts === "object" && ts) {
      if (typeof ts.toMillis === "function") timestamp = ts.toMillis();
      else if (typeof ts.seconds === "number") timestamp = ts.seconds * 1000;
    }
    if (typeof timestamp !== "number") timestamp = Date.parse(ts);
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now - date) / (1000 * 60 * 60);

    if (diffInHours < 1) {
      return "Przed chwilą";
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)} godzin temu`;
    } else if (diffInHours < 48) {
      return "Wczoraj";
    } else {
      return date.toLocaleDateString("pl-PL", {
        day: "numeric",
        month: "short",
        hour: "2-digit",
        minute: "2-digit",
      });
    }
  };

  const markAsRead = async (notificationId) => {
    // optimistic update
    setNotifications((prev) =>
      prev.map((n) => (n.id === notificationId ? { ...n, isRead: true } : n))
    );
    try {
      if (user?.uid) await markNotificationRead(user.uid, notificationId);
      toast.success("Oznaczono jako przeczytane");
    } catch (_) {
      // ignore; subscription will reconcile
    }
  };

  const markAllAsRead = async () => {
    const ids = notifications
      .filter((n) => !n.isRead && !n.isDeleted)
      .map((n) => n.id);
    // optimistic
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    try {
      if (user?.uid)
        await Promise.all(ids.map((id) => markNotificationRead(user.uid, id)));
      toast.success("Wszystkie powiadomienia oznaczono jako przeczytane");
    } catch (_) {}
  };

  const deleteNotification = async (notificationId) => {
    // Find the notification to check if it's already deleted
    const notification = notifications.find(n => n.id === notificationId);
    
    // If notification is already deleted (in trashcan), permanently delete the reservation and notification
    if (notification?.isDeleted && notification?.reservationId) {
      try {
        // Delete reservation from database
        const res = await fetch(getApiUrl(`/api/reservations/${encodeURIComponent(notification.reservationId)}`), {
          method: "DELETE",
        });
        
        if (res.ok) {
          // Permanently delete notification from Firebase
          if (user?.uid) {
            await deleteNotificationFromFirebase(user.uid, notificationId);
          }
          
          // Remove notification from local state
          setNotifications((prev) => prev.filter((n) => n.id !== notificationId));
          // Remove from approved/declined sets
          setApprovedNotifications((prev) => {
            const newSet = new Set(prev);
            newSet.delete(notificationId);
            return newSet;
          });
          setDeclinedNotifications((prev) => {
            const newSet = new Set(prev);
            newSet.delete(notificationId);
            return newSet;
          });
          toast.success("Rezerwacja została trwale usunięta");
        } else {
          const errorData = await res.json().catch(() => ({}));
          throw new Error(errorData.error || "Failed to delete reservation");
        }
      } catch (error) {
        console.error("Error deleting reservation:", error);
        toast.error(error.message || "Nie udało się usunąć rezerwacji");
      }
      return;
    }
    
    // Otherwise, soft-delete the notification
    // optimistic
    setNotifications((prev) =>
      prev.map((n) => (n.id === notificationId ? { ...n, isDeleted: true } : n))
    );
    try {
      if (user?.uid) await softDeleteNotification(user.uid, notificationId);
      toast.success("Powiadomienie usunięte");
    } catch (_) {}
  };

  const deleteAllRead = async () => {
    const ids = notifications
      .filter((n) => n.isRead && !n.isDeleted)
      .map((n) => n.id);
    // optimistic
    setNotifications((prev) =>
      prev.map((n) => (n.isRead ? { ...n, isDeleted: true } : n))
    );
    try {
      if (user?.uid)
        await Promise.all(
          ids.map((id) => softDeleteNotification(user.uid, id))
        );
      toast.success("Usunięto wszystkie przeczytane powiadomienia");
    } catch (_) {}
  };

  const handleApprove = async (notification) => {
    try {
      // Update reservation status in database if reservationId exists
      if (notification.reservationId) {
        const res = await fetch(getApiUrl(`/api/reservations/${encodeURIComponent(notification.reservationId)}`), {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: "confirmed" }),
        });
        
        if (!res.ok) {
          const errorData = await res.json().catch(() => ({}));
          throw new Error(errorData.error || "Failed to update reservation");
        }
      }
      
      // Mark notification as approved locally
      setApprovedNotifications((prev) => new Set([...prev, notification.id]));
      // Remove from declined if it was there
      setDeclinedNotifications((prev) => {
        const newSet = new Set(prev);
        newSet.delete(notification.id);
        return newSet;
      });
      // Mark notification as read
      if (!notification.isRead && user?.uid) {
        await markNotificationRead(user.uid, notification.id);
      }
      toast.success("Rezerwacja zatwierdzona");
    } catch (error) {
      console.error("Error approving reservation:", error);
      toast.error(error.message || "Nie udało się zatwierdzić rezerwacji");
    }
  };

  const handleCall = (notification) => {
    // Extract phone number from notification data or user data
    const phoneNumber = notification.phoneNumber || notification.phone || user?.phoneNumber || user?.phone;
    if (phoneNumber) {
      window.location.href = `tel:${phoneNumber}`;
      toast.info("Inicjowanie połączenia...");
    } else {
      toast.warning("Brak numeru telefonu");
    }
  };

  const handleDecline = async (notification) => {
    try {
      // Update reservation status in database if reservationId exists
      if (notification.reservationId) {
        const res = await fetch(getApiUrl(`/api/reservations/${encodeURIComponent(notification.reservationId)}`), {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: "cancelled" }),
        });
        
        if (!res.ok) {
          const errorData = await res.json().catch(() => ({}));
          throw new Error(errorData.error || "Failed to update reservation");
        }
      }
      
      // Mark notification as declined locally
      setDeclinedNotifications((prev) => new Set([...prev, notification.id]));
      // Remove from approved if it was there
      setApprovedNotifications((prev) => {
        const newSet = new Set(prev);
        newSet.delete(notification.id);
        return newSet;
      });
      // Mark notification as read
      if (!notification.isRead && user?.uid) {
        await markNotificationRead(user.uid, notification.id);
      }
      toast.success("Rezerwacja odrzucona");
      setDeclineConfirmId(null);
    } catch (error) {
      console.error("Error declining reservation:", error);
      toast.error(error.message || "Nie udało się odrzucić rezerwacji");
      setDeclineConfirmId(null);
    }
  };

  const handleReset = async (notificationId) => {
    try {
      // Find the notification to get reservationId
      const notification = notifications.find(n => n.id === notificationId);
      
      // If notification is deleted (in trashcan), restore it
      if (notification?.isDeleted) {
        try {
          // Restore notification: set isDeleted to false and mark as read
          if (user?.uid) {
            // Use Firebase functions directly
            const { updateDoc, doc, serverTimestamp } = await import("firebase/firestore");
            const ref = doc(db, "users", user.uid, "notifications", notificationId);
            await updateDoc(ref, { 
              isDeleted: false, 
              isRead: true,
              restoredAt: serverTimestamp()
            });
          }
          
          // Update local state
          setNotifications((prev) =>
            prev.map((n) => 
              n.id === notificationId 
                ? { ...n, isDeleted: false, isRead: true }
                : n
            )
          );
          
          toast.success("Powiadomienie przywrócone");
          return;
        } catch (error) {
          console.error("Error restoring notification:", error);
          toast.error("Nie udało się przywrócić powiadomienia");
          return;
        }
      }
      
      // Otherwise, reset reservation status and local state (for approved/declined notifications)
      // Update reservation status back to pending if reservationId exists
      if (notification?.reservationId) {
        const res = await fetch(getApiUrl(`/api/reservations/${encodeURIComponent(notification.reservationId)}`), {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: "pending" }),
        });
        
        if (!res.ok) {
          const errorData = await res.json().catch(() => ({}));
          throw new Error(errorData.error || "Failed to reset reservation");
        }
      }
      
      // Remove from both approved and declined sets
      setApprovedNotifications((prev) => {
        const newSet = new Set(prev);
        newSet.delete(notificationId);
        return newSet;
      });
      setDeclinedNotifications((prev) => {
        const newSet = new Set(prev);
        newSet.delete(notificationId);
        return newSet;
      });
      toast.info("Rezerwacja przywrócona do stanu początkowego");
    } catch (error) {
      console.error("Error resetting reservation:", error);
      toast.error(error.message || "Nie udało się przywrócić rezerwacji");
    }
  };

  const showDeclineConfirm = (notificationId) => {
    setDeclineConfirmId(notificationId);
  };

  const cancelDeclineConfirm = () => {
    setDeclineConfirmId(null);
  };

  const filteredNotifications = notifications.filter((notification) => {
    if (filter === "unread")
      return !notification.isRead && !notification.isDeleted;
    if (filter === "read")
      return notification.isRead && !notification.isDeleted;
    if (filter === "deleted") return notification.isDeleted;
    return !notification.isDeleted; // "all" filter
  });

  const canLoadMore = Boolean(lastVisible);

  const handleLoadMore = async () => {
    if (!user?.uid || !lastVisible) return;
    try {
      setIsLoadingMore(true);
      const { list, lastVisible: nextCursor } =
        await fetchMoreUserNotifications(user.uid, 20, lastVisible);
      setNotifications((prev) => [...prev, ...list]);
      setLastVisible(nextCursor);
    } catch (e) {
      // silent fail
    } finally {
      setIsLoadingMore(false);
    }
  };

  const renderNotificationCard = (notification) => {
    const isApproved = approvedNotifications.has(notification.id);
    const isDeclined = declinedNotifications.has(notification.id);
    const isDeleted = notification.isDeleted;
    const isLoadingStatus = loadingReservationStatuses.has(notification.id);
    const hasReservationId = Boolean(notification.reservationId);
    const isActionable = [
      "reservation_confirmed",
      "reservation_request",
      "reservation_reminder",
      "specialist_available",
      "service_completed",
      "welcome",
    ].includes(notification.type);

    return (
    <div
      key={notification.id}
      className={`border-l-4 p-4 rounded-xl mb-3 transition-all hover:shadow-lg bg-white border-t border-r border-b ${
        isApproved 
          ? "border-l-green-500 bg-green-50 border-gray-200" 
          : isDeclined
          ? "border-l-red-500 bg-red-50 border-gray-200"
          : `border-gray-200 ${getNotificationColor(notification.type)}`
      } ${notification.isRead ? "opacity-75" : ""}`}
    >
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 mt-1">
          {getNotificationIcon(notification.type, isApproved, isDeclined)}
        </div>

        <div className="flex-1">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1">
              <h3
                className={`font-semibold text-gray-900 mb-1 ${
                  !notification.isRead ? "font-bold" : ""
                }`}
              >
                {notification.title}
              </h3>
              <p className="text-sm text-gray-600 mb-2">
                {notification.message}
              </p>
              <p className="text-xs text-gray-500">
                {formatTimestamp(
                  notification.createdAt ?? notification.timestamp
                )}
              </p>
            </div>

            <div className="flex items-center gap-1">
              {!notification.isRead && (
                <button
                  onClick={() => markAsRead(notification.id)}
                  className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                  title="Oznacz jako przeczytane"
                >
                  <FaEye className="text-sm" />
                </button>
              )}
              <button
                onClick={() => deleteNotification(notification.id)}
                className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                title="Usuń powiadomienie"
              >
                <FaTrash className="text-sm" />
              </button>
            </div>
          </div>

          {/* Action buttons or status */}
          {isActionable && (
            <>
              {isDeleted ? (
                <div className="mt-3 flex items-center justify-between">
                  <div className="flex items-center gap-2 opacity-50">
                    <FaTrash className="text-gray-500" />
                    <span className="text-sm text-gray-600 font-medium">
                      Powiadomienie usunięte
                    </span>
                  </div>
                  <button
                    onClick={() => handleReset(notification.id)}
                    className="flex items-center gap-2 px-3 py-1.5 text-sm font-semibold text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-all"
                    title="Przywróć powiadomienie"
                  >
                    <FaUndo className="text-sm" />
                    Przywróć
                  </button>
                </div>
              ) : isLoadingStatus && hasReservationId ? (
                // Loading skeleton for reservation status
                <div className="mt-3 flex flex-wrap gap-2">
                  <div className="h-10 w-24 bg-gray-200 rounded-lg animate-pulse"></div>
                  <div className="h-10 w-24 bg-gray-200 rounded-lg animate-pulse"></div>
                  <div className="h-10 w-24 bg-gray-200 rounded-lg animate-pulse"></div>
                </div>
              ) : isApproved ? (
                <div className="mt-3 flex items-center justify-between">
                  <div className="flex items-center gap-2 opacity-50">
                    <FaCheckCircle className="text-green-600" />
                    <span className="text-sm text-gray-600 font-medium">
                      Rezerwacja zatwierdzona
                    </span>
                  </div>
                  <button
                    onClick={() => handleReset(notification.id)}
                    className="flex items-center gap-2 px-3 py-1.5 text-sm font-semibold text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-all"
                    title="Przywróć do stanu początkowego"
                  >
                    <FaUndo className="text-sm" />
                    Resetuj
                  </button>
                </div>
              ) : isDeclined ? (
                <div className="mt-3 flex items-center justify-between">
                  <div className="flex items-center gap-2 opacity-50">
                    <FaTimes className="text-red-600" />
                    <span className="text-sm text-gray-600 font-medium">
                      Rezerwacja odrzucona
                    </span>
                  </div>
                  <button
                    onClick={() => handleReset(notification.id)}
                    className="flex items-center gap-2 px-3 py-1.5 text-sm font-semibold text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-all"
                    title="Przywróć do stanu początkowego"
                  >
                    <FaUndo className="text-sm" />
                    Resetuj
                  </button>
                </div>
              ) : (
                <div className="mt-3 flex flex-wrap gap-2">
                  <button
                    onClick={() => handleApprove(notification)}
                    className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white text-sm font-semibold rounded-lg transition-all shadow-md hover:shadow-lg"
                  >
                    <FaCheck className="text-sm" />
                    Zatwierdź
                  </button>
                  <button
                    onClick={() => handleCall(notification)}
                    className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white text-sm font-semibold rounded-lg transition-all shadow-md hover:shadow-lg"
                  >
                    <FaPhone className="text-sm" />
                    Zadzwoń
                  </button>
                  <button
                    onClick={() => showDeclineConfirm(notification.id)}
                    className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white text-sm font-semibold rounded-lg transition-all shadow-md hover:shadow-lg"
                  >
                    <FaTimes className="text-sm" />
                    Odrzuć
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
    );
  };

  return (
    <div className="">
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
        <div className="flex items-center gap-2">
          {unreadCount > 0 && (
            <span className="bg-blue-600 text-white px-3 py-1.5 rounded-full text-sm font-semibold shadow-md">
              {unreadCount} nowych
            </span>
          )}
        </div>
        {unreadCount > 0 && (
          <button
            onClick={markAllAsRead}
            className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white text-sm font-semibold rounded-lg transition-all shadow-md hover:shadow-lg"
          >
            Oznacz wszystkie jako przeczytane
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 mb-4">
        <button
          onClick={() => setFilter("all")}
          className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all shadow-sm ${
            filter === "all"
              ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-md"
              : "bg-white hover:bg-blue-50 border-2 border-blue-200 text-gray-700 hover:border-blue-300"
          }`}
        >
          Wszystkie ({notifications.filter((n) => !n.isDeleted).length})
        </button>
        <button
          onClick={() => setFilter("unread")}
          className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all shadow-sm ${
            filter === "unread"
              ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-md"
              : "bg-white hover:bg-blue-50 border-2 border-blue-200 text-gray-700 hover:border-blue-300"
          }`}
        >
          Nieprzeczytane (
          {notifications.filter((n) => !n.isRead && !n.isDeleted).length})
        </button>
        <button
          onClick={() => setFilter("read")}
          className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all shadow-sm ${
            filter === "read"
              ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-md"
              : "bg-white hover:bg-blue-50 border-2 border-blue-200 text-gray-700 hover:border-blue-300"
          }`}
        >
          Przeczytane (
          {notifications.filter((n) => n.isRead && !n.isDeleted).length})
        </button>
        <button
          onClick={() => setFilter("deleted")}
          className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all shadow-sm ${
            filter === "deleted"
              ? "bg-gradient-to-r from-red-600 to-red-700 text-white shadow-md"
              : "bg-white hover:bg-red-50 border-2 border-red-200 text-gray-700 hover:border-red-300"
          }`}
        >
          Kosz ({notifications.filter((n) => n.isDeleted).length})
        </button>
      </div>

      {/* Bulk Actions */}
      {filter === "read" &&
        notifications.filter((n) => n.isRead && !n.isDeleted).length > 0 && (
          <div className="bg-blue-50 rounded-xl border-2 border-blue-200 p-4 mb-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-700 font-medium">
                Masz{" "}
                {notifications.filter((n) => n.isRead && !n.isDeleted).length}{" "}
                przeczytanych powiadomień
              </span>
              <button
                onClick={deleteAllRead}
                className="px-4 py-2 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white text-sm font-semibold rounded-lg transition-all shadow-md hover:shadow-lg"
              >
                Usuń wszystkie przeczytane
              </button>
            </div>
          </div>
        )}

      {/* Notifications List */}
      <div className="space-y-3">
        {filteredNotifications.length === 0 ? (
          <div className="text-center py-12">
            <MdNotifications className="text-4xl text-gray-400 mx-auto mb-4" />
            <p className="text-gray-700 mb-2 font-medium">
              {filter === "unread"
                ? "Brak nieprzeczytanych powiadomień"
                : filter === "read"
                ? "Brak przeczytanych powiadomień"
                : filter === "deleted"
                ? "Kosz jest pusty"
                : "Brak powiadomień"}
            </p>
            <p className="text-sm text-gray-500">
              {filter === "unread"
                ? "Wszystkie powiadomienia zostały przeczytane"
                : filter === "read"
                ? "Nie masz jeszcze przeczytanych powiadomień"
                : filter === "deleted"
                ? "Usunięte powiadomienia pojawią się tutaj"
                : "Nowe powiadomienia pojawią się tutaj"}
            </p>
          </div>
        ) : (
          <>
            {filteredNotifications.map(renderNotificationCard)}
            {canLoadMore && (
              <div className="text-center pt-2">
                <button
                  onClick={handleLoadMore}
                  disabled={isLoadingMore}
                  className="px-4 py-2 rounded-lg bg-white border-2 border-blue-200 hover:bg-blue-50 hover:border-blue-300 text-sm font-semibold text-gray-700 transition-all shadow-sm"
                >
                  {isLoadingMore ? "Ładowanie..." : "Załaduj więcej"}
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Decline Confirmation Popup */}
      {declineConfirmId && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 border-2 border-red-200">
            <div className="flex items-start gap-4 mb-4">
              <div className="p-3 bg-red-100 rounded-full">
                <FaExclamationTriangle className="text-red-600 text-xl" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Potwierdź odrzucenie
                </h3>
                <p className="text-gray-600">
                  Czy na pewno chcesz odrzucić tę rezerwację?
                </p>
              </div>
            </div>
            <div className="flex gap-3 justify-end">
              <button
                onClick={cancelDeclineConfirm}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-lg transition-colors"
              >
                Anuluj
              </button>
              <button
                onClick={() => handleDecline(notifications.find(n => n.id === declineConfirmId))}
                className="px-4 py-2 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-semibold rounded-lg transition-all shadow-md hover:shadow-lg"
              >
                Odrzuć
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Notification Settings */}
      {/* <div className="bg-beauty-rose-50 rounded-elegant p-6">
        <h3 className="text-lg font-bold text-beauty-charcoal mb-4">
          Ustawienia powiadomień
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center justify-between p-3 bg-white rounded-elegant">
            <div>
              <p className="font-medium text-beauty-charcoal">
                Powiadomienia email
              </p>
              <p className="text-sm text-beauty-slate">
                Otrzymuj powiadomienia na email
              </p>
            </div>
            <button className="w-12 h-6 bg-blue-500 rounded-full relative">
              <div className="w-4 h-4 bg-white rounded-full absolute top-1 right-1 transition-transform"></div>
            </button>
          </div>

          <div className="flex items-center justify-between p-3 bg-white rounded-elegant">
            <div>
              <p className="font-medium text-beauty-charcoal">
                Przypomnienia o wizytach
              </p>
              <p className="text-sm text-beauty-slate">
                Powiadomienia o nadchodzących wizytach
              </p>
            </div>
            <button className="w-12 h-6 bg-blue-500 rounded-full relative">
              <div className="w-4 h-4 bg-white rounded-full absolute top-1 right-1 transition-transform"></div>
            </button>
          </div>

          <div className="flex items-center justify-between p-3 bg-white rounded-elegant">
            <div>
              <p className="font-medium text-beauty-charcoal">
                Dostępność specjalistów
              </p>
              <p className="text-sm text-beauty-slate">
                Powiadomienia o wolnych terminach
              </p>
            </div>
            <button className="w-12 h-6 bg-gray-300 rounded-full relative">
              <div className="w-4 h-4 bg-white rounded-full absolute top-1 left-1 transition-transform"></div>
            </button>
          </div>

          <div className="flex items-center justify-between p-3 bg-white rounded-elegant">
            <div>
              <p className="font-medium text-beauty-charcoal">Oceny usług</p>
              <p className="text-sm text-beauty-slate">
                Przypomnienia o ocenie usług
              </p>
            </div>
            <button className="w-12 h-6 bg-blue-500 rounded-full relative">
              <div className="w-4 h-4 bg-white rounded-full absolute top-1 right-1 transition-transform"></div>
            </button>
          </div>
        </div>
      </div> */}
    </div>
  );
}
