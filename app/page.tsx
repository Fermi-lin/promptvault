"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { motion, AnimatePresence, useMotionValue, useSpring, type MotionValue } from "framer-motion";
import {
  Copy,
  Check,
  Sparkles,
  Zap,
  ExternalLink,
  ChevronRight,
  BookOpen,
  Terminal,
} from "lucide-react";
import { prompts, skills, type Prompt, type Skill } from "@/lib/data";

/* ────────────────────────────────────────────
   Data
   ──────────────────────────────────────────── */

type ShelfItem = { type: "prompt"; data: Prompt } | { type: "skill"; data: Skill };

const shelfItems: ShelfItem[] = [
  ...prompts.map((p) => ({ type: "prompt" as const, data: p })),
  ...skills.map((s) => ({ type: "skill" as const, data: s })),
];

// Color palette for spines — muted, literary tones
const spineColors = [
  "#8B4513", "#2F4F4F", "#4A3728", "#1B3A4B", "#3C1518",
  "#2C3E50", "#5D4037", "#1A1A2E", "#4A6741", "#6B3A5B",
  "#2E4057", "#7D6608", "#1C2833", "#6E2C00", "#1B4F72",
];

/* ────────────────────────────────────────────
   Spine Component
   ──────────────────────────────────────────── */

function Spine({
  item,
  index,
  mouseX,
  mouseY,
  onHover,
  onLeave,
}: {
  item: ShelfItem;
  index: number;
  mouseX: MotionValue<number>;
  mouseY: MotionValue<number>;
  onHover: (item: ShelfItem, el: HTMLDivElement) => void;
  onLeave: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const color = spineColors[index % spineColors.length];
  const isPrompt = item.type === "prompt";
  const title = isPrompt ? item.data.title : item.data.title;
  const desc = isPrompt ? item.data.description : item.data.description;

  // Parallax tilt
  const x = useSpring(0, { stiffness: 150, damping: 15 });
  const y = useSpring(0, { stiffness: 150, damping: 15 });

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      x.set((e.clientX - cx) * 0.06);
      y.set((e.clientY - cy) * 0.04);
    },
    [x, y]
  );

  const handleMouseLeaveSpine = useCallback(() => {
    x.set(0);
    y.set(0);
    onLeave();
  }, [x, y, onLeave]);

  const staggerDelay = index * 0.07;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        delay: staggerDelay,
        duration: 0.7,
        ease: [0.16, 1, 0.3, 1],
      }}
      style={{ x, y, rotateY: x, rotateX: y }}
      className="relative flex-shrink-0 cursor-pointer group"
      onMouseMove={handleMouseMove}
      onMouseEnter={() => onHover(item, ref.current!)}
      onMouseLeave={handleMouseLeaveSpine}
    >
      {/* The Spine */}
      <div
        className="spine-glow relative w-[72px] rounded-sm overflow-hidden"
        style={{
          height: `${220 + (index % 5) * 16}px`,
          backgroundColor: color,
        }}
      >
        {/* Top color band */}
        <div
          className="absolute top-0 left-0 right-0 h-3"
          style={{
            backgroundColor: isPrompt ? "rgba(201,169,110,0.6)" : "rgba(46,204,113,0.5)",
          }}
        />

        {/* Spine texture lines */}
        <div className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(255,255,255,0.5) 3px, rgba(255,255,255,0.5) 4px)",
          }}
        />

        {/* Title text rotated */}
        <div className="absolute inset-0 flex items-center justify-center px-2">
          <span
            className="font-display text-[11px] leading-tight tracking-wide text-white/90 uppercase text-center"
            style={{
              writingMode: "vertical-rl",
              textOrientation: "mixed",
              maxHeight: "80%",
              overflow: "hidden",
            }}
          >
            {title}
          </span>
        </div>

        {/* Bottom accent line */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 w-6 h-[1px] bg-white/20" />

        {/* Type indicator */}
        <div className="absolute bottom-1 left-1/2 -translate-x-1/2">
          {isPrompt ? (
            <Sparkles className="w-2.5 h-2.5 text-white/30" />
          ) : (
            <Zap className="w-2.5 h-2.5 text-white/30" />
          )}
        </div>

        {/* Hover shimmer */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
          <div
            className="absolute inset-0"
            style={{
              background: "linear-gradient(180deg, rgba(255,255,255,0.06) 0%, transparent 40%, transparent 60%, rgba(255,255,255,0.03) 100%)",
            }}
          />
        </div>
      </div>
    </motion.div>
  );
}

/* ────────────────────────────────────────────
   Hover Tooltip
   ──────────────────────────────────────────── */

