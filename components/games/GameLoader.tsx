"use client";

import dynamic from "next/dynamic";

const MathsPlayGame = dynamic(() => import("./MathsPlayGame"), { ssr: false });
const CountingGame = dynamic(() => import("./CountingGame"), { ssr: false });
const AlphabetMatchGame = dynamic(() => import("./AlphabetMatchGame"), { ssr: false });

const components: Record<string, React.ComponentType> = {
  MathsPlayGame,
  CountingGame,
  AlphabetMatchGame,
};

export default function GameLoader({ component }: { component: string }) {
  const Component = components[component];
  if (!Component) return <div className="text-gray-400 text-center py-12">Game not found.</div>;
  return <Component />;
}
