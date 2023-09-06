"use client";
import { useState, useEffect } from "react";
import Pusher from "pusher-js";
import { UserButton, useUser } from "@clerk/nextjs";

const Chat = () => {
  const [user, setUser] = useState(null);
  const [chats, setChats] = useState([]);
  const [messageToSend, setMessageToSend] = useState("");

  useEffect(() => {
    if (process.env.NEXT_PUBLIC_ENV === "prod") {
      const user = useUser();
      setUser(user);
    } else {
      setUser({ username: "baboulass" });
    }

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
      body: JSON.stringify({ message: messageToSend, sender: user?.username }),
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