function HoverTooltip({
  item,
  anchorRect,
  position,
}: {
  item: ShelfItem;
  anchorRect: DOMRect | null;
  position: "left" | "right";
}) {
  const isPrompt = item.type === "prompt";
  const data = item.data;

  if (!anchorRect) return null;

  const tooltipStyle: React.CSSProperties =
    position === "right"
      ? {
          left: anchorRect.right + 16,
          top: anchorRect.top + anchorRect.height / 2,
          transform: "translateY(-50%)",
        }
      : {
          right: window.innerWidth - anchorRect.left + 16,
          top: anchorRect.top + anchorRect.height / 2,
          transform: "translateY(-50%)",
        };

  const arrowStyle: React.CSSProperties =
    position === "right"
      ? { left: -7, top: "50%", transform: "translateY(-50%) rotate(135deg)" }
      : { right: -7, top: "50%", transform: "translateY(-50%) rotate(-45deg)" };

  return (
    <div
      className="float-in fixed z-50 w-[300px] rounded-lg border border-[#2a2a2a] bg-[#161616]/95 backdrop-blur-xl shadow-2xl pointer-events-none"
      style={tooltipStyle}
    >
      {/* Arrow */}
      <div className="tooltip-arrow absolute" style={arrowStyle} />

      <div className="p-5">
        {/* Type badge */}
        <div className="flex items-center gap-2 mb-3">
          <div
            className={`w-5 h-5 rounded flex items-center justify-center ${
              isPrompt ? "bg-[#c9a96e]/20" : "bg-[#2ecc71]/20"
            }`}
          >
            {isPrompt ? (
              <Sparkles className="w-3 h-3 text-[#c9a96e]" />
            ) : (
              <Zap className="w-3 h-3 text-[#2ecc71]" />
            )}
          </div>
          <span className="text-[10px] uppercase tracking-[0.15em] text-[#6b6b6b]">
            {isPrompt ? "Prompt" : "Skill"}
          </span>
        </div>

        {/* Title */}
        <h3 className="font-display text-lg text-[#f5f5f0] leading-snug mb-2">
          {data.title}
        </h3>

        {/* Description */}
        <p className="text-[13px] text-[#888] leading-relaxed mb-4">
          {data.description}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5">
          {(isPrompt ? data.tags : data.tags).slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="px-2 py-0.5 text-[10px] rounded-full border text-[#777]"
              style={{
                borderColor: isPrompt
                  ? "rgba(201,169,110,0.25)"
                  : "rgba(46,204,113,0.25)",
                color: isPrompt ? "#c9a96e" : "#2ecc71",
              }}
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Hint */}
        <div className="mt-4 pt-3 border-t border-[#1e1e1e] flex items-center gap-1.5 text-[11px] text-[#555]">
          <span>Click to view full content</span>
          <ChevronRight className="w-3 h-3" />
        </div>
      </div>
    </div>
  );
}

/* ────────────────────────────────────────────
   Detail Modal
   ──────────────────────────────────────────── */

