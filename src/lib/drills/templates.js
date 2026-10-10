// Syntax drill templates. Each template takes a small helper object (random
// picks from name pools) and returns one short snippet of source code.
// Snippets use 4-space indentation; leading whitespace is skipped by the
// typing engine, so only the code itself is typed

// --- Name pools ---
const NUMS = ["nums", "values", "items", "scores", "prices", "costs", "data"];
const WORDS = ["words", "names", "tokens", "keys", "labels", "lines"];
const VARS = ["total", "count", "result", "best", "sum", "score", "acc"];
const LIMITS = ["n", "size", "limit", "len", "steps", "k"];
const TARGETS = ["target", "goal", "key", "value", "query"];
const FUNCS = [
  "solve",
  "compute",
  "process",
  "evaluate",
  "countPairs",
  "maxProfit",
  "findPeak",
  "minCost",
  "search",
  "update",
];
const PREDICATES = ["isValid", "isEmpty", "hasCycle", "canReach", "isSorted"];
const CLASSES = [
  "Point",
  "Interval",
  "Account",
  "Order",
  "Edge",
  "Cell",
  "Task",
  "Player",
];
const CONTAINERS = ["Stack", "Queue", "Cache", "Buffer", "Inventory"];

// snake_case for Python names (countPairs -> count_pairs)
const snake = (s) => s.replace(/[A-Z]/g, (c) => "_" + c.toLowerCase());

