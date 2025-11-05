import { useParams, Link } from "react-router-dom"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ArrowLeft, Clock, Users, Star, CheckCircle2, PlayCircle, FileText, Award, ChevronRight } from "lucide-react"

import javaCourse from '../data/javaCourse';
import pythonCourse from '../data/pythonCourse';
import dsaCourse from '../data/dsaCourse';
import webDevCourse from '../data/webDevCourse';
import machineCourse from '../data/machineLearningCourse';
import systemDesignCourse from '../data/systemDesignCourse';

const CourseDetail = () => {
  const { id } = useParams()
  const [selectedLesson, setSelectedLesson] = useState({ moduleIndex: 0, lessonIndex: 0 })

  let course = {};

  if(id == '1') {
    course = dsaCourse;
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

  const handleLessonClick = (moduleIndex: number, lessonIndex: number) => {
    setSelectedLesson({ moduleIndex, lessonIndex })
  }

  return (
    <div className="min-h-screen">
      {/* Back Button */}
      <div className="container mx-auto px-4 py-6">
        <Button asChild variant="ghost" className="group">
          <Link to="/courses">
            <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
            Back to Courses
          </Link>
        </Button>
      </div>

      {/* Hero Section */}
      <div className="relative h-[40px] overflow-hidden">
        
        <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/80 to-background/50">
          <div className="container mx-auto px-4 h-full flex items-center">
            <div className="max-w-3xl space-y-4 animate-fade-in">
              <h1 className="text-3xl md:text-4xl font-bold">{course.title}</h1>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area with Sidebar */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Sidebar - Topics */}
          <div className="lg:col-span-4">
            <Card className="sticky top-20 border-border">
              <CardHeader>
                <CardTitle className="text-xl">Course Content</CardTitle>
                <p className="text-sm text-muted-foreground">
                  {course.modules.reduce((acc, m) => acc + m.lessons.length, 0)} lessons
                </p>
              </CardHeader>
              <CardContent className="p-0">
                <ScrollArea className="h-[calc(100vh-300px)]">
                  <div className="space-y-1 px-4 pb-4">
                    {course.modules.map((module, moduleIndex) => (
                      <div key={moduleIndex} className="space-y-1">
                        <div className="flex items-center gap-2 py-2 px-3 bg-muted/30 rounded-lg">
                          <FileText className="h-4 w-4 text-primary flex-shrink-0" />
                          <span className="font-semibold text-sm">{module.title}</span>
                        </div>
                        {module.lessons.map((lesson, lessonIndex) => {
                          const isActive = selectedLesson.moduleIndex === moduleIndex && 
                                         selectedLesson.lessonIndex === lessonIndex
                          return (
                            <button
                              key={lessonIndex}
                              onClick={() => handleLessonClick(moduleIndex, lessonIndex)}
                              className={`w-full text-left py-2 px-3 rounded-lg transition-all text-sm flex items-center gap-2 group ${
                                isActive
                                  ? 'bg-primary text-primary-foreground'
                                  : 'hover:bg-muted/50 text-muted-foreground'
                              }`}
                            >
                              <ChevronRight className={`h-3 w-3 flex-shrink-0 transition-transform ${
                                isActive ? 'rotate-90' : 'group-hover:translate-x-0.5'
                              }`} />
                              <span className="flex-1 line-clamp-1">{lesson.title}</span>
                              {isActive && (
                                <div className="h-1.5 w-1.5 rounded-full bg-primary-foreground flex-shrink-0" />
                              )}
                            </button>
                          )
                        })}
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>

          {/* Right Side - Lesson Content */}
          <div className="lg:col-span-8 space-y-6">
            {currentLesson && (
              <>
                {/* Lesson Content */}
                <Card className="border-border">
                  <CardHeader>
                    <CardTitle>About This Lesson</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <p className="text-muted-foreground leading-relaxed">
                      {currentLesson.content}
                    </p>

                    <div>
                      <h3 className="font-semibold text-lg mb-3">Key Learning Points</h3>
                      <div className="space-y-3">
                        {currentLesson.keyPoints.map((point, index) => (
                          <div key={index} className="flex items-start gap-3">
                          <div className="rounded-full bg-gradient-primary p-1 mt-1">
                            <CheckCircle2 className="h-3 w-3 text-primary-foreground" />
                          </div>
                          <div className="flex-1">
                            <span className="font-semibold">{point.point}</span>
                            <p className="text-sm text-muted-foreground">{point.explanation}</p>
                          </div>
                        </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Navigation Buttons */}
                <div className="flex items-center justify-between gap-4">
                  <Button
                    variant="outline"
                    onClick={() => {
                      if (selectedLesson.lessonIndex > 0) {
                        handleLessonClick(selectedLesson.moduleIndex, selectedLesson.lessonIndex - 1)
                      } else if (selectedLesson.moduleIndex > 0) {
                        const prevModule = course.modules[selectedLesson.moduleIndex - 1]
                        handleLessonClick(selectedLesson.moduleIndex - 1, prevModule.lessons.length - 1)
                      }
                    }}
                    disabled={selectedLesson.moduleIndex === 0 && selectedLesson.lessonIndex === 0}
                    className="border-primary hover:bg-primary/10"
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Previous Lesson
                  </Button>
                  <Button
                    onClick={() => {
                      if (selectedLesson.lessonIndex < currentModule.lessons.length - 1) {
                        handleLessonClick(selectedLesson.moduleIndex, selectedLesson.lessonIndex + 1)
                      } else if (selectedLesson.moduleIndex < course.modules.length - 1) {
                        handleLessonClick(selectedLesson.moduleIndex + 1, 0)
                      }
                    }}
                    disabled={
                      selectedLesson.moduleIndex === course.modules.length - 1 &&
                      selectedLesson.lessonIndex === currentModule.lessons.length - 1
                    }
                    className="bg-gradient-primary hover:opacity-90"
                  >
                    Next Lesson
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default CourseDetail
