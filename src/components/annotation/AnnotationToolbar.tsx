import { useCanvas, ToolType } from "./CanvasContext";

export function AnnotationToolbar() {
  const { state, setTool, setStyle, undo, redo } = useCanvas();

  const tools: { type: ToolType; icon: string; label: string }[] = [
    { type: "select", icon: "↖", label: "选择" },
    { type: "rectangle", icon: "□", label: "矩形" },
    { type: "ellipse", icon: "○", label: "椭圆" },
    { type: "arrow", icon: "→", label: "箭头" },
    { type: "line", icon: "/", label: "直线" },
    { type: "pencil", icon: "✏", label: "画笔" },
    { type: "text", icon: "T", label: "文字" },
    { type: "mosaic", icon: "▦", label: "马赛克" },
    { type: "blur", icon: "◯", label: "模糊" },
    { type: "highlighter", icon: "▬", label: "高亮" },
    { type: "numbering", icon: "①", label: "编号" },
  ];

  const colors = ["#FF0000", "#00AA00", "#0066FF", "#FF6600", "#FF00FF", "#00AAAA"];

  return (
    <div className="flex items-center gap-0.5 px-1.5 py-1 bg-white/[0.03] backdrop-blur-xl border border-white/[0.06] rounded-2xl shadow-sm select-none">
      {/* Tools */}
      {tools.map((tool) => (
        <button
          key={tool.type}
          onClick={() => setTool(tool.type)}
          className={`w-8 h-7 flex items-center justify-center rounded-lg text-xs transition-all duration-150 ${state.tool === tool.type ? "bg-white/[0.10] text-white/90 shadow-sm" : "text-white/45 hover:text-white/75 hover:bg-white/[0.05]"}`}
          title={tool.label}
        >{tool.icon}</button>
      ))}
      <div className="w-px h-4 bg-white/[0.08] mx-1" />
      {/* Colors */}
      {colors.map((c) => (
        <button
          key={c}
          onClick={() => setStyle({ strokeColor: c })}
          className={`w-5 h-5 rounded-full border transition-all duration-150 hover:scale-110 ${state.style.strokeColor === c ? "border-white/60 scale-110 shadow-[0_0_6px_rgba(255,255,255,0.15)]" : "border-white/[0.12]"}`}
          style={{ backgroundColor: c }} title={c}
        />
      ))}
      <div className="w-px h-4 bg-white/[0.08] mx-1" />
      {/* Stroke */}
      {[2, 4, 6].map((w) => (
        <button
          key={w}
          onClick={() => setStyle({ strokeWidth: w })}
          className={`w-6 h-5 flex items-center justify-center rounded-lg text-xs transition-all duration-150 ${state.style.strokeWidth === w ? "bg-white/[0.10] text-white/90" : "text-white/45 hover:text-white/75 hover:bg-white/[0.05]"}`}
          title={`${w}px`}
        >
          <span style={{ fontSize: Math.min(w * 3, 12) }}>●</span>
        </button>
      ))}
      <div className="w-px h-4 bg-white/[0.08] mx-1" />
      {/* Fill toggle */}
      <button onClick={() => setStyle({ fillColor: state.style.fillColor ? null : state.style.strokeColor + "30" })}
        className={`w-6 h-5 flex items-center justify-center rounded-lg text-xs transition-all duration-150 ${state.style.fillColor ? "bg-white/[0.10] text-white/90" : "text-white/45 hover:text-white/75 hover:bg-white/[0.05]"}`}
        title="填充">⬛</button>
      {/* Undo/Redo */}
      <button onClick={undo} disabled={state.historyIndex < 0}
        className="w-6 h-5 flex items-center justify-center rounded-lg text-xs text-white/40 hover:text-white/75 hover:bg-white/[0.05] disabled:opacity-20 transition-all duration-150" title="撤销">↩</button>
      <button onClick={redo} disabled={state.historyIndex >= state.history.length - 1}
        className="w-6 h-5 flex items-center justify-center rounded-lg text-xs text-white/40 hover:text-white/75 hover:bg-white/[0.05] disabled:opacity-20 transition-all duration-150" title="重做">↪</button>
    </div>
  );
}

export default AnnotationToolbar;
