"use client";
import Image from "next/image";

import MainSection from "../components/layout";
import MainDashboard from "../components/dashboard--component/MainDashboard-component";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { getSocket } from "../utils/socket";

export default function Home() {
  const router = useRouter();
  const { token, user } = useSelector((state: any) => state.auth);

  useEffect(() => {
    if (!token && !user) router.push("/login");
  }, [token, user]);


  useEffect(() => {
    if(token) {
      const socket = getSocket(token);

      if (socket && !socket.connected) {
        socket.auth = { token };
        socket.connect();

        socket.on("connect", () =>
          console.log("Socket connected:", socket.id)
        );
        socket.on("connect_error", (err: any) =>
          console.log("Socket error:", err.message)
        );
      }
    }
  }, [token]);
  

  return (
    <>
      <MainDashboard />
    </>
  );
}
