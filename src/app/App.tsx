import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import LandingLayout from "../layouts/LandingLayout/LandingLayout";
import MainLayout from "../layouts/MainLayout/MainLayout";
import Home from "../pages/Home/Home";
import JobOffer, { action as jobOfferAction } from "../pages/JobOffer/JobOffer";
import PageOne, { action as pageOneAction } from "../pages/PageOne/PageOne";
import PageTwo, { loader as pageTwoLoader } from "../pages/PageTwo/PageTwo";
import ReviewBio, {
  action as reviewBioAction,
} from "../pages/ReviewBio/ReviewBio";
import ReviewCV, {
  action as reviewCvAction,
  loader as reviewCvLoader,
} from "../pages/ReviewCV/ReviewCV";
import ChooseTemplate, {
  action as chooseTemplateAction,
} from "../pages/chooseTemplate/ChooseTemplate";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 1,
      refetchOnWindowFocus: false,
      refetchOnReconnect: true,
    },
    mutations: {
      retry: false,
    },
  },
});

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
      { path: "upload-cv", element: <PageOne />, action: pageOneAction },
      { path: "enhance-tags", element: <PageTwo />, loader: pageTwoLoader },
      { path: "job-offer", element: <JobOffer />, action: jobOfferAction },
      {
        path: "review-bio",
        element: <ReviewBio />,
        action: reviewBioAction,
      },
      {
        path: "review-cv",
        element: <ReviewCV />,
        action: reviewCvAction,
        loader: reviewCvLoader,
      },
      {
        path: "choose-template",
        element: <ChooseTemplate />,
        action: chooseTemplateAction,
        // loader: chooseTemplateLoader,
      },
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
