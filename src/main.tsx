import { createRoot } from "react-dom/client";
import { Theme } from "@radix-ui/themes";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { RouterProvider } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import appRouter from "@/router";
import "jotai-devtools/styles.css";
import "react-perfect-scrollbar/dist/css/styles.css";
import "@/styles/app.css";

const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <Theme scaling="90%">
    <QueryClientProvider client={queryClient}>
      <ToastContainer theme="colored" position="top-center" />
      <RouterProvider router={appRouter} />
    </QueryClientProvider>
  </Theme>
);
