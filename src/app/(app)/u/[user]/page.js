"use client";
import { useParams } from "next/navigation";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Form, FormControl } from "@/components/ui/form";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import messages from "@/suggestMessages.json";
import { useCompletion } from "ai/react";
import {
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { Textarea } from "@/components/ui/textarea";
import axios from "axios";
import { messageSchema } from "@/models/messageSchema";

function SendMessage() {
  const [suggestMessages, setSuggestMessages] = useState(messages);
  const [streamingText, setStreamingText] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const { user: username } = useParams();
  const form = useForm({
    resolver: zodResolver(messageSchema),
    defaultValues: {
      content: "",
    },
  });
  const onSubmit = async (data) => {
    setErrorMsg("");
    try {
      const response = await axios.post("/api/send-message", {
        username,
        content: data.content,
      });
      if (response.status === 200) {
        setErrorMsg("Message Sent successfuly");
      }
      console.log(response);
      form.reset();
      // console.log(response);
    } catch (error) {
      if (error.response.status === 403) {
        setErrorMsg("User is not Accepting Message");
      } else if (error.response.status === 404) {
        setErrorMsg("User not Found");
      } else {
        setErrorMsg("Error in sending Message");
      }
    }
  };
  // streaming text messagese
  // const fetchMessages = async () => {
  //   try {
  //     const response = await axios.post("/api/suggest-messages");
  //     const messages = response.data.message.split("||").map((message) => ({
  //       message: message.trim(),
  //     }));
  //     setSuggestMessages(messages);
  //   } catch (error) {
  //     console.log("Error in suggesting Messages");
  //   }
  // };

  const fetchMessages = async () => {
    try {
      const response = await axios.post("/api/suggest-messages");
      let isFinal = false;

      // Streaming loop
      while (!isFinal) {
        const data = await response.json(); // Get the chunk from the API
        setStreamingText((prevText) => prevText + data.message);
        isFinal = data.isFinal;
      }

      // Process the final message (split into an array)
      if (isFinal) {
        const messages = streamingText.split("||").map((message) => ({
          message: message.trim(),
        }));
        setSuggestMessages(messages);
      }
    } catch (error) {
      console.log("Error in suggesting Messages");
    }
  };

  return (
    <div>
      <h1 className="text-center text-5xl font-bold mt-16">
        Public Profile Link
      </h1>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-6 w-[50%] mt-8 mx-auto"
        >
          <FormField
            name="content"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-semibold text-[1.2rem]">
                  Send Anonymous Message to @{username}
                </FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Write your anonymous message here"
                    {...field}
                    className=" placeholder:text-[1.1rem] text-[1.1rem] font-semibold"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {errorMsg && (
            <p
              className={` ${
                errorMsg === "Message Sent successfuly"
                  ? "text-green-400"
                  : "text-red-400"
              } text-sm`}
            >
              {errorMsg}
            </p>
          )}
          <Button
            className="scale-125 absolute left-[50%] translate-x-[-50%]"
            type="submit"
          >
            Send It
          </Button>
        </form>
      </Form>
      <div className=" w-[50%] mx-auto mt-32">
        <Button onClick={() => fetchMessages()} className="ml-4  scale-125">
          Suggest Messages
        </Button>
        <p className="mt-8 font-semibold text-[1.1rem]">
          Click on any message below to select it
        </p>
        <h1 className="text-3xl font-bold mt-5 mb-5">Message</h1>
        <Table>
          <TableBody className="   border-[3px] rounded-3xl">
            {suggestMessages.map((item, index) => (
              <TableRow key={index}>
                <TableCell className="text-center cursor-pointer font-semibold text-[1.1rem]">
                  {item.message}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

export default SendMessage;
