import Pusher from "pusher";
import { NextResponse } from "next/server";

export const pusher = new Pusher({
  appId: process.env.app_id,
  key: process.env.key,
  secret: process.env.secret,
  cluster: process.env.cluster,
  useTLS: true,
});

export default async function POST(req, res) {
  const { message, sender } = req.body;
  await pusher.trigger("chat", "chat-event", {
    message,
    sender,
  });

  return NextResponse.json({ message: "Sent!" });
}
