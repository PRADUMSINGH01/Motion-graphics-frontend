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
    const assignedPromptId = promptId || `p-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    const assignedUserId = userId || "creator";

    const payload = {
      prompt: trimmed,
      userId: assignedUserId,
      promptId: assignedPromptId,
      template: template || undefined,
    };

    let backendData: any = null;

    // 1. Connect directly to Express Backend API /api/prompt
    try {
      const backendUrl =
        process.env.BACKEND_INTERNAL_URL ||
        process.env.NEXT_PUBLIC_API_URL ||
        "http://localhost:8080";

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 6000);

      const backendRes = await fetch(`${backendUrl.replace(/\/$/, "")}/api/prompt`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      if (backendRes.ok) {
        backendData = await backendRes.json();
      } else {
        console.warn(`[API/Prompt] Backend returned HTTP ${backendRes.status}`);
      }
    } catch (backendErr) {
      console.warn("[API/Prompt] Backend prompt API connection notice (using procedural motion fallback):", backendErr);
    }

    // 2. Extract motion parameters from backend response or generate procedurally
    const lower = trimmed.toLowerCase();

    // Style detection
    let detectedStyle = template || backendData?.motion?.style || "Kinetic Typography";
    if (!backendData?.motion?.style) {
      if (lower.includes("3d") || lower.includes("cube") || lower.includes("isometric") || lower.includes("prism")) {
        detectedStyle = "3D Isometric";
      } else if (lower.includes("logo") || lower.includes("reveal") || lower.includes("badge") || lower.includes("emblem") || lower.includes("brand")) {
        detectedStyle = "Logo Reveal";
      } else if (lower.includes("vfx") || lower.includes("plasma") || lower.includes("abstract") || lower.includes("fluid") || lower.includes("liquid") || lower.includes("smoke")) {
        detectedStyle = "Abstract VFX";
      } else if (lower.includes("ui") || lower.includes("lottie") || lower.includes("audio") || lower.includes("equalizer") || lower.includes("sound") || lower.includes("bars")) {
        detectedStyle = "UI & Lottie";
      }
    }

    // Palette detection
    let detectedPalette = backendData?.motion?.palette || "cyan";
    if (!backendData?.motion?.palette) {
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
    }

    // Rendered text extraction
    let renderedText = backendData?.motion?.renderedText || "";
    if (!renderedText) {
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
    }

    const primaryMotion = {
      promptId: assignedPromptId,
      prompt: trimmed,
      renderedText,
      style: detectedStyle,
      palette: detectedPalette,
      fps: 60,
      duration: 5,
      status: "ready",
    };

    // 3. Construct the primary template + stylistic variation templates for the Grid
    const allStyles: Array<{ category: any; palette: any; label: string }> = [
      { category: detectedStyle, palette: detectedPalette, label: "Primary Synthesis" },
      { category: "Kinetic Typography", palette: detectedPalette === "cyan" ? "purple" : "cyan", label: "Kinetic Motion" },
      { category: "3D Isometric", palette: "amber", label: "3D Perspective" },
      { category: "Logo Reveal", palette: "blue", label: "Vector Reveal" },
      { category: "Abstract VFX", palette: "crimson", label: "Harmonic Plasma" },
      { category: "UI & Lottie", palette: "matrix", label: "UI Audio Lottie" },
    ];

    // Filter to ensure distinct style cards with primary at the top
    const uniqueStyles = allStyles.filter(
      (s, index, self) => index === self.findIndex((o) => o.category === s.category)
    );

    const generatedTemplates = uniqueStyles.map((item, idx) => ({
      id: idx === 0 ? `tmpl-${assignedPromptId}` : `tmpl-${assignedPromptId}-${idx}`,
      name: `${trimmed.length > 24 ? trimmed.slice(0, 24) + "..." : trimmed} [${item.category}]`,
      category: item.category,
      duration: 5,
      prompt: trimmed,
      text: renderedText,
      palette: item.palette,
      fps: 60,
      aspectRatio: "16:9",
      createdAt: new Date().toISOString(),
      jobId: backendData?.job?.id || `job-${Date.now()}-${idx}`,
      isPrimary: idx === 0,
    }));

    return NextResponse.json({
      success: true,
      message: backendData?.message || "Prompt motion generated successfully",
      backendConnected: Boolean(backendData),
      job: backendData?.job || {
        id: `job-${Date.now()}`,
        name: "agent",
        data: payload,
      },
      motion: primaryMotion,
      template: generatedTemplates[0],
      templates: generatedTemplates,
    });
  } catch (err: any) {
    console.error("[API/Prompt] Unexpected error:", err);
    return NextResponse.json(
      { success: false, error: err?.message || "Failed to process prompt" },
      { status: 500 }
    );
  }
}
