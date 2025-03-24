"use client";
import { useToast } from "@/hooks/use-toast";
import { Message } from "@/model/User";
import axios, { AxiosError } from "axios";


import React, { useEffect, useState } from "react";

const Messagepage = ({ params }: { params: {username:string} }) => {
  const [IsAcceptingMessages, setIsAcceptingMessages] = useState(false);
  const [Message, setMessage] = useState("");
  const username = params.username;
  console.log(username)

  const { toast } = useToast();

  async function fetchData() {
    try {
      const response = await axios.post("/api/send-message", {
        username: username,
        content: Message,
      });
      console.log(response.data);

      toast({
        title: "Message send successfully",
        description: response.data.message || "Message sent successfully",
      });
    } catch (error) {
      const axiosError = error as AxiosError;
      toast({
        title: "error while sending",
        description: axiosError.message || "message didnt sent",
        variant: "destructive",
      });
    }
  }
  useEffect(() => {
    fetchData();
  }, [IsAcceptingMessages]);

  return (
    <div>
      <div>your message input:</div>
      <div>
        <input
          type="text"
          onChange={(e) => {
            setMessage(e.target.value);
          }}
        />
        <button
          className="bg-white text-black w-10 h-11 "
          onClick={fetchData}
        ></button>
      </div>
    </div>
  );
};

export default Messagepage;
