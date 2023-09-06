"use client";
import { useState, useEffect } from "react";
import Pusher from "pusher-js";
import { UserButton, useUser } from "@clerk/nextjs";

const Chat = () => {
  // const { user } = useUser();
  // console.log("user", user);
  // const { username } = user;
  // console.log("username", username);
  const user = {};
  const username = "baboulass";
  const [chats, setChats] = useState([]);
  const [messageToSend, setMessageToSend] = useState("");

  useEffect(() => {
    const pusher = new Pusher(process.env.NEXT_PUBLIC_KEY, {
      cluster: process.env.NEXT_PUBLIC_CLUSTER,
    });

    const channel = pusher.subscribe("chat");

    channel.bind("chat-event", (data) => {
      console.log("data", data);
      const { sender, message } = data;
      console.log("chat-event");
      setChats((prevState) => [...prevState, { sender, message }]);
    });

    return () => {
      pusher.unsubscribe("chat");
    };
  }, []);

  console.log("chats", chats);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await fetch("/api/pusher", {
      method: "POST",
      body: JSON.stringify({ message: messageToSend, sender: username }),
    });
  };

  return (
    <>
      {user && (
        <div className="flex">
          <p>Hello, {username}</p>
          <UserButton />
        </div>
      )}
      <div>
        {chats.map((chat, index) => (
          <div key={index}>
            <p>{chat.message}</p>
            <small>{chat.sender}</small>
          </div>
        ))}
      </div>

      <form
        onSubmit={(e) => {
          handleSubmit(e);
        }}
      >
        <input
          type="text"
          value={messageToSend}
          onChange={(e) => setMessageToSend(e.target.value)}
          placeholder="start typing...."
        />
        <button type="submit">Send</button>
      </form>
    </>
  );
};

export default Chat;
