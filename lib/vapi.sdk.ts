import Vapi from "@vapi-ai/web";

const token = process.env.NEXT_PUBLIC_VAPI_API_KEY;

if (!token) {
  console.error("VAPI Web Token is undefined!");
}

export const vapi = new Vapi(token!);
