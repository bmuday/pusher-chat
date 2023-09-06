import { NextResponse } from "next/server";
import { pusher } from "../../(lib)/pusher";

export async function POST(req) {
  const body = await req.json();
  const { message, sender } = body;
  console.log("body", req.body);
  await pusher.trigger("chat", "chat-event", {
    message,
    sender,
  });

  return NextResponse.json({ message: "Sent!" });
}
