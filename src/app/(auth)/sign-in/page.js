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
          await axios.get(
            `/api/check-username-unique?username=${deboundedUsername}`
          );
        } catch (error) {}
      }
    };
  }, [deboundedUsername]);

  return <div>page</div>;
}

export default Page;
