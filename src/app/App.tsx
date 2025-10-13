import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import LandingLayout from "../layouts/LandingLayout/LandingLayout";
import MainLayout from "../layouts/MainLayout/MainLayout";
import Home from "../pages/Home/Home";
import PageOne from "../pages/PageOne/PageOne";
import PageTwo from "../pages/PageTwo/PageTwo";

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
