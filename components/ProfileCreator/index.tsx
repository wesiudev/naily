"use client";
import { useMemo, useState, useEffect, useRef, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, addDocument, grantFreePremium } from "@/firebase";
import { toast } from "react-toastify";
import { errorCatcher } from "@/utils/errorCatcher";
import type { SimpleLocation } from "@/components/User/ProfileConfig/AccountLocation/MapInput";
import { createLinkFromText } from "@/utils/createLinkFromText";
import type { IService } from "@/types";
// Image upload helpers removed for now; reintroduce when needed

type StepId = 0 | 1 | 2 | 3 | 4 | 5;

const containerVariants = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
};

export default function ProfileCreator() {
  const router = useRouter();
  const [step, setStep] = useState<StepId>(0);
  const [loading, setLoading] = useState(false);

  const [accountType, setAccountType] = useState<"salon" | "individual">(
    "salon"
  );
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState<SimpleLocation | null>(null);
  const [profileImageUrl, _setProfileImageUrl] = useState<string | null>(null);
  const [serviceDrafts, setServiceDrafts] = useState<ServiceDraft[]>([]);
  const [trainingType, setTrainingType] = useState<"manicure" | "pedicure" | "both" | "none" | undefined>(undefined);

  // Persistent validation state across steps
  const [attemptedBasics, setAttemptedBasics] = useState<boolean>(false);
  const [basicsErrors, setBasicsErrors] = useState<{
    name?: string;
    email?: string;
    phone?: string;
    password?: string;
    repeatPassword?: string;
    acceptRules?: string;
  }>({});
  const [attemptedLocation, setAttemptedLocation] = useState<boolean>(false);
  const [locationError, setLocationError] = useState<string>("");

  const steps = useMemo(
    () => [
      {
        title: "Rodzaj profilu",
        next: "Podstawowe dane",
        description: "Wybierz czy zakładasz profil jako salon czy stylistka.",
      },
      {
        title: "Podstawowe dane",
        next: "Szkolenia",
        description: "Imię i nazwisko / nazwa salonu, kontakt.",
      },
      {
        title: "Szkolenia",
        next: "Lokalizacja",
        description: "Czy prowadzisz szkolenia manicure lub pedicure?",
      },
      {
        title: "Lokalizacja",
        next: "Prezentacja profilu",
        description: "Wybierz miasto.",
      },
      {
        title: "Prezentacja profilu",
        next: "Usługi i konfiguracja",
        description: "Krótki opis profilu.",
      },
      {
        title: "Usługi i konfiguracja",
        next: "Gotowe!",
        description:
          "Wybierz usługi. Skorzystaj z generatora by zacząć szybciej.",
      },
    ],
    []
  );

  const progress = ((step + 1) / steps.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
          {/* Progress Bar */}
          <div className="h-2 bg-gray-100">
            <motion.div
              className="h-full bg-gradient-to-r from-blue-500 to-purple-600"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>

          <div className="p-6 sm:p-8 lg:p-12">
            {/* Step Header */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 font-poppins">
                  {steps[step]?.title}
                </h2>
                <span className="text-sm font-medium text-gray-500 font-poppins">
                  Krok {step + 1} z {steps.length}
                </span>
              </div>
              <p className="text-gray-600 text-sm sm:text-base">
                {steps[step]?.description}
              </p>
            </div>

            {/* Step Content */}
            <div className="min-h-[400px]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={step}
                  variants={containerVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  transition={{ duration: 0.2 }}
                >
                  {step === 0 && (
                    <StepAccountType
                      value={accountType}
                      onChange={setAccountType}
                      onNext={() => setStep(1)}
                    />
                  )}
                  {step === 1 && (
                    <StepBasics
                      name={name}
                      setName={setName}
                      email={email}
                      setEmail={setEmail}
                      phone={phone}
                      setPhone={setPhone}
                      password={password}
                      setPassword={setPassword}
                      repeatPassword={repeatPassword}
                      setRepeatPassword={setRepeatPassword}
                      attempted={attemptedBasics}
                      setAttempted={setAttemptedBasics}
                      errors={basicsErrors}
                      setErrors={setBasicsErrors}
                      onBack={() => setStep(0)}
                      onNext={() => setStep(2)}
                    />
                  )}
                  {step === 2 && (
                    <StepTraining
                      value={trainingType}
                      onChange={setTrainingType}
                      onBack={() => setStep(1)}
                      onNext={() => setStep(3)}
                    />
                  )}
                  {step === 3 && (
                    <StepLocation
                      value={location}
                      onChange={setLocation}
                      attempted={attemptedLocation}
                      setAttempted={setAttemptedLocation}
                      error={locationError}
                      setError={setLocationError}
                      onBack={() => setStep(2)}
                      onNext={() => setStep(4)}
                    />
                  )}
                  {step === 4 && (
                    <StepPresentation
                      description={description}
                      setDescription={setDescription}
                      onBack={() => setStep(3)}
                      onNext={() => setStep(5)}
                    />
                  )}
                  {step === 5 && (
                    <StepServices
                      services={serviceDrafts}
                      setServices={setServiceDrafts}
                      onBack={() => setStep(4)}
                      onCreate={async (services) => {
                        // Cross-step validation before create
                        const nextBasicsErrors: typeof basicsErrors = {};
                        if (!name?.trim())
                          nextBasicsErrors.name = "To pole jest wymagane.";
                        const emailOk =
                          /^(?:[a-zA-Z0-9_'^&.+-])+@(?:[a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}$/.test(
                            (email || "").trim()
                          );
                        if (!email?.trim())
                          nextBasicsErrors.email = "To pole jest wymagane.";
                        else if (!emailOk)
                          nextBasicsErrors.email =
                            "Podaj poprawny adres email.";
                        const phoneDigits = (phone || "").replace(/\D/g, "");
                        if (
                          !(phoneDigits.length >= 9 && phoneDigits.length <= 15)
                        )
                          nextBasicsErrors.phone =
                            "Podaj poprawny numer telefonu.";
                        if ((password || "").length < 8)
                          nextBasicsErrors.password =
                            "Hasło powinno mieć minimum 8 znaków";
                        if ((password || "") !== (repeatPassword || ""))
                          nextBasicsErrors.repeatPassword =
                            "Hasła nie są takie same.";

                        const nextLocationError = location?.address
                          ? ""
                          : "Wybierz miasto.";

                        // If any errors, persist and jump to first invalid step
                        if (
                          Object.keys(nextBasicsErrors).length > 0 ||
                          nextLocationError
                        ) {
                          setBasicsErrors(nextBasicsErrors);
                          setAttemptedBasics(true);
                          setLocationError(nextLocationError);
                          setAttemptedLocation(!!nextLocationError);
                          const earliestStep =
                            Object.keys(nextBasicsErrors).length > 0 ? 1 : 3;
                          setStep(earliestStep);
                          toast.error("Prosimy poprawić błędy w formularzu");
                          return;
                        }
                        setLoading(true);
                        const id = toast.loading("Tworzę konto...");
                        try {
                          const cred = await createUserWithEmailAndPassword(
                            auth,
                            email,
                            password
                          );
                          // Ensure ID token is minted and attached to Firestore requests before writing
                          await cred.user.getIdToken(true);
                          const uid = cred?.user?.uid as string;
                          await addDocument("users", uid, {
                            uid,
                            name,
                            email,
                            description,
                            photoURL: profileImageUrl || "",
                            phoneNumber: phone,
                            seek: accountType === "individual",
                            emailVerified: false,
                            configured: false,
                            active: false,
                            profileComments: [],
                            services,
                            location: {
                              lng: location?.lng ?? 21.0122287,
                              lat: location?.lat ?? 52.2296756,
                              address: location?.address ?? "",
                            },
                            password: "",
                            trainingType: trainingType || "none",
                          });

                          // Grant 30-day free premium for new users
                          try {
                            await grantFreePremium(uid);
                          } catch (premiumError) {
                            console.error("Error granting free premium:", premiumError);
                            // Continue even if premium grant fails
                          }

                          toast.update(id, {
                            render: "Konto utworzone pomyślnie!",
                            type: "success",
                            isLoading: false,
                            autoClose: 2000,
                          });
                          router.push("/dashboard");
                        } catch (err) {
                          toast.update(id, {
                            render: errorCatcher(err as unknown as Error),
                            type: "error",
                            isLoading: false,
                            autoClose: 3000,
                          });
                        } finally {
                          setLoading(false);
                        }
                      }}
                    />
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StepAccountType({
  value,
  onChange,
  onNext,
}: {
  value: "salon" | "individual";
  onChange: (_v: "salon" | "individual") => void;
  onNext: () => void;
}) {
  return (
    <div>
      <div className="space-y-4">
        {[
          {
            id: "salon" as const,
            title: "Salon",
            description: "Zakładam profil dla salonu",
          },
          {
            id: "individual" as const,
            title: "Stylistka",
            description: "Zakładam profil jako stylistka",
          },
        ].map((option) => (
          <motion.button
            key={option.id}
            onClick={() => onChange(option.id)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`relative w-full border-2 rounded-lg p-4 text-left transition-all duration-300 group ${
              value === option.id
                ? "border-blue-500 bg-blue-50/50 shadow-md"
                : "border-gray-200 hover:border-blue-300 hover:bg-gray-50"
            }`}
          >
            <span className="font-semibold text-gray-800 block mb-1">
              {option.title}
            </span>
            <span className="text-sm text-gray-600">{option.description}</span>
            {value === option.id && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute top-3 right-3 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center"
              >
                <svg
                  className="w-3 h-3 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={3}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </motion.div>
            )}
          </motion.button>
        ))}
      </div>
      <div className="mt-8 flex justify-end">
        <motion.button
          disabled={!value}
          onClick={onNext}
          whileHover={value ? { scale: 1.05 } : {}}
          whileTap={value ? { scale: 0.95 } : {}}
          className="px-6 py-3 rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 disabled:cursor-not-allowed font-poppins font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
        >
          Dalej
        </motion.button>
      </div>
    </div>
  );
}

function StepBasics({
  name,
  setName,
  email,
  setEmail,
  phone,
  setPhone,
  password,
  setPassword,
  repeatPassword,
  setRepeatPassword,
  attempted,
  setAttempted,
  errors,
  setErrors,
  onBack,
  onNext,
}: {
  name: string;
  setName: (_v: string) => void;
  email: string;
  setEmail: (_v: string) => void;
  phone: string;
  setPhone: (_v: string) => void;
  password: string;
  setPassword: (_v: string) => void;
  repeatPassword: string;
  setRepeatPassword: (_v: string) => void;
  attempted: boolean;
  setAttempted: (_v: boolean) => void;
  errors: {
    name?: string;
    email?: string;
    phone?: string;
    password?: string;
    repeatPassword?: string;
    acceptRules?: string;
  };
  setErrors: (_v: {
    name?: string;
    email?: string;
    phone?: string;
    password?: string;
    repeatPassword?: string;
    acceptRules?: string;
  }) => void;
  onBack: () => void;
  onNext: () => void;
}) {
  const validate = useCallback(() => {
    const newErrors: typeof errors = {};
    if (!name?.trim()) newErrors.name = "To pole jest wymagane.";
    const emailOk =
      /^(?:[a-zA-Z0-9_'^&.+-])+@(?:[a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}$/.test(
        (email || "").trim()
      );
    if (!email?.trim()) newErrors.email = "To pole jest wymagane.";
    else if (!emailOk) newErrors.email = "Podaj poprawny adres email.";
    const phoneDigits = (phone || "").replace(/\D/g, "");
    if (!(phoneDigits.length >= 9 && phoneDigits.length <= 15))
      newErrors.phone = "Podaj poprawny numer telefonu.";
    if ((password || "").length < 8)
      newErrors.password = "Hasło powinno mieć minimum 8 znaków";
    if ((password || "") !== (repeatPassword || ""))
      newErrors.repeatPassword = "Hasła nie są takie same.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [name, email, phone, password, repeatPassword, setErrors]);

  const handleNext = () => {
    setAttempted(true);
    if (validate()) {
      onNext();
    }
  };

  return (
    <div>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-semibold font-poppins mb-2 text-gray-700">
            Imię i nazwisko / Nazwa salonu
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={`w-full rounded-lg border-2 px-4 py-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
              attempted && errors.name
                ? "border-red-500"
                : "border-gray-300 focus:border-blue-500"
            }`}
            placeholder="Wprowadź imię i nazwisko lub nazwę salonu"
          />
          {attempted && errors.name && (
            <p className="mt-1 text-sm text-red-600">{errors.name}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-semibold font-poppins mb-2 text-gray-700">
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={`w-full rounded-lg border-2 px-4 py-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
              attempted && errors.email
                ? "border-red-500"
                : "border-gray-300 focus:border-blue-500"
            }`}
            placeholder="twoj@email.pl"
          />
          {attempted && errors.email && (
            <p className="mt-1 text-sm text-red-600">{errors.email}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-semibold font-poppins mb-2 text-gray-700">
            Numer telefonu
          </label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className={`w-full rounded-lg border-2 px-4 py-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
              attempted && errors.phone
                ? "border-red-500"
                : "border-gray-300 focus:border-blue-500"
            }`}
            placeholder="+48 123 456 789"
          />
          {attempted && errors.phone && (
            <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-semibold font-poppins mb-2 text-gray-700">
            Hasło
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={`w-full rounded-lg border-2 px-4 py-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
              attempted && errors.password
                ? "border-red-500"
                : "border-gray-300 focus:border-blue-500"
            }`}
            placeholder="Minimum 8 znaków"
          />
          {attempted && errors.password && (
            <p className="mt-1 text-sm text-red-600">{errors.password}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-semibold font-poppins mb-2 text-gray-700">
            Powtórz hasło
          </label>
          <input
            type="password"
            value={repeatPassword}
            onChange={(e) => setRepeatPassword(e.target.value)}
            className={`w-full rounded-lg border-2 px-4 py-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
              attempted && errors.repeatPassword
                ? "border-red-500"
                : "border-gray-300 focus:border-blue-500"
            }`}
            placeholder="Powtórz hasło"
          />
          {attempted && errors.repeatPassword && (
            <p className="mt-1 text-sm text-red-600">{errors.repeatPassword}</p>
          )}
        </div>
      </div>
      <div className="mt-8 flex flex-col sm:flex-row justify-between gap-4">
        <motion.button
          onClick={onBack}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="px-6 py-3 rounded-lg border-2 border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 font-poppins font-semibold transition-all duration-200 shadow-sm hover:shadow-md"
        >
          Wstecz
        </motion.button>
        <motion.button
          onClick={handleNext}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="px-6 py-3 rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 font-poppins font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
        >
          Dalej
        </motion.button>
      </div>
    </div>
  );
}

type TrainingType = "manicure" | "pedicure" | "both" | "none";

function StepTraining({
  value,
  onChange,
  onBack,
  onNext,
}: {
  value: TrainingType | undefined;
  onChange: (_v: TrainingType) => void;
  onBack: () => void;
  onNext: () => void;
}) {
  return (
    <div>
      <label className="block text-sm font-semibold font-poppins mb-3 text-gray-700">
        Czy prowadzisz szkolenia manicure lub pedicure?
      </label>
      <div className="space-y-3">
        {[
          { id: "manicure", label: "Prowadzę szkolenia manicure." },
          { id: "pedicure", label: "Prowadzę szkolenia pedicure." },
          { id: "both", label: "Prowadzę szkolenia manicure oraz pedicure." },
          { id: "none", label: "Nie prowadzę szkoleń." },
        ].map((option) => (
          <motion.button
            key={option.id}
            onClick={() => onChange(option.id as TrainingType)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`relative w-full border-2 rounded-lg p-4 text-left transition-all duration-300 group ${
              value === option.id
                ? "border-blue-500 bg-blue-50/50 shadow-md"
                : "border-gray-200 hover:border-blue-300 hover:bg-gray-50"
            }`}
          >
            <span className="font-medium text-gray-800">{option.label}</span>
            {value === option.id && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute top-3 right-3 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center"
              >
                <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </motion.div>
            )}
          </motion.button>
        ))}
      </div>
      <div className="mt-8 flex flex-col sm:flex-row justify-between gap-4">
        <motion.button
          onClick={onBack}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="px-6 py-3 rounded-lg border-2 border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 font-poppins font-semibold transition-all duration-200 shadow-sm hover:shadow-md"
        >
          Wstecz
        </motion.button>
        <motion.button
          disabled={!value}
          onClick={onNext}
          whileHover={value ? { scale: 1.05 } : {}}
          whileTap={value ? { scale: 0.95 } : {}}
          className="px-6 py-3 rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 disabled:cursor-not-allowed font-poppins font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
        >
          Dalej
        </motion.button>
      </div>
    </div>
  );
}

function StepLocation({
  value,
  onChange,
  attempted,
  setAttempted,
  error,
  setError,
  onBack,
  onNext,
}: {
  value: SimpleLocation | null;
  onChange: (_v: SimpleLocation | null) => void;
  attempted: boolean;
  setAttempted: (_v: boolean) => void;
  error: string;
  setError: (_v: string) => void;
  onBack: () => void;
  onNext: () => void;
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState<
    Array<{ address: string; lat: number; lng: number }>
  >([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (value?.address) {
      setSearchQuery(value.address);
    }
  }, [value]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    if (query.length < 3) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          query + ", Polska"
        )}&limit=5&addressdetails=1`
      );
      const data = await response.json();
      const formatted = data.map((item: any) => ({
        address: item.display_name,
        lat: parseFloat(item.lat),
        lng: parseFloat(item.lon),
      }));
      setSuggestions(formatted);
      setShowSuggestions(true);
    } catch (err) {
      console.error("Search error:", err);
      setSuggestions([]);
    }
  };

  const handleSelect = (suggestion: {
    address: string;
    lat: number;
    lng: number;
  }) => {
    onChange({
      address: suggestion.address,
      lat: suggestion.lat,
      lng: suggestion.lng,
    });
    setSearchQuery(suggestion.address);
    setShowSuggestions(false);
    setError("");
  };

  const validate = () => {
    if (!value?.address) {
      setError("Wybierz miasto.");
      setAttempted(true);
      return false;
    }
    setError("");
    return true;
  };

  const handleNext = () => {
    if (validate()) {
      onNext();
    }
  };

  return (
    <div>
      <div className="relative">
        <label className="block text-sm font-semibold font-poppins mb-2 text-gray-700">
          Lokalizacja
        </label>
        <input
          ref={inputRef}
          type="text"
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
          onFocus={() => {
            if (suggestions.length > 0) setShowSuggestions(true);
          }}
          className={`w-full rounded-lg border-2 px-4 py-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
            attempted && error
              ? "border-red-500"
              : "border-gray-300 focus:border-blue-500"
          }`}
          placeholder="Wpisz miasto..."
        />
        {attempted && error && (
          <p className="mt-1 text-sm text-red-600">{error}</p>
        )}

        {showSuggestions && suggestions.length > 0 && (
          <div
            ref={suggestionsRef}
            className="absolute z-10 w-full mt-1 bg-white border-2 border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto"
          >
            {suggestions.map((suggestion, idx) => (
              <button
                key={idx}
                onClick={() => handleSelect(suggestion)}
                className="w-full text-left px-4 py-3 hover:bg-blue-50 transition-colors text-gray-800"
              >
                {suggestion.address}
              </button>
            ))}
          </div>
        )}
      </div>
      <div className="mt-8 flex flex-col sm:flex-row justify-between gap-4">
        <motion.button
          onClick={onBack}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="px-6 py-3 rounded-lg border-2 border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 font-poppins font-semibold transition-all duration-200 shadow-sm hover:shadow-md"
        >
          Wstecz
        </motion.button>
        <motion.button
          onClick={handleNext}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="px-6 py-3 rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 font-poppins font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
        >
          Dalej
        </motion.button>
      </div>
    </div>
  );
}

function StepPresentation({
  description,
  setDescription,
  onBack,
  onNext,
}: {
  description: string;
  setDescription: (_v: string) => void;
  onBack: () => void;
  onNext: () => void;
}) {
  return (
    <div>
      <div>
        <label className="block text-sm font-semibold font-poppins mb-2 text-gray-700">
          Opis profilu
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full rounded-lg border-2 border-gray-300 px-4 py-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all min-h-[120px] resize-y"
          placeholder="Napisz krótki opis swojego profilu..."
        />
      </div>
      <div className="mt-8 flex flex-col sm:flex-row justify-between gap-4">
        <motion.button
          onClick={onBack}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="px-6 py-3 rounded-lg border-2 border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 font-poppins font-semibold transition-all duration-200 shadow-sm hover:shadow-md"
        >
          Wstecz
        </motion.button>
        <motion.button
          onClick={onNext}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="px-6 py-3 rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 font-poppins font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
        >
          Dalej
        </motion.button>
      </div>
    </div>
  );
}

type ServiceDraft = {
  real_name: string;
  flatten_name: string;
  description: string;
  price: number;
  duration: number;
  isCustomService: boolean;
};

function StepServices({
  services,
  setServices,
  onBack,
  onCreate,
}: {
  services: ServiceDraft[];
  setServices: (_v: ServiceDraft[]) => void;
  onBack: () => void;
  onCreate: (_services: IService[]) => Promise<void> | void;
}) {
  const [loading, setLoading] = useState(false);
  const [generatingIndex, setGeneratingIndex] = useState<number | null>(null);

  const addService = () => {
    setServices([
      ...services,
      {
        real_name: "",
        flatten_name: "",
        description: "",
        price: 0,
        duration: 0,
        isCustomService: true,
      },
    ]);
  };

  const removeService = (index: number) => {
    setServices(services.filter((_, i) => i !== index));
  };

  const updateService = (
    index: number,
    updates: Partial<ServiceDraft>
  ) => {
    const newServices = [...services];
    newServices[index] = { ...newServices[index], ...updates };
    setServices(newServices);
  };

  const generateService = async (index: number) => {
    const service = services[index];
    const serviceName = service?.real_name?.trim();
    if (!service || !serviceName) {
      toast.error("Najpierw wprowadź nazwę usługi");
      return;
    }

    setGeneratingIndex(index);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_URL || ""}/api/services/generate`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: serviceName }),
        }
      );

      if (!res.ok) throw new Error("Generation failed");

      const responseData = await res.json();
      const data = responseData.response || responseData;

      const generatedName = String(data.name ?? serviceName);
      const flattenName = generatedName
        .toLowerCase()
        .replace(/[^a-z0-9]/g, "_")
        .replace(/_+/g, "_")
        .replace(/^_|_$/g, "");

      const priceValue =
        typeof data.price === "number"
          ? data.price
          : typeof data.price === "string"
            ? parseFloat(data.price) || 0
            : 0;

      const durationValue =
        typeof data.duration === "number"
          ? data.duration
          : typeof data.duration === "string"
            ? parseInt(data.duration) || 0
            : 0;

      const descriptionValue = String(data.description ?? "");

      updateService(index, {
        real_name: generatedName,
        description: descriptionValue,
        price: priceValue,
        duration: durationValue,
        flatten_name: flattenName,
      });

      toast.success("Usługa wygenerowana pomyślnie");
    } catch (error) {
      toast.error("Nie udało się wygenerować usługi");
      console.error(error);
    } finally {
      setGeneratingIndex(null);
    }
  };

  const handleCreate = async () => {
    const validServices = services.filter(
      (s) => s.real_name?.trim() && s.price > 0 && s.duration > 0
    );

    if (validServices.length === 0) {
      toast.error("Dodaj przynajmniej jedną usługę");
      return;
    }

    setLoading(true);
    try {
      const formattedServices: IService[] = validServices.map((s) => ({
        real_name: s.real_name,
        flatten_name: s.flatten_name || createLinkFromText(s.real_name),
        description: s.description,
        price: s.price,
        duration: s.duration,
        isCustomService: s.isCustomService,
      }));

      await onCreate(formattedServices);
    } catch (error) {
      console.error("Error creating services:", error);
      toast.error("Wystąpił błąd podczas tworzenia usług");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="space-y-4">
        {services.map((service, index) => (
          <div
            key={index}
            className="border-2 border-gray-200 rounded-lg p-4 space-y-3"
          >
            <div className="flex items-start justify-between">
              <h3 className="font-semibold text-gray-800">
                Usługa {index + 1}
              </h3>
              {services.length > 1 && (
                <button
                  onClick={() => removeService(index)}
                  className="text-red-600 hover:text-red-700 text-sm font-medium"
                >
                  Usuń
                </button>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nazwa usługi
              </label>
              <input
                type="text"
                value={service.real_name}
                onChange={(e) =>
                  updateService(index, {
                    real_name: e.target.value,
                    flatten_name: createLinkFromText(e.target.value),
                  })
                }
                className="w-full rounded-lg border-2 border-gray-300 px-4 py-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="np. Manicure klasyczny"
              />
            </div>

            <div className="flex gap-3">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Cena (zł)
                </label>
                <input
                  type="number"
                  value={service.price || ""}
                  onChange={(e) =>
                    updateService(index, {
                      price: parseFloat(e.target.value) || 0,
                    })
                  }
                  className="w-full rounded-lg border-2 border-gray-300 px-4 py-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="0"
                  min="0"
                  step="0.01"
                />
              </div>

              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Czas trwania (min)
                </label>
                <input
                  type="number"
                  value={service.duration || ""}
                  onChange={(e) =>
                    updateService(index, {
                      duration: parseInt(e.target.value) || 0,
                    })
                  }
                  className="w-full rounded-lg border-2 border-gray-300 px-4 py-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="0"
                  min="0"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Opis
              </label>
              <textarea
                value={service.description}
                onChange={(e) =>
                  updateService(index, { description: e.target.value })
                }
                className="w-full rounded-lg border-2 border-gray-300 px-4 py-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[80px] resize-y"
                placeholder="Opis usługi..."
              />
            </div>

            <button
              onClick={() => generateService(index)}
              disabled={!service.real_name?.trim() || generatingIndex === index}
              className="w-full px-4 py-2 bg-purple-100 hover:bg-purple-200 text-purple-700 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {generatingIndex === index
                ? "Generuję..."
                : "🎨 Wygeneruj opis, cenę i czas trwania"}
            </button>
          </div>
        ))}

        <button
          onClick={addService}
          className="w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-blue-500 hover:text-blue-600 transition-colors font-medium"
        >
          + Dodaj usługę
        </button>
      </div>

      <div className="mt-8 flex flex-col sm:flex-row justify-between gap-4">
        <motion.button
          onClick={onBack}
          disabled={loading}
          whileHover={!loading ? { scale: 1.02 } : {}}
          whileTap={!loading ? { scale: 0.98 } : {}}
          className="px-6 py-3 rounded-lg border-2 border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 disabled:opacity-50 disabled:cursor-not-allowed font-poppins font-semibold transition-all duration-200 shadow-sm hover:shadow-md"
        >
          Wstecz
        </motion.button>
        <motion.button
          disabled={loading}
          onClick={handleCreate}
          whileHover={!loading ? { scale: 1.05 } : {}}
          whileTap={!loading ? { scale: 0.95 } : {}}
          className="px-6 py-3 rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 disabled:cursor-not-allowed font-poppins font-semibold shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <motion.svg
                className="w-5 h-5"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                fill="none"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeDasharray="60"
                  strokeDashoffset="45"
                  opacity="0.9"
                />
              </motion.svg>
              <span>Tworzę...</span>
            </>
          ) : (
            <>
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              <span>Zakończ i utwórz konto</span>
            </>
          )}
        </motion.button>
      </div>
    </div>
  );
}
