import axios from "axios";

const WEBHOOK_URL = import.meta.env.VITE_N8N_WEBHOOK_URL;

export async function sendMessageToN8n(message, name) {
  try {
    const res = await axios.post(
      WEBHOOK_URL ,
      { message, name }
    );
    return res.data;
  } catch (err) {    
    throw err;
  }
}
