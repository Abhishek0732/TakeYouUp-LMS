const webDevCourse = {
  id: "webdev-101",
  title: "Web Development Mastery",
  description:
    "Master the art of building full-stack web applications from scratch. Learn front-end technologies like HTML, CSS, JavaScript, and back-end technologies like Node.js and Express. Build real-world projects and ace your technical interviews.",
  level: "Beginner to Advanced",
  duration: "12 weeks",
  students: 1_200,
  rating: 4.9,
  image:
    "https://images.unsplash.com/photo-1501594907354-1b120f285ca9?w=1200&h=600&fit=crop",
  instructor: "John Doe",
  price: "$99",
  modules: [
    {
      title: "Getting Started with Web Development",
      lessons: [
        {
          title: "Introduction to Web Development",
          duration: "15 min",
          content:
            "Get an overview of the web development ecosystem. Learn about front-end vs back-end, and the tools and technologies used in modern web development.",
          keyPoints: [
            { point: "Understanding Front-End vs Back-End", explanation: "Learn the difference between front-end (user-facing) and back-end (server-side) development." },
            { point: "Tools of the Trade", explanation: "Overview of essential tools like text editors, version control systems, and package managers." }
          ]
        },
        {
          title: "Setting Up Your Development Environment",
          duration: "30 min",
          content:
            "Set up your local environment, including installing text editors (VSCode), Git, and setting up GitHub for version control.",
          keyPoints: [
            { point: "Install VSCode and Git", explanation: "Instructions on installing Visual Studio Code and Git for code editing and version control." },
            { point: "GitHub Setup", explanation: "Learn how to set up a GitHub account and create repositories to store your projects." }
          ]
        },
        {
          title: "Basic HTML and CSS",
          duration: "45 min",
          content:
            "Learn the basics of HTML and CSS to create a simple webpage. Understand HTML structure, tags, and how to style your webpage using CSS.",
          keyPoints: [
            { point: "HTML Structure", explanation: "Learn about the basic structure of an HTML document: DOCTYPE, head, body, and tags." },
            { point: "CSS for Styling", explanation: "Explore how to apply styles using CSS selectors, classes, and IDs." },
            { point: "Responsive Design", explanation: "Learn the fundamentals of making web pages responsive using media queries." }
          ]
        }
      ]
    },
    {
      title: "JavaScript for Front-End Development",
      lessons: [
        {
          title: "JavaScript Basics",
          duration: "60 min",
          content:
            "Get familiar with JavaScript syntax, data types, operators, and control structures like loops and conditionals.",
          keyPoints: [
            { point: "JavaScript Syntax", explanation: "Learn the syntax of JavaScript: variables, functions, and expressions." },
            { point: "Control Structures", explanation: "Understand how to use loops (for, while) and conditionals (if, switch) in JavaScript." }
          ]
        },
        {
          title: "DOM Manipulation",
          duration: "45 min",
          content:
            "Learn how to interact with the Document Object Model (DOM) to manipulate the content and structure of your webpage dynamically.",
          keyPoints: [
            { point: "Accessing DOM Elements", explanation: "Learn how to select HTML elements using JavaScript (getElementById, querySelector)." },
            { point: "Event Handling", explanation: "Understand how to add event listeners and handle user interactions like clicks and key presses." },
            { point: "Manipulating HTML Content", explanation: "Learn how to modify HTML content, add elements, and remove them dynamically." }
          ]
        },
        {
          title: "JavaScript Functions & ES6 Features",
          duration: "60 min",
          content:
            "Understand how to write functions in JavaScript, including advanced features like arrow functions, template literals, destructuring, and more.",
          keyPoints: [
            { point: "Writing Functions", explanation: "Learn how to define and invoke functions, including parameters and return values." },
            { point: "Arrow Functions", explanation: "Get familiar with ES6 arrow functions for shorter syntax and lexical scoping of `this`." },
            { point: "ES6 Features", explanation: "Explore features like template literals, destructuring, spread/rest operators, and default parameters." }
          ]
        }
      ]
    },
    {
      title: "Back-End Development with Node.js",
      lessons: [
        {
          title: "Introduction to Node.js",
          duration: "45 min",
          content:
            "Learn what Node.js is and how it allows you to run JavaScript on the server. Set up a basic Node.js server and understand its event-driven architecture.",
          keyPoints: [
            { point: "Node.js Setup", explanation: "Learn how to install Node.js and create your first server with the `http` module." },
            { point: "Event-Driven Architecture", explanation: "Understand the event loop and callback functions in Node.js." }
          ]
        },
        {
          title: "Express.js for Building Web Servers",
          duration: "60 min",
          content:
            "Learn Express.js, a minimalist framework for building web applications. Set up routes, handle requests, and create RESTful APIs.",
          keyPoints: [
            { point: "Setting Up Express", explanation: "Learn how to set up an Express.js project and create a simple server." },
            { point: "Routes and Middleware", explanation: "Understand how to define routes and middleware for handling HTTP requests." },
            { point: "RESTful APIs", explanation: "Learn how to build REST APIs with GET, POST, PUT, DELETE operations for handling resources." }
          ]
        },
        {
          title: "Database Integration with MongoDB",
          duration: "75 min",
          content:
            "Learn how to integrate MongoDB, a NoSQL database, with your Node.js application. Understand CRUD operations and data modeling in MongoDB.",
          keyPoints: [
            { point: "Setting Up MongoDB", explanation: "Learn how to install MongoDB and connect it to your Node.js application using Mongoose." },
            { point: "CRUD Operations", explanation: "Learn how to perform Create, Read, Update, and Delete operations on MongoDB documents." },
            { point: "Data Modeling", explanation: "Understand how to structure data and define schemas in MongoDB using Mongoose." }
          ]
        }
      ]
    },
    {
      title: "Full-Stack Project Development",
      lessons: [
        {
          title: "Building a Full-Stack Web App",
          duration: "90 min",
          content:
            "Learn how to build a full-stack web application using HTML, CSS, JavaScript, Node.js, Express, and MongoDB. Understand the concepts of connecting the front-end and back-end.",
          keyPoints: [
            { point: "Project Setup", explanation: "Learn how to set up a full-stack project with separate front-end and back-end directories." },
            { point: "Connecting Front-End and Back-End", explanation: "Understand how to send and receive data between the front-end (using Fetch or Axios) and back-end (using Express APIs)." },
            { point: "Authentication and Authorization", explanation: "Implement user authentication using JWT (JSON Web Tokens) for secure access control." }
          ]
        },
        {
          title: "Deploying Your Web Application",
          duration: "60 min",
          content:
            "Learn how to deploy your web application to platforms like Heroku or Netlify. Understand deployment, versioning, and scaling techniques.",
          keyPoints: [
            { point: "Heroku Deployment", explanation: "Step-by-step guide to deploying your Node.js app to Heroku." },
            { point: "Netlify Deployment", explanation: "Learn how to deploy your front-end on Netlify and connect it to your back-end." },
            { point: "Continuous Integration", explanation: "Understand the importance of CI/CD pipelines and how to set them up for smooth deployments." }
          ]
        }
      ]
    }
  ],
  features: [
    "Hands-on coding exercises",
    "Mini projects and real-world applications",
    "Interview preparation",
    "Certificate of completion",
    "Lifetime access",
    "Community support and live Q&A"
  ]
};

export default webDevCourse;
