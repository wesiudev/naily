import { getUserById, getUsers, db } from "@/firebase";
import { User } from "@/types";
import Image from "next/image";
import Link from "next/link";
import {
  FaMapMarkerAlt,
  FaPhone,
  FaEnvelope,
  FaCheckCircle,
  FaClock,
  FaEuroSign,
  FaImages,
  FaStar,
  FaCalendarAlt,
  FaUser,
  FaBuilding,
} from "react-icons/fa";
import ReservationButton from "./ReservationButton";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import OpinionsSection from "@/components/User/OpinionsSection";

async function fetchUserBySlugOrUid(slug: string): Promise<User | null> {
  try {
    const all = (await getUsers()) as User[];
    const bySlug = all.find(
      (u) => (u as User & { userSlugUrl?: string })?.userSlugUrl === slug
    );
    if (bySlug) return bySlug as User;
    // fallback to uid
    const byUid = (await getUserById(slug)) as User | null;
    return byUid || null;
  } catch {
    return null;
  }
}

export default async function UserPublicProfile({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const user = await fetchUserBySlugOrUid(slug);
  let portfolio: Array<{ id: string; url?: string; title?: string }> = [];

  if (user?.uid) {
    try {
      const colRef = collection(db, "users", user.uid, "portfolio");
      const q = query(colRef, orderBy("createdAt", "desc"));
      const snap = await getDocs(q);
      portfolio = snap.docs.map((d) => ({ id: d.id, ...(d.data() as any) }));
    } catch (_) {
      portfolio = [];
    }
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-zinc-100 to-neutral-200">
        <div className="text-center bg-white p-8 rounded-xl shadow-lg">
          <div className="text-primary-600 text-lg font-semibold mb-2">
            Nie znaleziono profilu
          </div>
          <p className="text-neutral-600 mb-4">
            Profil użytkownika może nie istnieć lub został usunięty
          </p>
          <Link
            href="/"
            className="inline-flex items-center px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-semibold"
          >
            Wróć do strony głównej
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Hero Section with Banner Image or Fallback */}
      <section className="relative w-full overflow-hidden">
        <div className="max-w-7xl mx-auto mt-36 mb-12 px-4 sm:px-6 relative">
          <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8">
            <div className="flex flex-col md:flex-row md:items-center gap-6">
              <div className="relative shrink-0">
                <Image
                  src={user.logo || "/default-user.png"}
                  alt={user.name}
                  width={132}
                  height={132}
                  className="w-28 h-28 md:w-32 md:h-32 rounded-full object-cover border-4 border-white shadow-md"
                />
                {(user?.subscription?.status === "active" ||
                  user?.premiumActive ||
                  user?.active) && (
                  <div className="absolute -bottom-2 -right-2 bg-green-500 text-white rounded-full p-1.5 shadow-lg">
                    <FaCheckCircle className="w-4 h-4" />
                  </div>
                )}
              </div>
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-3 mb-2">
                  <h1 className="text-2xl md:text-3xl font-bold text-neutral-900 break-words">
                    {user.name}
                  </h1>
                  {user.emailVerified && (
                    <FaCheckCircle
                      className="text-primary-600 w-5 h-5"
                      title="Zweryfikowany email"
                    />
                  )}
                </div>
                <div className="flex flex-wrap items-center gap-2 mb-3">
                  <span className="px-3 py-1 rounded-full bg-neutral-100 text-neutral-700 text-sm flex items-center gap-2">
                    {user.seek ? (
                      <FaUser className="w-4 h-4" />
                    ) : (
                      <FaBuilding className="w-4 h-4" />
                    )}
                    {user.seek
                      ? "Specjalista indywidualny"
                      : "Salon kosmetyczny"}
                  </span>
                  {user.location?.address && (
                    <span className="text-neutral-700 text-sm flex items-center gap-2">
                      <FaMapMarkerAlt className="w-4 h-4 text-neutral-500" />
                      {user.location.address}
                    </span>
                  )}
                </div>
                <div className="flex flex-wrap items-center gap-3 text-sm">
                  <span className="px-3 py-1 rounded-full bg-primary-50 text-primary-700 font-medium flex items-center gap-2">
                    <FaStar className="w-4 h-4 text-primary-600" />
                    {user.services?.length || 0} usług
                  </span>
                  {portfolio.length > 0 && (
                    <span className="px-3 py-1 rounded-full bg-primary-50 text-primary-700 font-medium flex items-center gap-2">
                      <FaImages className="w-4 h-4 text-primary-600" />
                      {portfolio.length} zdjęć
                    </span>
                  )}
                </div>
                <div className="mt-4">
                  <ReservationButton user={user} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Description */}
            {user.description && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <FaUser className="text-red-600" />O mnie
                </h2>
                <p className="text-gray-700 whitespace-pre-line leading-relaxed break-words">
                  {user.description}
                </p>
              </div>
            )}

            {/* Services */}
            {!!user.services?.length && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <FaStar className="text-red-600" />
                  Oferowane usługi ({user.services.length})
                </h2>
                <div className="grid gap-4">
                  {user.services.map((service) => (
                    <div
                      key={service.flatten_name}
                      className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900">
                            {service.real_name}
                          </h3>
                          {service.description && (
                            <p className="text-sm text-gray-600 mt-1 break-words">
                              {service.description}
                            </p>
                          )}
                        </div>
                        <div className="flex flex-col sm:items-end gap-1">
                          {typeof service.price === "number" && (
                            <div className="flex items-center gap-1 text-red-600 font-semibold">
                              <FaEuroSign className="w-3 h-3" />
                              <span>{service.price} zł</span>
                            </div>
                          )}
                          {service.duration && (
                            <div className="flex items-center gap-1 text-gray-600 text-sm">
                              <FaClock className="w-3 h-3" />
                              <span>{service.duration} min</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Portfolio */}
            {portfolio.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <FaImages className="text-red-600" />
                  Portfolio ({portfolio.length})
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {portfolio.map((image, index) => (
                    <div key={index} className="relative group">
                      <Image
                        src={image.url || ""}
                        alt={image.title || `Portfolio ${index + 1}`}
                        width={200}
                        height={200}
                        className="w-full h-32 object-cover rounded-lg border border-gray-200 group-hover:opacity-90 transition-opacity"
                      />
                      {image.title && (
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-200 rounded-lg flex items-center justify-center">
                          <p className="text-white text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity text-center px-2 break-words">
                            {image.title}
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Opinions */}
            {user.uid && <OpinionsSection profileUid={user.uid as string} />}
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Contact & Booking */}
            <div className="professional-card p-6 animate-fade-in animation-delay-600">
              <h3 className="text-xl font-semibold text-neutral-900 mb-6 flex items-center gap-3">
                <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                  <FaCalendarAlt className="text-primary-600" />
                </div>
                Kontakt i rezerwacja
              </h3>

              <div className="space-y-4 mb-6">
                {user.phoneNumber && (
                  <div className="flex items-center gap-3 p-3 bg-neutral-50 rounded-lg">
                    <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                      <FaPhone className="w-4 h-4 text-primary-600" />
                    </div>
                    <a
                      href={`tel:${user.phoneNumber}`}
                      className="text-neutral-700 hover:text-primary-600 transition-colors font-medium"
                    >
                      {user.phoneNumber}
                    </a>
                  </div>
                )}

                {user.email && (
                  <div className="flex items-center gap-3 p-3 bg-neutral-50 rounded-lg">
                    <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                      <FaEnvelope className="w-4 h-4 text-primary-600" />
                    </div>
                    <a
                      href={`mailto:${user.email}`}
                      className="text-neutral-700 hover:text-primary-600 transition-colors font-medium"
                    >
                      {user.email}
                    </a>
                  </div>
                )}
              </div>
            </div>

            {/* Profile Status removed per request */}

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
    </>
  );
}
