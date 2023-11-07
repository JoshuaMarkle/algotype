const words = [
    "if",
    "for",
    "foreach",
    "remove",
    "add",
    "push",
    "pop",
    "class",
    "new",
    "list",
    "array",
    "let",
    "query",
    "selector",
    "const",
    "all",
    "def",
    "function",
    "insert",
    "select",
    "from",
    "left",
    "top",
    "icon",
    "bottom",
    "reverse",
    "right",
    "color",
    "back",
    "post",
    "flex",
    "grid",
    "method",
    "prop",
    "property",
    "open",
    "close",
    "static",
    "void",
    "main",
    "str",
    "var",
    "set",
    "background",
    "from",
    "finally",
    "else",
    "continue",
    "interface",
    "text",
    "echo",
    "enum",
    "enums",
    "thread",
    "threads",
    "regex",
    "switch",
    "boolean",
    "lambda",
    "pass",
    "true",
    "false",
    "while",
    "error",
    "unicode",
    "request",
    "http",
    "assert",
    "any",
    "abs",
    "ascii",
    "bool",
    "read",
    "line",
    "lines",
    "page",
    "write",
    "edit",
    "justify",
    "execute",
    "delete",
    "byte",
    "string",
    "compile",
    "dict",
    "exec",
    "sys",
    "system",
    "os",
    "filter",
    "package",
    "release",
    "version",
    "file",
    "pos",
    "range",
    "hash",
    "uuid",
    "id",
    "count",
    "code",
    "codes",
    "encrypt",
    "script",
    "json",
    "scripts",
    "counter",
    "user",
    "users",
    "admin",
    "staff",
    "help",
    "helper",
    "forum",
    "link",
    "url",
    "username",
    "name",
    "full",
    "last",
    "editor",
    "temp",
    "center",
    "with",
    "find",
    "format",
    "translate",
    "api",
    "rest",
    "sets",
    "index",
    "numeric",
    "number",
    "service",
    "services",
    "postgresql",
    "excel",
    "mongodb",
    "mariadb",
    "mysql",
    "connect",
    "database",
    "controller",
    "controllers",
    "view",
    "views",
    "mvc",
    "numbers",
    "input",
    "comment",
    "output",
    "comments",
    "syntax",
    "socket",
    "lower",
    "upper",
    "sockets",
    "date",
    "iteration",
    "dates",
    "random",
    "math",
    "split",
    "cut",
    "node",
    "div",
    "overflow",
    "debug",
    "padding",
    "position",
    "stack",
    "display",
    "margin",
    "style",
    "styles",
    "border",
    "outline",
    "bug",
    "width",
    "height",
    "font",
    "react",
    "angular",
    "strip",
    "join",
    "leave",
    "replace",
    "align",
    "drop",
    "callback",
    "theme",
    "by",
    "null",
    "into",
    "case",
    "alter",
    "default",
    "auto",
    "break",
    "increment",
    "injection",
    "keyword",
    "keywords",
    "key",
    "char",
    "chars",
    "keys",
    "group",
    "export",
    "port",
    "router",
    "application",
    "com",
    "www",
    "struct",
    "io",
    "app",
    "encode",
    "decode",
    "base",
    "routes",
    "vars",
    "route",
    "module",
    "src",
    "source",
    "sub",
    "config",
    "plugin",
    "env",
    "where",
    "avg",
    "sum",
    "or",
    "not",
    "and",
    "elseif",
    "callbacks",
    "call",
    "sql",
    "int",
    "async",
    "await",
    "promise",
    "integer",
    "instance",
    "len",
    "length",
    "map",
    "local",
    "locals",
    "memory",
    "create",
    "fix",
    "data",
    "type",
    "dom",
    "jsx",
    "web",
    "token",
    "jwt",
    "yml",
    "xml",
    "csv",
    "types",
    "lib",
    "library",
    "worker",
    "history",
    "require",
    "println",
    "extend",
    "import",
    "object",
    "objects",
    "task",
    "schedule",
    "min",
    "html",
    "css",
    "nodes",
    "child",
    "parent",
    "element",
    "animate",
    "animation",
    "table",
    "update",
    "limit",
    "crud",
    "max",
    "get",
    "print",
    "console",
    "return",
    "log",
    "document",
    "item",
    "default",
    "items",
    "key",
    "keys",
    "listener",
    "event",
    "sort",
    "div",
    "public",
    "pip",
    "npm",
    "private",
    "update",
    "doc",
    "include",
    "value",
    "send",
    "request",
    "status",
    "result",
    "response",
    "ajax",
    "res",
    "req",
    "isset",
    "conn",
    "state",
    "discard",
    "values",
    "host",
    "net",
    "network",
    "sorted",
    "slice",
    "server",
    "pass",
    "password",
    "try",
    "catch",
    "super",
    "fill",
    "except",
    "exception",
    "load",
    "reload",
    "upload",
    "cancel",
    "tuple",
    "zip",
    "java",
    "python",
    "window",
    "start",
    "startwith",
    "endwith",
    "screen",
    "session",
    "fetch",
    "storage",
    "location",
    "time",
    "prefab",
    "timer",
    "timing",
    "cookie",
    "cookies",
    "form",
    "search",
    "append",
    "clear",
    "insert",
    "copy",
    "str",
    "line",
    "loop",
    "datetime",
    "timeout",
    "interval",
    "paste",
    "hover",
    "cobol",
    "inner",
    "nav",
    "button",
    "init",
    "self",
    "click",
    "current",
    "handle",
    "press",
    "navigator",
    "language",
    "this"
];

