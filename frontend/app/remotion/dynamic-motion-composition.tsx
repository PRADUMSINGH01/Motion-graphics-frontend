import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";

export interface MotionLayerStyle {
  fontFamily?: string | null;
  fontSize?: number | null;
  fontWeight?: number | string | null;
  lineHeight?: number | null;
  letterSpacing?: number | null;
  color?: string | null;
  background?: string | null;
  textTransform?: "none" | "uppercase" | "lowercase" | "capitalize" | string | null;
  width?: number | null;
  height?: number | null;
  borderRadius?: number | null;
  border?: string | null;
  boxShadow?: string | null;
  glowColor?: string | null;
  filter?: string | null;
  stroke?: string | null;
  strokeWidth?: number | null;
}

export interface MotionLayerLayout {
  x: number;
  y: number;
  width?: number;
  height?: number;
  align?: "left" | "center" | "right";
}

export interface MotionLayer {
  id: string;
  type: "text" | "shape" | "container";
  content?: string | null;
  split?: "chars" | "words" | "lines" | null;
  shape?: "line" | "rect" | "circle" | "svg" | null;
  style?: MotionLayerStyle;
  layout: MotionLayerLayout;
}

export interface MotionAnimation {
  id?: string;
  target: string;
  method?: "set" | "to" | "from" | "fromTo";
  duration: number;
  delay: number;
  stagger?: number;
  from?: Record<string, any>;
  to?: Record<string, any>;
  ease?: string;
  transformOrigin?: string;
}

export interface MotionGraphicsSchema {
  template_id?: string;
  name?: string;
  category?: string;
  composition: {
    width: number;
    height: number;
    fps: number;
    duration: number;
    background: string;
  };
  layers: MotionLayer[];
  timeline: {
    defaults?: {
      ease?: string;
    };
    animations: MotionAnimation[];
  };
}

export interface DynamicMotionProps {
  schema?: MotionGraphicsSchema;
}

function getEaseFunction(easeName = "power2.out"): (t: number) => number {
  const name = (easeName || "power2.out").toLowerCase().trim();

  // Linear
  if (name.startsWith("none") || name.startsWith("linear")) {
    return (t) => t;
  }

  // Back.out
  if (name.startsWith("back.out")) {
    const match = name.match(/back\.out\(([\d.]+)\)/);
    const s = match ? parseFloat(match[1]) : 1.70158;
    return (t) => {
      const p = t - 1;
      return p * p * ((s + 1) * p + s) + 1;
    };
  }

  // Elastic.out
  if (name.startsWith("elastic.out")) {
    return (t) => {
      if (t === 0) return 0;
      if (t === 1) return 1;
      const p = 0.3;
      return Math.pow(2, -10 * t) * Math.sin(((t - p / 4) * (2 * Math.PI)) / p) + 1;
    };
  }

  // Bounce.out
  if (name.startsWith("bounce.out")) {
    return (t) => {
      const n1 = 7.5625;
      const d1 = 2.75;
      if (t < 1 / d1) {
        return n1 * t * t;
      } else if (t < 2 / d1) {
        const p = t - 1.5 / d1;
        return n1 * p * p + 0.75;
      } else if (t < 2.5 / d1) {
        const p = t - 2.25 / d1;
        return n1 * p * p + 0.9375;
      } else {
        const p = t - 2.625 / d1;
        return n1 * p * p + 0.984375;
      }
    };
  }

  // Power / Quad / Cubic / Quart / Quint
  if (name.startsWith("power1.out") || name.startsWith("quad.out")) {
    return (t) => 1 - Math.pow(1 - t, 2);
  }
  if (name.startsWith("power2.out") || name.startsWith("cubic.out")) {
    return (t) => 1 - Math.pow(1 - t, 3);
  }
  if (name.startsWith("power3.out") || name.startsWith("quart.out")) {
    return (t) => 1 - Math.pow(1 - t, 4);
  }
  if (name.startsWith("power4.out") || name.startsWith("strong.out") || name.startsWith("quint.out")) {
    return (t) => 1 - Math.pow(1 - t, 5);
  }

  if (name.startsWith("power1.in")) return (t) => Math.pow(t, 2);
  if (name.startsWith("power2.in")) return (t) => Math.pow(t, 3);
  if (name.startsWith("power3.in")) return (t) => Math.pow(t, 4);
  if (name.startsWith("power4.in")) return (t) => Math.pow(t, 5);

  if (name.startsWith("power1.inout")) {
    return (t) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);
  }
  if (name.startsWith("power2.inout")) {
    return (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
  }
  if (name.startsWith("sine.inout")) {
    return (t) => -(Math.cos(Math.PI * t) - 1) / 2;
  }
  if (name.startsWith("sine.out")) {
    return (t) => Math.sin((t * Math.PI) / 2);
  }
  if (name.startsWith("expo.out")) {
    return (t) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t));
  }

  // Default fallback: smooth ease-out
  return (t) => 1 - Math.pow(1 - t, 3);
}

