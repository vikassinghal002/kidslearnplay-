// Original princess character
export default function PrincessSvg() {
  return (
    <svg viewBox="0 0 400 500" xmlns="http://www.w3.org/2000/svg" className="w-full max-w-md mx-auto">
      {/* Crown */}
      <path d="M148,82 L148,48 L175,68 L200,38 L225,68 L252,48 L252,82 Z" fill="white" stroke="#000" strokeWidth="4" strokeLinejoin="round"/>
      {/* Crown gems */}
      <circle cx="148" cy="48" r="7" fill="white" stroke="#000" strokeWidth="3"/>
      <circle cx="200" cy="38" r="9" fill="white" stroke="#000" strokeWidth="3"/>
      <circle cx="252" cy="48" r="7" fill="white" stroke="#000" strokeWidth="3"/>
      <circle cx="175" cy="68" r="5" fill="white" stroke="#000" strokeWidth="2.5"/>
      <circle cx="225" cy="68" r="5" fill="white" stroke="#000" strokeWidth="2.5"/>
      {/* Head */}
      <ellipse cx="200" cy="128" rx="62" ry="70" fill="white" stroke="#000" strokeWidth="5"/>
      {/* Hair sides flowing down */}
      <path d="M145,100 Q110,130 105,180 Q100,228 118,262 Q130,245 138,220 Q145,200 142,175 Q140,148 145,100" fill="white" stroke="#000" strokeWidth="4"/>
      <path d="M255,100 Q290,130 295,180 Q300,228 282,262 Q270,245 262,220 Q255,200 258,175 Q260,148 255,100" fill="white" stroke="#000" strokeWidth="4"/>
      {/* Hair top fringe */}
      <path d="M145,82 Q175,68 200,72 Q225,68 255,82" fill="none" stroke="#000" strokeWidth="3"/>
      {/* Eyes */}
      <ellipse cx="180" cy="118" rx="15" ry="17" fill="white" stroke="#000" strokeWidth="4"/>
      <ellipse cx="180" cy="120" rx="9" ry="12" fill="white" stroke="#000" strokeWidth="3"/>
      {/* Eyelashes */}
      <path d="M167,108 Q180,100 193,108" fill="none" stroke="#000" strokeWidth="2.5" strokeLinecap="round"/>
      <line x1="168" y1="106" x2="164" y2="98" stroke="#000" strokeWidth="2"/>
      <line x1="176" y1="102" x2="175" y2="93" stroke="#000" strokeWidth="2"/>
      <line x1="185" y1="104" x2="187" y2="95" stroke="#000" strokeWidth="2"/>
      <ellipse cx="220" cy="118" rx="15" ry="17" fill="white" stroke="#000" strokeWidth="4"/>
      <ellipse cx="220" cy="120" rx="9" ry="12" fill="white" stroke="#000" strokeWidth="3"/>
      <path d="M207,108 Q220,100 233,108" fill="none" stroke="#000" strokeWidth="2.5" strokeLinecap="round"/>
      <line x1="208" y1="106" x2="204" y2="98" stroke="#000" strokeWidth="2"/>
      <line x1="216" y1="102" x2="215" y2="93" stroke="#000" strokeWidth="2"/>
      <line x1="225" y1="104" x2="227" y2="95" stroke="#000" strokeWidth="2"/>
      {/* Nose */}
      <path d="M196,140 Q200,148 204,140" fill="none" stroke="#000" strokeWidth="2.5" strokeLinecap="round"/>
      {/* Smile */}
      <path d="M182,158 Q200,172 218,158" fill="none" stroke="#000" strokeWidth="3" strokeLinecap="round"/>
      {/* Cheeks */}
      <ellipse cx="164" cy="150" rx="14" ry="10" fill="none" stroke="#000" strokeWidth="2"/>
      <ellipse cx="236" cy="150" rx="14" ry="10" fill="none" stroke="#000" strokeWidth="2"/>
      {/* Neck */}
      <rect x="185" y="192" width="30" height="28" rx="5" fill="white" stroke="#000" strokeWidth="4"/>
      {/* Gown bodice */}
      <path d="M118,268 Q155,248 200,252 Q245,248 282,268 L295,320 Q248,308 200,312 Q152,308 105,320 Z" fill="white" stroke="#000" strokeWidth="5"/>
      {/* Gown skirt - big A-line */}
      <path d="M105,318 Q60,370 40,440 Q28,475 80,478 Q140,480 200,478 Q260,480 320,478 Q372,475 360,440 Q340,370 295,318 Q248,308 200,312 Q152,308 105,318 Z" fill="white" stroke="#000" strokeWidth="5"/>
      {/* Gown layers */}
      <path d="M82,390 Q140,378 200,382 Q260,378 318,390" fill="none" stroke="#000" strokeWidth="3"/>
      <path d="M62,430 Q130,415 200,420 Q270,415 338,430" fill="none" stroke="#000" strokeWidth="3"/>
      {/* Bodice decorations */}
      <path d="M170,265 Q200,285 230,265" fill="none" stroke="#000" strokeWidth="2.5"/>
      <circle cx="200" cy="275" r="6" fill="white" stroke="#000" strokeWidth="2.5"/>
      <circle cx="185" cy="268" r="4" fill="white" stroke="#000" strokeWidth="2"/>
      <circle cx="215" cy="268" r="4" fill="white" stroke="#000" strokeWidth="2"/>
      {/* Skirt stars */}
      <circle cx="130" cy="360" r="6" fill="white" stroke="#000" strokeWidth="2"/>
      <circle cx="160" cy="420" r="5" fill="white" stroke="#000" strokeWidth="2"/>
      <circle cx="200" cy="350" r="7" fill="white" stroke="#000" strokeWidth="2"/>
      <circle cx="240" cy="410" r="5" fill="white" stroke="#000" strokeWidth="2"/>
      <circle cx="270" cy="360" r="6" fill="white" stroke="#000" strokeWidth="2"/>
      {/* Arms with long gloves */}
      <path d="M118,268 Q85,295 80,340 Q78,360 90,365" fill="none" stroke="#000" strokeWidth="14" strokeLinecap="round"/>
      <path d="M282,268 Q315,295 320,340 Q322,360 310,365" fill="none" stroke="#000" strokeWidth="14" strokeLinecap="round"/>
      {/* Hands */}
      <circle cx="90" cy="368" r="14" fill="white" stroke="#000" strokeWidth="4"/>
      <circle cx="310" cy="368" r="14" fill="white" stroke="#000" strokeWidth="4"/>
    </svg>
  );
}
