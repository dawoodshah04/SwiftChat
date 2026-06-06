import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axiosInstance from '../lib/axios';
import type { User, FriendRequest, FriendRequestsResponse } from '../types';

// ── Queries ──────────────────────────────────────────────

export const useRecommendedUsers = () =>
  useQuery<User[]>({
    queryKey: ['recommendedUsers'],
    queryFn: async () => {
      const res = await axiosInstance.get('/users');
      return res.data;
    },
  });

export const useFriends = () =>
  useQuery<User[]>({
    queryKey: ['friends'],
    queryFn: async () => {
      const res = await axiosInstance.get('/users/friends');
      return res.data;
    },
  });

export const useFriendRequests = () =>
  useQuery<FriendRequestsResponse>({
    queryKey: ['friendRequests'],
    queryFn: async () => {
      const res = await axiosInstance.get('/users/friend-request');
      return res.data;
    },
  });

export const useOutgoingRequests = () =>
  useQuery<FriendRequest[]>({
    queryKey: ['outgoingRequests'],
    queryFn: async () => {
      const res = await axiosInstance.get('/users/outgoing-friend-request');
      return res.data;
    },
  });

// ── Mutations ─────────────────────────────────────────────

export const useSendFriendRequest = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (userId: string) =>
      axiosInstance.post(`/users/friend-request/${userId}`),
    onSuccess: () => {
      // Refresh all views that show request state
      queryClient.invalidateQueries({ queryKey: ['outgoingRequests'] });
      queryClient.invalidateQueries({ queryKey: ['recommendedUsers'] });
      queryClient.invalidateQueries({ queryKey: ['friendRequests'] });
    },
  });
};

export const useAcceptFriendRequest = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (requestId: string) =>
      axiosInstance.put(`/users/friend-request/${requestId}/accept`),
    onSuccess: () => {
      // Refresh all views affected by acceptance
      queryClient.invalidateQueries({ queryKey: ['friendRequests'] });
      queryClient.invalidateQueries({ queryKey: ['friends'] });
      queryClient.invalidateQueries({ queryKey: ['outgoingRequests'] });
      queryClient.invalidateQueries({ queryKey: ['recommendedUsers'] });
    },
  });
};
