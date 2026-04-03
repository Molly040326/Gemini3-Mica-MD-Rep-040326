import React, { useState, useEffect, useRef } from "react";
import { 
  LayoutDashboard, 
  Bot, 
  FileText, 
  Settings, 
  Moon, 
  Sun, 
  Globe, 
  Palette, 
  Play, 
  CheckCircle, 
  Loader2, 
  Download, 
  Terminal, 
  History, 
  Activity, 
  AlertCircle,
  ChevronRight,
  Search,
  BookOpen,
  ShieldCheck,
  Zap,
  ArrowRight,
  Command
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import ReactMarkdown from "react-markdown";
import { cn } from "./lib/utils";
import { 
  Theme, 
  Language, 
  PantoneStyle, 
  Artifact, 
  LogEntry, 
  AgentStep 
} from "./types";
import { 
  PANTONE_STYLES, 
  DEFAULT_FDA_TEMPLATE, 
  TRANSLATIONS 
} from "./constants";
import { geminiService } from "./services/geminiService";

export default function App() {
  // --- State ---
  const [theme, setTheme] = useState<Theme>("light");
  const [language, setLanguage] = useState<Language>("zh");
  const [style, setStyle] = useState<PantoneStyle>(PANTONE_STYLES[0]);
  const [activeTab, setActiveTab] = useState<"dashboard" | "mdri" | "agents" | "settings">("dashboard");
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [artifacts, setArtifacts] = useState<Artifact[]>([]);
  const [inputText, setInputText] = useState("");
  const [template, setTemplate] = useState(DEFAULT_FDA_TEMPLATE);
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [telemetry, setTelemetry] = useState({
    activeJobs: 0,
    tokenUsage: 0,
    latency: 0,
    health: "Healthy"
  });

  const [steps, setSteps] = useState<AgentStep[]>([
    { id: "step1", name: "Web Research & Summary", status: "idle", prompt: "Perform comprehensive web research and summarize.", model: "gemini-3-flash-preview" },
    { id: "step2", name: "Comprehensive Report", status: "idle", prompt: "Generate a full report based on the template.", model: "gemini-3-flash-preview" },
    { id: "step3", name: "Skill.md Generation", status: "idle", prompt: "Create a reusable skill description.", model: "gemini-3-flash-preview" }
  ]);

  const logEndRef = useRef<HTMLDivElement>(null);

  // --- Helpers ---
  const t = TRANSLATIONS[language];

  const addLog = (level: LogEntry["level"], message: string, details?: string) => {
    const newLog: LogEntry = {
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date().toLocaleTimeString(),
      level,
      message,
      details
    };
    setLogs(prev => [newLog, ...prev].slice(0, 50));
  };

  const addArtifact = (type: Artifact["type"], title: string, content: string, model?: string) => {
    const newArtifact: Artifact = {
      id: Math.random().toString(36).substr(2, 9),
      title,
      content,
      type,
      timestamp: new Date().toLocaleString(),
      model,
      version: 1
    };
    setArtifacts(prev => [newArtifact, ...prev]);
  };

  const handleJackslot = () => {
    const randomStyle = PANTONE_STYLES[Math.floor(Math.random() * PANTONE_STYLES.length)];
    setStyle(randomStyle);
    addLog("info", `Jackslot triggered! New style: ${randomStyle.name}`);
  };

  // --- Agent Execution ---
  const runAgentChain = async () => {
    if (!inputText) {
      addLog("error", "Input text is required.");
      return;
    }

    setIsProcessing(true);
    setTelemetry(prev => ({ ...prev, activeJobs: 1 }));
    addLog("info", "Starting MDRI Agent Chain...");

    try {
      // Step 1: Summary
      setCurrentStep(1);
      updateStepStatus("step1", "running");
      addLog("info", "Executing Step 1: Web Research & Summary...");
      const summary = await geminiService.generateSummary(inputText, language);
      updateStepStatus("step1", "success", summary);
      addArtifact("summary", "Web Research Summary", summary, "gemini-3-flash-preview");
      addLog("success", "Step 1 completed successfully.");

      // Step 2: Report
      setCurrentStep(2);
      updateStepStatus("step2", "running");
      addLog("info", "Executing Step 2: Comprehensive Report...");
      const report = await geminiService.generateReport(summary, template, language);
      updateStepStatus("step2", "success", report);
      addArtifact("report", "Comprehensive Regulation Report", report, "gemini-3-flash-preview");
      addLog("success", "Step 2 completed successfully.");

      // Step 3: Skill
      setCurrentStep(3);
      updateStepStatus("step3", "running");
      addLog("info", "Executing Step 3: Skill.md Generation...");
      const skill = await geminiService.generateSkill(inputText, report, language);
      updateStepStatus("step3", "success", skill);
      addArtifact("skill", "Reusable Skill Description", skill, "gemini-3-flash-preview");
      addLog("success", "Step 3 completed successfully.");

    } catch (error) {
      addLog("error", "Agent chain failed", error instanceof Error ? error.message : String(error));
      updateStepStatus(steps[currentStep-1]?.id || "step1", "error");
    } finally {
      setIsProcessing(false);
      setTelemetry(prev => ({ ...prev, activeJobs: 0 }));
    }
  };

  const updateStepStatus = (id: string, status: AgentStep["status"], output?: string) => {
    setSteps(prev => prev.map(s => s.id === id ? { ...s, status, output } : s));
  };

  // --- Render Helpers ---
  const renderDashboard = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: t.activeJobs, value: telemetry.activeJobs, icon: Activity, color: "text-blue-500" },
          { label: t.tokenUsage, value: "124k", icon: Zap, color: "text-yellow-500" },
          { label: t.latency, value: "1.2s", icon: History, color: "text-purple-500" },
          { label: t.providerHealth, value: telemetry.health, icon: ShieldCheck, color: "text-green-500" },
        ].map((stat, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="p-4 rounded-xl border shadow-sm flex items-center space-x-4 bg-white dark:bg-gray-800"
            style={{ borderColor: style.border }}
          >
            <div className={cn("p-3 rounded-lg bg-opacity-10", stat.color.replace("text", "bg"))}>
              <stat.icon className={cn("w-6 h-6", stat.color)} />
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400 uppercase font-bold tracking-wider">{stat.label}</p>
              <p className="text-xl font-bold dark:text-white">{stat.value}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="p-6 rounded-2xl border bg-white dark:bg-gray-800" style={{ borderColor: style.border }}>
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2 dark:text-white">
            <LayoutDashboard className="w-5 h-5" /> {t.stats}
          </h3>
          <div className="h-64 flex items-end justify-between gap-2 px-4">
            {[40, 70, 45, 90, 65, 80, 55, 85, 60, 95].map((h, i) => (
              <motion.div 
                key={i}
                initial={{ height: 0 }}
                animate={{ height: `${h}%` }}
                className="w-full rounded-t-md"
                style={{ backgroundColor: style.primary, opacity: 0.3 + (i * 0.07) }}
              />
            ))}
          </div>
          <div className="flex justify-between mt-4 text-xs text-gray-400">
            <span>00:00</span>
            <span>06:00</span>
            <span>12:00</span>
            <span>18:00</span>
            <span>23:59</span>
          </div>
        </div>

        <div className="p-6 rounded-2xl border bg-white dark:bg-gray-800 overflow-hidden flex flex-col" style={{ borderColor: style.border }}>
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2 dark:text-white">
            <Terminal className="w-5 h-5" /> {t.logs}
          </h3>
          <div className="flex-1 overflow-y-auto space-y-2 font-mono text-xs">
            {logs.map(log => (
              <div key={log.id} className="flex gap-2 animate-in fade-in slide-in-from-left-2">
                <span className="text-gray-400">[{log.timestamp}]</span>
                <span className={cn(
                  "font-bold uppercase",
                  log.level === "success" ? "text-green-500" :
                  log.level === "error" ? "text-red-500" :
                  log.level === "warn" ? "text-yellow-500" : "text-blue-500"
                )}>{log.level}:</span>
                <span className="dark:text-gray-300">{log.message}</span>
              </div>
            ))}
            {logs.length === 0 && <div className="text-gray-400 italic">No logs yet...</div>}
            <div ref={logEndRef} />
          </div>
        </div>
      </div>
    </div>
  );

  const renderMDRI = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Input Panel */}
        <div className="lg:col-span-1 space-y-4">
          <div className="p-6 rounded-2xl border bg-white dark:bg-gray-800" style={{ borderColor: style.border }}>
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2 dark:text-white">
              <FileText className="w-5 h-5" /> {t.input}
            </h3>
            <textarea 
              className="w-full h-48 p-3 rounded-xl border bg-gray-50 dark:bg-gray-900 dark:text-white focus:ring-2 outline-none transition-all"
              style={{ borderColor: style.border }}
              placeholder="Paste regulation news or guidance here..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
            />
            <div className="mt-4">
              <h4 className="text-sm font-bold mb-2 dark:text-gray-300">{t.template}</h4>
              <textarea 
                className="w-full h-32 p-3 rounded-xl border bg-gray-50 dark:bg-gray-900 dark:text-white text-xs focus:ring-2 outline-none"
                style={{ borderColor: style.border }}
                value={template}
                onChange={(e) => setTemplate(e.target.value)}
              />
            </div>
            <button 
              onClick={runAgentChain}
              disabled={isProcessing}
              className="w-full mt-6 py-3 rounded-xl font-bold text-white flex items-center justify-center gap-2 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ backgroundColor: style.primary }}
            >
              {isProcessing ? <Loader2 className="w-5 h-5 animate-spin" /> : <Play className="w-5 h-5" />}
              {isProcessing ? t.running : t.run}
            </button>
          </div>
        </div>

        {/* Agent Chain Panel */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center gap-4 mb-2">
            {steps.map((step, i) => (
              <React.Fragment key={step.id}>
                <div className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-bold transition-all",
                  step.status === "success" ? "bg-green-50 border-green-200 text-green-700" :
                  step.status === "running" ? "bg-blue-50 border-blue-200 text-blue-700 animate-pulse" :
                  "bg-gray-50 border-gray-200 text-gray-500"
                )}>
                  {step.status === "success" ? <CheckCircle className="w-4 h-4" /> : <span className="w-4 h-4 rounded-full border border-current flex items-center justify-center text-[10px]">{i+1}</span>}
                  {step.name}
                </div>
                {i < steps.length - 1 && <ChevronRight className="w-4 h-4 text-gray-300" />}
              </React.Fragment>
            ))}
          </div>

          <div className="p-6 rounded-2xl border bg-white dark:bg-gray-800 min-h-[500px]" style={{ borderColor: style.border }}>
            <AnimatePresence mode="wait">
              {artifacts.length > 0 ? (
                <motion.div 
                  key={artifacts[0].id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-4"
                >
                  <div className="flex justify-between items-center">
                    <h3 className="text-xl font-bold dark:text-white">{artifacts[0].title}</h3>
                    <div className="flex gap-2">
                      <button className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 transition-colors">
                        <Download className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                  <div className="prose dark:prose-invert max-w-none p-6 rounded-xl bg-gray-50 dark:bg-gray-900 border overflow-y-auto max-h-[600px]" style={{ borderColor: style.border }}>
                    <ReactMarkdown>{artifacts[0].content}</ReactMarkdown>
                  </div>
                </motion.div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-gray-400 space-y-4">
                  <Bot className="w-16 h-16 opacity-20" />
                  <p>{t.welcome}</p>
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );

  const renderSettings = () => (
    <div className="p-8 rounded-2xl border bg-white dark:bg-gray-800 space-y-8" style={{ borderColor: style.border }}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <h3 className="text-lg font-bold flex items-center gap-2 dark:text-white">
            <Palette className="w-5 h-5" /> {t.style}
          </h3>
          <div className="grid grid-cols-2 gap-3">
            {PANTONE_STYLES.map(s => (
              <button 
                key={s.id}
                onClick={() => setStyle(s)}
                className={cn(
                  "p-3 rounded-xl border text-left transition-all hover:scale-[1.02] flex items-center gap-3",
                  style.id === s.id ? "ring-2 ring-offset-2" : "opacity-70"
                )}
                style={{ borderColor: s.border, boxShadow: style.id === s.id ? `0 0 0 2px white, 0 0 0 4px ${s.primary}` : "none" }}
              >
                <div className="w-6 h-6 rounded-full" style={{ backgroundColor: s.primary }} />
                <span className="text-xs font-bold truncate dark:text-white">{s.name}</span>
              </button>
            ))}
          </div>
          <button 
            onClick={handleJackslot}
            className="w-full py-4 rounded-xl font-bold text-white flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:opacity-90 transition-all"
          >
            <Command className="w-5 h-5" /> JACKSLOT RANDOM
          </button>
        </div>

        <div className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-lg font-bold flex items-center gap-2 dark:text-white">
              <Sun className="w-5 h-5" /> {t.theme}
            </h3>
            <div className="flex gap-4">
              <button 
                onClick={() => setTheme("light")}
                className={cn(
                  "flex-1 py-3 rounded-xl border flex items-center justify-center gap-2 transition-all",
                  theme === "light" ? "bg-gray-100 border-gray-300 font-bold" : "opacity-50"
                )}
              >
                <Sun className="w-4 h-4" /> {t.light}
              </button>
              <button 
                onClick={() => setTheme("dark")}
                className={cn(
                  "flex-1 py-3 rounded-xl border flex items-center justify-center gap-2 transition-all bg-gray-800 text-white border-gray-700",
                  theme === "dark" ? "ring-2 ring-offset-2 font-bold" : "opacity-50"
                )}
              >
                <Moon className="w-4 h-4" /> {t.dark}
              </button>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-bold flex items-center gap-2 dark:text-white">
              <Globe className="w-5 h-5" /> {t.language}
            </h3>
            <div className="flex gap-4">
              <button 
                onClick={() => setLanguage("en")}
                className={cn(
                  "flex-1 py-3 rounded-xl border flex items-center justify-center gap-2 transition-all",
                  language === "en" ? "bg-gray-100 border-gray-300 font-bold" : "opacity-50"
                )}
              >
                {t.english}
              </button>
              <button 
                onClick={() => setLanguage("zh")}
                className={cn(
                  "flex-1 py-3 rounded-xl border flex items-center justify-center gap-2 transition-all",
                  language === "zh" ? "bg-gray-100 border-gray-300 font-bold" : "opacity-50"
                )}
              >
                {t.chinese}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className={cn(
      "min-h-screen transition-colors duration-500",
      theme === "dark" ? "bg-gray-950" : "bg-gray-50"
    )} style={{ color: style.text }}>
      
      {/* Sidebar */}
      <aside className={cn(
        "fixed left-0 top-0 h-full w-64 border-r transition-all z-50 bg-white dark:bg-gray-900",
        theme === "dark" ? "border-gray-800" : "border-gray-200"
      )}>
        <div className="p-6">
          <div className="flex items-center gap-3 mb-10">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-lg" style={{ backgroundColor: style.primary }}>
              <Command className="w-6 h-6" />
            </div>
            <h1 className="text-xl font-black tracking-tighter dark:text-white">MDRI FLOW</h1>
          </div>

          <nav className="space-y-2">
            {[
              { id: "dashboard", label: t.dashboard, icon: LayoutDashboard },
              { id: "mdri", label: t.mdri, icon: Bot },
              { id: "agents", label: t.agents, icon: Command },
              { id: "settings", label: t.settings, icon: Settings },
            ].map(item => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id as any)}
                className={cn(
                  "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium",
                  activeTab === item.id 
                    ? "text-white shadow-md" 
                    : "text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800"
                )}
                style={activeTab === item.id ? { backgroundColor: style.primary } : {}}
              >
                <item.icon className="w-5 h-5" />
                {item.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="absolute bottom-6 left-6 right-6">
          <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">System Status</span>
            </div>
            <p className="text-xs font-bold dark:text-white">All Systems Operational</p>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="pl-64 min-h-screen">
        <header className="h-20 border-b flex items-center justify-between px-8 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md sticky top-0 z-40" style={{ borderColor: style.border }}>
          <div className="flex items-center gap-4">
            <h2 className="text-lg font-bold dark:text-white capitalize">{activeTab}</h2>
            <div className="h-4 w-[1px] bg-gray-300" />
            <div className="flex items-center gap-2 text-xs text-gray-400 font-medium">
              <History className="w-3 h-3" /> Last updated: Just now
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex -space-x-2">
              {[1, 2, 3].map(i => (
                <div key={i} className="w-8 h-8 rounded-full border-2 border-white dark:border-gray-900 bg-gray-200 flex items-center justify-center text-[10px] font-bold">
                  U{i}
                </div>
              ))}
            </div>
            <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors dark:text-white">
              <AlertCircle className="w-5 h-5" />
            </button>
          </div>
        </header>

        <div className="p-8 max-w-7xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              {activeTab === "dashboard" && renderDashboard()}
              {activeTab === "mdri" && renderMDRI()}
              {activeTab === "settings" && renderSettings()}
              {activeTab === "agents" && (
                <div className="flex flex-col items-center justify-center h-[60vh] text-gray-400">
                  <Command className="w-20 h-20 mb-4 opacity-10" />
                  <p className="text-xl font-bold">Agent Studio Coming Soon</p>
                  <p className="text-sm">Full prompt orchestration and model switching is under development.</p>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Follow-up Questions Section */}
          <section className="mt-20 pt-10 border-t" style={{ borderColor: style.border }}>
            <h3 className="text-2xl font-black mb-8 dark:text-white">20 Comprehensive Follow-up Questions</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                "How does the 2022 FDA guidance differ from the 2018 version?",
                "What are the specific documentation requirements for premarket submissions?",
                "How should legacy devices be handled under the new cybersecurity framework?",
                "What role does the Software Bill of Materials (SBOM) play in compliance?",
                "How can manufacturers demonstrate 'Total Product Lifecycle' security?",
                "What are the common pitfalls in cybersecurity risk analysis for medical devices?",
                "How does the FDA define 'effective' cybersecurity transparency?",
                "What are the implications of the new guidance on international harmonisation (IMDRF)?",
                "How should vulnerability disclosure programs be structured?",
                "What is the relationship between QMS and cybersecurity in the new guidance?",
                "How can hospitals and manufacturers collaborate on risk management?",
                "What are the specific requirements for cloud-connected medical devices?",
                "How does the FDA evaluate the security of third-party software components?",
                "What are the expectations for post-market cybersecurity monitoring?",
                "How should incident response plans be documented for regulatory review?",
                "What are the differences in cybersecurity requirements for Class II vs Class III devices?",
                "How does the FDA view the use of artificial intelligence in medical device security?",
                "What are the best practices for conducting cybersecurity testing for FDA submissions?",
                "How can manufacturers ensure the security of remote patient monitoring systems?",
                "What are the future trends in medical device cybersecurity regulation?"
              ].map((q, i) => (
                <motion.div 
                  key={i}
                  whileHover={{ x: 5 }}
                  className="p-4 rounded-xl border bg-white dark:bg-gray-800 flex items-start gap-3 group cursor-pointer"
                  style={{ borderColor: style.border }}
                >
                  <div className="mt-1 p-1 rounded-md bg-gray-100 dark:bg-gray-700 group-hover:bg-indigo-100 transition-colors">
                    <ArrowRight className="w-3 h-3 text-gray-400 group-hover:text-indigo-600" />
                  </div>
                  <p className="text-sm font-medium dark:text-gray-300">{q}</p>
                </motion.div>
              ))}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
