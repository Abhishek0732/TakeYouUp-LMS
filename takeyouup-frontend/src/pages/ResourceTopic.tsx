import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link, Navigate, useParams } from "react-router-dom";
import { ArrowLeft, ArrowRight, CheckCircle2, CircleHelp, RotateCcw, XCircle } from "lucide-react";
import { getTopic } from "@/api/resources";
import { useProgress } from "@/context/ProgressContext";
import { QuizSkeleton } from "@/components/Skeletons";
import StateMessage from "@/components/StateMessage";
import useSeo from "@/hooks/useSeo";

const ResourceTopic = () => {
  const { categorySlug, topicSlug } = useParams();
  // Cached per category+topic in the app-wide query client, so returning to a
  // topic is instant. retry:false keeps an unknown slug redirecting promptly.
  const { data = { category: null, topic: null }, isLoading: loading } = useQuery({
    queryKey: ["resource-topic", categorySlug, topicSlug],
    queryFn: () => getTopic(categorySlug!, topicSlug!),
    enabled: !!categorySlug && !!topicSlug,
    retry: false,
    staleTime: 5 * 60 * 1000,
  });
  const { category, topic } = data;
  const { isCompleted, toggleProgress } = useProgress();

  useSeo({
    title: topic?.title ?? "Practice",
    description: topic
      ? `Multiple-choice practice on ${topic.title}: answer one question at a time, see the correct option with a short explanation, and score yourself.`
      : "Answer this topic's multiple-choice questions one at a time, see the correct option and its explanation, and get your score at the end.",
  });

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [submittedCount, setSubmittedCount] = useState(0);
  const [showSummary, setShowSummary] = useState(false);

  const progress = useMemo(() => {
    if (!topic?.questions?.length) return 0;
    return ((showSummary ? topic.questions.length : Math.min(currentQuestion + 1, topic.questions.length)) / topic.questions.length) * 100;
  }, [currentQuestion, showSummary, topic]);

  if (loading) {
    return (
      <div className="w-full mx-auto max-w-7xl px-4 py-10 sm:px-6">
        <QuizSkeleton />
      </div>
    );
  }

  if (!category || !topic) {
    return <Navigate to="/resources" replace />;
  }

  // A topic with no questions used to crash the page on `activeQuestion.question`.
  if (!topic.questions?.length) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        <StateMessage
          tone="empty"
          icon={CircleHelp}
          title="No questions in this topic yet"
          description="This topic hasn't been filled with MCQs so far. Try another topic in this category — new practice sets are added regularly."
          action={
            <Link to={`/resources/${category.slug}`} className="btn-orange mt-5 mx-auto w-fit">
              Back to {category.title}
              <ArrowRight className="h-4 w-4" />
            </Link>
          }
        />
      </div>
    );
  }

  // The stored index can fall outside the list (e.g. a shorter topic loads into
  // the same mounted component), which would make `activeQuestion` undefined.
  const questionIndex = Math.min(Math.max(currentQuestion, 0), topic.questions.length - 1);
  const activeQuestion = topic.questions[questionIndex];

  const handleAnswerSelect = (index: number) => {
    if (selectedAnswer !== null) return;

    setSelectedAnswer(index);
    setSubmittedCount((count) => count + 1);

    if (index === activeQuestion.correctAnswer) {
      setScore((value) => value + 1);
    }
  };

  const handleNext = () => {
    if (questionIndex === topic.questions.length - 1) {
      setShowSummary(true);
      return;
    }

    setCurrentQuestion(questionIndex + 1);
    setSelectedAnswer(null);
  };

  const handleRestart = () => {
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setScore(0);
    setSubmittedCount(0);
    setShowSummary(false);
  };

  return (
    <div className="bg-background">
      <section className="border-b border-border bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 py-7 sm:px-6 lg:py-8">
          <Link to={`/resources/${category.slug}`} className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground transition-colors hover:text-foreground">
            <ArrowLeft className="h-4 w-4" />
            Back to {category.title}
          </Link>
          <div>
            <div className="section-tag">MCQ Practice</div>
            <h1 className="mb-2 text-2xl font-extrabold sm:text-3xl">{topic.title}</h1>
            <p className="max-w-3xl text-sm leading-6 text-muted-foreground">{topic.summary}</p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:py-16">
        <div className="grid gap-8 lg:grid-cols-[300px_1fr]">
          <aside className="space-y-5">
            <div className="rounded-[24px] border border-border bg-card p-5">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-bold">Progress</h2>
                <span className="text-sm font-medium text-muted-foreground">
                  {showSummary ? topic.questions.length : questionIndex + 1}/{topic.questions.length}
                </span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-muted">
                <div className="h-full rounded-full transition-all duration-300" style={{ width: `${progress}%`, background: `linear-gradient(90deg, ${category.accent}, #ffb800)` }} />
              </div>
              <div className="mt-5 grid grid-cols-4 gap-2">
                {topic.questions.map((_, index) => {
                  const isCurrent = !showSummary && index === questionIndex;
                  const isCompleted = index < submittedCount;

                  return (
                    <div
                      key={index}
                      className={`flex h-10 items-center justify-center rounded-xl border text-sm font-semibold ${
                        isCurrent
                          ? "border-transparent text-white"
                          : isCompleted
                            ? "border-border bg-muted text-foreground"
                            : "border-border text-muted-foreground"
                      }`}
                      style={isCurrent ? { background: `linear-gradient(135deg, ${category.accent}, #ffb800)` } : {}}
                    >
                      {index + 1}
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="rounded-[24px] border border-border bg-card p-5">
              <h3 className="mb-4 text-lg font-bold">Key concepts</h3>
              <div className="flex flex-wrap gap-2">
                {topic.concepts.map((concept) => (
                  <span key={concept} className="rounded-full border border-border bg-muted/70 px-3 py-1 text-xs font-medium text-muted-foreground">
                    {concept}
                  </span>
                ))}
              </div>
            </div>
          </aside>

          <div>
            {showSummary ? (
              <div className="rounded-[28px] border border-border bg-card p-8 shadow-sm">
                <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full" style={{ background: score >= Math.ceil(topic.questions.length * 0.6) ? "rgba(34,197,94,0.12)" : "rgba(239,68,68,0.12)" }}>
                  {score >= Math.ceil(topic.questions.length * 0.6) ? <CheckCircle2 className="h-10 w-10 text-green-500" /> : <XCircle className="h-10 w-10 text-red-500" />}
                </div>
                <h2 className="text-3xl font-extrabold">Practice complete</h2>
                <p className="mt-3 max-w-2xl text-sm leading-7 text-muted-foreground sm:text-base">
                  You answered <span className="font-bold text-foreground">{score}</span> out of <span className="font-bold text-foreground">{topic.questions.length}</span> correctly in <span className="font-bold text-foreground">{topic.title}</span>.
                </p>
                <div className="mt-8 grid gap-4 sm:grid-cols-3">
                  <div className="rounded-2xl bg-muted/70 p-5">
                    <div className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Score</div>
                    <div className="mt-2 font-display text-3xl font-bold">{Math.round((score / topic.questions.length) * 100)}%</div>
                  </div>
                  <div className="rounded-2xl bg-muted/70 p-5">
                    <div className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Correct</div>
                    <div className="mt-2 font-display text-3xl font-bold">{score}</div>
                  </div>
                  <div className="rounded-2xl bg-muted/70 p-5">
                    <div className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Need review</div>
                    <div className="mt-2 font-display text-3xl font-bold">{topic.questions.length - score}</div>
                  </div>
                </div>
                <div className="mt-8 flex flex-wrap gap-3">
                  <button onClick={handleRestart} className="btn-orange">
                    Retry topic
                    <RotateCcw className="h-4 w-4" />
                  </button>
                  
                  <button 
                    onClick={() => topic && toggleProgress("RESOURCE_TOPIC", topic.slug)} 
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                      topic && isCompleted("RESOURCE_TOPIC", topic.slug) 
                        ? "bg-green-500/10 text-green-600 border border-green-500/20" 
                        : "bg-muted/70 text-muted-foreground hover:bg-muted"
                    }`}
                  >
                    {topic && isCompleted("RESOURCE_TOPIC", topic.slug) ? (
                      <>
                        <CheckCircle2 className="h-4 w-4" /> Completed
                      </>
                    ) : (
                      "Mark as Completed"
                    )}
                  </button>

                  <Link to={`/resources/${category.slug}`} className="btn-outline-dark">
                    Explore more topics
                  </Link>
                </div>
              </div>
            ) : (
              <div className="rounded-[28px] border border-border bg-card p-6 shadow-sm sm:p-8">
                <div className="mb-5 flex items-center justify-between gap-4">
                  <span className="pill-orange">{topic.difficulty}</span>
                  <span className="text-sm font-medium text-muted-foreground">Question {questionIndex + 1} of {topic.questions.length}</span>
                </div>
                <h5 className="text-2xl font-bold leading-tight sm:text-3xl">{activeQuestion.question}</h5>
                <div className="mt-8 grid gap-4">
                  {activeQuestion.options.map((option, index) => {
                    const isSelected = selectedAnswer === index;
                    const isCorrect = index === activeQuestion.correctAnswer;
                    const showFeedback = selectedAnswer !== null;

                    let className = "border-border hover:border-primary/40 hover:bg-muted/40";
                    if (showFeedback && isCorrect) className = "border-green-500 bg-green-500/10";
                    if (showFeedback && isSelected && !isCorrect) className = "border-red-500 bg-red-500/10";

                    return (
                      <button key={option} onClick={() => handleAnswerSelect(index)} disabled={showFeedback} className={`flex w-full items-start gap-4 rounded-2xl border p-2 text-left transition-all ${className}`}>
                        <span className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border text-sm font-bold ${
                          showFeedback && isCorrect
                            ? "border-green-500 text-green-600"
                            : showFeedback && isSelected
                              ? "border-red-500 text-red-500"
                              : "border-border text-muted-foreground"
                        }`}>
                          {String.fromCharCode(65 + index)}
                        </span>
                        <span className="pt-2 text-sm leading-7 sm:text-base">{option}</span>
                      </button>
                    );
                  })}
                </div>

                {selectedAnswer !== null && (
                  <div className="mt-8 rounded-2xl border border-border bg-muted/50 p-5">
                    <div className="mb-2 flex items-center gap-2 text-sm font-bold">
                      {selectedAnswer === activeQuestion.correctAnswer ? (
                        <>
                          <CheckCircle2 className="h-4 w-4 text-green-500" />
                          Correct answer
                        </>
                      ) : (
                        <>
                          <XCircle className="h-4 w-4 text-red-500" />
                          Review this one
                        </>
                      )}
                    </div>
                    <p className="text-sm leading-7 text-muted-foreground">{activeQuestion.explanation}</p>
                    <div className="mt-6 flex justify-end">
                      <button onClick={handleNext} className="btn-orange">
                        {questionIndex === topic.questions.length - 1 ? "See summary" : "Next question"}
                        <ArrowRight className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default ResourceTopic;
