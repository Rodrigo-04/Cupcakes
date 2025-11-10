import React from "react";

export default function StepperStatus({ steps, current }) {
  const currentIndex = Math.max(0, steps.findIndex(s => s === current));
  return (
    <div style={{display:"flex", flexDirection:"column", gap:12}}>
      <div style={{display:"flex", alignItems:"center", gap:12}}>
        {steps.map((step, i) => {
          const done = i <= currentIndex;
          return (
            <div key={step} style={{display:"flex", flexDirection:"column", alignItems:"center", flex:1}}>
              <div style={{
                width:28, height:28, borderRadius:14, background: done ? "var(--accent-pink)" : "#fff",
                border: `2px solid ${done ? "var(--accent-pink)" : "#ddd"}`, display:"flex", alignItems:"center", justifyContent:"center", color: done ? "#fff" : "#666"
              }}>
                {done ? "✓" : i + 1}
              </div>
              <div style={{marginTop:8, fontSize:13, textAlign:"center", color: done ? "var(--accent-pink)" : "#666"}}>
                {step}
              </div>
              {i < steps.length - 1 && (
                <div style={{
                  position:"relative", height:4, background: i < currentIndex ? "var(--accent-pink)" : "#eee",
                  width:"100%", marginTop:10, marginBottom: -18
                }} />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}