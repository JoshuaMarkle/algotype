// Every scene length, timing beat (in seconds, relative to the scene's own
// start) and every word of on-screen copy. Re-time or re-word here; scene
// code only reads these values.

export const storyboard = {
  // 1. Title: the loop point. Opens on the white frame the ending leaves,
  // dips to the site's black while the wordmark rises over the homepage's
  // hero grid.
  title: {
    length: 4.5,
    beats: {
      whiteToBlack: [0, 0.7],
      gridIn: [0.3, 1.5],
      wordmarkIn: 0.45,
      subtitleIn: 1.3,
      // hold ≥ 1 s after the subtitle settles
      fadeOut: [3.8, 4.5],
    },
    copy: {
      wordmark: "AlgoType",
      subtitle: "Typing practice for programmers.",
    },
  },

  // 2. Typing test: the homepage's CodeBox demo, typing the site's own
  // quicksort (src/data/quicksort.json), with the site's keyboard under it.
  typing: {
    length: 13.6,
    beats: {
      titleIn: 0.2,
      titleOut: [2.0, 2.5],
      editorIn: [2.5, 3.1],
      keyboardIn: [2.7, 3.3],
      typingStart: 3.5,
      typingEnd: 12.0,
      // gentle push-in while typing
      cameraPush: [3.0, 12.6],
      // wrong keys at this keystroke ("par|tition"), a pause, then backspaced
      // at the CodeBox demo's own rhythm
      typo: { atKey: 112, keys: "wqe", pause: 0.3, backspaceEvery: 0.17 },
      // hold 1 s after the last character, then fade
      fadeOut: [13.0, 13.6],
    },
    copy: {
      title: "Type real code.",
      // the site's CHALLENGE_LANGUAGES (src/lib/seo.js)
      subtitle: "Real solutions in Python, C++, Java, JavaScript and Rust.",
      file: "quicksort.py",
      lines: 8, // the whole quick_sort function
      showKeyboard: true,
    },
    // Live stats in the CodeBox header, refreshed every 0.5 s like the
    // site's demo. The clock is compressed for the video, so these are the
    // values a ~110 WPM typist would see.
    liveStats: {
      wpm: [0, 58, 79, 91, 98, 103, 104, 99, 104, 107, 109, 110, 111, 112, 112, 112, 112],
      acc: [100, 100, 100, 100, 100, 100, 100, 97, 97, 97, 98, 98, 98, 98, 98, 98, 98],
    },
  },

  // 3. Test results: the site's TypingResults screen (chart on top, light
  // mono numbers with dot sub-labels), plus raw, consistency and per-key
  // errors in the same style.
  results: {
    length: 9.2,
    beats: {
      titleIn: 0.2,
      titleOut: [2.0, 2.5],
      chartDraw: [2.6, 4.0],
      statsCount: [2.9, 4.3],
      statStagger: 0.1,
      // hold 1 s
      keyErrorsIn: [5.3, 6.1],
      // hold 1 s
      badgeIn: 7.1,
      fadeOut: [8.6, 9.2],
    },
    copy: {
      title: "Every keystroke, measured.",
      subtitle: "Your results the moment you finish.",
      wpm: { value: 112, max: 121, min: 84 },
      raw: { value: 118 },
      acc: { value: 98, correct: 217, incorrect: 3 },
      consistency: { value: 84 },
      // the typing scene's typo: three wrong keys where "tit" was expected
      keyErrors: { T: 2, I: 1 },
      keyErrorsTitle: "Errors by key",
      badge: "Personal best",
    },
    // WPM samples, one a second, like the site's results series
    series: [62, 88, 97, 104, 109, 106, 112, 115, 113, 118, 121, 117, 114, 116, 112],
  },

  // Transition: the scene is gone, one control zooms into the centre,
  // switches, and flies back to its place at the top of the next scene.
  controlSwitch: {
    length: 2.8,
    beats: {
      controlIn: [0.1, 0.6],
      switch: [1.0, 1.35],
      // hold
      flyBack: [1.9, 2.8],
    },
    copy: {
      options: ["Last test", "All tests"],
    },
  },

  // 4. Account statistics: accelerating montage → 4×4 grid → hero zoom
  account: {
    length: 13.2,
    beats: {
      titleIn: 0.3,
      titleOut: [2.1, 2.6],
      montageStart: 2.7,
      // each cut's length; they shrink toward the centre as they speed up
      montageCuts: [1.0, 0.8, 0.65, 0.5, 0.4, 0.32, 0.26, 0.22, 0.2, 0.2],
      montageScale: [1.65, 1.0],
      burst: 0.6, // after the last cut: every chart flies out into the grid
      gridHold: 1.0,
      zoom: 1.0, // camera into the hero chart
      headlineAfterZoom: 0.15,
      badgeAfterZoom: 0.6,
      heroHold: 2.0,
      fadeToWhite: 0.6,
    },
    copy: {
      title: "Every test, remembered.",
      subtitle: "See your progress from all angles.",
      hero: "Watch yourself get faster.",
      // the results scene's 112 wpm, now the last point of the history
      heroBadge: "New best · 112 wpm",
    },
    // Grid order (row by row). `hero` is the zoom target; `montage` lists
    // the charts shown full-size in the montage, in order. It opens on the
    // account page's own StatBlocks and PastTestsTable while cuts are long
    // enough to read.
    grid: [
      "bests",
      "averages",
      "heatmap",
      "accuracy",
      "bigrams",
      "wpmHistory",
      "percentile",
      "recent",
      "weekly",
      "rawVsNet",
      "consistency",
      "keys",
      "streak",
      "slowKeys",
      "perDay",
      "accByLang",
    ],
    hero: "wpmHistory",
    montage: [
      "averages",
      "bests",
      "recent",
      "heatmap",
      "accuracy",
      "bigrams",
      "percentile",
      "consistency",
      "weekly",
      "streak",
    ],
    charts: {
      wpmHistory: "WPM history",
      averages: "Averages",
      recent: "Recent tests",
      bests: "Personal bests by language",
      accuracy: "Accuracy",
      heatmap: "Practice this year",
      slowKeys: "Slowest keys",
      bigrams: "Slowest symbol pairs",
      weekly: "Time practised per week",
      // 112 wpm is above every real AlgoType test so far (see data/fake.ts)
      percentile: "Faster than 99% of typists",
      rawVsNet: "Raw vs net WPM",
      consistency: "Consistency",
      keys: "Errors by key",
      perDay: "Tests per day",
      accByLang: "Accuracy by language",
      streak: "Current streak",
    },
  },

  // 5. End: wordmark on white, a short glitch, then a blank white frame
  end: {
    length: 4.0,
    beats: {
      wordmarkIn: 0.2,
      glitch: [2.6, 3.05],
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
export type ChartId = keyof typeof storyboard.account.charts;

export const totalSeconds = sceneOrder.reduce(
  (sum, name) => sum + storyboard[name].length,
  0,
);
