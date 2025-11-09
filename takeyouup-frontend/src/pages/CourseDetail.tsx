import { useParams, Link } from "react-router-dom"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ArrowLeft, Clock, Users, Star, CheckCircle2, PlayCircle, FileText, Award, ChevronRight } from "lucide-react"
import axios from 'axios';
import { useNavigate } from "react-router-dom";

import javaCourse from '../data/javaCourse';
import pythonCourse from '../data/pythonCourse';
import dsaCourse from '../data/dsaCourse';
import webDevCourse from '../data/webDevCourse';
import machineCourse from '../data/machineLearningCourse';
import systemDesignCourse from '../data/systemDesignCourse';

const CourseDetail = () => {
  // const { slug } = useParams()
  const { courseSlug, lessonSlug } = useParams();
  const [selectedLesson, setSelectedLesson] = useState({ moduleIndex: 0, lessonIndex: 0 })
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(null);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`http://localhost:8080/api/courses/slug/${courseSlug}`)
        setCourse(res.data);

        if (lessonSlug && res.data.modules) {
          for (let m = 0; m < res.data.modules.length; m++) {
            const lessonIndex = res.data.modules[m].lessons.findIndex(
              (l) => l.slug === lessonSlug
            );
            if (lessonIndex !== -1) {
              setSelectedLesson({ moduleIndex: m, lessonIndex });
              break;
            }
          }
        }
      } catch {
        setError("Failed to fetch the course Detail");
      } finally {
        setLoading(false);
      }
    }

    fetchCourse()
  }, [courseSlug, lessonSlug])

  const handleLessonClick = (moduleIndex: number, lessonIndex: number) => {
    const lesson = course.modules[moduleIndex].lessons[lessonIndex];
    setSelectedLesson({ moduleIndex, lessonIndex });
    if (lesson.slug) {
      navigate(`/${course.slug}/${lesson.slug}`);
    } else {
      // If no slug, just stay on the course page
      navigate(`/${course.slug}`);
    }
    // setSelectedLesson({ moduleIndex, lessonIndex })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-lg font-medium">Loading course details...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen text-red-500">
        {error}
      </div>
    )
  }

  if (!course) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>No course found</p>
      </div>
    )
  }


  const currentLesson = course.modules[selectedLesson.moduleIndex]?.lessons[selectedLesson.lessonIndex]
  const currentModule = course.modules[selectedLesson.moduleIndex]

  

  return (
    <div className="min-h-screen">
      {/* Back Button */}
     

      {/* Hero Section */}
      <div className="relative h-[50px] overflow-hidden">
        
        <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/80 to-background/50">
          <div className="container mx-auto px-4 h-full flex items-center">
            <div className="max-w-3xl space-y-4 animate-fade-in">
              <h1 className="text-3xl md:text-4xl font-bold">{course.title}</h1>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area with Sidebar */}
      <div className="container mx-auto px-4 py-6">
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
                    <CardTitle>{currentLesson.title}</CardTitle>
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
