import { Navigate, useLocation } from "react-router-dom";
import { useAuth, AppRole } from "@/contexts/AuthContext";
import { ReactNode } from "react";

interface Props {
  children: ReactNode;
  requireRole?: AppRole;
  /** if true, user must NOT have completed onboarding (for the onboarding pages themselves) */
  requireOnboardingIncomplete?: boolean;
}

const ProtectedRoute = ({ children, requireRole, requireOnboardingIncomplete }: Props) => {
  const { user, role, profile, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-muted-foreground text-xs tracking-[0.3em]">LOADING…</div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  // Has user but no role chosen → role select
  if (!role) {
    return <Navigate to="/auth/role" replace />;
  }

  // Role-restricted route
  if (requireRole && role !== requireRole) {
    return <Navigate to={role === "client" ? "/client/home" : "/freelancer/home"} replace />;
  }

  // Onboarding flow check
  const onboardingPath = role === "client" ? "/onboarding/client" : "/onboarding/freelancer";

  if (!profile?.onboarding_completed && !requireOnboardingIncomplete) {
    return <Navigate to={onboardingPath} replace />;
  }

  if (profile?.onboarding_completed && requireOnboardingIncomplete) {
    return <Navigate to={role === "client" ? "/client/home" : "/freelancer/home"} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
