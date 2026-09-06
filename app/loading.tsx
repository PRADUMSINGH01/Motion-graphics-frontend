import React from "react";
import StudioLoadingScreen from "./components/StudioLoadingScreen";

export default function Loading() {
  return <StudioLoadingScreen message="LOADING ANIMAGENT..." subMessage="Synchronizing Motion Canvas & Assets" />;
}
