import React from "react";

type Element = {
  type: "rect" | "text" | "field" | "image" | "qr";
  x: number; y: number; w: number; h: number;
  fill?: string;
  color?: string;
  size?: number;
  weight?: number;
  align?: "left" | "center" | "right";
  text?: string;
  field?: string;
  key?: string; // for image/qr
  fit?: "cover" | "contain";
  placeholder?: string;
};

type Design = {
  size: { width: number; height: number };
  theme?: any;
  sides: { front: Element[]; back: Element[] };
};

export function CardRenderer({ design, data, side = "front", scale = 0.35 }: { design: Design; data: Record<string, any>; side?: "front" | "back"; scale?: number; }) {
  const { width, height } = design.size || { width: 1017, height: 639 };
  const elements = (design.sides as any)?.[side] as Element[];

  return (
    <div style={{ width: width * scale, height: height * scale, position: "relative", border: "1px solid #e5e7eb", borderRadius: 8, overflow: "hidden", background: "#fff" }}>
      {elements?.map((el, idx) => {
        const style: React.CSSProperties = {
          position: "absolute",
          left: (el.x ?? 0) * scale,
          top: (el.y ?? 0) * scale,
          width: (el.w ?? 0) * scale,
          height: (el.h ?? 0) * scale,
          color: el.color || "#0f172a",
          fontSize: (el.size || 14) * scale,
          fontWeight: (el.weight as any) || 400,
          display: "flex",
          alignItems: "center",
          justifyContent: el.align === "center" ? "center" : el.align === "right" ? "flex-end" : "flex-start",
          padding: 4 * scale,
          boxSizing: "border-box",
          overflow: "hidden",
          whiteSpace: "pre-wrap",
        };

        if (el.type === "rect") {
          return <div key={idx} style={{ ...style, background: el.fill || "transparent" }} />;
        }
        if (el.type === "text") {
          return <div key={idx} style={style}>{el.text}</div>;
        }
        if (el.type === "field") {
          const value = data[el.field || ""] ?? "";
          return <div key={idx} style={style}>{String(value)}</div>;
        }
        if (el.type === "image") {
          const src = (el.key && data[el.key]) || "";
          const bg = src ? `url(${src})` : "none";
          return (
            <div key={idx} style={{ ...style, backgroundColor: "#f1f5f9", backgroundImage: bg, backgroundPosition: "center", backgroundRepeat: "no-repeat", backgroundSize: el.fit === "contain" ? "contain" : "cover", border: "1px dashed #cbd5e1", color: "#64748b" }}>
              {!src && (el.placeholder || "IMAGE")}
            </div>
          );
        }
        if (el.type === "qr") {
          return (
            <div key={idx} style={{ ...style, background: "#f1f5f9", border: "1px dashed #cbd5e1", color: "#64748b", alignItems: "center", justifyContent: "center" }}>
              QR
            </div>
          );
        }
        return null;
      })}
    </div>
  );
}

export default CardRenderer;
