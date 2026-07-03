import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Navbar from "@/components/Navbar";
import BottomNav from "@/components/BottomNav";
import Index from "./pages/Index";
import Rechercher from "./pages/Rechercher";
import ParkingDetail from "./pages/ParkingDetail";  // ← NOUVEAU
import Reserver from "./pages/Reserver";
import Confirmation from "./pages/Confirmation";
import Reservations from "./pages/Reservations";
import Profil from "./pages/Profil";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/rechercher" element={<Rechercher />} />
          <Route path="/parking/:id" element={<ParkingDetail />} />  {/* ← NOUVEAU */}
          <Route path="/reserver/:id" element={<Reserver />} />
          <Route path="/confirmation/:id" element={<Confirmation />} />
          <Route path="/reservations" element={<Reservations />} />
          <Route path="/profil" element={<Profil />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <BottomNav />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;