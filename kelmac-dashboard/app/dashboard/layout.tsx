import React from "react";
import Header from "../components/layout/header";
import Sidebar from "../components/layout/sidebar";

function Layout({ children }: { children?: React.ReactNode }) {
  return (
    <>
      <Header />
      <Sidebar />
      {children}
    </>
  );
}

export default Layout;
