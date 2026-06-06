import { useQuery } from '@tanstack/react-query';
import axiosInstance from '../lib/axios';
import type { User } from '../types';

const fetchAuthUser = async (): Promise<User | null> => {
  try {
    const res = await axiosInstance.get('/auth/me');
    return res.data.user as User;
  } catch {
    return null;
  }
};

const useAuth = () => {
  const { data: authUser, isLoading } = useQuery<User | null>({
    queryKey: ['authUser'],
    queryFn: fetchAuthUser,
    retry: false,
    staleTime: 5 * 60 * 1000,
  });

  const isAuthenticated = !!authUser;
  const isOnboarded = !!authUser?.isOnboarded;

  return { authUser, isLoading, isAuthenticated, isOnboarded };
};

export default useAuth;
