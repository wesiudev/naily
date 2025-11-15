"use client";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { subscribeToNewReservations } from "@/firebase";
import { showNewReservationNotification } from "@/utils/pushNotifications";
import { hasNotificationPermission } from "@/utils/pushNotifications";

/**
 * Hook to listen for new reservations and show push notifications
 * This component should be mounted in the dashboard
 */
export default function ReservationNotificationListener() {
  const { user } = useSelector((state) => state.user);

  useEffect(() => {
    if (!user?.uid) return;

    // Check if push notifications are enabled
    const settings = user?.settings || {};
    if (!settings.pushNotifications) {
      return;
    }

    // Check if browser supports notifications and permission is granted
    if (!hasNotificationPermission()) {
      return;
    }

    // Subscribe to new reservations
    const unsubscribe = subscribeToNewReservations(user.uid, (reservation) => {
      // Show push notification for new reservation
      showNewReservationNotification(reservation);
    });

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [user?.uid, user?.settings?.pushNotifications]);

  return null; // This component doesn't render anything
}

