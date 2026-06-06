import {StreamChat} from 'stream-chat';
import dotenv from 'dotenv/config';

const apiKey = process.env.STREAM_API_KEY;
const apiSecret = process.env.STREAM_SECRET_KEY;

if (!apiKey || !apiSecret) {
    throw new Error('Stream API key and secret key must be set in environment variables');
}

const streamClient = StreamChat.getInstance(apiKey, apiSecret);

export const upsertStreamUser = async (userData) => {
    try {
        await streamClient.upsertUser(userData);
        return userData
    } catch (error) {
        console.log('Error in creating Stream user:',error)
    }
}


export async function generateStreamToken(userId){
    try {
        return streamClient.createToken(userId.toString());
    } catch (error) {
        console.log(`Error in generateStreamToken ${error.message}`);
    }
}