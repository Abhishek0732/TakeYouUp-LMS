import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, CheckCircle2, FileText, ChevronRight, BrainCircuit, Clock, Users, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";
import QuizSection from "@/components/QuizSection";
import RichContent from "@/components/RichContent";
import api from "@/api/axios";
import dsaQuiz from "@/data/quizzes/dsaQuiz";
import javaQuiz from "@/data/quizzes/javaQuiz";
import pythonQuiz from "@/data/quizzes/pythonQuiz";
import { useProgress } from "@/context/ProgressContext";

const CourseDetail = () => {
  const { courseSlug, lessonSlug } = useParams();
  const [selectedLesson, setSelectedLesson] = useState({ moduleIndex: 0, lessonIndex: 0 });
  const [course, setCourse] = useState<any>(null);
  const [loading, setLoading] = useState<any>(null);
  const [error, setError] = useState<any>(null);
  const quizMap: any = { dsa: dsaQuiz, java: javaQuiz, python: pythonQuiz };
  const navigate = useNavigate();
  const { isCompleted, toggleProgress } = useProgress();

  useEffect(() => {
    // No auth check here: the route is wrapped in ProtectedRoute, and checking
    // localStorage directly would race the token refresh on a stale session.
    const fetchCourse = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/courses/slug/${courseSlug}`);
        setCourse(res.data);
      } catch (err: any) {
        setError(err.response?.data?.message || "Failed to fetch course");
      } finally {
        setLoading(false);
      }
    };
    fetchCourse();
  }, [courseSlug]);

  useEffect(() => {
    if (course && course.title) {
      document.title = `${course.title} | TakeYouUp - Master Programming & Build Your Future`;
    }
  }, [course]);

  useEffect(() => {
    if (!course || !lessonSlug) return;
    for (let m = 0; m < course.modules.length; m++) {
      const lessonIndex = course.modules[m].lessons.findIndex((l: any) => l.slug === lessonSlug);
      if (lessonIndex !== -1) { setSelectedLesson({ moduleIndex: m, lessonIndex }); break; }
    }
  }, [lessonSlug, course]);

  const handleLessonClick = (moduleIndex: number, lessonIndex: number) => {
    const lesson = course.modules[moduleIndex].lessons[lessonIndex];
    setSelectedLesson({ moduleIndex, lessonIndex });
    navigate(lesson.slug ? `/${course.slug}/${lesson.slug}` : `/${course.slug}`);
  };

  const cardStyle: React.CSSProperties = { background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 16 };

  if (loading) return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-4">
          <div style={{ ...cardStyle, padding: 24 }}>
            <Skeleton className="h-6 w-40 mb-2" /><Skeleton className="h-4 w-24 mb-4" />
            {[...Array(6)].map((_, i) => <Skeleton key={i} className="h-8 w-full rounded-lg mb-2" />)}
          </div>
        </div>
        <div className="lg:col-span-8 space-y-4">
          <div style={{ ...cardStyle, padding: 24 }}>
            <Skeleton className="h-7 w-2/3 mb-4" />
            {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-4 w-full mb-2" />)}
          </div>
        </div>
      </div>
    </div>
  );

  if (error) return (
    <div className="flex items-center justify-center h-screen">
      <div style={{ color: "#ef4444", fontFamily: "'DM Mono', monospace", fontSize: 14 }}>{error}</div>
    </div>
  );

  if (!course) return (
    <div className="flex items-center justify-center h-screen" style={{ color: "hsl(var(--muted-foreground))" }}>No course found</div>
  );

  const currentLesson = course.modules[selectedLesson.moduleIndex]?.lessons[selectedLesson.lessonIndex];
  const currentModule = course.modules[selectedLesson.moduleIndex];

  const getLessonKey = (lesson: any) => lesson.slug || String(lesson.id);

  return (
    <div style={{ minHeight: "100vh", background: "hsl(var(--background))" }}>
      {/* Mini header */}
      <div style={{ borderBottom: "1px solid hsl(var(--border))", padding: "12px 0", background: "hsl(var(--card))" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between gap-4">
          <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
            <Link to="/courses" style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: "hsl(var(--muted-foreground))", textDecoration: "none", fontFamily: "'DM Sans', sans-serif" }}
              className="hover:text-orange-500 transition-colors">
              <ArrowLeft style={{ width: 15, height: 15 }} /> Back to Courses
            </Link>
            <span style={{ color: "hsl(var(--muted-foreground))", fontSize: 13 }}>/</span>
            <span style={{ fontSize: 13, fontWeight: 600, color: "hsl(var(--foreground))", fontFamily: "'Syne', sans-serif" }}>{course.title}</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 12, fontFamily: "'DM Mono', monospace", fontSize: 11, color: "hsl(var(--muted-foreground))" }}>
            {course.students && <span style={{ display: "flex", alignItems: "center", gap: 4 }}><Users style={{ width: 12, height: 12 }} /> {course.students?.toLocaleString()}</span>}
            {course.rating && <span style={{ display: "flex", alignItems: "center", gap: 4, color: "#f59e0b" }}><Star style={{ width: 12, height: 12, fill: "#f59e0b" }} /> {course.rating}</span>}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        <Tabs defaultValue="lessons" className="space-y-6">
          <TabsList style={{ background: "hsl(var(--muted))", padding: 4, borderRadius: 10, border: "none" }}>
            <TabsTrigger value="lessons"
              className="data-[state=active]:bg-orange-500 data-[state=active]:text-white gap-2 rounded-lg transition-all"
              style={{ fontFamily: "'Syne', sans-serif", fontWeight: 600, fontSize: 13 }}>
              <FileText style={{ width: 14, height: 14 }} /> Lessons
            </TabsTrigger>
            <TabsTrigger value="quiz"
              className="data-[state=active]:bg-orange-500 data-[state=active]:text-white gap-2 rounded-lg transition-all"
              style={{ fontFamily: "'Syne', sans-serif", fontWeight: 600, fontSize: 13 }}>
              <BrainCircuit style={{ width: 14, height: 14 }} /> Quiz
            </TabsTrigger>
          </TabsList>

          <TabsContent value="lessons">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Sidebar */}
              <div className="lg:col-span-4">
                <div style={{ ...cardStyle, position: "sticky", top: 80 }}>
                  <div style={{ padding: "20px 20px 12px" }}>
                    <h3 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: "1rem", marginBottom: 4 }}>Course Content</h3>
                    <p style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: "hsl(var(--muted-foreground))" }}>
                      {course.modules.reduce((acc: number, m: any) => acc + m.lessons.length, 0)} lessons
                    </p>
                  </div>
                  {/* max-height + overflow-y: shrinks to a short list, scrolls a
                      long one. (Radix ScrollArea clipped instead of scrolling here,
                      because its viewport is height:100% inside an auto-height root.) */}
                  <div className="scroll-y" style={{ maxHeight: "calc(100vh - 260px)" }}>
                    <div style={{ padding: "0 12px 16px" }}>
                      {course.modules.map((module: any, mIdx: number) => (
                        <div key={mIdx} style={{ marginBottom: 8 }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 10px", background: "hsl(var(--muted))", borderRadius: 8, marginBottom: 4 }}>
                            <FileText style={{ width: 13, height: 13, color: "#ff4d1c", flexShrink: 0 }} />
                            <span title={module.title} style={{ fontFamily: "'Syne', sans-serif", fontWeight: 600, fontSize: 12, minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{module.title}</span>
                          </div>
                          {module.lessons.map((lesson: any, lIdx: number) => {
                            const isActive = selectedLesson.moduleIndex === mIdx && selectedLesson.lessonIndex === lIdx;
                            const isDone = isCompleted("LESSON", getLessonKey(lesson));
                            return (
                              <button key={lIdx} onClick={() => handleLessonClick(mIdx, lIdx)}
                                style={{
                                  width: "100%", textAlign: "left", padding: "8px 10px", borderRadius: 8, border: "none", cursor: "pointer",
                                  display: "flex", alignItems: "center", gap: 6, fontSize: 12, transition: "all 0.15s",
                                  overflow: "hidden",
                                  fontFamily: "'DM Sans', sans-serif",
                                  background: isActive ? "#ff4d1c" : "transparent",
                                  color: isActive ? "white" : "hsl(var(--muted-foreground))",
                                  marginBottom: 2,
                                }}>
                                <ChevronRight style={{ width: 11, height: 11, flexShrink: 0, transform: isActive ? "rotate(90deg)" : "none", transition: "transform 0.15s" }} />
                                <span title={lesson.title} style={{ flex: 1, minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{lesson.title}</span>
                                {isDone && <CheckCircle2 style={{ width: 12, height: 12, color: isActive ? "white" : "#22c55e", flexShrink: 0 }} />}
                              </button>
                            );
                          })}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Main content */}
              <div className="lg:col-span-8 space-y-5">
                {currentLesson && (
                  <>
                    <div style={cardStyle}>
                      <div style={{ padding: "24px 28px" }}>
                        <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: "1.4rem", marginBottom: 16 }}>{currentLesson.title}</h2>
                        <div style={{ marginBottom: 24 }}>
                          <RichContent text={currentLesson.content} />
                        </div>
                        {currentLesson.keyPoints?.length > 0 && (
                          <div>
                            <h3 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: "1rem", marginBottom: 14 }}>Key Learning Points</h3>
                            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                              {currentLesson.keyPoints.map((point: any, i: number) => (
                                <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
                                  <div style={{ marginTop: 3, flexShrink: 0, width: 20, height: 20, borderRadius: "50%", background: "rgba(255,77,28,0.12)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                    <CheckCircle2 style={{ width: 12, height: 12, color: "#ff4d1c" }} />
                                  </div>
                                  <div>
                                    <p style={{ fontWeight: 600, fontSize: "0.9rem", marginBottom: 2 }}>{point.point}</p>
                                    {point.explanation && <RichContent text={point.explanation} compact />}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Nav buttons */}
                    <div className="flex flex-col-reverse sm:flex-row justify-between gap-3 mt-6">
                      <div className="flex gap-2 w-full sm:w-auto">
                        <button
                          onClick={() => {
                            if (selectedLesson.lessonIndex > 0) handleLessonClick(selectedLesson.moduleIndex, selectedLesson.lessonIndex - 1);
                            else if (selectedLesson.moduleIndex > 0) { const pm = course.modules[selectedLesson.moduleIndex - 1]; handleLessonClick(selectedLesson.moduleIndex - 1, pm.lessons.length - 1); }
                          }}
                          disabled={selectedLesson.moduleIndex === 0 && selectedLesson.lessonIndex === 0}
                          className="flex-1 sm:flex-initial justify-center"
                          style={{ display: "flex", alignItems: "center", gap: 6, padding: "10px 16px", borderRadius: 10, border: "1.5px solid hsl(var(--border))", background: "transparent", cursor: "pointer", fontFamily: "'Syne', sans-serif", fontWeight: 600, fontSize: 13, transition: "all 0.2s", opacity: (selectedLesson.moduleIndex === 0 && selectedLesson.lessonIndex === 0) ? 0.4 : 1, color: "hsl(var(--foreground))" }}
                        >
                          <ArrowLeft style={{ width: 14, height: 14 }} /> Previous
                        </button>
                        <button
                          onClick={() => toggleProgress("LESSON", getLessonKey(currentLesson))}
                          className="flex-1 sm:flex-initial justify-center"
                          style={{ 
                            display: "flex", alignItems: "center", gap: 6, padding: "10px 16px", borderRadius: 10, 
                            border: isCompleted("LESSON", getLessonKey(currentLesson)) ? "1px solid rgba(34,197,94,0.3)" : "1.5px solid hsl(var(--border))", 
                            background: isCompleted("LESSON", getLessonKey(currentLesson)) ? "rgba(34,197,94,0.1)" : "transparent", 
                            cursor: "pointer", fontFamily: "'Syne', sans-serif", fontWeight: 600, fontSize: 13, transition: "all 0.2s", 
                            color: isCompleted("LESSON", getLessonKey(currentLesson)) ? "#22c55e" : "hsl(var(--foreground))" 
                          }}
                        >
                          <CheckCircle2 style={{ width: 14, height: 14 }} /> 
                          <span className="truncate">{isCompleted("LESSON", getLessonKey(currentLesson)) ? "Completed" : "Mark Done"}</span>
                        </button>
                      </div>
                      
                      <button
                        onClick={() => {
                          if (!isCompleted("LESSON", getLessonKey(currentLesson))) {
                            toggleProgress("LESSON", getLessonKey(currentLesson));
                          }
                          if (selectedLesson.lessonIndex < currentModule.lessons.length - 1) handleLessonClick(selectedLesson.moduleIndex, selectedLesson.lessonIndex + 1);
                          else if (selectedLesson.moduleIndex < course.modules.length - 1) handleLessonClick(selectedLesson.moduleIndex + 1, 0);
                        }}
                        disabled={selectedLesson.moduleIndex === course.modules.length - 1 && selectedLesson.lessonIndex === currentModule.lessons.length - 1}
                        className="w-full sm:w-auto justify-center"
                        style={{ display: "flex", alignItems: "center", gap: 6, padding: "10px 20px", borderRadius: 10, border: "none", background: "linear-gradient(135deg, #ff4d1c, #ffb800)", cursor: "pointer", fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 13, color: "white", transition: "all 0.2s", opacity: (selectedLesson.moduleIndex === course.modules.length - 1 && selectedLesson.lessonIndex === currentModule.lessons.length - 1) ? 0.4 : 1 }}
                      >
                        Next Lesson <ChevronRight style={{ width: 14, height: 14 }} />
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="quiz">
            <QuizSection courseId={course.id} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default CourseDetail;
