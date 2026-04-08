// Original cartoon puppy character — cheerful blue-themed dog
export default function BlueDogSvg() {
  return (
    <svg viewBox="0 0 400 500" xmlns="http://www.w3.org/2000/svg" className="w-full max-w-md mx-auto">
      {/* Tail — wagging up */}
      <path d="M298,345 Q345,318 352,275 Q358,240 335,232" fill="none" stroke="#000" strokeWidth="15" strokeLinecap="round"/>
      {/* Body */}
      <ellipse cx="195" cy="335" rx="120" ry="118" fill="white" stroke="#000" strokeWidth="5"/>
      {/* Neck */}
      <ellipse cx="195" cy="220" rx="58" ry="34" fill="white" stroke="#000" strokeWidth="5"/>
      {/* Head */}
      <ellipse cx="195" cy="155" rx="100" ry="90" fill="white" stroke="#000" strokeWidth="5"/>
      {/* Left ear — floppy long */}
      <path d="M110,118 Q65,145 62,215 Q60,255 88,268 Q112,278 125,250 Q138,222 130,182 Q122,145 110,118 Z" fill="white" stroke="#000" strokeWidth="5"/>
      {/* Left ear inner texture */}
      <path d="M108,135 Q75,162 74,218 Q74,248 96,256 Q80,230 82,188 Q84,155 108,135 Z" fill="none" stroke="#000" strokeWidth="2.5"/>
      {/* Right ear */}
      <path d="M280,118 Q325,145 328,215 Q330,255 302,268 Q278,278 265,250 Q252,222 260,182 Q268,145 280,118 Z" fill="white" stroke="#000" strokeWidth="5"/>
      <path d="M282,135 Q315,162 316,218 Q316,248 294,256 Q310,230 308,188 Q306,155 282,135 Z" fill="none" stroke="#000" strokeWidth="2.5"/>
      {/* Snout */}
      <ellipse cx="195" cy="190" rx="52" ry="40" fill="white" stroke="#000" strokeWidth="4"/>
      {/* Nose big */}
      <ellipse cx="195" cy="175" rx="22" ry="16" fill="white" stroke="#000" strokeWidth="4"/>
      {/* Nostril dots */}
      <circle cx="187" cy="178" r="5" fill="white" stroke="#000" strokeWidth="2.5"/>
      <circle cx="203" cy="178" r="5" fill="white" stroke="#000" strokeWidth="2.5"/>
      {/* Happy open mouth */}
      <path d="M158,205 Q178,228 195,228 Q212,228 232,205" fill="none" stroke="#000" strokeWidth="4" strokeLinecap="round"/>
      <path d="M170,212 Q195,240 220,212" fill="none" stroke="#000" strokeWidth="2.5" strokeLinecap="round"/>
      {/* Tongue */}
      <path d="M178,225 Q195,248 212,225" fill="white" stroke="#000" strokeWidth="3"/>
      <line x1="195" y1="225" x2="195" y2="240" stroke="#000" strokeWidth="2.5"/>
      {/* Left eye — big happy */}
      <circle cx="158" cy="138" r="26" fill="white" stroke="#000" strokeWidth="4"/>
      <circle cx="160" cy="140" r="16" fill="white" stroke="#000" strokeWidth="3"/>
      <path d="M140,125 Q158,115 177,123" fill="none" stroke="#000" strokeWidth="3" strokeLinecap="round"/>
      {/* Right eye */}
      <circle cx="232" cy="138" r="26" fill="white" stroke="#000" strokeWidth="4"/>
      <circle cx="234" cy="140" r="16" fill="white" stroke="#000" strokeWidth="3"/>
      <path d="M214,125 Q232,115 251,123" fill="none" stroke="#000" strokeWidth="3" strokeLinecap="round"/>
      {/* Spots on body */}
      <ellipse cx="145" cy="300" rx="28" ry="35" fill="white" stroke="#000" strokeWidth="3"/>
      <ellipse cx="262" cy="368" rx="20" ry="25" fill="white" stroke="#000" strokeWidth="3"/>
      {/* Belly patch */}
      <ellipse cx="195" cy="345" rx="58" ry="72" fill="white" stroke="#000" strokeWidth="3"/>
      {/* Front legs */}
      <rect x="118" y="418" width="50" height="62" rx="25" fill="white" stroke="#000" strokeWidth="4"/>
      <rect x="222" y="418" width="50" height="62" rx="25" fill="white" stroke="#000" strokeWidth="4"/>
      {/* Paw toes */}
      <line x1="130" y1="463" x2="130" y2="480" stroke="#000" strokeWidth="3" strokeLinecap="round"/>
      <line x1="143" y1="466" x2="143" y2="480" stroke="#000" strokeWidth="3" strokeLinecap="round"/>
      <line x1="156" y1="463" x2="156" y2="480" stroke="#000" strokeWidth="3" strokeLinecap="round"/>
      <line x1="234" y1="463" x2="234" y2="480" stroke="#000" strokeWidth="3" strokeLinecap="round"/>
      <line x1="247" y1="466" x2="247" y2="480" stroke="#000" strokeWidth="3" strokeLinecap="round"/>
      <line x1="260" y1="463" x2="260" y2="480" stroke="#000" strokeWidth="3" strokeLinecap="round"/>
      {/* Collar with tag */}
      <path d="M142,222 Q195,242 248,222" fill="none" stroke="#000" strokeWidth="8" strokeLinecap="round"/>
      <circle cx="195" cy="237" r="9" fill="white" stroke="#000" strokeWidth="3"/>
    </svg>
  );
}
