const words = [
    "if", "for", "delete", "push", "pop", "class", "new", "break", "constructor", "reduce", 
    "function", "document", "else", "continue", "true", "false", "while", "some", "bool", "string", 
    "set", "filter", "length", "split", "prompt", 
    "console", "async", "await", "typeof", "log", "return", "element", "element",
    "sort", "public", "private", "try", "catch", "for", "this", "pass", 
    "select", "static", "get", "set", "prototype", "shift", "unshift", "slice", "splice", "join", "includes", 
    "concat", "match", "replace", "search", "substring", "trim", "eval"
  ];
  
const algorithms = [
    "function is_prime(n) {\n\tif (n <= 1) {\n\t\treturn false;\n\t}\n\tfor (let i = 2; i <= Math.sqrt(n); i++) {\n\t\tif (n % i === 0) {\n\t\t\treturn false;\n\t\t}\n\t}\n\treturn true;\n}",
    "function factorial(n) {\n\tif (n === 0) {\n\t\treturn 1;\n\t} else {\n\t\treturn n * factorial(n - 1);\n\t}\n}",
    "function reverse_string(s) {\n\tlet str_list = s.split('');\n\tlet start_index = 0;\n\tlet end_index = s.length - 1;\n\twhile (start_index < end_index) {\n\t\t[str_list[start_index], str_list[end_index]] = [str_list[end_index], str_list[start_index]];\n\t\tstart_index++;\n\t\tend_index--;\n\t}\n\treturn str_list.join('');\n}",
    "function binary_search(arr, x) {\n\tlet low = 0;\n\tlet high = arr.length - 1;\n\tlet mid = 0;\n\twhile (low <= high) {\n\t\tmid = Math.floor((high + low) / 2);\n\t\tif (arr[mid] < x) {\n\t\t\tlow = mid + 1;\n\t\t} else if (arr[mid] > x) {\n\t\t\thigh = mid - 1;\n\t\t} else {\n\t\t\treturn mid;\n\t\t}\n\t}\n\treturn -1;\n}",
    "function bubble_sort(arr) {\n\tlet n = arr.length;\n\tfor (let i = 0; i < n; i++) {\n\t\tfor (let j = 0; j < n - i - 1; j++) {\n\t\t\tif (arr[j] > arr[j + 1]) {\n\t\t\t\t[arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];\n\t\t\t}\n\t\t}\n\t}\n}"
];

export { words, algorithms };