const python = [
    "def is_prime(n):\n\tif n <= 1:\n\t\treturn False\n\tfor i in range(2, int(n**0.5)+1):\n\t\tif n % i == 0:\n\t\t\treturn False\n\treturn True",
    "def factorial(n):\n\tif n == 0:\n\t\treturn 1\n\telse:\n\t\treturn n * factorial(n-1)",
    //"def reverse_string(s):\n\treturn s[::-1]",
    "def reverse_string(s):\n\tstr_list = list(s)\n\tstart_index = 0\n\tend_index = len(s) - 1\n\twhile start_index < end_index:\n\t\tstr_list[start_index], str_list[end_index] = str_list[end_index], str_list[start_index]\n\t\tstart_index += 1\n\t\tend_index -= 1\n\treturn ''.join(str_list)",
    "def binary_search(arr, x):\n\tlow = 0\n\thigh = len(arr) - 1\n\tmid = 0\n\twhile low <= high:\n\t\tmid = (high + low) // 2\n\t\tif arr[mid] < x:\n\t\t\tlow = mid + 1\n\t\telif arr[mid] > x:\n\t\t\thigh = mid - 1\n\t\telse:\n\t\t\treturn mid\n\treturn -1",
    "def bubble_sort(arr):\n\tn = len(arr)\n\tfor i in range(n):\n\t\tfor j in range(0, n-i-1):\n\t\t\tif arr[j] > arr[j+1] :\n\t\t\t\tarr[j], arr[j+1] = arr[j+1], arr[j]",
    "def quick_sort(arr):\n\tif len(arr) <= 1:\n\t\treturn arr\n\tpivot = arr[len(arr)//2]\n\tleft = [x for x in arr if x < pivot]\n\tmiddle = [x for x in arr if x == pivot]\n\tright = [x for x in arr if x > pivot]\n\treturn quick_sort(left) + middle + quick_sort(right)",
    "def merge_sort(arr):\n\tif len(arr) > 1:\n\t\tmid = len(arr) // 2\n\t\tL = arr[:mid]\n\t\tR = arr[mid:]\n\t\tmerge_sort(L)\n\t\tmerge_sort(R)\n\t\ti = j = k = 0\n\t\twhile i < len(L) and j < len(R):\n\t\t\tif L[i] < R[j]:\n\t\t\t\tarr[k] = L[i]\n\t\t\t\ti += 1\n\t\t\telse:\n\t\t\t\tarr[k] = R[j]\n\t\t\t\tj += 1\n\t\t\tk += 1\n\t\twhile i < len(L):\n\t\t\tarr[k] = L[i]\n\t\t\ti += 1\n\t\t\tk += 1\n\t\twhile j < len(R):\n\t\t\tarr[k] = R[j]\n\t\t\tj += 1\n\t\t\tk += 1\n\treturn arr",
    "def binary_search(arr, x):\n\tlow = 0\n\thigh = len(arr) - 1\n\twhile low <= high:\n\t\tmid = (high + low) // 2\n\t\tif arr[mid] < x:\n\t\t\tlow = mid + 1\n\t\telif arr[mid] > x:\n\t\t\thigh = mid - 1\n\t\telse:\n\t\t\treturn mid\n\treturn -1",
    //"def heap_sort(arr):\n\tn = len(arr)\n\tfor i in range(n // 2 - 1, -1, -1):\n\t\theapify(arr, n, i)\n\tfor i in range(n-1, 0, -1):\n\t\tarr[i], arr[0] = arr[0], arr[i]\n\t\theapify(arr, i, 0)\n\ndef heapify(arr, n, i):\n\tlargest = i\n\tl = 2 * i + 1\n\tr = 2 * i + 2\n\tif l < n and arr[i] < arr[l]:\n\t\tlargest = l\n\tif r < n and arr[largest] < arr[r]:\n\t\tlargest = r\n\tif largest != i:\n\t\tarr[i],arr[largest] = arr[largest],arr[i]\n\t\theapify(arr, n, largest)",
    "def longest_increasing_subsequence(arr):\n\tn = len(arr)\n\tlis = [1] * n\n\tfor i in range(1, n):\n\t\tfor j in range(0, i):\n\t\t\tif arr[i] > arr[j] and lis[i] < lis[j] + 1:\n\t\t\t\tlis[i] = lis[j] + 1\n\treturn max(lis)",
    "def longest_common_subsequence(X, Y):\n\tm = len(X)\n\tn = len(Y)\n\tL = [[None]*(n+1) for i in range(m+1)]\n\tfor i in range(m+1):\n\t\tfor j in range(n+1):\n\t\t\tif i == 0 or j == 0:\n\t\t\t\tL[i][j] = 0\n\t\t\telif X[i-1] == Y[j-1]:\n\t\t\t\tL[i][j] = L[i-1][j-1] + 1\n\t\t\telse:\n\t\t\t\tL[i][j] = max(L[i-1][j], L[i][j-1])\n\treturn L[m][n]",
    "def min_cost_path(cost, m, n):\n\tfor i in range(1, m+1):\n\t\tfor j in range(1, n+1):\n\t\t\tif i == 1 and j == 1:\n\t\t\t\tpass\n\t\t\telif i == 1:\n\t\t\t\tcost[i-1][j-1] += cost[i-1][j-2]\n\t\t\telif j == 1:\n\t\t\t\tcost[i-1][j-1] += cost[i-2][j-1]\n\t\t\telse:\n\t\t\t\tcost[i-1][j-1] += min(cost[i-2][j-1], cost[i-1][j-2])\n\treturn cost[m-1][n-1]",
    "def coin_change(coins, amount):\n\tif amount == 0:\n\t\treturn 0\n\tif amount < 0:\n\t\treturn float('inf')\n\tres = float('inf')\n\tfor coin in coins:\n\t\tsub_res = coin_change(coins, amount-coin)\n\t\tif sub_res != float('inf'):\n\t\t\tres = min(res, sub_res+1)\n\treturn res",
    "def matrix_chain_order(p):\n\tn = len(p) - 1\ntm = [[0 for x in range(n)] for y in range(n)]\ns = [[0 for x in range(n)] for y in range(n)]\nfor i in range(1, n):\n\ttm[i][i] = 0\nfor L in range(2, n+1):\n\tfor i in range(1, n-L+2):\n\t\tj = i+L-1\n\t\ttm[i][j] = float('inf')\n\t\tfor k in range(i, j):\n\t\t\tq = tm[i][k] + tm[k+1][j] + p[i-1]*p[k]*p[j]\n\t\t\tif q < tm[i][j]:\n\t\t\t\ttm[i][j] = q\n\t\t\t\ts[i][j] = k\n\treturn tm[1][n-1]",
    "def knapSack(W, wt, val, n):\n\tif n == 0 or W == 0:\n\t\treturn 0\n\tif (wt[n-1] > W):\n\t\treturn knapSack(W, wt, val, n-1)\n\telse:\n\t\treturn max(val[n-1] + knapSack(W-wt[n-1], wt, val, n-1), \n\t\t\tknapSack(W, wt, val, n-1))",
    "def lps(str):\n\tn = len(str)\n\tL = [[0 for x in range(n)] for x in range(n)]\n\tfor i in range(n):\n\t\tL[i][i] = 1\n\tfor cl in range(2, n+1):\n\t\tfor i in range(n-cl+1):\n\t\t\tj = i+cl-1\n\t\t\tif (str[i] == str[j] and cl == 2):\n\t\t\t\tL[i][j] = 2\n\t\t\telif (str[i] == str[j]):\n\t\t\t\tL[i][j] = L[i+1][j-1] + 2\n\t\t\telse:\n\t\t\t\tL[i][j] = max(L[i][j-1], L[i+1][j])\n\treturn L[0][n-1]",
    "def minPalPartion(str):\n\tn = len(str)\n\tC = [0 for i in range(n)]\n\tP = [[False for i in range(n)]for j in range(n)]\n\tfor i in range(n):\n\t\tP[i][i] = True\n\tfor L in range(2, n+1):\n\t\tfor i in range(n-L+1):\n\t\t\tj = i+L-1\n\t\t\tif L == 2:\n\t\t\t\tP[i][j] = (str[i] == str[j])\n\t\t\telse:\n\t\t\t\tP[i][j] = (str[i] == str[j]) and P[i+1][j-1]\n\t\tif P[i][j] == True:\n\t\t\tC[j] = min(C[j],C[i-1]+1) if i > 0 else 0\n\treturn C[n-1]",
    "def is_multiple_of_three(n):\n\todd_count = 0\n\teven_count = 0\n\tif n < 0:\n\t\tn = -n\n\tif n == 0:\n\t\treturn True\n\tif n == 1:\n\t\treturn False\n\twhile n:\n\t\tif n & 1:\n\t\t\todd_count += 1\n\t\telse:\n\t\t\teven_count += 1\n\t\tn = n >> 1\n\treturn is_multiple_of_three(abs(odd_count - even_count))",
    //"def add_base_14(a, b):\n\tdef val(c):\n\t\tif c >= '0' and c <= '9':\n\t\t\treturn ord(c) - ord('0')\n\t\telse:\n\t\t\treturn ord(c) - ord('A') + 10\n\tdef reVal(num):\n\t\tif num >= 0 and num <= 9:\n\t\t\treturn chr(num + ord('0'))\n\t\telse:\n\t\t\treturn chr(num - 10 + ord('A'))\n\tif len(a) < len(b):\n\t\ta, b = b, a\n\tres = ''\n\tl1 = len(a)\n\tl2 = len(b)\n\tdiff = l1 - l2\n\tcarry = 0\n\tfor i in range(l2-1, -1, -1):\n\t\tsum = val(a[i+diff]) + val(b[i]) + carry\n\t\tcarry = sum // 14\n\t\tsum %= 14\n\t\tres = reVal(sum) + res\n\tfor i in range(l1-l2-1, -1, -1):\n\t\tsum = val(a[i]) + carry\n\t\tcarry = sum // 14\n\t\tsum %= 14\n\t\tres = reVal(sum) + res\n\tif carry > 0:\n\t\tres = reVal(carry) + res\n\treturn res",
    "def fibonacci(n):\n\tif n == 0:\n\t\treturn 0\n\telif n == 1 or n == 2:\n\t\treturn 1\n\telse:\n\t\treturn fibonacci(n-1) + fibonacci(n-2)",
    "def multiply(a, b):\n\tif a == 0 or b == 0:\n\t\treturn 0\n\tif b > 0:\n\t\treturn a + multiply(a, b-1)\n\tif b < 0:\n\t\treturn -multiply(a, -b)\n",
    "def square_root(n):\n\tprecision = 0.00001\n\tx = n\n\twhile (x - n / x) > precision:\n\t\tx = (x + n / x) / 2\n\treturn x",
    "def sieve_of_eratosthenes(n):\n\tprime = [True for i in range(n+1)]\n\tp = 2\n\twhile (p * p <= n):\n\t\tif (prime[p] == True):\n\t\t\tfor i in range(p * p, n+1, p):\n\t\t\t\tprime[i] = False\n\t\tp += 1\n\treturn [p for p in range(2, n+1) if prime[p]]",
    "def pascal_triangle(n):\n\ttriangle = []\n\tfor i in range(n):\n\t\trow = [None for _ in range(i+1)]\n\t\trow[0], row[-1] = 1, 1\n\t\tfor j in range(1, len(row)-1):\n\t\t\trow[j] = triangle[i-1][j-1] + triangle[i-1][j]\n\t\ttriangle.append(row)\n\treturn triangle",
    "def next_palindrome(n):\n\tdef is_palindrome(n):\n\t\treturn str(n) == str(n)[::-1]\n\twhile not is_palindrome(n):\n\t\tn += 1\n\treturn n",
    "def add_polynomials(a, b):\n\tres = []\n\ti, j = 0, 0\n\tm, n = len(a), len(b)\n\twhile i < m and j < n:\n\t\tif a[i][1] > b[j][1]:\n\t\t\tres.append(a[i])\n\t\t\ti += 1\n\t\telif a[i][1] < b[j][1]:\n\t\t\tres.append(b[j])\n\t\t\tj += 1\n\t\telse:\n\t\t\tres.append((a[i][0] + b[j][0], a[i][1]))\n\t\t\ti += 1\n\t\t\tj += 1\n\twhile i < m:\n\t\tres.append(a[i])\n\t\ti += 1\n\twhile j < n:\n\t\tres.append(b[j])\n\t\tj += 1\n\treturn res",
    "def multiply_polynomials(a, b):\n\tm, n = len(a), len(b)\n\tres = [0] * (m+n-1)\n\tfor i in range(m):\n\t\tfor j in range(n):\n\t\t\tres[i+j] += a[i] * b[j]\n\treturn res",
    "def count_trailing_zeroes(n):\n\tcount = 0\n\ti = 5\n\twhile (n / i >= 1):\n\t\tcount += int(n / i)\n\t\ti *= 5\n\treturn count",
    "def bogo_sort(arr):\n\tdef is_sorted(arr):\n\t\tfor i in range(0, len(arr)-1):\n\t\t\tif arr[i] > arr[i+1]:\n\t\t\t\treturn False\n\t\treturn True\n\twhile not is_sorted(arr):\n\t\trand.shuffle(arr)\n\treturn arr",
    "def gcd(a, b):\n\twhile b:\n\t\ta, b = b, a % b\n\treturn a",
    //"def lcm(a, b):\n\treturn a * b // gcd(a, b)",
    "def rotate_matrix_90(matrix):\n\tn = len(matrix)\n\tfor layer in range(n // 2):\n\t\tfirst = layer\n\t\tlast = n - 1 - layer\n\t\tfor i in range(first, last):\n\t\t\toffset = i - first\n\t\t\ttop = matrix[first][i]\n\t\t\tmatrix[first][i] = matrix[last-offset][first]\n\t\t\tmatrix[last-offset][first] = matrix[last][last-offset]\n\t\t\tmatrix[last][last-offset] = matrix[i][last]\n\t\t\tmatrix[i][last] = top\n\treturn matrix",
    "def kadane_algorithm(nums):\n\tmax_current = max_global = nums[0]\n\tfor i in range(1, len(nums)):\n\t\tmax_current = max(nums[i], max_current + nums[i])\n\t\tif max_current > max_global:\n\t\t\tmax_global = max_current\n\treturn max_global",
  ];

  const cpp = [
    `bool is_prime(int n) {
    if (n <= 1) return false;
    for (int i = 2; i <= sqrt(n); ++i) {
        if (n % i == 0) return false;
    }
    return true;
}`,

    `int factorial(int n) {
    if (n == 0) return 1;
    return n * factorial(n - 1);
}`,

    `std::string reverse_string(const std::string& s) {
    int start_index = 0;
    int end_index = s.length() - 1;
    std::string str = s;
    while (start_index < end_index) {
        std::swap(str[start_index], str[end_index]);
        start_index++;
        end_index--;
    }
    return str;
}`,

    `int binary_search(const std::vector<int>& arr, int x) {
    int low = 0;
    int high = arr.size() - 1;
    int mid;
    while (low <= high) {
        mid = low + (high - low) / 2;
        if (arr[mid] < x) {
            low = mid + 1;
        } else if (arr[mid] > x) {
            high = mid - 1;
        } else {
            return mid;
        }
    }
    return -1;
}`,

    `void bubble_sort(std::vector<int>& arr) {
    int n = arr.size();
    for (int i = 0; i < n - 1; ++i) {
        for (int j = 0; j < n - i - 1; ++j) {
            if (arr[j] > arr[j + 1]) {
                std::swap(arr[j], arr[j + 1]);
            }
        }
    }
}`,

    `void quick_sort(std::vector<int>& arr) {
    if (arr.size() <= 1) return;

    int pivot = arr[arr.size() / 2];
    std::vector<int> left;
    std::vector<int> right;
    std::vector<int> middle;

    for (int i : arr) {
        if (i < pivot) left.push_back(i);
        else if (i == pivot) middle.push_back(i);
        else right.push_back(i);
    }

    quick_sort(left);
    quick_sort(right);

    arr.clear();
    arr.insert(arr.end(), left.begin(), left.end());
    arr.insert(arr.end(), middle.begin(), middle.end());
    arr.insert(arr.end(), right.begin(), right.end());
}`,

    `void merge(std::vector<int>& left, std::vector<int>& right, std::vector<int>& bars){
    int nL = left.size();
    int nR = right.size();
    int i = 0, j = 0, k = 0;

    while (j < nL && k < nR) {
        if (left[j] < right[k]) {
            bars[i] = left[j];
            j++;
        } else {
            bars[i] = right[k];
            k++;
        }
        i++;
    }
    while (j < nL) {
        bars[i] = left[j];
        j++; i++;
    }
    while (k < nR) {
        bars[i] = right[k];
        k++; i++;
    }
}

void merge_sort(std::vector<int>& arr) {
    if (arr.size() <= 1) return;

    int mid = arr.size() / 2;
    std::vector<int> left(arr.begin(), arr.begin() + mid);
    std::vector<int> right(arr.begin() + mid, arr.end());

    merge_sort(left);
    merge_sort(right);
    merge(left, right, arr);
}`,
];


export { words, python, cpp };