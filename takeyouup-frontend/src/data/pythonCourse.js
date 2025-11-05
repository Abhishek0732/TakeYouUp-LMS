const pythonCourse = {
  id: "python-101",
  title: "Python Programming Mastery",
  description:
    "Master Python programming with this comprehensive course. From the basics of Python syntax to advanced concepts like data structures, object-oriented programming, and building real-world projects.",
  level: "Beginner to Intermediate",
  duration: "10 weeks",
  students: 850,
  rating: 4.8,
  image:
    "https://images.unsplash.com/photo-1573164574397-c839da53bb93?w=1200&h=600&fit=crop",
  instructor: "John Doe",
  price: "$79",
  modules: [
    {
      title: "Introduction to Python",
      lessons: [
        {
          title: "Course Overview",
          duration: "10 min",
          content:
            "In this lesson, you will learn about the course structure, objectives, and what to expect from this Python programming journey.",
          keyPoints: [
            { point: "Course Introduction", explanation: "Overview of the course content, objectives, and structure." },
            { point: "How to Approach Learning", explanation: "Tips on how to make the most of the course and resources available." },
            { point: "Python Basics", explanation: "Introduction to Python programming fundamentals." }
          ]
        },
        {
          title: "Setting Up Python Environment",
          duration: "20 min",
          content:
            "This lesson will guide you through installing Python, setting up a text editor, and running your first Python script.",
          keyPoints: [
            { point: "Installing Python", explanation: "Step-by-step guide on installing Python on your machine." },
            { point: "Using IDEs", explanation: "Setting up an Integrated Development Environment (IDE) for Python." },
            { point: "Running Python Code", explanation: "How to write and execute Python scripts." }
          ]
        },
        {
          title: "Python Syntax and Data Types",
          duration: "30 min",
          content:
            "Learn the basic syntax, variables, and data types in Python, such as strings, integers, and floats.",
          keyPoints: [
            { point: "Python Syntax", explanation: "Understanding Python's syntax and how to structure Python code." },
            { point: "Variables and Data Types", explanation: "Introduction to variables and the different data types in Python." },
            { point: "Basic Operations", explanation: "Learn basic arithmetic operations with Python." }
          ]
        }
      ]
    },
    {
      title: "Control Flow in Python",
      lessons: [
        {
          title: "Conditional Statements",
          duration: "25 min",
          content:
            "Learn how to make decisions in Python using `if`, `else`, and `elif` statements to control the flow of execution.",
          keyPoints: [
            { point: "If-Else Statements", explanation: "How to use if-else statements for conditional execution." },
            { point: "Comparing Values", explanation: "Using comparison operators to evaluate conditions." },
            { point: "Nested Conditions", explanation: "Learn how to nest if-else conditions for more complex logic." }
          ]
        },
        {
          title: "Loops in Python",
          duration: "30 min",
          content:
            "Learn how to repeat tasks in Python using `for` and `while` loops. Understand when and how to use each type of loop.",
          keyPoints: [
            { point: "For Loops", explanation: "How to use for loops to iterate over sequences like lists and ranges." },
            { point: "While Loops", explanation: "Using while loops for repetitive tasks until a condition is met." },
            { point: "Break and Continue", explanation: "Control the flow of loops using `break` and `continue` statements." }
          ]
        },
        {
          title: "List Comprehensions",
          duration: "35 min",
          content:
            "Learn Python's list comprehension technique, which provides a concise way to create lists and manipulate data.",
          keyPoints: [
            { point: "List Comprehensions", explanation: "Syntax of list comprehensions and when to use them." },
            { point: "Filtering with List Comprehensions", explanation: "Filtering data within a list comprehension." },
            { point: "Nested List Comprehensions", explanation: "Using nested comprehensions for multidimensional data." }
          ]
        }
      ]
    },
    {
      title: "Functions and Modules",
      lessons: [
        {
          title: "Defining Functions",
          duration: "40 min",
          content:
            "Learn how to define functions in Python, which allow you to create reusable blocks of code.",
          keyPoints: [
            { point: "Function Syntax", explanation: "How to define functions using `def` and return values." },
            { point: "Parameters and Arguments", explanation: "How to pass arguments to functions and work with parameters." },
            { point: "Return Values", explanation: "Using the `return` keyword to send back results from functions." }
          ]
        },
        {
          title: "Using Modules",
          duration: "30 min",
          content:
            "In this lesson, you'll learn how to organize your code by using Python modules and libraries.",
          keyPoints: [
            { point: "Importing Modules", explanation: "How to import built-in Python modules and third-party libraries." },
            { point: "Standard Library", explanation: "Overview of Python's standard library and common modules like `math` and `random`." },
            { point: "Creating Modules", explanation: "How to create your own Python modules and import them into scripts." }
          ]
        },
        {
          title: "Error Handling",
          duration: "30 min",
          content:
            "Learn how to handle errors and exceptions in Python using `try`, `except`, and `finally` blocks.",
          keyPoints: [
            { point: "Try-Except Blocks", explanation: "How to catch and handle exceptions with try-except blocks." },
            { point: "Raising Exceptions", explanation: "How to raise custom exceptions when needed." },
            { point: "Finally Block", explanation: "Ensuring cleanup code runs with the `finally` block." }
          ]
        }
      ]
    },
    {
      title: "Advanced Python Topics",
      lessons: [
        {
          title: "Object-Oriented Programming (OOP)",
          duration: "45 min",
          content:
            "Learn the principles of Object-Oriented Programming (OOP) and how to use classes and objects in Python.",
          keyPoints: [
            { point: "Classes and Objects", explanation: "Understanding how to define classes and create objects in Python." },
            { point: "Inheritance and Polymorphism", explanation: "Using inheritance to create subclasses and polymorphism to reuse code." },
            { point: "Encapsulation", explanation: "Learn how to protect your class attributes using encapsulation." }
          ]
        },
        {
          title: "Working with Files",
          duration: "35 min",
          content:
            "Learn how to read from and write to files in Python using file I/O operations.",
          keyPoints: [
            { point: "Reading Files", explanation: "How to open and read the contents of a file." },
            { point: "Writing to Files", explanation: "Writing data to a file and managing file output." },
            { point: "Handling File Paths", explanation: "Working with file paths and directories in Python." }
          ]
        },
        {
          title: "Mini Project: Python Application",
          duration: "60 min",
          content:
            "Apply everything you've learned by building a simple Python application. This project will consolidate your skills.",
          keyPoints: [
            { point: "Project Planning", explanation: "Define the project's objectives and structure." },
            { point: "Designing the Application", explanation: "Break the application into components and design each part." },
            { point: "Testing and Debugging", explanation: "Test and debug the Python application to ensure it works properly." }
          ]
        }
      ]
    }
  ],
  features: [
    "Hands-on coding exercises",
    "Mini projects and assessments",
    "Interview preparation",
    "Certificate of completion",
    "Lifetime access",
    "Community support and live Q&A"
  ]
};

export default pythonCourse;
