// Original rescue puppy character — puppy in a hat
export default function RescuePupSvg() {
  return (
    <svg viewBox="0 0 400 500" xmlns="http://www.w3.org/2000/svg" className="w-full max-w-md mx-auto">
      {/* Hat brim */}
      <ellipse cx="200" cy="92" rx="88" ry="16" fill="white" stroke="#000" strokeWidth="4"/>
      {/* Hat top */}
      <path d="M120,92 Q118,48 200,40 Q282,48 280,92" fill="white" stroke="#000" strokeWidth="4"/>
      {/* Hat badge */}
      <polygon points="200,52 205,66 220,66 208,74 212,88 200,80 188,88 192,74 180,66 195,66" fill="white" stroke="#000" strokeWidth="2.5"/>
      {/* Head */}
      <ellipse cx="200" cy="170" rx="90" ry="84" fill="white" stroke="#000" strokeWidth="5"/>
      {/* Left ear — floppy */}
      <path d="M122,140 Q80,158 78,210 Q76,245 100,255 Q120,260 130,240 Q138,220 132,188 Q126,158 122,140 Z" fill="white" stroke="#000" strokeWidth="5"/>
      {/* Right ear */}
      <path d="M278,140 Q320,158 322,210 Q324,245 300,255 Q280,260 270,240 Q262,220 268,188 Q274,158 278,140 Z" fill="white" stroke="#000" strokeWidth="5"/>
      {/* Snout */}
      <ellipse cx="200" cy="200" rx="48" ry="36" fill="white" stroke="#000" strokeWidth="4"/>
      {/* Nose */}
      <ellipse cx="200" cy="186" rx="18" ry="13" fill="white" stroke="#000" strokeWidth="4"/>
      {/* Nostrils */}
      <circle cx="193" cy="188" r="4" fill="white" stroke="#000" strokeWidth="2"/>
      <circle cx="207" cy="188" r="4" fill="white" stroke="#000" strokeWidth="2"/>
      {/* Happy mouth with tongue */}
      <path d="M165,208 Q182,228 200,228 Q218,228 235,208" fill="none" stroke="#000" strokeWidth="4" strokeLinecap="round"/>
      <path d="M178,222 Q200,248 222,222" fill="white" stroke="#000" strokeWidth="3"/>
      <line x1="200" y1="222" x2="200" y2="240" stroke="#000" strokeWidth="2.5"/>
      {/* Eyes with eyebrows */}
      <circle cx="162" cy="155" r="22" fill="white" stroke="#000" strokeWidth="4"/>
      <circle cx="164" cy="157" r="14" fill="white" stroke="#000" strokeWidth="3"/>
      <path d="M144,140 Q162,130 180,138" fill="none" stroke="#000" strokeWidth="3.5" strokeLinecap="round"/>
      <circle cx="238" cy="155" r="22" fill="white" stroke="#000" strokeWidth="4"/>
      <circle cx="240" cy="157" r="14" fill="white" stroke="#000" strokeWidth="3"/>
      <path d="M220,140 Q238,130 256,138" fill="none" stroke="#000" strokeWidth="3.5" strokeLinecap="round"/>
      {/* Body — sitting */}
      <ellipse cx="200" cy="360" rx="108" ry="112" fill="white" stroke="#000" strokeWidth="5"/>
      {/* Uniform collar / vest */}
      <path d="M148,258 Q175,278 200,275 Q225,278 252,258" fill="none" stroke="#000" strokeWidth="5" strokeLinecap="round"/>
      <path d="M175,258 Q200,290 225,258" fill="none" stroke="#000" strokeWidth="4" strokeLinecap="round"/>
      {/* Vest badge */}
      <circle cx="200" cy="320" r="16" fill="white" stroke="#000" strokeWidth="3"/>
      <polygon points="200,308 203,316 212,316 205,322 207,330 200,325 193,330 195,322 188,316 197,316" fill="none" stroke="#000" strokeWidth="2"/>
      {/* Belt */}
      <path d="M100,372 Q148,362 200,365 Q252,362 300,372" fill="none" stroke="#000" strokeWidth="6" strokeLinecap="round"/>
      {/* Paws front */}
      <ellipse cx="118" cy="420" rx="35" ry="22" fill="white" stroke="#000" strokeWidth="4"/>
      <ellipse cx="282" cy="420" rx="35" ry="22" fill="white" stroke="#000" strokeWidth="4"/>
      {/* Toes */}
      <line x1="105" y1="415" x2="102" y2="430" stroke="#000" strokeWidth="3" strokeLinecap="round"/>
      <line x1="118" y1="412" x2="118" y2="428" stroke="#000" strokeWidth="3" strokeLinecap="round"/>
      <line x1="131" y1="415" x2="134" y2="430" stroke="#000" strokeWidth="3" strokeLinecap="round"/>
      <line x1="269" y1="415" x2="266" y2="430" stroke="#000" strokeWidth="3" strokeLinecap="round"/>
      <line x1="282" y1="412" x2="282" y2="428" stroke="#000" strokeWidth="3" strokeLinecap="round"/>
      <line x1="295" y1="415" x2="298" y2="430" stroke="#000" strokeWidth="3" strokeLinecap="round"/>
      {/* Tail */}
      <path d="M300,360 Q348,345 345,312 Q342,288 322,295" fill="none" stroke="#000" strokeWidth="12" strokeLinecap="round"/>
    </svg>
  );
}
