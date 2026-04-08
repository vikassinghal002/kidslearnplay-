export default function DinosaurSvg() {
  return (
    <svg viewBox="0 0 400 500" xmlns="http://www.w3.org/2000/svg" className="w-full max-w-md mx-auto">
      {/* Tail */}
      <path d="M290 370 Q350 360 380 320 Q400 285 370 260 Q345 242 330 260" fill="white" stroke="#000" strokeWidth="5"/>
      {/* Body */}
      <ellipse cx="200" cy="310" rx="120" ry="130" fill="white" stroke="#000" strokeWidth="5"/>
      {/* Belly */}
      <ellipse cx="195" cy="320" rx="72" ry="88" fill="white" stroke="#000" strokeWidth="3"/>
      {/* Neck */}
      <path d="M145,200 Q130,170 140,130 Q145,110 160,105 Q175,100 185,110 Q195,120 190,145 Q185,165 190,195" fill="white" stroke="#000" strokeWidth="5"/>
      {/* Head */}
      <ellipse cx="165" cy="90" rx="60" ry="48" fill="white" stroke="#000" strokeWidth="5"/>
      {/* Snout */}
      <path d="M140,90 Q125,100 120,115 Q118,128 130,132 Q148,136 165,125 Q175,118 180,105" fill="white" stroke="#000" strokeWidth="4"/>
      {/* Nostril */}
      <ellipse cx="130" cy="118" rx="6" ry="5" fill="white" stroke="#000" strokeWidth="2.5"/>
      {/* Eye */}
      <circle cx="178" cy="72" r="18" fill="white" stroke="#000" strokeWidth="4"/>
      <circle cx="180" cy="73" r="10" fill="white" stroke="#000" strokeWidth="3"/>
      {/* Eyelid */}
      <path d="M161,68 Q178,60 196,68" fill="none" stroke="#000" strokeWidth="3" strokeLinecap="round"/>
      {/* Mouth / teeth */}
      <path d="M130,130 Q148,142 165,135 Q175,130 180,120" fill="none" stroke="#000" strokeWidth="3" strokeLinecap="round"/>
      <line x1="140" y1="134" x2="138" y2="145" stroke="#000" strokeWidth="2.5" strokeLinecap="round"/>
      <line x1="150" y1="138" x2="149" y2="150" stroke="#000" strokeWidth="2.5" strokeLinecap="round"/>
      <line x1="160" y1="138" x2="160" y2="149" stroke="#000" strokeWidth="2.5" strokeLinecap="round"/>
      {/* Back spines */}
      <polygon points="168,108 158,65 152,108" fill="white" stroke="#000" strokeWidth="3"/>
      <polygon points="182,155 168,110 155,158" fill="white" stroke="#000" strokeWidth="3"/>
      <polygon points="195,188 180,145 168,190" fill="white" stroke="#000" strokeWidth="3"/>
      <polygon points="210,210 193,168 178,212" fill="white" stroke="#000" strokeWidth="3"/>
      {/* Left front arm */}
      <path d="M140,250 Q110,270 95,305 Q88,325 100,330" fill="none" stroke="#000" strokeWidth="14" strokeLinecap="round"/>
      <path d="M100,330 Q90,348 96,355" fill="none" stroke="#000" strokeWidth="5" strokeLinecap="round"/>
      <path d="M100,330 Q102,352 112,355" fill="none" stroke="#000" strokeWidth="5" strokeLinecap="round"/>
      <path d="M100,330 Q112,347 120,347" fill="none" stroke="#000" strokeWidth="5" strokeLinecap="round"/>
      {/* Left back leg */}
      <path d="M120,400 Q100,420 95,455" fill="none" stroke="#000" strokeWidth="20" strokeLinecap="round"/>
      <ellipse cx="100" cy="462" rx="30" ry="15" fill="white" stroke="#000" strokeWidth="4"/>
      <line x1="80" y1="462" x2="72" y2="475" stroke="#000" strokeWidth="4" strokeLinecap="round"/>
      <line x1="100" y1="465" x2="98" y2="480" stroke="#000" strokeWidth="4" strokeLinecap="round"/>
      <line x1="120" y1="462" x2="124" y2="475" stroke="#000" strokeWidth="4" strokeLinecap="round"/>
      {/* Right back leg */}
      <path d="M265,400 Q282,420 288,455" fill="none" stroke="#000" strokeWidth="20" strokeLinecap="round"/>
      <ellipse cx="292" cy="462" rx="30" ry="15" fill="white" stroke="#000" strokeWidth="4"/>
      <line x1="272" y1="462" x2="268" y2="475" stroke="#000" strokeWidth="4" strokeLinecap="round"/>
      <line x1="292" y1="465" x2="292" y2="480" stroke="#000" strokeWidth="4" strokeLinecap="round"/>
      <line x1="312" y1="462" x2="316" y2="475" stroke="#000" strokeWidth="4" strokeLinecap="round"/>
    </svg>
  );
}
