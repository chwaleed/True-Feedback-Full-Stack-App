"use client";
import { useParams } from "next/navigation";
import React from "react";
import { useForm } from "react-hook-form";
import {
  FormField,
  FormControl,
  FormItem,
  FormLabel,
  FormDescription,
  FormMessage,
  Form,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { messageSchema } from "@/models/messageSchema";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
function SendMessage() {
  const { user } = useParams();
  const form = useForm({
    resolver: zodResolver(messageSchema),
  });
  const onSubmit = async () => {
    console.log("Hello");
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
            name="message"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Send Anonymous Message to {user}</FormLabel>
                <Textarea />
                <FormMessage />
              </FormItem>
            )}
          />

          <Button className="" type="submit">
            Sign In
          </Button>
        </form>
      </Form>
    </div>
  );
}

export default SendMessage;
