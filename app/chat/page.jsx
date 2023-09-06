"use client";
import { useState, useEffect, useRef } from "react";
import Pusher from "pusher-js";
import { UserButton, useUser } from "@clerk/nextjs";

export default function Chat() {
  const [messages, setMessages] = useState([]);
  const messageRef = useRef("");
  // const user = useUser()
  const user = { username: "baboulass" } ;
  
  useEffect(() => {

    const pusher = new Pusher(process.env.NEXT_PUBLIC_KEY, {
      cluster: process.env.NEXT_PUBLIC_CLUSTER,
    });

    const channel = pusher.subscribe("chat");

    channel.bind("chat-event", (data) => {
      const { sender, message, sentAt } = data;
      setMessages((messages) => [...messages, { sender, message, sentAt }]);
    });

    return () => {
      pusher.unsubscribe("chat");
    };
  }, []);

  console.log("messages", messages);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const {value} = messageRef.current
    const date = new Date()
const time =
  ("00" + date.getHours()).slice(-2) + ":" +
  ("00" + date.getMinutes()).slice(-2) + ":" +
  ("00" + date.getSeconds()).slice(-2);

    await fetch("/api/pusher", {
      method: "POST",
      body: JSON.stringify({ message: value, sender: user?.username, sentAt: time }),
    });
  };

  return (
    <>
      {user && (
        <div className="flex">
          <p>Hello, {user.username}</p>
          <UserButton />
        </div>
      )}
      <div>
        {messages.map((chat, index) => (
          <div key={index}>
            <p>{chat.message}</p>
            <small>{chat.sender}</small>
            <i>{chat.sentAt}</i>
          </div>
        ))}
      </div>

      <form
        onSubmit={async (e) => {
          await handleSubmit(e);
          messageRef.current.value = ""
        }}
      >
        <input
          type="text"
          ref={messageRef}
          placeholder="start typing...."
        />
        <button type="submit">Send</button>
      </form>
    </>
  );
}
