import { Header } from "@features/navigation";
import { Outlet, useLocation } from "react-router-dom";
import styles from "./MainLayout.module.scss";

const steps = [
  { id: 1, title: "Upload CV", link: "/upload-cv" },
  { id: 2, title: "Enhance Tags", link: "/enhance-tags" },
  { id: 3, title: "Job Offer", link: "/job-offer" },
  { id: 4, title: "Review Bio", link: "/review-bio" },
  { id: 5, title: "Review CV", link: "/review-cv" },
  { id: 6, title: "Choose Template", link: "/choose-template" },
  { id: 7, title: "Download", link: "/download" },
];

function getCurrentStep(pathname: string): number {
  const stepMap: { [key: string]: number } = {
    "/upload-cv": 1,
    "/enhance-tags": 2,
    "/job-offer": 3,
    "/review-bio": 4,
    "/review-cv": 5,
    "/choose-template": 6,
    "/download": 7,
  };

  return stepMap[pathname] || 1;
}

export default function MainLayout() {
  const location = useLocation();
  const currentStep = getCurrentStep(location.pathname);

  return (
    <div className={styles.mainLayout}>
      <Header steps={steps} currentStep={currentStep} />
      <main>
        <Outlet />
      </main>
    </div>
  );
}