// --- Python ---
const python = {
  for: [
    (h) => {
      const [i, arr, acc, n] = [
        h.pick(["i", "j", "idx"]),
        h.pick(NUMS),
        h.pick(VARS),
        h.pick(LIMITS),
      ];
      return `for ${i} in range(${n}):\n    ${acc} += ${arr}[${i}]`;
    },
    (h) => {
      const [arr, acc] = [h.pick(NUMS), h.pick(VARS)];
      const k = h.int(1, 9);
      return `for x in ${arr}:\n    if x > ${k}:\n        ${acc} += x`;
    },
    (h) => {
      const arr = h.pick(NUMS);
      return `for i, x in enumerate(${arr}):\n    seen[x] = i`;
    },
    (h) => {
      const [a, b] = h.distinct(NUMS, 2);
      return `for x, y in zip(${a}, ${b}):\n    out.append(x * y)`;
    },
    (h) => {
      const arr = h.pick(NUMS);
      return `for i in range(len(${arr}) - 1, -1, -1):\n    print(${arr}[i])`;
    },
    (h) => {
      const [n, acc] = [h.pick(LIMITS), h.pick(VARS)];
      return `for i in range(${n}):\n    for j in range(i + 1, ${n}):\n        ${acc} += grid[i][j]`;
    },
    (h) => {
      const d = h.pick(["counts", "freq", "seen", "memo"]);
      return `for key, val in ${d}.items():\n    print(f"{key}: {val}")`;
    },
  ],
  while: [
    (h) => {
      const [arr, t] = [h.pick(NUMS), h.pick(TARGETS)];
      return `while lo < hi:\n    mid = (lo + hi) // 2\n    if ${arr}[mid] < ${t}:\n        lo = mid + 1\n    else:\n        hi = mid`;
    },
    () =>
      `while queue:\n    node = queue.popleft()\n    for nxt in graph[node]:\n        queue.append(nxt)`,
    (h) => {
      const acc = h.pick(VARS);
      return `while n > 0:\n    ${acc} += n % 10\n    n //= 10`;
    },
    () => `while stack and stack[-1] < x:\n    stack.pop()\nstack.append(x)`,
    (h) => {
      const arr = h.pick(NUMS);
      return `i, j = 0, len(${arr}) - 1\nwhile i < j:\n    ${arr}[i], ${arr}[j] = ${arr}[j], ${arr}[i]\n    i += 1\n    j -= 1`;
    },
  ],
  if: [
    () =>
      `if x > 0:\n    sign = 1\nelif x < 0:\n    sign = -1\nelse:\n    sign = 0`,
    (h) => {
      const v = h.pick(VARS);
      return `${v} = a if a > b else b`;
    },
    (h) => {
      const d = h.pick(["seen", "last", "index"]);
      return `if ch in ${d} and ${d}[ch] >= start:\n    start = ${d}[ch] + 1`;
    },
    (h) => {
      const arr = h.pick(NUMS);
      return `if not ${arr}:\n    print("empty")\nelif len(${arr}) == 1:\n    print(${arr}[0])`;
    },
    (h) => {
      const k = h.int(2, 9);
      return `if x % ${k} == 0 and x != 0:\n    hits += 1\nelse:\n    misses += 1`;
    },
    () =>
      `match cmd:\n    case "push":\n        stack.append(arg)\n    case "pop":\n        stack.pop()\n    case _:\n        raise ValueError(cmd)`,
  ],
  func: [
    (h) => {
      const [f, arr, acc] = [snake(h.pick(FUNCS)), h.pick(NUMS), h.pick(VARS)];
      return `def ${f}(${arr}):\n    ${acc} = 0\n    for x in ${arr}:\n        ${acc} += x\n    return ${acc}`;
    },
    (h) => {
      const [f, arr] = [snake(h.pick(FUNCS)), h.pick(NUMS)];
      return `def ${f}(${arr}: list[int], k: int) -> int:\n    return max(${arr}[:k], default=0)`;
    },
    (h) => {
      const f = snake(h.pick(PREDICATES));
      return `def ${f}(s: str) -> bool:\n    return len(s) > 0 and s[0] != "#"`;
    },
    () =>
      `def fib(n):\n    if n < 2:\n        return n\n    return fib(n - 1) + fib(n - 2)`,
    (h) => {
      const f = snake(h.pick(FUNCS));
      return `def ${f}(*args, **kwargs):\n    print(args, kwargs)\n    return len(args)`;
    },
    (h) => {
      const f = snake(h.pick(FUNCS));
      return `def ${f}(self, i, j):\n    self.data[i], self.data[j] = self.data[j], self.data[i]`;
    },
  ],
  class: [
    (h) => {
      const c = h.pick(CLASSES);
      return `class ${c}:\n    def __init__(self, x, y):\n        self.x = x\n        self.y = y`;
    },
    (h) => {
      const c = h.pick(CONTAINERS);
      return `class ${c}:\n    def __init__(self):\n        self.items = []\n\n    def push(self, x):\n        self.items.append(x)\n\n    def pop(self):\n        return self.items.pop()`;
    },
    (h) => {
      const c = h.pick(CLASSES);
      return `@dataclass\nclass ${c}:\n    x: int\n    y: int = 0`;
    },
    (h) => {
      const c = h.pick(CLASSES);
      return `class ${c}(Base):\n    def __init__(self, name):\n        super().__init__()\n        self.name = name\n\n    def __repr__(self):\n        return f"${c}({self.name})"`;
    },
  ],
  idiom: [
    (h) => {
      const arr = h.pick(NUMS);
      return `squares = [x * x for x in ${arr}]`;
    },
    (h) => {
      const arr = h.pick(NUMS);
      return `evens = [x for x in ${arr} if x % 2 == 0]`;
    },
    (h) => {
      const w = h.pick(WORDS);
      return `index = {w: i for i, w in enumerate(${w})}`;
    },
    () => `pairs.sort(key=lambda p: (p[0], -p[1]))`,
    () => `with open("input.txt") as f:\n    lines = f.read().splitlines()`,
    (h) => {
      const arr = h.pick(NUMS);
      return `freq = defaultdict(int)\nfor x in ${arr}:\n    freq[x] += 1`;
    },
    () => `a, b = b, a`,
    (h) => {
      const arr = h.pick(NUMS);
      return `total = sum(x for x in ${arr} if x > 0)`;
    },
    () => `try:\n    value = int(text)\nexcept ValueError:\n    value = 0`,
    (h) => {
      const w = h.pick(WORDS);
      return `print(", ".join(sorted(${w})))`;
    },
  ],
};

