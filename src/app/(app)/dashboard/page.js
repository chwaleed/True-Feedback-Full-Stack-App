"use client";
import React, { useState } from "react";

function Dashboard() {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSwitchLoading, setIsSwitchLoading] = useState(false);
  // Delete Message Fuction
  const handleDeleteMessage = (messageId) => {
    setMessages(messages.filter((message) => message._id !== messageId));
  };
  return <div>Dashboard</div>;
}

export default Dashboard;
