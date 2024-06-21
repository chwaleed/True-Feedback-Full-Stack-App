"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useDebounceValue } from "usehooks-ts";
import { useRouter } from "next/navigation";
import { signUpSchema } from "@/models/signUpSchema";
import axios from "axios";

function Page() {
  const [username, setUsername] = useState("");
  const [usernameMessage, setUsernameMessage] = useState("");
  const [isLoading, setIsloading] = useState(false);
  const [isSubmiting, setIsSubmiting] = useState(false);
  const router = useRouter();
  const deboundedUsername = useDebounceValue(username, 300);

  // Implementing Zod
  const form = useForm({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
  });

  useEffect(() => {
    const checkUsernameUnique = async () => {
      if (deboundedUsername) {
        setIsloading(true);
        setUsernameMessage("");
        try {
          const respose = await axios.get(
            `/api/check-username-unique?username=${deboundedUsername}`
          );
          setUsernameMessage(respose.data.message);
        } catch (error) {
          console.log("Error in Checking User");
          setUsernameMessage("Error in checking username");
        } finally {
          setIsloading(false);
        }
      }
    };
    checkUsernameUnique();
  }, [deboundedUsername]);

  const onSubmit = async (data) => {
    setIsSubmiting(true);
    try {
      const respose = await axios.post("/api/sign-up", data);
      router.refresh(`/verify/${username}`);
    } catch (error) {
      console.log("Error in singup");
    } finally {
      setIsSubmiting(false);
    }
  };

  return <div>page</div>;
}

export default Page;
