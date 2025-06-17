"use client";

import { useEffect, useState, useMemo } from "react";
import { LiveKitRoom, VideoConference } from "@livekit/components-react";
import "@livekit/components-styles";
import { useUser } from "@clerk/nextjs";
import { Loader2 } from "lucide-react";

interface MediaRoomProps {
  chatId: string;
  video: boolean;
  audio: boolean;
}

// ✅ Hàm chuẩn hóa identity LiveKit (bắt buộc nên có)
function sanitizeLivekitIdentity(name: string): string {
  return name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9-_~.]/g, "_");
}

export const MediaRoom = ({ chatId, video, audio }: MediaRoomProps) => {
  const { user } = useUser();
  const [token, setToken] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const sanitizedName = useMemo(() => {
    const rawName = `${user?.firstName ?? ""} ${user?.lastName ?? ""}`.trim();
    return sanitizeLivekitIdentity(rawName);
  }, [user]);

  // 🔧 Tách riêng fetch token
  useEffect(() => {
    if (!user) return;

    const fetchToken = async () => {
      try {
        const resp = await fetch(
          `/api/livekit?room=${chatId}&username=${encodeURIComponent(
            sanitizedName
          )}`
        );
        if (!resp.ok) {
          const err = await resp.json();
          throw new Error(err.error || "Failed to fetch token");
        }
        const data = await resp.json();
        setToken(data.token);
      } catch (err: any) {
        console.error(err);
        setError(err.message || "Unexpected error");
      }
    };

    fetchToken();
  }, [chatId, sanitizedName, user]);

  if (error) {
    return (
      <div className="flex flex-col flex-1 justify-center items-center">
        <p className="text-sm text-red-500">{error}</p>
      </div>
    );
  }

  if (!token) {
    return (
      <div className="flex flex-col flex-1 justify-center items-center">
        <Loader2 className="h-7 w-7 text-zinc-500 animate-spin my-4" />
        <p className="text-xs text-zinc-500 dark:text-zinc-400">Loading...</p>
      </div>
    );
  }

  return (
    <LiveKitRoom
      key={chatId} // ✅ mỗi lần vào phòng mới -> re-mount sạch
      data-lk-theme="default"
      serverUrl={process.env.NEXT_PUBLIC_LIVEKIT_URL}
      token={token}
      connect={true}
      video={video}
      audio={audio}
      // ✅ KHÔNG cần disconnect thủ công nữa
    >
      <VideoConference />
    </LiveKitRoom>
  );
};
