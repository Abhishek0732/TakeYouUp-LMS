import { useState, useMemo, useCallback, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ExternalLink,
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import leetcodeLogo from "@/assets/leetcode-logo.png";
import gfgLogo from "@/assets/gfg-logo.png";
import { useQuery } from "@tanstack/react-query";
import { fetchQuestions } from "@/services/questionService";

type Difficulty = "Easy" | "Medium" | "Hard";
type Platform = "LeetCode" | "GFG";
type Topic =
  | "Arrays"
  | "Strings"
  | "Linked List"
  | "Trees"
  | "Graphs"
  | "Dynamic Programming"
  | "Stack & Queue"
  | "Binary Search"
  | "Recursion"
  | "Hashing";
interface CodingQuestion {
  id: number;
  title: string;
  difficulty: Difficulty;
  platform: Platform;
  url: string;
  topic: Topic;
}
const topics: Topic[] = [
  "Arrays",
  "Strings",
  "Linked List",
  "Trees",
  "Graphs",
  "Dynamic Programming",
  "Stack & Queue",
  "Binary Search",
  "Recursion",
  "Hashing",
];
const difficulties: Difficulty[] = ["Easy", "Medium", "Hard"];
const difficultyColor: Record<Difficulty, string> = {
  Easy: "bg-green-500/10 text-green-500 border-green-500/20",
  Medium: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
  Hard: "bg-red-500/10 text-red-500 border-red-500/20",
};
const ITEMS_PER_PAGE_OPTIONS = [10, 15, 25, 50];
const CodingQuestions = () => {

  useEffect(() => {
    document.title =
      "Problems | TakeYouUp - Master Programming & Build Your Future";
  }, []);


  const [selectedTopic, setSelectedTopic] = useState<Topic | "All">("All");
  const [selectedDifficulty, setSelectedDifficulty] = useState<
    Difficulty | "All"
  >("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const { data, isLoading } = useQuery({
    queryKey: [
      "questions",
      currentPage,
      itemsPerPage,
      selectedTopic === "All" ? null : selectedTopic,
      selectedDifficulty === "All" ? null : selectedDifficulty,
      searchQuery,
    ],
    queryFn: () =>
      fetchQuestions({
        page: currentPage - 1,
        size: itemsPerPage,
        topic: selectedTopic === "All" ? undefined : selectedTopic,
        difficulty:
          selectedDifficulty === "All" ? undefined : selectedDifficulty,
        search: searchQuery,
      }),
    keepPreviousData: true,
  });
  const questions: CodingQuestion[] = data?.content || [];
  const totalPages = data?.totalPages || 0;
  const totalElements = data?.totalElements || 0;
  const handleFilterChange = useCallback((setter: () => void) => {
    setter();
    setCurrentPage(1);
  }, []);
  const counts = useMemo(
    () => ({
      Easy: questions.filter((q) => q.difficulty === "Easy").length,
      Medium: questions.filter((q) => q.difficulty === "Medium").length,
      Hard: questions.filter((q) => q.difficulty === "Hard").length,
    }),
    [questions],
  );
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalElements);
  const pageNumbers = useMemo(() => {
    const pages: (number | "...")[] = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (currentPage > 3) pages.push("...");
      for (
        let i = Math.max(2, currentPage - 1);
        i <= Math.min(totalPages - 1, currentPage + 1);
        i++
      ) {
        pages.push(i);
      }
      if (currentPage < totalPages - 2) pages.push("...");
      pages.push(totalPages);
    }
    return pages;
  }, [totalPages, currentPage]);
  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {" "}
      {/* Stats */}{" "}
      <div className="grid grid-cols-3 gap-3 mb-6">
        {" "}
        {difficulties.map((d) => (
          <Card key={d} className="border-border">
            {" "}
            <CardContent className="py-3 px-4 flex items-center justify-between">
              {" "}
              <span className="text-sm font-medium text-muted-foreground">
                {" "}
                {d}{" "}
              </span>{" "}
              <Badge className={`${difficultyColor[d]} border`}>
                {" "}
                {counts[d]}{" "}
              </Badge>{" "}
            </CardContent>{" "}
          </Card>
        ))}{" "}
      </div>{" "}
      
      {/* Filters */}{" "}
      <div className="space-y-4 mb-6">
        {" "}
        <div className="flex items-center justify-between mb-6 gap-4 flex-wrap">
          {/* Difficulty Filters */}
          <div className="flex items-center gap-2 flex-wrap">
            <Filter className="h-4 w-4 text-muted-foreground" />

            <Button
              size="sm"
              variant={selectedDifficulty === "All" ? "default" : "outline"}
              onClick={() =>
                handleFilterChange(() => setSelectedDifficulty("All"))
              }
            >
              All
            </Button>

            {difficulties.map((d) => (
              <Button
                key={d}
                size="sm"
                variant={selectedDifficulty === d ? "default" : "outline"}
                onClick={() =>
                  handleFilterChange(() => setSelectedDifficulty(d))
                }
              >
                {d}
              </Button>
            ))}
          </div>

          {/* Search Bar (Right Side) */}
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />

            <Input
              placeholder="Search questions..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="pl-10"
            />
          </div>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {" "}
          <Button
            size="sm"
            variant={selectedTopic === "All" ? "default" : "outline"}
            onClick={() => handleFilterChange(() => setSelectedTopic("All"))}
          >
            {" "}
            All Topics{" "}
          </Button>{" "}
          {topics.map((t) => (
            <Button
              key={t}
              size="sm"
              variant={selectedTopic === t ? "default" : "outline"}
              onClick={() => handleFilterChange(() => setSelectedTopic(t))}
            >
              {" "}
              {t}{" "}
            </Button>
          ))}{" "}
        </div>{" "}
      </div>{" "}
      {/* Questions List */}{" "}
      <div className="space-y-2">
        {" "}
        {totalElements === 0 ? (
          <Card className="border-border">
            {" "}
            <CardContent className="py-12 text-center text-muted-foreground">
              {" "}
              No questions found for the selected filters.{" "}
            </CardContent>{" "}
          </Card>
        ) : (
          questions.map((q, i) => {
            const globalIndex = (currentPage - 1) * itemsPerPage + i;
            return (
              <a
                // key={`${q.title}-${q.platform}`}
                key={q.id}
                href={q.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block"
              >
                {" "}
                <Card className="border-border hover:border-primary/50 hover:bg-muted/30 transition-all cursor-pointer group">
                  {" "}
                  <CardContent className="py-3 px-4">
                    {" "}
                    <div className="hidden md:grid grid-cols-12 gap-4 items-center">
                      {" "}
                      <span className="col-span-1 text-sm text-muted-foreground">
                        {" "}
                        {globalIndex + 1}{" "}
                      </span>{" "}
                      <span className="col-span-5 text-sm font-medium group-hover:text-primary transition-colors flex items-center gap-2">
                        {" "}
                        {q.title}{" "}
                        <ExternalLink className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />{" "}
                      </span>{" "}
                      <span className="col-span-2">
                        {" "}
                        <Badge variant="secondary" className="text-xs">
                          {" "}
                          {q.topic}{" "}
                        </Badge>{" "}
                      </span>{" "}
                      <span className="col-span-2">
                        {" "}
                        <Badge
                          className={`${difficultyColor[q.difficulty]} border text-xs`}
                        >
                          {" "}
                          {q.difficulty}{" "}
                        </Badge>{" "}
                      </span>{" "}
                      <span className="col-span-2 flex items-center gap-2">
                        {" "}
                        <img
                          src={
                            q.platform === "LeetCode" ? leetcodeLogo : gfgLogo
                          }
                          alt={q.platform}
                          className="h-5 w-5 rounded"
                        />{" "}
                        <span className="text-xs text-muted-foreground">
                          {" "}
                          {q.platform}{" "}
                        </span>{" "}
                      </span>{" "}
                    </div>{" "}
                  </CardContent>{" "}
                </Card>{" "}
              </a>
            );
          })
        )}{" "}
      </div>{" "}
      {/* Pagination */}{" "}
      {totalElements > 0 && (
        <div className="mt-6 space-y-4">
          {" "}
          <Card className="border-border">
            {" "}
            <CardContent className="py-4 px-4">
              {" "}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                {" "}
                <span className="text-sm text-muted-foreground">
                  {" "}
                  Showing {startItem}–{endItem} of {totalElements}{" "}
                </span>{" "}
                <div className="flex items-center gap-1">
                  {" "}
                  <Button
                    variant="outline"
                    size="icon"
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(1)}
                  >
                    {" "}
                    <ChevronsLeft className="h-4 w-4" />{" "}
                  </Button>{" "}
                  <Button
                    variant="outline"
                    size="icon"
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage((p) => p - 1)}
                  >
                    {" "}
                    <ChevronLeft className="h-4 w-4" />{" "}
                  </Button>{" "}
                  {pageNumbers.map((page, idx) =>
                    page === "..." ? (
                      <span key={idx} className="px-2 text-sm">
                        {" "}
                        …{" "}
                      </span>
                    ) : (
                      <Button
                        key={page}
                        variant={currentPage === page ? "default" : "outline"}
                        size="icon"
                        onClick={() => setCurrentPage(page)}
                      >
                        {" "}
                        {page}{" "}
                      </Button>
                    ),
                  )}{" "}
                  <Button
                    variant="outline"
                    size="icon"
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage((p) => p + 1)}
                  >
                    {" "}
                    <ChevronRight className="h-4 w-4" />{" "}
                  </Button>{" "}
                  <Button
                    variant="outline"
                    size="icon"
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage(totalPages)}
                  >
                    {" "}
                    <ChevronsRight className="h-4 w-4" />{" "}
                  </Button>{" "}
                </div>{" "}
              </div>{" "}
            </CardContent>{" "}
          </Card>{" "}
        </div>
      )}{" "}
    </div>
  );
};
export default CodingQuestions;
