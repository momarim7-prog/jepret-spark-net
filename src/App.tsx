import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";

import Index from "./pages/Index.tsx";
import NotFound from "./pages/NotFound.tsx";
import BookTiming from "./pages/BookTiming.tsx";
import BookNow from "./pages/BookNow.tsx";
import BookPosted from "./pages/BookPosted.tsx";
import OnlineBrowse from "./pages/OnlineBrowse.tsx";
import Orders from "./pages/Orders.tsx";
import Chat from "./pages/Chat.tsx";
import Promos from "./pages/Promos.tsx";
import BulkBooking from "./pages/BulkBooking.tsx";
import TalentProfile from "./pages/TalentProfile.tsx";
import Auth from "./pages/Auth.tsx";
import RoleSelect from "./pages/RoleSelect.tsx";
import ClientOnboarding from "./pages/onboarding/ClientOnboarding.tsx";
import FreelancerOnboarding from "./pages/onboarding/FreelancerOnboarding.tsx";
import ClientHome from "./pages/client/ClientHome.tsx";
import FreelancerHome from "./pages/freelancer/FreelancerHome.tsx";
import Terms from "./pages/Terms.tsx";
import Privacy from "./pages/Privacy.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            {/* Public marketing/landing */}
            <Route path="/" element={<Index />} />

            {/* Auth flow */}
            <Route path="/auth" element={<Auth />} />
            <Route path="/auth/role" element={<RoleSelect />} />

            {/* Legal */}
            <Route path="/terms" element={<Terms />} />
            <Route path="/privacy" element={<Privacy />} />

            {/* Onboarding (require auth + role, but onboarding NOT yet completed) */}
            <Route
              path="/onboarding/client"
              element={
                <ProtectedRoute requireRole="client" requireOnboardingIncomplete>
                  <ClientOnboarding />
                </ProtectedRoute>
              }
            />
            <Route
              path="/onboarding/freelancer"
              element={
                <ProtectedRoute requireRole="freelancer" requireOnboardingIncomplete>
                  <FreelancerOnboarding />
                </ProtectedRoute>
              }
            />

            {/* Client area */}
            <Route
              path="/client/home"
              element={
                <ProtectedRoute requireRole="client">
                  <ClientHome />
                </ProtectedRoute>
              }
            />
            <Route path="/client" element={<Navigate to="/client/home" replace />} />

            {/* Freelancer area */}
            <Route
              path="/freelancer/home"
              element={
                <ProtectedRoute requireRole="freelancer">
                  <FreelancerHome />
                </ProtectedRoute>
              }
            />
            <Route path="/freelancer" element={<Navigate to="/freelancer/home" replace />} />

            {/* Existing booking flows — protected as client routes */}
            <Route path="/book/:type/:slug" element={<ProtectedRoute requireRole="client"><BookTiming /></ProtectedRoute>} />
            <Route path="/book/:type/:slug/now" element={<ProtectedRoute requireRole="client"><BookNow /></ProtectedRoute>} />
            <Route path="/book/:type/:slug/later" element={<ProtectedRoute requireRole="client"><BookNow /></ProtectedRoute>} />
            <Route path="/book/:type/:slug/posted" element={<ProtectedRoute requireRole="client"><BookPosted /></ProtectedRoute>} />
            <Route path="/online/:slug" element={<ProtectedRoute requireRole="client"><OnlineBrowse /></ProtectedRoute>} />
            <Route path="/orders" element={<ProtectedRoute requireRole="client"><Orders /></ProtectedRoute>} />
            <Route path="/chat" element={<ProtectedRoute><Chat /></ProtectedRoute>} />
            <Route path="/promos" element={<ProtectedRoute requireRole="client"><Promos /></ProtectedRoute>} />
            <Route path="/bulk-booking" element={<ProtectedRoute requireRole="client"><BulkBooking /></ProtectedRoute>} />
            <Route path="/talent/:id" element={<ProtectedRoute><TalentProfile /></ProtectedRoute>} />

            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
