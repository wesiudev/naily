"use client";
import { FaPhone, FaMapMarkerAlt } from "react-icons/fa";

export default function ContactInfo({ user }) {
  if (!user?.phoneNumber && !user?.location?.address) {
    return null;
  }

  return (
    <div className="flex flex-row flex-wrap items-center gap-3 lg:gap-4 pt-3 border-t border-neutral-200">
      {user?.phoneNumber && (
        <div className="flex items-center gap-2 text-sm text-neutral-700">
          <FaPhone className="h-3.5 w-3.5 flex-shrink-0 text-neutral-500" />
          <span className="truncate font-medium">{user.phoneNumber}</span>
        </div>
      )}
      {user?.location?.address && (
        <div className="flex items-center gap-2 text-sm text-neutral-700">
          <FaMapMarkerAlt className="h-3.5 w-3.5 flex-shrink-0 text-neutral-500" />
          <span className="truncate font-medium">{user.location.address}</span>
        </div>
      )}
    </div>
  );
}

