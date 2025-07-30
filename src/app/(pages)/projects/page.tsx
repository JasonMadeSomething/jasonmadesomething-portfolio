"use client";

import { useState, useEffect, Suspense } from "react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";

interface Project {
  id: string;
  title: string;
  description: string;
  image: string;
  tags: string[];
  link: string;
  demoLink: string;
  featured: boolean;
}

// Component that uses searchParams needs to be wrapped in Suspense
function ProjectsContent() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [allTags, setAllTags] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  
  const searchParams = useSearchParams();
  
  // Load projects data
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        // In a real app, you might fetch this from an API
        const response = await fetch('/api/projects');
        const data = await response.json();
        setProjects(data.projects);
        
        // Extract all unique tags
        const tags = data.projects.flatMap((project: Project) => project.tags);
        const uniqueTags = Array.from(new Set(tags)) as string[];
        setAllTags(uniqueTags);
        
        // Check for tag filters in URL
        const tagParam = searchParams.get('tag');
        if (tagParam) {
          setSelectedTags([tagParam]);
        }
        
        setIsLoaded(true);
      } catch (error) {
        console.error("Error fetching projects:", error);
        
        // For development, use the local data directly
        import('../../data/projects.json').then((data) => {
          setProjects(data.projects);
          
          // Extract all unique tags
          const tags = data.projects.flatMap((project: Project) => project.tags);
          const uniqueTags = Array.from(new Set(tags)) as string[];
          setAllTags(uniqueTags);
          
          // Check for tag filters in URL
          const tagParam = searchParams.get('tag');
          if (tagParam) {
            setSelectedTags([tagParam]);
          }
          
          setIsLoaded(true);
        });
      }
    };
    
    fetchProjects();
  }, [searchParams]);
  
  // Filter projects based on selected tags
  const filteredProjects = selectedTags.length > 0
    ? projects.filter(project => 
        selectedTags.some(tag => project.tags.includes(tag))
      )
    : projects;
  
  // Toggle tag selection
  const toggleTag = (tag: string) => {
    setSelectedTags(prev => {
      if (prev.includes(tag)) {
        return prev.filter(t => t !== tag);
      } else {
        return [...prev, tag];
      }
    });
  };
  
  // Clear all filters
  const clearFilters = () => {
    setSelectedTags([]);
  };
  
  // Animation variants for staggered animations
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    show: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15
      }
    }
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 relative">
      {/* Background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-5">
        <Image src="/images/grid.svg" alt="" className="absolute inset-0 w-full h-full object-cover" />
      </div>
      
      <motion.div 
        className={`relative z-10 transition-opacity duration-500 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
        initial="hidden"
        animate={isLoaded ? "show" : "hidden"}
        variants={containerVariants}>
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">My Projects</h1>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            A collection of my work, side projects, and experiments
          </p>
        </div>
        
        {/* Tags filter */}
        <div className="mb-8">
          <div className="flex flex-wrap items-center gap-2 justify-center mb-4">
            <span className="text-gray-700 dark:text-gray-300 font-medium">Filter by:</span>
            {allTags.map(tag => (
              <button
                key={tag}
                onClick={() => toggleTag(tag)}
                className={`px-3 py-1 rounded-full text-sm transition-colors ${
                  selectedTags.includes(tag)
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                {tag}
              </button>
            ))}
            {selectedTags.length > 0 && (
              <button
                onClick={clearFilters}
                className="px-3 py-1 rounded-full text-sm bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 hover:bg-red-200 dark:hover:bg-red-800 transition-colors"
              >
                Clear filters
              </button>
            )}
          </div>
          
          {selectedTags.length > 0 && (
            <p className="text-center text-sm text-gray-600 dark:text-gray-400">
              Showing {filteredProjects.length} of {projects.length} projects
            </p>
          )}
        </div>
        
        {/* Projects grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.map(project => (
            <div 
              key={project.id}
              className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
            >
              <div className="h-48 bg-gradient-to-r from-indigo-500 to-purple-600 relative overflow-hidden">
                {project.image.startsWith('/') ? (
                  <div className="flex items-center justify-center h-full">
                    <svg className="w-16 h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                ) : (
                  <Image 
                    src={project.image || "/images/projects/placeholder.jpg"}
                    alt={project.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    width={400}
                    height={300}
                  />
                )}
              </div>
              
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2">{project.title}</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">{project.description}</p>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.tags.map(tag => (
                    <span 
                      key={tag}
                      className="px-2 py-1 text-xs rounded-full bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                
                <div className="flex justify-between">
                  <a 
                    href={project.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 font-medium flex items-center"
                  >
                    <svg className="w-5 h-5 mr-1" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                    </svg>
                    Code
                  </a>
                  
                  {project.demoLink && (
                    <a 
                      href={project.demoLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 font-medium flex items-center"
                    >
                      <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                      Live Demo
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {filteredProjects.length === 0 && (
          <div className="text-center py-12">
            <svg className="w-16 h-16 mx-auto text-gray-400 dark:text-gray-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="text-xl font-medium mb-2">No projects found</h3>
            <p className="text-gray-600 dark:text-gray-400">
              No projects match your selected filters. Try clearing some filters.
            </p>
            <button
              onClick={clearFilters}
              className="mt-4 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md transition-colors"
            >
              Clear all filters
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
}

// Main page component with Suspense boundary
export default function ProjectsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading projects...</div>}>
      <ProjectsContent />
    </Suspense>
  );
}
