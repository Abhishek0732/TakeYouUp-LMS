import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, CheckCircle2, FileText, ChevronRight, BrainCircuit, Clock, Users, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";
import QuizSection from "@/components/QuizSection";
import api from "@/api/axios";
import dsaQuiz from "@/data/quizzes/dsaQuiz";
import javaQuiz from "@/data/quizzes/javaQuiz";
import pythonQuiz from "@/data/quizzes/pythonQuiz";

const CourseDetail = () => {
  const { courseSlug, lessonSlug } = useParams();
  const [selectedLesson, setSelectedLesson] = useState({ moduleIndex: 0, lessonIndex: 0 });
  const [course, setCourse] = useState<any>(null);
  const [loading, setLoading] = useState<any>(null);
  const [error, setError] = useState<any>(null);
  const quizMap: any = { dsa: dsaQuiz, java: javaQuiz, python: pythonQuiz };
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) { navigate("/login"); return; }
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

  return (
    <div style={{ minHeight: "100vh", background: "hsl(var(--background))" }}>
      {/* Mini header */}
      <div style={{ borderBottom: "1px solid hsl(var(--border))", padding: "12px 0", background: "hsl(var(--card))" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between gap-4">
          <Link to="/courses" style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: "hsl(var(--muted-foreground))", textDecoration: "none", fontFamily: "'DM Sans', sans-serif" }}
            className="hover:text-orange-500 transition-colors">
            <ArrowLeft style={{ width: 15, height: 15 }} /> Back to Courses
          </Link>
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
                                  fontFamily: "'DM Sans', sans-serif",
                                  background: isActive ? "#ff4d1c" : "transparent",
                                  color: isActive ? "white" : "hsl(var(--muted-foreground))",
                                  marginBottom: 2,
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
                        <p style={{ color: "hsl(var(--muted-foreground))", lineHeight: 1.75, fontSize: "0.95rem", marginBottom: 24 }}>{currentLesson.content}</p>
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
                                    {point.explanation && <p style={{ fontSize: "0.82rem", color: "hsl(var(--muted-foreground))", lineHeight: 1.6 }}>{point.explanation}</p>}
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
                        style={{ display: "flex", alignItems: "center", gap: 6, padding: "10px 20px", borderRadius: 10, border: "1.5px solid hsl(var(--border))", background: "transparent", cursor: "pointer", fontFamily: "'Syne', sans-serif", fontWeight: 600, fontSize: 13, transition: "all 0.2s", opacity: (selectedLesson.moduleIndex === 0 && selectedLesson.lessonIndex === 0) ? 0.4 : 1, color: "hsl(var(--foreground))" }}
                      >
                        <ArrowLeft style={{ width: 14, height: 14 }} /> Previous
                      </button>
                      <button
                        onClick={() => {
                          if (selectedLesson.lessonIndex < currentModule.lessons.length - 1) handleLessonClick(selectedLesson.moduleIndex, selectedLesson.lessonIndex + 1);
                          else if (selectedLesson.moduleIndex < course.modules.length - 1) handleLessonClick(selectedLesson.moduleIndex + 1, 0);
                        }}
                        disabled={selectedLesson.moduleIndex === course.modules.length - 1 && selectedLesson.lessonIndex === currentModule.lessons.length - 1}
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
