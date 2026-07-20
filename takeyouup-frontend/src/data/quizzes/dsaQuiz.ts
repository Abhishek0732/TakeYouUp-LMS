const dsaQuiz = [
  {
    title: "Big O Notation",
    questions: [
      {
        question:
          "What is the time complexity of accessing an element in an array by index?",
        options: ["O(n)", "O(1)", "O(log n)", "O(n²)"],
        correct: 1,
      },
      {
        question: "Which of the following has the highest growth rate?",
        options: ["O(n log n)", "O(n²)", "O(2ⁿ)", "O(n³)"],
        correct: 2,
      },
      {
        question: "What is the time complexity of binary search?",
        options: ["O(n)", "O(n²)", "O(log n)", "O(1)"],
        correct: 2,
      },
      {
        question: "Big O notation describes which case scenario?",
        options: ["Best case", "Average case", "Worst case", "All cases"],
        correct: 2,
      },
    ],
  },
  {
    title: "Arrays & Strings",
    questions: [
      {
        question:
          "What is the time complexity of inserting an element at the beginning of an array?",
        options: ["O(1)", "O(log n)", "O(n)", "O(n²)"],
        correct: 2,
      },
      {
        question:
          "Which technique is best for finding a pair with a given sum in a sorted array?",
        options: [
          "Brute force",
          "Two pointers",
          "Binary search tree",
          "Hashing only",
        ],
        correct: 1,
      },
      {
        question: "What does the sliding window technique help optimize?",
        options: [
          "Space complexity",
          "Subarray/substring problems",
          "Sorting",
          "Graph traversal",
        ],
        correct: 1,
      },
      {
        question: "What is the time complexity of reversing a string?",
        options: ["O(1)", "O(log n)", "O(n)", "O(n²)"],
        correct: 2,
      },
    ],
  },
  {
    title: "Linked Lists",
    questions: [
      {
        question: "What is the main advantage of a linked list over an array?",
        options: [
          "Faster access",
          "Dynamic size",
          "Less memory",
          "Better cache performance",
        ],
        correct: 1,
      },
      {
        question: "How do you detect a cycle in a linked list?",
        options: [
          "Use a stack",
          "Floyd's cycle detection",
          "Sort the list",
          "Use binary search",
        ],
        correct: 1,
      },
      {
        question:
          "What is the time complexity of inserting at the head of a singly linked list?",
        options: ["O(n)", "O(log n)", "O(1)", "O(n²)"],
        correct: 2,
      },
      {
        question: "A doubly linked list node contains how many pointers?",
        options: ["1", "2", "3", "0"],
        correct: 1,
      },
    ],
  },
  {
    title: "Trees & Graphs",
    questions: [
      {
        question:
          "What is the maximum number of children a binary tree node can have?",
        options: ["1", "2", "3", "Unlimited"],
        correct: 1,
      },
      {
        question: "Which traversal visits nodes level by level?",
        options: ["Inorder", "Preorder", "Postorder", "Level order (BFS)"],
        correct: 3,
      },
      {
        question: "What data structure is used in BFS?",
        options: ["Stack", "Queue", "Heap", "Array"],
        correct: 1,
      },
      {
        question: "Dijkstra's algorithm finds the:",
        options: [
          "Minimum spanning tree",
          "Shortest path",
          "Longest path",
          "Maximum flow",
        ],
        correct: 1,
      },
    ],
  },
  {
    title: "Dynamic Programming",
    questions: [
      {
        question:
          "Which property is required for a problem to be solved using DP?",
        options: [
          "Greedy choice",
          "Optimal substructure",
          "Linear structure",
          "Binary property",
        ],
        correct: 1,
      },
      {
        question: "What is the top-down approach in DP called?",
        options: ["Tabulation", "Memoization", "Recursion", "Iteration"],
        correct: 1,
      },
      {
        question: "The bottom-up DP approach is called:",
        options: ["Memoization", "Tabulation", "Recursion", "Backtracking"],
        correct: 1,
      },
      {
        question: "Which of these is a classic DP problem?",
        options: [
          "Binary search",
          "Knapsack problem",
          "Quick sort",
          "BFS traversal",
        ],
        correct: 1,
      },
    ],
  },
];

export default dsaQuiz;