"use client";
import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { logout } from "@/app/redux/slices/auth";

// Decode JWT token to get expiration time
const decodeToken = (token: string): { exp?: number } | null => {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error("Error decoding token:", error);
    return null;
  }
};

const TokenMonitor: React.FC = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { token, isAuthenticated } = useSelector((state: any) => state.auth);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const warningTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!token || !isAuthenticated) {
      // Clear any existing timeouts
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (warningTimeoutRef.current) clearTimeout(warningTimeoutRef.current);
      return;
    }

    const decoded = decodeToken(token);

    if (!decoded || !decoded.exp) {
      console.warn("Invalid token format");
      return;
    }

    const expirationTime = decoded.exp * 1000; // Convert to milliseconds
    const currentTime = Date.now();
    const timeUntilExpiry = expirationTime - currentTime;

    // If token is already expired
    if (timeUntilExpiry <= 0) {
      console.log("Token already expired, logging out...");
      dispatch(logout());
      router.push("/login");
      return;
    }

    // Show warning 5 minutes before expiration
    const warningTime = timeUntilExpiry - 5 * 60 * 1000; // 5 minutes before

    if (warningTime > 0) {
      warningTimeoutRef.current = setTimeout(() => {
        console.warn("Token will expire in 5 minutes");
        // You can show a toast notification here
        if (typeof window !== "undefined") {
          // Optional: Show browser notification or toast
          console.log("Session will expire soon. Please save your work.");
        }
      }, warningTime);
    }

    // Set timeout to logout when token expires
    timeoutRef.current = setTimeout(() => {
      console.log("Token expired, logging out...");
      dispatch(logout());
      router.push("/login");
    }, timeUntilExpiry);

    // Cleanup function
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (warningTimeoutRef.current) clearTimeout(warningTimeoutRef.current);
    };
  }, [token, isAuthenticated, dispatch, router]);

  // This component doesn't render anything
  return null;
};

export default TokenMonitor;
