import { OAuth2Client } from "google-auth-library";
import { envVariables } from "../config/envVariables.js";

const client = new OAuth2Client(envVariables.GOOGLE_CLIENT_ID);

export const verifyGoogleToken = async (idToken) => {
  if (!idToken) throw new Error("No idToken provided");

  const ticket = await client.verifyIdToken({
    idToken,
    audience: envVariables.GOOGLE_CLIENT_ID,
  });

  const payload = ticket.getPayload();

  return {
    googleId: payload.sub,
    email: payload.email,
    name: payload.name,
    avatar: payload.picture,
    email_verified: payload.email_verified,
  };
};
