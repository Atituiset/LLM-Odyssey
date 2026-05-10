import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'motion/react';
import { Terminal, Zap, BrainCircuit, Network, Sparkles, Workflow, ArrowRight, Layers, Cpu, Database, Share2, Box, Activity } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";

// --- Types ---
interface StepContent {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  color: string;
}

const STAGES: StepContent[] = [
  {
    id: 'tokenization',
    title: 'SYMBOL_ATOMIZER',
    subtitle: 'BPE_Decomposition',
    description: 'Transforming symbolic strings into discrete vocabulary manifolds. Character sequences collapse into optimized sub-word identifiers.',
    color: '#00f2ff',
  },
  {
    id: 'embedding',
    title: 'LATENT_PROJECTION',
    subtitle: 'High_D_Mapping',
    description: 'Projecting symbols into 1536-dimensional semantic space. Distance is now synonymous with contextual relevance.',
    color: '#a855f7',
  },
  {
    id: 'attention',
    title: 'SYNAPTIC_KERNEL',
    subtitle: 'QK_Dot_Interaction',
    description: 'The core neural operator. Tokens broadcast Queries to harvest Keys, calculating a dynamic relational dependency map.',
    color: '#f43f5e',
  },
  {
    id: 'ffn',
    title: 'NEURAL_TRANSDUCTION',
    subtitle: 'SwiGLU_Expansion',
    description: 'A 4x dimensional up-projection forcing feature interaction. Non-linear gates resolve latent patterns before compression.',
    color: '#fbbf24',
  },
  {
    id: 'softmax',
    title: 'WAVEFORM_COLLAPSE',
    subtitle: 'Probability_Decimation',
    description: 'Decoding the final distribution. The maximum energy state identifies the next symbolic link in the causal chain.',
    color: '#ffffff',
  },
];

let genAI: any = null;
const getAI = () => {
  if (!genAI) {
    const key = process.env.GEMINI_API_KEY;
    if (!key) throw new Error("GEMINI_API_KEY is missing");
    genAI = new GoogleGenAI(key as any);
  }
  return genAI;
};

// --- Mechanism Visualizers ---

const GlobalSpine = () => {
  const { scrollYProgress } = useScroll();
  const pathLength = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <div className="fixed right-12 top-0 bottom-0 w-[1px] bg-white/5 pointer-events-none z-10 hidden xl:block">
      <motion.div 
        className="absolute top-0 left-0 w-full bg-cyan-400 shadow-[0_0_40px_rgba(34,211,238,0.8)]"
        style={{ scaleY: pathLength, originY: 0 }}
      />
      {Array.from({ length: 60 }).map((_, i) => (
        <motion.div
          key={i}
          animate={{ 
            y: ["-10vh", "110vh"],
            opacity: [0, 0.4, 0],
          }}
          transition={{ 
            duration: Math.random() * 2 + 1, 
            repeat: Infinity, 
            delay: i * 0.05, 
            ease: "linear" 
          }}
          className="absolute left-1/2 -translate-x-1/2 w-[1px] h-48 bg-gradient-to-b from-transparent via-cyan-400/20 to-transparent blur-[1px]"
        />
      ))}
    </div>
  );
};

