import { useEffect, useState } from 'react';
import axiosInstance from '../lib/axios';
import type { User } from '../types';
import streamClient from '../lib/streamClient';

const useStreamChat = (authUser: User | null | undefined) => {
  // Start as "already connected" to avoid flash of loading spinner on re-mount
  const [isConnecting, setIsConnecting] = useState(
    () => !streamClient.userID || streamClient.userID !== (authUser?._id ?? ''),
  );
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Still loading auth state
    if (authUser === undefined) return;

    // User explicitly logged out
    if (authUser === null) {
      if (streamClient.userID) {
        streamClient.disconnectUser().catch(console.error);
      }
      setIsConnecting(false);
      return;
    }

    // Already connected as the same user — nothing to do
    if (streamClient.userID === authUser._id) {
      setIsConnecting(false);
      return;
    }

    let cancelled = false;

    const connect = async () => {
      try {
        setIsConnecting(true);
        setError(null);

        const res = await axiosInstance.get('/chat/token');
        const { token } = res.data as { token: string };
        if (cancelled) return;

        // Disconnect a different user if one was connected (user switch)
        if (streamClient.userID && streamClient.userID !== authUser._id) {
          await streamClient.disconnectUser();
        }
        if (cancelled) return;

        await streamClient.connectUser(
          {
            id: authUser._id,
            name: authUser.fullname,
            image: authUser.profilePic || undefined,
          },
          token,
        );
      } catch (err) {
        if (!cancelled) setError('Failed to connect to chat');
        console.error('Stream chat connect error:', err);
      } finally {
        if (!cancelled) setIsConnecting(false);
      }
    };

    connect();

    return () => {
      cancelled = true;
      // ⚠️ Do NOT disconnect on unmount. The chat connection must survive navigation
      // (e.g. user goes to /call/:callId and comes back). Disconnection only happens
      // in the !authUser branch above, which fires on actual logout.
    };
  }, [authUser?._id]);

  return { client: streamClient, isConnecting, error };
};

export default useStreamChat;
