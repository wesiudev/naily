"use client";
import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  FaRocket,
  FaUsers,
  FaDollarSign,
  FaCheckCircle,
  FaArrowRight,
  FaStar,
  FaHeart,
  FaGem,
  FaCrown,
  FaShieldAlt,
  FaClock,
  FaChartLine,
} from "react-icons/fa";
import { toast } from "react-toastify";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../../firebase";
import { setUser } from "../../../redux/slices/user";

// Subscription flow steps
const SUBSCRIPTION_STEPS = {
  WELCOME: "welcome",
  GOALS: "goals",
  EXPERIENCE: "experience",
  SERVICES: "services",
  EARNINGS: "earnings",
  FEATURES: "features",
  PRICING: "pricing",
  SUBSCRIBE: "subscribe",
};

// Goals options
const GOALS_OPTIONS = [
  {
    id: "clients",
    label: "Zwiększyć liczbę klientów",
    icon: FaUsers,
    color: "bg-primary-100 text-primary-600",
  },
  {
    id: "income",
    label: "Zwiększyć przychody",
    icon: FaDollarSign,
    color: "bg-success-100 text-success-600",
  },
  {
    id: "visibility",
    label: "Zwiększyć widoczność",
    icon: FaStar,
    color: "bg-warning-100 text-warning-600",
  },
  {
    id: "automation",
    label: "Automatyzować rezerwacje",
    icon: FaRocket,
    color: "bg-accent-100 text-accent-600",
  },
];

// Experience levels
const EXPERIENCE_LEVELS = [
  {
    id: "beginner",
    label: "Dopiero zaczynam",
    description: "Mniej niż 1 rok doświadczenia",
    icon: FaHeart,
  },
  {
    id: "intermediate",
    label: "Mam doświadczenie",
    description: "1-3 lata doświadczenia",
    icon: FaGem,
  },
  {
    id: "expert",
    label: "Jestem ekspertem",
    description: "Ponad 3 lata doświadczenia",
    icon: FaCrown,
  },
];

// Service categories
const SERVICE_CATEGORIES = [
  { id: "manicure", label: "Manicure", icon: "💅" },
  { id: "pedicure", label: "Pedicure", icon: "🦶" },
  { id: "nail-art", label: "Nail Art", icon: "🎨" },
  { id: "extensions", label: "Przedłużanie", icon: "✨" },
  { id: "treatments", label: "Zabiegi pielęgnacyjne", icon: "🧴" },
];

// Earnings projections
const EARNINGS_PROJECTIONS = [
  {
    clients: "5-10",
    earnings: "500-1000 zł",
    color: "bg-success-50 border-success-200",
  },
  {
    clients: "10-20",
    earnings: "1000-2000 zł",
    color: "bg-primary-50 border-primary-200",
  },
  {
    clients: "20+",
    earnings: "2000+ zł",
    color: "bg-warning-50 border-warning-200",
  },
];

// Premium features
const PREMIUM_FEATURES = [
  {
    icon: FaUsers,
    title: "Nieograniczona liczba klientów",
    description: "Pozyskuj nowych klientów bez limitów",
  },
  {
    icon: FaRocket,
    title: "Automatyczne rezerwacje",
    description: "System rezerwacji 24/7",
  },
  {
    icon: FaStar,
    title: "Wyróżnienie w wynikach",
    description: "Pokaż się na górze listy",
  },
  {
    icon: FaShieldAlt,
    title: "Weryfikacja profilu",
    description: "Oznaczenie zweryfikowanego specjalisty",
  },
  {
    icon: FaChartLine,
    title: "Szczegółowe statystyki",
    description: "Analiza ruchu i zarobków",
  },
  {
    icon: FaClock,
    title: "Wsparcie 24/7",
    description: "Pomoc techniczna zawsze dostępna",
  },
];

