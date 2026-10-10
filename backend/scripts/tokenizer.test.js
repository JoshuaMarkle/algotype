import { describe, expect, it } from "vitest";

import { countTypableLines, tokenizeCode } from "./tokenizer.js";

const typable = (line) =>
  line.filter((t) => !t.skip && t.type !== "newline").map((t) => t.content);
const fullySkipped = (line) => line.every((t) => t.skip);

describe("tokenizeCode", () => {
  it("fully skips indented comment-only lines (no indent, no newline)", () => {
    const lines = tokenizeCode(
      "def f():\n    # note\n\t\t// other\n    return 1\n",
      "python",
    );
    expect(lines[1].length).toBeGreaterThan(0);
    expect(fullySkipped(lines[1])).toBe(true);
    expect(lines[1].some((t) => t.type === "newline")).toBe(false);
    expect(typable(lines[3])).toEqual(["return", " ", "1"]);
  });

  it("does the same for C-style line comments", () => {
    const lines = tokenizeCode(
      "int main() {\n    // a\n    // b\n    return 0;\n}\n",
      "cpp",
    );
    expect(fullySkipped(lines[1])).toBe(true);
    expect(fullySkipped(lines[2])).toBe(true);
    expect(typable(lines[3])).toEqual(["return", " ", "0", ";"]);
  });

  it("keeps a trailing comment after the newline token", () => {
    const [line] = tokenizeCode("x = 1  # set x", "python");
    expect(typable(line)).toEqual(["x", " ", "=", " ", "1"]);
    const nl = line.findIndex((t) => t.type === "newline");
    expect(line.slice(nl + 1).every((t) => t.skip)).toBe(true);
  });

  it("skips multi-line Python docstrings", () => {
    const code = [
      "def f():",
      '    """Summary.',
      "",
      '    More text with "quotes".',
      '    """',
      "    return '''not a docstring'''",
      "r'''raw",
      "doc'''",
      "x = 1",
    ].join("\n");
    const lines = tokenizeCode(code, "python");
    expect(fullySkipped(lines[1])).toBe(true);
    expect(lines[2]).toEqual([]);
    expect(fullySkipped(lines[3])).toBe(true);
    expect(fullySkipped(lines[4])).toBe(true);
    expect(typable(lines[5])[0]).toBe("return");
    expect(fullySkipped(lines[6])).toBe(true);
    expect(fullySkipped(lines[7])).toBe(true);
    expect(typable(lines[8])).toEqual(["x", " ", "=", " ", "1"]);
  });

  it("skips one-line docstrings but not strings used in expressions", () => {
    const lines = tokenizeCode(
      '    """One line."""\n    """a""" + b\n    s = """\n    text\n    """',
      "python",
    );
    expect(fullySkipped(lines[0])).toBe(true);
    expect(fullySkipped(lines[1])).toBe(false);
    // An assigned triple-quoted string is code the user types
    expect(fullySkipped(lines[2])).toBe(false);
  });

  it("only treats triple quotes as docstrings in Python", () => {
    const [line] = tokenizeCode('"""x"""', "javascript");
    expect(fullySkipped(line)).toBe(false);
  });

  it("types code around inline /* */ comments", () => {
    const [line] = tokenizeCode("dfs(g, /*prev=*/-1, 0);", "cpp");
    expect(typable(line).join("")).toBe("dfs(g, -1, 0);");
    expect(line.find((t) => t.type === "comment")).toMatchObject({
      content: "/*prev=*/",
      skip: true,
    });
  });

  it("skips multi-line block comments, including one-line /** */", () => {
    const lines = tokenizeCode(
      "/**\n * Doc\n */\nint a;\n/** one */\nint b; /* tail\n more */\nint c;",
      "java",
    );
    expect(lines.slice(0, 3).every(fullySkipped)).toBe(true);
    expect(typable(lines[3]).join("")).toBe("int a;");
    expect(fullySkipped(lines[4])).toBe(true);
    // Code before a /* left open is dropped with the comment (known limit)
    expect(fullySkipped(lines[5])).toBe(true);
    expect(fullySkipped(lines[6])).toBe(true);
    expect(typable(lines[7]).join("")).toBe("int c;");
  });

  it("does not treat /* in Python as a block comment", () => {
    const [line] = tokenizeCode('glob = "*.py/*"', "python");
    expect(fullySkipped(line)).toBe(false);
  });
});

describe("countTypableLines", () => {
  it("counts only lines with something to type", () => {
    const lines = tokenizeCode(
      '"""Module doc."""\n\n# comment\ndef f():\n    # inner\n    return 1\n',
      "python",
    );
    expect(lines).toHaveLength(6);
    expect(countTypableLines(lines)).toBe(2);
  });

  it("ignores lines holding only an indent and a newline", () => {
    expect(
      countTypableLines([
        [
          { type: "space", content: "    " },
          { type: "newline", content: "↵" },
          { type: "comment", content: "# x", skip: true },
        ],
        [
          { type: "plain", content: "a", wlength: 1 },
          { type: "newline", content: "↵" },
        ],
      ]),
    ).toBe(1);
  });
});
