import StartRegisterClient from "./StartRegisterClient";
import { Metadata } from "next";
import { FaGem, FaCheck, FaStar, FaGift } from "react-icons/fa";

export const revalidate = 300;

type InviteResponse = {
  exists: boolean;
  invite?: { status?: string; name?: string };
};

async function getInviteData(id: string): Promise<InviteResponse> {
  const base = process.env.NEXT_PUBLIC_URL ?? "";
  const res = await fetch(`${base}/api/invite/${id}`, {
    cache: "force-cache",
    next: { revalidate },
  });
  if (!res.ok) return { exists: false };
  return res.json();
}

export default async function InviteLanding({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const data = await getInviteData(id);
  const exists = data?.exists;
  const status = data?.invite?.status ?? "pending";

  if (!exists) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-neutral-100 to-neutral-200">
        <div className="text-center bg-white p-8 rounded-xl shadow-lg">
          <div className="text-red-600 text-lg font-semibold mb-2">
            Nieprawidłowe zaproszenie
          </div>
          <p className="text-neutral-600">
            To zaproszenie jest nieprawidłowe lub wygasło.
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Hero Section – toned down, trust-first */}
      <section className="relative py-16 sm:py-20 bg-neutral-50">
        <div className="container-professional">
          <div className="mx-auto max-w-3xl">
            {/* Header with brand + free pricing table context */}
            <div className="text-center mb-6">
              <p className="text-xs uppercase tracking-wide text-neutral-500 mb-1">
                Zaproszenie Naily
              </p>
              <h1 className="text-2xl sm:text-3xl font-bold text-neutral-900">
                Stwórz darmowy cennik manicure dzięki zaproszeniu
              </h1>
              <p className="text-neutral-600 mt-2">
                Załóż bezpłatny profil i dodaj cennik usług manicure w kilka
                minut.
              </p>
            </div>

            <div className="rounded-xl border border-neutral-200 bg-white p-5 sm:p-6 shadow-sm">
              <div className="animate-fade-in-up">
                <div className="flex justify-center mb-4">
                  <div className="bg-primary-50 p-3 rounded-full border border-primary-100">
                    <FaGift className="text-2xl text-primary-600" />
                  </div>
                </div>

                <p className="text-base sm:text-lg text-neutral-800 mb-2 text-center">
                  {data?.invite?.name ? (
                    <span className="text-primary-600">
                      Witaj, {data?.invite?.name}!
                    </span>
                  ) : (
                    <span className="text-primary-600">Witaj!</span>
                  )}
                  <br />
                  <span className="text-neutral-600">
                    Otrzymałaś zaproszenie do platformy Naily dla
                    profesjonalistek manicure.
                  </span>
                </p>

                <h2 className="text-xl sm:text-2xl font-semibold text-neutral-900 mb-4 text-center">
                  Zaproszenie aktywne
                  {status === "used" ? " (wykorzystane)" : ""}
                </h2>

                <div className="rounded-lg p-4 sm:p-5 mb-4 bg-neutral-50 border border-neutral-200">
                  <div className="text-sm text-neutral-700 text-center">
                    Zaproszenie umożliwia utworzenie darmowego profilu oraz
                    cennika usług.
                  </div>
                </div>

                <div className="text-center">
                  {status === "used" ? (
                    <div className="bg-amber-50 border border-amber-200 text-amber-800 rounded-lg p-3 mb-4 text-sm">
                      To zaproszenie zostało już wykorzystane
                    </div>
                  ) : (
                    <div className="mb-4">
                      <StartRegisterClient />
                    </div>
                  )}

                  <div className="text-xs sm:text-sm text-neutral-500">
                    Rejestracja jest darmowa. Po utworzeniu konta przejdziesz do
                    panelu, gdzie dodasz ceny usług.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="container-professional">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-neutral-900 mb-4">
              Dlaczego warto dołączyć?
            </h2>
            <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
              Odkryj wszystkie korzyści z członkostwa w największej platformie
              dla profesjonalistów manicure
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center animate-fade-in animation-delay-200">
              <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaGem className="text-2xl text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold text-neutral-900 mb-3">
                Więcej klientów
              </h3>
              <p className="text-neutral-600">
                Pokaż swoje prace w galerii i przyciągnij nowych klientów dzięki
                profesjonalnemu profilowi
              </p>
            </div>

            <div className="text-center animate-fade-in animation-delay-400">
              <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaCheck className="text-2xl text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold text-neutral-900 mb-3">
                Automatyczne rezerwacje
              </h3>
              <p className="text-neutral-600">
                System rezerwacji online ułatwi zarządzanie terminami i
                oszczędzi Ci czas
              </p>
            </div>

            <div className="text-center animate-fade-in animation-delay-600">
              <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaStar className="text-2xl text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold text-neutral-900 mb-3">
                Buduj reputację
              </h3>
              <p className="text-neutral-600">
                Zbieraj pozytywne opinie i buduj zaufanie wśród klientów w
                swojej okolicy
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof Section */}
      <section className="py-16 sm:py-20 bg-neutral-50">
        <div className="container-professional">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-neutral-900 mb-4">
              Dołącz do setek zadowolonych profesjonalistek
            </h2>
            <p className="text-lg text-neutral-600">
              Zobacz, co mówią o nas nasze członkinie
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mr-4">
                  <FaStar className="text-primary-600" />
                </div>
                <div>
                  <div className="font-semibold text-neutral-900">Anna K.</div>
                  <div className="text-sm text-neutral-600">
                    Salon w Warszawie
                  </div>
                </div>
              </div>
              <p className="text-neutral-700 italic">
                &ldquo;Od kiedy dołączyłam do platformy, liczba moich klientów
                wzrosła o 150%. System rezerwacji online to game changer!&rdquo;
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-lg">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mr-4">
                  <FaStar className="text-primary-600" />
                </div>
                <div>
                  <div className="font-semibold text-neutral-900">Maja S.</div>
                  <div className="text-sm text-neutral-600">
                    Freelancer, Kraków
                  </div>
                </div>
              </div>
              <p className="text-neutral-700 italic">
                &ldquo;Profesjonalny profil pomógł mi wyróżnić się na rynku.
                Teraz klienci sami do mnie przychodzą!&rdquo;
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section – registration focused */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-600 to-accent-600 py-16 sm:py-20">
        <div className="pointer-events-none absolute -top-24 -right-16 w-80 h-80 bg-white/15 rounded-full blur-3xl" />
        <div className="pointer-events-none absolute -bottom-20 -left-10 w-96 h-96 bg-white/10 rounded-full blur-3xl" />

        <div className="relative z-10 container-professional text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-6">
              Rozpocznij w kilka minut
            </h2>
            <p className="text-lg text-white/95 mb-8 leading-relaxed">
              Załóż darmowe konto i opublikuj swój cennik usług manicure. To
              szybkie i bezpłatne.
            </p>

            {status !== "used" && (
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 mb-8 border border-white/20">
                <div className="text-white/90 text-sm mb-4">
                  Załóż darmowe konto:
                </div>
                <StartRegisterClient />
              </div>
            )}

            <div className="text-white/85 text-sm">
              <div className="flex items-center justify-center gap-4 flex-wrap">
                <span className="flex items-center gap-2">
                  <FaCheck className="text-green-300" />
                  Rejestracja za darmo
                </span>
                <span className="flex items-center gap-2">
                  <FaCheck className="text-green-300" />
                  Dodaj usługi i ceny w panelu
                </span>
                <span className="flex items-center gap-2">
                  <FaCheck className="text-green-300" />
                  Wsparcie 24/7
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const data = await getInviteData(id);
  const name = data?.invite?.name?.trim();
  const baseUrl = process.env.NEXT_PUBLIC_URL || "https://naily.pl";
  const url = `${baseUrl}/invite/${id}`;
  const title = name
    ? `Zaproszenie dla ${name} – Naily`
    : "Zaproszenie – Naily";
  const description = name
    ? `Specjalne zaproszenie dla ${name}. Załóż darmowy profil i stwórz cennik manicure w Naily.`
    : "Zaproszenie do Naily. Załóż darmowy profil i stwórz cennik manicure.";

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}
