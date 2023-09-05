import { NextResponse } from "next/server";
import { pusher } from "../../(lib)/pusher";

export async function POST(req, res) {
  const { message, sender } = req.body;
  await pusher.trigger("chat", "chat-event", {
    message,
    sender,
  });

  return NextResponse.json({ message: "Sent!" });
}