// -------------------------------------------------------------
// Default Property Rest Values
// -------------------------------------------------------------
function getPropertyDefault(key: string): number {
  if (key === "opacity") return 1;
  if (key === "scale" || key === "scaleX" || key === "scaleY") return 1;
  return 0; // x, y, z, rotate, skew, blur, etc.
}

// -------------------------------------------------------------
// Number & Unit Interpolation
// -------------------------------------------------------------
function interpolateProp(key: string, fromVal: any, toVal: any, progress: number): any {
  if (fromVal === undefined && toVal === undefined) return undefined;

  // If one side is missing, supply appropriate rest default
  const defaultVal = getPropertyDefault(key);
  const effectiveFrom = fromVal !== undefined ? fromVal : defaultVal;
  const effectiveTo = toVal !== undefined ? toVal : defaultVal;

  if (typeof effectiveFrom === "number" && typeof effectiveTo === "number") {
    return effectiveFrom + (effectiveTo - effectiveFrom) * progress;
  }

  // String units like '100px', '45deg', '1.5em'
  const unitRegex = /^(-?[\d.]+)([a-zA-Z%]*)$/;
  const mFrom = String(effectiveFrom).match(unitRegex);
  const mTo = String(effectiveTo).match(unitRegex);
  if (mFrom && mTo && mFrom[2] === mTo[2]) {
    const nFrom = parseFloat(mFrom[1]);
    const nTo = parseFloat(mTo[1]);
    const curr = nFrom + (nTo - nFrom) * progress;
    return `${curr}${mFrom[2]}`;
  }

  return progress >= 1 ? effectiveTo : effectiveFrom;
}

