const dsaInterview = {
  id: "dsa-101",
  slug: "data-structures-algorithms-interview-questions",
  title: "Data Structures & Algorithms Interview Questions",
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
      title: "Data Structure Interview Questions for Freshers",
      lessons: [
        {
          title: "What are Data Structures?",
          duration: "15 min",
          content:
            "A data structure is a mechanical or logical way that data is organized within a program. The organization of data is what determines how a program performs. There are many types of data structures, each with its own uses. When designing code, we need to pay particular attention to the way data is structured. If data isn't stored efficiently or correctly structured, then the overall performance of the code will be reduced.",
        },
        {
          title: "What are some applications of Data structures?",
          duration: "30 min",
          content:
            "Following are some real-time applications of data structures:",
          keyPoints: [
            {
              point: "Decision Making",

            },
            {
              point: "Genetics",

            },
            {
              point: "Blockchain",

            },
            {
              point: "Numerical and Statistical Analysis",

            },
            {
              point: "Compiler Design",

            },
            {
              point:"Database Design and many more",
            }
          ]
        },
        {
          title: " Explain the process behind storing a variable in memory.",
          duration: "50 min",
          content:
            "A variable is stored in memory based on the amount of memory that is needed. Following are the steps followed to store a variable:",
          keyPoints: [
            {
              point: "The required amount of memory is assigned first.",
            },
            {
              point: "Then, it is stored based on the data structure being used.",
            }
          ]
        },
        {
          title: "Can you explain the difference between file structure and storage structure?",
          duration: "50 min",
          
          keyPoints: [
            {
              point: "File Structure",
              explanation: `
Representation of data into secondary or auxiliary memory say any device such as a hard disk or pen drives that stores data which remains intact until manually deleted is known as a file structure representation.
`
            },
            {
              point: "Storage Structure",
              explanation: `
In this type, data is stored in the main memory i.e RAM, and is deleted once the function that uses this data gets completely executed.
`
            }
          ]
        },
        {
          title: "Describe the types of Data Structures?",
          duration: "50 min",
          
          keyPoints: [
            {
              point: "Linear Data Structure",
              explanation: `
A data structure that includes data elements arranged sequentially or linearly, where each element is connected to its previous and next nearest elements, is referred to as a linear data structure. Arrays and linked lists are two examples of linear data structures.
`
            },
            {
              point: "Non-Linear Data Structure",
              explanation: `
Non-linear data structures are data structures in which data elements are not arranged linearly or sequentially. We cannot walk through all elements in one pass in a non-linear data structure, as in a linear data structure. Trees and graphs are two examples of non-linear data structures.
`
            }
          ]
        },
        {
          title: "What is a stack data structure?",
          duration: "50 min",
          content:"A stack is a data structure that is used to represent the state of an application at a particular point in time. The stack consists of a series of items that are added to the top of the stack and then removed from the top. It is a linear data structure that follows a particular order in which operations are performed. LIFO (Last In First Out) or FILO (First In Last Out) are two possible orders. A stack consists of a sequence of items. The element that's added last will come out first, a real-life example might be a stack of clothes on top of each other. When we remove the cloth that was previously on top, we can say that the cloth that was added last comes out first.",
        },
        {
          title: "What are the applications of stack?",
          duration: "50 min",
          content:"Following are some applications for stack data structure:",
          keyPoints: [
            {
              point: "It acts as temporary storage during recursive operations",
            },
            {
              point: "Redo and Undo operations in doc editors",
            },
            {
              point: "Reversing a string",
            },
            {
              point: "Parenthesis matching",
            },
            {
              point: "Postfix to Infix Expressions",
            },
            {
              point: "ParenthesiFunction calls orders matching",
            },
            
          ]
        },
        {
          title: "What are different operations available in stack data structure?",
          duration: "50 min",
          content:"Some of the main operations provided in the stack data structure are: ",
          keyPoints: [
            {
              point: "push",
              explanation: "This adds an item to the top of the stack. The overflow condition occurs if the stack is full."
            },
            {
              point: "pop",
              explanation: "This removes the top item of the stack. Underflow condition occurs if the stack is empty."
            },
            {
              point: "top",
              explanation: "This returns the top item from the stack."
            },
            {
              point: "isEmpty",
              explanation: "This returns true if the stack is empty else false."
            },
            {
              point: "size",
              explanation: "This returns the size of the stack."
            },
          ]
        },
        {
          title: "What is a queue data structure?",
          duration: "50 min",
          content:"A queue is a linear data structure that allows users to store items in a list in a systematic manner. The items are added to the queue at the rear end until they are full, at which point they are removed from the queue from the front. Queues are commonly used in situations where the users want to hold items for a long period of time, such as during a checkout process. A good example of a queue is any queue of customers for a resource where the first consumer is served first.",
        },
        {
          title: "What are the applications of queue?",
          duration: "50 min",
          content:"Following are some applications of queue data structure:",
          keyPoints: [
            {
              point: "Breadth-first search algorithm in graphs",
            },
            {
              point: "Operating system: job scheduling operations, Disk scheduling, CPU scheduling etc.",
            },
            {
              point: "Call management in call centres",
            },
          ]
        },
        {
          title: "What are different operations available in queue data structure?",
          duration: "50 min",
          content:"Some of the main operations provided in the queue data structure are: ",
          keyPoints: [
            {
              point: "enqueue",
              explanation: "This adds an element to the rear end of the queue.  Overflow conditions occur if the queue is full."
            },
            {
              point: "dequeue",
              explanation: "This removes an element from the front end of the queue. Underflow conditions occur if the queue is empty."
            },
            {
              point: "isEmpty",
              explanation: "This returns true if the queue is empty or else false."
            },
            {
              point: "rear",
              explanation: "This returns the rear end element without removing it."
            },
            {
              point: "size",
              explanation: "This returns the size of the queue."
            },
            {
              point: "front",
              explanation: "This returns the front-end element without removing it."
            }
          ]
        },
        {
          title: "Differentiate between stack and queue data structure.",
          duration: "50 min",
          keyPoints: [
            {
              point: "Stack",
              explanation: "Stack is a linear data structure where data is added and removed from the top."
            },
            {
              point: "Queue",
              explanation: "Queue is a linear data structure where data is ended at the rear end and removed from the front."
            },
          ]
        }
      ]
    }
  ]
};


export default dsaInterview;
