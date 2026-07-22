import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  CheckCircle2,
  XCircle,
  ChevronRight,
  RotateCcw,
  BookOpen,
} from "lucide-react";

import { useState, useEffect } from "react";
import api from "@/api/axios";
import { Skeleton } from "@/components/ui/skeleton";
import CodeBlock from "@/components/CodeBlock";
import RichContent, { InlineMarkdown } from "@/components/RichContent";
import StateMessage from "@/components/StateMessage";

interface Question {
  question: string;
  options: string[];
  correct: number;
  /** Optional code sample shown between the question and the options. */
  codeSnippet?: string | null;
  codeLanguage?: string | null;
  /** Revealed once the learner picks an answer. */
  explanation?: string | null;
}

interface QuizTopic {
  title: string;
  questions: Question[];
}

interface QuizSectionProps {
  courseId: number;
}

const QuizSection = ({ courseId }: QuizSectionProps) => {
  const [quizData, setQuizData] = useState<QuizTopic[]>([]);
  const [loading, setLoading] = useState(true);
  // A failed load must not fall through to the "Select a Topic" card, which
  // reads as "this course has no quiz".
  const [error, setError] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);

  const [selectedTopic, setSelectedTopic] = useState<number | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState<boolean[]>([]);

  // console.log(quizData);

  useEffect(() => {
    const fetchQuiz = async () => {
      setLoading(true);
      setError(false);
      try {
        const res = await api.get(`/quizzes/course/${courseId}`);
        setQuizData(res.data);
        if (Array.isArray(res.data) && res.data.length > 0) {
          setSelectedTopic(0);
        }
      } catch (err) {
        console.error("Failed to fetch quiz", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    if (courseId) fetchQuiz();
  }, [courseId, reloadKey]);

  const handleTopicClick = (index: number) => {
    setSelectedTopic(index);
    setCurrentQuestion(0);
    setSelectedOption(null);
    setShowResult(false);
    setScore(0);
    setAnswered([]);
  };

  const handleOptionClick = (optionIndex: number) => {
    if (selectedOption !== null) return;
    setSelectedOption(optionIndex);
    const isCorrect =
      optionIndex ===
      quizData[selectedTopic!].questions[currentQuestion].correct;
    if (isCorrect) setScore((s) => s + 1);
    setAnswered((a) => [...a, isCorrect]);
  };

  const handleNext = () => {
    const topic = quizData[selectedTopic!];
    if (currentQuestion < topic.questions.length - 1) {
      setCurrentQuestion((q) => q + 1);
      setSelectedOption(null);
    } else {
      setShowResult(true);
    }
  };

  const handleRestart = () => {
    setCurrentQuestion(0);
    setSelectedOption(null);
    setShowResult(false);
    setScore(0);
    setAnswered([]);
  };

  const topic = selectedTopic !== null ? quizData[selectedTopic] : null;
  const question = topic ? topic.questions[currentQuestion] : null;

  if (loading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Sidebar Skeleton */}
        <div className="lg:col-span-4">
          <Card className="sticky top-20 border-border">
            <CardHeader>
              <Skeleton className="h-6 w-40 mb-2" />
              <Skeleton className="h-4 w-28" />
            </CardHeader>

            <CardContent className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex justify-between items-center">
                  <Skeleton className="h-8 w-3/4 rounded-md" />
                  <Skeleton className="h-6 w-10 rounded-md" />
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Quiz Content Skeleton */}
        <div className="lg:col-span-8 space-y-6">
          {/* Progress Skeleton */}
          <Card>
            <CardContent className="py-4 space-y-2">
              <Skeleton className="h-4 w-40" />
              <Skeleton className="h-2 w-full rounded-full" />
            </CardContent>
          </Card>

          {/* Question Skeleton */}
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-3/4" />
            </CardHeader>

            <CardContent className="space-y-3">
              {[...Array(4)].map((_, i) => (
                <Skeleton
                  key={i}
                  className="h-14 w-full rounded-lg  animate-pulse"
                />
              ))}
            </CardContent>
          </Card>

          {/* Button Skeleton */}
          <div className="flex justify-end">
            <Skeleton className="h-10 w-36 rounded-lg" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <StateMessage
        tone="error"
        title="Couldn't load the quiz"
        description="The quiz for this course failed to load — that's a connection problem, not an empty quiz. Try again in a moment."
        onRetry={() => setReloadKey((k) => k + 1)}
        retryLabel="Reload quiz"
      />
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Topic List */}
      <div className="lg:col-span-4">
        <Card className="sticky top-20 border-border">
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-primary" />
              Quiz Topics
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              {quizData.length} topics available
            </p>
          </CardHeader>
          <CardContent className="space-y-2">
            {quizData.map((t, i) => (
              <button
                key={i}
                onClick={() => handleTopicClick(i)}
                className={`w-full text-left py-3 px-4 rounded-lg transition-all text-sm flex items-center justify-between group ${
                  selectedTopic === i
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-muted/50 text-muted-foreground"
                }`}
              >
                <span className="font-medium">{t.title}</span>
                <div className="flex items-center gap-2">
                  <Badge
                    variant="secondary"
                    className={
                      selectedTopic === i
                        ? "bg-primary-foreground/20 text-primary-foreground"
                        : ""
                    }
                  >
                    {t.questions.length} Q
                  </Badge>
                  <ChevronRight
                    className={`h-4 w-4 transition-transform ${
                      selectedTopic === i
                        ? "rotate-90"
                        : "group-hover:translate-x-0.5"
                    }`}
                  />
                </div>
              </button>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Quiz Content */}
      <div className="lg:col-span-8">
        {selectedTopic === null ? (
          <Card className="border-border">
            <CardContent className="py-16 text-center space-y-4">
              <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                <BookOpen className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold">Select a Topic</h3>
              <p className="text-muted-foreground max-w-md mx-auto">
                Choose a quiz topic from the left to test your knowledge
              </p>
            </CardContent>
          </Card>
        ) : showResult ? (
          <Card className="border-border">
            <CardContent className="py-12 text-center space-y-6">
              <div
                className={`mx-auto w-20 h-20 rounded-full flex items-center justify-center ${
                  score >= topic!.questions.length * 0.7
                    ? "bg-green-500/10"
                    : "bg-destructive/10"
                }`}
              >
                {score >= topic!.questions.length * 0.7 ? (
                  <CheckCircle2 className="h-10 w-10 text-green-500" />
                ) : (
                  <XCircle className="h-10 w-10 text-destructive" />
                )}
              </div>
              <div>
                <h3 className="text-2xl font-bold">Quiz Complete!</h3>
                <p className="text-muted-foreground mt-1">{topic!.title}</p>
              </div>
              <div className="text-4xl font-bold text-primary">
                {score}/{topic!.questions.length}
              </div>
              <p className="text-muted-foreground">
                {score >= topic!.questions.length * 0.7
                  ? "Great job! You have a solid understanding."
                  : "Keep practicing! Review the lessons and try again."}
              </p>
              <Button
                onClick={handleRestart}
                className="bg-gradient-primary hover:opacity-90"
              >
                <RotateCcw className="mr-2 h-4 w-4" />
                Retry Quiz
              </Button>
            </CardContent>
          </Card>
        ) : question ? (
          <div className="space-y-6">
            {/* Progress */}
            <Card className="border-border">
              <CardContent className="py-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">{topic!.title}</span>
                  <span className="text-sm text-muted-foreground">
                    Question {currentQuestion + 1} of {topic!.questions.length}
                  </span>
                </div>
                <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-primary rounded-full transition-all duration-300"
                    style={{
                      width: `${((currentQuestion + 1) / topic!.questions.length) * 100}%`,
                    }}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Question */}
            <Card className="border-border">
              <CardHeader>
                <CardTitle className="text-lg leading-relaxed">
                  <InlineMarkdown text={question.question} />
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {question.codeSnippet?.trim() && (
                  <CodeBlock
                    code={question.codeSnippet}
                    language={question.codeLanguage || "plaintext"}
                    className="!mt-0"
                  />
                )}
                {question.options.map((option, i) => {
                  const isSelected = selectedOption === i;
                  const isCorrect = i === question.correct;
                  const showFeedback = selectedOption !== null;

                  let optionClass =
                    "border-border hover:border-primary/50 hover:bg-muted/30";
                  if (showFeedback && isCorrect) {
                    optionClass = "border-green-500 bg-green-500/10";
                  } else if (showFeedback && isSelected && !isCorrect) {
                    optionClass = "border-destructive bg-destructive/10";
                  }

                  return (
                    <button
                      key={i}
                      onClick={() => handleOptionClick(i)}
                      disabled={selectedOption !== null}
                      className={`w-full text-left p-4 rounded-lg border-2 transition-all flex items-center gap-3 ${optionClass} disabled:cursor-default`}
                    >
                      <span
                        className={`flex-shrink-0 w-8 h-8 rounded-full border-2 flex items-center justify-center text-sm font-semibold ${
                          showFeedback && isCorrect
                            ? "border-green-500 text-green-500"
                            : showFeedback && isSelected
                              ? "border-destructive text-destructive"
                              : "border-muted-foreground/30 text-muted-foreground"
                        }`}
                      >
                        {String.fromCharCode(65 + i)}
                      </span>
                      <span className="flex-1">
                        <InlineMarkdown text={option} />
                      </span>
                      {showFeedback && isCorrect && (
                        <CheckCircle2 className="h-5 w-5 text-green-500" />
                      )}
                      {showFeedback && isSelected && !isCorrect && (
                        <XCircle className="h-5 w-5 text-destructive" />
                      )}
                    </button>
                  );
                })}

                {selectedOption !== null && question.explanation?.trim() && (
                  <div className="rounded-lg border border-primary/30 bg-primary/5 p-4">
                    <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-primary">
                      Explanation
                    </p>
                    <RichContent text={question.explanation} compact />
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Next Button */}
            {selectedOption !== null && (
              <div className="flex justify-end">
                <Button
                  onClick={handleNext}
                  className="bg-gradient-primary hover:opacity-90"
                >
                  {currentQuestion < topic!.questions.length - 1
                    ? "Next Question"
                    : "See Results"}
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default QuizSection;
