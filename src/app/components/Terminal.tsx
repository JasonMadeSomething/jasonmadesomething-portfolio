"use client";

import { useState, useEffect, useRef, KeyboardEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ProjectModal from "./ProjectModal";
import projectsData from "../data/projects.json";
import terminalProgramsData from "../data/terminal-programs.json";

// Define command response types
interface CommandResponse {
  output: string | React.ReactNode;
  isHtml?: boolean;
  animation?: string;
}

interface ProgramOutput {
  output: string[] | string;
  isHtml?: boolean;
  animation?: string;
  textClass?: string | {
    default?: string;
    results?: string;
    description?: string;
  };
}

interface TerminalConfig {
  [key: string]: CommandResponse;
}

interface CommandHistoryEntry {
  command: string;
  response: CommandResponse;
}

interface Project {
  name: string;
  description: string;
  technologies: string[];
  link?: string;
}

interface TerminalProps {
  initialMessage?: string;
  promptSymbol?: string;
  className?: string;
}

const Terminal: React.FC<TerminalProps> = ({
  initialMessage = "Welcome to the terminal. Type 'help' for available commands.",
  promptSymbol = "$",
  className = "",
}) => {
  const [input, setInput] = useState<string>("");
  const [history, setHistory] = useState<CommandHistoryEntry[]>([]);
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number>(-1);
  const [suggestedCommands] = useState<string[]>([
    "ls",
    `cd ${projectsData.projects[0]?.id || 'portfolio-site'}`,
    `cat ${terminalProgramsData.programs[0]?.id || 'euler.py'}`,
    `run ${terminalProgramsData.programs[0]?.id || 'euler.py'}`,
    "help"
  ]);
  
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [activeProject, setActiveProject] = useState<Project | null>(null);
  
  // Convert projects from JSON to a Record for easier lookup
  const projects: Record<string, Project> = {};
  projectsData.projects.forEach(project => {
    projects[project.id] = {
      name: project.title,
      description: project.description,
      technologies: project.tags,
      link: project.demoLink || project.link
    };
  });
  
  const inputRef = useRef<HTMLInputElement>(null);
  const terminalRef = useRef<HTMLDivElement>(null);
  
  // Convert terminal programs from JSON to a Record for easier lookup
  // Define interfaces that match the structure in terminal-programs.json
  interface TerminalCommandOutput {
    output: string[] | string;
    isHtml?: boolean;
    textClass?: string | Record<string, string>;
    animation?: string;
  }
  
  interface TerminalProgramCommands {
    [key: string]: TerminalCommandOutput;
  }
  
  interface TerminalProgramDefinition {
    id: string;
    name: string;
    description: string;
    type: string;
    commands: TerminalProgramCommands;
  }
  
  // Create a properly typed record for programs
  const programs: Record<string, TerminalProgramDefinition> = {};
  
  // Use type assertion to avoid TypeScript errors with the complex JSON structure
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  terminalProgramsData.programs.forEach((program: any) => {
    programs[program.id] = program as TerminalProgramDefinition;
  });

  // Base terminal commands (help, ls, clear, etc.)
  const baseTerminalConfig: TerminalConfig = {
    help: {
      output: Array.isArray(terminalProgramsData.commands.help.output) 
        ? terminalProgramsData.commands.help.output.join('\n')
        : terminalProgramsData.commands.help.output,
      isHtml: terminalProgramsData.commands.help.isHtml || false
    },
    ls: {
      output: (
        <div className="mt-1">
          <p className="text-yellow-400">projects/</p>
          <div className="mt-1 pl-4">
            {projectsData.projects.map(project => (
              <p key={project.id} className="text-blue-400">{project.id}/</p>
            ))}
            {terminalProgramsData.programs.map(program => (
              <p key={program.id}>{program.id}</p>
            ))}
          </div>
        </div>
      ),
      isHtml: true,
    },
    clear: {
      output: "",
    },
    default: terminalProgramsData.commands.default
      ? {
          output: Array.isArray(terminalProgramsData.commands.default.output)
            ? terminalProgramsData.commands.default.output.join('\n')
            : terminalProgramsData.commands.default.output,
          isHtml: terminalProgramsData.commands.default.isHtml || false
        }
      : {
          output: "Command not found. Type 'help' for available commands.",
        },
  };

  // Focus the input field when the terminal is clicked
  const focusInput = () => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  // Scroll to bottom when history changes
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [history]);

  // Handle command execution
  const executeCommand = (cmd: string) => {
    if (!cmd.trim()) return;
    
    let response: CommandResponse;
    
    // Process the command
    const normalizedCmd = cmd.trim().toLowerCase();
    
    if (normalizedCmd === "clear") {
      setHistory([]);
      return;
    } else if (normalizedCmd.startsWith("cd ")) {
      // Handle cd command
      const projectName = normalizedCmd.substring(3).trim();
      
      if (projects[projectName]) {
        // Open project modal
        setActiveProject(projects[projectName]);
        setModalOpen(true);
        response = {
          output: `Opening ${projectName} project information...`
        };
      } else if (projectName === ".." || projectName === "~") {
        response = {
          output: "Back to home directory."
        };
      } else {
        response = {
          output: `Directory not found: ${projectName}`
        };
      }
    } else if (normalizedCmd.startsWith("cat ") || normalizedCmd.startsWith("run ")) {
      // Handle program commands (cat, run)
      const parts = normalizedCmd.split(' ');
      const command = parts[0];
      const programId = parts.slice(1).join(' ');
      
      if (programs[programId] && programs[programId].commands[command]) {
        const programResponse = programs[programId].commands[command];
        
        if (programResponse.isHtml && Array.isArray(programResponse.output)) {
          // Handle HTML output with text classes
          const textClass = typeof programResponse.textClass === 'string' 
            ? programResponse.textClass 
            : programResponse.textClass?.default || '';
          
          if (command === 'run' && programResponse.animation) {
            // Special handling for animated run commands
            response = {
              output: (
                <div className="relative">
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    className={textClass}
                  >
                    <p>{programResponse.output[0]}</p>
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.5, duration: 0.5 }}
                    >
                      {programResponse.output.slice(1).map((line: string, idx) => {
                        const className = idx === 0 
                          ? (typeof programResponse.textClass === 'object' ? programResponse.textClass.results || '' : '')
                          : (typeof programResponse.textClass === 'object' ? programResponse.textClass.description || '' : '');
                        return <div key={idx} className={className}>{line}</div>;
                      })}
                    </motion.div>
                  </motion.div>
                </div>
              ),
              isHtml: true,
              animation: programResponse.animation
            };
          } else {
            // Regular HTML output
            response = {
              output: (
                <div className={textClass}>
                  {programResponse.output.map((line: string, idx) => (
                    <p key={idx}>{line}</p>
                  ))}
                </div>
              ),
              isHtml: true
            };
          }
        } else {
          // Handle plain text output
          response = {
            ...programResponse,
            output: Array.isArray(programResponse.output) 
              ? programResponse.output.join('\n') 
              : programResponse.output
          };
        }
      } else {
        response = {
          output: `File not found: ${programId}`
        };
      }
    } else if (baseTerminalConfig[normalizedCmd]) {
      response = baseTerminalConfig[normalizedCmd];
    } else {
      response = baseTerminalConfig.default || { output: "Command not found. Type 'help' for available commands." };
    }
    
    // Add to history
    setHistory(prev => [...prev, { command: cmd, response }]);
    setCommandHistory(prev => [...prev, cmd]);
    setHistoryIndex(-1);
    setInput("");
  };

  // Handle keyboard events
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      executeCommand(input);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (commandHistory.length > 0) {
        const newIndex = historyIndex < commandHistory.length - 1 ? historyIndex + 1 : historyIndex;
        setHistoryIndex(newIndex);
        setInput(commandHistory[commandHistory.length - 1 - newIndex] || "");
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (historyIndex > 0) {
        const newIndex = historyIndex - 1;
        setHistoryIndex(newIndex);
        setInput(commandHistory[commandHistory.length - 1 - newIndex] || "");
      } else {
        setHistoryIndex(-1);
        setInput("");
      }
    }
  };

  // Handle suggested command click
  const handleSuggestedCommand = (cmd: string) => {
    setInput(cmd);
    executeCommand(cmd);
  };

  return (
    <>
      {/* Project Modal */}
      <ProjectModal 
        project={activeProject}
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
      />
      
      <div 
        className={`w-full h-full bg-gray-900 border border-indigo-500/50 rounded-md overflow-hidden shadow-lg shadow-indigo-500/20 flex flex-col ${className}`}
        onClick={focusInput}
      >
      {/* Terminal header */}
      <div className="bg-gray-800 px-4 py-2 flex items-center">
        <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
        <div className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></div>
        <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
        <div className="text-xs text-gray-400 ml-2 font-mono">~/projects</div>
      </div>
      
      {/* Terminal content */}
      <div 
        ref={terminalRef}
        className="flex-1 p-4 font-mono text-xs overflow-y-auto"
      >
        {/* Initial message */}
        {initialMessage && (
          <div className="text-gray-400 mb-2">{initialMessage}</div>
        )}
        
        {/* Command history */}
        <AnimatePresence>
          {history.map((entry, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              className="mb-3"
            >
              <div className="flex">
                <span className="text-green-400 mr-2">{promptSymbol}</span>
                <span className="text-white">{entry.command}</span>
              </div>
              <div className="mt-1 pl-4">
                {entry.response.isHtml ? (
                  entry.response.output
                ) : (
                  <span className="text-gray-300 whitespace-pre-wrap">{entry.response.output}</span>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        
        {/* Input line */}
        <div className="flex items-center">
          <span className="text-green-400 mr-2">{promptSymbol}</span>
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 bg-transparent text-white outline-none border-none"
            autoFocus
          />
          <motion.span 
            className="inline-block w-2 h-4 bg-gray-300"
            animate={{ opacity: [1, 0, 1] }}
            transition={{ duration: 1, repeat: Infinity }}
          />
        </div>
      </div>
      
      {/* Suggested commands */}
      <div className="bg-gray-800/50 px-4 py-2 border-t border-gray-700/50">
        <div className="text-xs text-gray-500 mb-1">Suggested commands:</div>
        <div className="flex flex-wrap gap-2">
          {suggestedCommands.map((cmd, index) => (
            <button
              key={index}
              onClick={() => handleSuggestedCommand(cmd)}
              className="px-2 py-1 text-xs bg-gray-700 hover:bg-gray-600 text-gray-300 rounded transition-colors"
            >
              {cmd}
            </button>
          ))}
        </div>
      </div>
    </div>
    </>
  );
};

export default Terminal;
