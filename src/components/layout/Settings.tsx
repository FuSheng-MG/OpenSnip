import { useState, useCallback } from "react";
import { invoke } from "@tauri-apps/api/core";

// ============================================
// Types
// ============================================
type Section = "general" | "capture" | "annotation" | "ocr" | "pin" | "shortcuts" | "advanced" | "about";

interface HotkeyField { key: string; label: string; desc: string; }
const hotkeyFields: HotkeyField[] = [
  { key: "screenshot", label: "截图", desc: "区域截图" },
  { key: "scroll_capture", label: "滚动截图", desc: "长页面拼接" },
  { key: "recording", label: "录屏", desc: "屏幕录制" },
];

// ============================================
// Components
// ============================================

/** iOS-style toggle switch */
function Toggle({ checked, onChange, label, desc }: { checked: boolean; onChange: (v: boolean) => void; label: string; desc?: string }) {
  return (
    <label className="flex items-center justify-between p-4 rounded-2xl bg-white/4 border border-white/[0.06] hover:bg-white/[0.06] transition-all duration-150 cursor-pointer group">
      <div className="flex-1 min-w-0 mr-4">
        <div className="text-sm font-medium text-white/90">{label}</div>
        {desc && <div className="text-xs text-white/35 mt-0.5">{desc}</div>}
      </div>
      <button
        role="switch"
        aria-checked={checked}
        onClick={(e) => { e.preventDefault(); onChange(!checked); }}
        className={`relative w-10 h-6 rounded-full transition-all duration-200 outline-none focus:ring-2 focus:ring-blue-500/40 ${
          checked ? "bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.4)]" : "bg-white/15 hover:bg-white/20"
        }`}
      >
        <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all duration-200 ease-out ${
          checked ? "left-[18px]" : "left-0.5"
        }`} />
      </button>
    </label>
  );
}

/** Sidebar navigation */
function SidebarNav({ active, onChange }: { active: Section; onChange: (s: Section) => void }) {
  const sections: { id: Section; label: string; icon: string }[] = [
    { id: "general", label: "通用", icon: "⚙" },
    { id: "capture", label: "截图", icon: "📸" },
    { id: "annotation", label: "标注", icon: "✏" },
    { id: "ocr", label: "OCR", icon: "🔍" },
    { id: "pin", label: "贴图", icon: "📌" },
    { id: "shortcuts", label: "快捷键", icon: "⌨" },
    { id: "advanced", label: "高级", icon: "⚡" },
    { id: "about", label: "关于", icon: "ℹ" },
  ];

  return (
    <nav className="w-[200px] shrink-0 border-r border-white/[0.06] p-3 flex flex-col gap-0.5">
      {sections.map((s) => (
        <button
          key={s.id}
          onClick={() => onChange(s.id)}
          className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm transition-all duration-150 text-left ${
            active === s.id
              ? "bg-white/[0.08] text-white/90 font-medium border-l-[3px] border-blue-400 -ml-[3px] pl-[calc(0.75rem-3px)]"
              : "text-white/45 hover:text-white/70 hover:bg-white/[0.04] border-l-[3px] border-transparent -ml-[3px] pl-[calc(0.75rem-3px)]"
          }`}
        >
          <span className="text-base">{s.icon}</span>
          <span>{s.label}</span>
        </button>
      ))}
    </nav>
  );
}

// ============================================
// Section Content Components
// ============================================

function GeneralSection() {
  return (
    <div className="space-y-2">
      <SectionTitle icon="⚙" title="通用" />
      <Toggle checked={false} onChange={() => {}} label="开机自启" desc="系统启动时自动运行 OpenSnip" />
      <Toggle checked={true} onChange={() => {}} label="最小化到托盘" desc="关闭窗口时隐藏到系统托盘" />
    </div>
  );
}

function CaptureSection() {
  return (
    <div className="space-y-2">
      <SectionTitle icon="📸" title="截图" />
      <Toggle checked={true} onChange={() => {}} label="截图后自动复制" desc="截图完成后自动复制图像到剪贴板" />
      <Toggle checked={false} onChange={() => {}} label="自动保存" desc="截图后自动保存到本地目录" />
      <div className="flex items-center justify-between p-4 rounded-2xl bg-white/4 border border-white/[0.06]">
        <div>
          <div className="text-sm font-medium text-white/90">保存路径</div>
          <div className="text-xs text-white/35 mt-0.5">截图文件的默认保存位置</div>
        </div>
        <div className="text-xs text-white/50 font-mono bg-white/6 px-2.5 py-1.5 rounded-lg border border-white/[0.06]">Pictures/OpenSnip</div>
      </div>
    </div>
  );
}

