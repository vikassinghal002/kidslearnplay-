"use client";

import { useState } from "react";

// ─── Story engine ─────────────────────────────────────────────────────────────

type Choice = { text: string; emoji: string; next: string; points: number };
type Scene  = {
  id: string;
  bg: string;
  character: string;
  narration: string;
  choices?: Choice[];
  ending?: { title: string; emoji: string; message: string };
};

const STORIES: { title: string; emoji: string; description: string; scenes: Record<string, Scene> }[] = [
  {
    title: "Zara's First Day",
    emoji: "🎒",
    description: "Help Zara navigate her first day at school and make new friends!",
    scenes: {
      start: {
        id: "start",
        bg: "from-blue-50 to-sky-100",
        character: "👧",
        narration: "Zara woke up on her first day of school. Her tummy felt full of butterflies! She looked at her lunch box. What should she do?",
        choices: [
          { text: "Take a deep breath and smile",      emoji: "😊", next: "brave",   points: 10 },
          { text: "Hide under the blanket",             emoji: "😰", next: "scared",  points: 5  },
          { text: "Call mum for a big hug",             emoji: "🤗", next: "hug",    points: 10 },
        ],
      },
      brave: {
        id: "brave",
        bg: "from-yellow-50 to-amber-100",
        character: "😊",
        narration: "Zara took a big breath and smiled! She felt a little better. She arrived at school and saw a girl sitting alone. What did Zara do?",
        choices: [
          { text: "Say hello and ask to sit together", emoji: "👋", next: "friend1",  points: 15 },
          { text: "Walk past quietly",                  emoji: "🚶", next: "lonely",   points: 5  },
          { text: "Share her stickers",                 emoji: "⭐", next: "sticker", points: 15 },
        ],
      },
      scared: {
        id: "scared",
        bg: "from-gray-50 to-slate-100",
        character: "😰",
        narration: "Zara hid under the blanket, but then she remembered what her dad said: 'Brave people feel scared too!' She got up. At school, she saw two kids arguing over a toy. What did she do?",
        choices: [
          { text: "Help them share the toy",    emoji: "🤝", next: "peacemaker", points: 15 },
          { text: "Tell the teacher",           emoji: "👩‍🏫", next: "teacher",    points: 10 },
          { text: "Walk away",                  emoji: "🚶", next: "playground", points: 5  },
        ],
      },
      hug: {
        id: "hug",
        bg: "from-pink-50 to-rose-100",
        character: "🤗",
        narration: "Mum gave Zara the best hug! She felt warm and ready. At school, she sat in class and couldn't understand a question. What did she do?",
        choices: [
          { text: "Put her hand up and ask",     emoji: "✋", next: "askhelp",  points: 15 },
          { text: "Copy from her neighbour",     emoji: "👀", next: "copy",     points: 3  },
          { text: "Leave it blank",              emoji: "✏️", next: "skip",     points: 5  },
        ],
      },
      friend1: {
        id: "friend1",
        bg: "from-green-50 to-emerald-100",
        character: "👧🧒",
        narration: "The girl's name was Lily! They both loved dinosaurs. At lunch Zara's sandwich fell on the floor. What did she do?",
        choices: [
          { text: "Tell the teacher and get a new one", emoji: "👩‍🏫", next: "good_end",   points: 10 },
          { text: "Pick it up and eat it anyway",       emoji: "🥪",  next: "gross_end",  points: 0  },
          { text: "Share Lily's lunch",                 emoji: "🍱",  next: "share_end",  points: 15 },
        ],
      },
      sticker: {
        id: "sticker",
        bg: "from-purple-50 to-violet-100",
        character: "⭐",
        narration: "The girl loved the stickers! Her name was Maya and she became Zara's best friend. At art class they had to paint. Zara spilled the paint! What did she do?",
        choices: [
          { text: "Say sorry and help clean up",  emoji: "🧹", next: "honest_end",  points: 15 },
          { text: "Pretend it wasn't her",        emoji: "😶", next: "blame_end",   points: 0  },
          { text: "Laugh about it with Maya",     emoji: "😂", next: "laugh_end",   points: 10 },
        ],
      },
      lonely: {
        id: "lonely",
        bg: "from-gray-50 to-zinc-100",
        character: "😔",
        narration: "Zara walked past but then felt bad. She turned around. At break time, she fell and scraped her knee. What did she do?",
        choices: [
          { text: "Be brave and tell a teacher",  emoji: "🩹", next: "brave_end",  points: 10 },
          { text: "Cry and call mum",             emoji: "😢", next: "okay_end",   points: 5  },
          { text: "Carry on and ignore it",       emoji: "💪", next: "tough_end",  points: 8  },
        ],
      },
      peacemaker: {
        id: "peacemaker",
        bg: "from-teal-50 to-cyan-100",
        character: "🤝",
        narration: "The kids listened to Zara and took turns! They called her 'the Peacemaker'. At home, Zara had homework but wanted to watch TV. What did she do?",
        choices: [
          { text: "Homework first, then TV",     emoji: "📚", next: "responsible_end", points: 15 },
          { text: "TV first, homework later",    emoji: "📺", next: "late_end",        points: 5  },
          { text: "Ask mum to help",             emoji: "👩", next: "teamwork_end",    points: 12 },
        ],
      },
      askhelp: {
        id: "askhelp",
        bg: "from-blue-50 to-indigo-100",
        character: "✋",
        narration: "The teacher was so pleased Zara asked! She explained it clearly. Zara understood and finished first! At home she told her parents everything. What did they say?",
        choices: [
          { text: "We're so proud of you!",    emoji: "❤️", next: "proud_end",  points: 15 },
        ],
      },
      // ── Endings ──────────────────────────────────────────────────────────────
      good_end:        { id: "good_end",        bg: "from-yellow-50 to-amber-100", character: "🌟", narration: "", ending: { title: "Super Zara!", emoji: "🌟", message: "Zara told the teacher and got a fresh sandwich! She showed that asking for help is always the right thing. She made a great new friend too!" } },
      gross_end:       { id: "gross_end",       bg: "from-gray-50 to-gray-100",    character: "🤢", narration: "", ending: { title: "Oops!", emoji: "🤢", message: "Zara ate the dropped sandwich and got a tummy ache! Next time it's better to tell a grown-up when something goes wrong." } },
      share_end:       { id: "share_end",       bg: "from-green-50 to-green-100",  character: "💚", narration: "", ending: { title: "Best Friends!", emoji: "💚", message: "Lily happily shared her lunch with Zara! Sharing makes friendships stronger. Zara had the best first day ever!" } },
      honest_end:      { id: "honest_end",      bg: "from-blue-50 to-blue-100",    character: "💙", narration: "", ending: { title: "Honest & Brave!", emoji: "💙", message: "Zara said sorry and helped clean the paint. The teacher said she was the most responsible student! Being honest feels great." } },
      blame_end:       { id: "blame_end",       bg: "from-gray-50 to-gray-100",    character: "😟", narration: "", ending: { title: "Honesty is Best", emoji: "😟", message: "Zara pretended it wasn't her, but felt terrible all day. She learned that honesty — even when it's hard — always feels better in the end." } },
      laugh_end:       { id: "laugh_end",       bg: "from-yellow-50 to-yellow-100",character: "😂", narration: "", ending: { title: "Best Day Ever!", emoji: "😂", message: "Zara and Maya laughed so much! Laughter makes mistakes easier. They cleaned up together and became the best of friends!" } },
      brave_end:       { id: "brave_end",       bg: "from-orange-50 to-amber-100", character: "🦸", narration: "", ending: { title: "Super Brave!", emoji: "🦸", message: "The teacher put a plaster on Zara's knee and gave her a sticker for being so brave. Asking for help is always the right choice!" } },
      okay_end:        { id: "okay_end",        bg: "from-pink-50 to-pink-100",    character: "🌸", narration: "", ending: { title: "Mum to the Rescue!", emoji: "🌸", message: "Mum came and helped! It's always okay to need comfort. Zara felt better quickly and had a lovely day after." } },
      tough_end:       { id: "tough_end",       bg: "from-teal-50 to-teal-100",    character: "💪", narration: "", ending: { title: "Tough Cookie!", emoji: "💪", message: "Zara was brave and carried on! Though next time, letting a teacher know about injuries is always the safest thing." } },
      responsible_end: { id: "responsible_end", bg: "from-green-50 to-green-100",  character: "📚", narration: "", ending: { title: "Star Student!", emoji: "📚", message: "Zara did her homework first! It felt amazing to finish. She watched TV guilt-free and went to bed feeling very proud of herself." } },
      late_end:        { id: "late_end",        bg: "from-gray-50 to-gray-100",    character: "😓", narration: "", ending: { title: "Lesson Learned", emoji: "😓", message: "Zara watched TV but then was too tired for homework! She learned that responsibilities come first, then fun. Tomorrow will be better!" } },
      teamwork_end:    { id: "teamwork_end",    bg: "from-purple-50 to-purple-100",character: "🤝", narration: "", ending: { title: "Teamwork!", emoji: "🤝", message: "Mum and Zara did the homework together! Asking for help when you need it is a superpower. Zara understood everything perfectly." } },
      proud_end:       { id: "proud_end",       bg: "from-yellow-50 to-amber-100", character: "❤️", narration: "", ending: { title: "Amazing Zara!", emoji: "❤️", message: "Mum and Dad were SO proud! Zara's first day was full of bravery, kindness, and smart choices. She couldn't wait for day two!" } },
      teacher:         { id: "teacher",         bg: "from-blue-50 to-blue-100",    character: "👩‍🏫", narration: "", ending: { title: "Well Done!", emoji: "👩‍🏫", message: "The teacher sorted out the argument. Zara learned that adults are there to help when things get tricky. Great decision!" } },
      playground:      { id: "playground",      bg: "from-green-50 to-green-100",  character: "🌿", narration: "", ending: { title: "A Peaceful Day", emoji: "🌿", message: "Zara played alone at break but that's okay too! Tomorrow she decided she would be braver and try talking to someone new." } },
      copy:            { id: "copy",            bg: "from-red-50 to-red-100",      character: "😕", narration: "", ending: { title: "Honesty Matters", emoji: "😕", message: "Zara copied but still didn't understand. Next time she'll put her hand up — teachers always love questions!" } },
      skip:            { id: "skip",            bg: "from-gray-50 to-gray-100",    character: "✏️", narration: "", ending: { title: "Try Next Time!", emoji: "✏️", message: "Zara left it blank. It's always better to ask than to give up! Raise your hand — you're smarter than you think." } },
    },
  },
];