// --- C++ ---
const cpp = {
  for: [
    (h) => {
      const [arr, acc, n] = [h.pick(NUMS), h.pick(VARS), h.pick(LIMITS)];
      return `for (int i = 0; i < ${n}; i++) {\n    ${acc} += ${arr}[i];\n}`;
    },
    (h) => {
      const arr = h.pick(NUMS);
      return `for (int i = ${arr}.size() - 1; i >= 0; --i) {\n    cout << ${arr}[i] << endl;\n}`;
    },
    (h) => {
      const [arr, acc] = [h.pick(NUMS), h.pick(VARS)];
      return `for (const auto& x : ${arr}) {\n    ${acc} += x;\n}`;
    },
    (h) => {
      const d = h.pick(["counts", "freq", "seen", "memo"]);
      return `for (auto& [key, val] : ${d}) {\n    val *= 2;\n}`;
    },
    () =>
      `for (int i = 0; i < rows; ++i) {\n    for (int j = 0; j < cols; ++j) {\n        grid[i][j] = 0;\n    }\n}`,
    () =>
      `for (auto it = s.begin(); it != s.end(); ++it) {\n    cout << *it << " ";\n}`,
  ],
  while: [
    (h) => {
      const [arr, t] = [h.pick(NUMS), h.pick(TARGETS)];
      return `while (lo < hi) {\n    int mid = lo + (hi - lo) / 2;\n    if (${arr}[mid] < ${t}) lo = mid + 1;\n    else hi = mid;\n}`;
    },
    () =>
      `while (!q.empty()) {\n    int node = q.front();\n    q.pop();\n    for (int nxt : adj[node]) q.push(nxt);\n}`,
    (h) => {
      const acc = h.pick(VARS);
      return `while (n > 0) {\n    ${acc} += n % 10;\n    n /= 10;\n}`;
    },
    () => `do {\n    x = next[x];\n    steps++;\n} while (x != start);`,
    () =>
      `while (!st.empty() && st.top() < x) {\n    st.pop();\n}\nst.push(x);`,
  ],
  if: [
    () =>
      `if (x > 0) {\n    sign = 1;\n} else if (x < 0) {\n    sign = -1;\n} else {\n    sign = 0;\n}`,
    (h) => {
      const v = h.pick(VARS);
      return `int ${v} = a > b ? a : b;`;
    },
    (h) => {
      const d = h.pick(["seen", "last", "index"]);
      return `if (${d}.count(c) && ${d}[c] >= start) {\n    start = ${d}[c] + 1;\n}`;
    },
    () =>
      `switch (op) {\n    case '+':\n        res = a + b;\n        break;\n    case '-':\n        res = a - b;\n        break;\n    default:\n        res = 0;\n}`,
    (h) => {
      const arr = h.pick(NUMS);
      return `if (${arr}.empty()) return 0;\nif (${arr}.size() == 1) return ${arr}[0];`;
    },
    (h) => {
      const k = h.int(2, 9);
      return `if (x % ${k} == 0 && x != 0) {\n    hits++;\n} else {\n    misses++;\n}`;
    },
  ],
  func: [
    (h) => {
      const [f, arr] = [h.pick(FUNCS), h.pick(NUMS)];
      return `int ${f}(vector<int>& ${arr}, int k) {\n    int count = 0;\n    for (int x : ${arr}) {\n        if (x > k) count++;\n    }\n    return count;\n}`;
    },
    (h) => {
      const f = h.pick(PREDICATES);
      return `bool ${f}(const string& s) {\n    return !s.empty() && s[0] != '#';\n}`;
    },
    (h) => {
      const arr = h.pick(NUMS);
      return `void swapAt(vector<int>& ${arr}, int i, int j) {\n    swap(${arr}[i], ${arr}[j]);\n}`;
    },
    () =>
      `auto cmp = [](const pair<int, int>& a, const pair<int, int>& b) {\n    return a.second < b.second;\n};`,
    () =>
      `template <typename T>\nT minOf(T a, T b) {\n    return a < b ? a : b;\n}`,
    () =>
      `long long fib(int n) {\n    if (n < 2) return n;\n    return fib(n - 1) + fib(n - 2);\n}`,
  ],
  class: [
    (h) => {
      const c = h.pick(CLASSES);
      return `struct ${c} {\n    int x;\n    int y;\n};`;
    },
    () =>
      `struct ListNode {\n    int val;\n    ListNode* next;\n    ListNode(int x) : val(x), next(nullptr) {}\n};`,
    (h) => {
      const c = h.pick(CONTAINERS);
      return `class ${c} {\npublic:\n    void push(int x) {\n        data.push_back(x);\n    }\n\n    int top() const {\n        return data.back();\n    }\n\nprivate:\n    vector<int> data;\n};`;
    },
    (h) => {
      const c = h.pick(CLASSES);
      return `class ${c} {\npublic:\n    ${c}(int id) : id_(id) {}\n    int id() const { return id_; }\n\nprivate:\n    int id_;\n};`;
    },
  ],
  idiom: [
    (h) => {
      const arr = h.pick(NUMS);
      return `sort(${arr}.begin(), ${arr}.end());`;
    },
    (h) => {
      const arr = h.pick(NUMS);
      return `sort(${arr}.begin(), ${arr}.end(), greater<int>());`;
    },
    (h) => {
      const arr = h.pick(NUMS);
      return `unordered_map<int, int> freq;\nfor (int x : ${arr}) freq[x]++;`;
    },
    () => `vector<vector<int>> grid(rows, vector<int>(cols, 0));`,
    () => `priority_queue<int, vector<int>, greater<int>> pq;`,
    (h) => {
      const arr = h.pick(NUMS);
      return `int total = accumulate(${arr}.begin(), ${arr}.end(), 0);`;
    },
    (h) => {
      const [arr, t] = [h.pick(NUMS), h.pick(TARGETS)];
      return `auto it = lower_bound(${arr}.begin(), ${arr}.end(), ${t});`;
    },
    () => `pair<int, int> p = {a, b};\nauto [first, second] = p;`,
    () => `string s = to_string(n);\nreverse(s.begin(), s.end());`,
    () => `vector<int> dp(n + 1, INT_MAX);\ndp[0] = 0;`,
  ],
};