// -------------------------------------------------------------
// Target Selector Matching Logic
// -------------------------------------------------------------
function matchTarget(target: string, layerId: string, subType: "layer" | "word" | "char"): boolean {
  if (!target) return false;
  const t = target.trim().toLowerCase();
  const id = layerId.trim().toLowerCase();
  const idNoPrefix = id.replace(/^[#.]/, "");

  const isWordTarget = t.includes(".word") || t.includes("span");
  const isCharTarget = t.includes(".char");

  if (subType === "layer") {
    // Container layer should NOT consume sub-element animations (.word, .char)
    if (isWordTarget || isCharTarget) return false;
    return (
      t === `#${idNoPrefix}` ||
      t === `.${idNoPrefix}` ||
      t === idNoPrefix ||
      t === "*" ||
      t === "all"
    );
  }

  if (subType === "word") {
    return (
      t.includes(".word") ||
      t === `span` ||
      t === `#${idNoPrefix} span` ||
      t === `#${idNoPrefix} .word` ||
      t === `.${idNoPrefix} .word` ||
      t === `${idNoPrefix} .word`
    );
  }

  if (subType === "char") {
    return (
      t.includes(".char") ||
      t === `#${idNoPrefix} .char` ||
      t === `.${idNoPrefix} .char` ||
      t === `${idNoPrefix} .char`
    );
  }

  return false;
}

// Compute active animated properties for a target at the current time
function computeAnimatedStyles(
  layerId: string,
  subType: "layer" | "word" | "char",
  animations: MotionAnimation[],
  currentTime: number,
  itemIndex = 0
): Record<string, any> {
  const result: Record<string, any> = {};

  const matchingAnims = animations.filter((a) => matchTarget(a.target, layerId, subType));

  for (const anim of matchingAnims) {
    const staggerDelay = (anim.stagger || 0) * itemIndex;
    const startTime = (anim.delay || 0) + staggerDelay;
    const duration = anim.duration || 0.0001;
    const endTime = startTime + duration;

    let progress = 0;
    if (currentTime <= startTime) {
      progress = 0;
    } else if (currentTime >= endTime) {
      progress = 1;
    } else {
      const rawProgress = (currentTime - startTime) / duration;
      const easeFn = getEaseFunction(anim.ease || "power2.out");
      progress = easeFn(Math.max(0, Math.min(1, rawProgress)));
    }

    const fromProps = anim.from || {};
    const toProps = anim.to || {};
    const allKeys = Array.from(new Set([...Object.keys(fromProps), ...Object.keys(toProps)]));

    for (const key of allKeys) {
      const f = fromProps[key];
      const t = toProps[key];
      result[key] = interpolateProp(key, f, t, progress);
    }
  }

  return result;
}

// -------------------------------------------------------------
// Component: Single Layer Renderer
// -------------------------------------------------------------
const LayerItem: React.FC<{
  layer: MotionLayer;
  animations: MotionAnimation[];
  currentTime: number;
}> = ({ layer, animations, currentTime }) => {
  const layerAnim = computeAnimatedStyles(layer.id, "layer", animations, currentTime, 0);

  // Compute base transforms
  const x = layerAnim.x ?? layerAnim.translateX ?? 0;
  const y = layerAnim.y ?? layerAnim.translateY ?? 0;
  const z = layerAnim.z ?? layerAnim.translateZ ?? 0;
  const scale = layerAnim.scale ?? 1;
  const scaleX = layerAnim.scaleX ?? 1;
  const scaleY = layerAnim.scaleY ?? 1;
  const rotate = layerAnim.rotate ?? layerAnim.rotateZ ?? 0;
  const rotateX = layerAnim.rotateX ?? 0;
  const rotateY = layerAnim.rotateY ?? 0;
  const skewX = layerAnim.skewX ?? 0;
  const skewY = layerAnim.skewY ?? 0;

  const opacity = layerAnim.opacity !== undefined ? layerAnim.opacity : 1;
  const blur = layerAnim.blur ? `blur(${layerAnim.blur}px)` : "";

  const align = layer.layout.align || "center";
  const anchorTranslate =
    align === "center"
      ? "translate(-50%, -50%)"
      : align === "right"
      ? "translate(-100%, -50%)"
      : "translate(0%, -50%)";

  const containerStyle: React.CSSProperties = {
    position: "absolute",
    left: `${layer.layout.x ?? 960}px`,
    top: `${layer.layout.y ?? 540}px`,
    width: layer.layout.width ? `${layer.layout.width}px` : "max-content",
    maxWidth: "90%",
    transform: `${anchorTranslate} translate3d(${x}px, ${y}px, ${z}px) scale(${scale * scaleX}, ${scale * scaleY}) rotate(${rotate}deg) rotateX(${rotateX}deg) rotateY(${rotateY}deg) skew(${skewX}deg, ${skewY}deg)`,
    transformOrigin: layerAnim.transformOrigin || "50% 50%",
    opacity,
    filter: blur || layer.style?.filter || undefined,
    color: layerAnim.color || layer.style?.color || "#ffffff",
    backgroundColor: layerAnim.backgroundColor || layer.style?.background || undefined,
    fontFamily: layer.style?.fontFamily || "'Montserrat', 'Arial Black', sans-serif",
    fontSize: layer.style?.fontSize ? `${layer.style.fontSize}px` : "56px",
    fontWeight: layer.style?.fontWeight || 800,
    letterSpacing: layer.style?.letterSpacing ? `${layer.style.letterSpacing}px` : "2px",
    lineHeight: layer.style?.lineHeight ? `${layer.style.lineHeight}` : 1.1,
    textTransform: (layer.style?.textTransform as any) || "none",
    textAlign: align,
    borderRadius: layer.style?.borderRadius ? `${layer.style.borderRadius}px` : undefined,
    border: layer.style?.border || undefined,
    boxShadow: layer.style?.boxShadow || undefined,
    textShadow: "0 4px 24px rgba(0,0,0,0.6)",
    willChange: "transform, opacity",
    boxSizing: "border-box",
  };

  // Render Split Text (Chars or Words)
  if (layer.type === "text" && layer.split && layer.content) {
    const isChars = layer.split === "chars";
    const items = isChars ? layer.content.split("") : layer.content.split(" ");
    const subType = isChars ? "char" : "word";

    return (
      <div style={containerStyle}>
        {items.map((item, idx) => {
          const itemAnim = computeAnimatedStyles(layer.id, subType, animations, currentTime, idx);

          const itemX = itemAnim.x ?? itemAnim.translateX ?? 0;
          const itemY = itemAnim.y ?? itemAnim.translateY ?? 0;
          const itemScale = itemAnim.scale ?? 1;
          const itemRotate = itemAnim.rotate ?? 0;
          const itemOpacity = itemAnim.opacity !== undefined ? itemAnim.opacity : 1;
          const itemColor = itemAnim.color || undefined;

          return (
            <span
              key={`${layer.id}-part-${idx}`}
              style={{
                display: "inline-block",
                whiteSpace: item === " " ? "pre" : "normal",
                transform: `translate3d(${itemX}px, ${itemY}px, 0px) scale(${itemScale}) rotate(${itemRotate}deg)`,
                opacity: itemOpacity,
                color: itemColor,
                transformOrigin: itemAnim.transformOrigin || "50% 50%",
                willChange: "transform, opacity",
              }}
            >
              {item === " " ? "\u00A0" : item}
              {!isChars && idx < items.length - 1 ? "\u00A0" : ""}
            </span>
          );
        })}
      </div>
    );
  }

  // Render Standard Text
  if (layer.type === "text") {
    const textContent = layer.content || (layer as any).text || (layer as any).name || "";
    return <div style={containerStyle}>{textContent}</div>;
  }

  // Render Shape Layers (rect, circle, line, svg path)
  if (layer.type === "shape") {
    const width = layer.layout.width || layer.style?.width || 200;
    const height = layer.layout.height || layer.style?.height || 200;

    if (layer.shape === "circle") {
      return (
        <div
          style={{
            ...containerStyle,
            width: `${width}px`,
            height: `${height}px`,
            borderRadius: "50%",
            background: layerAnim.backgroundColor || layer.style?.background || layer.style?.color || "#00f6ff",
            border: layer.style?.border || undefined,
            boxShadow: layer.style?.boxShadow || "0 0 30px rgba(0,246,255,0.4)",
          }}
        />
      );
    }

    if (layer.shape === "line") {
      return (
        <div
          style={{
            ...containerStyle,
            width: `${width}px`,
            height: `${layer.style?.strokeWidth || 6}px`,
            background: layer.style?.stroke || layer.style?.color || "#00f6ff",
            boxShadow: layer.style?.boxShadow || "0 0 20px rgba(0,246,255,0.6)",
          }}
        />
      );
    }

    // Default Rect
    return (
      <div
        style={{
          ...containerStyle,
          width: `${width}px`,
          height: `${height}px`,
          background: layerAnim.backgroundColor || layer.style?.background || "rgba(0, 246, 255, 0.15)",
          borderRadius: layer.style?.borderRadius ? `${layer.style.borderRadius}px` : "16px",
          border: layer.style?.border || "2px solid rgba(0, 246, 255, 0.5)",
          boxShadow: layer.style?.boxShadow || "0 0 30px rgba(0, 246, 255, 0.2)",
        }}
      />
    );
  }

  return <div style={containerStyle} />;
};

// -------------------------------------------------------------
// Main Dynamic Motion Graphics Composition
// -------------------------------------------------------------
export const DynamicMotionComposition: React.FC<DynamicMotionProps> = ({ schema }) => {
  const frame = useCurrentFrame();
  const { fps, width: remotionWidth, height: remotionHeight } = useVideoConfig();

  if (!schema || !schema.composition) {
    return (
      <AbsoluteFill
        style={{
          backgroundColor: "#05060f",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#00f6ff",
          fontFamily: "'Montserrat', sans-serif",
          fontSize: 32,
          fontWeight: "bold",
        }}
      >
        Waiting for Motion Graphics Schema...
      </AbsoluteFill>
    );
  }

  const { composition, layers = [], timeline } = schema;
  const animations = timeline?.animations || [];
  const currentTime = frame / fps;

  // Determine composition dimensions
  const isVertical =
    remotionHeight > remotionWidth ||
    (Boolean(composition.height && composition.width) && composition.height > composition.width);

  const designWidth = composition.width || (isVertical ? 1080 : 1920);
  const designHeight = composition.height || (isVertical ? 1920 : 1080);

  // Auto-scale to match Remotion canvas dimensions
  const scaleX = remotionWidth / designWidth;
  const scaleY = remotionHeight / designHeight;
  const scale = Math.min(scaleX, scaleY);

  const bgStyle = composition.background?.startsWith("linear") || composition.background?.startsWith("radial")
    ? { background: composition.background }
    : { backgroundColor: composition.background || "#05060f" };

  return (
    <AbsoluteFill
      style={{
        ...bgStyle,
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {/* Ambient background glow */}
      <AbsoluteFill
        style={{
          pointerEvents: "none",
          background:
            "radial-gradient(circle at 50% 50%, rgba(0, 246, 255, 0.08) 0%, rgba(0, 0, 0, 0) 70%)",
        }}
      />

      {/* Scaled Artboard Stage */}
      <div
        style={{
          position: "relative",
          width: `${designWidth}px`,
          height: `${designHeight}px`,
          transform: `scale(${scale})`,
          transformOrigin: "center center",
        }}
      >
        {layers.map((layer) => (
          <LayerItem
            key={layer.id}
            layer={layer}
            animations={animations}
            currentTime={currentTime}
          />
        ))}
      </div>

      {/* Cinematic Vignette */}
      <AbsoluteFill
        style={{
          pointerEvents: "none",
          background:
            "radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.7) 100%)",
        }}
      />
    </AbsoluteFill>
  );
};
