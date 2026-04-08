// Original "Kitty Cat" character — cute bow-wearing cat, not affiliated with any brand
export default function KittyCatSvg() {
  return (
    <svg viewBox="0 0 400 500" xmlns="http://www.w3.org/2000/svg" className="w-full max-w-md mx-auto">
      {/* Body */}
      <ellipse cx="200" cy="340" rx="105" ry="110" fill="white" stroke="#000" strokeWidth="5"/>
      {/* Head - round */}
      <circle cx="200" cy="175" r="105" fill="white" stroke="#000" strokeWidth="5"/>
      {/* Left ear */}
      <polygon points="118,108 100,50 162,95" fill="white" stroke="#000" strokeWidth="5" strokeLinejoin="round"/>
      <polygon points="122,103 112,65 152,93" fill="none" stroke="#000" strokeWidth="2.5" strokeLinejoin="round"/>
      {/* Right ear */}
      <polygon points="282,108 300,50 238,95" fill="white" stroke="#000" strokeWidth="5" strokeLinejoin="round"/>
      <polygon points="278,103 288,65 248,93" fill="none" stroke="#000" strokeWidth="2.5" strokeLinejoin="round"/>
      {/* Face — minimalist, no nose/mouth for cute style */}
      {/* Left eye — oval */}
      <ellipse cx="165" cy="168" rx="20" ry="22" fill="white" stroke="#000" strokeWidth="4"/>
      <ellipse cx="165" cy="170" rx="11" ry="14" fill="white" stroke="#000" strokeWidth="3"/>
      {/* Right eye */}
      <ellipse cx="235" cy="168" rx="20" ry="22" fill="white" stroke="#000" strokeWidth="4"/>
      <ellipse cx="235" cy="170" rx="11" ry="14" fill="white" stroke="#000" strokeWidth="3"/>
      {/* Small nose dot */}
      <ellipse cx="200" cy="198" rx="8" ry="6" fill="white" stroke="#000" strokeWidth="3"/>
      {/* Whiskers */}
      <line x1="108" y1="195" x2="185" y2="200" stroke="#000" strokeWidth="2.5" strokeLinecap="round"/>
      <line x1="105" y1="208" x2="185" y2="207" stroke="#000" strokeWidth="2.5" strokeLinecap="round"/>
      <line x1="292" y1="195" x2="215" y2="200" stroke="#000" strokeWidth="2.5" strokeLinecap="round"/>
      <line x1="295" y1="208" x2="215" y2="207" stroke="#000" strokeWidth="2.5" strokeLinecap="round"/>
      {/* Big bow on right side of head */}
      {/* Bow left loop */}
      <path d="M268,112 Q245,90 252,110 Q258,128 278,122 Z" fill="white" stroke="#000" strokeWidth="3"/>
      {/* Bow right loop */}
      <path d="M310,112 Q333,90 326,110 Q320,128 300,122 Z" fill="white" stroke="#000" strokeWidth="3"/>
      {/* Bow centre */}
      <ellipse cx="289" cy="117" rx="12" ry="10" fill="white" stroke="#000" strokeWidth="3"/>
      {/* Ribbon tails */}
      <path d="M282,124 Q275,138 270,135" fill="none" stroke="#000" strokeWidth="3" strokeLinecap="round"/>
      <path d="M296,124 Q303,138 308,135" fill="none" stroke="#000" strokeWidth="3" strokeLinecap="round"/>
      {/* Arms */}
      <path d="M105,320 Q75,345 80,375 Q85,395 105,390" fill="none" stroke="#000" strokeWidth="16" strokeLinecap="round"/>
      <path d="M295,320 Q325,345 320,375 Q315,395 295,390" fill="none" stroke="#000" strokeWidth="16" strokeLinecap="round"/>
      {/* Hands / paws */}
      <ellipse cx="92" cy="393" rx="20" ry="15" fill="white" stroke="#000" strokeWidth="4"/>
      <ellipse cx="308" cy="393" rx="20" ry="15" fill="white" stroke="#000" strokeWidth="4"/>
      {/* Legs */}
      <rect x="148" y="418" width="44" height="58" rx="22" fill="white" stroke="#000" strokeWidth="4"/>
      <rect x="208" y="418" width="44" height="58" rx="22" fill="white" stroke="#000" strokeWidth="4"/>
      {/* Small dress/skirt lines on body */}
      <path d="M105,350 Q155,345 200,350 Q245,355 295,350" fill="none" stroke="#000" strokeWidth="2.5" strokeLinecap="round"/>
      {/* Belly button */}
      <circle cx="200" cy="370" r="6" fill="white" stroke="#000" strokeWidth="2.5"/>
    </svg>
  );
}
