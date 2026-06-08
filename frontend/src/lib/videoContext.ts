// Shared React context for the StreamVideoClient instance.
// Using our own context (instead of useStreamVideoClient from the SDK)
// lets components safely access the client even before StreamVideo provider mounts.

import { createContext, useContext } from 'react';
import type { StreamVideoClient } from '@stream-io/video-react-sdk';

export const VideoClientContext = createContext<StreamVideoClient | null>(null);

/** Safe access to the video client — returns null when not yet initialized. */
export const useVideoClient = () => useContext(VideoClientContext);