function AnnotationSection() {
  return (
    <div className="space-y-2">
      <SectionTitle icon="✏" title="标注" />
      <div className="grid grid-cols-2 gap-2">
        {[
          { label: "默认颜色", value: "#FF0000", color: true },
          { label: "默认线宽", value: "2 px" },
          { label: "默认字号", value: "14 px" },
          { label: "模糊强度", value: "10 px" },
        ].map((item) => (
          <div key={item.label} className="p-4 rounded-2xl bg-white/4 border border-white/[0.06]">
            <div className="text-xs text-white/35 mb-1.5">{item.label}</div>
            {item.color ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full border border-white/20" style={{ background: item.value }} />
                <span className="text-sm font-mono text-white/70">{item.value}</span>
              </div>
            ) : (
              <span className="text-sm font-mono text-white/70">{item.value}</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function OcrSection() {
  return (
    <div className="space-y-2">
      <SectionTitle icon="🔍" title="OCR 文字识别" />
      <Toggle checked={false} onChange={() => {}} label="截图后自动 OCR" desc="截图完成后自动提取文字并复制" />
      <div className="flex items-center justify-between p-4 rounded-2xl bg-white/4 border border-white/[0.06]">
        <div>
          <div className="text-sm font-medium text-white/90">默认语言</div>
          <div className="text-xs text-white/35 mt-0.5">OCR 识别的首选语言</div>
        </div>
        <select className="bg-white/6 border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white/70 outline-none focus:border-blue-500/50 transition-colors">
          <option>中文简体</option>
          <option>English</option>
          <option>日本語</option>
        </select>
      </div>
    </div>
  );
}

function PinSection() {
  return (
    <div className="space-y-2">
      <SectionTitle icon="📌" title="贴图" />
      <Toggle checked={true} onChange={() => {}} label="始终置顶" desc="贴图窗口保持在所有窗口之上" />
      <Toggle checked={false} onChange={() => {}} label="鼠标穿透" desc="锁定后鼠标点击可穿透到下层窗口" />
      <div className="flex items-center justify-between p-4 rounded-2xl bg-white/4 border border-white/[0.06]">
        <div>
          <div className="text-sm font-medium text-white/90">默认透明度</div>
          <div className="text-xs text-white/35 mt-0.5">贴图窗口的初始透明度</div>
        </div>
        <div className="flex items-center gap-2">
          <input type="range" min="20" max="100" defaultValue="90" className="w-20 accent-blue-400 h-1" />
          <span className="text-xs text-white/50 font-mono w-8">90%</span>
        </div>
      </div>
    </div>
  );
}

function ShortcutsSection() {
  const [hk, setHk] = useState({
    screenshot: "Ctrl+Alt+A",
    scroll_capture: "Ctrl+Alt+S",
    recording: "Ctrl+Alt+R",
  });
  const [saved, setSaved] = useState(false);

  const update = useCallback(async (key: string, value: string) => {
    const next = { ...hk, [key]: value };
    setHk(next);
    try {
      await invoke("update_hotkey_config", { cfg: { screenshot: next.screenshot, scroll_capture: next.scroll_capture, recording: next.recording } });
      setSaved(true);
      setTimeout(() => setSaved(false), 1500);
    } catch (e) { console.error(e); }
  }, [hk]);

  return (
    <div className="space-y-2 relative">
      <SectionTitle icon="⌨" title="快捷键" extra={saved && <span className="text-[10px] text-green-400 font-medium animate-fade-in">已保存</span>} />
      {hotkeyFields.map((f) => (
        <div key={f.key} className="flex items-center justify-between p-4 rounded-2xl bg-white/4 border border-white/[0.06]">
          <div>
            <div className="text-sm font-medium text-white/90">{f.label}</div>
            <div className="text-xs text-white/35 mt-0.5">{f.desc}</div>
          </div>
          <input
            value={hk[f.key as keyof typeof hk]}
            onChange={(e) => update(f.key, e.target.value)}
            className="w-36 bg-white/6 border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white/70 font-mono text-center outline-none focus:border-blue-500/50 transition-colors"
          />
        </div>
      ))}
    </div>
  );
}

function AdvancedSection() {
  return (
    <div className="space-y-2">
      <SectionTitle icon="⚡" title="高级" />
      <Toggle checked={false} onChange={() => {}} label="开发者模式" desc="启用实验性功能和调试工具" />
      <Toggle checked={true} onChange={() => {}} label="日志记录" desc="记录运行日志用于问题排查" />

      {/* Danger Zone */}
      <div className="mt-6 pt-6 border-t border-white/[0.06]">
        <div className="text-xs font-medium text-red-400/70 uppercase tracking-wider mb-3">Danger Zone</div>
        <div className="space-y-2">
          <button className="w-full flex items-center justify-between p-4 rounded-2xl bg-red-500/4 border border-red-500/10 hover:bg-red-500/8 transition-all duration-150 group">
            <div className="text-left">
              <div className="text-sm font-medium text-red-400/80 group-hover:text-red-400">重置所有设置</div>
              <div className="text-xs text-red-400/30 mt-0.5">恢复为默认配置，此操作不可撤销</div>
            </div>
            <span className="text-red-400/40 text-sm">→</span>
          </button>
          <button className="w-full flex items-center justify-between p-4 rounded-2xl bg-red-500/4 border border-red-500/10 hover:bg-red-500/8 transition-all duration-150 group">
            <div className="text-left">
              <div className="text-sm font-medium text-red-400/80 group-hover:text-red-400">清除缓存</div>
              <div className="text-xs text-red-400/30 mt-0.5">删除临时文件和 OCR 模型缓存</div>
            </div>
            <span className="text-red-400/40 text-sm">→</span>
          </button>
        </div>
      </div>
    </div>
  );
}

function AboutSection() {
  return (
    <div className="space-y-2">
      <SectionTitle icon="ℹ" title="关于" />
      <div className="p-6 rounded-2xl bg-white/4 border border-white/[0.06] text-center space-y-3">
        <div className="text-4xl">📸</div>
        <h2 className="text-lg font-semibold text-white/90">OpenSnip</h2>
        <div className="text-xs text-white/35 font-mono">Version 1.0.0</div>
        <p className="text-sm text-white/50 max-w-xs mx-auto leading-relaxed">
          现代化的开发者截图工作流工具。截图、标注、通信，3 秒完成。
        </p>
        <div className="flex gap-3 justify-center pt-2">
          {[
            { label: "GitHub", url: "https://github.com/FuSheng-MG/OpenSnip" },
            { label: "License", url: "https://github.com/FuSheng-MG/OpenSnip/blob/master/LICENSE" },
          ].map((link) => (
            <a key={link.label} href={link.url} target="_blank" rel="noopener"
              className="text-xs text-blue-400/70 hover:text-blue-400 transition-colors px-3 py-1.5 rounded-lg bg-white/4 border border-white/[0.06] hover:bg-white/[0.08]">
              {link.label}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}

function SectionTitle({ icon, title, extra }: { icon: string; title: string; extra?: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2 mb-1">
      <span>{icon}</span>
      <h2 className="text-sm font-semibold text-white/85">{title}</h2>
      {extra}
    </div>
  );
}

// ============================================
// Main Settings Component
// ============================================

export function Settings() {
  const [section, setSection] = useState<Section>("general");

  const content: Record<Section, React.ReactNode> = {
    general: <GeneralSection />,
    capture: <CaptureSection />,
    annotation: <AnnotationSection />,
    ocr: <OcrSection />,
    pin: <PinSection />,
    shortcuts: <ShortcutsSection />,
    advanced: <AdvancedSection />,
    about: <AboutSection />,
  };

  return (
    <div className="flex-1 flex overflow-hidden" style={{ background: "#0b0d11" }}>
      <SidebarNav active={section} onChange={setSection} />
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-[560px] mx-auto px-8 py-8 space-y-6">
          {content[section]}
          <div className="h-8" />
        </div>
      </main>
    </div>
  );
}

export default Settings;
