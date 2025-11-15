"use client";
import {
  FaCalendar,
  FaCheckCircle,
  FaClock,
  FaDollarSign,
  FaChartLine,
  FaStar,
  FaUser,
  FaMapMarkerAlt,
  FaPhone,
  FaEnvelope,
  FaRocket,
  FaCrown,
  FaShieldAlt,
  FaTrendingUp,
} from "react-icons/fa";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarInitials } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import Image from "next/image";
import { FaArrowRightLong } from "react-icons/fa6";
import { formatPLNFromCents } from "@/lib/utils";

export default function DashboardOverview({
  dashboardData,
  getStatusColor,
  getStatusText,
  setActiveTab,
}) {
  const { user } = useSelector((state) => state.user);

  // Calculate real stats from user data
  const calculateUserStats = () => {
    if (!user) return {};

    const totalServices = user.services?.length || 0;
    const totalPayments = user.payments?.length || 0;
    const totalSpent =
      user.payments?.reduce((sum, payment) => {
        return payment.result === "paid" ? sum + payment.amount : sum;
      }, 0) || 0;
    const averageSpentPerService =
      totalServices > 0 ? Math.round(totalSpent / totalServices) : 0;

    // Calculate this month's data
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    const thisMonthPayments =
      user.payments?.filter((payment) => {
        const paymentDate = new Date(payment.date);
        return (
          paymentDate.getMonth() === currentMonth &&
          paymentDate.getFullYear() === currentYear &&
          payment.result === "paid"
        );
      }) || [];
    const thisMonthSpent = thisMonthPayments.reduce(
      (sum, payment) => sum + payment.amount,
      0
    );

    return {
      totalServices,
      totalPayments,
      totalSpent,
      thisMonthSpent,
      averageSpentPerService,
      completedServices:
        user.payments?.filter((p) => p.result === "paid").length || 0,
      pendingServices:
        user.payments?.filter((p) => p.result === "pending").length || 0,
    };
  };

  // Get top services from user's actual services
  const getTopServices = () => {
    if (!user?.services) return [];

    return user.services.slice(0, 4).map((service) => ({
      name: service.real_name,
      price: service.price,
      duration: service.duration,
      description: service.description,
    }));
  };

  // Get recent payments
  const getRecentPayments = () => {
    if (!user?.payments) return [];

    return user.payments
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 5)
      .map((payment) => ({
        id: payment.date,
        service: "Usługa kosmetyczna",
        specialist: user.name,
        date: new Date(payment.date).toLocaleDateString("pl-PL"),
        time: new Date(payment.date).toLocaleTimeString("pl-PL", {
          hour: "2-digit",
          minute: "2-digit",
        }),
        status: payment.result,
        price: payment.amount,
        duration: 60,
        location: user.location?.address || "Nie określono",
      }));
  };

  const userStats = calculateUserStats();
  const topServices = getTopServices();
  const recentPayments = getRecentPayments();

  // Profile configuration checklist + progress
  const minServicesTarget = 1;
  const servicesCount = user?.services?.length || 0;
  const certificationsCount = user?.certifications?.length || 0;
  const hasPhone = Boolean(user?.phoneNumber);
  const hasLocation = Boolean(user?.location?.address);
  const hasAvatar = Boolean(user?.photoURL);

  const configItems = [
    {
      key: "phone",
      label: "Numer telefonu",
      value: hasPhone ? user.phoneNumber : "Brak",
      completed: hasPhone,
      ctaTab: "settings",
    },
    {
      key: "services",
      label: "Dodaj usługę",
      value: `${Math.min(
        servicesCount,
        minServicesTarget
      )}/${minServicesTarget}`,
      completed: servicesCount >= minServicesTarget,
      partialProgress: Math.min(servicesCount / minServicesTarget, 1),
      ctaTab: "services",
    },
    {
      key: "location",
      label: "Dokładny adres",
      value: hasLocation ? user.location.address : "Nie podano",
      completed: hasLocation,
      ctaTab: "settings",
    },
    {
      key: "avatar",
      label: "Zdjęcie profilowe",
      value: hasAvatar ? "Dodane" : "Brak",
      completed: hasAvatar,
      ctaTab: "settings",
    },
    {
      key: "certifications",
      label: "Certyfikaty",
      value: certificationsCount > 0 ? `${certificationsCount}` : "0",
      completed: certificationsCount > 0,
      ctaTab: "settings",
    },
  ];

  const totalCriteria = configItems.length; // services contributes up to 1 via partialProgress
  const completedPoints = configItems.reduce((sum, item) => {
    if (item.key === "services") return sum + (item.partialProgress || 0);
    return sum + (item.completed ? 1 : 0);
  }, 0);
  const completionPercent = Math.round((completedPoints / totalCriteria) * 100);

  return (
    <div className="mb-6 lg:mb-12">
      <div>
      <CardTitle className="text-base font-baloo text-2xl">
          Czas zabłysnąć!
      </CardTitle>
        <CardDescription className="font-poppins">
          Zachęć klientki do rezerwacji, uzupełniając dane profilu.
        </CardDescription>

        <div className="mt-3 md:mt-4">
          <Progress value={completionPercent} />
        </div>

        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2 md:gap-3">
          {configItems.map((item) => (
            <div
              key={item.key}
              className="flex items-start gap-3 rounded-lg border border-zinc-200 bg-white p-3 md:p-4"
            >
              <FaCheckCircle
                className={`mt-0.5 h-5 w-5 ${
                  item.completed ? "text-green-600" : "text-zinc-300"
                }`}
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div className="w-full min-w-0">
                    <div className="w-full flex items-center justify-between gap-2 min-w-0">
                      <h3 className="text-sm md:text-base font-semibold text-zinc-800 truncate">
                        {item.label}
                      </h3>
                    </div>
                  </div>
                  {!item.completed && (
                    <button
                      onClick={() => setActiveTab(item.ctaTab)}
                      className="shrink-0 px-2 py-1 rounded-md text-[11px] md:text-xs bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                      aria-label={`Edytuj: ${item.label}`}
                    >
                      Edytuj
                    </button>
                  )}
                </div>
                
                {item.key === "phone" && (
                  <p className="mt-1 text-[11px] md:text-xs text-zinc-600">
                    Dodaj numer telefonu, aby umożliwić rezerwacje telefoniczne.
                  </p>
                )}
                {item.key === "certifications" && (
                  <p className="mt-1 text-[11px] md:text-xs text-zinc-600">
                    Dodaj certyfikaty, aby zwiększyć zaufanie klientek.
                  </p>
                )}
                {item.key === "location" && (
                  <p className="mt-1 text-[11px] md:text-xs text-zinc-600">
                    Dodaj dokładny adres, aby klientki mogły łatwo trafić.
                  </p>
                )}
                {item.key === "avatar" && (
                  <p className="mt-1 text-[11px] md:text-xs text-zinc-600">
                    Dodaj zdjęcie profilowe, aby wzbudzić zaufanie.
                  </p>
                )}
                {item.key === "services" && (
                  <p className="mt-1 text-[11px] md:text-xs text-zinc-600">
                    Dodaj co najmniej jedną usługę, aby rozpocząć zdobywanie rezerwacji.
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
