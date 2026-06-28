import { useEffect, useRef, useState } from 'react';
import { StreamVideoClient } from '@stream-io/video-react-sdk';
import axiosInstance from '../lib/axios';
import type { User } from '../types';

/**
 * Initializes and manages a StreamVideoClient for the authenticated user.
 * Re-uses the same /api/chat/token endpoint — Stream uses the same token format
 * for both Chat and Video products.
 */
const useStreamVideo = (authUser: User | null | undefined) => {
  const [videoClient, setVideoClient] = useState<StreamVideoClient | null>(null);
  const clientRef = useRef<StreamVideoClient | null>(null);
  const userIdRef = useRef<string | null>(null);

  useEffect(() => {
    // Still loading
    if (authUser === undefined) return;

    // User explicitly logged out
    if (authUser === null) {
      if (clientRef.current) {
        clientRef.current.disconnectUser().catch(console.error);
        clientRef.current = null;
        userIdRef.current = null;
      }
      setVideoClient(null);
      return;
    }

    let mounted = true;

    const init = async () => {
      // Don't re-initialize if we already have the same user
      if (userIdRef.current === authUser._id) {
        return;
      }

      try {
        const { data } = await axiosInstance.get('/chat/token');
        const { token } = data as { token: string };

        if (!mounted) return;

        // Disconnect old client if switching users
        if (clientRef.current) {
          await clientRef.current.disconnectUser();
        }

        const apiKey = import.meta.env.VITE_STREAM_API_KEY as string;

        const client = new StreamVideoClient({
          apiKey,
          user: {
            id: authUser._id,
            name: authUser.fullname,
            image: authUser.profilePic || undefined,
          },
          token,
        });

        clientRef.current = client;
        userIdRef.current = authUser._id;
        if (mounted) setVideoClient(client);
      } catch (err) {
        console.error('[StreamVideo] Failed to initialize:', err);
      }
    };

    init();

    return () => {
      mounted = false;
      // Do NOT disconnect on unmount. The connection must survive Strict Mode
      // and navigation. Disconnect only on actual logout (handled above).
    };
  }, [authUser?._id]);


  return { videoClient };
};

export default useStreamVideo;
