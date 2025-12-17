"use client";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import UserSlider from "@/components/User/UserSlider";
import { User } from "@/types";

interface UserSliderWrapperProps {
  cityUsers: Array<{
    uid: string;
    userSlugUrl?: string;
    [key: string]: unknown;
  }>;
  preloadedUser?: User | null;
  preloadedPortfolio?: Array<{ id: string; url?: string; title?: string }>;
  initialUserSlug?: string | null;
}

export default function UserSliderWrapper({
  cityUsers,
  preloadedUser,
  preloadedPortfolio = [],
  initialUserSlug,
}: UserSliderWrapperProps) {
  const searchParams = useSearchParams();
  const [selectedUser, setSelectedUser] = useState<User | null>(
    preloadedUser || null
  );
  const [portfolio, setPortfolio] = useState<
    Array<{ id: string; url?: string; title?: string }>
  >(preloadedPortfolio || []);
  const [isLoading, setIsLoading] = useState(false);

  // Get the user query parameter
  const userSlug = searchParams?.get("user") || null;

  useEffect(() => {
    // If userSlug matches initialUserSlug and we have preloaded data, use it
    if (userSlug === initialUserSlug && preloadedUser) {
      setSelectedUser(preloadedUser);
      setPortfolio(preloadedPortfolio || []);
      return;
    }

    const loadUserData = async () => {
      if (!userSlug) {
        setSelectedUser(null);
        setPortfolio([]);
        return;
      }

      setIsLoading(true);
      try {
        // Find user by slug
        const user = cityUsers.find(
          (u) => u.userSlugUrl === userSlug || u.uid === userSlug
        );

        if (!user) {
          // Try fetching from API
          const response = await fetch(
            `/api/users/${userSlug}`
          ).catch(() => null);
          if (response?.ok) {
            const userData = await response.json();
            setSelectedUser(userData as User);
            // Fetch portfolio
            if (userData.uid) {
              try {
                const portfolioResponse = await fetch(
                  `/api/users/${userData.uid}/portfolio`
                );
                if (portfolioResponse.ok) {
                  const portfolioData = await portfolioResponse.json();
                  setPortfolio(portfolioData);
                } else {
                  setPortfolio([]);
                }
              } catch {
                setPortfolio([]);
              }
            }
          } else {
            setSelectedUser(null);
            setPortfolio([]);
          }
        } else {
          // User found in cityUsers, fetch full data
          const response = await fetch(`/api/users/${user.uid}`).catch(() => null);
          if (response?.ok) {
            const userData = await response.json();
            setSelectedUser(userData as User);
            // Fetch portfolio
            if (userData.uid) {
              try {
                const portfolioResponse = await fetch(
                  `/api/users/${userData.uid}/portfolio`
                );
                if (portfolioResponse.ok) {
                  const portfolioData = await portfolioResponse.json();
                  setPortfolio(portfolioData);
                } else {
                  setPortfolio([]);
                }
              } catch {
                setPortfolio([]);
              }
            }
          } else {
            // Fallback: use user from cityUsers
            setSelectedUser(user as User);
            setPortfolio([]);
          }
        }
      } catch (error) {
        console.error("Error loading user data:", error);
        setSelectedUser(null);
        setPortfolio([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadUserData();
  }, [userSlug, cityUsers, initialUserSlug, preloadedUser, preloadedPortfolio]);

  const handleClose = () => {
    setSelectedUser(null);
    setPortfolio([]);
  };

  return (
    <UserSlider
      user={selectedUser}
      portfolio={portfolio}
      isOpen={!!selectedUser && !isLoading}
      onClose={handleClose}
    />
  );
}