export default function StoryAdventureGame() {
  const [storyIdx, setStoryIdx] = useState(0);
  const [sceneId, setSceneId]   = useState<string | null>(null);
  const [score, setScore]       = useState(0);
  const [history, setHistory]   = useState<string[]>([]);
  const [chosen, setChosen]     = useState<string | null>(null);

  const story = STORIES[storyIdx];
  const scene = sceneId ? story.scenes[sceneId] : null;

  function start(idx = storyIdx) {
    setStoryIdx(idx);
    setSceneId("start");
    setScore(0);
    setHistory([]);
    setChosen(null);
  }

  function choose(choice: Choice) {
    if (chosen) return;
    setChosen(choice.next);
    setScore((s) => s + choice.points);
    setHistory((h) => [...h, sceneId!]);
    setTimeout(() => {
      setSceneId(choice.next);
      setChosen(null);
    }, 700);
  }

  function goBack() {
    if (history.length === 0) return;
    const prev = history[history.length - 1];
    setHistory((h) => h.slice(0, -1));
    setSceneId(prev);
    setChosen(null);
  }

  // ── Home screen ─────────────────────────────────────────────────────────────
  if (!sceneId) return (
    <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-6 max-w-lg mx-auto text-center">
      <h2 className="text-2xl font-extrabold text-indigo-700 mb-1">📖 Story Adventure</h2>
      <p className="text-gray-500 text-sm mb-6">Make choices and shape the story!</p>
      <div className="space-y-3">
        {STORIES.map((s, i) => (
          <button key={i} onClick={() => start(i)}
            className="w-full bg-white rounded-2xl border-2 border-indigo-200 p-4 text-left hover:border-indigo-400 hover:bg-indigo-50 transition-all group">
            <div className="flex items-center gap-3">
              <span className="text-4xl">{s.emoji}</span>
              <div>
                <p className="font-extrabold text-gray-800 group-hover:text-indigo-700">{s.title}</p>
                <p className="text-xs text-gray-500">{s.description}</p>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );

  if (!scene) return null;

  // ── Ending screen ────────────────────────────────────────────────────────────
  if (scene.ending) return (
    <div className={`bg-gradient-to-br ${scene.bg} rounded-2xl p-6 max-w-lg mx-auto text-center`}>
      <div className="text-6xl mb-3">{scene.ending.emoji}</div>
      <h3 className="text-2xl font-extrabold text-gray-800 mb-2">{scene.ending.title}</h3>
      <p className="text-gray-600 mb-4 leading-relaxed">{scene.ending.message}</p>
      <div className="bg-white/70 rounded-xl px-4 py-2 inline-block mb-4">
        <span className="text-gray-500 text-sm">Kindness Score: </span>
        <span className="font-extrabold text-indigo-600 text-xl">{score}</span>
        <span className="text-gray-400 text-sm"> / 50</span>
      </div>
      <div className="flex gap-3 justify-center mt-2">
        <button onClick={() => start(storyIdx)} className="px-5 py-2 bg-indigo-500 text-white rounded-full font-bold hover:bg-indigo-600">
          Try Again 🔄
        </button>
        <button onClick={() => setSceneId(null)} className="px-5 py-2 bg-white border border-indigo-200 text-indigo-600 rounded-full font-bold hover:bg-indigo-50">
          All Stories 📚
        </button>
      </div>
    </div>
  );

  // ── Scene ────────────────────────────────────────────────────────────────────
  return (
    <div className={`bg-gradient-to-br ${scene.bg} rounded-2xl p-5 max-w-lg mx-auto`}>
      {/* Header */}
      <div className="flex items-center gap-2 mb-3">
        {history.length > 0 && (
          <button onClick={goBack} className="text-xs bg-white/80 px-2 py-1 rounded-lg text-gray-500 hover:bg-white">← Back</button>
        )}
        <span className="text-sm font-bold text-gray-600 flex-1">{story.title}</span>
        <span className="text-xs bg-white/80 rounded-xl px-3 py-1 text-indigo-600 font-bold">⭐ {score}</span>
      </div>

      {/* Character & narration */}
      <div className="bg-white/80 rounded-2xl p-5 mb-4 shadow-sm">
        <div className="text-5xl text-center mb-3">{scene.character}</div>
        <p className="text-gray-700 leading-relaxed text-sm text-center">{scene.narration}</p>
      </div>

      {/* Choices */}
      {scene.choices && (
        <div className="space-y-2">
          <p className="text-xs text-gray-500 text-center mb-2 font-medium">What should Zara do?</p>
          {scene.choices.map((choice, i) => (
            <button
              key={i}
              onClick={() => choose(choice)}
              disabled={!!chosen}
              className={`w-full flex items-center gap-3 p-3 rounded-xl border-2 text-left transition-all font-semibold text-sm
                ${chosen === choice.next ? "bg-indigo-500 text-white border-indigo-500 scale-98" :
                  chosen ? "opacity-40 bg-white border-gray-200" :
                  "bg-white border-gray-200 hover:border-indigo-300 hover:bg-indigo-50 hover:scale-[1.01] active:scale-99"}
              `}
            >
              <span className="text-2xl w-8 text-center flex-shrink-0">{choice.emoji}</span>
              <span>{choice.text}</span>
            </button>
          ))}
        </div>
      )}

      <p className="text-center text-xs text-gray-400 mt-3">Chapter {history.length + 1}</p>
    </div>
  );
}
