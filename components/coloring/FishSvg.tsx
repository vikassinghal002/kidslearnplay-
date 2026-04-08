export default function FishSvg() {
  return (
    <svg viewBox="0 0 400 500" xmlns="http://www.w3.org/2000/svg" className="w-full max-w-md mx-auto">
      {/* Tail fin */}
      <path d="M285,250 Q350,190 370,250 Q350,310 285,250 Z" fill="white" stroke="#000" strokeWidth="5"/>
      {/* Tail fin lines */}
      <line x1="285" y1="250" x2="360" y2="220" stroke="#000" strokeWidth="2.5"/>
      <line x1="285" y1="250" x2="362" y2="250" stroke="#000" strokeWidth="2.5"/>
      <line x1="285" y1="250" x2="360" y2="280" stroke="#000" strokeWidth="2.5"/>
      {/* Body */}
      <ellipse cx="180" cy="250" rx="140" ry="100" fill="white" stroke="#000" strokeWidth="5"/>
      {/* Scales row 1 */}
      <path d="M80,225 Q95,210 110,225" fill="none" stroke="#000" strokeWidth="2.5"/>
      <path d="M110,225 Q125,210 140,225" fill="none" stroke="#000" strokeWidth="2.5"/>
      <path d="M140,225 Q155,210 170,225" fill="none" stroke="#000" strokeWidth="2.5"/>
      <path d="M170,225 Q185,210 200,225" fill="none" stroke="#000" strokeWidth="2.5"/>
      <path d="M200,225 Q215,210 230,225" fill="none" stroke="#000" strokeWidth="2.5"/>
      <path d="M230,225 Q245,210 260,225" fill="none" stroke="#000" strokeWidth="2.5"/>
      {/* Scales row 2 */}
      <path d="M95,248 Q110,233 125,248" fill="none" stroke="#000" strokeWidth="2.5"/>
      <path d="M125,248 Q140,233 155,248" fill="none" stroke="#000" strokeWidth="2.5"/>
      <path d="M155,248 Q170,233 185,248" fill="none" stroke="#000" strokeWidth="2.5"/>
      <path d="M185,248 Q200,233 215,248" fill="none" stroke="#000" strokeWidth="2.5"/>
      <path d="M215,248 Q230,233 245,248" fill="none" stroke="#000" strokeWidth="2.5"/>
      <path d="M245,248 Q260,233 275,248" fill="none" stroke="#000" strokeWidth="2.5"/>
      {/* Scales row 3 */}
      <path d="M80,270 Q95,255 110,270" fill="none" stroke="#000" strokeWidth="2.5"/>
      <path d="M110,270 Q125,255 140,270" fill="none" stroke="#000" strokeWidth="2.5"/>
      <path d="M140,270 Q155,255 170,270" fill="none" stroke="#000" strokeWidth="2.5"/>
      <path d="M170,270 Q185,255 200,270" fill="none" stroke="#000" strokeWidth="2.5"/>
      <path d="M200,270 Q215,255 230,270" fill="none" stroke="#000" strokeWidth="2.5"/>
      <path d="M230,270 Q245,255 260,270" fill="none" stroke="#000" strokeWidth="2.5"/>
      {/* Top fin */}
      <path d="M130,155 Q160,105 200,152 Q230,108 260,154" fill="white" stroke="#000" strokeWidth="4"/>
      <line x1="145" y1="155" x2="148" y2="118" stroke="#000" strokeWidth="2.5"/>
      <line x1="168" y1="152" x2="172" y2="113" stroke="#000" strokeWidth="2.5"/>
      <line x1="190" y1="152" x2="194" y2="120" stroke="#000" strokeWidth="2.5"/>
      <line x1="213" y1="152" x2="216" y2="118" stroke="#000" strokeWidth="2.5"/>
      <line x1="235" y1="155" x2="240" y2="122" stroke="#000" strokeWidth="2.5"/>
      {/* Bottom fin */}
      <path d="M160,345 Q180,390 210,345" fill="white" stroke="#000" strokeWidth="4"/>
      <line x1="170" y1="345" x2="174" y2="378" stroke="#000" strokeWidth="2.5"/>
      <line x1="192" y1="345" x2="192" y2="380" stroke="#000" strokeWidth="2.5"/>
      {/* Eye */}
      <circle cx="90" cy="230" r="28" fill="white" stroke="#000" strokeWidth="4"/>
      <circle cx="90" cy="230" r="18" fill="white" stroke="#000" strokeWidth="3"/>
      <circle cx="90" cy="230" r="8" fill="white" stroke="#000" strokeWidth="2.5"/>
      {/* Mouth */}
      <path d="M48,255 Q62,268 70,258" fill="none" stroke="#000" strokeWidth="4" strokeLinecap="round"/>
      {/* Bubbles */}
      <circle cx="48" cy="195" r="8" fill="white" stroke="#000" strokeWidth="2.5"/>
      <circle cx="30" cy="170" r="12" fill="white" stroke="#000" strokeWidth="2.5"/>
      <circle cx="55" cy="145" r="6" fill="white" stroke="#000" strokeWidth="2.5"/>
    </svg>
  );
}
