export default function ButterflySvg() {
  return (
    <svg viewBox="0 0 400 500" xmlns="http://www.w3.org/2000/svg" className="w-full max-w-md mx-auto">
      {/* Body */}
      <ellipse cx="200" cy="250" rx="12" ry="120" fill="white" stroke="#000" strokeWidth="4"/>
      {/* Head */}
      <circle cx="200" cy="122" r="18" fill="white" stroke="#000" strokeWidth="4"/>
      {/* Antennae */}
      <path d="M195,106 Q175,70 165,50" fill="none" stroke="#000" strokeWidth="3" strokeLinecap="round"/>
      <circle cx="163" cy="47" r="6" fill="white" stroke="#000" strokeWidth="3"/>
      <path d="M205,106 Q225,70 235,50" fill="none" stroke="#000" strokeWidth="3" strokeLinecap="round"/>
      <circle cx="237" cy="47" r="6" fill="white" stroke="#000" strokeWidth="3"/>
      {/* Upper left wing */}
      <path d="M195,175 Q140,130 80,150 Q30,168 35,220 Q40,268 90,280 Q140,290 185,255" fill="white" stroke="#000" strokeWidth="4"/>
      {/* Upper left wing inner detail */}
      <path d="M188,180 Q148,155 105,168 Q72,182 78,218 Q85,248 118,255 Q155,260 183,240" fill="none" stroke="#000" strokeWidth="2.5"/>
      {/* Upper left wing circle */}
      <circle cx="110" cy="210" r="28" fill="white" stroke="#000" strokeWidth="2.5"/>
      <circle cx="110" cy="210" r="16" fill="white" stroke="#000" strokeWidth="2"/>
      {/* Upper right wing */}
      <path d="M205,175 Q260,130 320,150 Q370,168 365,220 Q360,268 310,280 Q260,290 215,255" fill="white" stroke="#000" strokeWidth="4"/>
      {/* Upper right wing inner detail */}
      <path d="M212,180 Q252,155 295,168 Q328,182 322,218 Q315,248 282,255 Q245,260 217,240" fill="none" stroke="#000" strokeWidth="2.5"/>
      {/* Upper right wing circle */}
      <circle cx="290" cy="210" r="28" fill="white" stroke="#000" strokeWidth="2.5"/>
      <circle cx="290" cy="210" r="16" fill="white" stroke="#000" strokeWidth="2"/>
      {/* Lower left wing */}
      <path d="M193,270 Q140,280 95,310 Q55,340 65,385 Q75,420 120,425 Q165,428 195,390" fill="white" stroke="#000" strokeWidth="4"/>
      {/* Lower left wing detail */}
      <path d="M190,278 Q148,288 112,312 Q85,336 93,372 Q102,403 135,410 Q170,415 193,382" fill="none" stroke="#000" strokeWidth="2.5"/>
      {/* Lower left oval */}
      <ellipse cx="130" cy="355" rx="22" ry="30" fill="white" stroke="#000" strokeWidth="2.5"/>
      {/* Lower right wing */}
      <path d="M207,270 Q260,280 305,310 Q345,340 335,385 Q325,420 280,425 Q235,428 205,390" fill="white" stroke="#000" strokeWidth="4"/>
      {/* Lower right wing detail */}
      <path d="M210,278 Q252,288 288,312 Q315,336 307,372 Q298,403 265,410 Q230,415 207,382" fill="none" stroke="#000" strokeWidth="2.5"/>
      {/* Lower right oval */}
      <ellipse cx="270" cy="355" rx="22" ry="30" fill="white" stroke="#000" strokeWidth="2.5"/>
      {/* Body segments */}
      <line x1="200" y1="185" x2="200" y2="195" stroke="#000" strokeWidth="2" strokeLinecap="round"/>
      <line x1="200" y1="215" x2="200" y2="225" stroke="#000" strokeWidth="2" strokeLinecap="round"/>
      <line x1="200" y1="245" x2="200" y2="255" stroke="#000" strokeWidth="2" strokeLinecap="round"/>
      <line x1="200" y1="275" x2="200" y2="285" stroke="#000" strokeWidth="2" strokeLinecap="round"/>
      <line x1="200" y1="305" x2="200" y2="315" stroke="#000" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  );
}
