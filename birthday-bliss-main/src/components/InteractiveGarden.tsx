import { useState, useRef } from "react";
import { Tulip } from "@/components/Tulips";
import { Button } from "@/components/ui/button";
import { Sparkles, Trash2, Plus, Flower2 } from "lucide-react";

interface PlantedTulip {
  id: string;
  x: number;
  y: number;
  color: string;
}

const TULIP_COLORS = [
  { name: "Pink", value: "var(--tulip-pink)" },
  { name: "Purple", value: "var(--tulip-purple)" },
  { name: "Blue", value: "var(--tulip-blue)" },
  { name: "Yellow", value: "#facc15" },
  { name: "Red", value: "#f87171" },
];

export function InteractiveGarden() {
  const [tulips, setTulips] = useState<PlantedTulip[]>([
    { id: "1", x: 80, y: 120, color: "var(--tulip-pink)" },
    { id: "2", x: 160, y: 140, color: "var(--tulip-purple)" },
    { id: "3", x: 240, y: 100, color: "var(--tulip-pink)" },
    { id: "4", x: 320, y: 150, color: "var(--tulip-blue)" },
  ]);
  const [selectedColor, setSelectedColor] = useState<string>("var(--tulip-pink)");
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const lawnRef = useRef<HTMLDivElement>(null);

  const handleLawnClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!lawnRef.current) return;
    if ((e.target as HTMLElement).closest(".tulip-item")) return;

    const rect = lawnRef.current.getBoundingClientRect();
    const x = Math.max(20, Math.min(rect.width - 40, e.clientX - rect.left - 20));
    const y = Math.max(30, Math.min(rect.height - 50, e.clientY - rect.top - 30));

    const newTulip: PlantedTulip = {
      id: Date.now().toString(),
      x,
      y,
      color: selectedColor,
    };

    setTulips([...tulips, newTulip]);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!draggingId || !lawnRef.current) return;
    const rect = lawnRef.current.getBoundingClientRect();
    const x = Math.max(20, Math.min(rect.width - 40, e.clientX - rect.left - 20));
    const y = Math.max(30, Math.min(rect.height - 50, e.clientY - rect.top - 30));

    setTulips(tulips.map((t) => (t.id === draggingId ? { ...t, x, y } : t)));
  };

  const deleteTulip = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setTulips(tulips.filter((t) => t.id !== id));
  };

  return (
    <div className="space-y-6 text-center">
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 text-primary font-bold text-sm">
          <Flower2 className="w-4 h-4" />
          <span>Custom Garden Designer</span>
        </div>
        <h2 className="font-display text-2xl font-bold">Design Your Dream Meadow 🌷</h2>
        <p className="text-sm text-muted-foreground max-w-md mx-auto">
          Choose a color below, then click anywhere on the lawn to plant tulips. Click and drag them to rearrange!
        </p>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-3 bg-accent/30 p-3 rounded-2xl max-w-md mx-auto">
        <span className="text-xs font-semibold text-muted-foreground">Pick Color:</span>
        {TULIP_COLORS.map((c) => (
          <button
            key={c.name}
            onClick={() => setSelectedColor(c.value)}
            className={`w-7 h-7 rounded-full transition-transform border-2 ${
              selectedColor === c.value ? "scale-125 border-slate-900 shadow-md" : "border-white hover:scale-110"
            }`}
            style={{ backgroundColor: c.value.startsWith("var") ? "#f472b6" : c.value }}
            title={c.name}
          />
        ))}
        <Button
          variant="outline"
          size="sm"
          onClick={() => setTulips([])}
          className="ml-auto text-xs rounded-full h-8 px-3 text-destructive hover:bg-destructive/10"
        >
          <Trash2 className="w-3.5 h-3.5 mr-1" /> Clear All
        </Button>
      </div>

      <div
        ref={lawnRef}
        onClick={handleLawnClick}
        onMouseMove={handleMouseMove}
        onMouseUp={() => setDraggingId(null)}
        onMouseLeave={() => setDraggingId(null)}
        className="relative w-full h-[400px] rounded-3xl bg-gradient-to-b from-emerald-50/80 to-emerald-100/60 border-2 border-emerald-200/60 shadow-inner cursor-crosshair overflow-hidden select-none"
      >
        <div className="absolute top-3 left-4 text-[11px] font-medium text-emerald-700/60 flex items-center gap-1 pointer-events-none">
          <Sparkles className="w-3 h-3" /> Click lawn to plant · Drag tulips to move
        </div>

        {tulips.map((t) => (
          <div
            key={t.id}
            className="tulip-item absolute cursor-grab active:cursor-grabbing group transition-transform hover:scale-110"
            style={{ left: `${t.x}px`, top: `${t.y}px` }}
            onMouseDown={() => setDraggingId(t.id)}
          >
            <Tulip className="h-20 w-14 drop-shadow-md pointer-events-none" bloom={t.color} stem="var(--tulip-stem)" />
            <button
              onClick={(e) => deleteTulip(t.id, e)}
              className="absolute -top-2 -right-2 bg-white text-destructive rounded-full p-1 shadow-md opacity-0 group-hover:opacity-100 transition-opacity hover:bg-destructive hover:text-white"
              title="Remove tulip"
            >
              <Trash2 className="w-3 h-3" />
            </button>
          </div>
        ))}

        {tulips.length === 0 && (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-muted-foreground/60 pointer-events-none space-y-2">
            <Plus className="w-8 h-8 animate-bounce" />
            <p className="text-sm font-medium">Your garden is empty! Click anywhere to plant your first tulip.</p>
          </div>
        )}
      </div>
    </div>
  );
}