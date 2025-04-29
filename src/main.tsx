import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import App from "./App.tsx";
import { UserProvider } from "./context/userContext.tsx";
import { Toaster } from "./components/ui/toaster.tsx";
import { PhaseProvider } from "./context/phaseContext.tsx";
import { SidebarProvider } from "./components/ui/sidebar.tsx";

const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <UserProvider>
        <PhaseProvider>
          <SidebarProvider>
            <App />
          </SidebarProvider>
          <Toaster />
        </PhaseProvider>
      </UserProvider>
    </QueryClientProvider>
  </StrictMode>
);
