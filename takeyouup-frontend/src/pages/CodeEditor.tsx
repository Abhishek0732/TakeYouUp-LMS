import { useEffect, useState } from "react";
import MonacoEditor from "@monaco-editor/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Play, Code2, Terminal, Loader2, Code } from "lucide-react";
import { useTheme } from "@/components/ThemeProvider";
import useSeo from "@/hooks/useSeo";
import { runCode } from "@/api/execute";
import { consumeHandoff } from "@/lib/compilerHandoff";

const defaultCode: Record<string, string> = {
  python: '# Write your Python code here\nprint("Hello, World!")',
  javascript:
    '// Write your JavaScript code here\nconsole.log("Hello, World!");',
  cpp: '#include <iostream>\nusing namespace std;\n\nint main() {\n    cout << "Hello, World!" << endl;\n    return 0;\n}',
  java: 'public class Main {\n    public static void main(String[] args) {\n        System.out.println("Hello, World!");\n    }\n}',
};

const CodeEditor = () => {
  useSeo({
    title: "Online Compiler",
    description:
      "Write and run Python, JavaScript, C++ and Java in the browser, pass your own standard input, and read the output without installing anything.",
  });

  const { theme } = useTheme();
  const [language, setLanguage] = useState("python");
  const [code, setCode] = useState(defaultCode.python);
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);

  // An "Open in compiler" click from a lesson snippet leaves the code in
  // localStorage rather than the URL — see lib/compilerHandoff.
  useEffect(() => {
    const handoff = consumeHandoff();
    if (!handoff) return;
    setLanguage(handoff.language);
    setCode(handoff.code);
    setInput("");
    setOutput("");
  }, []);

  const handleLanguageChange = (value: string) => {
    setLanguage(value);
    setCode(defaultCode[value]);
  };

  const handleRunCode = async () => {
    setLoading(true);
    setOutput("");

    try {
      // Was a direct browser call to the free public Judge0 instance: no key,
      // no throttle, no caching, and nothing we could do when it rate-limited.
      // Our backend now owns the credential and the retry/cache policy.
      const result = await runCode(language, code, input);
      setOutput(result.output || "No output");
    } catch (e: any) {
      setOutput(
        e?.response?.status === 429
          ? "You are running code very quickly. Give it a moment and try again."
          : "Error executing code. Please try again.",
      );
    }

    setLoading(false);
  };

  return (
    <div className="bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div>
              <h1 className="text-xl font-bold text-foreground">
                Code Playground
              </h1>
              <p className="text-sm text-muted-foreground">
                Write, run & test your code instantly
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Select value={language} onValueChange={handleLanguageChange}>
              <SelectTrigger className="w-[160px] bg-background">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="python">🐍 Python</SelectItem>
                <SelectItem value="javascript">⚡ JavaScript</SelectItem>
                <SelectItem value="cpp">⚙️ C++</SelectItem>
                <SelectItem value="java">☕ Java</SelectItem>
              </SelectContent>
            </Select>

            <Button
              onClick={handleRunCode}
              disabled={loading}
              className="bg-gradient-primary hover:opacity-90 text-primary-foreground gap-2"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Play className="h-4 w-4" />
              )}
              {loading ? "Running..." : "Run Code"}
            </Button>
          </div>
        </div>
      </div>

      {/* Editor + IO */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        {/* The viewport-height budget only makes sense once the three columns sit
            side by side; while the cards are stacked each one keeps its own floor. */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:h-[calc(100vh-220px)]">
          {/* Editor */}
          <div className="lg:col-span-2 flex flex-col min-h-[420px]">
            <Card className="flex-1 overflow-hidden border-border">
              <CardContent className="p-0 h-full">
                <MonacoEditor
                  height="100%"
                  language={language === "cpp" ? "cpp" : language}
                  value={code}
                  onChange={(value) => setCode(value || "")}
                  theme={theme === "dark" ? "vs-dark" : "light"}
                  options={{
                    fontSize: 14,
                    minimap: { enabled: false },
                    padding: { top: 16 },
                    scrollBeyondLastLine: false,
                    wordWrap: "on",
                    automaticLayout: true,
                    // Monaco's editing surface is a bare <textarea>; without
                    // this a screen reader announces it with no name at all.
                    ariaLabel: "Code editor",
                  }}
                />
              </CardContent>
            </Card>
          </div>

          {/* Input / Output */}
          <div className="flex flex-col gap-4 min-h-[420px]">
            <Card className="flex-1 border-border">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium flex items-center gap-2 text-muted-foreground">
                  <Terminal className="h-4 w-4" /> Input
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  id="program-stdin"
                  aria-label="Program input (stdin)"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Enter input for your program..."
                  className="min-h-[120px] resize-none font-mono text-sm bg-background"
                />
              </CardContent>
            </Card>

            <Card className="flex-1 border-border">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium flex items-center gap-2 text-muted-foreground">
                  <Terminal className="h-4 w-4" /> Output
                </CardTitle>
              </CardHeader>
              <CardContent>
                {/* aria-live so the result is announced when a run finishes —
                    otherwise a screen-reader user has to go hunting for it. */}
                <div
                  role="status"
                  aria-live="polite"
                  className="rounded-md bg-secondary p-4 min-h-[120px] font-mono text-sm text-foreground whitespace-pre-wrap"
                >
                  {loading ? (
                    <span className="text-muted-foreground flex items-center gap-2">
                      <Loader2 className="h-3 w-3 animate-spin" /> Executing...
                    </span>
                  ) : output ? (
                    output
                  ) : (
                    <span className="text-muted-foreground">
                      Output will appear here...
                    </span>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CodeEditor;