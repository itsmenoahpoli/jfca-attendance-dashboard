import { createRoot } from "react-dom/client";
import { ToastContainer } from "react-toastify";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { RouterProvider } from "react-router-dom";
import { persistQueryClientToLocalStorage, rehydrateQueryClientFromLocalStorage } from "@/utils";
import router from "@/routers";
import "react-toastify/dist/ReactToastify.css";
import "@radix-ui/themes/styles.css";
import "@/styles/app.css";

const queryClient: QueryClient = new QueryClient({});

rehydrateQueryClientFromLocalStorage(queryClient);
persistQueryClientToLocalStorage(queryClient);

createRoot(document.getElementById("root")!).render(
  <QueryClientProvider client={queryClient}>
    <ToastContainer theme="colored" position="top-center" />
    <RouterProvider router={router} />
    <ReactQueryDevtools initialIsOpen={false} />
  </QueryClientProvider>
);
