"use client";
import { useParams, useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import React, { useState } from "react";
import { verifySchema } from "@/models/verifySchema";
import axios from "axios";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

function Verify() {
  const [message, setMessage] = useState("");
  const form = useForm({
    resolver: zodResolver(verifySchema),
  });
  const router = useRouter();
  const params = useParams();
  const onSubmit = async (data) => {
    try {
      const response = await axios.post("/api/verify-code", {
        username: params.username,
        verifyCode: data.code,
      });
      setMessage(response.data.message);
      router.replace("/sign-in");
    } catch (error) {
      setMessage(error.response.data.message);
    }
  };
  console.log(message);
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
            Verify Your Account
          </h1>
          <p className="mb-4">Enter the verification code sent to your email</p>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              name="code"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Verification Code</FormLabel>
                  <Input {...field} />
                  <p className="text-sm text-black">{message}</p>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">Verify</Button>
          </form>
        </Form>
      </div>
    </div>
  );
}

export default Verify;
