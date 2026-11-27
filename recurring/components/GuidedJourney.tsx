"use client";
import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import type { TouchEvent } from "react";
import type { CSSProperties } from "react";
import { gsap } from "gsap";

const chapters = [
 { eyebrow:"01 · A SEQUENCE", title:"A machine reads one moment at a time.", deck:"A sequence is more than a row of isolated inputs. Each new element arrives with a past already behind it.", seconds:6 },
 { eyebrow:"02 · RECURRENCE", title:"The present meets the past.", deck:"A recurrent neural network (RNN) combines the current input with a summary of what it has seen so far.", seconds:6 },
 { eyebrow:"03 · HIDDEN STATE", title:"Memory is a changing state.", deck:"The hidden state is a learned, compact representation. It updates at every time step; it is not a perfect record of the entire history.", seconds:7 },
 { eyebrow:"04 · SHARED WEIGHTS", title:"One computation, repeated through time.", deck:"The same recurrent cell and parameters are reused at every step. The inputs and state change; the rule stays shared.", seconds:6 },
 { eyebrow:"05 · PREDICTION", title:"Read the sequence. Make a prediction.", deck:"A vanilla RNN can predict at every step or after the sequence. Training compares predictions with targets using a loss.", seconds:7 },
 { eyebrow:"06 · TRAINING", title:"Learning travels backward through the unrolled sequence.", deck:"Backpropagation through time (BPTT) applies the chain rule through repeated computations to assign credit to earlier steps.", seconds:7 },
 { eyebrow:"07 · THE VANILLA RNN", title:"A complete RNN is simple—and useful.", deck:"Inputs update hidden states; states produce outputs; a loss measures error; gradients update shared weights. For short or local patterns, this can be a useful model.", seconds:8 },
 { eyebrow:"08 · THE LIMIT", title:"Then the learning signal has to travel far.", deck:"Repeated derivatives can shrink toward zero or grow very large. This can make distant information difficult to learn, especially across long sequences.", seconds:8 },
 { eyebrow:"09 · WHY GATES", title:"The issue is preserving useful information and gradients.", deck:"A vanilla RNN has no explicit route for deciding what to keep, overwrite, or expose. Gated cells give the model learned control over information flow.", seconds:8 },
 { eyebrow:"10 · LSTM", title:"LSTM gives the state a protected path.", deck:"Long Short-Term Memory adds a cell state plus forget, input, and output gates. They learn how to retain, write, and reveal information.", seconds:8 },
 { eyebrow:"11 · GRU", title:"GRU makes the control more compact.", deck:"A Gated Recurrent Unit uses reset and update gates, combining memory and hidden state in one stream. It is a different design choice, not a universal upgrade.", seconds:8 },
 { eyebrow:"12 · CHOOSING", title:"Now choose the recurrent cell for the task.", deck:"When a plain RNN struggles with long dependencies, compare an LSTM or GRU. Validate on the task: gated models add complexity and do not guarantee success.", seconds:7 },
 { eyebrow:"13 · THE RESEARCH", title:"Start with the paper. Then follow the ideas forward.", deck:"Elman’s 1990 paper studied recurrent links and context units as a way to learn temporal structure. BPTT, long-dependency analyses, LSTM, and GRU are later work.", seconds:7 }
];

