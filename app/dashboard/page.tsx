"use client";
import Image from "next/image";

import MainSection from "../components/layout";
import MainDashboard from "../components/dashboard--component/MainDashboard-component";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const { token, user } = useSelector((state: any) => state.auth);

  useEffect(() => {
    if (!token && !user) router.push("/login");
  }, [token, user]);

  return (
    <>
      <MainDashboard />
    </>
  );
}
