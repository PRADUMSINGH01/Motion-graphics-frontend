"use client";

import { Player } from "@remotion/player";
import { JevShort } from "./RemotionRenderer";

export default function RemotionPage() {
  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#111",
      }}
    >
      <Player
        component={JevShort}
        durationInFrames={1800}
        fps={30}
        compositionWidth={1080}
        compositionHeight={1920}
        controls
        loop
        autoPlay
        style={{
          width: 360,
          height: 640,
        }}
      />
    </div>
  );
}