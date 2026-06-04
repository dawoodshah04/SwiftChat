import { StreamChat } from 'stream-chat';

const apiKey = import.meta.env.VITE_STREAM_API_KEY as string;

// Singleton client — call connectUser once per session
const streamClient = StreamChat.getInstance(apiKey || 'placeholder');

export default streamClient;