function RnnSculpture() {
 return <div className="rnn3d-stage" role="img" aria-label="Three-dimensional conceptual RNN unfolded through three time steps. The same cell repeats while a signal and hidden state move forward.">
  <div className="rnn3d-grid" aria-hidden="true"/><div className="rnn3d-axis">TIME →</div>
  <div className="rnn3d-run">
   {["t₁","t₂","t₃"].map((time,i)=><div className={"rnn3d-step step-"+(i+1)} key={time}>
    <span className="rnn3d-time">{time}</span><div className="rnn-cube"><span className="cube-top">hₜ₋₁</span><span className="cube-front">RNN</span><span className="cube-side">Wₕ</span></div>
    <span className="rnn3d-input">x{i+1}</span><span className="rnn3d-state">h{i+1}</span>
   </div>)}
   <i className="rnn3d-link link-a"/><i className="rnn3d-link link-b"/><i className="rnn3d-signal"/>
  </div><div className="rnn3d-caption"><span>SAME CELL</span><span>STATE CARRIED FORWARD</span></div>
 </div>;
}
function SequenceMarks() {
 return <div className="sequence-demo"><div className="sequence-line"><span>I</span><span>love</span><span>neural</span><span>networks.</span></div>
  <div className="sequence-context"><span>“bank” after <b>river</b></span><span>“bank” after <b>loan</b></span></div><p>Same next word. Different context. Context changes the prediction.</p></div>;
}
function FoxTrail() {
 return <div className="fox-trail" role="img" aria-label="An illustrated fox follows a trail of sequence signals to guess what comes next.">
  <svg viewBox="0 0 620 390" aria-hidden="true">
   <path className="fox-hill" d="M0 309 Q115 252 230 296 T450 286 T620 260 V390 H0Z"/>
   <path className="fox-path" d="M32 278 C128 215 198 335 300 264 S475 221 590 151"/>
   {[{x:54,y:265,t:"x₁"},{x:201,y:286,t:"x₂"},{x:356,y:250,t:"x₃"},{x:518,y:190,t:"?"}].map((n,i)=><g className="fox-token" style={{animationDelay:`${i*.2}s`}} key={n.t}><circle cx={n.x} cy={n.y} r="22"/><text x={n.x} y={n.y+5}>{n.t}</text></g>)}
   <g className="fox" transform="translate(240 123)"><path className="fox-tail" d="M62 103 C12 91 23 32 63 45 C91 54 78 81 59 76 C48 73 51 62 60 62"/><ellipse className="fox-body" cx="104" cy="105" rx="61" ry="34"/><path className="fox-neck" d="M131 99 L155 60 L175 97Z"/><circle className="fox-head" cx="158" cy="59" r="29"/><path className="fox-ear" d="M140 39 L143 4 L163 34 M164 36 L185 10 L181 48Z"/><path className="fox-muzzle" d="M178 63 Q206 67 190 82 L171 79Z"/><circle className="fox-eye" cx="166" cy="55" r="3"/><path className="fox-leg" d="M76 124l-5 28m28-26 2 28m42-32 7 29m-26-34 3 35"/><path className="fox-smile" d="M178 74q8 5 13 0"/></g>
   <circle className="fox-firefly" r="7"><animateMotion dur="5s" repeatCount="indefinite" path="M32 278 C128 215 198 335 300 264 S475 221 590 151"/></circle>
  </svg><p>Follow the clues. What might come next?</p>
 </div>;
}
function StateEquation() {
 return <div className="equation-demo" aria-label="The hidden state at time t is a function of the current input and previous hidden state.">
  <div className="equation-main">hₜ = f(Wₓxₜ + Wₕhₜ₋₁ + b)</div><div className="equation-key"><span><i className="key-input"/>current input xₜ</span><span><i className="key-memory"/>previous state hₜ₋₁</span><span><i className="key-weight"/>learned weights</span><span><i className="key-new"/>new state hₜ</span></div></div>;
}
function UnrolledCells() {
 return <div className="unroll-demo"><div className="unroll-cells">{[1,2,3,4,5].map(t=><div key={t}><small>t{t}</small><b>RNN</b></div>)}</div>
  <div className="unroll-brace"><span>one shared set of parameters</span></div><p>Unrolling draws the same recurrent update at every time step so training can calculate through the sequence.</p></div>;
}
function TrainingFlow() {
 return <div className="training-demo"><div className="flow-forward"><small>FORWARD PASS</small><div><span>x₁</span><i>→</i><span>h₁</span><i>→</i><span>h₂</span><i>→</i><span>ŷ</span></div><p>Compare prediction ŷ with target y to calculate loss.</p></div>
  <div className="flow-back"><small>BACKWARD PASS · BPTT</small><div><span>∂L/∂h₁</span><i>←</i><span>∂L/∂h₂</span><i>←</i><span>∂L/∂ŷ</span></div><p>Gradients flow backward through each reused step.</p></div></div>;
}
function GradientLab() {
 const [factor,setFactor]=useState(0.72); const values=Array.from({length:9},(_,step)=>Math.pow(factor,step));
 const points=values.map((v,i)=>(28+i*42)+","+(126-Math.min(v,1.6)/1.6*98)).join(" ");
 const mode=factor<0.96?"shrinks":factor>1.04?"grows":"stays roughly level";
 return <div className="gradient-lab"><div className="gradient-lab-top"><span>ONE REPEATED SCALAR DERIVATIVE</span><b>{factor.toFixed(2)}ⁿ</b></div>
  <svg viewBox="0 0 380 155" role="img" aria-label={"Illustrative gradient signal "+mode+" across eight repeated steps. At step eight its magnitude is "+values[8].toPrecision(2)+"."}>
   <path d="M28 18V127H365" className="gradient-axis"/><polyline points={points} className="gradient-curve" fill="none"/>
   {values.map((v,i)=><g key={i}><circle cx={28+i*42} cy={126-Math.min(v,1.6)/1.6*98} r="3.5" className="gradient-dot"/><text x={28+i*42} y="145">{i}</text></g>)}
   <text x="30" y="13">SIGNAL</text><text x="320" y="145">STEP →</text>
  </svg><label htmlFor="gradient-factor">Derivative passed along at each step <output>{factor.toFixed(2)}</output></label>
  <input id="gradient-factor" type="range" min="0.55" max="1.35" step="0.01" value={factor} onChange={e=>setFactor(Number(e.target.value))}/>
  <p className="gradient-readout" aria-live="polite">After 8 steps, this simplified signal {mode}: <b>{values[8].toPrecision(3)}</b></p>
  <small>Illustrative scalar model only. Real RNN gradients multiply Jacobians; this is not measured model data.</small></div>;
}
function LstmGates() {
 return <div className="gate-journey"><div className="cell-route"><span className="route-label">CELL STATE · Cₜ₋₁</span>
  <div className="gate-row"><i className="gate-pillar">FORGET<br/><b>fₜ</b></i><span className="route-times">×</span><i className="gate-pillar input-gate">INPUT<br/><b>iₜ</b></i><span className="route-times">+</span><i className="candidate-state">NEW CANDIDATE<br/>C̃ₜ</i><span className="route-times">→</span><i className="gate-pillar output-gate">OUTPUT<br/><b>oₜ</b></i></div>
  <div className="route-label">UPDATED CELL STATE Cₜ → HIDDEN STATE hₜ</div></div><div className="gate-verbs"><span>KEEP</span><span>FORGET</span><span>UPDATE</span><span>OUTPUT</span></div>
  <code className="gate-equation">Cₜ = fₜ ⊙ Cₜ₋₁ + iₜ ⊙ C̃ₜ</code><p>Gates are learned values between 0 and 1. They regulate information flow; they do not guarantee perfect memory.</p></div>;
}
function GruGates() {
 return <div className="gru-journey"><div className="gru-controls"><div className="gru-gate reset"><b>rₜ</b><span>RESET</span><small>How much old state shapes the candidate?</small></div><div className="gru-gate update"><b>zₜ</b><span>UPDATE</span><small>How much state carries forward?</small></div></div>
  <div className="gru-state-flow"><span>hₜ₋₁</span><i>× (1 − zₜ)</i><b>+</b><span>candidate h̃ₜ</span><i>× zₜ</i><b>→</b><strong>hₜ</strong></div>
  <code className="gate-equation">hₜ = (1 − zₜ) ⊙ hₜ₋₁ + zₜ ⊙ h̃ₜ</code><p>One common convention is shown here; notation varies between papers and implementations.</p></div>;
}
function FinalSources() {
 const sources=[
  ["1990 · FOUNDATION","Finding Structure in Time","Jeffrey L. Elman · Cognitive Science 14(2), 179–211","https://doi.org/10.1207/s15516709cog1402_1"],
  ["1990 · TRAINING METHOD","Backpropagation Through Time: What It Does and How to Do It","Paul J. Werbos · Proceedings of the IEEE","https://doi.org/10.1109/5.58337"],
  ["1994 · LIMITATION ANALYSIS","Learning Long-Term Dependencies with Gradient Descent Is Difficult","Yoshua Bengio, Patrice Simard & Paolo Frasconi","https://doi.org/10.1109/72.279181"],
  ["1997 · LSTM","Long Short-Term Memory","Sepp Hochreiter & Jürgen Schmidhuber","https://doi.org/10.1162/neco.1997.9.8.1735"],
  ["2014 · GRU","Learning Phrase Representations using RNN Encoder–Decoder","Kyunghyun Cho et al. · EMNLP","https://aclanthology.org/D14-1179/"]
 ];
 return <div className="guided-sources">{sources.map(s=><a href={s[3]} key={s[0]} target="_blank" rel="noreferrer"><b>{s[0]}</b><strong>{s[1]}</strong><span>{s[2]}</span><i>Read the paper ↗</i></a>)}</div>;
}
function ChapterVisual({index}:{index:number}) {
 switch(index) {
  case 0:return <><FoxTrail/><SequenceMarks/></>; case 1:return <RnnSculpture/>; case 2:return <StateEquation/>; case 3:return <UnrolledCells/>; case 4:return <div className="output-demo"><div className="output-nodes"><span>sequence x₁ … xₜ</span><b>vanilla RNN</b><span>ŷₜ</span></div><div className="loss-bar"><span>target yₜ</span><i/><strong>LOSS</strong></div><p>Training adjusts shared weights to reduce prediction error on examples.</p></div>;
  case 5:return <TrainingFlow/>; case 6:return <div className="whole-rnn"><div><small>1 · READ</small><b>Input sequence</b><span>x₁, x₂, …, xₜ</span></div><i>→</i><div><small>2 · UPDATE</small><b>Hidden state</b><span>hₜ = f(xₜ, hₜ₋₁)</span></div><i>→</i><div><small>3 · PREDICT</small><b>Output & loss</b><span>ŷₜ compared with yₜ</span></div><i>→</i><div><small>4 · LEARN</small><b>BPTT</b><span>update shared weights</span></div></div>;
  case 7:return <GradientLab/>; case 8:return <div className="problem-map"><div><span>EARLIER CLUE</span><b>“The book…”</b></div><i>· · · many recurrent steps · · ·</i><div><span>MUCH LATER</span><b>“…was old.”</b></div><p>Will the useful learning signal survive all those repeated transformations?</p></div>;
  case 9:return <LstmGates/>; case 10:return <GruGates/>; case 11:return <div className="choice-map"><div><b>VANILLA RNN</b><span>compact · short/local patterns</span></div><div><b>LSTM</b><span>cell state + three gates</span></div><div><b>GRU</b><span>hidden state + two gates</span></div><p>Try the simplest model that fits. Measure performance; the architecture name alone is no guarantee.</p></div>;
  default:return <FinalSources/>;
 }
}
export function GuidedJourney() {
 const [active,setActive]=useState(0); const [ready,setReady]=useState(false);
 const [cueVariant,setCueVariant]=useState(0); const [cueSide,setCueSide]=useState<"left"|"right">("right");
 const touchStart=useRef<number|null>(null); const lastNav=useRef(0); const changing=useRef(false);
 const copyRef=useRef<HTMLDivElement>(null); const visualRef=useRef<HTMLDivElement>(null); const chapter=chapters[active];
 const scenes=[
  {bg:"#f4eddf",ink:"#28372f",muted:"#617066",accent:"#c35d3d",card:"#e8dbc6"},{bg:"#dcebed",ink:"#173f48",muted:"#456b70",accent:"#e07b55",card:"#c8dfe0"},{bg:"#eee8f4",ink:"#322a49",muted:"#716982",accent:"#8f67c9",card:"#e1d8ef"},{bg:"#f4e3d8",ink:"#452f29",muted:"#806357",accent:"#cd6047",card:"#e9cbbb"},{bg:"#e5ecd9",ink:"#263d31",muted:"#5e725f",accent:"#b66c3d",card:"#d2dfc4"},{bg:"#172e3b",ink:"#f0f3df",muted:"#a9c0be",accent:"#80d6ca",card:"#244454"},{bg:"#f4e7b7",ink:"#32382e",muted:"#73755f",accent:"#b75838",card:"#e7d589"},{bg:"#322343",ink:"#fff0d3",muted:"#d2bdd9",accent:"#f2a26e",card:"#49335c"},{bg:"#e6f0ed",ink:"#203d3a",muted:"#62807a",accent:"#d15a46",card:"#cfdfd9"},{bg:"#203c32",ink:"#f4f1dc",muted:"#bbcab6",accent:"#e2a15d",card:"#315849"},{bg:"#dce8f5",ink:"#24364f",muted:"#62768d",accent:"#477fd1",card:"#c7d8eb"},{bg:"#f1e8dd",ink:"#38352f",muted:"#777064",accent:"#bd6747",card:"#e6d9c9"},{bg:"#e8e2d4",ink:"#25332d",muted:"#65726a",accent:"#a94e37",card:"#dbd1bd"}
 ];
 const cues=["follow the signal · scroll down","the next thought is below · scroll","swipe up when you're ready","let the story carry on · scroll","lift the page to follow"];
 const words=useMemo(()=>chapter.deck.split(/\s+/).length,[chapter.deck]); const dwell=Math.min(10500,Math.max(chapter.seconds*1000,3500+words*85));
 useEffect(()=>{setReady(false);const timer=window.setTimeout(()=>{setCueVariant(Math.floor(Math.random()*cues.length));setCueSide(Math.random()>.5?"left":"right");setReady(true);},dwell);return()=>window.clearTimeout(timer);},[active,dwell]);
 useLayoutEffect(()=>{
  if(window.matchMedia("(prefers-reduced-motion: reduce)").matches)return;
  const entrances=[{x:70,y:25,rotation:2,scale:.94},{x:0,y:85,rotation:-2,scale:.92},{x:-90,y:10,rotation:1,scale:.96},{x:45,y:-70,rotation:3,scale:.9}];
  const entry=entrances[active%entrances.length];
  const ctx=gsap.context(()=>{
   gsap.fromTo(copyRef.current,{x:entry.x*.55,y:entry.y*.55,rotation:entry.rotation*.4,opacity:0},{x:0,y:0,rotation:0,opacity:1,duration:.78,ease:"power4.out"});
   gsap.fromTo(visualRef.current,{x:-entry.x,y:-entry.y,rotation:entry.rotation,scale:entry.scale,opacity:0},{x:0,y:0,rotation:0,scale:1,opacity:1,duration:1.05,delay:.08,ease:"back.out(1.25)"});
   gsap.fromTo(".chapter-eyebrow, .chapter-deck, .chapter-index",{y:18,opacity:0},{y:0,opacity:1,duration:.62,delay:.22,stagger:.1,ease:"power3.out"});
  });
  return()=>ctx.revert();
 },[active]);
 const navigate=useCallback((direction:-1|1)=>{
  const target=active+direction; const now=Date.now();
  if(target<0||target>=chapters.length||changing.current||now-lastNav.current<1000)return;
  if(direction===1&&!ready)return;
  lastNav.current=now;changing.current=true;
  const reduced=window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const finish=()=>{setActive(target);window.setTimeout(()=>{changing.current=false;},1000);};
  if(reduced){finish();return;}
  const exits=[{x:-100,y:-12,rotation:-3,scale:.96},{x:0,y:-95,rotation:2,scale:.92},{x:105,y:15,rotation:-2,scale:.96},{x:0,y:90,rotation:3,scale:.9}];
  const exit=exits[active%exits.length];
  gsap.to(copyRef.current,{x:exit.x*.5,y:exit.y*.5,rotation:exit.rotation,opacity:0,duration:.3,ease:"power3.in"});
  gsap.to(visualRef.current,{x:exit.x,y:exit.y,rotation:exit.rotation*1.5,scale:exit.scale,opacity:0,duration:.38,ease:"power3.in",onComplete:finish});
 },[active,ready]);
 const previous=useCallback(()=>navigate(-1),[navigate]);
 const next=useCallback(()=>navigate(1),[navigate]);
 useEffect(()=>{
  const onWheel=(event:WheelEvent)=>{const target=event.target as HTMLElement|null;if(target?.closest("input,button,a,select,textarea,.guided-sources"))return;if(Math.abs(event.deltaY)<18)return;event.preventDefault();if(event.deltaY>0)next();else previous();};
  const onKey=(event:KeyboardEvent)=>{if(event.altKey||event.ctrlKey||event.metaKey)return;const target=event.target as HTMLElement|null;
   if(target&&(target.matches("input,button,a,select,textarea")||target.isContentEditable)){if(event.key==="Escape")(document.activeElement as HTMLElement)?.blur();else return;}
   if(["ArrowDown","PageDown"," "].includes(event.key)){event.preventDefault();next();}else if(["ArrowUp","PageUp"].includes(event.key)){event.preventDefault();previous();}
  };
  window.addEventListener("wheel",onWheel,{passive:false});window.addEventListener("keydown",onKey);
  return()=>{window.removeEventListener("wheel",onWheel);window.removeEventListener("keydown",onKey);};
 },[next,previous]);
 const onTouchStart=(event:TouchEvent)=>{touchStart.current=event.changedTouches[0]?.clientY??null;};
 const onTouchEnd=(event:TouchEvent)=>{if(touchStart.current===null)return;const target=event.target as HTMLElement|null;if(target?.closest(".guided-sources")){touchStart.current=null;return;}const delta=touchStart.current-(event.changedTouches[0]?.clientY??touchStart.current);if(Math.abs(delta)>55){if(delta>0)next();else previous();}touchStart.current=null;};
 const scene=scenes[active];
 const sceneStyle={"--scene-bg":scene.bg,"--scene-ink":scene.ink,"--scene-muted":scene.muted,"--scene-accent":scene.accent,"--scene-card":scene.card} as CSSProperties;
 return <main className={`guided-shell scene-${active}`} data-scene={active} style={sceneStyle} onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
  <p className="sr-only" aria-live="polite" aria-atomic="true">{chapter.title}. {chapter.deck}</p>
  <section className={`guided-chapter scene-layout-${active}`} aria-labelledby="chapter-title"><div className="chapter-copy" ref={copyRef}><p className="chapter-eyebrow"><span>{chapter.eyebrow}</span><span className="chapter-mark">{String(active+1).padStart(2,"0")}</span></p>
   <h1 key={active} id="chapter-title">{chapter.title}</h1><p className="chapter-deck">{chapter.deck}</p><p className="chapter-index">{String(active+1).padStart(2,"0")} <i>/</i> {String(chapters.length).padStart(2,"0")}</p></div>
   <div className={"chapter-visual visual-"+active} key={"visual-"+active} ref={visualRef}><ChapterVisual index={active}/></div></section>
  {ready&&active<chapters.length-1&&<div className={`journey-cue cue-${cueSide}`} aria-live="polite"><span className="cue-spark" aria-hidden="true">{cueVariant===2||cueVariant===4?"↑":"↓"}</span><span>{cues[cueVariant]}</span></div>}
  {ready&&active===chapters.length-1&&<div className="journey-cue cue-right" aria-live="polite"><span className="cue-spark" aria-hidden="true">↓</span><span>swipe down to revisit the ideas</span></div>}
 </main>;
}