const NodePort = ({ type, color }: { type: 'in' | 'out', color: string }) => (
  <div className={`absolute left-1/2 -translate-x-1/2 ${type === 'in' ? '-top-32' : '-bottom-32'} flex flex-col items-center z-30`}>
    <div className="w-4 h-4 rounded-full bg-black border border-white/20 flex items-center justify-center relative">
      <div className="w-1 h-1 rounded-full animate-pulse" style={{ backgroundColor: color }} />
      <motion.div 
        animate={{ scale: [1, 2.5], opacity: [0.3, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute inset-0 border border-white/40 rounded-full"
      />
    </div>
    
    <div 
      className="w-[1px] h-24 bg-gradient-to-b opacity-20"
      style={{ 
        backgroundImage: type === 'out' 
          ? `linear-gradient(to bottom, ${color}, transparent)` 
          : `linear-gradient(to top, ${color}, transparent)`,
      }}
    />
  </div>
);

const TokenizerVisualizer = ({ words, color }: { words: string[], color: string }) => {
  const [activeIdx, setActiveIdx] = useState(0);
  useEffect(() => {
    const timer = setInterval(() => setActiveIdx(i => (i + 1) % words.length), 1000);
    return () => clearInterval(timer);
  }, [words.length]);

  return (
    <div className="relative w-full aspect-[16/10] max-h-[460px] p-10 flex flex-col items-center justify-center rounded-[3rem] bg-zinc-900/80 border border-white/10 backdrop-blur-3xl overflow-hidden shadow-2xl">
      <div className="absolute inset-0 matrix-grid opacity-10 pointer-events-none" />
      
      <div className="flex flex-wrap justify-center gap-3 mb-12 relative z-20 px-4">
        {words.map((word, i) => (
          <motion.div
            key={i}
            animate={{ 
              color: i === activeIdx ? color : 'rgba(255,255,255,0.15)',
              borderColor: i === activeIdx ? color : 'rgba(255,255,255,0.05)',
              backgroundColor: i === activeIdx ? `${color}15` : 'rgba(255,255,255,0.02)'
            }}
            className="px-3 py-1.5 border rounded-lg font-mono text-[11px] transition-all relative"
          >
            {word}
            {i === activeIdx && (
              <motion.div 
                layoutId="tokenizerHighlight"
                className="absolute inset-0 bg-white/5 rounded-lg border shadow-[0_0_15px_currentColor]" 
                style={{ borderColor: color, color }}
                transition={{ type: "spring", bounce: 0, duration: 0.4 }}
              />
            )}
          </motion.div>
        ))}
      </div>

      <div className="w-full space-y-3 px-8 relative z-20 text-left opacity-80">
        <div className="flex justify-between items-center mb-2">
           <span className="text-[8px] font-mono opacity-30 uppercase tracking-[0.4em]">Sub_Manifold_Decomp</span>
           <span className="text-[8px] font-mono text-cyan-400/40 uppercase">Map_0xFA{words.length}</span>
        </div>
        
        {words.slice(0, 5).map((word, i) => (
          <div key={i} className="flex items-center gap-6">
            <span className={`text-[10px] font-mono w-16 truncate transition-colors ${i === activeIdx ? 'text-white' : 'text-zinc-600'}`}>{word}</span>
            <div className="flex-1 h-[1px] bg-white/[0.02] relative overflow-hidden">
               <motion.div 
                animate={{ 
                  left: i === activeIdx ? '0%' : '100%',
                  width: i === activeIdx ? '100%' : '0%'
                }}
                className="absolute inset-y-0 shadow-[0_0_8px_currentColor]"
                style={{ backgroundColor: color, color }}
               />
            </div>
            <span className={`text-[10px] font-mono ${i === activeIdx ? color : 'text-zinc-800'}`}>
              0x{(Math.floor(Math.random() * 60000)).toString(16).toUpperCase()}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

const EmbeddingSpaceVisualizer = ({ words, color }: { words: string[], color: string }) => {
  return (
    <div className="relative w-full aspect-[16/10] max-h-[500px] flex items-center justify-center p-16 rounded-[2.5rem] bg-zinc-900/40 border border-white/10 backdrop-blur-2xl overflow-hidden perspective-1000 shadow-2xl">
      <div className="absolute inset-0 matrix-grid opacity-20 pointer-events-none" />
      
      {/* 3D Origin Pulse */}
      <motion.div 
        animate={{ scale: [1, 2.5, 1], opacity: [0.1, 0.4, 0.1] }}
        transition={{ duration: 10, repeat: Infinity }}
        className="absolute w-[600px] h-[600px] border-2 border-white/10 rounded-full blur-3xl"
        style={{ borderColor: `${color}44` }}
      />

      <div className="relative w-full h-full">
        {words.map((word, i) => (
          <motion.div
            key={i}
            initial={{ 
              x: (Math.random() - 0.5) * 600,
              y: (Math.random() - 0.5) * 600,
              opacity: 0
            }}
            animate={{ 
              opacity: 1,
              x: [(Math.random() - 0.5) * 700, (Math.random() - 0.5) * 700, (Math.random() - 0.5) * 700],
              y: [(Math.random() - 0.5) * 700, (Math.random() - 0.5) * 700, (Math.random() - 0.5) * 700]
            }}
            transition={{ 
              duration: 15 + i * 5, 
              repeat: Infinity,
              ease: "linear"
            }}
            className="absolute"
          >
            <div className="relative group cursor-none">
              <motion.div 
                animate={{ scale: [1, 1.5, 1], opacity: [0.8, 1, 0.8] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-3 h-3 rounded-full shadow-[0_0_30px_currentColor] transition-all group-hover:scale-[3] z-10 relative" 
                style={{ backgroundColor: color, color }} 
              />
              <div className="absolute top-8 left-1/2 -translate-x-1/2 bg-black border-2 border-white/20 px-6 py-3 rounded-2xl backdrop-blur-3xl opacity-0 group-hover:opacity-100 transition-all scale-75 group-hover:scale-100 pointer-events-none z-30 shadow-2xl min-w-[120px]">
                <div className="flex flex-col gap-2">
                   <span className="text-sm font-mono text-white font-black tracking-tight">{word}</span>
                   <div className="h-px bg-white/10" />
                   <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest">Vector_Pos: {Math.random().toFixed(5)}</span>
                </div>
              </div>
              <div className="absolute top-1/2 left-1/2 w-[800px] h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent origin-left opacity-30 group-hover:opacity-100 transition-opacity" />
            </div>
          </motion.div>
        ))}
      </div>

      <div className="absolute top-12 left-12 flex flex-col gap-3">
        <div className="flex items-center gap-4">
          <div className="w-3 h-3 rounded-full shadow-[0_0_10px_currentColor]" style={{ backgroundColor: color, color }} />
          <span className="text-xs font-mono font-bold opacity-70 uppercase tracking-[0.5em]">Latent_Manifold_Projector</span>
        </div>
        <div className="h-px w-60 bg-gradient-to-r from-white/30 to-transparent" />
      </div>
    </div>
  );
};

const MultiHeadAttentionVisualizer = ({ words, color }: { words: string[], color: string }) => {
  const [activeTokenIdx, setActiveTokenIdx] = useState(0);
  
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveTokenIdx((current) => (current + 1) % words.length);
    }, 2000);
    return () => clearInterval(timer);
  }, [words.length]);

  return (
    <div className="relative w-full aspect-[16/10] max-h-[500px] flex flex-col items-center justify-center p-12 rounded-[2.5rem] bg-zinc-900/60 border border-white/10 backdrop-blur-3xl overflow-hidden shadow-2xl">
      <div className="absolute top-10 left-10 flex items-center gap-3">
        <Activity size={14} className="text-pink-500 animate-pulse" />
        <div className="flex flex-col">
          <span className="text-[10px] font-mono text-zinc-300 font-bold uppercase tracking-[0.3em]">Attention_Context_V4</span>
          <span className="text-[8px] font-mono opacity-30 uppercase tracking-widest">Relational_Dependency_Map</span>
        </div>
      </div>

      {/* Connectivity Heatmap Grid */}
      <div className="absolute inset-0 grid grid-cols-12 grid-rows-12 gap-px opacity-[0.03] pointer-events-none">
        {Array.from({ length: 144 }).map((_, i) => (
          <motion.div 
            key={i}
            animate={{ opacity: [0.3, 0.7, 0.3] }}
            transition={{ duration: 3, delay: i * 0.02, repeat: Infinity }}
            className="bg-white"
          />
        ))}
      </div>

      <div className="relative flex items-center justify-between w-full max-w-lg h-64 px-10 z-20">
        <div className="flex flex-col justify-between h-full">
          {words.map((word, i) => (
            <motion.div
              key={`src-${i}`}
              animate={{ 
                opacity: i === activeTokenIdx ? 1 : 0.4,
                scale: i === activeTokenIdx ? 1.1 : 0.9,
                x: i === activeTokenIdx ? 5 : 0,
                color: i === activeTokenIdx ? '#fff' : 'rgba(255,255,255,0.3)'
              }}
              className="text-[12px] font-mono font-bold"
            >
              {word}
            </motion.div>
          ))}
        </div>

        <div className="flex-1 relative mx-6 h-full">
           <svg className="absolute inset-0 w-full h-full overflow-visible pointer-events-none">
             {words.map((_, targetIdx) => (
               <React.Fragment key={`group-${targetIdx}`}>
                 <motion.line
                   x1="0%"
                   y1={`${(activeTokenIdx / (words.length - 1)) * 100}%`}
                   x2="100%"
                   y2={`${(targetIdx / (words.length - 1)) * 100}%`}
                   stroke={color}
                   strokeWidth={activeTokenIdx === targetIdx ? 2 : 0.6}
                   initial={{ opacity: 0 }}
                   animate={{ 
                     opacity: activeTokenIdx === targetIdx ? 0.6 : 0.1,
                     strokeDasharray: activeTokenIdx === targetIdx ? "0" : "4 2"
                   }}
                   transition={{ duration: 0.5 }}
                 />
                 {activeTokenIdx === targetIdx && (
                   <motion.circle
                     r="2.5"
                     fill={color}
                     cx="0%"
                     cy={`${(activeTokenIdx / (words.length - 1)) * 100}%`}
                     animate={{ 
                       cx: ["0%", "100%"],
                       cy: [`${(activeTokenIdx / (words.length - 1)) * 100}%`, `${(targetIdx / (words.length - 1)) * 100}%`],
                     }}
                     transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }}
                     style={{ filter: 'drop-shadow(0 0 8px currentColor)' }}
                   />
                 )}
               </React.Fragment>
             ))}
           </svg>
           
           <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-20 h-20 rounded-full border border-white/20 bg-black/80 flex items-center justify-center backdrop-blur-3xl shadow-xl">
                 <motion.div 
                  animate={{ rotate: 360 }}
                  transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                  className="absolute -inset-2 border border-dashed border-pink-500/20 rounded-full"
                 />
                 <div className="flex flex-col items-center">
                    <span className="text-[9px] font-mono font-bold text-pink-400/80">QKᵀ</span>
                    <span className="text-[7px] font-mono opacity-30 mt-1">Normalized</span>
                 </div>
              </div>
           </div>
        </div>

        <div className="flex flex-col justify-between h-full items-end text-right">
          {words.map((word, i) => (
            <motion.div
              key={`target-${i}`}
              animate={{ 
                opacity: activeTokenIdx === i ? 1 : 0.2,
                color: activeTokenIdx === i ? color : 'rgba(255,255,255,0.2)',
                scale: activeTokenIdx === i ? 1.05 : 1
              }}
              className="text-[11px] font-mono font-bold"
            >
              {word}
              <div className="h-0.5 w-10 bg-white/5 mt-1 rounded-full overflow-hidden">
                <motion.div 
                   animate={{ width: activeTokenIdx === i ? '100%' : '10%' }}
                   className="h-full" 
                   style={{ backgroundColor: color }}
                />
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="absolute bottom-10 inset-x-12 flex justify-between items-center text-[8px] font-mono opacity-40">
        <div className="flex gap-4">
          <div className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-cyan-400" /> Q</div>
          <div className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-purple-500" /> K</div>
          <div className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-pink-500" /> V</div>
        </div>
        <div className="uppercase tracking-[0.4em] font-bold">
          Dependency_Locked
        </div>
      </div>
    </div>
  );
};

const FFNVisualizer = ({ color }: { color: string }) => {
  return (
    <div className="relative w-full aspect-[16/10] max-h-[460px] flex items-center justify-center p-12 rounded-[3rem] bg-zinc-900/80 border border-white/10 backdrop-blur-3xl overflow-hidden shadow-2xl">
      <div className="absolute inset-0 matrix-grid opacity-10 pointer-events-none" />
      
      <div className="flex items-center justify-between w-full max-w-xl gap-8 relative z-10">
        <div className="flex flex-col gap-1.5 w-8 opacity-20">
          {Array.from({ length: 12 }).map((_, i) => <div key={i} className="h-[2px] bg-white rounded-full" />)}
        </div>

        <div className="flex-1 flex flex-col items-center justify-center gap-6">
          <motion.div 
            animate={{ 
              scale: [1, 1.02, 1],
              borderColor: [`${color}22`, `${color}88`, `${color}22`],
            }}
            transition={{ duration: 4, repeat: Infinity }}
            className="w-40 h-40 rounded-[2rem] border-2 flex items-center justify-center relative overflow-hidden bg-black/40 backdrop-blur-3xl"
          >
            <div className="flex flex-col items-center gap-2">
               <Cpu size={24} style={{ color }} className="drop-shadow-[0_0_10px_currentColor]" />
               <span className="font-mono text-[9px] font-bold text-white tracking-[0.3em]">REASON_V4</span>
            </div>
            <motion.div 
              animate={{ y: [-100, 100] }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="absolute inset-x-0 h-10 bg-gradient-to-b from-transparent via-white/5 to-transparent pointer-events-none"
            />
          </motion.div>
        </div>

        <div className="flex flex-col gap-1.5 w-8 opacity-20">
          {Array.from({ length: 12 }).map((_, i) => <div key={i} className="h-[2px] bg-white rounded-full" style={{ backgroundColor: color }} />)}
        </div>
      </div>

      <div className="absolute top-10 left-10 flex items-center gap-2 opacity-30">
        <span className="text-[8px] font-mono font-bold uppercase tracking-widest">Expansion_SwiGLU_Gate</span>
      </div>
    </div>
  );
};

const SoftmaxVisualizer = ({ color }: { color: string }) => {
  return (
    <div className="relative w-full aspect-[16/10] max-h-[460px] flex flex-col items-center justify-center p-12 rounded-[3rem] bg-zinc-900/80 border border-white/10 backdrop-blur-3xl overflow-hidden shadow-2xl">
      <div className="absolute inset-0 matrix-grid opacity-10 pointer-events-none" />
      
      <div className="w-full flex flex-col items-center gap-12 relative z-10">
        <div className="flex items-center gap-3 opacity-40">
          <Workflow size={12} className="text-cyan-400" />
          <span className="text-[9px] font-mono font-bold uppercase tracking-[0.5em]">Energy_Collapse_Vector</span>
        </div>

        <div className="flex items-end gap-2 h-40 w-full max-w-sm px-8 overflow-hidden">
          {Array.from({ length: 24 }).map((_, i) => {
            const isWinner = i === 14;
            const h = isWinner ? '100%' : `${10 + Math.random() * 30}%`;
            return (
              <div key={i} className="flex-1 flex flex-col items-center h-full">
                 <div className="w-full h-full bg-white/[0.02] rounded-t-sm relative group overflow-hidden">
                    <motion.div 
                      initial={{ height: 0 }}
                      animate={{ height: h, opacity: isWinner ? 1 : 0.1 }}
                      transition={{ duration: 1, delay: i * 0.03 }}
                      className="absolute bottom-0 inset-x-0 rounded-t-sm"
                      style={{ 
                        backgroundColor: isWinner ? color : 'white',
                        boxShadow: isWinner ? `0 0 20px ${color}` : 'none'
                      }}
                    />
                 </div>
              </div>
            );
          })}
        </div>

        <div className="flex flex-col items-center gap-1">
           <span className="text-[8px] font-mono opacity-20 uppercase tracking-[0.2em]">Neural_Successor_Selected</span>
           <span className="text-lg font-mono text-white glow-text font-black italic">TARGET_TOKEN_V.01</span>
        </div>
      </div>
    </div>
  );
};

const StageNode = ({ data, index, queryInsight, children }: { data: StepContent; index: number; queryInsight?: string; children?: React.ReactNode }) => {
  return (
    <motion.section
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ margin: "-100px" }}
      className="min-h-screen flex flex-col items-center justify-center py-32 relative px-6 z-20"
    >
      <div className="max-w-7xl w-full grid lg:grid-cols-2 gap-24 items-center">
        <div className="space-y-10 order-2 lg:order-1">
          <div className="flex items-center gap-4">
             <div className="w-12 h-12 rounded-xl bg-white/[0.03] border border-white/10 flex items-center justify-center shadow-xl">
               <Database size={20} style={{ color: data.color }} />
             </div>
             <div className="flex flex-col">
               <span className="font-mono text-[9px] tracking-[0.5em] uppercase text-cyan-400/60 font-bold">Node_Sequence</span>
               <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-zinc-500">Unit_Type_0{index + 1}</span>
             </div>
          </div>
          
          <div className="space-y-6">
            <h2 className="text-3xl md:text-5xl font-black tracking-tighter uppercase italic leading-[0.8] glow-text" style={{ textShadow: `0 0 50px ${data.color}33` }}>
              {data.title.replace('_', '\n')}
            </h2>
            <p className="text-base text-zinc-500 font-medium italic tracking-tight max-w-md leading-relaxed">
              {data.description}
            </p>
          </div>

          <AnimatePresence>
            {queryInsight && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-8 border border-white/5 bg-white/[0.01] rounded-[2rem] relative group backdrop-blur-2xl"
              >
                <div className="flex items-center gap-3 mb-4 opacity-40">
                  <span className="text-[9px] font-mono font-bold uppercase tracking-[0.6em]">Trace_Log</span>
                </div>
                <p className="text-sm font-mono text-zinc-300 italic leading-relaxed relative z-10 border-l border-white/10 pl-6">
                   &gt; {queryInsight}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="relative flex items-center justify-center order-1 lg:order-2">
           <div className="absolute inset-0 bg-white/[0.005] blur-[150px] pointer-events-none" style={{ backgroundColor: `${data.color}05` }} />
           
           <div className="relative z-10 w-full flex justify-center items-center">
             <NodePort type="in" color={data.color} />
             <div className="w-full flex justify-center items-center scale-90 xl:scale-110 transition-transform">
                {children}
             </div>
             <NodePort type="out" color={data.color} />
           </div>
        </div>
      </div>
    </motion.section>
  );
};

// --- Main App ---

export default function App() {
  const [appState, setAppState] = useState<'intro' | 'diving'>('intro');
  const [userQuery, setUserQuery] = useState('');
  const [insights, setInsights] = useState<any>({});
  const [loading, setLoading] = useState(false);

  const tokens = useMemo(() => userQuery.trim().split(/\s+/).slice(0, 6) || ["Neural", "Trace"], [userQuery]);

  const handleStart = async (query: string) => {
    if (!query.trim()) return;
    setLoading(true);
    setAppState('diving');

    try {
      const model = getAI().getGenerativeModel({ model: "gemini-2.0-flash" });
      const prompt = `You are a Senior Deep Learning Engineer. Perform a high-fidelity neural trace of "${query}" through a Transformer.
      For each stage, provide ONE precise technical observation (max 20 words) that explains the LOGIC of that component:
      1. BPE_FRAGMENTER: Explain how the specific string is chunked into semantic atoms.
      2. LATENT_PROJECTION: What are the semantic coordinates or geometric properties of these tokens?
      3. SYNAPTIC_ATTENTION: Identify specific token-to-token dependencies (Query/Key agreement).
      4. NEURAL_EXPANSION: What feature interactions are occurring in the 4x expansion space?
      5. PROBABILITY_COLLAPSE: Describe the final energy distribution over the vocabulary.
      Return strictly as JSON with keys: tokenization, embedding, attention, ffn, softmax.`;

      const result = await model.generateContent({
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        generationConfig: { responseMimeType: "application/json" }
      });
      const response = await result.response;
      setInsights(JSON.parse(response.text()));
    } catch (e) {
      console.error(e);
      // Fallback insights - High Fidelity
      setInsights({
        tokenization: "Sub-word symbolic fragmentation active: Mapping character sequences to vocabulary manifold.",
        embedding: "Vectorial grounding complete: Tokens projected into 1536-dimensional continuous semantic space.",
        attention: "Dynamic relational weighting: Calculating cross-dependency scores via QKᵀ dot-product interaction.",
        ffn: "Point-wise feature transduction: Expanding vector space to 11,008 dimensions for non-linear reasoning.",
        softmax: "Energy distribution collapse: Maximum likelihood estimation identifies the most probable symbolic successor."
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#030303] text-white selection:bg-cyan-500 selection:text-black font-sans overflow-x-hidden">
      <div className="fixed inset-0 pointer-events-none opacity-[0.03] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] z-50" />
      
      {appState === 'diving' && <GlobalSpine />}

      <AnimatePresence mode="wait">
        {appState === 'intro' ? (
          <motion.main 
            key="intro"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, y: -20, filter: 'blur(20px)' }}
            className="min-h-screen flex flex-col items-center justify-center p-6 text-center z-10 relative"
          >
            <div className="mb-12 relative">
               <motion.div 
                animate={{ opacity: [0.1, 0.3, 0.1] }}
                transition={{ duration: 4, repeat: Infinity }}
                className="absolute -inset-20 bg-cyan-500/10 blur-[100px] -z-10"
               />
              <h1 className="text-3xl md:text-5xl font-black tracking-tighter uppercase italic glow-text mb-4 leading-[0.8]">
                NEURAL_CORTEX<br />ARCHITECTURE
              </h1>
              <p className="font-mono text-[8px] tracking-[1.2em] text-cyan-500/30 uppercase mt-4">
                High_Dynamic_Neural_Inference_V4
              </p>
            </div>

            <div className="max-w-xl w-full">
              <div className="p-1.5 border border-white/5 bg-white/[0.02] rounded-[3rem] shadow-2xl backdrop-blur-3xl overflow-hidden group max-w-2xl w-full">
                 <div className="bg-black/95 p-12 rounded-[2.8rem] relative">
                   <div className="absolute top-0 right-16 flex gap-2">
                      <motion.div animate={{ height: [0, 20, 0] }} transition={{ duration: 2, repeat: Infinity }} className="w-[1px] bg-cyan-500/30" />
                      <motion.div animate={{ height: [0, 30, 0] }} transition={{ duration: 2, repeat: Infinity, delay: 0.5 }} className="w-[1px] bg-cyan-500/50" />
                   </div>
                   
                   <div className="flex items-center gap-4 mb-8 opacity-40">
                      <Terminal size={12} className="text-cyan-500" />
                      <span className="text-[10px] font-mono tracking-[0.4em] uppercase">System_Sequence_Input</span>
                   </div>

                   <textarea 
                     autoFocus
                     placeholder="Inject query sequence for neural tracing..."
                     className="w-full bg-transparent border-none focus:ring-0 text-white transition-all text-xl font-mono h-32 resize-none placeholder:text-zinc-800 leading-relaxed"
                     onChange={(e) => setUserQuery(e.target.value)}
                   />
                   
                   <div className="mt-8 flex justify-between items-center border-t border-white/5 pt-8">
                      <div className="flex gap-4">
                        <div className="flex flex-col">
                           <span className="text-[8px] font-mono opacity-20 uppercase">Latent_State</span>
                           <span className="text-[10px] font-mono text-cyan-500/40">IDLE_READY</span>
                        </div>
                        <div className="w-[1px] h-8 bg-white/5" />
                        <div className="flex flex-col">
                           <span className="text-[8px] font-mono opacity-20 uppercase">Buffer_Flow</span>
                           <span className="text-[10px] font-mono text-yellow-500/40">STABLE</span>
                        </div>
                      </div>
                      
                      <button 
                        disabled={!userQuery.trim() || loading}
                        onClick={() => handleStart(userQuery)}
                        className="px-12 py-4 bg-white text-black font-bold rounded-2xl flex items-center justify-center gap-4 transition-all hover:bg-cyan-400 hover:scale-[1.02] active:scale-95 disabled:opacity-30 group shadow-[0_20px_50px_rgba(255,255,255,0.1)]"
                      >
                        <Zap className="w-4 h-4 fill-current" />
                        <span className="tracking-[0.2em] text-[10px] uppercase">Initialize_Session</span>
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </button>
                   </div>
                 </div>
              </div>
              
              <div className="mt-12 flex justify-center gap-12 opacity-10 filter grayscale">
                <BrainCircuit size={16} />
                <Workflow size={16} />
                <Layers size={16} />
              </div>
            </div>
          </motion.main>
        ) : (
          <motion.div 
            key="diving"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="relative"
          >
            <div className="max-w-7xl mx-auto pt-40 px-6">
              <header className="mb-40 text-center relative">
                 <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-px bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent" />
                 <h2 className="text-4xl md:text-6xl font-bold tracking-tighter leading-tight italic uppercase glow-text">
                   The_Neural_Stack
                 </h2>
                 <div className="mt-6 font-mono text-[9px] tracking-[0.5em] text-zinc-600 uppercase">
                    Sequence: {userQuery.slice(0, 20)}...
                 </div>
              </header>

              {STAGES.map((stage, idx) => (
                <StageNode 
                  key={stage.id} 
                  data={stage} 
                  index={idx} 
                  queryInsight={insights[stage.id]} 
                >
                   {stage.id === 'tokenization' && <TokenizerVisualizer words={tokens} color={stage.color} />}
                   {stage.id === 'embedding' && <EmbeddingSpaceVisualizer words={tokens} color={stage.color} />}
                   {stage.id === 'attention' && <MultiHeadAttentionVisualizer words={tokens} color={stage.color} />}
                   {stage.id === 'ffn' && <FFNVisualizer color={stage.color} />}
                   {stage.id === 'softmax' && <SoftmaxVisualizer color={stage.color} />}
                </StageNode>
              ))}

              <footer className="py-60 text-center border-t border-white/5 mt-40 glass-bg">
                <div className="w-px h-32 bg-cyan-500/20 mx-auto mb-16" />
                <h3 className="text-3xl md:text-5xl font-bold italic mb-12 uppercase glow-text">Neural Exit</h3>
                <p className="text-zinc-600 font-mono text-[9px] tracking-[1em] mb-20 uppercase">
                  Trace_Terminated // Buffer_Clear
                </p>
                <button 
                  onClick={() => setAppState('intro')}
                  className="px-16 py-6 rounded-full bg-white text-black font-bold tracking-[0.2em] text-[10px] uppercase hover:scale-110 active:scale-95 transition-all shadow-2xl"
                >
                  New_Trace_Sequence
                </button>
              </footer>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        .glow-text {
          text-shadow: 0 0 40px rgba(0, 242, 255, 0.3);
        }
        @keyframes scanline {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100vh); }
        }
        .scanline {
          position: fixed; top: 0; left: 0; width: 100%; height: 4px;
          background: linear-gradient(to bottom, transparent, rgba(0,242,255,0.05), transparent);
          z-index: 60; animation: scanline 10s linear infinite; pointer-events: none;
        }
      `}</style>
    </div>
  );
}
