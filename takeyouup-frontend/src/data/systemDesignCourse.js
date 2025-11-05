const systemDesignCourse = {
  id: "system-design-101",
  slug: "system-design-mastery",
  title: "System Design Mastery",
  description:
    "Learn how to design scalable, reliable, and maintainable systems. This course covers high-level & low-level design, distributed architecture, trade-offs, real-world case studies, and interview strategies.",
  category: "Development",
  level: "Intermediate to Advanced",
  duration: "8 weeks",
  students: 650,
  rating: 4.8,
  image:
    "https://images.unsplash.com/photo-1581092338158-76a6820cbd93?auto=format&fit=crop&w=1200&h=600&q=80",
  instructor: "Arun Kumar",
  price: "$129",
  modules: [
    {
      title: "Introduction & Foundations",
      lessons: [
        {
          title: "What is System Design?",
          duration: "30 min",
          content:
            "Understand the meaning and importance of system design. Learn where it is used — in building large-scale applications, microservices, cloud infrastructure — and the qualities a good design must satisfy.",
          keyPoints: [
            {
              point: "Definition & Scope",
              explanation: `
System design is the process of defining the architecture, components, modules, interfaces, and data for a system to satisfy specified requirements. It covers both what the system should do (functional) and how it should behave under various constraints (non-functional). You’ll learn how to take a vague requirement and break it down into systems and sub-systems that work together.
`
            },
            {
              point: "Non‑Functional Requirements",
              explanation: `
Non-functional requirements (NFRs) are critical in system design: things like latency (how fast responses should be), throughput (requests per second), availability (uptime), durability, consistency vs partition tolerance, and cost constraints. This key point teaches you to identify, prioritize, and reason about these criteria in your designs.
`
            },
            {
              point: "Trade‑offs",
              explanation: `
In system design, there’s rarely a perfect solution. For every decision, you’ll encounter trade-offs. For example, choosing strong consistency may slow down throughput or increase complexity. High availability may cost more. Learning how to weigh these trade-offs and justify your decisions is a critical skill.
`
            }
          ]
        },
        {
          title: "High-Level vs Low-Level Design (HLD & LLD)",
          duration: "40 min",
          content:
            "Distinguish between High‑Level Design (overall system architecture, components, services) and Low‑Level Design (data models, classes, APIs). Understand their roles in interviews and real systems.",
          keyPoints: [
            {
              point: "Role of HLD",
              explanation: `
High-Level Design gives a bird’s-eye view of your system: what components it has (front-end, back-end, database, caching layer, etc.), how they interact, data flow, and boundaries. It's about organizing the system into modules and defining interfaces, not the inner details.
`
            },
            {
              point: "Role of LLD",
              explanation: `
Low-Level Design dives into the internal structure of each component: classes, modules, interfaces, APIs, data structures, method signatures. It’s how you'll design the internals of individual services or modules.
`
            },
            {
              point: "When to Use Each",
              explanation: `
In interviews and real projects, you often begin with HLD to lay the foundation, then zoom into LLD to flesh out specific components that matter. Interviewers may ask you to switch between these levels depending on the question.
`
            }
          ]
        }
      ]
    },
    {
      title: "Core Components of Scalable Systems",
      lessons: [
        {
          title: "Load Balancing, Caching & CDNs",
          duration: "50 min",
          content:
            "Learn how load balancers distribute traffic among servers, how caching reduces latency, and how CDNs help deliver content globally closer to users.",
          keyPoints: [
            {
              point: "Load Balancing Techniques",
              explanation: `
Load balancing spreads incoming requests across multiple backend servers to prevent any single server from becoming a bottleneck. Techniques include round robin, least connections, IP-hash, with health checks to direct traffic away from unhealthy nodes.
`
            },
            {
              point: "Caching Layers",
              explanation: `
Caching involves storing responses or data closer to where it's needed (in-memory, edge, browser) to reduce latency on repeated requests. You'll examine different caching layers (client cache, server-side cache, distributed caches) and challenges like cache invalidation and ensuring data consistency.
`
            },
            {
              point: "CDN & Edge Caching",
              explanation: `
Content Delivery Networks replicate static content (images, videos, CSS, JS) across many geographic locations (edge servers) to serve users faster. Understand how CDNs work with origin servers, cache expiration, and how they improve global performance.
`
            }
          ]
        },
        {
          title: "Databases: SQL, NoSQL & Data Partitioning",
          duration: "60 min",
          content:
            "Explore relational (SQL) and non‑relational (NoSQL) databases, how to model data, and strategies to partition (shard) and scale data across distributed systems.",
          keyPoints: [
            {
              point: "SQL vs NoSQL",
              explanation: `
SQL (relational) databases have fixed schema, support complex joins, ACID transactions. NoSQL (document, key-value, wide column) is schema-flexible, designed for horizontal scalability. You’ll learn their trade-offs and when to choose which.
`
            },
            {
              point: "Sharding & Partitioning",
              explanation: `
Sharding (horizontal partitioning) splits a large dataset across multiple machines based on key ranges or hashing. You’ll learn strategies (range-based, hash-based, directory-based) and how to route queries correctly.
`
            },
            {
              point: "Replication & Consistency",
              explanation: `
Replication copies data across multiple nodes to improve read throughput and fault tolerance. But you need to decide consistency-levels: strong, eventual, read-your-writes, etc. You'll also learn about leader-follower setups, and conflict resolution.
`
            }
          ]
        }
      ]
    },
    {
      title: "Distributed Systems & Non‑Functional Aspects",
      lessons: [
        {
          title: "Consistency, Availability & Partition Tolerance (CAP Theorem)",
          duration: "45 min",
          content:
            "Understand the CAP theorem and how distributed systems can trade off consistency, availability, and partition tolerance. Learn realistic strategies when you can’t satisfy all.",
          keyPoints: [
            {
              point: "CAP Theorem Basics",
              explanation: `
CAP theorem states that in the presence of a network partition, a distributed system must choose between consistency (all nodes see same data) or availability (servers respond). You’ll learn when and how systems make that choice.
`
            },
            {
              point: "Real‑World Examples",
              explanation: `
Systems like Cassandra, DynamoDB, MongoDB choose different points on the CAP trade-off. You’ll see examples of how Amazon, Google, others make consistency/availability choices in practice.
`
            }
          ]
        },
        {
          title: "Scalability & Fault Tolerance",
          duration: "50 min",
          content:
            "Learn how to build systems that scale with traffic and gracefully handle failures via redundancy, retries, circuit breakers, and more.",
          keyPoints: [
            {
              point: "Horizontal vs Vertical Scaling",
              explanation: `
Vertical scaling means more powerful machines; horizontal scaling means more machines. You’ll learn the trade-offs, limits, and when to use each strategy.
`
            },
            {
              point: "Redundancy & Failover",
              explanation: `
To maintain availability, systems duplicate components. You’ll study active-active, active-passive setups, health checks, failover mechanisms, and how to switch to backups seamlessly.
`
            },
            {
              point: "Graceful Degradation & Retry Logic",
              explanation: `
When parts of the system fail, graceful degradation ensures partial functionality remains. Also, designing retry policies (exponential backoff, circuit breakers) ensures you don’t overload failing components.
`
            }
          ]
        }
      ]
    },
    {
      title: "Design Patterns & API Principles",
      lessons: [
        {
          title: "Microservices, Monoliths & Service‑Oriented Architecture",
          duration: "50 min",
          content:
            "Compare architectural styles: monolithic apps, microservices, service-oriented designs. Learn how to choose an architecture and define service boundaries and interaction patterns.",
          keyPoints: [
            {
              point: "Monolith vs Microservices",
              explanation: `
Monolithic architecture bundles all functionality in a single deployable unit — easier to build and test. Microservices break the system into small services — better scalability, independent deployment, but introduce complexity (networking, data consistency).
`
            },
            {
              point: "Service Boundaries & Communication",
              explanation: `
You’ll learn how to draw boundaries between services, decide synchronous (REST/gRPC) vs asynchronous (message queues) communication, handle API contracts, versioning, and backward compatibility.
`
            },
            {
              point: "Service Discovery & Versioning",
              explanation: `
In dynamic environments, services appear/disappear. You'll learn how service discovery (DNS, registries) works and strategies for evolving APIs without breaking clients.
`
            }
          ]
        },
        {
          title: "API Design & Rate Limiting",
          duration: "45 min",
          content:
            "Dive into best practices for designing APIs: endpoint naming, versioning, rate limits, authentication, error handling, and how to secure and monitor APIs.",
          keyPoints: [
            {
              point: "REST vs RPC vs GraphQL",
              explanation: `
REST is resource-based, RPC is procedure-based, GraphQL offers flexible queries. You’ll compare these styles, see where each works best, and understand trade-offs.
`
            },
            {
              point: "Rate Limiting Strategies",
              explanation: `
Rate limiting protects your system from abuse. You’ll learn techniques like token bucket, leaky bucket, fixed window, sliding window, and how to apply them per user or per IP.
`
            },
            {
              point: "Security & Authentication",
              explanation: `
You’ll study how to secure APIs: use tokens (JWT/OAuth), encrypt data, validate input, avoid common vulnerabilities (injection, CSRF, CORS), and audit logs.
`
            }
          ]
        }
      ]
    },
    {
      title: "Case Studies & Interview Prep",
      lessons: [
        {
          title: "Design a URL Shortener",
          duration: "60 min",
          content:
            "Walk through the architecture of a URL shortening service: code generation, redirects, storage, scaling, and caching. You’ll design end-to-end system and identify bottlenecks.",
          keyPoints: [
            {
              point: "Short Code Generation",
              explanation: `
Design how to generate unique, non-colliding short codes (using base62, hashing, random generation) and handle collisions or expiry.
`
            },
            {
              point: "Storage & Scaling",
              explanation: `
Decide what data to store (short → long URL mapping), where (SQL, NoSQL), how to scale reads/writes, use caching for frequent short URLs.
`
            },
            {
              point: "Hot URL Handling",
              explanation: `
Some short URLs become extremely popular (“hot keys”). You’ll design caching, replication, rate limiting, and load balancing strategies to handle that traffic.
`
            }
          ]
        },
        {
          title: "Design a Social Media Feed",
          duration: "75 min",
          content:
            "Architect a scalable feed system: generating personalized content, caching timelines, balancing freshness and personalization, and managing writes/reads across millions of users.",
          keyPoints: [
            {
              point: "Feed Generation Models",
              explanation: `
Push model computes feed updates actively when users post; pull model computes on demand when user visits. Each has trade-offs in latency and cost.
`
            },
            {
              point: "Ranking & Personalization",
              explanation: `
You’ll incorporate user behavior signals (likes, follows, recency) to rank posts. Learn scoring functions, heuristics, and ML-based ranking models.
`
            },
            {
              point: "Scaling Reads & Writes",
              explanation: `
You’ll design how to partition user feeds, replicate data, cache frequently accessed feeds, and manage consistency across partitions.
`
            }
          ]
        },
        {
          title: "System Design Interview Tips",
          duration: "45 min",
          content:
            "Get ready for system design interviews: clarify requirements, draw diagrams, explain trade-offs, and communicate your design decisions clearly.",
          keyPoints: [
            {
              point: "Clarify & Ask Requirements",
              explanation: `
In interviews, many candidates assume requirements. You should ask: data volume, read/write ratio, availability targets, latency, scale expectations, constraints.
`
            },
            {
              point: "Sketch Clear Diagrams",
              explanation: `
Use boxes, arrows, labels. Show client, services, databases, caches. Illustrate data flow, interaction, error paths. Clean sketches make understanding easier.
`
            },
            {
              point: "Discuss Trade‑offs",
              explanation: `
Always explain your decisions: where you chose availability over consistency, caching vs staleness, simpler vs more complex systems. Interviewers want to see thought process.
`
            }
          ]
        }
      ]
    }
  ],
  features: [
    "Hands‑on system design projects",
    "Real interview case studies",
    "Design templates & best practices",
    "API & architecture design",
    "Mock interviews & feedback",
    "Certificate of completion",
    "Lifetime access",
    "Community Q&A"
  ]
};

export default systemDesignCourse;
