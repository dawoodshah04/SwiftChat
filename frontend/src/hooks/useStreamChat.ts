import { useEffect, useState } from 'react';
import axiosInstance from '../lib/axios';
import type { User } from '../types';
import streamClient from '../lib/streamClient';

const useStreamChat = (authUser: User | null | undefined) => {
  const [isConnecting, setIsConnecting] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!authUser) return;

    let cancelled = false;

    const connect = async () => {
      try {
        setIsConnecting(true);
        setError(null);

        // Get Stream token from backend
        const res = await axiosInstance.get('/chat/token');
        const { token } = res.data;

        if (cancelled) return;

        // Connect user to Stream Chat (only if not already connected)
        if (streamClient.userID !== authUser._id) {
          await streamClient.connectUser(
            {
              id: authUser._id,
              name: authUser.fullname,
              image: authUser.profilePic || undefined,
            },
            token
          );
        }
      } catch (err) {
        if (!cancelled) setError('Failed to connect to chat');
        console.error('Stream connect error:', err);
      } finally {
        if (!cancelled) setIsConnecting(false);
      }
    };

    connect();

    return () => {
      cancelled = true;
    };
  }, [authUser]);

  // Disconnect on unmount / user logout
  useEffect(() => {
    return () => {
      if (streamClient.userID) {
        streamClient.disconnectUser().catch(console.error);
      }
    };
  }, []);

  return { client: streamClient, isConnecting, error };
};

export default useStreamChat;
