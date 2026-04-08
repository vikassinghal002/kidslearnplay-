export default function MindfulnessSvg() {
  const arms = Array.from({ length: 8 }, (_, i) => i * 45);

  return (
    <svg viewBox="0 0 400 450" xmlns="http://www.w3.org/2000/svg" className="w-full max-w-md mx-auto">
      {/* Title text area - decorative border */}
      <rect x="60" y="15" width="280" height="44" rx="22" fill="white" stroke="#000" strokeWidth="3"/>
      <text x="200" y="44" textAnchor="middle" fontSize="18" fontFamily="serif" fill="#000" fontStyle="italic">Breathe &amp; Be Still</text>

      <g transform="translate(200,255)">
        {/* Outer decorative ring */}
        <circle cx="0" cy="0" r="178" fill="none" stroke="#000" strokeWidth="2"/>
        {/* Outer leaf ring */}
        {arms.map((angle) => (
          <g key={angle} transform={`rotate(${angle})`}>
            <path d="M0,-165 Q18,-148 0,-128 Q-18,-148 0,-165 Z" fill="white" stroke="#000" strokeWidth="3"/>
            <line x1="0" y1="-165" x2="0" y2="-128" stroke="#000" strokeWidth="1.5"/>
          </g>
        ))}
        {/* 16 small leaves between */}
        {Array.from({ length: 16 }, (_, i) => i * 22.5).map((angle) => (
          <g key={angle} transform={`rotate(${angle})`}>
            <path d="M0,-170 Q6,-162 0,-154 Q-6,-162 0,-170 Z" fill="white" stroke="#000" strokeWidth="2"/>
          </g>
        ))}
        {/* Dot ring */}
        {Array.from({ length: 24 }, (_, i) => i * 15).map((angle) => {
          const rad = (angle * Math.PI) / 180;
          return <circle key={angle} cx={Math.cos(rad)*148} cy={Math.sin(rad)*148} r="4" fill="white" stroke="#000" strokeWidth="2"/>;
        })}
        {/* Wave ring */}
        <circle cx="0" cy="0" r="132" fill="none" stroke="#000" strokeWidth="2.5"/>
        {/* Lotus petals - outer */}
        {arms.map((angle) => (
          <g key={angle} transform={`rotate(${angle})`}>
            <path d="M0,-118 Q22,-95 18,-72 Q0,-62 -18,-72 Q-22,-95 0,-118 Z" fill="white" stroke="#000" strokeWidth="3"/>
            <path d="M0,-112 Q12,-96 10,-78 Q0,-70 -10,-78 Q-12,-96 0,-112 Z" fill="none" stroke="#000" strokeWidth="1.5"/>
          </g>
        ))}
        {/* Lotus petals - inner offset */}
        {Array.from({ length: 8 }, (_, i) => i * 45 + 22.5).map((angle) => (
          <g key={angle} transform={`rotate(${angle})`}>
            <path d="M0,-100 Q16,-82 12,-62 Q0,-52 -12,-62 Q-16,-82 0,-100 Z" fill="white" stroke="#000" strokeWidth="2.5"/>
          </g>
        ))}
        {/* Inner circle */}
        <circle cx="0" cy="0" r="48" fill="none" stroke="#000" strokeWidth="3"/>
        {/* Inner dot circle */}
        {Array.from({ length: 12 }, (_, i) => i * 30).map((angle) => {
          const rad = (angle * Math.PI) / 180;
          return <circle key={angle} cx={Math.cos(rad)*38} cy={Math.sin(rad)*38} r="5" fill="white" stroke="#000" strokeWidth="2.5"/>;
        })}
        {/* Small inner lotus */}
        {Array.from({ length: 6 }, (_, i) => i * 60).map((angle) => (
          <g key={angle} transform={`rotate(${angle})`}>
            <path d="M0,-28 Q8,-18 6,-8 Q0,-4 -6,-8 Q-8,-18 0,-28 Z" fill="white" stroke="#000" strokeWidth="2"/>
          </g>
        ))}
        {/* Centre */}
        <circle cx="0" cy="0" r="12" fill="white" stroke="#000" strokeWidth="3"/>
        <circle cx="0" cy="0" r="5" fill="white" stroke="#000" strokeWidth="2"/>
      </g>
    </svg>
  );
}
