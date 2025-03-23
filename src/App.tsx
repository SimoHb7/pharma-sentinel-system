
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { PharmacyProvider } from "@/contexts/PharmacyContext";
import MainLayout from "@/components/layout/main-layout";
import Index from "./pages/Index";
import Medications from "./pages/Medications";
import Suppliers from "./pages/Suppliers";
import Customers from "./pages/Customers";
import Sales from "./pages/Sales";
import Reports from "./pages/Reports";
import Alerts from "./pages/Alerts";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <PharmacyProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route element={<MainLayout />}>
                <Route path="/" element={<Index />} />
                <Route path="/medications" element={<Medications />} />
                <Route path="/suppliers" element={<Suppliers />} />
                <Route path="/customers" element={<Customers />} />
                <Route path="/sales" element={<Sales />} />
                <Route path="/reports" element={<Reports />} />
                <Route path="/alerts" element={<Alerts />} />
                <Route path="/settings" element={<Settings />} />
              </Route>
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </PharmacyProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
