export default function CatSvg() {
  return (
    <svg viewBox="0 0 400 500" xmlns="http://www.w3.org/2000/svg" className="w-full max-w-md mx-auto">
      {/* Tail */}
      <path d="M260 380 Q340 340 350 280 Q360 230 310 220" fill="none" stroke="#000" strokeWidth="12" strokeLinecap="round"/>
      {/* Body */}
      <ellipse cx="190" cy="340" rx="110" ry="120" fill="white" stroke="#000" strokeWidth="5"/>
      {/* Neck */}
      <ellipse cx="190" cy="225" rx="55" ry="30" fill="white" stroke="#000" strokeWidth="5"/>
      {/* Head */}
      <circle cx="190" cy="165" r="90" fill="white" stroke="#000" strokeWidth="5"/>
      {/* Left ear outer */}
      <polygon points="115,110 100,45 165,90" fill="white" stroke="#000" strokeWidth="5" strokeLinejoin="round"/>
      {/* Left ear inner */}
      <polygon points="119,103 110,62 155,90" fill="white" stroke="#000" strokeWidth="3" strokeLinejoin="round"/>
      {/* Right ear outer */}
      <polygon points="265,110 300,45 235,90" fill="white" stroke="#000" strokeWidth="5" strokeLinejoin="round"/>
      {/* Right ear inner */}
      <polygon points="261,103 290,62 245,90" fill="white" stroke="#000" strokeWidth="3" strokeLinejoin="round"/>
      {/* Left eye */}
      <ellipse cx="158" cy="155" rx="22" ry="25" fill="white" stroke="#000" strokeWidth="4"/>
      <ellipse cx="158" cy="157" rx="12" ry="17" fill="white" stroke="#000" strokeWidth="3"/>
      {/* Right eye */}
      <ellipse cx="222" cy="155" rx="22" ry="25" fill="white" stroke="#000" strokeWidth="4"/>
      <ellipse cx="222" cy="157" rx="12" ry="17" fill="white" stroke="#000" strokeWidth="3"/>
      {/* Nose */}
      <polygon points="183,185 197,185 190,195" fill="white" stroke="#000" strokeWidth="3"/>
      {/* Mouth */}
      <path d="M183,195 Q190,205 197,195" fill="none" stroke="#000" strokeWidth="3" strokeLinecap="round"/>
      {/* Whiskers left */}
      <line x1="110" y1="188" x2="178" y2="193" stroke="#000" strokeWidth="2.5" strokeLinecap="round"/>
      <line x1="105" y1="200" x2="178" y2="198" stroke="#000" strokeWidth="2.5" strokeLinecap="round"/>
      <line x1="108" y1="212" x2="178" y2="205" stroke="#000" strokeWidth="2.5" strokeLinecap="round"/>
      {/* Whiskers right */}
      <line x1="270" y1="188" x2="202" y2="193" stroke="#000" strokeWidth="2.5" strokeLinecap="round"/>
      <line x1="275" y1="200" x2="202" y2="198" stroke="#000" strokeWidth="2.5" strokeLinecap="round"/>
      <line x1="272" y1="212" x2="202" y2="205" stroke="#000" strokeWidth="2.5" strokeLinecap="round"/>
      {/* Belly patch */}
      <ellipse cx="190" cy="340" rx="55" ry="70" fill="white" stroke="#000" strokeWidth="3" strokeDasharray="0"/>
      {/* Left paw */}
      <ellipse cx="120" cy="445" rx="38" ry="22" fill="white" stroke="#000" strokeWidth="4"/>
      <line x1="105" y1="435" x2="105" y2="450" stroke="#000" strokeWidth="2.5" strokeLinecap="round"/>
      <line x1="120" y1="432" x2="120" y2="450" stroke="#000" strokeWidth="2.5" strokeLinecap="round"/>
      <line x1="135" y1="435" x2="135" y2="450" stroke="#000" strokeWidth="2.5" strokeLinecap="round"/>
      {/* Right paw */}
      <ellipse cx="260" cy="445" rx="38" ry="22" fill="white" stroke="#000" strokeWidth="4"/>
      <line x1="245" y1="435" x2="245" y2="450" stroke="#000" strokeWidth="2.5" strokeLinecap="round"/>
      <line x1="260" y1="432" x2="260" y2="450" stroke="#000" strokeWidth="2.5" strokeLinecap="round"/>
      <line x1="275" y1="435" x2="275" y2="450" stroke="#000" strokeWidth="2.5" strokeLinecap="round"/>
      {/* Collar */}
      <path d="M140,222 Q190,240 240,222" fill="none" stroke="#000" strokeWidth="7" strokeLinecap="round"/>
      {/* Bell */}
      <circle cx="190" cy="235" r="8" fill="white" stroke="#000" strokeWidth="3"/>
    </svg>
  );
}
