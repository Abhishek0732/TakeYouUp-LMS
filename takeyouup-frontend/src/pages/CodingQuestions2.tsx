import { useState, useMemo, useCallback } from "react";
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
import { useNavigate } from "react-router-dom";

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
  title: string;
  difficulty: Difficulty;
  platform: Platform;
  url: string;
  topic: Topic;
}

const questions: CodingQuestion[] = [
  // Arrays
  {
    title: "Two Sum",
    difficulty: "Easy",
    platform: "LeetCode",
    url: "https://leetcode.com/problems/two-sum/",
    topic: "Arrays",
  },
  {
    title: "Best Time to Buy and Sell Stock",
    difficulty: "Easy",
    platform: "LeetCode",
    url: "https://leetcode.com/problems/best-time-to-buy-and-sell-stock/",
    topic: "Arrays",
  },
  {
    title: "Contains Duplicate",
    difficulty: "Easy",
    platform: "LeetCode",
    url: "https://leetcode.com/problems/contains-duplicate/",
    topic: "Arrays",
  },
  {
    title: "Maximum Subarray",
    difficulty: "Medium",
    platform: "LeetCode",
    url: "https://leetcode.com/problems/maximum-subarray/",
    topic: "Arrays",
  },
  {
    title: "Product of Array Except Self",
    difficulty: "Medium",
    platform: "LeetCode",
    url: "https://leetcode.com/problems/product-of-array-except-self/",
    topic: "Arrays",
  },
  {
    title: "Subarray with given sum",
    difficulty: "Easy",
    platform: "GFG",
    url: "https://www.geeksforgeeks.org/problems/subarray-with-given-sum-1587115621/1",
    topic: "Arrays",
  },
  {
    title: "Kadane's Algorithm",
    difficulty: "Medium",
    platform: "GFG",
    url: "https://www.geeksforgeeks.org/problems/kadanes-algorithm-1587115620/1",
    topic: "Arrays",
  },
  {
    title: "Merge Intervals",
    difficulty: "Medium",
    platform: "LeetCode",
    url: "https://leetcode.com/problems/merge-intervals/",
    topic: "Arrays",
  },
  {
    title: "First Missing Positive",
    difficulty: "Hard",
    platform: "LeetCode",
    url: "https://leetcode.com/problems/first-missing-positive/",
    topic: "Arrays",
  },
  {
    title: "Trapping Rain Water",
    difficulty: "Hard",
    platform: "LeetCode",
    url: "https://leetcode.com/problems/trapping-rain-water/",
    topic: "Arrays",
  },

  // Strings
  {
    title: "Valid Anagram",
    difficulty: "Easy",
    platform: "LeetCode",
    url: "https://leetcode.com/problems/valid-anagram/",
    topic: "Strings",
  },
  {
    title: "Longest Substring Without Repeating Characters",
    difficulty: "Medium",
    platform: "LeetCode",
    url: "https://leetcode.com/problems/longest-substring-without-repeating-characters/",
    topic: "Strings",
  },
  {
    title: "Palindrome Partitioning",
    difficulty: "Medium",
    platform: "LeetCode",
    url: "https://leetcode.com/problems/palindrome-partitioning/",
    topic: "Strings",
  },
  {
    title: "Reverse Words in a String",
    difficulty: "Medium",
    platform: "GFG",
    url: "https://www.geeksforgeeks.org/problems/reverse-words-in-a-given-string5459/1",
    topic: "Strings",
  },
  {
    title: "Longest Palindromic Substring",
    difficulty: "Medium",
    platform: "LeetCode",
    url: "https://leetcode.com/problems/longest-palindromic-substring/",
    topic: "Strings",
  },
  {
    title: "Minimum Window Substring",
    difficulty: "Hard",
    platform: "LeetCode",
    url: "https://leetcode.com/problems/minimum-window-substring/",
    topic: "Strings",
  },
  {
    title: "Implement Atoi",
    difficulty: "Medium",
    platform: "GFG",
    url: "https://www.geeksforgeeks.org/problems/implement-atoi/1",
    topic: "Strings",
  },

  // Linked List
  {
    title: "Reverse Linked List",
    difficulty: "Easy",
    platform: "LeetCode",
    url: "https://leetcode.com/problems/reverse-linked-list/",
    topic: "Linked List",
  },
  {
    title: "Merge Two Sorted Lists",
    difficulty: "Easy",
    platform: "LeetCode",
    url: "https://leetcode.com/problems/merge-two-sorted-lists/",
    topic: "Linked List",
  },
  {
    title: "Linked List Cycle",
    difficulty: "Easy",
    platform: "LeetCode",
    url: "https://leetcode.com/problems/linked-list-cycle/",
    topic: "Linked List",
  },
  {
    title: "Remove Nth Node From End",
    difficulty: "Medium",
    platform: "LeetCode",
    url: "https://leetcode.com/problems/remove-nth-node-from-end-of-list/",
    topic: "Linked List",
  },
  {
    title: "Flatten a Linked List",
    difficulty: "Medium",
    platform: "GFG",
    url: "https://www.geeksforgeeks.org/problems/flattening-a-linked-list/1",
    topic: "Linked List",
  },
  {
    title: "Merge K Sorted Lists",
    difficulty: "Hard",
    platform: "LeetCode",
    url: "https://leetcode.com/problems/merge-k-sorted-lists/",
    topic: "Linked List",
  },

  // Trees
  {
    title: "Maximum Depth of Binary Tree",
    difficulty: "Easy",
    platform: "LeetCode",
    url: "https://leetcode.com/problems/maximum-depth-of-binary-tree/",
    topic: "Trees",
  },
  {
    title: "Invert Binary Tree",
    difficulty: "Easy",
    platform: "LeetCode",
    url: "https://leetcode.com/problems/invert-binary-tree/",
    topic: "Trees",
  },
  {
    title: "Binary Tree Level Order Traversal",
    difficulty: "Medium",
    platform: "LeetCode",
    url: "https://leetcode.com/problems/binary-tree-level-order-traversal/",
    topic: "Trees",
  },
  {
    title: "Validate Binary Search Tree",
    difficulty: "Medium",
    platform: "LeetCode",
    url: "https://leetcode.com/problems/validate-binary-search-tree/",
    topic: "Trees",
  },
  {
    title: "Lowest Common Ancestor",
    difficulty: "Medium",
    platform: "GFG",
    url: "https://www.geeksforgeeks.org/problems/lowest-common-ancestor-in-a-binary-tree/1",
    topic: "Trees",
  },
  {
    title: "Binary Tree Maximum Path Sum",
    difficulty: "Hard",
    platform: "LeetCode",
    url: "https://leetcode.com/problems/binary-tree-maximum-path-sum/",
    topic: "Trees",
  },
  {
    title: "Serialize and Deserialize Binary Tree",
    difficulty: "Hard",
    platform: "LeetCode",
    url: "https://leetcode.com/problems/serialize-and-deserialize-binary-tree/",
    topic: "Trees",
  },

  // Graphs
  {
    title: "Number of Islands",
    difficulty: "Medium",
    platform: "LeetCode",
    url: "https://leetcode.com/problems/number-of-islands/",
    topic: "Graphs",
  },
  {
    title: "Clone Graph",
    difficulty: "Medium",
    platform: "LeetCode",
    url: "https://leetcode.com/problems/clone-graph/",
    topic: "Graphs",
  },
  {
    title: "Course Schedule",
    difficulty: "Medium",
    platform: "LeetCode",
    url: "https://leetcode.com/problems/course-schedule/",
    topic: "Graphs",
  },
  {
    title: "BFS of Graph",
    difficulty: "Easy",
    platform: "GFG",
    url: "https://www.geeksforgeeks.org/problems/bfs-traversal-of-graph/1",
    topic: "Graphs",
  },
  {
    title: "DFS of Graph",
    difficulty: "Easy",
    platform: "GFG",
    url: "https://www.geeksforgeeks.org/problems/depth-first-traversal-for-a-graph/1",
    topic: "Graphs",
  },
  {
    title: "Word Ladder",
    difficulty: "Hard",
    platform: "LeetCode",
    url: "https://leetcode.com/problems/word-ladder/",
    topic: "Graphs",
  },
  {
    title: "Alien Dictionary",
    difficulty: "Hard",
    platform: "GFG",
    url: "https://www.geeksforgeeks.org/problems/alien-dictionary/1",
    topic: "Graphs",
  },

  // Dynamic Programming
  {
    title: "Climbing Stairs",
    difficulty: "Easy",
    platform: "LeetCode",
    url: "https://leetcode.com/problems/climbing-stairs/",
    topic: "Dynamic Programming",
  },
  {
    title: "House Robber",
    difficulty: "Medium",
    platform: "LeetCode",
    url: "https://leetcode.com/problems/house-robber/",
    topic: "Dynamic Programming",
  },
  {
    title: "Longest Common Subsequence",
    difficulty: "Medium",
    platform: "LeetCode",
    url: "https://leetcode.com/problems/longest-common-subsequence/",
    topic: "Dynamic Programming",
  },
  {
    title: "Coin Change",
    difficulty: "Medium",
    platform: "LeetCode",
    url: "https://leetcode.com/problems/coin-change/",
    topic: "Dynamic Programming",
  },
  {
    title: "0-1 Knapsack",
    difficulty: "Medium",
    platform: "GFG",
    url: "https://www.geeksforgeeks.org/problems/0-1-knapsack-problem0945/1",
    topic: "Dynamic Programming",
  },
  {
    title: "Edit Distance",
    difficulty: "Medium",
    platform: "LeetCode",
    url: "https://leetcode.com/problems/edit-distance/",
    topic: "Dynamic Programming",
  },
  {
    title: "Longest Increasing Subsequence",
    difficulty: "Medium",
    platform: "LeetCode",
    url: "https://leetcode.com/problems/longest-increasing-subsequence/",
    topic: "Dynamic Programming",
  },
  {
    title: "Burst Balloons",
    difficulty: "Hard",
    platform: "LeetCode",
    url: "https://leetcode.com/problems/burst-balloons/",
    topic: "Dynamic Programming",
  },

  // Stack & Queue
  {
    title: "Valid Parentheses",
    difficulty: "Easy",
    platform: "LeetCode",
    url: "https://leetcode.com/problems/valid-parentheses/",
    topic: "Stack & Queue",
  },
  {
    title: "Min Stack",
    difficulty: "Medium",
    platform: "LeetCode",
    url: "https://leetcode.com/problems/min-stack/",
    topic: "Stack & Queue",
  },
  {
    title: "Next Greater Element",
    difficulty: "Easy",
    platform: "GFG",
    url: "https://www.geeksforgeeks.org/problems/next-larger-element-1587115620/1",
    topic: "Stack & Queue",
  },
  {
    title: "Largest Rectangle in Histogram",
    difficulty: "Hard",
    platform: "LeetCode",
    url: "https://leetcode.com/problems/largest-rectangle-in-histogram/",
    topic: "Stack & Queue",
  },
  {
    title: "Sliding Window Maximum",
    difficulty: "Hard",
    platform: "LeetCode",
    url: "https://leetcode.com/problems/sliding-window-maximum/",
    topic: "Stack & Queue",
  },

  // Binary Search
  {
    title: "Binary Search",
    difficulty: "Easy",
    platform: "LeetCode",
    url: "https://leetcode.com/problems/binary-search/",
    topic: "Binary Search",
  },
  {
    title: "Search in Rotated Sorted Array",
    difficulty: "Medium",
    platform: "LeetCode",
    url: "https://leetcode.com/problems/search-in-rotated-sorted-array/",
    topic: "Binary Search",
  },
  {
    title: "Find Minimum in Rotated Sorted Array",
    difficulty: "Medium",
    platform: "LeetCode",
    url: "https://leetcode.com/problems/find-minimum-in-rotated-sorted-array/",
    topic: "Binary Search",
  },
  {
    title: "Median of Two Sorted Arrays",
    difficulty: "Hard",
    platform: "LeetCode",
    url: "https://leetcode.com/problems/median-of-two-sorted-arrays/",
    topic: "Binary Search",
  },
  {
    title: "Aggressive Cows",
    difficulty: "Hard",
    platform: "GFG",
    url: "https://www.geeksforgeeks.org/problems/aggressive-cows/0",
    topic: "Binary Search",
  },

  // Recursion
  {
    title: "Subsets",
    difficulty: "Medium",
    platform: "LeetCode",
    url: "https://leetcode.com/problems/subsets/",
    topic: "Recursion",
  },
  {
    title: "Permutations",
    difficulty: "Medium",
    platform: "LeetCode",
    url: "https://leetcode.com/problems/permutations/",
    topic: "Recursion",
  },
  {
    title: "Combination Sum",
    difficulty: "Medium",
    platform: "LeetCode",
    url: "https://leetcode.com/problems/combination-sum/",
    topic: "Recursion",
  },
  {
    title: "N-Queens",
    difficulty: "Hard",
    platform: "LeetCode",
    url: "https://leetcode.com/problems/n-queens/",
    topic: "Recursion",
  },
  {
    title: "Rat in a Maze",
    difficulty: "Medium",
    platform: "GFG",
    url: "https://www.geeksforgeeks.org/problems/rat-in-a-maze-problem/1",
    topic: "Recursion",
  },

  // Hashing
  {
    title: "Group Anagrams",
    difficulty: "Medium",
    platform: "LeetCode",
    url: "https://leetcode.com/problems/group-anagrams/",
    topic: "Hashing",
  },
  {
    title: "Top K Frequent Elements",
    difficulty: "Medium",
    platform: "LeetCode",
    url: "https://leetcode.com/problems/top-k-frequent-elements/",
    topic: "Hashing",
  },
  {
    title: "Longest Consecutive Sequence",
    difficulty: "Medium",
    platform: "LeetCode",
    url: "https://leetcode.com/problems/longest-consecutive-sequence/",
    topic: "Hashing",
  },
  {
    title: "Count distinct elements in every window",
    difficulty: "Easy",
    platform: "GFG",
    url: "https://www.geeksforgeeks.org/problems/count-distinct-elements-in-every-window/1",
    topic: "Hashing",
  },
  {
    title: "Subarrays with equal 1s and 0s",
    difficulty: "Medium",
    platform: "GFG",
    url: "https://www.geeksforgeeks.org/problems/count-subarrays-with-equal-number-of-1s-and-0s-1587115620/1",
    topic: "Hashing",
  },
];

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
  const [selectedTopic, setSelectedTopic] = useState<Topic | "All">("All");
  const [selectedDifficulty, setSelectedDifficulty] = useState<
    Difficulty | "All"
  >("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const filtered = useMemo(() => {
    return questions.filter((q) => {
      if (selectedTopic !== "All" && q.topic !== selectedTopic) return false;
      if (selectedDifficulty !== "All" && q.difficulty !== selectedDifficulty)
        return false;
      if (
        searchQuery &&
        !q.title.toLowerCase().includes(searchQuery.toLowerCase())
      )
        return false;
      return true;
    });
  }, [selectedTopic, selectedDifficulty, searchQuery]);

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const paginatedQuestions = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filtered.slice(start, start + itemsPerPage);
  }, [filtered, currentPage, itemsPerPage]);

  // Reset to page 1 when filters change
  const handleFilterChange = useCallback((setter: () => void) => {
    setter();
    setCurrentPage(1);
  }, []);

  const counts = useMemo(
    () => ({
      Easy: filtered.filter((q) => q.difficulty === "Easy").length,
      Medium: filtered.filter((q) => q.difficulty === "Medium").length,
      Hard: filtered.filter((q) => q.difficulty === "Hard").length,
    }),
    [filtered],
  );

  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, filtered.length);

  // Generate page numbers to show
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
      {/* Header */}

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        {difficulties.map((d) => (
          <Card key={d} className="border-border">
            <CardContent className="py-3 px-4 flex items-center justify-between">
              <span className="text-sm font-medium text-muted-foreground">
                {d}
              </span>
              <Badge className={`${difficultyColor[d]} border`}>
                {counts[d]}
              </Badge>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Search */}
      <div className="relative mb-6">
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

      {/* Filters */}
      <div className="space-y-4 mb-6">
        <div className="flex items-center gap-2 flex-wrap">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <Button
            size="sm"
            variant={selectedDifficulty === "All" ? "default" : "outline"}
            onClick={() =>
              handleFilterChange(() => setSelectedDifficulty("All"))
            }
            className={
              selectedDifficulty === "All"
                ? "bg-gradient-primary hover:opacity-90"
                : ""
            }
          >
            All
          </Button>
          {difficulties.map((d) => (
            <Button
              key={d}
              size="sm"
              variant={selectedDifficulty === d ? "default" : "outline"}
              onClick={() => handleFilterChange(() => setSelectedDifficulty(d))}
              className={
                selectedDifficulty === d
                  ? "bg-gradient-primary hover:opacity-90"
                  : ""
              }
            >
              {d}
            </Button>
          ))}
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <Button
            size="sm"
            variant={selectedTopic === "All" ? "default" : "outline"}
            onClick={() => handleFilterChange(() => setSelectedTopic("All"))}
            className={
              selectedTopic === "All"
                ? "bg-gradient-primary hover:opacity-90"
                : ""
            }
          >
            All Topics
          </Button>
          {topics.map((t) => (
            <Button
              key={t}
              size="sm"
              variant={selectedTopic === t ? "default" : "outline"}
              onClick={() => handleFilterChange(() => setSelectedTopic(t))}
              className={
                selectedTopic === t
                  ? "bg-gradient-primary hover:opacity-90"
                  : ""
              }
            >
              {t}
            </Button>
          ))}
        </div>
      </div>

      {/* Questions List */}
      <div className="space-y-2">
        {/* Table Header */}
        <div className="hidden md:grid grid-cols-12 gap-4 px-4 py-2 text-sm font-medium text-muted-foreground">
          <span className="col-span-1">#</span>
          <span className="col-span-5">Title</span>
          <span className="col-span-2">Topic</span>
          <span className="col-span-2">Difficulty</span>
          <span className="col-span-2">Platform</span>
        </div>

        {filtered.length === 0 ? (
          <Card className="border-border">
            <CardContent className="py-12 text-center text-muted-foreground">
              No questions found for the selected filters.
            </CardContent>
          </Card>
        ) : (
          paginatedQuestions.map((q, i) => {
            const globalIndex = (currentPage - 1) * itemsPerPage + i;
            return (
              <a
                key={`${q.title}-${q.platform}`}
                href={q.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block"
              >
                <Card className="border-border hover:border-primary/50 hover:bg-muted/30 transition-all cursor-pointer group">
                  <CardContent className="py-3 px-4">
                    {/* Desktop */}
                    <div className="hidden md:grid grid-cols-12 gap-4 items-center">
                      <span className="col-span-1 text-sm text-muted-foreground">
                        {globalIndex + 1}
                      </span>
                      <span className="col-span-5 text-sm font-medium group-hover:text-primary transition-colors flex items-center gap-2">
                        {q.title}
                        <ExternalLink className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </span>
                      <span className="col-span-2">
                        <Badge variant="secondary" className="text-xs">
                          {q.topic}
                        </Badge>
                      </span>
                      <span className="col-span-2">
                        <Badge
                          className={`${difficultyColor[q.difficulty]} border text-xs`}
                        >
                          {q.difficulty}
                        </Badge>
                      </span>
                      <span className="col-span-2 flex items-center gap-2">
                        <img
                          src={
                            q.platform === "LeetCode" ? leetcodeLogo : gfgLogo
                          }
                          alt={q.platform}
                          className="h-5 w-5 rounded"
                        />
                        <span className="text-xs text-muted-foreground">
                          {q.platform}
                        </span>
                      </span>
                    </div>

                    {/* Mobile */}
                    <div className="md:hidden space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <span className="text-sm font-medium group-hover:text-primary transition-colors flex-1">
                          {globalIndex + 1}. {q.title}
                        </span>
                        <ExternalLink className="h-4 w-4 text-muted-foreground flex-shrink-0 mt-0.5" />
                      </div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <Badge variant="secondary" className="text-xs">
                          {q.topic}
                        </Badge>
                        <Badge
                          className={`${difficultyColor[q.difficulty]} border text-xs`}
                        >
                          {q.difficulty}
                        </Badge>
                        <div className="flex items-center gap-1">
                          <img
                            src={
                              q.platform === "LeetCode" ? leetcodeLogo : gfgLogo
                            }
                            alt={q.platform}
                            className="h-4 w-4 rounded"
                          />
                          <span className="text-xs text-muted-foreground">
                            {q.platform}
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </a>
            );
          })
        )}
      </div>

      {/* Pagination */}
      {filtered.length > 0 && (
        <div className="mt-6 space-y-4">
          <Card className="border-border">
            <CardContent className="py-4 px-4">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                {/* Info & Per Page */}
                <div className="flex items-center gap-4">
                  <span className="text-sm text-muted-foreground">
                    Showing{" "}
                    <span className="font-medium text-foreground">
                      {startItem}–{endItem}
                    </span>{" "}
                    of{" "}
                    <span className="font-medium text-foreground">
                      {filtered.length}
                    </span>
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">
                      Per page
                    </span>
                    <Select
                      value={String(itemsPerPage)}
                      onValueChange={(val) => {
                        setItemsPerPage(Number(val));
                        setCurrentPage(1);
                      }}
                    >
                      <SelectTrigger className="w-[70px] h-8 text-sm">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {ITEMS_PER_PAGE_OPTIONS.map((n) => (
                          <SelectItem key={n} value={String(n)}>
                            {n}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Page Controls */}
                <div className="flex items-center gap-1">
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(1)}
                  >
                    <ChevronsLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage((p) => p - 1)}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>

                  {pageNumbers.map((page, idx) =>
                    page === "..." ? (
                      <span
                        key={`ellipsis-${idx}`}
                        className="px-2 text-sm text-muted-foreground"
                      >
                        …
                      </span>
                    ) : (
                      <Button
                        key={page}
                        variant={currentPage === page ? "default" : "outline"}
                        size="icon"
                        className={`h-8 w-8 text-sm ${currentPage === page ? "bg-gradient-primary hover:opacity-90" : ""}`}
                        onClick={() => setCurrentPage(page)}
                      >
                        {page}
                      </Button>
                    ),
                  )}

                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage((p) => p + 1)}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage(totalPages)}
                  >
                    <ChevronsRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default CodingQuestions;
