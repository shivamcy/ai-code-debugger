import React, { useState, useEffect, useRef } from "react";
import Editor from "@monaco-editor/react";
import axios from "axios";
import Navbar from "../components/Navbar";

const Debug = () => {
  const [language, setLanguage] = useState("python");
  const [code, setCode] = useState(() => {
    return localStorage.getItem("debug_code") || "";
  });
  
  const [response, setResponse] = useState("");
  const [lines, setLines] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showResultPanel, setShowResultPanel] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true); // Default to dark mode
  const editorRef = useRef(null);
  const resizeTimeoutRef = useRef(null);

  // Check for dark mode from various sources
  useEffect(() => {
    const checkDarkMode = () => {
      // Check for class-based dark mode (most common)
      if (document.documentElement.classList.contains('dark')) {
        setIsDarkMode(true);
      } else if (document.documentElement.classList.contains('light')) {
        setIsDarkMode(false);
      }
      // Check for data attribute based dark mode
      else if (document.documentElement.getAttribute('data-theme') === 'dark') {
        setIsDarkMode(true);
      } else if (document.documentElement.getAttribute('data-theme') === 'light') {
        setIsDarkMode(false);
      }
      // Check for CSS media query preference
      else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        setIsDarkMode(true);
      } else {
        setIsDarkMode(false);
      }
    };

    // Initial check
    checkDarkMode();

    // Listen for changes to the document class/attributes
    const observer = new MutationObserver(checkDarkMode);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class', 'data-theme']
    });

    // Listen for system preference changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => checkDarkMode();
    mediaQuery.addEventListener('change', handleChange);

    return () => {
      observer.disconnect();
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, []);

  // Suppress ResizeObserver errors globally
  useEffect(() => {
    const resizeObserverErrorHandler = (e) => {
      if (e.message && e.message.includes('ResizeObserver loop completed')) {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        return false;
      }
    };

    const unhandledRejectionHandler = (e) => {
      if (e.reason && e.reason.message && e.reason.message.includes('ResizeObserver')) {
        e.preventDefault();
        return false;
      }
    };

    // Add multiple event listeners to catch all possible ResizeObserver errors
    window.addEventListener('error', resizeObserverErrorHandler, true);
    window.addEventListener('unhandledrejection', unhandledRejectionHandler, true);
    
    // Also override console.error temporarily to suppress ResizeObserver logs
    const originalConsoleError = console.error;
    console.error = (...args) => {
      if (args[0] && typeof args[0] === 'string' && args[0].includes('ResizeObserver')) {
        return; // Suppress ResizeObserver errors in console
      }
      originalConsoleError.apply(console, args);
    };

    return () => {
      window.removeEventListener('error', resizeObserverErrorHandler, true);
      window.removeEventListener('unhandledrejection', unhandledRejectionHandler, true);
      console.error = originalConsoleError;
    };
  }, []);

  // Handle editor resize with proper timing
  useEffect(() => {
    if (showResultPanel) {
      // Use requestAnimationFrame to ensure DOM has updated before resizing
      const handleResize = () => {
        if (resizeTimeoutRef.current) {
          clearTimeout(resizeTimeoutRef.current);
        }
        
        resizeTimeoutRef.current = setTimeout(() => {
          requestAnimationFrame(() => {
            try {
              if (editorRef.current) {
                editorRef.current.layout();
              }
            } catch (error) {
              // Silently handle any resize errors
            }
          });
        }, 150);
      };

      handleResize();
    }

    return () => {
      if (resizeTimeoutRef.current) {
        clearTimeout(resizeTimeoutRef.current);
      }
    };
  }, [showResultPanel]);

  const handleEditorDidMount = (editor) => {
    editorRef.current = editor;
  };

  const handleDebug = async () => {
    setLoading(true);
    setResponse("");
    setLines([]);
    
    // Small delay before showing result panel to prevent resize conflicts
    setTimeout(() => {
      setShowResultPanel(true);
    }, 50);

    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        "https://ai-code-debugger.onrender.com/api/debug",
        { language, code },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const resultLines = res.data.result.split("\n");
      animateLines(resultLines);
    } catch (error) {
      const errorMessage =
        error.response?.data?.error || "An unexpected error occurred.";
      animateLines(errorMessage.split("\n"));
    }

    setLoading(false);
  };

  const animateLines = (resultLines) => {
    let index = 0;
    const interval = setInterval(() => {
      if (index >= resultLines.length) {
        clearInterval(interval);
        return;
      }
      setLines((prev) => [...prev, resultLines[index]]);
      index++;
    }, 50);
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />
              {/* Colorful Background Code Animation */}
              <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
                <div
                  className="animate-code-scroll font-mono text-xs leading-6 px-6"
                  style={{
                    opacity: 0.32,
                    height: "200%",
                    whiteSpace: "pre",
                  }}
                >
                  {Array.from({ length: 80 }, (_, i) => (
                    <div key={i}>
                      <span className="text-purple-400">function</span>{" "}
                      <span className="text-blue-400">{`example${i}`}</span>() {"{\n"}
                      {"  "}
                      <span className="text-blue-300">console</span>
                      <span className="text-gray-300">.</span>
                      <span className="text-green-400">log</span>
                      <span className="text-white">
                        (
                        <span className="text-yellow-300">
                          {`"Line ${i} executed"`}
                        </span>
                        );
                      </span>
                      {"\n}"}
                    </div>
                  ))}
                </div>
              </div>



      <div className="px-4 py-10 mt-8 md:mt-12">
        <div
          className={`transition-all duration-700 ease-in-out flex gap-6 ${
            showResultPanel 
              ? "justify-start items-start" 
              : "justify-center items-center min-h-[70vh]"
          }`}
        >
          {/* Editor Panel */}
          <div
            className={`bg-zinc-900 rounded-xl shadow-2xl p-6 transition-all duration-700 ease-in-out editor-container ${
              showResultPanel 
                ? "w-full lg:w-1/2 max-w-none" 
                : "w-full max-w-4xl"
            }`}
          >
            {/* Header with Language Selector */}
            <div className="mb-6 flex justify-between items-center">
              <h2 className="text-xl font-bold text-white">Code Editor</h2>
              <div className="relative">
                <label htmlFor="language" className="sr-only">
                  Programming Language
                </label>
                <select
                  id="language"
                  className="appearance-none bg-zinc-800 text-white border border-zinc-700 rounded-lg px-4 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 hover:bg-zinc-700"
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                >
                  <option value="python">Python</option>
                  <option value="c">C</option>
                  <option value="cpp">C++</option>
                  <option value="c#">C#</option>
                  <option value="javascript">JavaScript</option>
                  <option value="rust">Rust</option>
                  <option value="go">Go</option>
                  <option value="java">Java</option>
                </select>
                {/* Custom dropdown arrow */}
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Monaco Editor */}
            <div className="rounded-lg overflow-hidden mb-6 border border-zinc-700">
              <Editor
                height={showResultPanel ? "50vh" : "60vh"}
                language={language === "c#" ? "csharp" : language}
                theme="vs-dark"
                value={code}
                onChange={(value) => {
                  setCode(value || "");
                  localStorage.setItem("debug_code", value || "");
                }}
                
                onMount={handleEditorDidMount}
                options={{
                  minimap: { enabled: false },
                  fontSize: 14,
                  lineNumbers: "on",
                  roundedSelection: false,
                  scrollBeyondLastLine: false,
                  automaticLayout: true,
                  padding: { top: 16, bottom: 16 },
                  wordWrap: "on",
                  wrappingStrategy: "advanced"
                }}
              />
            </div>

            {/* Debug Button */}
            <div className="flex justify-center">
              <button
                onClick={handleDebug}
                disabled={loading || !code.trim()}
                className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed text-black font-semibold px-8 py-3 rounded-lg transition-all duration-200 transform hover:scale-105 disabled:scale-100 shadow-lg hover:shadow-xl"
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                    Analyzing...
                  </div>
                ) : (
                  "Debug Code"
                )}
              </button>
            </div>
          </div>

          {/* Response Panel */}
          {showResultPanel && (
            <div className="w-full lg:w-1/2 bg-zinc-900 rounded-xl shadow-2xl p-6 animate-slide-in ">
              <div className="mb-4 flex justify-between items-center">
                <h3 className="text-xl font-bold text-white">AI Response</h3>
                <button
                  onClick={() => setShowResultPanel(false)}
                  className="text-gray-400 hover:text-white transition-colors duration-200"
                  aria-label="Close response panel"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="bg-zinc-800 rounded-lg p-4 max-h-[60vh] overflow-y-auto border border-zinc-700">
                <div className="whitespace-pre-wrap font-mono text-sm leading-relaxed">
                  {lines.length === 0 && loading ? (
                    <div className="flex items-center gap-2 text-gray-400">
                      <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                      Processing your code...
                    </div>
                  ) : (
                    lines.map((line, idx) => (
                      <div
                        key={idx}
                        className="animate-fade-in transition-opacity mb-1"
                        style={{ animationDelay: `${idx * 50}ms` }}
                      >
                        {line}
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <footer className="text-center py-8 text-sm text-gray-400 border-t border-zinc-800 mt-12">
        Developed by{" "}
        <a
          href="https://github.com/shivamcy"
          target="_blank"
          rel="noopener noreferrer"
          className="text-white underline hover:text-green-400 transition-colors duration-200"
        >
          shivamcy
        </a>
      </footer>

      {/* Custom CSS animations */}
      <style>{`
      @keyframes codeScroll {
        0% {
          transform: translateY(0%);
        }
        100% {
          transform: translateY(-50%);
        }
      }

      .animate-code-scroll {
        animation: codeScroll 40s linear infinite;
      }

      
      .animate-code-scroll {
        animation: codeScroll 40s linear infinite;
        position: absolute;
        top: 0;
        left: 0;
        white-space: pre;
      }
      
        @keyframes fadeIn {
          from { 
            opacity: 0; 
            transform: translateY(10px);
          }
          to { 
            opacity: 1; 
            transform: translateY(0);
          }
        }
        
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        .animate-fade-in {
          animation: fadeIn 0.3s ease-out forwards;
        }
        
        .animate-slide-in {
          animation: slideIn 0.5s ease-out;
        }
        
        /* Custom scrollbar for response panel */
        .overflow-y-auto::-webkit-scrollbar {
          width: 8px;
        }
        
        .overflow-y-auto::-webkit-scrollbar-track {
          background: #27272a;
          border-radius: 4px;
        }
        
        .overflow-y-auto::-webkit-scrollbar-thumb {
          background: #52525b;
          border-radius: 4px;
        }
        
        .overflow-y-auto::-webkit-scrollbar-thumb:hover {
          background: #71717a;
        }

        /* Suppress ResizeObserver errors globally */
        .monaco-editor {
          transition: none !important;
        }

        /* Additional ResizeObserver error suppression */
        .monaco-editor .monaco-scrollable-element {
          transition: none !important;
        }

        /* Smooth transitions for layout changes */
        .editor-container {
          transition: all 0.7s cubic-bezier(0.4, 0, 0.2, 1);
        }
      `}</style>
    </div>
  );
};

export default Debug;