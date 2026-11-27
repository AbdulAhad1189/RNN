"use client";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { TouchEvent } from "react";

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
  case 0:return <SequenceMarks/>; case 1:return <RnnSculpture/>; case 2:return <StateEquation/>; case 3:return <UnrolledCells/>; case 4:return <div className="output-demo"><div className="output-nodes"><span>sequence x₁ … xₜ</span><b>vanilla RNN</b><span>ŷₜ</span></div><div className="loss-bar"><span>target yₜ</span><i/><strong>LOSS</strong></div><p>Training adjusts shared weights to reduce prediction error on examples.</p></div>;
  case 5:return <TrainingFlow/>; case 6:return <div className="whole-rnn"><div><small>1 · READ</small><b>Input sequence</b><span>x₁, x₂, …, xₜ</span></div><i>→</i><div><small>2 · UPDATE</small><b>Hidden state</b><span>hₜ = f(xₜ, hₜ₋₁)</span></div><i>→</i><div><small>3 · PREDICT</small><b>Output & loss</b><span>ŷₜ compared with yₜ</span></div><i>→</i><div><small>4 · LEARN</small><b>BPTT</b><span>update shared weights</span></div></div>;
  case 7:return <GradientLab/>; case 8:return <div className="problem-map"><div><span>EARLIER CLUE</span><b>“The book…”</b></div><i>· · · many recurrent steps · · ·</i><div><span>MUCH LATER</span><b>“…was old.”</b></div><p>Will the useful learning signal survive all those repeated transformations?</p></div>;
  case 9:return <LstmGates/>; case 10:return <GruGates/>; case 11:return <div className="choice-map"><div><b>VANILLA RNN</b><span>compact · short/local patterns</span></div><div><b>LSTM</b><span>cell state + three gates</span></div><div><b>GRU</b><span>hidden state + two gates</span></div><p>Try the simplest model that fits. Measure performance; the architecture name alone is no guarantee.</p></div>;
  default:return <FinalSources/>;
 }
}
export function GuidedJourney() {
 const [active,setActive]=useState(0); const [ready,setReady]=useState(false);
 const touchStart=useRef<number|null>(null); const lastNav=useRef(0); const chapter=chapters[active];
 const words=useMemo(()=>chapter.deck.split(/\s+/).length,[chapter.deck]); const dwell=Math.min(10500,Math.max(chapter.seconds*1000,3500+words*85));
 useEffect(()=>{setReady(false);const timer=window.setTimeout(()=>setReady(true),dwell);return()=>window.clearTimeout(timer);},[active,dwell]);
 const previous=useCallback(()=>{const now=Date.now();if(now-lastNav.current<700)return;if(active>0){lastNav.current=now;setActive(i=>Math.max(0,i-1));}},[active]);
 const next=useCallback(()=>{const now=Date.now();if(!ready||now-lastNav.current<700)return;if(active<chapters.length-1){lastNav.current=now;setActive(i=>Math.min(chapters.length-1,i+1));}},[active,ready]);
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
 const progress=((active+1)/chapters.length*100)+"%";
 return <main className="guided-shell" onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
  <header className="guided-top"><span className="guided-brand">RECURRING<span> / FIELD NOTES ON SEQUENCE</span></span><span className="guided-mode">A GUIDED VISUAL JOURNEY</span></header>
  <div className="guided-progress" role="progressbar" aria-label="Story progress" aria-valuemin={1} aria-valuemax={chapters.length} aria-valuenow={active+1}><span style={{width:progress}}/></div>
  <p className="sr-only" aria-live="polite" aria-atomic="true">{chapter.title}. {chapter.deck}</p>
  <section className="guided-chapter" aria-labelledby="chapter-title"><div className="chapter-copy"><p className="chapter-eyebrow">{chapter.eyebrow}</p>
   <h1 key={active} id="chapter-title">{chapter.title}</h1><p className="chapter-deck">{chapter.deck}</p><p className="chapter-index">{String(active+1).padStart(2,"0")} <i>/</i> {String(chapters.length).padStart(2,"0")}</p></div>
   <div className={"chapter-visual visual-"+active} key={"visual-"+active}><ChapterVisual index={active}/></div></section>
  <footer className="guided-bottom"><button className="journey-back" type="button" onClick={previous} disabled={active===0}>← BACK</button>
   <div className={"journey-cue "+(ready?"is-ready":"")} aria-live="polite">{ready?<><span className="cue-spark" aria-hidden="true">↟</span><span>SWIPE UP OR SCROLL DOWN TO CONTINUE</span></>:<><span className="cue-track"><i style={{animationDuration:dwell+"ms"}}/></span><span>TAKE A MOMENT WITH THIS IDEA</span></>}</div>
   <button className="journey-next" type="button" onClick={active===chapters.length-1?()=>setActive(0):next} disabled={active!==chapters.length-1&&!ready}>{active===chapters.length-1?"RESTART ↺":"CONTINUE →"}</button></footer>
 </main>;
}

