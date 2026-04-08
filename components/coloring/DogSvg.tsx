export default function DogSvg() {
  return (
    <svg viewBox="0 0 400 500" xmlns="http://www.w3.org/2000/svg" className="w-full max-w-md mx-auto">
      {/* Body */}
      <ellipse cx="200" cy="330" rx="115" ry="125" fill="white" stroke="#000" strokeWidth="5"/>
      {/* Neck */}
      <ellipse cx="200" cy="215" rx="58" ry="32" fill="white" stroke="#000" strokeWidth="5"/>
      {/* Head */}
      <ellipse cx="200" cy="155" rx="95" ry="85" fill="white" stroke="#000" strokeWidth="5"/>
      {/* Left ear (floppy) */}
      <path d="M115,120 Q75,140 80,210 Q85,240 115,230 Q135,220 130,185 Q128,150 115,120 Z" fill="white" stroke="#000" strokeWidth="5"/>
      {/* Right ear (floppy) */}
      <path d="M285,120 Q325,140 320,210 Q315,240 285,230 Q265,220 270,185 Q272,150 285,120 Z" fill="white" stroke="#000" strokeWidth="5"/>
      {/* Snout */}
      <ellipse cx="200" cy="190" rx="48" ry="36" fill="white" stroke="#000" strokeWidth="4"/>
      {/* Nose */}
      <ellipse cx="200" cy="175" rx="20" ry="14" fill="white" stroke="#000" strokeWidth="4"/>
      {/* Nostril left */}
      <ellipse cx="192" cy="177" rx="5" ry="4" fill="white" stroke="#000" strokeWidth="2"/>
      {/* Nostril right */}
      <ellipse cx="208" cy="177" rx="5" ry="4" fill="white" stroke="#000" strokeWidth="2"/>
      {/* Mouth */}
      <path d="M178,195 Q200,215 222,195" fill="none" stroke="#000" strokeWidth="4" strokeLinecap="round"/>
      <line x1="200" y1="195" x2="200" y2="210" stroke="#000" strokeWidth="3" strokeLinecap="round"/>
      {/* Left eye */}
      <circle cx="162" cy="140" r="22" fill="white" stroke="#000" strokeWidth="4"/>
      <circle cx="164" cy="142" r="13" fill="white" stroke="#000" strokeWidth="3"/>
      {/* Right eye */}
      <circle cx="238" cy="140" r="22" fill="white" stroke="#000" strokeWidth="4"/>
      <circle cx="240" cy="142" r="13" fill="white" stroke="#000" strokeWidth="3"/>
      {/* Eyebrow left */}
      <path d="M145,118 Q162,108 180,112" fill="none" stroke="#000" strokeWidth="3.5" strokeLinecap="round"/>
      {/* Eyebrow right */}
      <path d="M220,112 Q238,108 255,118" fill="none" stroke="#000" strokeWidth="3.5" strokeLinecap="round"/>
      {/* Belly */}
      <ellipse cx="200" cy="340" rx="60" ry="78" fill="white" stroke="#000" strokeWidth="3"/>
      {/* Front left leg */}
      <rect x="115" y="415" width="45" height="60" rx="22" fill="white" stroke="#000" strokeWidth="4"/>
      {/* Front right leg */}
      <rect x="240" y="415" width="45" height="60" rx="22" fill="white" stroke="#000" strokeWidth="4"/>
      {/* Paw toes left */}
      <line x1="126" y1="460" x2="126" y2="475" stroke="#000" strokeWidth="2.5" strokeLinecap="round"/>
      <line x1="137" y1="462" x2="137" y2="475" stroke="#000" strokeWidth="2.5" strokeLinecap="round"/>
      <line x1="148" y1="460" x2="148" y2="475" stroke="#000" strokeWidth="2.5" strokeLinecap="round"/>
      {/* Paw toes right */}
      <line x1="252" y1="460" x2="252" y2="475" stroke="#000" strokeWidth="2.5" strokeLinecap="round"/>
      <line x1="263" y1="462" x2="263" y2="475" stroke="#000" strokeWidth="2.5" strokeLinecap="round"/>
      <line x1="274" y1="460" x2="274" y2="475" stroke="#000" strokeWidth="2.5" strokeLinecap="round"/>
      {/* Tail */}
      <path d="M312 330 Q370 290 360 230 Q352 185 320 195" fill="none" stroke="#000" strokeWidth="14" strokeLinecap="round"/>
      {/* Collar */}
      <path d="M148,218 Q200,238 252,218" fill="none" stroke="#000" strokeWidth="8" strokeLinecap="round"/>
      {/* Tag */}
      <circle cx="200" cy="232" r="9" fill="white" stroke="#000" strokeWidth="3"/>
      {/* Spots on body */}
      <ellipse cx="150" cy="295" rx="22" ry="28" fill="white" stroke="#000" strokeWidth="3"/>
      <ellipse cx="255" cy="370" rx="18" ry="22" fill="white" stroke="#000" strokeWidth="3"/>
    </svg>
  );
}