export default function ServicePricing() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.user);

  // Subscription flow state
  const [currentStep, setCurrentStep] = useState(SUBSCRIPTION_STEPS.WELCOME);
  const [answers, setAnswers] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showAnimation, setShowAnimation] = useState(false);

  // Check if user is already subscribed
  const isSubscribed = user?.subscription?.active || false;

  // Handle step navigation
  const nextStep = () => {
    setShowAnimation(true);
    setTimeout(() => {
      setCurrentStep(getNextStep(currentStep));
      setShowAnimation(false);
    }, 300);
  };

  const prevStep = () => {
    setShowAnimation(true);
    setTimeout(() => {
      setCurrentStep(getPrevStep(currentStep));
      setShowAnimation(false);
    }, 300);
  };

  const getNextStep = (current) => {
    const steps = Object.values(SUBSCRIPTION_STEPS);
    const currentIndex = steps.indexOf(current);
    return steps[currentIndex + 1] || steps[0];
  };

  const getPrevStep = (current) => {
    const steps = Object.values(SUBSCRIPTION_STEPS);
    const currentIndex = steps.indexOf(current);
    return steps[currentIndex - 1] || steps[0];
  };

  // Handle answer selection
  const handleAnswer = (question, answer) => {
    setAnswers((prev) => ({ ...prev, [question]: answer }));
  };

  // Handle subscription
  const handleSubscribe = async () => {
    setIsLoading(true);
    try {
      // Simulate subscription process
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Update user subscription status
      await updateDoc(doc(db, "users", user.uid), {
        subscription: {
          active: true,
          plan: "premium",
          price: 49.99,
          startDate: new Date().toISOString(),
          nextBilling: new Date(
            Date.now() + 30 * 24 * 60 * 60 * 1000
          ).toISOString(),
        },
      });

      dispatch(
        setUser({
          ...user,
          subscription: {
            active: true,
            plan: "premium",
            price: 49.99,
            startDate: new Date().toISOString(),
            nextBilling: new Date(
              Date.now() + 30 * 24 * 60 * 60 * 1000
            ).toISOString(),
          },
        })
      );

      toast.success(
        "Gratulacje! Twoja subskrypcja Premium została aktywowana!"
      );
      setCurrentStep(SUBSCRIPTION_STEPS.SUBSCRIBE);
    } catch (error) {
      console.error("Subscription error:", error);
      toast.error("Wystąpił błąd podczas aktywacji subskrypcji");
    } finally {
      setIsLoading(false);
    }
  };

  // If user is already subscribed, show success message
  if (isSubscribed) {
    return (
      <div className="professional-card p-6 text-center">
        <div className="w-16 h-16 bg-success-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <FaCheckCircle className="text-2xl text-success-600" />
        </div>
        <h2 className="text-xl font-semibold text-neutral-900 mb-2">
          Masz aktywną subskrypcję Premium!
        </h2>
        <p className="text-neutral-600 mb-4">
          Ciesz się wszystkimi funkcjami premium i zarabiaj więcej.
        </p>
        <div className="bg-success-50 rounded-md p-4">
          <p className="text-success-800 font-medium">
            Następne rozliczenie:{" "}
            {user?.subscription?.nextBilling
              ? new Date(user.subscription.nextBilling).toLocaleDateString(
                  "pl-PL"
                )
              : "N/A"}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[600px]">
      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-neutral-600">
            Krok {Object.values(SUBSCRIPTION_STEPS).indexOf(currentStep) + 1} z{" "}
            {Object.values(SUBSCRIPTION_STEPS).length}
          </span>
          <span className="text-xs text-neutral-600">
            {Math.round(
              ((Object.values(SUBSCRIPTION_STEPS).indexOf(currentStep) + 1) /
                Object.values(SUBSCRIPTION_STEPS).length) *
                100
            )}
            %
          </span>
        </div>
        <div className="w-full bg-neutral-200 rounded-full h-2">
          <div
            className="bg-primary-600 h-2 rounded-full transition-all duration-500 ease-out"
            style={{
              width: `${
                ((Object.values(SUBSCRIPTION_STEPS).indexOf(currentStep) + 1) /
                  Object.values(SUBSCRIPTION_STEPS).length) *
                100
              }%`,
            }}
          ></div>
        </div>
      </div>

      {/* Step Content */}
      <div
        className={`transition-all duration-300 ${
          showAnimation ? "opacity-0 scale-95" : "opacity-100 scale-100"
        }`}
      >
        {currentStep === SUBSCRIPTION_STEPS.WELCOME && (
          <WelcomeStep onNext={nextStep} />
        )}

        {currentStep === SUBSCRIPTION_STEPS.GOALS && (
          <GoalsStep
            answers={answers}
            onAnswer={handleAnswer}
            onNext={nextStep}
            onPrev={prevStep}
          />
        )}

        {currentStep === SUBSCRIPTION_STEPS.EXPERIENCE && (
          <ExperienceStep
            answers={answers}
            onAnswer={handleAnswer}
            onNext={nextStep}
            onPrev={prevStep}
          />
        )}

        {currentStep === SUBSCRIPTION_STEPS.SERVICES && (
          <ServicesStep
            answers={answers}
            onAnswer={handleAnswer}
            onNext={nextStep}
            onPrev={prevStep}
          />
        )}

        {currentStep === SUBSCRIPTION_STEPS.EARNINGS && (
          <EarningsStep answers={answers} onNext={nextStep} onPrev={prevStep} />
        )}

        {currentStep === SUBSCRIPTION_STEPS.FEATURES && (
          <FeaturesStep onNext={nextStep} onPrev={prevStep} />
        )}

        {currentStep === SUBSCRIPTION_STEPS.PRICING && (
          <PricingStep
            onSubscribe={handleSubscribe}
            isLoading={isLoading}
            onPrev={prevStep}
          />
        )}

        {currentStep === SUBSCRIPTION_STEPS.SUBSCRIBE && (
          <SubscribeSuccessStep />
        )}
      </div>
    </div>
  );
}

