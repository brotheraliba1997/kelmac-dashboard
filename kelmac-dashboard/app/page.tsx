import Image from "next/image";

import MainSection from "./components/layout";
import MainDashboard from "./components/dashboard";

export default function Home() {
  return (
    <>
      <MainSection>
        <MainDashboard />
      </MainSection>
    </>
  );
}
