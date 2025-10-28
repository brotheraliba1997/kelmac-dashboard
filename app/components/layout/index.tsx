import React from "react";
import Header from "./header";
import Sidebar from "./sidebar";

function MainSectionPage ({children}: {children?: React.ReactNode}) {
  return (
    <>
      <Header />
      <Sidebar />
      {children}
    
    </>
  );
}

export default MainSectionPage;
