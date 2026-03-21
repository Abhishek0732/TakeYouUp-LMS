import { useParams, Link } from "react-router-dom"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ArrowLeft, Clock, Users, Star, CheckCircle2, PlayCircle, FileText, Award, ChevronRight } from "lucide-react"

import javaCourse from '../data/javaCourse';
import pythonCourse from '../data/pythonCourse';
import webDevCourse from '../data/webDevCourse';
import machineCourse from '../data/machineLearningCourse';
import systemDesignCourse from '../data/systemDesignCourse';

import dsaInterview from '../data/dsaInterview';

const InterviewPrepDetail = () => {
  const { id } = useParams()
  const [selectedLesson, setSelectedLesson] = useState({ moduleIndex: 0, lessonIndex: 0 })

  let course = {};

  if(id == '1') {
    course = dsaInterview;
  } else if(id == '3') {
    course = javaCourse;
  } else if(id == '2') {
    course = pythonCourse;
  } else if(id == '4') {
    course = webDevCourse;
  } else if(id == '5') {
    course = machineCourse;
  } else if(id == '6') {
    course = systemDesignCourse;
  } else {
    course = {
      id: id,
      title: "Data Structures & Algorithms",
      description: "Master data structures and algorithms with comprehensive hands-on practice. This course covers everything from basic arrays to advanced graph algorithms, preparing you for technical interviews and real-world problem-solving.",
      level: "Intermediate",
      duration: "12 weeks",
      students: 1200,
      rating: 4.8,
      image: "https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=1200&h=600&fit=crop",
      instructor: "Alex Johnson",
      price: "$99",
      modules: [
        {
          title: "Introduction to DSA",
          lessons: [
            {
              title: "Course Overview",
              duration: "15 min",
              content: "Welcome to Data Structures & Algorithms! In this comprehensive course, you'll learn the fundamental concepts that power modern software development. We'll cover everything from basic data structures to advanced algorithmic techniques used by tech giants like Google, Facebook, and Amazon.",
              keyPoints: [
                "Understanding what DSA is and why it matters",
                "Overview of course structure and learning path",
                "Setting expectations and learning outcomes",
                "How to get the most out of this course"
              ]
            },
            {
              title: "Setup Environment",
              duration: "20 min",
              content: "Get your development environment ready for the course. We'll walk through installing necessary tools, setting up your IDE, and configuring everything you need to start coding along with the lessons.",
              keyPoints: [
                "Install required software and tools",
                "Configure your IDE for optimal learning",
                "Set up debugging and testing environment",
                "Access course materials and resources"
              ]
            },
            {
              title: "Big O Notation",
              duration: "30 min",
              content: "Master the language of algorithm efficiency. Big O notation is crucial for analyzing and comparing algorithms. You'll learn to identify time and space complexity, making you better at writing efficient code.",
              keyPoints: [
                "Understanding asymptotic analysis",
                "Common complexity classes (O(1), O(n), O(log n), etc.)",
                "Best, average, and worst-case scenarios",
                "Practical examples and problem-solving"
              ]
            },
            {
              title: "Time & Space Complexity",
              duration: "25 min",
              content: "Deep dive into analyzing the efficiency of algorithms. Learn how to calculate time and space complexity, and understand the trade-offs between them in real-world applications.",
              keyPoints: [
                "Calculating time complexity step by step",
                "Understanding space complexity and memory usage",
                "Trade-offs between time and space",
                "Optimization techniques and best practices"
              ]
            }
          ]
        },
        {
          title: "Arrays & Strings",
          lessons: [
            {
              title: "Array Basics",
              duration: "35 min",
              content: "Master the fundamentals of arrays, one of the most important data structures. Learn about array operations, memory representation, and common patterns used in technical interviews.",
              keyPoints: [
                "Array declaration and initialization",
                "Accessing and modifying elements",
                "Common array operations and their complexity",
                "Solving classic array problems"
              ]
            },
            {
              title: "Two Pointers",
              duration: "40 min",
              content: "Learn the powerful two-pointer technique for solving array problems efficiently. This technique is widely used in coding interviews and can reduce time complexity significantly.",
              keyPoints: [
                "Understanding the two-pointer pattern",
                "Solving problems with opposite direction pointers",
                "Same direction pointer techniques",
                "Practice problems and variations"
              ]
            },
            {
              title: "Sliding Window",
              duration: "45 min",
              content: "Master the sliding window technique for handling subarray problems. This optimization technique is essential for achieving optimal time complexity in many array and string problems.",
              keyPoints: [
                "Fixed and variable window sizes",
                "Identifying sliding window problems",
                "Implementation patterns and templates",
                "Advanced sliding window techniques"
              ]
            },
            {
              title: "String Manipulation",
              duration: "30 min",
              content: "Explore string operations and common patterns. Learn efficient techniques for string manipulation that are frequently tested in coding interviews.",
              keyPoints: [
                "String operations and methods",
                "Pattern matching algorithms",
                "String transformation techniques",
                "Handling edge cases in string problems"
              ]
            }
          ]
        },
        {
          title: "Linked Lists",
          lessons: [
            {
              title: "Singly Linked Lists",
              duration: "40 min",
              content: "Understand singly linked lists and their operations. Learn to implement and manipulate this fundamental data structure that forms the basis of many advanced structures.",
              keyPoints: [
                "Node structure and list implementation",
                "Insertion and deletion operations",
                "Traversal and searching techniques",
                "Common linked list problems"
              ]
            },
            {
              title: "Doubly Linked Lists",
              duration: "35 min",
              content: "Explore doubly linked lists and their advantages. Learn when to use them and how they differ from singly linked lists in terms of operations and memory.",
              keyPoints: [
                "Understanding bidirectional pointers",
                "Implementation and operations",
                "Comparison with singly linked lists",
                "Real-world applications"
              ]
            },
            {
              title: "Reversal Techniques",
              duration: "30 min",
              content: "Master various techniques for reversing linked lists. This is one of the most common interview questions and teaches important pointer manipulation skills.",
              keyPoints: [
                "Iterative reversal approach",
                "Recursive reversal technique",
                "Reversing in groups",
                "In-place vs creating new lists"
              ]
            },
            {
              title: "Practice Problems",
              duration: "50 min",
              content: "Apply your knowledge to solve a variety of linked list problems. Practice is key to mastering linked lists and their manipulation techniques.",
              keyPoints: [
                "Cycle detection problems",
                "Merging linked lists",
                "Finding middle element",
                "Interview-level problem solving"
              ]
            }
          ]
        },
        {
          title: "Trees & Graphs",
          lessons: [
            {
              title: "Binary Trees",
              duration: "45 min",
              content: "Explore binary trees and their properties. Learn different traversal methods and understand how trees are used to represent hierarchical data.",
              keyPoints: [
                "Tree terminology and properties",
                "Inorder, preorder, and postorder traversals",
                "Level order traversal",
                "Tree construction and manipulation"
              ]
            },
            {
              title: "BST Operations",
              duration: "40 min",
              content: "Master Binary Search Trees and their operations. BSTs are crucial for efficient searching, insertion, and deletion operations.",
              keyPoints: [
                "BST properties and invariants",
                "Search, insert, and delete operations",
                "Finding min/max and successor/predecessor",
                "Balancing concepts"
              ]
            },
            {
              title: "Graph Traversal",
              duration: "50 min",
              content: "Learn fundamental graph traversal algorithms. BFS and DFS are essential for solving a wide variety of graph problems.",
              keyPoints: [
                "Graph representation methods",
                "Breadth-First Search (BFS)",
                "Depth-First Search (DFS)",
                "Applications and problem-solving"
              ]
            },
            {
              title: "Advanced Graph Algorithms",
              duration: "60 min",
              content: "Dive into advanced graph algorithms including shortest paths and minimum spanning trees. These algorithms have numerous real-world applications.",
              keyPoints: [
                "Dijkstra's shortest path algorithm",
                "Bellman-Ford algorithm",
                "Minimum spanning trees",
                "Topological sorting"
              ]
            }
          ]
        },
        {
          title: "Dynamic Programming",
          lessons: [
            {
              title: "DP Fundamentals",
              duration: "50 min",
              content: "Understand the core concepts of dynamic programming. Learn to identify problems that can be solved using DP and understand the principles of optimal substructure.",
              keyPoints: [
                "What is dynamic programming?",
                "Overlapping subproblems",
                "Optimal substructure property",
                "When to use DP"
              ]
            },
            {
              title: "Memoization",
              duration: "40 min",
              content: "Master the top-down approach to dynamic programming. Memoization helps optimize recursive solutions by caching results.",
              keyPoints: [
                "Top-down DP approach",
                "Implementing memoization",
                "Converting recursion to memoized DP",
                "Space optimization techniques"
              ]
            },
            {
              title: "Tabulation",
              duration: "45 min",
              content: "Learn the bottom-up approach to dynamic programming. Tabulation is often more efficient and easier to optimize for space complexity.",
              keyPoints: [
                "Bottom-up DP approach",
                "Building the DP table",
                "Converting memoization to tabulation",
                "Space-optimized solutions"
              ]
            },
            {
              title: "Classic DP Problems",
              duration: "60 min",
              content: "Apply DP to solve classic problems. Practice with problems that frequently appear in coding interviews and develop pattern recognition skills.",
              keyPoints: [
                "Knapsack problem variations",
                "Longest common subsequence",
                "Coin change problem",
                "Matrix chain multiplication"
              ]
            }
          ]
        }
      ],
      features: [
        "100+ coding problems",
        "Live doubt sessions",
        "Interview preparation",
        "Certificate of completion",
        "Lifetime access",
        "Project-based learning"
      ]
    }
  }

  const currentLesson = course.modules[selectedLesson.moduleIndex]?.lessons[selectedLesson.lessonIndex]
  const currentModule = course.modules[selectedLesson.moduleIndex]
  const handleLessonClick = (moduleIndex: number, lessonIndex: number) => setSelectedLesson({ moduleIndex, lessonIndex })

  const cardStyle: React.CSSProperties = { background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 16 };

  return (
    <div style={{ minHeight: "100vh", background: "hsl(var(--background))" }}>
      {/* Mini header */}
      <div style={{ borderBottom: "1px solid hsl(var(--border))", padding: "12px 0", background: "hsl(var(--card))" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <Link to="/interview-prep" style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 13, color: "hsl(var(--muted-foreground))", textDecoration: "none", fontFamily: "'DM Sans', sans-serif" }}
            className="hover:text-orange-500 transition-colors">
            <ArrowLeft style={{ width: 15, height: 15 }} /> Back to Interview Prep
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-4">
            <div style={{ ...cardStyle, position: "sticky", top: 80 }}>
              <div style={{ padding: "20px 20px 12px" }}>
                <h3 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: "1rem", marginBottom: 4 }}>
                  {course.title}
                </h3>
                <p style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: "hsl(var(--muted-foreground))" }}>
                  {course.modules.reduce((acc: number, m: any) => acc + m.lessons.length, 0)} topics
                </p>
              </div>
              <ScrollArea style={{ height: "calc(100vh - 260px)" }}>
                <div style={{ padding: "0 12px 16px" }}>
                  {course.modules.map((module: any, mIdx: number) => (
                    <div key={mIdx} style={{ marginBottom: 8 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 10px", background: "hsl(var(--muted))", borderRadius: 8, marginBottom: 4 }}>
                        <FileText style={{ width: 13, height: 13, color: "#ff4d1c", flexShrink: 0 }} />
                        <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 600, fontSize: 12 }}>{module.title}</span>
                      </div>
                      {module.lessons.map((lesson: any, lIdx: number) => {
                        const isActive = selectedLesson.moduleIndex === mIdx && selectedLesson.lessonIndex === lIdx;
                        return (
                          <button key={lIdx} onClick={() => handleLessonClick(mIdx, lIdx)}
                            style={{
                              width: "100%", textAlign: "left", padding: "8px 10px", borderRadius: 8, border: "none", cursor: "pointer",
                              display: "flex", alignItems: "center", gap: 6, fontSize: 12, transition: "all 0.15s",
                              fontFamily: "'DM Sans', sans-serif", marginBottom: 2,
                              background: isActive ? "#ff4d1c" : "transparent",
                              color: isActive ? "white" : "hsl(var(--muted-foreground))",
                            }}>
                            <ChevronRight style={{ width: 11, height: 11, flexShrink: 0, transform: isActive ? "rotate(90deg)" : "none", transition: "transform 0.15s" }} />
                            <span style={{ flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{lesson.title}</span>
                          </button>
                        );
                      })}
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>
          </div>

          {/* Main content */}
          <div className="lg:col-span-8 space-y-5">
            {currentLesson && (
              <>
                <div style={cardStyle}>
                  <div style={{ padding: "24px 28px" }}>
                    <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: "1.4rem", marginBottom: 16 }}>{currentLesson.title}</h2>
                    {currentLesson.content && (
                      <p style={{ color: "hsl(var(--muted-foreground))", lineHeight: 1.75, fontSize: "0.95rem", marginBottom: 24 }}>{currentLesson.content}</p>
                    )}
                    {currentLesson.keyPoints?.length > 0 && (
                      <div>
                        <h3 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: "1rem", marginBottom: 14 }}>Key Points</h3>
                        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                          {currentLesson.keyPoints.map((point: any, i: number) => (
                            <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
                              <div style={{ marginTop: 3, flexShrink: 0, width: 20, height: 20, borderRadius: "50%", background: "rgba(255,77,28,0.12)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                <CheckCircle2 style={{ width: 12, height: 12, color: "#ff4d1c" }} />
                              </div>
                              <div>
                                {typeof point === "string"
                                  ? <p style={{ fontSize: "0.88rem", lineHeight: 1.6 }}>{point}</p>
                                  : <>
                                      <p style={{ fontWeight: 600, fontSize: "0.9rem", marginBottom: 2 }}>{point.point}</p>
                                      {point.explanation && <p style={{ fontSize: "0.82rem", color: "hsl(var(--muted-foreground))", lineHeight: 1.6 }}>{point.explanation}</p>}
                                    </>
                                }
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Nav buttons */}
                <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
                  <button
                    onClick={() => {
                      if (selectedLesson.lessonIndex > 0) handleLessonClick(selectedLesson.moduleIndex, selectedLesson.lessonIndex - 1);
                      else if (selectedLesson.moduleIndex > 0) { const pm = course.modules[selectedLesson.moduleIndex - 1]; handleLessonClick(selectedLesson.moduleIndex - 1, pm.lessons.length - 1); }
                    }}
                    disabled={selectedLesson.moduleIndex === 0 && selectedLesson.lessonIndex === 0}
                    style={{ display: "flex", alignItems: "center", gap: 6, padding: "10px 20px", borderRadius: 10, border: "1.5px solid hsl(var(--border))", background: "transparent", cursor: "pointer", fontFamily: "'Syne', sans-serif", fontWeight: 600, fontSize: 13, opacity: (selectedLesson.moduleIndex === 0 && selectedLesson.lessonIndex === 0) ? 0.4 : 1, color: "hsl(var(--foreground))" }}
                  >
                    <ArrowLeft style={{ width: 14, height: 14 }} /> Previous
                  </button>
                  <button
                    onClick={() => {
                      if (selectedLesson.lessonIndex < currentModule.lessons.length - 1) handleLessonClick(selectedLesson.moduleIndex, selectedLesson.lessonIndex + 1);
                      else if (selectedLesson.moduleIndex < course.modules.length - 1) handleLessonClick(selectedLesson.moduleIndex + 1, 0);
                    }}
                    disabled={selectedLesson.moduleIndex === course.modules.length - 1 && selectedLesson.lessonIndex === currentModule.lessons.length - 1}
                    style={{ display: "flex", alignItems: "center", gap: 6, padding: "10px 20px", borderRadius: 10, border: "none", background: "linear-gradient(135deg, #ff4d1c, #ffb800)", cursor: "pointer", fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 13, color: "white", opacity: (selectedLesson.moduleIndex === course.modules.length - 1 && selectedLesson.lessonIndex === currentModule.lessons.length - 1) ? 0.4 : 1 }}
                  >
                    Next Topic <ChevronRight style={{ width: 14, height: 14 }} />
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default InterviewPrepDetail
