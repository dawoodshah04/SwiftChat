import { Navigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';

interface Props {
  children: React.ReactNode;
  requireOnboarded?: boolean;
}

const ProtectedRoute = ({ children, requireOnboarded = true }: Props) => {
  const { isLoading, isAuthenticated, isOnboarded } = useAuth();

  if (isLoading) {
    return (
      <div className="spinner-wrap">
        <div className="spinner" />
      </div>
    );
  }

  if (!isAuthenticated) return <Navigate to="/login" replace />;

  if (requireOnboarded && !isOnboarded) return <Navigate to="/onboarding" replace />;

  return <>{children}</>;
};

export default ProtectedRoute;
