import { NextResponse } from "next/server";
import { pusher } from "../../(lib)/pusher";

export async function POST(req) {
  const body = await req.json();
  const { message, sender, sentAt } = body;
  
  await pusher.trigger("chat", "chat-event", {
    message,
    sender,
    sentAt
  });

  return NextResponse.json({ message: "Sent!" });
}