function DetailModal({
  item,
  onClose,
}: {
  item: ShelfItem;
  onClose: () => void;
}) {
  const isPrompt = item.type === "prompt";
  const data = item.data;
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    const text = isPrompt
      ? (item.data as Prompt).content
      : (item.data as Skill).instructions.join("\n");
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-6"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

      {/* Modal */}
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 10, scale: 0.98 }}
        transition={{ type: "spring", damping: 28, stiffness: 300 }}
        className="relative w-full max-w-2xl max-h-[85vh] bg-[#111] border border-[#222] rounded-lg overflow-hidden shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#1e1e1e]">
          <div className="flex items-center gap-3">
            <div
              className={`w-8 h-8 rounded flex items-center justify-center ${
                isPrompt ? "bg-[#c9a96e]/15" : "bg-[#2ecc71]/15"
              }`}
            >
              {isPrompt ? (
                <BookOpen className="w-4 h-4 text-[#c9a96e]" />
              ) : (
                <Terminal className="w-4 h-4 text-[#2ecc71]" />
              )}
            </div>
            <div>
              <span className="text-[10px] uppercase tracking-[0.15em] text-[#555]">
                {isPrompt ? "Prompt" : "Skill"}
              </span>
              <h2 className="font-display text-xl text-[#f5f5f0]">
                {data.title}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs border transition-all ${
                copied
                  ? "border-[#2ecc71]/50 text-[#2ecc71] bg-[#2ecc71]/10"
                  : "border-[#333] text-[#888] hover:border-[#555] hover:text-[#ccc]"
              }`}
            >
              {copied ? (
                <>
                  <Check className="w-3 h-3" />
                  Copied
                </>
              ) : (
                <>
                  <Copy className="w-3 h-3" />
                  Copy
                </>
              )}
            </button>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded flex items-center justify-center text-[#555] hover:text-[#ccc] hover:bg-[#1a1a1a] transition-colors"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="overflow-y-auto max-h-[calc(85vh-65px)] p-6">
          {/* Description */}
          <p className="text-[14px] text-[#999] leading-relaxed mb-6">
            {data.description}
          </p>

          {/* Content */}
          {isPrompt ? (
            <div className="space-y-0">
              <div className="text-[10px] uppercase tracking-[0.15em] text-[#555] mb-3">
                Prompt Content
              </div>
              <pre className="whitespace-pre-wrap text-[13px] text-[#bbb] leading-[1.8] font-[family-name:var(--font-jetbrains)] bg-[#0d0d0d] border border-[#1a1a1a] rounded-lg p-5">
                {(item.data as Prompt).content}
              </pre>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="text-[10px] uppercase tracking-[0.15em] text-[#555] mb-3">
                Instructions
              </div>
              {(item.data as Skill).instructions.map((step, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.08 }}
                  className="flex items-start gap-3 p-4 bg-[#0d0d0d] border border-[#1a1a1a] rounded-lg"
                >
                  <span className="flex-shrink-0 w-5 h-5 rounded-full bg-[#2ecc71]/15 text-[#2ecc71] text-[10px] flex items-center justify-center font-medium mt-0.5">
                    {i + 1}
                  </span>
                  <p className="text-[13px] text-[#bbb] leading-relaxed">
                    {step}
                  </p>
                </motion.div>
              ))}
            </div>
          )}

          {/* Meta */}
          <div className="mt-6 pt-5 border-t border-[#1e1e1e] grid grid-cols-2 gap-4">
            <div>
              <span className="text-[10px] uppercase tracking-[0.15em] text-[#444]">
                Category
              </span>
              <p className="text-[13px] text-[#999] mt-1">{data.category}</p>
            </div>
            {isPrompt && (
              <div>
                <span className="text-[10px] uppercase tracking-[0.15em] text-[#444]">
                  Usage
                </span>
                <p className="text-[13px] text-[#999] mt-1">{(item.data as Prompt).usage}</p>
              </div>
            )}
            {!isPrompt && (item.data as Skill).source && (
              <div>
                <span className="text-[10px] uppercase tracking-[0.15em] text-[#444]">
                  Source
                </span>
                <a
                  href={(item.data as Skill).source!}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[13px] text-[#2ecc71] hover:underline mt-1 flex items-center gap-1"
                >
                  View Source
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            )}
          </div>

          {/* Tags */}
          <div className="mt-5 flex flex-wrap gap-2">
            {data.tags.map((tag) => (
              <span
                key={tag}
                className="px-2.5 py-1 text-[11px] rounded-full border"
                style={{
                  borderColor: isPrompt
                    ? "rgba(201,169,110,0.2)"
                    : "rgba(46,204,113,0.2)",
                  color: isPrompt ? "#c9a96e" : "#2ecc71",
                }}
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ────────────────────────────────────────────
   Main Page
   ──────────────────────────────────────────── */

export default function Home() {
  const [hoveredItem, setHoveredItem] = useState<ShelfItem | null>(null);
  const [hoveredRect, setHoveredRect] = useState<DOMRect | null>(null);
  const [hoverPosition, setHoverPosition] = useState<"left" | "right">("right");
  const [selectedItem, setSelectedItem] = useState<ShelfItem | null>(null);
  const [view, setView] = useState<"all" | "prompts" | "skills">("all");
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const filteredItems =
    view === "all"
      ? shelfItems
      : shelfItems.filter((i) => i.type === view.slice(0, -1));

  const handleHover = useCallback(
    (item: ShelfItem, el: HTMLDivElement) => {
      const rect = el.getBoundingClientRect();
      setHoveredItem(item);
      setHoveredRect(rect);
      // Position tooltip on the side with more space
      const spaceRight = window.innerWidth - rect.right;
      const spaceLeft = rect.left;
      setHoverPosition(spaceRight > 320 ? "right" : "left");
    },
    []
  );

  const handleLeave = useCallback(() => {
    setHoveredItem(null);
    setHoveredRect(null);
  }, []);

  const handleSpineClick = useCallback((item: ShelfItem) => {
    setSelectedItem(item);
    setHoveredItem(null);
  }, []);

  return (
    <main className="min-h-screen page-enter">
      {/* ── Hero ── */}
      <section className="relative px-6 pt-16 pb-10 md:pt-24 md:pb-14">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="text-center"
          >
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#2a2a2a] mb-8">
              <div className="w-1.5 h-1.5 rounded-full bg-[#c9a96e]" />
              <span className="text-[11px] uppercase tracking-[0.2em] text-[#6b6b6b]">
                AI Collaboration Library
              </span>
            </div>

            {/* Title */}
            <h1 className="font-display text-5xl md:text-7xl lg:text-8xl text-[#f5f5f0] tracking-tight leading-[0.95]">
              Prompt
              <span className="text-[#c9a96e]">Vault</span>
            </h1>

            {/* Tagline */}
            <p className="mt-5 text-[15px] text-[#6b6b6b] tracking-wide">
              Prompts · Skills · Workflows
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── Divider shimmer ── */}
      <div className="shimmer-line h-[1px] bg-[#1e1e1e] mx-auto max-w-4xl" />

      {/* ── Shelf Section ── */}
      <section className="relative py-12 md:py-16">
        <div className="max-w-6xl mx-auto px-6">
          {/* Section header */}
          <div className="flex items-end justify-between mb-10">
            <div>
              <h2 className="font-display text-2xl md:text-3xl text-[#f5f5f0]">
                The Shelf
              </h2>
              <p className="text-[13px] text-[#555] mt-1 tracking-wide">
                {filteredItems.length} items in collection
              </p>
            </div>

            {/* View toggle */}
            <div className="flex items-center gap-1 p-1 rounded-lg border border-[#1e1e1e] bg-[#0d0d0d]">
              {(["all", "prompts", "skills"] as const).map((v) => (
                <button
                  key={v}
                  onClick={() => setView(v)}
                  className={`px-3 py-1.5 rounded text-[11px] uppercase tracking-[0.1em] transition-all ${
                    view === v
                      ? "bg-[#1a1a1a] text-[#f5f5f0] shadow-sm"
                      : "text-[#555] hover:text-[#888]"
                  }`}
                >
                  {v}
                </button>
              ))}
            </div>
          </div>

          {/* The Spine Shelf */}
          <div className="relative">
            {/* Shelf surface */}
            <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#2a2a2a] to-transparent" />

            {/* Spines container */}
            <div className="flex items-end gap-3 md:gap-4 pb-4 overflow-x-auto px-2 py-4 scroll-smooth"
              style={{ scrollbarWidth: "none" }}
            >
              <AnimatePresence mode="popLayout">
                {filteredItems.map((item, index) => (
                  <Spine
                    key={item.type + "-" + item.data.id}
                    item={item}
                    index={index}
                    mouseX={mouseX}
                    mouseY={mouseY}
                    onHover={handleHover}
                    onLeave={handleLeave}
                  />
                ))}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats strip ── */}
      <div className="shimmer-line h-[1px] bg-[#1e1e1e] mx-auto max-w-4xl" />

      <section className="py-10">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-3 gap-6 text-center">
            {[
              { value: prompts.length, label: "Prompts" },
              { value: skills.length, label: "Skills" },
              {
                value: new Set([
                  ...prompts.flatMap((p) => p.tags),
                  ...skills.flatMap((s) => s.tags),
                ]).size,
                label: "Tags",
              },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 + i * 0.1 }}
              >
                <p className="font-display text-3xl text-[#f5f5f0]">
                  {stat.value}
                </p>
                <p className="text-[11px] uppercase tracking-[0.15em] text-[#555] mt-1">
                  {stat.label}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="py-10 border-t border-[#111]">
        <div className="max-w-6xl mx-auto px-6 flex items-center justify-between">
          <p className="text-[11px] text-[#333] tracking-wide">
            PromptVault — Personal AI collaboration library
          </p>
          <a
            href="https://github.com/obra/superpowers"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[11px] text-[#333] hover:text-[#555] tracking-wide transition-colors flex items-center gap-1"
          >
            Skills via Superpowers
            <ExternalLink className="w-2.5 h-2.5" />
          </a>
        </div>
      </footer>

      {/* ── Hover Tooltip ── */}
      <AnimatePresence>
        {hoveredItem && hoveredRect && (
          <HoverTooltip
            item={hoveredItem}
            anchorRect={hoveredRect}
            position={hoverPosition}
          />
        )}
      </AnimatePresence>

      {/* ── Click to open detail, but only when not just hovering ── */}
      {/* We handle click on spine via a transparent overlay */}
      <AnimatePresence>
        {hoveredItem && hoveredRect && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed z-40 cursor-pointer"
            style={{
              left: hoveredRect.left,
              top: hoveredRect.top,
              width: hoveredRect.width,
              height: hoveredRect.height,
            }}
            onClick={() => handleSpineClick(hoveredItem)}
          />
        )}
      </AnimatePresence>

      {/* ── Detail Modal ── */}
      <AnimatePresence>
        {selectedItem && (
          <DetailModal item={selectedItem} onClose={() => setSelectedItem(null)} />
        )}
      </AnimatePresence>
    </main>
  );
}