/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect } from "react";
import { Mic, MicOff, PhoneOff, Loader2, Activity } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns"; // Replaced custom util with date-fns
import { vapi } from "@/lib/vapi.sdk";
import { configureAssistant } from "@/lib/vapi.config";
import { ClayCard, ClayButton } from "@/components/ui-lora/Clay";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

interface AgentProps {
  userId: string;
  userName: string | null;
}

type AgentStatus = "idle" | "connecting" | "active" | "speaking" | "listening";

const Agent = ({ userId, userName }: AgentProps) => {
  const [status, setStatus] = useState<AgentStatus>("idle");
  const [isMicOn, setIsMicOn] = useState(true);
  const [transcript, setTranscript] = useState("Ready to sync...");
  const [volumeLevel, setVolumeLevel] = useState(0);
  const [secondsActive, setSecondsActive] = useState(0);

  // --- VAPI EVENT LISTENERS ---
  useEffect(() => {
    const onCallStart = () => {
      setStatus("active");
      setSecondsActive(0);
      toast.success("Connected to Kognit Brain");
    };

    const onCallEnd = () => {
      setStatus("idle");
      setTranscript("Call ended.");
      setSecondsActive(0);
    };

    const onSpeechStart = () => setStatus("listening");
    const onSpeechEnd = () => setStatus("speaking");

    const onMessage = (message: any) => {
      if (message.type === "transcript") {
        setTranscript(message.transcript);
      }
    };

    const onVolumeLevel = (volume: number) => setVolumeLevel(volume);

    vapi.on("call-start", onCallStart);
    vapi.on("call-end", onCallEnd);
    vapi.on("speech-start", onSpeechStart);
    vapi.on("speech-end", onSpeechEnd);
    vapi.on("message", onMessage);
    vapi.on("volume-level", onVolumeLevel);

    return () => {
      vapi.stop();
      vapi.removeAllListeners();
    };
  }, []);

  // Timer logic using date-fns pattern
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (status !== "idle") {
      interval = setInterval(() => {
        setSecondsActive((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [status]);

  const startCall = async () => {
    setStatus("connecting");
    try {
      // Pass Buddy or User name to assistant config
      const config = configureAssistant(userId, userName || "Buddy");
      await vapi.start(config);
    } catch (e) {
      console.log("Vapi Connection Error:", e);
      toast.error("Vapi connection failed");
      setStatus("idle");
    }
  };

  const endCall = () => {
    vapi.stop();
    setStatus("idle"); // Manually force idle state
    setTranscript("Ready to sync...");
    setSecondsActive(0); // Reset timer
    setVolumeLevel(0);
  };

  const toggleMic = () => {
    setIsMicOn(!isMicOn);
    vapi.setMuted(isMicOn);
  };

  // Clay Visual Logic
  const getOrbScale = () => {
    if (status === "idle") return 1;
    return 1 + volumeLevel * 1.5;
  };

  return (
    <ClayCard className="p-8 md:p-12 text-center space-y-10 relative overflow-hidden">
      {/* Visual Activity Monitor */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <div
            className={cn(
              "h-2 w-2 rounded-full",
              status === "idle" ? "bg-muted" : "bg-emerald-500 animate-pulse",
            )}
          />
          <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
            {status}
          </span>
        </div>
        <div className="clay-pill px-3 py-1 text-[10px] font-mono font-bold">
          {format(secondsActive * 1000, "mm:ss")}
        </div>
      </div>

      {/* Main Interactive Orb */}
      <div className="relative mx-auto w-40 h-40 flex items-center justify-center">
        <AnimatePresence>
          {status !== "idle" && (
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{
                opacity: [0.1, 0.3, 0.1],
                scale: getOrbScale(),
              }}
              className="absolute inset-0 bg-primary rounded-full blur-2xl"
            />
          )}
        </AnimatePresence>

        <div className="clay-pill w-32 h-32 flex items-center justify-center relative z-10 bg-background">
          {status === "connecting" ? (
            <Loader2 className="w-12 h-12 text-primary animate-spin" />
          ) : (
            <Activity
              className={cn(
                "w-12 h-12 transition-colors",
                status === "idle" ? "text-muted-foreground/30" : "text-primary",
              )}
            />
          )}
        </div>
      </div>

      {/* Transcript Area */}
      <div className="min-h-[80px] flex items-center justify-center">
        <p
          className={cn(
            "text-lg font-bold tracking-tight transition-all duration-300",
            status === "idle" ? "text-muted-foreground/40" : "text-foreground",
          )}
        >
          {status === "idle"
            ? "Start a session to talk to Kognit"
            : `"${transcript}"`}
        </p>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-6 pt-4">
        {status === "idle" ? (
          <ClayButton
            onClick={startCall}
            className="px-10 py-6 flex items-center gap-3"
          >
            <Mic className="w-5 h-5" />
            <span className="text-lg">Start Call</span>
          </ClayButton>
        ) : (
          <>
            <button
              onClick={toggleMic}
              className={cn(
                "clay-button p-4 transition-all",
                !isMicOn && "text-destructive",
              )}
            >
              {isMicOn ? (
                <Mic className="w-6 h-6" />
              ) : (
                <MicOff className="w-6 h-6" />
              )}
            </button>
            <ClayButton
              onClick={endCall}
              className="bg-destructive text-destructive-foreground px-8 py-4 flex items-center gap-2"
            >
              <PhoneOff className="w-5 h-5" />
              <span>End Call</span>
            </ClayButton>
          </>
        )}
      </div>
    </ClayCard>
  );
};

export default Agent;
