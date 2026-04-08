export default function ElephantSvg() {
  return (
    <svg viewBox="0 0 400 500" xmlns="http://www.w3.org/2000/svg" className="w-full max-w-md mx-auto">
      {/* Body */}
      <ellipse cx="210" cy="320" rx="140" ry="120" fill="white" stroke="#000" strokeWidth="5"/>
      {/* Head */}
      <circle cx="185" cy="175" r="100" fill="white" stroke="#000" strokeWidth="5"/>
      {/* Left ear */}
      <path d="M105,135 Q40,130 30,190 Q22,248 60,275 Q95,298 118,265 Q138,238 130,200 Q123,162 105,135 Z" fill="white" stroke="#000" strokeWidth="5"/>
      {/* Left ear inner */}
      <path d="M103,150 Q58,150 52,195 Q46,238 75,258 Q98,272 113,248 Q125,225 118,195 Q112,165 103,150 Z" fill="none" stroke="#000" strokeWidth="3"/>
      {/* Trunk */}
      <path d="M130,230 Q95,255 80,295 Q68,330 75,360 Q82,385 100,382 Q118,380 120,358 Q122,338 115,310" fill="none" stroke="#000" strokeWidth="22" strokeLinecap="round"/>
      {/* Trunk tip */}
      <ellipse cx="110" cy="367" rx="22" ry="12" fill="white" stroke="#000" strokeWidth="3"/>
      {/* Trunk wrinkles */}
      <path d="M96,280 Q82,290 80,305" fill="none" stroke="#000" strokeWidth="2.5" strokeLinecap="round"/>
      <path d="M90,308 Q77,318 77,332" fill="none" stroke="#000" strokeWidth="2.5" strokeLinecap="round"/>
      {/* Eye */}
      <circle cx="224" cy="155" r="20" fill="white" stroke="#000" strokeWidth="4"/>
      <circle cx="226" cy="156" r="12" fill="white" stroke="#000" strokeWidth="3"/>
      {/* Eyelashes */}
      <path d="M207,143 Q225,133 242,142" fill="none" stroke="#000" strokeWidth="3" strokeLinecap="round"/>
      {/* Tusk */}
      <path d="M155,225 Q140,248 148,270 Q155,285 170,278" fill="none" stroke="#000" strokeWidth="6" strokeLinecap="round"/>
      {/* Front left leg */}
      <rect x="95" y="405" width="55" height="75" rx="27" fill="white" stroke="#000" strokeWidth="5"/>
      {/* Front right leg */}
      <rect x="175" y="405" width="55" height="75" rx="27" fill="white" stroke="#000" strokeWidth="5"/>
      {/* Back right leg */}
      <rect x="250" y="405" width="55" height="75" rx="27" fill="white" stroke="#000" strokeWidth="5"/>
      {/* Toenails */}
      <path d="M100,475 Q108,488 118,475" fill="none" stroke="#000" strokeWidth="3"/>
      <path d="M118,475 Q126,488 136,475" fill="none" stroke="#000" strokeWidth="3"/>
      <path d="M180,475 Q188,488 198,475" fill="none" stroke="#000" strokeWidth="3"/>
      <path d="M198,475 Q206,488 216,475" fill="none" stroke="#000" strokeWidth="3"/>
      <path d="M255,475 Q263,488 273,475" fill="none" stroke="#000" strokeWidth="3"/>
      <path d="M273,475 Q281,488 291,475" fill="none" stroke="#000" strokeWidth="3"/>
      {/* Tail */}
      <path d="M340,310 Q370,310 368,280 Q365,260 355,262" fill="none" stroke="#000" strokeWidth="6" strokeLinecap="round"/>
      <path d="M368,280 Q375,265 372,255" fill="none" stroke="#000" strokeWidth="3" strokeLinecap="round"/>
      {/* Tail tuft */}
      <path d="M355,262 Q350,250 358,245" fill="none" stroke="#000" strokeWidth="3" strokeLinecap="round"/>
      <path d="M355,262 Q358,248 366,248" fill="none" stroke="#000" strokeWidth="3" strokeLinecap="round"/>
    </svg>
  );
}
