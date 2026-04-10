"use client";

import dynamic from "next/dynamic";

// Kid-friendly loading skeleton — bouncing dots + a rainbow shimmer
// so the game container never appears blank while the chunk loads.
function GameLoading() {
  return (
    <div className="w-full max-w-2xl mx-auto px-4 py-10 flex flex-col items-center justify-center gap-5 min-h-[420px]">
      <div className="text-6xl animate-bounce-slow" aria-hidden="true">🎮</div>
      <div className="flex gap-2">
        <span className="w-3 h-3 rounded-full bg-purple-500 animate-bounce" style={{ animationDelay: "0ms" }} />
        <span className="w-3 h-3 rounded-full bg-pink-500 animate-bounce" style={{ animationDelay: "150ms" }} />
        <span className="w-3 h-3 rounded-full bg-yellow-400 animate-bounce" style={{ animationDelay: "300ms" }} />
      </div>
      <p className="text-gray-600 font-bold text-base">Loading game…</p>
      <div className="w-full max-w-md h-4 rounded-full bg-gray-100 overflow-hidden">
        <div className="h-full w-1/3 bg-gradient-to-r from-purple-500 via-pink-500 to-orange-400 rounded-full animate-pulse" />
      </div>
      <span className="sr-only">Loading game, please wait.</span>
    </div>
  );
}


const MathsPlayGame          = dynamic(() => import("./MathsPlayGame"),          { ssr: false, loading: GameLoading });
const CountingGame           = dynamic(() => import("./CountingGame"),           { ssr: false, loading: GameLoading });
const AlphabetMatchGame      = dynamic(() => import("./AlphabetMatchGame"),      { ssr: false, loading: GameLoading });
const AnimalSoundsGame       = dynamic(() => import("./AnimalSoundsGame"),       { ssr: false, loading: GameLoading });
const BubblePopABCGame       = dynamic(() => import("./BubblePopABCGame"),       { ssr: false, loading: GameLoading });
const ShapeSorterGame        = dynamic(() => import("./ShapeSorterGame"),        { ssr: false, loading: GameLoading });
const ColorMatchGame         = dynamic(() => import("./ColorMatchGame"),         { ssr: false, loading: GameLoading });
const MemoryMatchAnimalsGame = dynamic(() => import("./MemoryMatchAnimalsGame"), { ssr: false, loading: GameLoading });
const ConnectDotsGame        = dynamic(() => import("./ConnectDotsGame"),        { ssr: false, loading: GameLoading });
const WordSpellGame          = dynamic(() => import("./WordSpellGame"),          { ssr: false, loading: GameLoading });
const PatternWizardGame      = dynamic(() => import("./PatternWizardGame"),      { ssr: false, loading: GameLoading });
const SortingFrenzyGame      = dynamic(() => import("./SortingFrenzyGame"),      { ssr: false, loading: GameLoading });
const StoryAdventureGame     = dynamic(() => import("./StoryAdventureGame"),     { ssr: false, loading: GameLoading });
const SpaceDefenderGame      = dynamic(() => import("./SpaceDefenderGame"),      { ssr: false, loading: GameLoading });
const BrickBreakerGame       = dynamic(() => import("./BrickBreakerGame"),       { ssr: false, loading: GameLoading });
const DinoRunGame            = dynamic(() => import("./DinoRunGame"),            { ssr: false, loading: GameLoading });
const SnakeGame              = dynamic(() => import("./SnakeGame"),              { ssr: false, loading: GameLoading });
const TimesChallengeGame     = dynamic(() => import("./TimesChallengeGame"),     { ssr: false, loading: GameLoading });
const MultiplicationBlastGame = dynamic(() => import("./MultiplicationBlastGame"), { ssr: false, loading: GameLoading });
const MathQuizGame           = dynamic(() => import("./MathQuizGame"),           { ssr: false, loading: GameLoading });
const PumpkinSmashGame       = dynamic(() => import("./PumpkinSmashGame"),       { ssr: false, loading: GameLoading });
const PresentCatcherGame     = dynamic(() => import("./PresentCatcherGame"),     { ssr: false, loading: GameLoading });
const EasterEggHuntGame      = dynamic(() => import("./EasterEggHuntGame"),      { ssr: false, loading: GameLoading });
const SuperJumperGame        = dynamic(() => import("./SuperJumperGame"),        { ssr: false, loading: GameLoading });
const FractionsFrenzyGame    = dynamic(() => import("./FractionsFrenzyGame"),    { ssr: false, loading: GameLoading });
const MoneyMatchGame         = dynamic(() => import("./MoneyMatchGame"),         { ssr: false, loading: GameLoading });
const SpellingBeeGame        = dynamic(() => import("./SpellingBeeGame"),        { ssr: false, loading: GameLoading });
const TimeTellerGame         = dynamic(() => import("./TimeTellerGame"),         { ssr: false, loading: GameLoading });
const AdditionAttackGame     = dynamic(() => import("./AdditionAttackGame"),     { ssr: false, loading: GameLoading });
const SubtractionStationGame = dynamic(() => import("./SubtractionStationGame"), { ssr: false, loading: GameLoading });
const DivisionDuelGame       = dynamic(() => import("./DivisionDuelGame"),       { ssr: false, loading: GameLoading });
const ReadingRocketGame      = dynamic(() => import("./ReadingRocketGame"),      { ssr: false, loading: GameLoading });
const SightWordSlamGame      = dynamic(() => import("./SightWordSlamGame"),      { ssr: false, loading: GameLoading });
const SudokuKidsGame         = dynamic(() => import("./SudokuKidsGame"),         { ssr: false, loading: GameLoading });

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
  SuperJumperGame,
  FractionsFrenzyGame,
  MoneyMatchGame,
  SpellingBeeGame,
  TimeTellerGame,
  AdditionAttackGame,
  SubtractionStationGame,
  DivisionDuelGame,
  ReadingRocketGame,
  SightWordSlamGame,
  SudokuKidsGame,
};

export default function GameLoader({ component }: { component: string }) {
  const Component = components[component];
  if (!Component) return <div className="text-gray-400 text-center py-12">Game not found.</div>;
  return <Component />;
}