// Welcome Step Component
function WelcomeStep({ onNext }) {
  return (
    <div className="text-center space-y-6">
      <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <FaRocket className="text-3xl text-primary-600" />
      </div>

      <h1 className="text-2xl md:text-3xl font-semibold text-neutral-900">
        Rozpocznij swoją podróż do sukcesu!
      </h1>

      <p className="text-neutral-600 max-w-md mx-auto">
        W ciągu kilku minut pomożemy Ci skonfigurować idealny plan, który
        zwiększy Twoje zarobki i liczbę klientów.
      </p>

      <div className="flex items-center justify-center gap-4 text-sm text-neutral-500">
        <div className="flex items-center gap-2">
          <FaCheckCircle className="text-success-600" />
          <span>2 minuty</span>
        </div>
        <div className="flex items-center gap-2">
          <FaCheckCircle className="text-success-600" />
          <span>Bez zobowiązań</span>
        </div>
        <div className="flex items-center gap-2">
          <FaCheckCircle className="text-success-600" />
          <span>Gwarancja satysfakcji</span>
        </div>
      </div>

      <button
        onClick={onNext}
        className="professional-button group px-8 py-3 text-base font-semibold"
      >
        <span className="flex items-center gap-2">
          Rozpocznij
          <FaArrowRight className="transition-transform group-hover:translate-x-1" />
        </span>
      </button>
    </div>
  );
}

