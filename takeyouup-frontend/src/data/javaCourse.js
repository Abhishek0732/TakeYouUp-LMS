const javaCourse = {
  id: "java-101",
  title: "Java Programming Mastery",
  description:
    "Become a proficient Java developer with this in-depth course covering everything from core Java fundamentals to advanced OOP concepts and real-world projects. Ideal for beginners and intermediate learners aiming for software development careers.",
  level: "Beginner to Intermediate",
  duration: "10 weeks",
  students: 950,
  rating: 4.7,
  image:
    "https://images.unsplash.com/photo-1581090700227-1e8a1f2f34c6?w=1200&h=600&fit=crop",
  instructor: "Samantha Lee",
  price: "$89",
  modules: [
    {
      title: "Getting Started with Java",
      lessons: [
        {
          title: "Course Introduction",
          duration: "10 min",
          content:
            "Welcome to Java Programming Mastery! This lesson outlines the goals of the course, introduces the instructor, and shows you how to get the most from your learning experience.",
          keyPoints: [
            {
              point: "What you'll learn in this course",
              explanation: "This course will guide you through Java fundamentals, object-oriented principles, and advanced Java concepts like multithreading, file handling, and Java streams. By the end, you'll be capable of building robust Java applications."
            },
            {
              point: "How to navigate lessons and assignments",
              explanation: "Each lesson is structured to build on the previous one. You will find coding exercises and assignments at the end of most lessons to practice your skills."
            },
            {
              point: "Course roadmap and outcomes",
              explanation: "This course will take you from basic Java syntax to advanced concepts like multithreading. You'll complete practical assignments and projects that will give you the skills required for real-world Java development."
            },
            {
              point: "Support and community access",
              explanation: "You will have access to a dedicated support team and a thriving online community. You can ask questions, share progress, and get advice from peers and instructors."
            }
          ]
        },
        {
          title: "Setting Up Java Environment",
          duration: "25 min",
          content:
            "Set up your local Java development environment. This lesson walks through installing JDK, configuring IDEs like IntelliJ IDEA or Eclipse, and writing your first Java program.",
          keyPoints: [
            {
              point: "Install Java Development Kit (JDK)",
              explanation: "The JDK is essential for developing Java applications. You will download and install it from Oracle's website and configure it for your operating system."
            },
            {
              point: "Set up IDE for Java (IntelliJ, Eclipse)",
              explanation: "We recommend using IntelliJ IDEA or Eclipse. Both IDEs provide tools for writing, debugging, and testing Java applications, as well as syntax highlighting and code suggestions."
            },
            {
              point: "Understand project structure",
              explanation: "Java projects typically follow a specific structure with directories for source code, compiled code, and resources. You'll learn how to organize your projects effectively."
            },
            {
              point: "Write and run your first Java program",
              explanation: "In this step, you'll create a simple 'Hello World' program to test if your development environment is set up correctly."
            }
          ]
        },
        {
          title: "Java Syntax & Structure",
          duration: "30 min",
          content:
            "Learn the basic syntax and structure of Java programs including keywords, data types, and control statements.",
          keyPoints: [
            {
              point: "Java keywords and naming conventions",
              explanation: "Java has a set of reserved keywords (like `class`, `public`, `private`) that cannot be used as variable names. You'll also learn naming conventions for variables, methods, and classes."
            },
            {
              point: "Primitive types and variables",
              explanation: "Java's primitive types (such as `int`, `float`, `boolean`) represent the most basic data types, and variables are used to store them. You'll learn how to declare, assign, and manipulate variables."
            },
            {
              point: "If-else, switch, and loops",
              explanation: "These control structures allow you to make decisions and repeat actions. You'll learn how to implement conditional statements (if-else, switch) and loops (for, while) in your code."
            },
            {
              point: "Hands-on examples",
              explanation: "In this section, you'll work through practical examples to apply what you've learned and reinforce your understanding of Java syntax and structure."
            }
          ]
        }
      ]
    },
    {
      title: "Object-Oriented Programming in Java",
      lessons: [
        {
          title: "Understanding OOP Concepts",
          duration: "40 min",
          content:
            "Java is built on Object-Oriented Programming. This lesson introduces core OOP concepts like classes, objects, inheritance, and polymorphism.",
          keyPoints: [
            {
              point: "What is OOP and why it matters",
              explanation: "OOP is a programming paradigm that focuses on organizing code around objects rather than actions. It improves modularity, maintainability, and reusability of code."
            },
            {
              point: "Classes and objects in Java",
              explanation: "A class defines the structure of an object, while an object is an instance of that class. You'll learn how to create classes and instantiate objects in Java."
            },
            {
              point: "Encapsulation, inheritance, polymorphism",
              explanation: "Encapsulation hides the internal details of an object, inheritance allows objects to inherit properties from other objects, and polymorphism allows methods to operate differently based on the object."
            },
            {
              point: "Real-world modeling",
              explanation: "You'll learn how to model real-world problems using OOP concepts by designing classes and objects that mimic real-world entities."
            }
          ]
        },
        {
          title: "Classes & Objects in Depth",
          duration: "35 min",
          content:
            "Explore how to define and use classes and objects in Java. Learn about constructors, method overloading, and access modifiers.",
          keyPoints: [
            {
              point: "Declaring and instantiating classes",
              explanation: "In Java, you declare a class using the `class` keyword and instantiate it using the `new` keyword. This allows you to create objects of the class."
            },
            {
              point: "Constructors and overloading",
              explanation: "A constructor is a special method used to initialize objects. Method overloading allows you to define multiple methods with the same name but different parameters."
            },
            {
              point: "Public, private, protected access",
              explanation: "Access modifiers control the visibility of class members (fields and methods). `public` allows access from anywhere, `private` restricts access to within the class, and `protected` allows access within the package or by subclasses."
            },
            {
              point: "Practical use cases",
              explanation: "You'll apply your knowledge of classes and objects in practical coding exercises that reflect real-world scenarios, such as creating a `Car` class or a `Student` class."
            }
          ]
        },
        {
          title: "Inheritance & Polymorphism",
          duration: "45 min",
          content:
            "Master Java’s inheritance model and how polymorphism allows for flexible code reuse and abstraction.",
          keyPoints: [
            {
              point: "Single and multilevel inheritance",
              explanation: "Inheritance allows a class to inherit properties and methods from another class. In single inheritance, a class inherits from one superclass, while multilevel inheritance involves a chain of inheritance."
            },
            {
              point: "Method overriding and super keyword",
              explanation: "Method overriding allows a subclass to provide a specific implementation of a method already defined in its superclass. The `super` keyword refers to the superclass and allows access to its methods and fields."
            },
            {
              point: "Using interfaces",
              explanation: "An interface defines a contract that implementing classes must follow. Interfaces allow for multiple inheritance in Java, enabling a class to implement multiple interfaces."
            },
            {
              point: "Abstraction vs interfaces",
              explanation: "Abstraction allows you to define methods without implementing them, while interfaces define a set of methods that must be implemented by the class. Both promote loose coupling and code reusability."
            }
          ]
        }
      ]
    },
    {
      title: "Core Java Features",
      lessons: [
        {
          title: "Exception Handling",
          duration: "30 min",
          content:
            "Learn how Java handles errors using exceptions. Proper error handling is crucial in robust application development.",
          keyPoints: [
            {
              point: "Try, catch, finally blocks",
              explanation: "The `try` block is used to write code that may throw an exception, the `catch` block handles the exception, and the `finally` block runs code regardless of whether an exception occurred."
            },
            {
              point: "Checked vs unchecked exceptions",
              explanation: "Checked exceptions must be either caught or declared in the method signature, while unchecked exceptions (runtime exceptions) don't need to be explicitly handled."
            },
            {
              point: "Throw and throws keywords",
              explanation: "The `throw` keyword is used to explicitly throw an exception, while `throws` is used in a method signature to indicate that the method might throw an exception."
            },
            {
              point: "Creating custom exceptions",
              explanation: "You can create your own exceptions by extending the `Exception` class, allowing you to define more specific error handling for your application."
            }
          ]
        },
        {
          title: "Collections Framework",
          duration: "50 min",
          content:
            "Dive into Java’s powerful Collections Framework to manage data efficiently using Lists, Sets, Maps, and Queues.",
          keyPoints: [
            {
              point: "List, Set, Map overview",
              explanation: "Java provides various collection types: Lists (ordered), Sets (unique), and Maps (key-value pairs). You'll learn when to use each type based on the use case."
            },
            {
              point: "Iterating through collections",
              explanation: "You can iterate through collections using loops or iterators. You'll learn the `for-each` loop and how to use iterators to access collection elements."
            },
            {
              point: "Generics and type safety",
              explanation: "Generics allow you to define a collection that can store objects of a specific type, providing type safety at compile time and reducing runtime errors."
            },
            {
              point: "Choosing the right collection",
              explanation: "Each collection type is suited for different scenarios. You'll learn when to use a List, Set, or Map based on performance and functionality requirements."
            }
          ]
        },
        {
          title: "Java Streams & Lambda Expressions",
          duration: "40 min",
          content:
            "Learn modern Java features including Lambda expressions and Stream API for functional-style operations on collections.",
          keyPoints: [
            {
              point: "Functional programming intro",
              explanation: "Functional programming emphasizes immutability, higher-order functions, and pure functions. Java's Stream API allows you to process data in a functional style."
            },
            {
              point: "Using lambda expressions",
              explanation: "Lambda expressions provide a concise way to write anonymous methods. They simplify the syntax for passing behavior as parameters to methods."
            },
            {
              point: "Stream operations (filter, map, reduce)",
              explanation: "Streams allow you to chain operations like `filter`, `map`, and `reduce` to perform transformations and calculations on collections in a declarative way."
            },
            {
              point: "Practical examples",
              explanation: "You'll work through real-world examples using Streams and Lambdas to manipulate and process collections of data in a functional style."
            }
          ]
        }
      ]
    },
    {
      title: "Java Projects & Advanced Topics",
      lessons: [
        {
          title: "File Handling in Java",
          duration: "35 min",
          content:
            "Understand how to read and write data to files using Java's I/O classes. Work with text, binary files, and directories.",
          keyPoints: [
            {
              point: "FileReader and FileWriter",
              explanation: "These classes are used for reading from and writing to files. You'll learn how to open, read, and close files in Java."
            },
            {
              point: "Buffered streams",
              explanation: "Buffered streams improve performance by reading or writing data in large chunks rather than one byte at a time."
            },
            {
              point: "Working with directories",
              explanation: "In addition to files, you'll learn how to work with directories to create, delete, and list files within them."
            },
            {
              point: "Exception handling in I/O",
              explanation: "You'll also learn how to handle exceptions when performing file operations, ensuring that your program behaves gracefully even in case of errors."
            }
          ]
        },
        {
          title: "Multithreading Basics",
          duration: "45 min",
          content:
            "Learn the basics of concurrency in Java. Multithreading helps in building responsive and faster applications.",
          keyPoints: [
            {
              point: "Thread class and Runnable interface",
              explanation: "Java allows you to create multithreaded applications using the `Thread` class or by implementing the `Runnable` interface."
            },
            {
              point: "Thread lifecycle",
              explanation: "You'll understand the lifecycle of a thread, including states like new, runnable, blocked, waiting, and terminated."
            },
            {
              point: "Synchronization",
              explanation: "Synchronization ensures that only one thread at a time can access shared resources, preventing data corruption and race conditions."
            },
            {
              point: "Concurrency best practices",
              explanation: "You'll learn best practices for writing safe and efficient multithreaded programs, such as avoiding deadlocks and using thread pools."
            }
          ]
        },
        {
          title: "Mini Project: Java Application",
          duration: "60 min",
          content:
            "Build a complete mini project using everything you've learned. This practical assignment will reinforce your skills and demonstrate your progress.",
          keyPoints: [
            {
              point: "Define project goals and scope",
              explanation: "Before you begin coding, you'll define the scope of your project, including the features and functionality you want to implement."
            },
            {
              point: "Design class structure",
              explanation: "Design the classes and their relationships. This includes identifying the attributes and methods needed for your application."
            },
            {
              point: "Implement features step by step",
              explanation: "Start coding the features one by one. Make sure to test and debug as you go to ensure each feature works as expected."
            },
            {
              point: "Test and optimize the application",
              explanation: "Once the project is complete, you'll thoroughly test it for bugs and optimize its performance before final submission."
            }
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

export default javaCourse;
