"use client";
import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { setUser } from "@/redux/slices/user";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
} from "firebase/auth";
import { auth, addDocument, grantFreePremium } from "@/firebase";
import { toast } from "react-toastify";
import { errorCatcher } from "@/utils/errorCatcher";
import { FaUser, FaTimes } from "react-icons/fa";
import { MdSpa } from "react-icons/md";
import { useRouter } from "next/navigation";

interface LoginRegisterPopupProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: "login" | "register";
  defaultAccountType?: "salon" | "individual";
}

export default function LoginRegisterPopup({
  isOpen,
  onClose,
  defaultTab = "login",
  defaultAccountType,
}: LoginRegisterPopupProps) {
  const dispatch = useDispatch();
  const [isLogin, setIsLogin] = useState(defaultTab === "login");
  // Sync isLogin with defaultTab and preselect account type when popup opens
  useEffect(() => {
    if (isOpen) {
      setIsLogin(defaultTab === "login");
      if (defaultAccountType) {
        setFormData((prev) => ({ ...prev, accountType: defaultAccountType }));
      }
    }
  }, [isOpen, defaultTab, defaultAccountType]);

  const [recoveryFormOpen, setRecoveryFormOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    name: "",
    accountType: "salon" as "salon" | "individual",
  });
  const router = useRouter();

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email) {
      toast.error("Podaj adres email do resetu hasła", { autoClose: 3000 });
      return;
    }

    const id = toast.loading(<span>Wysyłam link resetujący...</span>, {
      position: "top-right",
      isLoading: true,
    });

    try {
      await sendPasswordResetEmail(auth, formData.email);
      toast.update(id, {
        render: "Wysłano email z linkiem do resetu hasła",
        type: "success",
        isLoading: false,
        autoClose: 3000,
      });
      setRecoveryFormOpen(false);
    } catch (err) {
      const errorMsg = errorCatcher(err);
      toast.update(id, {
        render: errorMsg,
        type: "error",
        isLoading: false,
        autoClose: 3000,
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const id = toast.loading(
      <span>{isLogin ? "Loguję..." : "Rejestruję..."}</span>,
      {
        position: "top-right",
        isLoading: true,
      }
    );

    try {
      if (isLogin) {
        // Login logic
        if (!formData.email || !formData.password) {
          toast.update(id, {
            render: "Prosimy uzupełnić wszystkie pola",
            type: "error",
            isLoading: false,
            autoClose: 3000,
          });
          setIsLoading(false);
          return;
        }

        const userCredential = await signInWithEmailAndPassword(
          auth,
          formData.email,
          formData.password
        );

        // Set user state in Redux
        dispatch(
          setUser({
            uid: userCredential.user?.uid || "",
            name: formData.name || userCredential.user?.displayName || "",
            email: formData.email || userCredential.user?.email || "",
            description: "",
            logo: "",
            seek: false,
            emailVerified: Boolean(userCredential.user?.emailVerified),
            configured: false,
            active: false,
            profileComments: [],
            services: [],
            location: { lng: 21.0122287, lat: 52.2296756, address: "" },
            phoneNumber: "",
            password: "",
          })
        );

        toast.update(id, {
          render: "Zalogowano pomyślnie!",
          type: "success",
          isLoading: false,
          autoClose: 3000,
        });

        onClose();
        setFormData({
          email: "",
          password: "",
          confirmPassword: "",
          name: "",
          accountType: "salon",
        });
        router.push("/dashboard");
      } else {
        // Register logic
        if (!formData.email || !formData.password || !formData.name) {
          toast.update(id, {
            render: "Prosimy uzupełnić wszystkie wymagane pola",
            type: "error",
            isLoading: false,
            autoClose: 3000,
          });
          setIsLoading(false);
          return;
        }

        if (formData.password !== formData.confirmPassword) {
          toast.update(id, {
            render: "Hasła nie są takie same",
            type: "error",
            isLoading: false,
            autoClose: 3000,
          });
          setIsLoading(false);
          return;
        }

        if (formData.password.length < 6) {
          toast.update(id, {
            render: "Hasło powinno składać się z minimum 6 znaków",
            type: "error",
            isLoading: false,
            autoClose: 3000,
          });
          setIsLoading(false);
          return;
        }

        const userCredential = await createUserWithEmailAndPassword(
          auth,
          formData.email,
          formData.password
        );

        await addDocument("users", userCredential.user?.uid, {
          uid: userCredential.user?.uid,
          name: formData.name || "",
          email: formData.email,
          description: "",
          logo: "",
          seek: false,
          emailVerified: Boolean(userCredential.user?.emailVerified),
          configured: false,
          active: false,
          profileComments: [],
          services: [],
          location: { lng: 21.0122287, lat: 52.2296756, address: "" },
          phoneNumber: "",
        });

        // Grant 30-day free premium for new users
        try {
          await grantFreePremium(userCredential.user?.uid);
        } catch (premiumError) {
          console.error("Error granting free premium:", premiumError);
          // Continue even if premium grant fails
        }

        // Set user state in Redux with uid and premium info
        dispatch(
          setUser({
            uid: userCredential.user?.uid || "",
            name: formData.name || "",
            email: formData.email,
            description: "",
            logo: "",
            seek: false,
            emailVerified: Boolean(userCredential.user?.emailVerified),
            configured: false,
            active: true,
            premiumActive: true,
            allowedTabs: ["calendar", "portfolio", "services"],
            profileComments: [],
            services: [],
            location: { lng: 21.0122287, lat: 52.2296756, address: "" },
            phoneNumber: "",
            subscription: {
              id: `free_trial_${userCredential.user?.uid}`,
              status: "active",
              currentPeriodEnd: Math.floor((Date.now() + 30 * 24 * 60 * 60 * 1000) / 1000),
              cancelAtPeriodEnd: false,
            },
          })
        );

        toast.update(id, {
          render: "Konto utworzone pomyślnie!",
          type: "success",
          isLoading: false,
          autoClose: 3000,
        });

        onClose();
        setFormData({
          email: "",
          password: "",
          confirmPassword: "",
          name: "",
          accountType: "salon",
        });

        // Redirect to dashboard using Next.js router
        router.push("/dashboard");
      }
    } catch (err) {
      const errorMsg = errorCatcher(err);
      toast.update(id, {
        render: errorMsg,
        type: "error",
        isLoading: false,
        autoClose: 3000,
      });
    }

    setIsLoading(false);
  };

  if (!isOpen) return null;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[200] flex items-center justify-center p-4 overflow-y-auto"
    >
      <button
        onClick={onClose}
        className="fixed top-6 right-6 text-white"
        aria-label="Zamknij"
      >
        <FaTimes className="text-lg" />
      </button>
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative professional-card max-w-md w-full max-h-[90vh] overflow-y-auto bg-white shadow-2xl rounded-2xl"
        role="dialog"
        aria-modal="true"
        aria-labelledby="auth-modal-title"
      >
        <div className="p-6 sm:p-8 max-h-[90vh] overflow-y-auto">
          {!recoveryFormOpen && (
            <>
              <h2 id="auth-modal-title" className="sr-only">
                {isLogin ? "Logowanie" : "Rejestracja"}
              </h2>
              {/* Toggle Buttons */}
              <div className="flex bg-neutral-100 rounded-lg p-1 mb-6 gap-3">
                <button
                  onClick={() => setIsLogin(true)}
                  className={`border-2 flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
                    isLogin
                      ? "bg-blue-600 border-blue-700 text-white shadow-sm"
                      : "text-neutral-600 border-neutral-300 hover:text-neutral-900"
                  }`}
                >
                  Logowanie
                </button>
                <button
                  onClick={() => setIsLogin(false)}
                  className={`border-2 flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
                    !isLogin
                      ? "bg-blue-600 border-blue-700 text-white shadow-sm"
                      : "text-neutral-600 border-neutral-300 hover:text-neutral-900"
                  }`}
                >
                  Rejestracja
                </button>
              </div>

              {/* Form */}
              <form
                onSubmit={handleSubmit}
                className="max-h-[50vh] overflow-y-auto relative space-y-4 px-2"
              >
                {!isLogin && (
                  <>
                    {/* Account Type Selection */}
                    <div>
                      <label className="block text-sm font-medium text-neutral-900 mb-3">
                        Rodzaj konta
                      </label>
                      <div className="grid grid-cols-2 gap-3">
                        <button
                          type="button"
                          onClick={() =>
                            setFormData({ ...formData, accountType: "salon" })
                          }
                          className={`focus:outline-none p-4 rounded-lg border-2 transition-all ${
                            formData.accountType === "salon"
                              ? "border-blue-600 bg-blue-50"
                              : "border-neutral-200 hover:border-neutral-300 bg-white"
                          }`}
                        >
                          <div className="text-center">
                            <MdSpa className="text-2xl text-blue-600 mx-auto mb-2" />
                            <span className="text-sm font-medium text-neutral-900">
                              Salon
                            </span>
                          </div>
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            setFormData({
                              ...formData,
                              accountType: "individual",
                            })
                          }
                          className={`focus:outline-none p-4 rounded-lg border-2 transition-all ${
                            formData.accountType === "individual"
                              ? "border-blue-600 bg-blue-50"
                              : "border-neutral-200 hover:border-neutral-300 bg-white"
                          }`}
                        >
                          <div className="text-center">
                            <FaUser className="text-xl text-blue-600 mx-auto mb-2" />
                            <span className="text-sm font-medium text-neutral-900">
                              Indywidualne
                            </span>
                          </div>
                        </button>
                      </div>
                    </div>

                    {/* Name Field */}
                    <div>
                      {formData.accountType === "individual" && (
                        <label className="block text-sm font-medium text-neutral-900 mb-2">
                          Imię i nazwisko
                        </label>
                      )}
                      {formData.accountType === "salon" && (
                        <label className="block text-sm font-medium text-neutral-900 mb-2">
                          Nazwa salonu
                        </label>
                      )}
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                        className="w-full p-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm transition-colors"
                        placeholder={
                          formData.accountType === "individual"
                            ? "Imię i nazwisko"
                            : "Nazwa salonu"
                        }
                        required
                      />
                    </div>
                  </>
                )}

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-neutral-900 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className="w-full p-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm transition-colors"
                    placeholder="email@example.com"
                    required
                  />
                </div>

                {/* Password */}
                <div>
                  <label className="block text-sm font-medium text-neutral-900 mb-2">
                    Hasło
                  </label>
                  <input
                    type="password"
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                    className="w-full p-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm transition-colors"
                    placeholder="Hasło"
                    required
                  />
                </div>

                {/* Confirm Password */}
                {!isLogin && (
                  <div>
                    <label className="block text-sm font-medium text-neutral-900 mb-2">
                      Powtórz hasło
                    </label>
                    <input
                      type="password"
                      value={formData.confirmPassword}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          confirmPassword: e.target.value,
                        })
                      }
                      className="w-full p-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm transition-colors"
                      placeholder="Powtórz hasło"
                      required
                    />
                  </div>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full professional-button py-3 text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Ładowanie...
                    </div>
                  ) : isLogin ? (
                    "Zaloguj się"
                  ) : (
                    "Zarejestruj się"
                  )}
                </button>
                <button
                  onClick={() => {
                    setRecoveryFormOpen(true);
                  }}
                  type="button"
                  className="text-blue-600 hover:text-blue-700"
                >
                  Przypomnij hasło
                </button>
              </form>
            </>
          )}

          {recoveryFormOpen && (
            <form onSubmit={handlePasswordReset} className="space-y-4 px-2">
              <div className="mb-2 text-neutral-900 font-semibold">
                Odzyskiwanie hasła
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-900 mb-2">
                  Email powiązany z kontem
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="w-full p-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm transition-colors"
                  placeholder="email@example.com"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full professional-button py-3 text-sm font-semibold"
              >
                Wyślij link resetujący
              </button>
              <button
                type="button"
                onClick={() => setRecoveryFormOpen(false)}
                className="w-full py-2 text-sm text-neutral-700 hover:text-neutral-900"
              >
                Wróć do logowania / rejestracji
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
