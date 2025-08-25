"use client";

import { MessageCard } from "@/components/MessageCard";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { Message } from "@/model/User";
import { acceptMessageValidationSchema } from "@/schemas/acceptMessageSchema";
import { ApiResponse } from "@/types/ApiResponse";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { Loader2, RefreshCcw } from "lucide-react";
import { User } from "next-auth";
import { useSession } from "next-auth/react";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";

const Dashboard = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isloading, setIsLoading] = useState<boolean>(false);
  const [isSwitchLoading, setIsSwitchLoading] = useState<boolean>(false);
  const { toast } = useToast();

  const handleDeleteMessage = (messageId: string) => {
    setMessages(messages.filter((message) => message.id !== messageId));
  };

  const { data: session } = useSession();
  const form = useForm({
    resolver: zodResolver(acceptMessageValidationSchema),
  });

  const { register, watch, setValue } = form;
  const acceptMessages = watch("acceptMessages");

  const fetchAcceptMessages = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await axios.get<ApiResponse>("/api/accept-messages");
      setValue("acceptMessages", response.data.isAcceptingMessages);
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title: "Error",
        description:
          axiosError.response?.data.message ||
          "failed to fetch message settings",
        variant: "destructive",
      });
    } finally {
      setIsSwitchLoading(false);
    }
  }, []);

  const fetchMessages = useCallback(
    async (refresh: boolean = false) => {
      setIsLoading(true);
      setIsSwitchLoading(false);
      try {
        const response = await axios.get<ApiResponse>("/api/get-message");
        setMessages(response.data.messages || []);
        if (refresh) {
          toast({
            title: "Success",
            description: "Messages refreshed",
          });
        }
      } catch (error) {
        const axiosError = error as AxiosError<ApiResponse>;
        toast({
          title: "Error",
          description:
            axiosError.response?.data.message || "failed to fetch messages",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
        setIsSwitchLoading(false);
      }
    },
    [setIsLoading, setMessages]
  );

  useEffect(() => {
    if (!session || !session.user) {
      return;
    }
    fetchMessages();
    fetchAcceptMessages();
    return () => {};
  }, [session, setValue, fetchAcceptMessages, fetchMessages]);

  const handleSwitchChange = async () => {
    try {
      const response = await axios.post<ApiResponse>("/api/accept-messages", {
        acceptMessages: !acceptMessages,
      });
      setValue("acceptMessages", !acceptMessages);
      toast({
        title: response.data.message,
        variant: "default",
      });
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title: "Error",
        description:
          axiosError.response?.data.message ||
          "failed to fetch message settings",
        variant: "destructive",
      });
    }
  };

  if (!session || !session.user) {
    return <div></div>;
  }

  const { username } = session?.user as User;
  const baseurl = `${window.location.protocol}//${window.location.host}`;
  const profileUrl = `${baseurl}/u/${username}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(profileUrl);
    toast({
      title: "URL copied",
      description: "Profile URL has been copied",
    });
  };

  return (
    <div className="pt-20 md:pt-28 min-h-screen w-full px-4 sm:px-6">
      <div className="my-6 max-sm:mt-20 pt-20 sm:pt-8  mx-auto p-6 sm:p-8 bg-background border border-primary/20 rounded-2xl shadow-lg backdrop-blur-sm w-full max-w-6xl">
        <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-center md:text-left">
          User Dashboard
        </h1>

        {/* Copy Link */}
        <div className="mb-6">
          <h2 className="text-base sm:text-lg font-semibold mb-3 text-center md:text-left">
            Copy Your Unique Link
          </h2>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
            <input
              type="text"
              value={profileUrl}
              disabled
              className="w-full rounded-xl border border-input bg-muted px-3 py-2 text-sm shadow-sm focus:outline-none"
            />
            <Button
              onClick={copyToClipboard}
              className="rounded-xl w-full sm:w-auto"
            >
              Copy
            </Button>
          </div>
        </div>

        {/* Accept Messages Switch */}
        <div className="flex flex-col sm:flex-row items-center gap-3 mb-6">
          <Switch
            {...register("acceptMessages")}
            checked={acceptMessages}
            onCheckedChange={handleSwitchChange}
            disabled={isSwitchLoading}
          />
          <span className="text-sm font-medium">
            Accept Messages:{" "}
            <span className="font-semibold">
              {acceptMessages ? "On" : "Off"}
            </span>
          </span>
        </div>

        <Separator />

        {/* Refresh Button */}
        <div className="flex justify-center md:justify-start">
          <Button
            className="mt-6 rounded-xl w-full sm:w-auto"
            variant="outline"
            onClick={(e) => {
              e.preventDefault();
              fetchMessages(true);
            }}
          >
            {isloading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <RefreshCcw className="h-4 w-4" />
            )}
          </Button>
        </div>

        {/* Messages Grid */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {messages.length > 0 ? (
            messages.map((messages, index) => (
              <MessageCard
                key={index}
                message={messages}
                onMessageDelete={handleDeleteMessage}
              />
            ))
          ) : (
            <p className="text-muted-foreground text-center md:text-left">
              No messages to display.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
