"use server";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";

// Returns a token valid for exactly 15 seconds
export async function getQrToken(meetingId: number) {
  const meeting = await prisma.meeting.findUnique({ where: { id: meetingId } });
  if (!meeting) throw new Error("Meeting not found");
  
  // If no secret exists, generate one
  let secret = meeting.qr_secret;
  if (!secret) {
    secret = crypto.randomBytes(32).toString('hex');
    await prisma.meeting.update({ where: { id: meetingId }, data: { qr_secret: secret } });
  }

  // The time window is the current time divided by 10000ms (10 seconds)
  const timeWindow = Math.floor(Date.now() / 10000);
  
  // Create HMAC signature of meeting_id + timeWindow using the secret
  const hmac = crypto.createHmac("sha256", secret);
  hmac.update(`${meetingId}:${timeWindow}`);
  const signature = hmac.digest("hex");

  return { token: signature, window: timeWindow };
}
