"use client";

import dynamic from "next/dynamic";

const MathsPlayGame          = dynamic(() => import("./MathsPlayGame"),          { ssr: false });
const CountingGame           = dynamic(() => import("./CountingGame"),           { ssr: false });
const AlphabetMatchGame      = dynamic(() => import("./AlphabetMatchGame"),      { ssr: false });
const AnimalSoundsGame       = dynamic(() => import("./AnimalSoundsGame"),       { ssr: false });
const BubblePopABCGame       = dynamic(() => import("./BubblePopABCGame"),       { ssr: false });
const ShapeSorterGame        = dynamic(() => import("./ShapeSorterGame"),        { ssr: false });
const ColorMatchGame         = dynamic(() => import("./ColorMatchGame"),         { ssr: false });
const MemoryMatchAnimalsGame = dynamic(() => import("./MemoryMatchAnimalsGame"), { ssr: false });
const ConnectDotsGame        = dynamic(() => import("./ConnectDotsGame"),        { ssr: false });
const WordSpellGame          = dynamic(() => import("./WordSpellGame"),          { ssr: false });
const PatternWizardGame      = dynamic(() => import("./PatternWizardGame"),      { ssr: false });
const SortingFrenzyGame      = dynamic(() => import("./SortingFrenzyGame"),      { ssr: false });
const StoryAdventureGame     = dynamic(() => import("./StoryAdventureGame"),     { ssr: false });
const SpaceDefenderGame      = dynamic(() => import("./SpaceDefenderGame"),      { ssr: false });
const BrickBreakerGame       = dynamic(() => import("./BrickBreakerGame"),       { ssr: false });
const DinoRunGame            = dynamic(() => import("./DinoRunGame"),            { ssr: false });
const SnakeGame              = dynamic(() => import("./SnakeGame"),              { ssr: false });
const TimesChallengeGame     = dynamic(() => import("./TimesChallengeGame"),     { ssr: false });
const MultiplicationBlastGame = dynamic(() => import("./MultiplicationBlastGame"), { ssr: false });
const MathQuizGame           = dynamic(() => import("./MathQuizGame"),           { ssr: false });
const PumpkinSmashGame       = dynamic(() => import("./PumpkinSmashGame"),       { ssr: false });
const PresentCatcherGame     = dynamic(() => import("./PresentCatcherGame"),     { ssr: false });
const EasterEggHuntGame      = dynamic(() => import("./EasterEggHuntGame"),      { ssr: false });

const components: Record<string, React.ComponentType> = {
  TimesChallengeGame,
  MultiplicationBlastGame,
  MathQuizGame,
  PumpkinSmashGame,
  PresentCatcherGame,
  EasterEggHuntGame,
  MathsPlayGame,
  CountingGame,
  AlphabetMatchGame,
  AnimalSoundsGame,
  BubblePopABCGame,
  ShapeSorterGame,
  ColorMatchGame,
  MemoryMatchAnimalsGame,
  ConnectDotsGame,
  WordSpellGame,
  PatternWizardGame,
  SortingFrenzyGame,
  StoryAdventureGame,
  SpaceDefenderGame,
  BrickBreakerGame,
  DinoRunGame,
  SnakeGame,
};

export default function GameLoader({ component }: { component: string }) {
  const Component = components[component];
  if (!Component) return <div className="text-gray-400 text-center py-12">Game not found.</div>;
  return <Component />;
}
