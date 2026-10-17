// Every scene length, timing beat (in seconds, relative to the scene's own
// start) and every word of on-screen copy. Re-time or re-word here; scene
// code only reads these values.

export const storyboard = {
  // 1. Title: the loop point. Opens on the white frame the ending leaves,
  // dips to the site's black while the wordmark rises.
  title: {
    length: 4.5,
    beats: {
      whiteToBlack: [0, 0.6],
      markIn: 0.2,
      wordmarkIn: 0.3,
      subtitleIn: 1.3,
      // hold ≥ 1 s after the subtitle settles
      fadeOut: [3.8, 4.5],
    },
    copy: {
      wordmark: "AlgoType",
      subtitle: "Typing practice for programmers.",
    },
  },

  // 2. Typing test: real snippet (src/data/quicksort.json on the site),
  // typed live with one typo that flashes red and is fixed.
  typing: {
    length: 13.6,
    beats: {
      titleIn: 0.2,
      titleOut: [2.0, 2.5],
      editorIn: [2.4, 3.0],
      typingStart: 3.4,
      typingEnd: 11.0,
      // the typo: wrong keys at this point in the snippet, then backspaced
      typo: { atChar: 96, wrong: "lne", fixAfter: 0.35 },
      // hold 1 s after the last character, then fade
      fadeOut: [12.4, 13.6],
    },
    copy: {
      title: "Type real code.",
      subtitle: "Real solutions in Python, C++, Java and JavaScript.",
      breadcrumb: ["Files", "Python", "Quicksort"],
      lines: 7, // first function of the snippet
    },
    // Live stats shown above the editor. The clock is compressed for the
    // video, so these are the values a ~110 WPM typist would see.
    liveStats: {
      wpm: [0, 74, 96, 104, 108, 111, 112, 112],
      acc: [100, 100, 100, 98, 98, 98, 98, 98],
    },
  },

  // 3. Test results: the end-of-test screen, built in like the site does it
  results: {
    length: 9.5,
    beats: {
      titleIn: 0.2,
      titleOut: [2.0, 2.5],
      chartDraw: [2.6, 4.2],
      statsCount: [3.0, 4.5],
      // hold 1 s
      keyErrorsIn: [5.5, 6.3],
      // hold 1 s
      badgeIn: 7.3,
      fadeOut: [8.8, 9.5],
    },
    copy: {
      title: "Every keystroke, measured.",
      subtitle: "Your results the moment you finish.",
      stats: [
        { label: "WPM", value: 112, accent: true },
        { label: "RAW", value: 118 },
        { label: "ACC", value: 98, suffix: "%" },
        { label: "CONSISTENCY", value: 84, suffix: "%" },
      ],
      chartTitle: "WPM over time",
      keyErrorsTitle: "Errors by key",
      keyErrors: [
        { key: "[", count: 4 },
        { key: "_", count: 3 },
        { key: "=", count: 2 },
        { key: ")", count: 1 },
      ],
      badge: "Personal best",
    },
  },

  // Transition: the scene is gone, one control zooms into the centre,
  // switches, and flies back to its place in the next scene.
  controlSwitch: {
    length: 3.0,
    beats: {
      controlIn: [0.0, 0.5],
      switch: [0.9, 1.3],
      // hold
      flyBack: [1.9, 2.7],
      nextSceneIn: [2.3, 3.0],
    },
    copy: {
      options: ["Test", "Stats"],
    },
  },

  // 4. Account statistics: accelerating montage → 4×4 grid → hero zoom
  account: {
    length: 13.5,
    beats: {
      titleIn: 0.2,
      titleOut: [2.0, 2.5],
      montageStart: 2.6,
      // each cut's length; they shrink toward the centre as they speed up
      montageCuts: [1.0, 0.8, 0.65, 0.5, 0.4, 0.32, 0.26, 0.22, 0.2, 0.2],
      montageScale: [1.0, 0.6],
      burst: 0.6, // after the last cut: charts fly out into the grid
      gridHold: 1.0,
      zoom: 1.0, // camera into the hero chart
      heroLineIn: 0.2, // after the zoom lands
      heroHold: 2.0,
      fadeToWhite: 0.6,
    },
    copy: {
      title: "Every test, remembered.",
      subtitle: "See your progress from all angles.",
      hero: "Watch yourself get faster.",
    },
  },

  // 5. End: wordmark on white, a short glitch, then a blank white frame
  end: {
    length: 4.0,
    beats: {
      wordmarkIn: 0.2,
      glitch: [2.8, 3.25],
      // blank white to the end, which loops into the title's first frame
    },
    copy: {
      wordmark: "AlgoType",
    },
  },
} as const;

export const sceneOrder = [
  "title",
  "typing",
  "results",
  "controlSwitch",
  "account",
  "end",
] as const;

export type SceneName = (typeof sceneOrder)[number];

export const totalSeconds = sceneOrder.reduce(
  (sum, name) => sum + storyboard[name].length,
  0,
);
