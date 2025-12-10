"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";

export default function Home() {
  const router = useRouter();
  const { token } = useSelector((state: any) => state.auth);

  useEffect(() => {
    // Redirect to dashboard if user is logged in, otherwise to login
    if (token) {
      router.replace("/dashboard");
    } else {
      router.replace("/login");
    }
  }, [token, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading...</p>
      </div>
    </div>
  );
}