// Goals Step Component
function GoalsStep({ answers, onAnswer, onNext, onPrev }) {
  const selectedGoals = answers.goals || [];

  const handleGoalToggle = (goalId) => {
    const newGoals = selectedGoals.includes(goalId)
      ? selectedGoals.filter((id) => id !== goalId)
      : [...selectedGoals, goalId];
    onAnswer("goals", newGoals);
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-xl md:text-2xl font-semibold text-neutral-900 mb-2">
          Jakie są Twoje cele?
        </h2>
        <p className="text-neutral-600">
          Wybierz wszystkie, które Cię interesują
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {GOALS_OPTIONS.map((goal) => (
          <button
            key={goal.id}
            onClick={() => handleGoalToggle(goal.id)}
            className={`p-4 rounded-lg border-2 transition-all duration-200 text-left ${
              selectedGoals.includes(goal.id)
                ? "border-primary-500 bg-primary-50"
                : "border-neutral-200 hover:border-primary-300"
            }`}
          >
            <div className="flex items-center gap-3">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center ${goal.color}`}
              >
                <goal.icon className="text-lg" />
              </div>
              <span className="font-medium text-neutral-900">{goal.label}</span>
            </div>
          </button>
        ))}
      </div>

      <div className="flex justify-between pt-4">
        <button
          onClick={onPrev}
          className="px-6 py-2 text-neutral-600 hover:text-neutral-900 transition-colors"
        >
          Wstecz
        </button>
        <button
          onClick={onNext}
          disabled={selectedGoals.length === 0}
          className="professional-button px-6 py-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Dalej
        </button>
      </div>
    </div>
  );
}

// Experience Step Component
function ExperienceStep({ answers, onAnswer, onNext, onPrev }) {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-xl md:text-2xl font-semibold text-neutral-900 mb-2">
          Jakie masz doświadczenie?
        </h2>
        <p className="text-neutral-600">
          To pomoże nam dostosować plan do Twoich potrzeb
        </p>
      </div>

      <div className="space-y-4">
        {EXPERIENCE_LEVELS.map((level) => (
          <button
            key={level.id}
            onClick={() => onAnswer("experience", level.id)}
            className={`w-full p-4 rounded-lg border-2 transition-all duration-200 text-left ${
              answers.experience === level.id
                ? "border-primary-500 bg-primary-50"
                : "border-neutral-200 hover:border-primary-300"
            }`}
          >
            <div className="flex items-center gap-4">
              <level.icon className="text-2xl text-primary-600" />
              <div>
                <h3 className="font-semibold text-neutral-900">
                  {level.label}
                </h3>
                <p className="text-sm text-neutral-600">{level.description}</p>
              </div>
            </div>
          </button>
        ))}
      </div>

      <div className="flex justify-between pt-4">
        <button
          onClick={onPrev}
          className="px-6 py-2 text-neutral-600 hover:text-neutral-900 transition-colors"
        >
          Wstecz
        </button>
        <button
          onClick={onNext}
          disabled={!answers.experience}
          className="professional-button px-6 py-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Dalej
        </button>
      </div>
    </div>
  );
}

// Services Step Component
function ServicesStep({ answers, onAnswer, onNext, onPrev }) {
  const selectedServices = answers.services || [];

  const handleServiceToggle = (serviceId) => {
    const newServices = selectedServices.includes(serviceId)
      ? selectedServices.filter((id) => id !== serviceId)
      : [...selectedServices, serviceId];
    onAnswer("services", newServices);
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-xl md:text-2xl font-semibold text-neutral-900 mb-2">
          Jakie usługi oferujesz?
        </h2>
        <p className="text-neutral-600">Wybierz wszystkie, które wykonujesz</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {SERVICE_CATEGORIES.map((service) => (
          <button
            key={service.id}
            onClick={() => handleServiceToggle(service.id)}
            className={`p-4 rounded-lg border-2 transition-all duration-200 text-center ${
              selectedServices.includes(service.id)
                ? "border-primary-500 bg-primary-50"
                : "border-neutral-200 hover:border-primary-300"
            }`}
          >
            <div className="text-2xl mb-2">{service.icon}</div>
            <div className="font-medium text-neutral-900">{service.label}</div>
          </button>
        ))}
      </div>

      <div className="flex justify-between pt-4">
        <button
          onClick={onPrev}
          className="px-6 py-2 text-neutral-600 hover:text-neutral-900 transition-colors"
        >
          Wstecz
        </button>
        <button
          onClick={onNext}
          disabled={selectedServices.length === 0}
          className="professional-button px-6 py-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Dalej
        </button>
      </div>
    </div>
  );
}

// Earnings Step Component
function EarningsStep({ answers, onNext, onPrev }) {
  const projectedEarnings = EARNINGS_PROJECTIONS[1]; // Default to middle tier

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-xl md:text-2xl font-semibold text-neutral-900 mb-2">
          Sprawdź swój potencjał zarobkowy!
        </h2>
        <p className="text-neutral-600">
          Na podstawie Twoich odpowiedzi, oto co możesz osiągnąć
        </p>
      </div>

      <div className="bg-gradient-to-r from-primary-50 to-accent-50 rounded-lg p-6 border border-primary-200">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto">
            <FaChartLine className="text-2xl text-primary-600" />
          </div>

          <h3 className="text-lg font-semibold text-neutral-900">
            Twój potencjał zarobkowy
          </h3>

          <div className="space-y-2">
            <div className="text-2xl font-bold text-primary-600">
              {projectedEarnings.earnings}
            </div>
            <div className="text-sm text-neutral-600">
              miesięcznie przy {projectedEarnings.clients} klientach
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {EARNINGS_PROJECTIONS.map((projection, index) => (
          <div
            key={index}
            className={`p-4 rounded-lg border-2 ${projection.color}`}
          >
            <div className="text-center">
              <div className="text-lg font-semibold text-neutral-900">
                {projection.clients} klientów
              </div>
              <div className="text-sm text-neutral-600">
                {projection.earnings} miesięcznie
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-between pt-4">
        <button
          onClick={onPrev}
          className="px-6 py-2 text-neutral-600 hover:text-neutral-900 transition-colors"
        >
          Wstecz
        </button>
        <button onClick={onNext} className="professional-button px-6 py-2">
          Zobacz funkcje Premium
        </button>
      </div>
    </div>
  );
}

// Features Step Component
function FeaturesStep({ onNext, onPrev }) {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-xl md:text-2xl font-semibold text-neutral-900 mb-2">
          Funkcje Premium
        </h2>
        <p className="text-neutral-600">
          Wszystko, co potrzebujesz do zwiększenia zarobków
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {PREMIUM_FEATURES.map((feature, index) => (
          <div
            key={index}
            className="p-4 rounded-lg border border-neutral-200 hover:border-primary-300 transition-colors"
          >
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
                <feature.icon className="text-lg text-primary-600" />
              </div>
              <div>
                <h3 className="font-semibold text-neutral-900 mb-1">
                  {feature.title}
                </h3>
                <p className="text-sm text-neutral-600">
                  {feature.description}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-success-50 border border-success-200 rounded-lg p-4">
        <div className="flex items-center gap-3">
          <FaCheckCircle className="text-success-600 text-xl" />
        <div>
            <h4 className="font-semibold text-success-800">
              Gwarancja satysfakcji
            </h4>
            <p className="text-sm text-success-700">
              30 dni na zwrot pieniędzy
            </p>
          </div>
        </div>
      </div>

      <div className="flex justify-between pt-4">
        <button
          onClick={onPrev}
          className="px-6 py-2 text-neutral-600 hover:text-neutral-900 transition-colors"
        >
          Wstecz
        </button>
        <button onClick={onNext} className="professional-button px-6 py-2">
          Zobacz cennik
        </button>
      </div>
    </div>
  );
}

// Pricing Step Component
function PricingStep({ onSubscribe, isLoading, onPrev }) {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-xl md:text-2xl font-semibold text-neutral-900 mb-2">
          Wybierz swój plan
          </h2>
        <p className="text-neutral-600">Rozpocznij zarabianie już dziś</p>
      </div>

      <div className="max-w-md mx-auto">
        <div className="relative">
          {/* Popular Badge */}
          <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
            <div className="bg-warning-500 text-white px-4 py-1 rounded-full text-sm font-medium">
              Najpopularniejszy
            </div>
          </div>

          <div className="border-2 border-primary-500 rounded-lg p-6 bg-white shadow-lg">
            <div className="text-center space-y-4">
              <h3 className="text-xl font-semibold text-neutral-900">
                Premium
              </h3>

              <div className="space-y-2">
                <div className="text-3xl font-bold text-primary-600">
                  49,99 zł
                </div>
                <div className="text-sm text-neutral-600">miesięcznie</div>
              </div>

              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-2">
                  <FaCheckCircle className="text-success-600" />
                  <span>Nieograniczona liczba klientów</span>
                </div>
                <div className="flex items-center gap-2">
                  <FaCheckCircle className="text-success-600" />
                  <span>Automatyczne rezerwacje</span>
                </div>
                <div className="flex items-center gap-2">
                  <FaCheckCircle className="text-success-600" />
                  <span>Wyróżnienie w wynikach</span>
                </div>
                <div className="flex items-center gap-2">
                  <FaCheckCircle className="text-success-600" />
                  <span>Wsparcie 24/7</span>
                </div>
                <div className="flex items-center gap-2">
                  <FaCheckCircle className="text-success-600" />
                  <span>Szczegółowe statystyki</span>
                </div>
              </div>

              <button
                onClick={onSubscribe}
                disabled={isLoading}
                className="w-full professional-button py-3 text-base font-semibold disabled:opacity-50"
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Aktywuję...
                  </div>
                ) : (
                  "Aktywuj Premium"
                )}
              </button>

              <p className="text-xs text-neutral-500">
                Anuluj w dowolnym momencie • 30 dni gwarancji
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-center pt-4">
        <button
          onClick={onPrev}
          className="px-6 py-2 text-neutral-600 hover:text-neutral-900 transition-colors"
        >
          Wstecz
        </button>
      </div>
    </div>
  );
}

// Subscribe Success Step Component
function SubscribeSuccessStep() {
  return (
    <div className="text-center space-y-6">
      <div className="w-20 h-20 bg-success-100 rounded-full flex items-center justify-center mx-auto">
        <FaCheckCircle className="text-4xl text-success-600" />
      </div>

      <h2 className="text-2xl md:text-3xl font-semibold text-neutral-900">
        Gratulacje! 🎉
      </h2>

      <p className="text-neutral-600 max-w-md mx-auto">
        Twoja subskrypcja Premium została aktywowana. Możesz teraz zarabiać
        więcej i pozyskiwać nowych klientów!
      </p>

      <div className="bg-success-50 border border-success-200 rounded-lg p-4 max-w-md mx-auto">
        <h3 className="font-semibold text-success-800 mb-2">Następne kroki:</h3>
        <ul className="text-sm text-success-700 space-y-1 text-left">
          <li>• Dodaj swoje usługi i ceny</li>
          <li>• Skonfiguruj swój profil</li>
          <li>• Rozpocznij pozyskiwanie klientów</li>
        </ul>
      </div>

      <div className="flex items-center justify-center gap-4 text-sm text-neutral-500">
        <div className="flex items-center gap-2">
          <FaCheckCircle className="text-success-600" />
          <span>Subskrypcja aktywna</span>
        </div>
        <div className="flex items-center gap-2">
          <FaCheckCircle className="text-success-600" />
          <span>Płatność zabezpieczona</span>
        </div>
      </div>
    </div>
  );
}
