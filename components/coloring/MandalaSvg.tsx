export default function MandalaSvg() {
  // Build mandala using SVG transforms for symmetric patterns
  const petals = Array.from({ length: 12 }, (_, i) => i * 30);
  const midPetals = Array.from({ length: 12 }, (_, i) => i * 30 + 15);
  const outerDots = Array.from({ length: 24 }, (_, i) => i * 15);

  return (
    <svg viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg" className="w-full max-w-md mx-auto">
      <g transform="translate(200,200)">
        {/* Outer circle */}
        <circle cx="0" cy="0" r="185" fill="white" stroke="#000" strokeWidth="3"/>
        {/* Outer dot ring */}
        {outerDots.map((angle) => {
          const rad = (angle * Math.PI) / 180;
          const x = Math.cos(rad) * 170;
          const y = Math.sin(rad) * 170;
          return <circle key={angle} cx={x} cy={y} r="5" fill="white" stroke="#000" strokeWidth="2"/>;
        })}
        {/* Outer petal ring */}
        {petals.map((angle) => (
          <g key={angle} transform={`rotate(${angle})`}>
            <ellipse cx="0" cy="-148" rx="14" ry="28" fill="white" stroke="#000" strokeWidth="2.5"/>
          </g>
        ))}
        {/* Second ring - large teardrops */}
        {petals.map((angle) => (
          <g key={angle} transform={`rotate(${angle})`}>
            <path d="M0,-118 Q12,-100 0,-78 Q-12,-100 0,-118 Z" fill="white" stroke="#000" strokeWidth="2.5"/>
          </g>
        ))}
        {/* Second ring - small teardrop offset */}
        {midPetals.map((angle) => (
          <g key={angle} transform={`rotate(${angle})`}>
            <path d="M0,-108 Q8,-95 0,-80 Q-8,-95 0,-108 Z" fill="white" stroke="#000" strokeWidth="2"/>
          </g>
        ))}
        {/* Circle ring 2 */}
        <circle cx="0" cy="0" r="125" fill="none" stroke="#000" strokeWidth="2"/>
        <circle cx="0" cy="0" r="115" fill="none" stroke="#000" strokeWidth="1.5"/>
        {/* Mid petal ring */}
        {petals.map((angle) => (
          <g key={angle} transform={`rotate(${angle})`}>
            <ellipse cx="0" cy="-92" rx="12" ry="22" fill="white" stroke="#000" strokeWidth="2.5"/>
          </g>
        ))}
        {/* Mid dot ring */}
        {midPetals.map((angle) => {
          const rad = (angle * Math.PI) / 180;
          const x = Math.cos(rad) * 95;
          const y = Math.sin(rad) * 95;
          return <circle key={angle} cx={x} cy={y} r="7" fill="white" stroke="#000" strokeWidth="2"/>;
        })}
        {/* Inner circle border */}
        <circle cx="0" cy="0" r="72" fill="none" stroke="#000" strokeWidth="2.5"/>
        {/* Inner petal ring */}
        {petals.map((angle) => (
          <g key={angle} transform={`rotate(${angle})`}>
            <path d="M0,-65 Q10,-52 0,-38 Q-10,-52 0,-65 Z" fill="white" stroke="#000" strokeWidth="2.5"/>
          </g>
        ))}
        {/* Inner ring dots */}
        {petals.map((angle) => {
          const rad = (angle * Math.PI) / 180;
          const x = Math.cos(rad) * 52;
          const y = Math.sin(rad) * 52;
          return <circle key={angle} cx={x} cy={y} r="6" fill="white" stroke="#000" strokeWidth="2"/>;
        })}
        {/* Inner circle */}
        <circle cx="0" cy="0" r="35" fill="none" stroke="#000" strokeWidth="2.5"/>
        {/* Inner petals small */}
        {midPetals.map((angle) => (
          <g key={angle} transform={`rotate(${angle})`}>
            <ellipse cx="0" cy="-26" rx="6" ry="12" fill="white" stroke="#000" strokeWidth="2"/>
          </g>
        ))}
        {/* Inner diamond ring */}
        {petals.map((angle) => (
          <g key={angle} transform={`rotate(${angle})`}>
            <path d="M0,-32 L4,-26 L0,-20 L-4,-26 Z" fill="white" stroke="#000" strokeWidth="2"/>
          </g>
        ))}
        {/* Centre circle */}
        <circle cx="0" cy="0" r="15" fill="white" stroke="#000" strokeWidth="3"/>
        <circle cx="0" cy="0" r="7" fill="white" stroke="#000" strokeWidth="2.5"/>
      </g>
    </svg>
  );
}
