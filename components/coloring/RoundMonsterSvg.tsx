// Original round creature character — inspired by cute round pocket monsters concept
export default function RoundMonsterSvg() {
  return (
    <svg viewBox="0 0 400 500" xmlns="http://www.w3.org/2000/svg" className="w-full max-w-md mx-auto">
      {/* Ears */}
      <polygon points="138,112 108,38 178,85" fill="white" stroke="#000" strokeWidth="5" strokeLinejoin="round"/>
      <polygon points="142,107 120,55 168,84" fill="none" stroke="#000" strokeWidth="2.5" strokeLinejoin="round"/>
      <polygon points="262,112 292,38 222,85" fill="white" stroke="#000" strokeWidth="5" strokeLinejoin="round"/>
      <polygon points="258,107 280,55 232,84" fill="none" stroke="#000" strokeWidth="2.5" strokeLinejoin="round"/>
      {/* Main body — large round shape */}
      <circle cx="200" cy="265" r="185" fill="white" stroke="#000" strokeWidth="5"/>
      {/* Horizontal dividing stripe */}
      <path d="M18,260 Q100,245 200,252 Q300,259 382,252" fill="none" stroke="#000" strokeWidth="6"/>
      <path d="M18,272 Q100,257 200,264 Q300,271 382,264" fill="none" stroke="#000" strokeWidth="5"/>
      {/* Left eye — large circle */}
      <circle cx="155" cy="180" r="40" fill="white" stroke="#000" strokeWidth="5"/>
      <circle cx="155" cy="180" r="25" fill="white" stroke="#000" strokeWidth="4"/>
      <circle cx="162" cy="174" r="10" fill="white" stroke="#000" strokeWidth="3"/>
      {/* Right eye */}
      <circle cx="245" cy="180" r="40" fill="white" stroke="#000" strokeWidth="5"/>
      <circle cx="245" cy="180" r="25" fill="white" stroke="#000" strokeWidth="4"/>
      <circle cx="252" cy="174" r="10" fill="white" stroke="#000" strokeWidth="3"/>
      {/* Rosy cheeks */}
      <ellipse cx="118" cy="215" rx="22" ry="16" fill="none" stroke="#000" strokeWidth="2.5"/>
      <ellipse cx="282" cy="215" rx="22" ry="16" fill="none" stroke="#000" strokeWidth="2.5"/>
      {/* Small nose */}
      <ellipse cx="200" cy="220" rx="7" ry="5" fill="white" stroke="#000" strokeWidth="2.5"/>
      {/* Smile */}
      <path d="M168,240 Q200,265 232,240" fill="none" stroke="#000" strokeWidth="4" strokeLinecap="round"/>
      {/* Tail */}
      <path d="M370,330 Q420,310 415,278 Q410,255 390,262" fill="none" stroke="#000" strokeWidth="12" strokeLinecap="round"/>
      {/* Tail lightning bolt tip */}
      <polygon points="390,262 375,245 385,238 370,222 385,228 378,212 395,230" fill="white" stroke="#000" strokeWidth="3" strokeLinejoin="round"/>
      {/* Short arms */}
      <path d="M42,280 Q22,310 30,340 Q36,358 55,352" fill="none" stroke="#000" strokeWidth="16" strokeLinecap="round"/>
      <path d="M358,280 Q378,310 370,340 Q364,358 345,352" fill="none" stroke="#000" strokeWidth="16" strokeLinecap="round"/>
      {/* Little paw marks */}
      <circle cx="44" cy="354" r="8" fill="white" stroke="#000" strokeWidth="3"/>
      <circle cx="62" cy="348" r="6" fill="white" stroke="#000" strokeWidth="2.5"/>
      <circle cx="356" cy="354" r="8" fill="white" stroke="#000" strokeWidth="3"/>
      <circle cx="338" cy="348" r="6" fill="white" stroke="#000" strokeWidth="2.5"/>
      {/* Stubby legs */}
      <ellipse cx="162" cy="435" rx="32" ry="20" fill="white" stroke="#000" strokeWidth="4"/>
      <ellipse cx="238" cy="435" rx="32" ry="20" fill="white" stroke="#000" strokeWidth="4"/>
    </svg>
  );
}
