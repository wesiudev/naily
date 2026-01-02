"use client";
import { useState, useEffect } from "react";
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

  // Handle hash navigation on page load
  useEffect(() => {
    if (typeof window !== "undefined" && window.location.hash === "#opinie") {
      setTimeout(() => {
        const opinionsSection = document.getElementById("opinie");
        if (opinionsSection) {
          opinionsSection.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, 500); // Delay to ensure page is fully rendered
    }
  }, []);
  
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
      <section className="relative w-full overflow-hidden bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="max-w-7xl mx-auto mt-36 mb-12 px-4 sm:px-6 relative">
          <UserProfileHero 
            user={user} 
            portfolio={portfolio} 
            variant="fullpage"
            onReservationOpen={() => setIsReservationModalOpen(true)}
          />
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-16">
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
          <div className="space-y-6">
            {/* Contact & Booking */}
            <UserProfileContact user={user} />

            {/* Quick Stats */}
            <div className="bg-white rounded-2xl shadow-lg border border-neutral-200 p-6 animate-fade-in animation-delay-1000">
              <h3 className="text-xl font-baloo font-bold text-neutral-900 mb-6 flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-bold text-sm">📊</span>
                </div>
                Statystyki
              </h3>

              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border border-blue-200 hover:shadow-md transition-shadow">
                  <div className="text-3xl font-bold text-blue-600 mb-1">
                    {user.services?.length || 0}
                  </div>
                  <div className="text-sm text-neutral-700 font-medium font-poppins">
                    Usługi
                  </div>
                </div>

                <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl border border-purple-200 hover:shadow-md transition-shadow">
                  <div className="text-3xl font-bold text-purple-600 mb-1">
                    {portfolio.length || 0}
                  </div>
                  <div className="text-sm text-neutral-700 font-medium font-poppins">
                    Zdjęcia
                  </div>
                </div>

                <div className="text-center p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-xl border border-green-200 hover:shadow-md transition-shadow">
                  <div className="text-3xl font-bold text-green-600 mb-1">
                    {user.profileComments?.length || 0}
                  </div>
                  <div className="text-sm text-neutral-700 font-medium font-poppins">
                    Opinie
                  </div>
                </div>

                <div className="text-center p-4 bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl border border-orange-200 hover:shadow-md transition-shadow">
                  <div className="text-3xl font-bold text-orange-600 mb-1">
                    {user.payments?.length || 0}
                  </div>
                  <div className="text-sm text-neutral-700 font-medium font-poppins">
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











