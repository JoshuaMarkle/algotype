import Prism from "prismjs";

// Shared by the Node scripts (backend/scripts/tokenizer.js loads Prism
// languages on demand) and the browser (syntax drills import the Prism
// language components they need), so this file must not use Node APIs

// A line that opens a Python docstring: optional string prefix, then """ or '''
const DOCSTRING_OPEN = /^\s*[rRuU]?("""|''')/;

// Tokenize source code into one token array per line. The Prism language
// must already be loaded
export function tokenizeCode(code, language) {
  if (!Prism.languages[language]) {
    throw new Error(`Prism language not loaded: ${language}`);
  }

  const lines = code.split("\n");
  const commentLine = (line) => [
    { type: "comment", content: line, skip: true },
  ];

  let inBlockComment = false;
  let docstringQuote = null; // """ or ''' while inside a Python docstring
  const tokenLines = [];

  for (const line of lines) {
    if (line.trim() === "") {
      tokenLines.push([]);
      continue;
    }

    // Python docstrings span lines, so Prism (which sees one line at a
    // time) cannot recognise them. Skip them like block comments
    if (docstringQuote !== null) {
      tokenLines.push(commentLine(line));
      if (line.includes(docstringQuote)) docstringQuote = null;
      continue;
    }

    if (language === "python") {
      const match = line.match(DOCSTRING_OPEN);
      if (match) {
        const quote = match[1];
        const rest = line.slice(match[0].length);
        const closeIdx = rest.indexOf(quote);
        const after = closeIdx === -1 ? "" : rest.slice(closeIdx + 3).trim();

        // Only a string that is the whole statement is a docstring, not
        // e.g. """a""" + b
        if (closeIdx === -1 || after === "" || after.startsWith("#")) {
          if (closeIdx === -1) docstringQuote = quote;
          tokenLines.push(commentLine(line));
          continue;
        }
      }
    }

    const openIdx = line.indexOf("/*");
    const closeIdx = line.indexOf("*/");

    if (inBlockComment) {
      tokenLines.push(commentLine(line));
      if (closeIdx !== -1 && (openIdx === -1 || closeIdx > openIdx)) {
        inBlockComment = false;
      }
      continue;
    }

    // Only a /* left open starts a skipped block. A comment closed on the
    // same line (f(/*arg=*/1)) is left to Prism and skipped as a token
    const opensBlock =
      language !== "python" &&
      openIdx !== -1 &&
      line.lastIndexOf("/*") > line.lastIndexOf("*/");
    if (opensBlock) {
      inBlockComment = true;
      tokenLines.push(commentLine(line));
      continue;
    }

    const rawTokens = Prism.tokenize(line, Prism.languages[language]);
    const normalized = normalizeTokens(rawTokens);
    const withWlengths = addWlengths(normalized);

    // Nothing to type on this line (only spaces and comments): skip all of
    // it, including the indentation, and add no newline token
    const nothingToType = withWlengths.every(
      (t) => t.skip || t.type === "space",
    );

    if (nothingToType) {
      tokenLines.push(withWlengths.map((t) => ({ ...t, skip: true })));
    } else {
      tokenLines.push(insertNewlineToken(withWlengths));
    }
  }

  if (tokenLines.length && tokenLines.at(-1).length === 0) tokenLines.pop();

  return tokenLines;
}

// Number of lines the user actually types (blank and comment-only lines
// are skipped by the typing engine, so they don't count)
export function countTypableLines(tokenLines) {
  return tokenLines.filter((line) =>
    line.some(
      (t) =>
        !t.skip &&
        t.type !== "space" &&
        t.type !== "newline" &&
        t.content?.length > 0,
    ),
  ).length;
}

// --- Helper functions ---

function normalizeTokens(tokens) {
  const out = [];

  for (const token of tokens) {
    let content, type;
    if (typeof token === "string") {
      content = token;
      type = "plain";
    } else {
      content = extractContent(token.content);
      type = token.type || "plain";
    }

    if (typeof content !== "string") continue;

    if (type === "comment") {
      out.push({ type, content, skip: true });
      continue;
    }

    let buf = "",
      bufIsSpace = null;
    for (const ch of content) {
      const isSpace = /\s/.test(ch);
      if (buf === "") {
        buf = ch;
        bufIsSpace = isSpace;
      } else if (isSpace === bufIsSpace) {
        buf += ch;
      } else {
        out.push(makeToken(buf, type, bufIsSpace));
        buf = ch;
        bufIsSpace = isSpace;
      }
    }
    if (buf) out.push(makeToken(buf, type, bufIsSpace));
  }

  let firstReal = -1,
    lastReal = -1;
  for (let i = 0; i < out.length; i++) {
    if (!out[i].skip && out[i].type !== "space") {
      firstReal = i;
      break;
    }
  }
  for (let j = out.length - 1; j >= 0; j--) {
    if (!out[j].skip && out[j].type !== "space") {
      lastReal = j;
      break;
    }
  }

  if (firstReal !== -1) {
    for (let i = 0; i < firstReal; ++i)
      if (out[i].type === "space") out[i].skip = true;
    for (let i = lastReal + 1; i < out.length; ++i)
      if (out[i].type === "space") out[i].skip = true;
  }

  return out;
}

// Extract the content from the token
function extractContent(input) {
  if (typeof input === "string") return input;
  if (Array.isArray(input)) return input.map(extractContent).join("");
  if (typeof input === "object" && input !== null && "content" in input)
    return extractContent(input.content);
  return "";
}

function makeToken(content, baseType, isSpace) {
  return { type: isSpace ? "space" : baseType, content };
}

function addWlengths(tokens) {
  let count = 0;
  for (let i = tokens.length - 1; i >= 0; i--) {
    const t = tokens[i];
    if (t.skip || t.type === "space") {
      count = 0;
    } else {
      t.wlength = ++count;
    }
  }
  return tokens;
}

function insertNewlineToken(tokens) {
  const hasRealContent = tokens.some((t) => !t.skip);
  if (!hasRealContent) return tokens;

  let insertAt = tokens.length;
  for (let i = tokens.length - 1; i >= 0; i--) {
    if (!tokens[i].skip) {
      insertAt = i + 1;
      break;
    }
  }

  const newlineToken = { type: "newline", content: "↵" };
  tokens.splice(insertAt, 0, newlineToken);
  return tokens;
}
