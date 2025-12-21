"use client";
import { useState } from "react";
import { User, IService } from "@/types";
import { UserProfileHero, UserProfileMainContent, UserProfileContact } from "@/components/User/UserProfileContent";
import ReservationModal from "./ReservationModal";

export default function UserProfileClientWrapper({
  user,
  portfolio,
}: {
  user: User;
  portfolio: Array<{ id: string; url?: string; title?: string }>;
}) {
  const [isReservationModalOpen, setIsReservationModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<IService | null>(null);
  
  const handleServiceClick = (service: IService) => {
    setSelectedService(service);
    setIsReservationModalOpen(true);
  };
  
  const handleModalClose = () => {
    setIsReservationModalOpen(false);
    setSelectedService(null);
  };
  
  return (
    <>
      {/* Hero Section with Banner Image or Fallback */}
      <section className="relative w-full overflow-hidden">
        <div className="max-w-7xl mx-auto mt-36 mb-12 px-4 sm:px-6 relative">
          <UserProfileHero 
            user={user} 
            portfolio={portfolio} 
            variant="fullpage"
            onReservationOpen={() => setIsReservationModalOpen(true)}
          />
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <UserProfileMainContent 
              user={user} 
              portfolio={portfolio} 
              variant="fullpage"
              onServiceClick={handleServiceClick}
            />
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Contact & Booking */}
            <UserProfileContact user={user} />

            {/* Quick Stats */}
            <div className="professional-card p-6 animate-fade-in animation-delay-1000">
              <h3 className="text-xl font-semibold text-neutral-900 mb-6">
                Statystyki
              </h3>

              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-primary-50 rounded-xl">
                  <div className="text-3xl font-bold text-primary-600 mb-1">
                    {user.services?.length || 0}
                  </div>
                  <div className="text-sm text-neutral-600 font-medium">
                    Usługi
                  </div>
                </div>

                <div className="text-center p-4 bg-primary-50 rounded-xl">
                  <div className="text-3xl font-bold text-primary-600 mb-1">
                    {user.portfolioImages?.length || 0}
                  </div>
                  <div className="text-sm text-neutral-600 font-medium">
                    Zdjęcia
                  </div>
                </div>

                <div className="text-center p-4 bg-primary-50 rounded-xl">
                  <div className="text-3xl font-bold text-primary-600 mb-1">
                    {user.profileComments?.length || 0}
                  </div>
                  <div className="text-sm text-neutral-600 font-medium">
                    Opinie
                  </div>
                </div>

                <div className="text-center p-4 bg-primary-50 rounded-xl">
                  <div className="text-3xl font-bold text-primary-600 mb-1">
                    {user.payments?.length || 0}
                  </div>
                  <div className="text-sm text-neutral-600 font-medium">
                    Transakcje
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <ReservationModal
        isOpen={isReservationModalOpen}
        onClose={handleModalClose}
        user={user}
        preselectedService={selectedService}
      />
    </>
  );
}






