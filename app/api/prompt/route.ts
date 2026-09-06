import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { prompt, userId, promptId, template } = body || {};

    if (!prompt || typeof prompt !== "string" || !prompt.trim()) {
      return NextResponse.json(
        { success: false, error: "Prompt is required" },
        { status: 400 }
      );
    }

    const trimmed = prompt.trim();
    const lower = trimmed.toLowerCase();

    // Intelligent Style Detection from Prompt
    let detectedStyle = template || "Kinetic Typography";
    if (lower.includes("3d") || lower.includes("cube") || lower.includes("isometric") || lower.includes("prism")) {
      detectedStyle = "3D Isometric";
    } else if (lower.includes("logo") || lower.includes("reveal") || lower.includes("badge") || lower.includes("emblem") || lower.includes("brand")) {
      detectedStyle = "Logo Reveal";
    } else if (lower.includes("vfx") || lower.includes("plasma") || lower.includes("abstract") || lower.includes("fluid") || lower.includes("liquid") || lower.includes("smoke")) {
      detectedStyle = "Abstract VFX";
    } else if (lower.includes("ui") || lower.includes("lottie") || lower.includes("audio") || lower.includes("equalizer") || lower.includes("sound") || lower.includes("bars")) {
      detectedStyle = "UI & Lottie";
    }

    // Intelligent Color Palette Detection
    let detectedPalette = "cyan";
    if (lower.includes("purple") || lower.includes("violet") || lower.includes("magenta") || lower.includes("pink")) {
      detectedPalette = "purple";
    } else if (lower.includes("amber") || lower.includes("gold") || lower.includes("yellow") || lower.includes("solar") || lower.includes("orange")) {
      detectedPalette = "amber";
    } else if (lower.includes("matrix") || lower.includes("emerald") || lower.includes("green")) {
      detectedPalette = "matrix";
    } else if (lower.includes("crimson") || lower.includes("flame") || lower.includes("fire") || lower.includes("ruby") || lower.includes("red")) {
      detectedPalette = "crimson";
    } else if (lower.includes("blue") || lower.includes("ocean") || lower.includes("sky")) {
      detectedPalette = "blue";
    }

    // Text Extraction
    let renderedText = "";
    const quoteMatch = trimmed.match(/["']([^"']{1,32})["']/);
    if (quoteMatch && quoteMatch[1]?.trim()) {
      renderedText = quoteMatch[1].trim().toUpperCase();
    } else {
      const kwMatch = trimmed.match(/\b(?:text|title|word|for|brand|named|saying):\s*([a-zA-Z0-9_-]{1,32})\b/i);
      if (kwMatch && kwMatch[1]?.trim()) {
        renderedText = kwMatch[1].trim().toUpperCase();
      } else {
        renderedText = trimmed.toUpperCase().slice(0, 24);
      }
    }

    const assignedPromptId = promptId || `p-${Date.now()}`;
    const assignedUserId = userId || "creator";

    return NextResponse.json({
      success: true,
      message: "Prompt processed successfully",
      job: {
        id: `job-${Date.now()}`,
        name: "agent",
        data: {
          prompt: trimmed,
          userId: assignedUserId,
          promptId: assignedPromptId,
        },
      },
      motion: {
        promptId: assignedPromptId,
        prompt: trimmed,
        renderedText,
        style: detectedStyle,
        palette: detectedPalette,
        fps: 60,
        duration: 5,
        status: "ready",
      },
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err?.message || "Failed to process prompt" },
      { status: 500 }
    );
  }
}
