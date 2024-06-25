"use client";
import { useParams } from "next/navigation";
import React from "react";
import { useForm } from "react-hook-form";
import { Form, FormControl } from "@/components/ui/form";
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

export const dynamic = "force-dynamic";

function SendMessage() {
  const { user: username } = useParams();
  const form = useForm({
    resolver: zodResolver(messageSchema),
    defaultValues: {
      content: "",
    },
  });
  const onSubmit = async (data) => {
    try {
      const response = await axios.post("/api/send-message", {
        username,
        content: data.content,
      });
      console.log(response.data.message);
    } catch (error) {
      console.log("Error in sending message");
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
          <Button type="submit">Send It</Button>
        </form>
      </Form>
    </div>
  );
}

export default SendMessage;
