"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import Script from "next/script";
function Success() {
  const searchParams = useSearchParams();

  const session_id = searchParams.get("session_id");
  const [loading, setLoading] = useState(true);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const fetchSessionData = async () => {
      if (!session_id) {
        setErrorMessage("Missing session ID.");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_URL}/stripe/success`,
          {
            method: "POST",
            body: JSON.stringify({ session_id }),
          }
        );

        const data = await response.json();

        if (data.success) {
          setSuccessMessage("Your subscription was successful!");
        } else {
          setErrorMessage(
            data.error || "An error occurred during the subscription process."
          );
        }
      } catch (error) {
        console.error("Error fetching subscription data:", error);
        setErrorMessage("An unexpected error occurred. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchSessionData();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }
  return (
    <>
      {errorMessage ? (
        <div className="flex items-center justify-center w-full h-screen">
          <div className="bg-white rounded-lg shadow-lg p-8 max-w-md mx-auto">
            <h1 className="text-4xl font-bold text-red-500">Nie udało się!</h1>
            <p className="text-lg text-gray-600">
              Nie pobralismy środków z Twojego konta
            </p>
          </div>
        </div>
      ) : (
        <>
          <Script
            id="google-ads"
            async
            src="https://www.googletagmanager.com/gtag/js?id=G-6XV8R4XZKS"
          >
            {`
          gtag('event', 'conversion', { 'send_to': 'AW-10818390066/zwzzCNHu7ZUaELKQzqYo', 'transaction_id': '' });
        `}
          </Script>

          <div className="flex items-center justify-center w-full h-screen text-center">
            <div className="bg-white rounded-lg shadow-lg p-8 max-w-md mx-auto space-y-3">
              <h1 className="text-2xl font-bold text-green-500">
                Transakcja przebiegła pomyślnie!
              </h1>
              <p className="text-lg text-gray-600">
                Wróć do strony głównej aby dokończyć konfigurację profilu.
              </p>
              <Link
                className="block bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-max mx-auto"
                href="/"
              >
                Strona główna
              </Link>
            </div>
          </div>
        </>
      )}
    </>
  );
}

export default function Page() {
  return (
    <Suspense>
      <Success />
    </Suspense>
  );
}
