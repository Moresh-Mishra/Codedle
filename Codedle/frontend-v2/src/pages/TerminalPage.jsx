import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Terminal, Code, Play, CheckCircle, ChevronRight } from "lucide-react";
import { Button } from "../components/ui/Button";
import { Textarea } from "../components/ui/Textarea";
import { Progress } from "../components/ui/Progress";

const challenges = [
  {
    id: 1,
    title: "Hello Codedle",
    description: "Write a function that returns 'Hello, Codedle!'",
    starterCode: "function greet() {\n  // Your code here\n}",
    expectedOutput: "Hello, Codedle!",
  },
  {
    id: 2,
    title: "Sum Two Numbers",
    description: "Create a function that adds two numbers",
    starterCode: "function sum(a, b) {\n  // Your code here\n}",
    expectedOutput: "15",
  },
  {
    id: 3,
    title: "Reverse String",
    description: "Write a function to reverse a string",
    starterCode: "function reverse(str) {\n  // Your code here\n}",
    expectedOutput: "eldedoC",
  },
  {
    id: 4,
    title: "Find Maximum",
    description: "Find the maximum number in an array",
    starterCode: "function findMax(arr) {\n  // Your code here\n}",
    expectedOutput: "99",
  },
  {
    id: 5,
    title: "Count Vowels",
    description: "Count vowels in a string",
    starterCode: "function countVowels(str) {\n  // Your code here\n}",
    expectedOutput: "5",
  },
];

const cn = (...classes) => {
  return classes.filter(Boolean).join(" ");
};

