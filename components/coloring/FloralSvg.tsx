export default function FloralSvg() {
  return (
    <svg viewBox="0 0 400 500" xmlns="http://www.w3.org/2000/svg" className="w-full max-w-md mx-auto">
      {/* Large centre flower */}
      {/* Petals */}
      <ellipse cx="200" cy="148" rx="22" ry="48" fill="white" stroke="#000" strokeWidth="3"/>
      <ellipse cx="200" cy="252" rx="22" ry="48" fill="white" stroke="#000" strokeWidth="3"/>
      <ellipse cx="148" cy="200" rx="48" ry="22" fill="white" stroke="#000" strokeWidth="3"/>
      <ellipse cx="252" cy="200" rx="48" ry="22" fill="white" stroke="#000" strokeWidth="3"/>
      <g transform="rotate(45,200,200)">
        <ellipse cx="200" cy="148" rx="20" ry="46" fill="white" stroke="#000" strokeWidth="3"/>
        <ellipse cx="200" cy="252" rx="20" ry="46" fill="white" stroke="#000" strokeWidth="3"/>
        <ellipse cx="148" cy="200" rx="46" ry="20" fill="white" stroke="#000" strokeWidth="3"/>
        <ellipse cx="252" cy="200" rx="46" ry="20" fill="white" stroke="#000" strokeWidth="3"/>
      </g>
      {/* Centre disc */}
      <circle cx="200" cy="200" r="38" fill="white" stroke="#000" strokeWidth="4"/>
      <circle cx="200" cy="200" r="22" fill="white" stroke="#000" strokeWidth="3"/>
      {/* Centre dots */}
      {[0,45,90,135,180,225,270,315].map((a) => {
        const r = (a * Math.PI) / 180;
        return <circle key={a} cx={200 + Math.cos(r)*14} cy={200 + Math.sin(r)*14} r="4" fill="white" stroke="#000" strokeWidth="2"/>;
      })}
      <circle cx="200" cy="200" r="5" fill="white" stroke="#000" strokeWidth="2"/>

      {/* Top left small flower */}
      <circle cx="80" cy="80" r="18" fill="white" stroke="#000" strokeWidth="3"/>
      {[0,60,120,180,240,300].map((a) => {
        const r2 = (a * Math.PI) / 180;
        return <ellipse key={a} cx={80+Math.cos(r2)*22} cy={80+Math.sin(r2)*22} rx="10" ry="16" fill="white" stroke="#000" strokeWidth="2.5" transform={`rotate(${a},${80+Math.cos(r2)*22},${80+Math.sin(r2)*22})`}/>;
      })}
      <circle cx="80" cy="80" r="8" fill="white" stroke="#000" strokeWidth="2"/>

      {/* Top right small flower */}
      <circle cx="320" cy="80" r="18" fill="white" stroke="#000" strokeWidth="3"/>
      {[0,60,120,180,240,300].map((a) => {
        const r2 = (a * Math.PI) / 180;
        return <ellipse key={a} cx={320+Math.cos(r2)*22} cy={80+Math.sin(r2)*22} rx="10" ry="16" fill="white" stroke="#000" strokeWidth="2.5" transform={`rotate(${a},${320+Math.cos(r2)*22},${80+Math.sin(r2)*22})`}/>;
      })}
      <circle cx="320" cy="80" r="8" fill="white" stroke="#000" strokeWidth="2"/>

      {/* Bottom left flower */}
      <circle cx="80" cy="400" r="22" fill="white" stroke="#000" strokeWidth="3"/>
      {[0,72,144,216,288].map((a) => {
        const r2 = (a * Math.PI) / 180;
        return <ellipse key={a} cx={80+Math.cos(r2)*26} cy={400+Math.sin(r2)*26} rx="12" ry="18" fill="white" stroke="#000" strokeWidth="2.5" transform={`rotate(${a},${80+Math.cos(r2)*26},${400+Math.sin(r2)*26})`}/>;
      })}
      <circle cx="80" cy="400" r="10" fill="white" stroke="#000" strokeWidth="2"/>

      {/* Bottom right flower */}
      <circle cx="320" cy="400" r="22" fill="white" stroke="#000" strokeWidth="3"/>
      {[0,72,144,216,288].map((a) => {
        const r2 = (a * Math.PI) / 180;
        return <ellipse key={a} cx={320+Math.cos(r2)*26} cy={400+Math.sin(r2)*26} rx="12" ry="18" fill="white" stroke="#000" strokeWidth="2.5" transform={`rotate(${a},${320+Math.cos(r2)*26},${400+Math.sin(r2)*26})`}/>;
      })}
      <circle cx="320" cy="400" r="10" fill="white" stroke="#000" strokeWidth="2"/>

      {/* Connecting vines */}
      <path d="M95,88 Q140,100 155,155" fill="none" stroke="#000" strokeWidth="2.5" strokeLinecap="round"/>
      <path d="M118,78 Q150,72 158,100" fill="none" stroke="#000" strokeWidth="2"/>
      <path d="M305,88 Q260,100 245,155" fill="none" stroke="#000" strokeWidth="2.5" strokeLinecap="round"/>
      <path d="M95,392 Q140,360 155,248" fill="none" stroke="#000" strokeWidth="2.5" strokeLinecap="round"/>
      <path d="M305,392 Q260,360 245,248" fill="none" stroke="#000" strokeWidth="2.5" strokeLinecap="round"/>

      {/* Small leaf on vines */}
      <path d="M132,130 Q148,118 152,135 Q138,138 132,130 Z" fill="none" stroke="#000" strokeWidth="2"/>
      <path d="M268,130 Q252,118 248,135 Q262,138 268,130 Z" fill="none" stroke="#000" strokeWidth="2"/>
      <path d="M128,345 Q138,328 150,342 Q138,352 128,345 Z" fill="none" stroke="#000" strokeWidth="2"/>
      <path d="M272,345 Q262,328 250,342 Q262,352 272,345 Z" fill="none" stroke="#000" strokeWidth="2"/>

      {/* Decorative dots scattered */}
      <circle cx="200" cy="35" r="5" fill="white" stroke="#000" strokeWidth="2"/>
      <circle cx="180" cy="22" r="4" fill="white" stroke="#000" strokeWidth="2"/>
      <circle cx="220" cy="22" r="4" fill="white" stroke="#000" strokeWidth="2"/>
      <circle cx="200" cy="470" r="5" fill="white" stroke="#000" strokeWidth="2"/>
      <circle cx="180" cy="483" r="4" fill="white" stroke="#000" strokeWidth="2"/>
      <circle cx="220" cy="483" r="4" fill="white" stroke="#000" strokeWidth="2"/>
    </svg>
  );
}