// --- Java ---
const java = {
  for: [
    (h) => {
      const [arr, acc, n] = [h.pick(NUMS), h.pick(VARS), h.pick(LIMITS)];
      return `for (int i = 0; i < ${n}; i++) {\n    ${acc} += ${arr}[i];\n}`;
    },
    (h) => {
      const [arr, acc] = [h.pick(NUMS), h.pick(VARS)];
      return `for (int x : ${arr}) {\n    ${acc} += x;\n}`;
    },
    (h) => {
      const w = h.pick(WORDS);
      return `for (String w : ${w}) {\n    count.put(w, count.getOrDefault(w, 0) + 1);\n}`;
    },
    () =>
      `for (Map.Entry<String, Integer> e : map.entrySet()) {\n    System.out.println(e.getKey() + " " + e.getValue());\n}`,
    () =>
      `for (int i = 0; i < rows; i++) {\n    for (int j = 0; j < cols; j++) {\n        grid[i][j] = 0;\n    }\n}`,
    (h) => {
      const arr = h.pick(NUMS);
      return `for (int i = ${arr}.length - 1; i >= 0; i--) {\n    System.out.println(${arr}[i]);\n}`;
    },
  ],
  while: [
    (h) => {
      const [arr, t] = [h.pick(NUMS), h.pick(TARGETS)];
      return `while (lo < hi) {\n    int mid = lo + (hi - lo) / 2;\n    if (${arr}[mid] < ${t}) lo = mid + 1;\n    else hi = mid;\n}`;
    },
    () =>
      `while (!queue.isEmpty()) {\n    int node = queue.poll();\n    for (int nxt : adj.get(node)) queue.offer(nxt);\n}`,
    (h) => {
      const acc = h.pick(VARS);
      return `while (n > 0) {\n    ${acc} += n % 10;\n    n /= 10;\n}`;
    },
    () => `do {\n    x = next[x];\n    steps++;\n} while (x != start);`,
    () =>
      `while (!stack.isEmpty() && stack.peek() < x) {\n    stack.pop();\n}\nstack.push(x);`,
  ],
  if: [
    () =>
      `if (x > 0) {\n    sign = 1;\n} else if (x < 0) {\n    sign = -1;\n} else {\n    sign = 0;\n}`,
    (h) => {
      const v = h.pick(VARS);
      return `int ${v} = a > b ? a : b;`;
    },
    () =>
      `if (obj instanceof String s && !s.isEmpty()) {\n    System.out.println(s.length());\n}`,
    () =>
      `switch (op) {\n    case '+':\n        res = a + b;\n        break;\n    case '-':\n        res = a - b;\n        break;\n    default:\n        res = 0;\n}`,
    () =>
      `String size = switch (n) {\n    case 0 -> "none";\n    case 1 -> "one";\n    default -> "many";\n};`,
    (h) => {
      const arr = h.pick(NUMS);
      return `if (${arr} == null || ${arr}.length == 0) {\n    return 0;\n}`;
    },
  ],
  func: [
    (h) => {
      const [f, arr] = [h.pick(FUNCS), h.pick(NUMS)];
      return `public static int ${f}(int[] ${arr}, int k) {\n    int count = 0;\n    for (int x : ${arr}) {\n        if (x > k) count++;\n    }\n    return count;\n}`;
    },
    (h) => {
      const f = h.pick(PREDICATES);
      return `private boolean ${f}(String s) {\n    return s != null && !s.isEmpty();\n}`;
    },
    (h) => {
      const f = h.pick(FUNCS);
      return `public List<Integer> ${f}(int n) {\n    List<Integer> res = new ArrayList<>();\n    for (int i = 0; i < n; i++) {\n        res.add(i * i);\n    }\n    return res;\n}`;
    },
    () => `Comparator<int[]> cmp = (a, b) -> a[0] - b[0];`,
    () =>
      `private static long fib(int n) {\n    if (n < 2) return n;\n    return fib(n - 1) + fib(n - 2);\n}`,
    () =>
      `@Override\npublic String toString() {\n    return "(" + x + ", " + y + ")";\n}`,
  ],
  class: [
    (h) => {
      const c = h.pick(CLASSES);
      return `public class ${c} {\n    private final int x;\n    private final int y;\n\n    public ${c}(int x, int y) {\n        this.x = x;\n        this.y = y;\n    }\n}`;
    },
    () =>
      `class ListNode {\n    int val;\n    ListNode next;\n\n    ListNode(int val) {\n        this.val = val;\n    }\n}`,
    (h) => {
      const c = h.pick(CLASSES);
      return `public record ${c}(int first, int second) {}`;
    },
    () =>
      `public interface Shape {\n    double area();\n    double perimeter();\n}`,
    (h) => {
      const c = h.pick(CONTAINERS);
      return `class ${c} extends Base implements Comparable<${c}> {\n    @Override\n    public int compareTo(${c} other) {\n        return Integer.compare(size, other.size);\n    }\n}`;
    },
  ],
  idiom: [
    () => `Map<String, Integer> count = new HashMap<>();`,
    () => `List<Integer> list = new ArrayList<>();`,
    (h) => {
      const arr = h.pick(NUMS);
      return `Arrays.sort(${arr});`;
    },
    () => `Collections.sort(list, (a, b) -> b - a);`,
    () => `int[] dp = new int[n + 1];\nArrays.fill(dp, -1);`,
    () =>
      `StringBuilder sb = new StringBuilder();\nfor (char c : s.toCharArray()) {\n    sb.append(c);\n}`,
    () =>
      `List<String> names = people.stream()\n    .map(Person::getName)\n    .collect(Collectors.toList());`,
    () => `Deque<Integer> stack = new ArrayDeque<>();`,
    () =>
      `PriorityQueue<int[]> pq = new PriorityQueue<>((a, b) -> a[1] - b[1]);`,
    (h) => {
      const arr = h.pick(NUMS);
      return `int max = Arrays.stream(${arr}).max().getAsInt();`;
    },
  ],
};

export const TEMPLATES = { python, cpp, java };
