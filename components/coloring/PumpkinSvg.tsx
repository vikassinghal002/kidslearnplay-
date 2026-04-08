export default function PumpkinSvg() {
  return (
    <svg viewBox="0 0 400 500" xmlns="http://www.w3.org/2000/svg" className="w-full max-w-md mx-auto">
      {/* Stem */}
      <path d="M200,68 Q205,42 220,30 Q235,20 230,38 Q225,55 215,68" fill="white" stroke="#000" strokeWidth="5" strokeLinejoin="round"/>
      {/* Leaf */}
      <path d="M218,52 Q255,30 268,55 Q255,65 235,58 Z" fill="white" stroke="#000" strokeWidth="3"/>
      <path d="M218,52 Q240,38 255,50" fill="none" stroke="#000" strokeWidth="2"/>
      {/* Vine tendril */}
      <path d="M215,45 Q238,35 248,45 Q255,52 245,58" fill="none" stroke="#000" strokeWidth="2" strokeLinecap="round"/>
      {/* Left segment */}
      <path d="M80,200 Q60,230 65,285 Q70,340 95,365 Q120,388 148,380 Q168,375 178,355 Q185,330 180,280 Q175,230 160,200 Q140,170 115,170 Q88,172 80,200 Z" fill="white" stroke="#000" strokeWidth="5"/>
      {/* Centre segment */}
      <path d="M148,175 Q128,200 125,265 Q122,330 140,375 Q158,410 200,415 Q242,410 260,375 Q278,330 275,265 Q272,200 252,175 Q232,148 200,145 Q168,148 148,175 Z" fill="white" stroke="#000" strokeWidth="5"/>
      {/* Right segment */}
      <path d="M320,200 Q340,230 335,285 Q330,340 305,365 Q280,388 252,380 Q232,375 222,355 Q215,330 220,280 Q225,230 240,200 Q260,170 285,170 Q312,172 320,200 Z" fill="white" stroke="#000" strokeWidth="5"/>
      {/* Far left segment */}
      <path d="M65,230 Q45,255 48,300 Q52,345 72,368 Q90,385 112,375 Q98,350 95,300 Q92,255 105,220 Q85,212 65,230 Z" fill="white" stroke="#000" strokeWidth="4"/>
      {/* Far right segment */}
      <path d="M335,230 Q355,255 352,300 Q348,345 328,368 Q310,385 288,375 Q302,350 305,300 Q308,255 295,220 Q315,212 335,230 Z" fill="white" stroke="#000" strokeWidth="4"/>
      {/* Jack-o-lantern left eye */}
      <polygon points="152,230 168,210 184,230 168,248" fill="white" stroke="#000" strokeWidth="4"/>
      {/* Jack-o-lantern right eye */}
      <polygon points="216,230 232,210 248,230 232,248" fill="white" stroke="#000" strokeWidth="4"/>
      {/* Nose */}
      <polygon points="200,268 188,290 212,290" fill="white" stroke="#000" strokeWidth="4"/>
      {/* Mouth */}
      <path d="M148,315 Q155,308 162,318 Q172,332 182,318 Q192,305 200,318 Q208,332 218,318 Q228,305 238,318 Q248,332 252,315" fill="none" stroke="#000" strokeWidth="5" strokeLinejoin="round" strokeLinecap="round"/>
      {/* Bottom arc */}
      <path d="M88,368 Q140,400 200,408 Q260,400 312,368" fill="none" stroke="#000" strokeWidth="3"/>
    </svg>
  );
}