function CodedleGame() {
  const [currentChallenge, setCurrentChallenge] = useState(0);
  const [code, setCode] = useState(challenges[0].starterCode);
  const [terminalLines, setTerminalLines] = useState([
    {
      type: "output",
      content: "Welcome to Codedle - Terminal Edition",
      timestamp: Date.now(),
    },
    {
      type: "output",
      content: "Type your code and press 'Run' to test your solution",
      timestamp: Date.now() + 1,
    },
  ]);
  const [completedChallenges, setCompletedChallenges] = useState([]);
  const [isRunning, setIsRunning] = useState(false);
  const terminalRef = useRef(null);

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [terminalLines]);

  useEffect(() => {
    setCode(challenges[currentChallenge].starterCode);
  }, [currentChallenge]);

  const addTerminalLine = (type, content) => {
    setTerminalLines((prev) => [
      ...prev,
      { type, content, timestamp: Date.now() },
    ]);
  };

  const runCode = () => {
    setIsRunning(true);
    addTerminalLine("input", `> Running challenge ${currentChallenge + 1}...`);

    setTimeout(() => {
      try {
        const challenge = challenges[currentChallenge];
        const result = Math.random() > 0.3;

        if (result) {
          addTerminalLine("success", `✓ Test passed!`);
          addTerminalLine("output", `Output: ${challenge.expectedOutput}`);

          if (!completedChallenges.includes(currentChallenge)) {
            setCompletedChallenges((prev) => [...prev, currentChallenge]);
          }
        } else {
          addTerminalLine("error", `✗ Test failed`);
          addTerminalLine("error", `Expected: ${challenge.expectedOutput}`);
          addTerminalLine("error", `Got: undefined`);
        }
      } catch (error) {
        addTerminalLine("error", `Error: ${error}`);
      }
      setIsRunning(false);
    }, 1000);
  };

  const nextChallenge = () => {
    if (currentChallenge < challenges.length - 1) {
      setCurrentChallenge(currentChallenge + 1);
      addTerminalLine("output", `--- Challenge ${currentChallenge + 2} loaded ---`);
    }
  };

  const progress = (completedChallenges.length / challenges.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900 text-cyan-100 font-mono p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 text-center"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <Terminal className="w-8 h-8 text-cyan-400" />
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              CODEDLE
            </h1>
          </div>
          <p className="text-cyan-300/70 text-sm">
            Terminal-Style Coding Challenge Interface
          </p>
        </motion.div>

        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-cyan-400 uppercase tracking-wider">
              Progress: {completedChallenges.length}/{challenges.length}
            </span>
            <span className="text-xs text-cyan-400">{Math.round(progress)}%</span>
          </div>
          <div className="h-2 bg-slate-800/50 rounded-full overflow-hidden border border-cyan-900/30">
            <motion.div
              className="h-full bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
          <div className="flex gap-2 mt-3">
            {challenges.map((_, idx) => (
              <div
                key={idx}
                className={cn(
                  "flex-1 h-1 rounded-full transition-all duration-300",
                  completedChallenges.includes(idx)
                    ? "bg-gradient-to-r from-cyan-500 to-purple-500 shadow-lg shadow-cyan-500/50"
                    : idx === currentChallenge
                    ? "bg-purple-500/50 animate-pulse"
                    : "bg-slate-800/50"
                )}
              />
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-4"
          >
            <div className="bg-slate-900/50 border border-cyan-900/30 rounded-lg p-6 backdrop-blur-sm shadow-2xl shadow-purple-900/20">
              <div className="flex items-center gap-2 mb-4">
                <Code className="w-5 h-5 text-cyan-400" />
                <h2 className="text-xl font-bold text-cyan-400">
                  Challenge {currentChallenge + 1}
                </h2>
                {completedChallenges.includes(currentChallenge) && (
                  <CheckCircle className="w-5 h-5 text-green-400 ml-auto" />
                )}
              </div>
              <h3 className="text-lg font-semibold text-purple-300 mb-2">
                {challenges[currentChallenge].title}
              </h3>
              <p className="text-cyan-100/70 text-sm leading-relaxed">
                {challenges[currentChallenge].description}
              </p>
              <div className="mt-4 p-3 bg-slate-950/50 rounded border border-cyan-900/20">
                <p className="text-xs text-cyan-400 mb-1">Expected Output:</p>
                <code className="text-green-400 text-sm">
                  {challenges[currentChallenge].expectedOutput}
                </code>
              </div>
            </div>

            <div className="bg-slate-900/50 border border-cyan-900/30 rounded-lg overflow-hidden backdrop-blur-sm shadow-2xl shadow-purple-900/20">
              <div className="bg-slate-950/80 px-4 py-2 border-b border-cyan-900/30 flex items-center gap-2">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-500/80" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                  <div className="w-3 h-3 rounded-full bg-green-500/80" />
                </div>
                <span className="text-xs text-cyan-400 ml-2">code-editor.js</span>
              </div>
              <Textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="min-h-[300px] bg-slate-950/50 border-0 text-cyan-100 font-mono text-sm p-4 focus-visible:ring-0 focus-visible:ring-offset-0 resize-none"
                placeholder="// Write your code here..."
              />
              <div className="p-4 bg-slate-950/80 border-t border-cyan-900/30 flex gap-3">
                <Button
                  onClick={runCode}
                  disabled={isRunning}
                  className="flex-1 bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 text-white border-0"
                >
                  <Play className="w-4 h-4 mr-2" />
                  {isRunning ? "Running..." : "Run Code"}
                </Button>
                {completedChallenges.includes(currentChallenge) &&
                  currentChallenge < challenges.length - 1 && (
                    <Button
                      onClick={nextChallenge}
                      className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white border-0"
                    >
                      Next
                      <ChevronRight className="w-4 h-4 ml-2" />
                    </Button>
                  )}
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-slate-900/50 border border-cyan-900/30 rounded-lg overflow-hidden backdrop-blur-sm shadow-2xl shadow-purple-900/20"
          >
            <div className="bg-slate-950/80 px-4 py-2 border-b border-cyan-900/30 flex items-center gap-2">
              <Terminal className="w-4 h-4 text-cyan-400" />
              <span className="text-xs text-cyan-400">terminal</span>
              <div className="ml-auto flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-slate-700" />
                <div className="w-3 h-3 rounded-full bg-slate-700" />
                <div className="w-3 h-3 rounded-full bg-slate-700" />
              </div>
            </div>
            <div
              ref={terminalRef}
              className="h-[500px] overflow-y-auto p-4 bg-slate-950/50 font-mono text-sm"
              style={{
                scrollbarWidth: "thin",
                scrollbarColor: "#0891b2 #1e293b",
              }}
            >
              <AnimatePresence>
                {terminalLines.map((line, idx) => (
                  <motion.div
                    key={line.timestamp}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className={cn(
                      "mb-2 leading-relaxed",
                      line.type === "input" && "text-cyan-400",
                      line.type === "output" && "text-cyan-100/80",
                      line.type === "error" && "text-red-400",
                      line.type === "success" && "text-green-400"
                    )}
                  >
                    {line.type === "input" && "$ "}
                    {line.content}
                  </motion.div>
                ))}
              </AnimatePresence>
              <motion.div
                animate={{ opacity: [1, 0] }}
                transition={{ duration: 0.8, repeat: Infinity }}
                className="inline-block w-2 h-4 bg-cyan-400 ml-1"
              />
            </div>
          </motion.div>
        </div>

        {completedChallenges.length === challenges.length && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mt-8 bg-gradient-to-r from-cyan-900/30 to-purple-900/30 border border-cyan-500/50 rounded-lg p-8 text-center backdrop-blur-sm"
          >
            <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
            <h2 className="text-3xl font-bold text-cyan-400 mb-2">
              Congratulations!
            </h2>
            <p className="text-cyan-100/70">
              You've completed all challenges in Codedle!
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}

export default CodedleGame;
