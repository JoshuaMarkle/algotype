import Prism from "prismjs";
import loadLanguages from "prismjs/components/index.js";

import {
  countTypableLines,
  tokenizeCode as tokenizeLoaded,
} from "../../src/lib/tokenizer.js";

export { countTypableLines };

// Tokenize source code into one token array per line, loading the Prism
// language first (the tokenizer itself lives in src/lib so the browser can
// use it too)
export function tokenizeCode(code, language) {
  if (!Prism.languages[language]) loadLanguages([language]);
  return tokenizeLoaded(code, language);
}
