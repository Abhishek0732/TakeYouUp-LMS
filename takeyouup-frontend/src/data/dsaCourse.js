const dsaCourse = {
  id: "dsa-101",
  slug: "data-structures-algorithms-mastery",
  title: "Data Structures & Algorithms Mastery",
  description:
    "Gain a deep understanding of data structures and algorithms from first principles. Learn how to analyze complexity, design efficient solutions, and solve real-world problems confidently in coding interviews and production systems.",
  category: "Algorithms",
  level: "Beginner to Advanced",
  duration: "12 weeks",
  students: 1200,
  rating: 4.9,
  image:
    "https://images.unsplash.com/photo-1565077314-5a41d98ab3f2?w=1200&h=600&fit=crop",
  instructor: "Michael Smith",
  price: "$99",
  modules: [
    {
      title: "Foundations & Complexity",
      lessons: [
        {
          title: "Course Introduction & Mindset",
          duration: "15 min",
          content:
            "Welcome to DSA Mastery! In this lesson, you'll understand the structure of the course, how to approach problem solving, and develop the mindset to succeed in DSA and technical interviews.",
          keyPoints: [
            {
              point: "DSA Mindset & Strategy",
              explanation: `
Solving algorithmic problems is as much about approach as it is about code. You’ll learn how to read problems carefully, break them into subproblems, decide which data structures to use, and iterate on your solution. Developing pattern recognition is key. Algorithmic problems often repeat the same patterns, so practicing these patterns will drastically improve your ability to recognize and solve problems more efficiently.
`
            },
            {
              point: "How to Use This Course",
              explanation: `
Each module builds on the previous one. To get the most out of the course, practice consistently and revisit problems after some time. Compare your solutions with optimal ones to learn and improve. Engage with the community discussions, use the hints, and watch the video explanations to reinforce your understanding.
`
            },
            {
              point: "What Makes DSA Important",
              explanation: `
Data Structures and Algorithms are foundational for technical interviews and real-world software development. Understanding DSA enables you to design efficient algorithms that scale well. You'll be able to solve problems faster, optimize your code, and ensure your software performs well in production. DSA also helps you reason through constraints like time and memory.
`
            }
          ]
        },
        {
          title: "Time & Space Complexity Analysis",
          duration: "30 min",
          content:
            "Learn how to model and analyze how an algorithm’s runtime and memory usage grow as input size grows.",
          keyPoints: [
            {
              point: "Big O Notation & Asymptotics",
              explanation: `
Big O notation is a mathematical representation used to describe the upper bound of an algorithm's complexity in terms of input size. It allows us to understand how an algorithm performs as the size of input data increases. You'll study different notations like O(1) for constant time, O(n) for linear time, O(log n) for logarithmic time, and more. Understanding how constants and lower-order terms are ignored is crucial for analyzing large input datasets.
`
            },
            {
              point: "Best, Average, Worst Cases",
              explanation: `
The performance of algorithms varies depending on the input. For example, Quicksort has an average and best case of O(n log n), but its worst-case complexity can be O(n²) if the pivot element is poorly chosen. Understanding these different cases helps you choose the right algorithm for a specific scenario and helps you anticipate how it will behave in production.
`
            },
            {
              point: "Space Complexity & Memory Trade‑offs",
              explanation: `
Space complexity refers to the amount of memory an algorithm uses as a function of the input size. Space-time tradeoffs are a central concept in DSA — sometimes you can use additional memory (like caching results) to speed up an algorithm but at the cost of using more memory. Understanding how to minimize memory usage while still maintaining efficiency is important for optimizing your algorithms.
`
            }
          ]
        }
      ]
    },
    {
      title: "Linear Data Structures",
      lessons: [
        {
          title: "Arrays & Strings",
          duration: "45 min",
          content:
            "Master arrays and strings — the building blocks of many problems. Learn how to manipulate, traverse, and optimize operations on them.",
          keyPoints: [
            {
              point: "Array Basics & Memory Layout",
              explanation: `
Arrays are contiguous blocks of memory, allowing constant-time access by index (O(1)). However, they have limitations like fixed size, which makes insertion and deletion costly (O(n) in the worst case). Understanding how arrays are laid out in memory is crucial for optimizing performance, especially when working with large datasets.
`
            },
            {
              point: "String Manipulation & Pattern Matching",
              explanation: `
Strings are essentially arrays of characters. You’ll practice operations such as reversing strings, checking for palindromes, and searching for substrings. Efficient algorithms like the Knuth-Morris-Pratt (KMP) algorithm for pattern matching will help you reduce unnecessary comparisons and solve string-related problems more efficiently.
`
            },
            {
              point: "Array Basics & Memory Layout",
              explanation: `
Arrays are contiguous blocks of memory, allowing constant-time access by index (O(1)). However, they have limitations like fixed size, which makes insertion and deletion costly (O(n) in the worst case). For example, inserting an element in the middle of an array requires shifting all the elements after it to the right.

**Example:**  
Array: [1, 2, 3, 4]  
Insertion of '5' at index 2: [1, 2, 5, 3, 4]
`
            },
            {
              point: "Common Array Operations & Complexity",
              explanation: `
Operations like insertion, deletion, traversal, and search vary in complexity. For instance, insertion and deletion at the beginning or in the middle of an array take O(n) time because elements need to be shifted. Searching an unsorted array has O(n) time complexity, whereas searching a sorted array using binary search has O(log n) time.

**Example:**  
- Insertion at the end: O(1)
- Insertion at the beginning: O(n)
- Binary search on a sorted array: O(log n)
`
            },
            {
              point: "Two‑Pointer & Sliding Window Techniques",
              explanation: `
These are powerful techniques used to reduce complexity when solving problems involving arrays or substrings. The two-pointer technique uses two indices to scan the array and is effective for problems like finding pairs or merging sorted arrays. The sliding window technique is used to optimize problems involving subarrays or substrings, such as finding the maximum sum subarray or the longest substring with distinct characters.
`
            }
          ]
        },
        {
          title: "Array Data Structure",
          duration: "50 min",
          content:
            "An array is a collection of items of the same variable type that are stored at contiguous memory locations. It is one of the most popular and simple data structures used in programming.",
          keyPoints: [
            {
              point: "Basic terminologies of Array",
              explanation: `
Elements are items stored in an array.
Elements are accessed by their indexes. Indexes in most of the programming languages start from 0.
`
            },
            {
              point: "Memory representation of Array",
              explanation: `
In an array, all the elements or their references are stored in contiguous memory locations. This allows for efficient access and manipulation of elements.
`
            },
            {
              point: "Declaration of Array",
              explanation: `
Arrays can be declared in various ways in different languages. For better illustration, below are some language-specific array declarations:
`
            }
          ]
        },
        
        {
          title: "Linked Lists, Stacks & Queues",
          duration: "50 min",
          content:
            "Learn linked lists, stacks, and queues — versatile structures for dynamically managing data in memory and for implementing algorithms with certain constraints.",
          keyPoints: [
            {
              point: "Singly & Doubly Linked Lists",
              explanation: `
A singly linked list consists of nodes where each node contains a value and a reference (or pointer) to the next node. A doubly linked list is similar but also has a reference to the previous node, making it more flexible but requiring more memory. Linked lists are great for scenarios where data needs to be inserted or deleted frequently.
`
            },
            {
              point: "Stack & Queue ADTs & Implementation",
              explanation: `
Stacks follow a Last-In-First-Out (LIFO) order, while queues follow a First-In-First-Out (FIFO) order. These Abstract Data Types (ADTs) are essential in many algorithms. For example, stacks are used in depth-first search (DFS), and recursion, while queues are used in breadth-first search (BFS). Understanding how to implement and utilize these data structures will help in optimizing algorithms that require processing data sequentially or in a nested manner.
`
            },
            {
              point: "Applications in Algorithms",
              explanation: `
Stacks and queues are used in various real-world algorithms. Stacks help in handling recursion or evaluating expressions (like postfix notation). Queues are essential in algorithms like BFS for traversing graphs, scheduling tasks, or buffering. You’ll also encounter stacks in managing function calls in programming languages.
`
            }
          ]
        }
      ]
    },
    {
      title: "Tree & Graph Structures",
      lessons: [
        {
          title: "Binary Trees & Traversals",
          duration: "50 min",
          content:
            "Explore binary trees — their structure, how to traverse them, and how they are used for hierarchical data representation.",
          keyPoints: [
            {
              point: "Tree Terminology & Structure",
              explanation: `
A tree is a hierarchical structure consisting of nodes connected by edges. The topmost node is the root, and nodes without children are called leaves. Binary trees are a special type where each node has at most two children. Understanding these structures is crucial for solving problems related to hierarchical data (like file systems, organizational charts).
`
            },
            {
              point: "Traversal Methods (Pre, In, Post, Level)",
              explanation: `
Tree traversal refers to visiting every node in a specific order. Preorder, inorder, and postorder are examples of depth-first traversal methods, while level-order is a breadth-first method. These traversals are essential when working with binary trees, and each traversal method is useful for different types of problems (e.g., expression tree evaluation, searching for a node, etc.).
`
            },
            {
              point: "Tree Construction & Properties",
              explanation: `
Given a set of nodes or a sequence of tree traversals, you can reconstruct the tree. Additionally, properties like the binary search tree (BST) property (left child < parent < right child) are useful in solving problems. Inserting, deleting, and balancing trees are key operations when working with trees in algorithmic problems.
`
            }
          ]
        },
        {
          title: "Binary Search Trees & Balanced Trees",
          duration: "55 min",
          content:
            "Dive into binary search trees (BST) and self-balancing trees (AVL, Red-Black) for efficient searching and insertion.",
          keyPoints: [
            {
              point: "BST Operations & Invariants",
              explanation: `
A binary search tree allows for efficient searching, insertion, and deletion by maintaining a sorted structure. The key invariant is that for each node, the left child is smaller than the parent, and the right child is larger. These properties allow searching to be O(log n) in the average case.
`
            },
            {
              point: "Unbalanced vs Balanced Trees",
              explanation: `
An unbalanced BST can degenerate into a linked list, causing worst-case time complexities for operations like search and insertion to be O(n). Balanced trees like AVL trees and Red-Black trees maintain height balance, ensuring O(log n) time complexity for operations.
`
            },
            {
              point: "Use Cases & Trade-Offs",
              explanation: `
Balanced trees are more reliable in terms of worst-case performance but require extra memory and time for balancing. Understanding when to use a balanced tree versus an unbalanced tree depends on the problem constraints, such as frequency of inserts and deletes versus search-heavy operations.
`
            }
          ]
        }
      ]
    }
  ]
};


export default dsaCourse;
