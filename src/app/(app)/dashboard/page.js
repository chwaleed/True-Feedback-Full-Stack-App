"use client";
import { acceptMessageSchema } from "@/models/acceptMessageSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSession } from "next-auth/react";
import React, { useCallback, useState } from "react";
import { useForm } from "react-hook-form";

function Dashboard() {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSwitchLoading, setIsSwitchLoading] = useState(false);
  // Delete Message Fuction
  const handleDeleteMessage = (messageId) => {
    setMessages(messages.filter((message) => message._id !== messageId));
  };
  const { data: session } = useSession();
  const form = useForm({
    resolver: zodResolver(acceptMessageSchema),
  });
  const { register, watch, setValue } = form;
  const acceptMessages = watch("acceptMessages");
  const fetchAcceptMessages = useCallback(
    async () => {
      setIsSwitchLoading(true);
      try {
        const response = await axios.get("/api/accept-messages");
        setValue("acceptMessages", response.data.isAcceptingMessages);
      } catch (error) {
        console.log("Failed to fetch message settings");
      } finally {
        setIsSwitchLoading(false);
      }
    },
    { setValue }
  );
  const fetchMessages = useCallback(
    async (refresh = false) => {
      setIsLoading(true);
      setIsSwitchLoading(false);
      try {
        const response = await axios.get("/api/get-messages");
        setMessages(response.data.messages || []);
        if (refresh) {
          console.log("Message Refresed");
        }
      } catch (error) {
        console.log("Faliled to fetch Messages");
      } finally {
        setIsLoading(false);
        setIsSwitchLoading(false);
      }
    },
    [setIsLoading, setMessages]
  );

  const handleSwitchChange = async () => {
    try {
      const response = await axios.post("/api/accept-messages", {
        acceptMessages: !acceptMessages,
      });
      setValue("acceptMessages", !acceptMessages);
      console.log(response.data.message);
    } catch (error) {
      console.log("Failed to update message settings");
    }
  };
  return <div>Dashboard</div>;
}

export default Dashboard;
