// An array of function strings that users will type
const functionsList = [
    "def fib(n):\n\tif n <= 1:\n\t\treturn n\n\telse:\n\t\treturn(fib(n-1) + fib(n-2))",
    "def is_prime(n):\n\tif n <= 1:\n\t\treturn False\n\tfor i in range(2, int(n**0.5)+1):\n\t\tif n % i == 0:\n\t\t\treturn False\n\treturn True",
    "def factorial(n):\n\tif n == 0:\n\t\treturn 1\n\telse:\n\t\treturn n * factorial(n-1)",
    "def reverse_string(s):\n\treturn s[::-1]",
    "def binary_search(arr, x):\n\tlow = 0\n\thigh = len(arr) - 1\n\tmid = 0\n\twhile low <= high:\n\t\tmid = (high + low) // 2\n\t\tif arr[mid] < x:\n\t\t\tlow = mid + 1\n\t\telif arr[mid] > x:\n\t\t\thigh = mid - 1\n\t\telse:\n\t\t\treturn mid\n\treturn -1",
    "def bubble_sort(arr):\n\tn = len(arr)\n\tfor i in range(n):\n\t\tfor j in range(0, n-i-1):\n\t\t\tif arr[j] > arr[j+1] :\n\t\t\t\tarr[j], arr[j+1] = arr[j+1], arr[j]",
    "def quick_sort(arr):\n\tif len(arr) <= 1:\n\t\treturn arr\n\tpivot = arr[len(arr)//2]\n\tleft = [x for x in arr if x < pivot]\n\tmiddle = [x for x in arr if x == pivot]\n\tright = [x for x in arr if x > pivot]\n\treturn quick_sort(left) + middle + quick_sort(right)"
  ];
  
  // Function to randomly select a function to type
  export function getRandomFunction() {
    const randomIndex = Math.floor(Math.random() * functionsList.length);
    return functionsList[randomIndex];
  }
  