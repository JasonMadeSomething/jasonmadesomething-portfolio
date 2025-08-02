"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { siteConfig } from "./data/config";
import Terminal from "./components/Terminal";
import projectsData from "./data/projects.json";

// Define the Project interface to match the structure in projects.json
interface Project {
  id: string;
  title: string;
  description: string;
  image?: string;
  tags: string[];
  link: string;
  demoLink?: string;
  featured: boolean;
}

export default function Home() {
  // State for UI elements
  const [taglineIndex, setTaglineIndex] = useState(0);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const [featuredProjects, setFeaturedProjects] = useState<Project[]>([]);
  
  // Handle mouse movement for interactive elements
  const handleMouseMove = (e: React.MouseEvent) => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      setMousePosition({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      });
    }
  };
  
  // Rotate through taglines and load featured projects
  useEffect(() => {
    // Load featured projects from projects.json
    const featured = (projectsData as { projects: Project[] }).projects.filter(project => project.featured);
    setFeaturedProjects(featured);
    
    const interval = setInterval(() => {
      setTaglineIndex((prev) => 
        (prev + 1) % siteConfig.splash.taglines.length
      );
    }, 3000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div 
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="min-h-[calc(100vh-80px)] flex flex-col bg-gray-900 text-gray-100 relative overflow-hidden"
    >
      {/* Generative background */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-indigo-950 to-purple-950"></div>
        
        {/* Grid pattern */}
        <div className="absolute inset-0 bg-[url('/images/grid.svg')] bg-center opacity-[0.07]"></div>
        
        {/* Animated blobs */}
        <motion.div 
          className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-indigo-600/20 blur-3xl"
          animate={{
            x: [0, 30, -20, 0],
            y: [0, -30, 20, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            repeatType: "reverse"
          }}
        />
        
        <motion.div 
          className="absolute bottom-1/4 right-1/3 w-80 h-80 rounded-full bg-purple-600/20 blur-3xl"
          animate={{
            x: [0, -40, 30, 0],
            y: [0, 40, -30, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            repeatType: "reverse"
          }}
        />
        
        <motion.div 
          className="absolute top-2/3 right-1/4 w-64 h-64 rounded-full bg-pink-600/20 blur-3xl"
          animate={{
            x: [0, 50, -40, 0],
            y: [0, -20, 40, 0],
          }}
          transition={{
            duration: 30,
            repeat: Infinity,
            repeatType: "reverse"
          }}
        />
      </div>
      
      {/* Noise texture overlay */}
      <div className="absolute inset-0 bg-[url('/images/noise.png')] opacity-[0.03] mix-blend-overlay pointer-events-none"></div>
      
      {/* Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 flex flex-col justify-center min-h-[80vh]">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          {/* Main content */}
          <motion.div 
            className="md:col-span-7 md:col-start-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            {/* Glitchy greeting */}
            <motion.div 
              className="mb-2 inline-block"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <div className="relative inline-block px-3 py-1 text-sm font-mono text-indigo-300 overflow-hidden">
                <div className="absolute inset-0 bg-indigo-900/30"></div>
                <div className="relative z-10">$ {siteConfig.splash.greeting}</div>
              </div>
            </motion.div>
            
            {/* Name */}
            <motion.h1 
              className="text-5xl sm:text-6xl md:text-7xl font-bold mb-4"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">
                {siteConfig.name}
              </span>
              <span className="inline-block ml-1 text-pink-400 animate-pulse">_</span>
            </motion.h1>
            
            {/* Rotating taglines */}
            <div className="h-16 sm:h-12 mb-6">
              <AnimatePresence mode="wait">
                <motion.p
                  key={taglineIndex}
                  className="text-xl sm:text-2xl text-gray-300"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.5 }}
                >
                  {siteConfig.splash.taglines[taglineIndex]}
                </motion.p>
              </AnimatePresence>
            </div>
            
            {/* Bio */}
            <motion.p 
              className="text-gray-400 max-w-lg mb-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.6 }}
            >
              {siteConfig.splash.bio}
            </motion.p>
            
            {/* CTAs */}
            <motion.div 
              className="flex flex-wrap gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 0.6 }}
            >
              <Link 
                href="/projects"
                className="group relative px-6 py-3 bg-indigo-600 text-white font-medium overflow-hidden"
              >
                <span className="relative z-10">{siteConfig.splash.ctaPrimary}</span>
                <div className="absolute inset-0 bg-indigo-500 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
              </Link>
              <Link 
                href="/about"
                className="group relative px-6 py-3 border border-indigo-500/50 text-indigo-300 font-medium overflow-hidden"
              >
                <span className="relative z-10">{siteConfig.splash.ctaSecondary}</span>
                <div className="absolute inset-0 bg-indigo-900/50 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
              </Link>
            </motion.div>
          </motion.div>
          
          {/* Visual element */}
          <motion.div 
            className="md:col-span-3 md:col-start-9 relative"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.8 }}
          >
            {/* Backend-themed visual with Euler Identity */}
            <div className="relative aspect-square max-w-xs mx-auto">
              {/* Terminal is now the main visual element */}
              
              {/* Interactive Terminal */}
              <motion.div 
                className="absolute inset-0 mt-8"
                initial={{ y: 20 }}
                animate={{ y: 0 }}
                transition={{ delay: 0.8, duration: 0.5, type: "spring" }}
              >
                <Terminal 
                  initialMessage="Welcome to Jason's terminal. Type 'help' for available commands."
                  promptSymbol="$"
                />
              </motion.div>
              
              {/* Interactive element that follows mouse */}
              <motion.div 
                className="absolute inset-0 flex items-center justify-center pointer-events-none"
                animate={{
                  x: mousePosition.x / 20 - 10,
                  y: mousePosition.y / 20 - 10,
                }}
                transition={{ type: "spring", stiffness: 150, damping: 15 }}
              >
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 opacity-40 blur-xl"></div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Featured Projects Preview */}
      <section className="py-20 relative z-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-block px-3 py-1 text-sm font-mono text-indigo-300 bg-indigo-900/30 mb-3">
              $ ls -la projects/
            </div>
            <h2 className="text-3xl font-bold text-white">Featured Projects</h2>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            {featuredProjects.length > 0 ? (
              featuredProjects.map((project, index) => (
                <motion.div 
                  key={project.id}
                  className={`${index === 0 ? 'md:col-span-8' : 'md:col-span-4'} group`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + (index * 0.2), duration: 0.6 }}
                >
                  <a 
                    href={project.demoLink || `/projects?id=${project.id}`}
                    target={project.demoLink ? "_blank" : "_self"}
                    rel={project.demoLink ? "noopener noreferrer" : ""}
                    className="block bg-gray-800 hover:bg-gray-750 transition-colors overflow-hidden h-full"
                  >
                    <div className={`${index === 0 ? 'h-64' : 'h-48'} bg-gradient-to-br from-indigo-600 to-purple-700 relative overflow-hidden`}>
                      {project.image ? (
                        <Image 
                          src={project.image}
                          alt={project.title}
                          className="w-full h-full object-cover"
                          width={800}
                          height={index === 0 ? 400 : 300}
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <svg className={`${index === 0 ? 'w-16 h-16' : 'w-12 h-12'} text-white/80`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                        </div>
                      )}
                      
                      {/* Code overlay */}
                      <div className="absolute inset-0 bg-gray-900/80 opacity-0 group-hover:opacity-100 transition-opacity">
                        <pre className="text-xs text-indigo-300 p-4 font-mono overflow-hidden">
                          <code>{`// ${project.title}
// ${project.tags.join(', ')}`}</code>
                        </pre>
                      </div>
                    </div>
                    <div className="p-6">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-xl font-bold text-white group-hover:text-indigo-400 transition-colors">{project.title}</h3>
                        <span className="text-xs bg-indigo-900/50 text-indigo-300 px-2 py-1">Featured</span>
                      </div>
                      <p className="text-gray-400 mb-4">{project.description}</p>
                      <div className="flex flex-wrap gap-2">
                        {project.tags.slice(0, 3).map((tag, tagIndex) => (
                          <span key={tagIndex} className="px-2 py-1 text-xs bg-gray-700 text-gray-300">{tag}</span>
                        ))}
                      </div>
                    </div>
                  </a>
                </motion.div>
              ))
            ) : (
              <div className="col-span-12 text-center py-12">
                <p className="text-gray-400">No featured projects found.</p>
              </div>
            )}
          </div>
          
          {/* View all link */}
          <motion.div 
            className="mt-12 text-right"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.6 }}
          >
            <Link 
              href="/projects"
              className="inline-flex items-center group"
            >
              <span className="font-mono text-indigo-400 mr-2 group-hover:mr-3 transition-all">cd</span>
              <span className="text-indigo-300 group-hover:text-indigo-200 transition-colors">/projects</span>
              <span className="text-pink-400 ml-1 group-hover:ml-2 transition-all">~</span>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
