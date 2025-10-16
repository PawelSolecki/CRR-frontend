import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import LandingLayout from "../layouts/LandingLayout/LandingLayout";
import MainLayout from "../layouts/MainLayout/MainLayout";
import Home from "../pages/Home/Home";
import JobOffer from "../pages/JobOffer/JobOffer";
import PageOne from "../pages/PageOne/PageOne";
import PageTwo from "../pages/PageTwo/PageTwo";
import ReviewBio from "../pages/ReviewBio/ReviewBio";
import ReviewCv from "../pages/ReviewCv/ReviewCv";

const queryClient = new QueryClient();

const router = createBrowserRouter([
  {
    path: "/",
    element: <LandingLayout />,
    children: [{ index: true, element: <Home /> }],
  },

  {
    path: "/",
    element: <MainLayout />,
    children: [
      { path: "upload-cv", element: <PageOne /> },
      { path: "enhance-tags", element: <PageTwo /> },
      { path: "job-offer", element: <JobOffer /> },
      { path: "review-bio", element: <ReviewBio /> },
      { path: "review-cv", element: <ReviewCv /> },
    ],
  },
]);

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  );
}
