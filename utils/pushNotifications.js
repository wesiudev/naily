/**
 * Push Notification Utilities
 * Handles browser push notification permissions and display
 */

/**
 * Request notification permission from the user
 * @returns {Promise<boolean>} True if permission granted, false otherwise
 */
export async function requestNotificationPermission() {
  if (!("Notification" in window)) {
    console.warn("This browser does not support notifications");
    return false;
  }

  if (Notification.permission === "granted") {
    return true;
  }

  if (Notification.permission === "denied") {
    console.warn("Notification permission was previously denied");
    return false;
  }

  try {
    const permission = await Notification.requestPermission();
    return permission === "granted";
  } catch (error) {
    console.error("Error requesting notification permission:", error);
    return false;
  }
}

/**
 * Check if notification permission is granted
 * @returns {boolean}
 */
export function hasNotificationPermission() {
  if (!("Notification" in window)) {
    return false;
  }
  return Notification.permission === "granted";
}

/**
 * Show a push notification
 * @param {string} title - Notification title
 * @param {NotificationOptions} options - Notification options
 * @returns {Notification|null} The notification object or null if failed
 */
export function showNotification(title, options = {}) {
  if (!hasNotificationPermission()) {
    console.warn("Notification permission not granted");
    return null;
  }

  const defaultOptions = {
    icon: "/fav/favicon.ico",
    badge: "/fav/favicon.ico",
    tag: "naily-notification",
    requireInteraction: false,
    ...options,
  };

  try {
    const notification = new Notification(title, defaultOptions);
    
    // Auto-close after 5 seconds if not requiring interaction
    if (!defaultOptions.requireInteraction) {
      setTimeout(() => {
        notification.close();
      }, 5000);
    }

    // Handle click
    notification.onclick = () => {
      window.focus();
      notification.close();
      if (options.onClick) {
        options.onClick();
      }
    };

    return notification;
  } catch (error) {
    console.error("Error showing notification:", error);
    return null;
  }
}

/**
 * Show a notification for a new reservation
 * @param {Object} reservation - Reservation object
 */
export function showNewReservationNotification(reservation) {
  const serviceName = reservation.serviceName || "Usługa";
  const customerPhone = reservation.customerPhone || "";
  
  const title = "Nowa rezerwacja! 🎉";
  const body = `${serviceName} - ${customerPhone}`;

  return showNotification(title, {
    body,
    icon: "/fav/favicon.ico",
    badge: "/fav/favicon.ico",
    tag: `reservation-${reservation.id}`,
    requireInteraction: true,
    onClick: () => {
      // Focus window and potentially navigate to reservations
      if (window.location.pathname !== "/dashboard") {
        window.location.href = "/dashboard";
      }
    },
  });
}

