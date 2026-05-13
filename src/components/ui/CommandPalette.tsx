import { useState, useEffect, useCallback, useRef } from "react";

interface Command {
  id: string;
  label: string;
  section: string;
  action: () => void;
}

interface CommandPaletteProps {
  onClose: () => void;
}

export function CommandPalette({ onClose }: CommandPaletteProps) {
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const commands: Command[] = [
    { id: "screenshot", label: "区域截图", section: "截图", action: () => onClose() },
    { id: "fullscreen", label: "全屏截图", section: "截图", action: () => onClose() },
    { id: "pin", label: "贴图", section: "贴图", action: () => onClose() },
    { id: "ocr", label: "OCR 文字识别", section: "OCR", action: () => onClose() },
    { id: "beautify", label: "美化截图", section: "美化", action: () => onClose() },
    { id: "settings", label: "打开设置", section: "设置", action: () => onClose() },
  ];

  const filtered = query
    ? commands.filter((c) => c.label.includes(query) || c.section.includes(query))
    : commands;

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleKey = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "ArrowDown") { e.preventDefault(); setSelected((s) => (s + 1) % filtered.length); }
      else if (e.key === "ArrowUp") { e.preventDefault(); setSelected((s) => (s - 1 + filtered.length) % filtered.length); }
      else if (e.key === "Enter" && filtered[selected]) {
        filtered[selected].action();
      }
    },
    [filtered, selected]
  );

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[20vh]" onClick={onClose}>
      <div
        className="w-[480px] max-h-[360px] bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl shadow-2xl overflow-hidden animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-2 px-4 py-3 border-b border-[var(--color-border)]">
          <span className="text-sm text-[var(--color-text-muted)]">⌘</span>
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => { setQuery(e.target.value); setSelected(0); }}
            onKeyDown={handleKey}
            placeholder="搜索命令..."
            className="flex-1 bg-transparent text-sm text-[var(--color-text)] outline-none placeholder:text-[var(--color-text-muted)]"
          />
          <kbd className="text-[10px] text-[var(--color-text-muted)] bg-[var(--color-background)] px-1.5 py-0.5 rounded font-mono">Esc</kbd>
        </div>
        <div className="overflow-y-auto max-h-[280px] py-1">
          {filtered.map((cmd, i) => (
            <button
              key={cmd.id}
              onClick={cmd.action}
              className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors ${
                i === selected ? "bg-[var(--color-background)]" : "hover:bg-[var(--color-background)]"
              }`}
              onMouseEnter={() => setSelected(i)}
            >
              <span className="text-[var(--color-text)]">{cmd.label}</span>
              <span className="text-[10px] text-[var(--color-text-muted)] bg-[var(--color-background)] px-1.5 py-0.5 rounded">{cmd.section}</span>
            </button>
          ))}
          {filtered.length === 0 && (
            <div className="px-4 py-8 text-center text-sm text-[var(--color-text-muted)]">无匹配命令</div>
          )}
        </div>
      </div>
    </div>
  );
}
