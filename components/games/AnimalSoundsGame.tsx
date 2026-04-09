"use client";

import { useState } from "react";

const ANIMALS = [
  { name: "Cat",      emoji: "🐱", sound: "Meow!",      color: "bg-orange-100 border-orange-300" },
  { name: "Dog",      emoji: "🐶", sound: "Woof!",      color: "bg-yellow-100 border-yellow-300" },
  { name: "Cow",      emoji: "🐮", sound: "Moo!",       color: "bg-pink-100   border-pink-300"   },
  { name: "Duck",     emoji: "🦆", sound: "Quack!",     color: "bg-blue-100   border-blue-300"   },
  { name: "Sheep",    emoji: "🐑", sound: "Baa!",       color: "bg-gray-100   border-gray-300"   },
  { name: "Pig",      emoji: "🐷", sound: "Oink!",      color: "bg-rose-100   border-rose-300"   },
  { name: "Lion",     emoji: "🦁", sound: "Roar!",      color: "bg-amber-100  border-amber-300"  },
  { name: "Elephant", emoji: "🐘", sound: "Trumpet!",   color: "bg-slate-100  border-slate-300"  },
  { name: "Frog",     emoji: "🐸", sound: "Ribbit!",    color: "bg-green-100  border-green-300"  },
  { name: "Horse",    emoji: "🐴", sound: "Neigh!",     color: "bg-lime-100   border-lime-300"   },
  { name: "Owl",      emoji: "🦉", sound: "Hoot!",      color: "bg-purple-100 border-purple-300" },
  { name: "Snake",    emoji: "🐍", sound: "Hisss!",     color: "bg-teal-100   border-teal-300"   },
];

export default function AnimalSoundsGame() {
  const [active, setActive] = useState<string | null>(null);
  const [tapped, setTapped] = useState<Set<string>>(new Set());

  function handleTap(name: string) {
    setActive(name);
    setTapped((prev) => new Set([...prev, name]));
    setTimeout(() => setActive(null), 1500);
  }

  const allDone = tapped.size === ANIMALS.length;

  return (
    <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-2xl p-5 max-w-lg mx-auto text-center select-none">
      <h2 className="text-2xl font-extrabold text-orange-600 mb-1">🐾 Animal Sounds</h2>
      <p className="text-gray-500 text-sm mb-4">Tap each animal to hear its sound!</p>

      <div className="mb-3 text-sm text-gray-500">
        {tapped.size}/{ANIMALS.length} animals discovered
        <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
          <div
            className="bg-orange-400 h-2 rounded-full transition-all duration-500"
            style={{ width: `${(tapped.size / ANIMALS.length) * 100}%` }}
          />
        </div>
      </div>

      {allDone && (
        <div className="bg-white rounded-2xl p-4 mb-4 border-2 border-orange-300">
          <div className="text-4xl mb-1">🎉</div>
          <p className="font-extrabold text-orange-600 text-lg">Amazing! You found all the animals!</p>
          <button
            onClick={() => { setTapped(new Set()); setActive(null); }}
            className="mt-2 px-5 py-2 bg-orange-500 text-white rounded-full font-bold hover:bg-orange-600 transition-colors text-sm"
          >
            Play Again
          </button>
        </div>
      )}

      <div className="grid grid-cols-3 gap-3">
        {ANIMALS.map((animal) => {
          const isActive = active === animal.name;
          const done = tapped.has(animal.name);
          return (
            <button
              key={animal.name}
              onClick={() => handleTap(animal.name)}
              className={`relative rounded-2xl border-2 p-3 flex flex-col items-center gap-1 transition-all active:scale-95 cursor-pointer ${animal.color} ${isActive ? "scale-110 shadow-lg" : "hover:scale-105"}`}
            >
              <span className="text-4xl">{animal.emoji}</span>
              <span className="font-bold text-gray-700 text-xs">{animal.name}</span>
              {isActive && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-white border border-orange-300 text-orange-600 font-extrabold text-sm px-3 py-0.5 rounded-full shadow whitespace-nowrap">
                  {animal.sound}
                </span>
              )}
              {done && !isActive && (
                <span className="absolute top-1 right-1 text-xs">✅</span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
