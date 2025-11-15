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
} from "@/firebase";

// No placeholder data; use live subscription

export default function NotificationManager() {
  const { user } = useSelector((state) => state.user);
  const [notifications, setNotifications] = useState([]);
  const [filter, setFilter] = useState("all");
  const [lastVisible, setLastVisible] = useState(null);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  useEffect(() => {
    if (!user?.uid) return;
    const unsubscribe = subscribeToUserNotificationsPaged(
      user.uid,
      20,
      ({ list, lastVisible }) => {
        setNotifications(list);
        setLastVisible(lastVisible);
      }
    );
    return () => unsubscribe && unsubscribe();
  }, [user?.uid]);

  // Calculate unread count
  const unreadCount = notifications.filter(
    (n) => !n.isRead && !n.isDeleted
  ).length;

  const getNotificationIcon = (type) => {
    switch (type) {
      case "reservation_confirmed":
        return <FaCheckCircle className="text-green-500" />;
      case "reservation_request":
        return <FaCalendar className="text-purple-500" />;
      case "reservation_reminder":
        return <FaClock className="text-blue-500" />;
      case "reservation_cancelled":
        return <FaTimes className="text-red-500" />;
      case "welcome":
        return <FaUser className="text-purple-500" />;
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
        return "border-l-purple-500 bg-purple-50";
      case "reservation_reminder":
        return "border-l-blue-500 bg-blue-50";
      case "reservation_cancelled":
        return "border-l-red-500 bg-red-50";
      case "welcome":
        return "border-l-purple-500 bg-purple-50";
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

  const handleNotificationAction = (notification) => {
    switch (notification.type) {
      case "reservation_confirmed":
        toast.info("Przekierowywanie do szczegółów rezerwacji");
        break;
      case "reservation_request":
        toast.info("Przekierowywanie do kalendarza");
        // Optionally navigate to calendar tab
        if (window.location.pathname === "/dashboard") {
          window.dispatchEvent(new CustomEvent("dashboard:set-tab", { detail: "calendar" }));
        }
        break;
      case "reservation_reminder":
        toast.info("Przekierowywanie do rezerwacji");
        break;
      case "specialist_available":
        toast.info("Przekierowywanie do kalendarza specjalisty");
        break;
      case "service_completed":
        toast.info("Przekierowywanie do oceny usługi");
        break;
      case "welcome":
        toast.info("Przekierowywanie do przeglądu usług");
        break;
      default:
        break;
    }
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

  const renderNotificationCard = (notification) => (
    <div
      key={notification.id}
      className={`border-l-4 p-4 rounded-elegant mb-3 transition-all hover:shadow-elegant ${
        notification.isRead ? "opacity-75" : ""
      } ${getNotificationColor(notification.type)}`}
    >
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 mt-1">
          {getNotificationIcon(notification.type)}
        </div>

        <div className="flex-1">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1">
              <h3
                className={`font-semibold text-beauty-charcoal mb-1 ${
                  !notification.isRead ? "font-bold" : ""
                }`}
              >
                {notification.title}
              </h3>
              <p className="text-sm text-beauty-slate mb-2">
                {notification.message}
              </p>
              <p className="text-xs text-beauty-slate">
                {formatTimestamp(
                  notification.createdAt ?? notification.timestamp
                )}
              </p>
            </div>

            <div className="flex items-center gap-1">
              {!notification.isRead && (
                <button
                  onClick={() => markAsRead(notification.id)}
                  className="p-1 text-beauty-rose-500 hover:bg-beauty-rose-100 rounded-full transition-colors"
                  title="Oznacz jako przeczytane"
                >
                  <FaEye className="text-sm" />
                </button>
              )}
              <button
                onClick={() => deleteNotification(notification.id)}
                className="p-1 text-red-500 hover:bg-red-100 rounded-full transition-colors"
                title="Usuń powiadomienie"
              >
                <FaTrash className="text-sm" />
              </button>
            </div>
          </div>

          {/* Action button for certain notification types */}
          {[
            "reservation_confirmed",
            "reservation_request",
            "reservation_reminder",
            "specialist_available",
            "service_completed",
            "welcome",
          ].includes(notification.type) && (
            <button
              onClick={() => handleNotificationAction(notification)}
              className="mt-2 text-sm text-beauty-rose-500 hover:text-beauty-rose-600 font-medium"
            >
              Zobacz szczegóły →
            </button>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-beauty-charcoal">
            Powiadomienia
          </h2>
          <p className="text-beauty-slate">Zarządzaj swoimi powiadomieniami</p>
        </div>

        <div className="flex items-center gap-2">
          {unreadCount > 0 && (
            <span className="bg-beauty-rose-500 text-white px-2 py-1 rounded-full text-xs font-medium">
              {unreadCount} nowych
            </span>
          )}
          <button
            onClick={markAllAsRead}
            className="bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium px-3 py-1 rounded-md"
          >
            Oznacz wszystkie jako przeczytane
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setFilter("all")}
          className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
            filter === "all"
              ? "bg-blue-500 text-white"
              : "bg-white hover:bg-beauty-rose-50 border border-beauty-rose-200"
          }`}
        >
          Wszystkie ({notifications.filter((n) => !n.isDeleted).length})
        </button>
        <button
          onClick={() => setFilter("unread")}
          className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
            filter === "unread"
              ? "bg-blue-500 text-white"
              : "bg-white hover:bg-beauty-rose-50 border border-beauty-rose-200"
          }`}
        >
          Nieprzeczytane (
          {notifications.filter((n) => !n.isRead && !n.isDeleted).length})
        </button>
        <button
          onClick={() => setFilter("read")}
          className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
            filter === "read"
              ? "bg-blue-500 text-white"
              : "bg-white hover:bg-beauty-rose-50 border border-beauty-rose-200"
          }`}
        >
          Przeczytane (
          {notifications.filter((n) => n.isRead && !n.isDeleted).length})
        </button>
        <button
          onClick={() => setFilter("deleted")}
          className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
            filter === "deleted"
              ? "bg-red-500 text-white"
              : "bg-white text-beauty-slate hover:bg-red-50 border border-red-200"
          }`}
        >
          Kosz ({notifications.filter((n) => n.isDeleted).length})
        </button>
      </div>

      {/* Bulk Actions */}
      {filter === "read" &&
        notifications.filter((n) => n.isRead && !n.isDeleted).length > 0 && (
          <div className="bg-beauty-rose-50 rounded-elegant p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-beauty-slate">
                Masz{" "}
                {notifications.filter((n) => n.isRead && !n.isDeleted).length}{" "}
                przeczytanych powiadomień
              </span>
              <button
                onClick={deleteAllRead}
                className="text-red-500 hover:text-red-600 text-sm font-medium"
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
            <MdNotifications className="text-4xl text-beauty-slate mx-auto mb-4" />
            <p className="text-beauty-slate mb-2">
              {filter === "unread"
                ? "Brak nieprzeczytanych powiadomień"
                : filter === "read"
                ? "Brak przeczytanych powiadomień"
                : filter === "deleted"
                ? "Kosz jest pusty"
                : "Brak powiadomień"}
            </p>
            <p className="text-sm text-beauty-slate">
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
                  className="px-4 py-2 rounded-md bg-white border hover:bg-neutral-50 text-sm"
                >
                  {isLoadingMore ? "Ładowanie..." : "Załaduj więcej"}
                </button>
              </div>
            )}
          </>
        )}
      </div>

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
