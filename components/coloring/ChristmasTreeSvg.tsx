export default function ChristmasTreeSvg() {
  return (
    <svg viewBox="0 0 400 500" xmlns="http://www.w3.org/2000/svg" className="w-full max-w-md mx-auto">
      {/* Star on top */}
      <polygon points="200,22 208,46 234,46 214,61 222,85 200,70 178,85 186,61 166,46 192,46" fill="white" stroke="#000" strokeWidth="3"/>
      {/* Top tier */}
      <polygon points="200,60 145,155 255,155" fill="white" stroke="#000" strokeWidth="4" strokeLinejoin="round"/>
      {/* Middle tier */}
      <polygon points="200,105 120,225 280,225" fill="white" stroke="#000" strokeWidth="4" strokeLinejoin="round"/>
      {/* Bottom tier */}
      <polygon points="200,160 85,310 315,310" fill="white" stroke="#000" strokeWidth="4" strokeLinejoin="round"/>
      {/* Trunk */}
      <rect x="172" y="308" width="56" height="65" rx="5" fill="white" stroke="#000" strokeWidth="4"/>
      {/* Base/pot */}
      <rect x="150" y="368" width="100" height="25" rx="5" fill="white" stroke="#000" strokeWidth="4"/>
      {/* Ornaments top tier */}
      <circle cx="200" cy="125" r="10" fill="white" stroke="#000" strokeWidth="3"/>
      <circle cx="175" cy="140" r="8" fill="white" stroke="#000" strokeWidth="3"/>
      <circle cx="225" cy="140" r="8" fill="white" stroke="#000" strokeWidth="3"/>
      {/* Ornaments middle tier */}
      <circle cx="160" cy="185" r="10" fill="white" stroke="#000" strokeWidth="3"/>
      <circle cx="200" cy="175" r="12" fill="white" stroke="#000" strokeWidth="3"/>
      <circle cx="240" cy="185" r="10" fill="white" stroke="#000" strokeWidth="3"/>
      <circle cx="180" cy="205" r="8" fill="white" stroke="#000" strokeWidth="3"/>
      <circle cx="220" cy="205" r="8" fill="white" stroke="#000" strokeWidth="3"/>
      {/* Ornaments bottom tier */}
      <circle cx="130" cy="255" r="11" fill="white" stroke="#000" strokeWidth="3"/>
      <circle cx="175" cy="245" r="10" fill="white" stroke="#000" strokeWidth="3"/>
      <circle cx="200" cy="240" r="13" fill="white" stroke="#000" strokeWidth="3"/>
      <circle cx="230" cy="248" r="10" fill="white" stroke="#000" strokeWidth="3"/>
      <circle cx="270" cy="255" r="11" fill="white" stroke="#000" strokeWidth="3"/>
      <circle cx="150" cy="278" r="9" fill="white" stroke="#000" strokeWidth="3"/>
      <circle cx="200" cy="275" r="9" fill="white" stroke="#000" strokeWidth="3"/>
      <circle cx="255" cy="278" r="9" fill="white" stroke="#000" strokeWidth="3"/>
      {/* Garland curves */}
      <path d="M155,165 Q175,175 200,165 Q225,155 245,165" fill="none" stroke="#000" strokeWidth="2.5" strokeLinecap="round"/>
      <path d="M125,250 Q162,270 200,255 Q238,240 275,250" fill="none" stroke="#000" strokeWidth="2.5" strokeLinecap="round"/>
      {/* Snow on branches */}
      <path d="M145,154 Q160,148 175,155" fill="none" stroke="#000" strokeWidth="3" strokeLinecap="round"/>
      <path d="M225,154 Q240,148 255,155" fill="none" stroke="#000" strokeWidth="3" strokeLinecap="round"/>
      <path d="M118,224 Q140,217 162,225" fill="none" stroke="#000" strokeWidth="3" strokeLinecap="round"/>
      <path d="M238,224 Q260,217 282,225" fill="none" stroke="#000" strokeWidth="3" strokeLinecap="round"/>
    </svg>
  );
}
