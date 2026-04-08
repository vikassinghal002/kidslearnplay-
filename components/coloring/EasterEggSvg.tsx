export default function EasterEggSvg() {
  return (
    <svg viewBox="0 0 400 500" xmlns="http://www.w3.org/2000/svg" className="w-full max-w-md mx-auto">
      {/* Main egg shape */}
      <path d="M200,30 Q310,30 340,180 Q365,310 310,410 Q260,475 200,478 Q140,475 90,410 Q35,310 60,180 Q90,30 200,30 Z" fill="white" stroke="#000" strokeWidth="6"/>
      {/* Horizontal band middle */}
      <path d="M65,250 Q130,240 200,245 Q270,250 335,245" fill="none" stroke="#000" strokeWidth="5"/>
      <path d="M60,265 Q130,256 200,260 Q270,265 340,260" fill="none" stroke="#000" strokeWidth="5"/>
      {/* Zigzag band top */}
      <polyline points="75,165 95,148 115,165 135,148 155,165 175,148 195,165 215,148 235,165 255,148 275,165 295,148 315,165 328,152" fill="none" stroke="#000" strokeWidth="4" strokeLinejoin="round"/>
      {/* Stars in top section */}
      <polygon points="140,105 144,118 158,118 147,126 151,139 140,131 129,139 133,126 122,118 136,118" fill="none" stroke="#000" strokeWidth="2.5"/>
      <polygon points="200,85 204,96 216,96 207,103 210,115 200,108 190,115 193,103 184,96 196,96" fill="none" stroke="#000" strokeWidth="2.5"/>
      <polygon points="260,105 264,118 278,118 267,126 271,139 260,131 249,139 253,126 242,118 256,118" fill="none" stroke="#000" strokeWidth="2.5"/>
      {/* Polka dots in middle band */}
      <circle cx="108" cy="253" r="10" fill="white" stroke="#000" strokeWidth="3"/>
      <circle cx="148" cy="253" r="10" fill="white" stroke="#000" strokeWidth="3"/>
      <circle cx="188" cy="253" r="10" fill="white" stroke="#000" strokeWidth="3"/>
      <circle cx="228" cy="253" r="10" fill="white" stroke="#000" strokeWidth="3"/>
      <circle cx="268" cy="253" r="10" fill="white" stroke="#000" strokeWidth="3"/>
      {/* Wavy line bottom section */}
      <path d="M82,330 Q100,315 118,330 Q136,345 154,330 Q172,315 190,330 Q208,345 226,330 Q244,315 262,330 Q280,345 298,330 Q312,318 318,325" fill="none" stroke="#000" strokeWidth="4" strokeLinecap="round"/>
      {/* Flowers in bottom section */}
      {/* Flower 1 */}
      <circle cx="150" cy="390" r="12" fill="white" stroke="#000" strokeWidth="2.5"/>
      <circle cx="150" cy="375" r="8" fill="white" stroke="#000" strokeWidth="2.5"/>
      <circle cx="150" cy="405" r="8" fill="white" stroke="#000" strokeWidth="2.5"/>
      <circle cx="136" cy="390" r="8" fill="white" stroke="#000" strokeWidth="2.5"/>
      <circle cx="164" cy="390" r="8" fill="white" stroke="#000" strokeWidth="2.5"/>
      {/* Flower 2 */}
      <circle cx="250" cy="390" r="12" fill="white" stroke="#000" strokeWidth="2.5"/>
      <circle cx="250" cy="375" r="8" fill="white" stroke="#000" strokeWidth="2.5"/>
      <circle cx="250" cy="405" r="8" fill="white" stroke="#000" strokeWidth="2.5"/>
      <circle cx="236" cy="390" r="8" fill="white" stroke="#000" strokeWidth="2.5"/>
      <circle cx="264" cy="390" r="8" fill="white" stroke="#000" strokeWidth="2.5"/>
      {/* Diagonal lines bottom */}
      <line x1="185" y1="355" x2="200" y2="420" stroke="#000" strokeWidth="2.5"/>
      <line x1="200" y1="350" x2="215" y2="430" stroke="#000" strokeWidth="2.5"/>
      <line x1="215" y1="355" x2="230" y2="420" stroke="#000" strokeWidth="2.5"/>
    </svg>
  );
}
