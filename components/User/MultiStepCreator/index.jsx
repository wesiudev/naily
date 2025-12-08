"use client";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import {
  setMultiStepCreatorOpen,
  setCurrentStep,
  setPromotionPopupOpen,
} from "@/redux/slices/cta";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { addDocument, auth, storage, grantFreePremium } from "@/firebase";
import { toast } from "react-toastify";
import { errorCatcher } from "@/utils/errorCatcher";
import { setUser } from "@/redux/slices/user";
import GoogleAuthButton from "@/components/GoogleButton";
import {
  FaUserNinja,
  FaSpa,
  FaImage,
  FaArrowLeft,
  FaArrowRight,
} from "react-icons/fa";
import { MdSpa } from "react-icons/md";
import Image from "next/image";
import { v4 as uuidv4 } from "uuid";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { getServices } from "@/utils/getServices";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function MultiStepCreator() {
  const dispatch = useDispatch();
  const { multiStepCreator, currentStep } = useSelector((state) => state.cta);
  const { user } = useSelector((state) => state.user);
  const router = useRouter();

  const [userData, setUserData] = useState({
    email: "",
    password: "",
    repeatPassword: "",
    name: "",
    phoneNumber: "",
    accountType: "salon", // "salon" or "individual"
    description: "",
    logo: "",
    services: [],
    location: { lng: 21.0122287, lat: 52.2296756, address: "" },
  });

  const [isLoading, setLoading] = useState(false);
  const [logoLoading, setLogoLoading] = useState(false);
  const [services, setServices] = useState({
    pedicure: [],
    manicure: [],
  });
  const [pedicureOpen, setPedicureOpen] = useState(false);
  const [manicureOpen, setManicureOpen] = useState(false);
  const [errors, setErrors] = useState({});

  const steps = [
    {
      title: "Wybierz rodzaj profilu",
      description:
        "Określ, czy jesteś salonem kosmetycznym czy pojedynczą specjalistką",
    },
    {
      title: "Podstawowe informacje",
      description: "Wprowadź swoje dane kontaktowe",
    },
    {
      title: "Prezentacja profilu",
      description: "Dodaj zdjęcie i opis swojego profilu",
    },
    {
      title: "Usługi i utworzenie konta",
      description: "Wybierz oferowane usługi i utwórz konto",
    },
  ];

  useEffect(() => {
    getServices().then((res) => {
      const updatedServices = {
        manicure: [],
        pedicure: [],
      };
      res.forEach((service) => {
        if (service.flatten_name.includes("manicure"))
          updatedServices.manicure.push(service);
        else updatedServices.pedicure.push(service);
      });
      setServices(updatedServices);
    });
  }, []);

  const isValidEmail = (email) =>
    /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,})+$/.test(email || "");

  const validateStep = (step, data) => {
    const stepErrors = {};
    if (step === 1) {
      if (!data.name?.trim()) stepErrors.name = "To pole jest wymagane";
      if (!data.email?.trim()) stepErrors.email = "To pole jest wymagane";
      else if (!isValidEmail(data.email))
        stepErrors.email = "Podaj poprawny adres email";
      if (!data.password?.trim()) stepErrors.password = "To pole jest wymagane";
      else if ((data.password || "").length < 6)
        stepErrors.password = "Hasło powinno składać się z minimum 6 znaków";
      if (!data.repeatPassword?.trim())
        stepErrors.repeatPassword = "To pole jest wymagane";
      else if ((data.password || "") !== (data.repeatPassword || ""))
        stepErrors.repeatPassword = "Hasła nie są takie same";
    }
    if (step === 3) {
      if (!data.services || data.services.length === 0)
        stepErrors.services = "Wybierz co najmniej jedną usługę";
    }
    return stepErrors;
  };

  const validateAll = (data) => {
    return {
      ...validateStep(1, data),
      ...validateStep(3, data),
    };
  };

  const getFirstErrorStep = (errs) => {
    if (errs.name || errs.email || errs.password || errs.repeatPassword)
      return 1;
    if (errs.services) return 3;
    return 0;
  };

  const handleNext = () => {
    const stepErrs = validateStep(currentStep, userData);
    if (Object.keys(stepErrs).length > 0) {
      setErrors((prev) => ({ ...prev, ...stepErrs }));
      return;
    }
    if (currentStep < steps.length - 1) {
      dispatch(setCurrentStep(currentStep + 1));
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      dispatch(setCurrentStep(currentStep - 1));
    }
  };

  const handleClose = () => {
    dispatch(setMultiStepCreatorOpen(false));
    dispatch(setCurrentStep(0));
    setUserData({
      email: "",
      password: "",
      repeatPassword: "",
      name: "",
      phoneNumber: "",
      accountType: "salon",
      description: "",
      logo: "",
      services: [],
      location: { lng: 21.0122287, lat: 52.2296756, address: "" },
    });
  };

  const uploadLogo = async (file) => {
    setLogoLoading(true);
    const randId = uuidv4();
    const imageRef = ref(storage, randId);
    await uploadBytes(imageRef, file);
    const url = await getDownloadURL(imageRef);
    setUserData({ ...userData, logo: url });
    setLogoLoading(false);
  };

  const createAccount = async () => {
    setLoading(true);
    const id = toast.loading(<span>Rejestruję...</span>, {
      position: "top-right",
      isLoading: true,
    });

    const allErrs = validateAll(userData);
    if (Object.keys(allErrs).length > 0) {
      setErrors(allErrs);
      toast.update(id, {
        render: "Prosimy poprawić błędy w formularzu",
        type: "error",
        isLoading: false,
        autoClose: 3000,
      });
      const firstStep = getFirstErrorStep(allErrs);
      if (firstStep) dispatch(setCurrentStep(firstStep));
      setLoading(false);
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        userData.email,
        userData.password
      );

      const userDataForDB = {
        uid: userCredential.user?.uid,
        name: userData.name,
        email: userData.email,
        description: userData.description,
        logo: userData.logo,
        seek: userData.accountType === "individual",
        emailVerified: false,
        configured: false,
        active: false,
        profileComments: [],
        services: userData.services,
        location: userData.location,
        phoneNumber: userData.phoneNumber,
        password: "",
      };

      await addDocument("users", userCredential.user?.uid, userDataForDB);

      // Grant 30-day free premium for new users
      try {
        await grantFreePremium(userCredential.user?.uid);
      } catch (premiumError) {
        console.error("Error granting free premium:", premiumError);
        // Continue even if premium grant fails
      }

      // Generate metadata if description is provided
      if (userData.description && userData.description.trim()) {
        try {
          await fetch(`${process.env.NEXT_PUBLIC_URL || ""}/api/generateMetadata`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              uid: userCredential.user?.uid,
              description: userData.description,
              name: userData.name,
              city: userData.location?.address || "",
            }),
          });
        } catch (metadataError) {
          console.error("Error generating metadata:", metadataError);
          // Continue even if metadata generation fails
        }
      }

      // Update user data with premium info for Redux
      const userDataWithPremium = {
        ...userDataForDB,
        premiumActive: true,
        active: true,
        allowedTabs: ["calendar", "portfolio", "services"],
        subscription: {
          id: `free_trial_${userCredential.user?.uid}`,
          status: "active",
          currentPeriodEnd: Math.floor((Date.now() + 30 * 24 * 60 * 60 * 1000) / 1000),
          cancelAtPeriodEnd: false,
        },
      };

      // Set user state in Redux
      dispatch(setUser(userDataWithPremium));

      toast.update(id, {
        render: "Konto utworzone pomyślnie!",
        type: "success",
        isLoading: false,
        autoClose: 3000,
      });

      setLoading(false);
      handleClose();

      // Show promotion popup for new users
      dispatch(setPromotionPopupOpen(true));

      // Redirect to dashboard using Next.js router
      router.push("/dashboard");
    } catch (err) {
      const errorMsg = errorCatcher(err);
      toast.update(id, {
        render: errorMsg,
        type: "error",
        isLoading: false,
        autoClose: 3000,
      });
      setLoading(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-6">
            <h3 className="text-elegant-xl font-bold text-beauty-charcoal text-center mb-6">
              Wybierz rodzaj profilu
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button
                onClick={() =>
                  setUserData({ ...userData, accountType: "salon" })
                }
                className={`elegant-card p-6 transition-all ${
                  userData.accountType === "salon"
                    ? "border-beauty-rose-500 bg-beauty-rose-50"
                    : "border-beauty-rose-200 hover:border-beauty-rose-300"
                }`}
              >
                <div className="text-center">
                  <MdSpa className="text-4xl text-beauty-rose-500 mx-auto mb-4" />
                  <h4 className="font-semibold text-elegant-lg mb-2 text-beauty-charcoal">
                    Salon Kosmetyczny
                  </h4>
                  <p className="text-elegant-sm text-beauty-slate">
                    Idealne dla salonów i klinik kosmetycznych
                  </p>
                </div>
              </button>

              <button
                onClick={() =>
                  setUserData({ ...userData, accountType: "individual" })
                }
                className={`elegant-card p-6 transition-all ${
                  userData.accountType === "individual"
                    ? "border-beauty-rose-500 bg-beauty-rose-50"
                    : "border-beauty-rose-200 hover:border-beauty-rose-300"
                }`}
              >
                <div className="text-center">
                  <FaUserNinja className="text-4xl text-beauty-rose-500 mx-auto mb-4" />
                  <h4 className="font-semibold text-elegant-lg mb-2 text-beauty-charcoal">
                    Pojedyncza Specjalistka
                  </h4>
                  <p className="text-elegant-sm text-beauty-slate">
                    Dla indywidualnych specjalistek
                  </p>
                </div>
              </button>
            </div>
          </div>
        );

      case 1:
        return (
          <div className="space-y-4">
            <h3 className="text-elegant-xl font-bold text-beauty-charcoal text-center mb-6">
              Podstawowe informacje
            </h3>

            <div>
              <label
                className={`block text-elegant-sm font-medium mb-2 ${
                  errors.name ? "text-red-600" : "text-beauty-charcoal"
                }`}
              >
                Nazwa / Imię i nazwisko *
              </label>
              <input
                type="text"
                value={userData.name}
                onChange={(e) => {
                  const value = e.target.value;
                  setUserData({ ...userData, name: value });
                  if (errors.name) {
                    const stepErrs = validateStep(1, {
                      ...userData,
                      name: value,
                    });
                    if (!stepErrs.name) {
                      const { name, ...rest } = errors;
                      setErrors(rest);
                    } else {
                      setErrors((prev) => ({ ...prev, name: stepErrs.name }));
                    }
                  }
                }}
                className={`w-full p-3 border rounded-elegant focus:ring-2 focus:border-transparent ${
                  errors.name
                    ? "border-red-500 focus:ring-red-500"
                    : "border-beauty-rose-200 focus:ring-beauty-rose-500"
                }`}
                placeholder="Wprowadź nazwę"
              />
              {errors.name && (
                <p className="text-red-600 text-elegant-xs mt-1">
                  {errors.name}
                </p>
              )}
            </div>

            <div>
              <label
                className={`block text-elegant-sm font-medium mb-2 ${
                  errors.email ? "text-red-600" : "text-beauty-charcoal"
                }`}
              >
                Email *
              </label>
              <input
                type="email"
                value={userData.email}
                onChange={(e) => {
                  const value = e.target.value;
                  setUserData({ ...userData, email: value });
                  if (errors.email) {
                    const stepErrs = validateStep(1, {
                      ...userData,
                      email: value,
                    });
                    if (!stepErrs.email) {
                      const { email, ...rest } = errors;
                      setErrors(rest);
                    } else {
                      setErrors((prev) => ({ ...prev, email: stepErrs.email }));
                    }
                  }
                }}
                className={`w-full p-3 border rounded-elegant focus:ring-2 focus:border-transparent ${
                  errors.email
                    ? "border-red-500 focus:ring-red-500"
                    : "border-beauty-rose-200 focus:ring-beauty-rose-500"
                }`}
                placeholder="twoj@email.com"
              />
              {errors.email && (
                <p className="text-red-600 text-elegant-xs mt-1">
                  {errors.email}
                </p>
              )}
            </div>

            <div>
              <label
                className={`block text-elegant-sm font-medium mb-2 ${
                  errors.password ? "text-red-600" : "text-beauty-charcoal"
                }`}
              >
                Hasło *
              </label>
              <input
                type="password"
                value={userData.password}
                onChange={(e) => {
                  const value = e.target.value;
                  const nextData = { ...userData, password: value };
                  setUserData(nextData);
                  if (errors.password || errors.repeatPassword) {
                    const stepErrs = validateStep(1, nextData);
                    const newErrors = { ...errors };
                    if (!stepErrs.password) delete newErrors.password;
                    else newErrors.password = stepErrs.password;
                    if (!stepErrs.repeatPassword)
                      delete newErrors.repeatPassword;
                    else newErrors.repeatPassword = stepErrs.repeatPassword;
                    setErrors(newErrors);
                  }
                }}
                className={`w-full p-3 border rounded-elegant focus:ring-2 focus:border-transparent ${
                  errors.password
                    ? "border-red-500 focus:ring-red-500"
                    : "border-beauty-rose-200 focus:ring-beauty-rose-500"
                }`}
                placeholder="Minimum 6 znaków"
              />
              {errors.password && (
                <p className="text-red-600 text-elegant-xs mt-1">
                  {errors.password}
                </p>
              )}
            </div>

            <div>
              <label
                className={`block text-elegant-sm font-medium mb-2 ${
                  errors.repeatPassword
                    ? "text-red-600"
                    : "text-beauty-charcoal"
                }`}
              >
                Powtórz hasło *
              </label>
              <input
                type="password"
                value={userData.repeatPassword}
                onChange={(e) => {
                  const value = e.target.value;
                  const nextData = { ...userData, repeatPassword: value };
                  setUserData(nextData);
                  if (errors.repeatPassword) {
                    const stepErrs = validateStep(1, nextData);
                    if (!stepErrs.repeatPassword) {
                      const { repeatPassword, ...rest } = errors;
                      setErrors(rest);
                    } else {
                      setErrors((prev) => ({
                        ...prev,
                        repeatPassword: stepErrs.repeatPassword,
                      }));
                    }
                  }
                }}
                className={`w-full p-3 border rounded-elegant focus:ring-2 focus:border-transparent ${
                  errors.repeatPassword
                    ? "border-red-500 focus:ring-red-500"
                    : "border-beauty-rose-200 focus:ring-beauty-rose-500"
                }`}
                placeholder="Powtórz hasło"
              />
              {errors.repeatPassword && (
                <p className="text-red-600 text-elegant-xs mt-1">
                  {errors.repeatPassword}
                </p>
              )}
            </div>

            <div>
              <label className="block text-elegant-sm font-medium text-beauty-charcoal mb-2">
                Numer telefonu
              </label>
              <input
                type="tel"
                value={userData.phoneNumber}
                onChange={(e) =>
                  setUserData({ ...userData, phoneNumber: e.target.value })
                }
                className="w-full p-3 border border-beauty-rose-200 rounded-elegant focus:ring-2 focus:ring-beauty-rose-500 focus:border-transparent"
                placeholder="+48 123 456 789"
              />
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <h3 className="text-elegant-xl font-bold text-beauty-charcoal text-center mb-6">
              Prezentacja profilu
            </h3>

            <div>
              <label className="block text-elegant-sm font-medium text-beauty-charcoal mb-2">
                Zdjęcie profilu
              </label>
              <label
                htmlFor="logo-upload"
                className="relative group block mt-2"
              >
                {!userData.logo && !logoLoading ? (
                  <div className="cursor-pointer w-full h-[120px] rounded-elegant hover:bg-beauty-rose-50 border border-beauty-rose-200 bg-white p-3 flex flex-col items-center justify-center">
                    <FaImage className="text-3xl text-beauty-rose-500" />
                    <h3 className="text-center mt-2 font-medium text-elegant-sm text-beauty-slate">
                      Dodaj zdjęcie
                    </h3>
                  </div>
                ) : (
                  <div className="relative cursor-pointer max-w-36 max-h-36 aspect-square rounded-elegant border border-beauty-rose-200 bg-white p-3 flex items-center justify-center">
                    {!logoLoading && userData.logo && (
                      <Image
                        src={userData.logo}
                        width={124}
                        height={124}
                        alt="logo"
                        className="absolute inset-0 object-cover w-auto max-h-[90%] mx-auto my-auto"
                      />
                    )}
                    {logoLoading && (
                      <div className="absolute left-0 top-0 w-full h-full flex items-center justify-center">
                        <div className="animate-spin rounded-full border-b-2 border-beauty-rose-500 h-12 w-12"></div>
                      </div>
                    )}
                  </div>
                )}
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  const validType = file.type.startsWith("image/");
                  const validSize = file.size <= 5 * 1024 * 1024;

                  if (!validType || !validSize) {
                    toast.error(
                      "Tylko zdjęcia o rozmiarze do 5MB są dozwolone",
                      {
                        position: "top-right",
                        autoClose: 5000,
                      }
                    );
                    return;
                  }
                  uploadLogo(file);
                }}
                id="logo-upload"
                className="hidden"
              />
            </div>

            <div>
              <label className="block text-elegant-sm font-medium text-beauty-charcoal mb-2">
                Opis profilu
              </label>
              <textarea
                value={userData.description}
                onChange={(e) =>
                  setUserData({ ...userData, description: e.target.value })
                }
                className="h-[120px] w-full border-beauty-rose-200 border rounded-elegant p-3 mt-2 focus:ring-2 focus:ring-beauty-rose-500 focus:border-transparent"
                placeholder="Opisz swoje usługi, doświadczenie lub specjalizacje..."
              />
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <h3 className="text-elegant-xl font-bold text-beauty-charcoal text-center mb-6">
              Usługi i utworzenie konta
            </h3>

            <div>
              <label className="block text-elegant-sm font-medium text-beauty-charcoal mb-2">
                Wybierz oferowane usługi
              </label>

              {/* Pedicure Services */}
              <button
                onClick={() => setPedicureOpen(!pedicureOpen)}
                className={`border-2 rounded-elegant h-full w-full text-elegant-sm p-4 mt-2 ${
                  pedicureOpen
                    ? "bg-beauty-rose-500 text-white hover:bg-beauty-rose-600"
                    : "bg-white text-beauty-slate hover:bg-beauty-rose-50 border-beauty-rose-200"
                }`}
              >
                Usługi pedicure
              </button>
              {pedicureOpen && (
                <div className="mt-2 p-3 flex flex-col gap-2 max-h-[300px] overflow-y-auto bg-beauty-rose-50 rounded-elegant border border-beauty-rose-200">
                  {services?.pedicure?.map((item) => (
                    <button
                      key={item.flatten_name}
                      onClick={() => {
                        const isSelected = userData.services.some(
                          (s) => s.flatten_name === item.flatten_name
                        );
                        const nextServices = isSelected
                          ? userData.services.filter(
                              (service) =>
                                service.flatten_name !== item.flatten_name
                            )
                          : [...userData.services, item];
                        setUserData({
                          ...userData,
                          services: nextServices,
                        });
                        if (errors.services) {
                          const stepErrs = validateStep(3, {
                            ...userData,
                            services: nextServices,
                          });
                          if (!stepErrs.services) {
                            const { services, ...rest } = errors;
                            setErrors(rest);
                          }
                        }
                      }}
                      className={`${
                        userData.services.some(
                          (s) => s.flatten_name === item.flatten_name
                        )
                          ? "bg-beauty-rose-600 text-white font-bold"
                          : "bg-white hover:bg-beauty-rose-100 border-beauty-rose-300 text-beauty-charcoal"
                      } text-elegant-sm p-2 rounded-elegant border-2`}
                    >
                      {item.real_name}
                    </button>
                  ))}
                </div>
              )}

              {/* Manicure Services */}
              <button
                onClick={() => setManicureOpen(!manicureOpen)}
                className={`border-2 rounded-elegant h-full w-full text-elegant-sm p-4 mt-4 ${
                  manicureOpen
                    ? "bg-beauty-rose-500 text-white hover:bg-beauty-rose-600"
                    : "bg-white text-beauty-slate hover:bg-beauty-rose-50 border-beauty-rose-200"
                }`}
              >
                Usługi manicure
              </button>
              {manicureOpen && (
                <div className="mt-2 p-3 flex flex-col gap-2 max-h-[300px] overflow-y-auto bg-beauty-rose-50 rounded-elegant border border-beauty-rose-200">
                  {services?.manicure?.map((item) => (
                    <button
                      key={item.flatten_name}
                      onClick={() => {
                        const isSelected = userData.services.some(
                          (s) => s.flatten_name === item.flatten_name
                        );
                        const nextServices = isSelected
                          ? userData.services.filter(
                              (service) =>
                                service.flatten_name !== item.flatten_name
                            )
                          : [...userData.services, item];
                        setUserData({
                          ...userData,
                          services: nextServices,
                        });
                        if (errors.services) {
                          const stepErrs = validateStep(3, {
                            ...userData,
                            services: nextServices,
                          });
                          if (!stepErrs.services) {
                            const { services, ...rest } = errors;
                            setErrors(rest);
                          }
                        }
                      }}
                      className={`${
                        userData.services.some(
                          (s) => s.flatten_name === item.flatten_name
                        )
                          ? "bg-beauty-rose-600 text-white font-bold"
                          : "bg-white hover:bg-beauty-rose-100 border-beauty-rose-300 text-beauty-charcoal"
                      } text-elegant-sm p-2 rounded-elegant border-2`}
                    >
                      {item.real_name}
                    </button>
                  ))}
                </div>
              )}
              {errors.services && (
                <p className="text-red-600 text-elegant-xs mt-2">
                  {errors.services}
                </p>
              )}
            </div>

            <div className="mt-6">
              <button
                onClick={createAccount}
                disabled={isLoading}
                className="w-full elegant-button py-3 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? "Tworzę konto..." : "Utwórz konto"}
              </button>
            </div>

            <div className="text-center">
              <div className="relative my-4">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-beauty-rose-200"></div>
                </div>
                <div className="relative flex justify-center text-elegant-sm">
                  <span className="px-2 bg-white text-beauty-slate">lub</span>
                </div>
              </div>

              <GoogleAuthButton />
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  if (!multiStepCreator) return null;

  return (
    <div
      onClick={handleClose}
      className="fixed inset-0 bg-black bg-opacity-50 z-[100] flex items-center justify-center p-4"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="elegant-card max-w-2xl w-full max-h-[90vh] overflow-y-auto"
      >
        <div className="p-8">
          <div className="flex justify-between items-center mb-8">
            <button
              onClick={handleClose}
              className="text-beauty-slate hover:text-beauty-charcoal transition-colors"
            >
              ✕
            </button>
            <h2 className="text-elegant-2xl font-bold text-center flex-1 text-beauty-charcoal">
              Utwórz profil
            </h2>
            <div className="w-6"></div>
          </div>

          {/* Progress bar */}
          <div className="mb-8">
            <div className="flex justify-between mb-4">
              {steps.map((step, index) => (
                <div key={index} className="flex flex-col items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center text-elegant-sm font-semibold ${
                      index <= currentStep
                        ? "bg-beauty-rose-500 text-white"
                        : "bg-beauty-rose-100 text-beauty-slate"
                    }`}
                  >
                    {index + 1}
                  </div>
                  <span className="text-elegant-xs mt-2 text-beauty-slate hidden sm:block text-center">
                    {step.title}
                  </span>
                </div>
              ))}
            </div>
            <div className="flex-1 h-2 bg-beauty-rose-100 rounded-full">
              <div
                className="h-2 bg-beauty-rose-500 rounded-full transition-all duration-300"
                style={{
                  width: `${((currentStep + 1) / steps.length) * 100}%`,
                }}
              ></div>
            </div>
          </div>

          {/* Step content */}
          <div className="mb-8">{renderStep()}</div>

          {/* Navigation */}
          {currentStep < 3 && (
            <div className="flex justify-between">
              <button
                onClick={handleBack}
                disabled={currentStep === 0}
                className="px-6 py-3 text-beauty-slate border border-beauty-rose-200 rounded-elegant hover:bg-beauty-rose-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <FaArrowLeft className="text-elegant-sm" />
                Wstecz
              </button>
              <button
                onClick={handleNext}
                className="elegant-button px-6 py-3 font-semibold flex items-center gap-2"
              >
                Dalej
                <FaArrowRight className="text-elegant-sm" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
