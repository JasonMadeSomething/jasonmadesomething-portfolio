"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { siteConfig } from "../../data/config";

interface Skill {
  category: string;
  technologies: string[];
}

interface Experience {
  company: string;
  position: string;
  period: string;
  description: string;
}

interface Education {
  institution: string;
  degree: string;
  period: string;
}

interface SocialLinks {
  github: string;
  linkedin: string;
  twitter: string;
}

interface AboutData {
  name: string;
  title: string;
  bio: string;
  longBio: string;
  skills: Skill[];
  experience: Experience[];
  education: Education[];
  socialLinks: SocialLinks;
}

export default function AboutPage() {
  const [aboutData, setAboutData] = useState<AboutData | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [activeTab, setActiveTab] = useState<'skills' | 'experience' | 'education'>('skills');
  
  useEffect(() => {
    const fetchAboutData = async () => {
      try {
        // In a real app, you might fetch this from an API
        const response = await fetch('/api/about');
        const data = await response.json();
        setAboutData(data);
        setIsLoaded(true);
      } catch (error) {
        console.error("Error fetching about data:", error);
        
        // For development, use the local data directly
        import('../../data/about.json').then((data) => {
          setAboutData(data);
          setIsLoaded(true);
        });
      }
    };
    
    fetchAboutData();
  }, []);
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15
      }
    }
  } as const;
  
  if (!isLoaded || !aboutData) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 flex items-center justify-center min-h-[60vh] bg-gray-900">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-32 h-32 bg-gray-800 rounded-full mb-6 border border-indigo-500/30"></div>
          <div className="h-6 bg-gray-800 rounded w-48 mb-4"></div>
          <div className="h-4 bg-gray-800 rounded w-64"></div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 relative bg-gray-900">
      {/* Background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-5">
        <img src="/images/grid.svg" alt="" className="absolute inset-0 w-full h-full object-cover" />
      </div>
      
      <motion.div 
        className="max-w-4xl mx-auto relative z-10"
        initial="hidden"
        animate={isLoaded ? "visible" : "hidden"}
        variants={containerVariants}>
        {/* Hero Section */}
        <motion.div 
          className="flex flex-col md:flex-row items-center md:items-start gap-8 mb-16"
          variants={containerVariants}
        >
          <motion.div 
            className="w-48 h-48 relative rounded-full overflow-hidden border-2 border-indigo-500/30 shadow-lg shadow-indigo-500/20 flex-shrink-0"
            variants={itemVariants}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 to-purple-700"></div>
            <div className="absolute inset-0 flex items-center justify-center text-white text-6xl font-mono font-bold">
              <span className="relative">
                {aboutData.name.charAt(0)}
                <span className="absolute -top-1 -right-1 text-xs text-pink-400">_</span>
              </span>
            </div>
          </motion.div>
          
          <motion.div variants={itemVariants}>
            <h1 className="text-4xl font-bold mb-2 text-white">{aboutData.name}</h1>
            <div className="flex items-center mb-4">
              <span className="text-pink-400 font-mono mr-2">$</span>
              <p className="text-xl text-indigo-400 font-mono">{aboutData.title}</p>
            </div>
            <p className="text-gray-300 mb-6 font-mono">{aboutData.bio}</p>
            
            <div className="flex gap-4">
              {aboutData.socialLinks.github && (
                <motion.a 
                  href={aboutData.socialLinks.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-indigo-400 transition-colors"
                  aria-label="GitHub"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                  </svg>
                </motion.a>
              )}
              
              {aboutData.socialLinks.linkedin && (
                <motion.a 
                  href={aboutData.socialLinks.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-indigo-400 transition-colors"
                  aria-label="LinkedIn"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                </motion.a>
              )}
              
              {aboutData.socialLinks.twitter && (
                <motion.a 
                  href={aboutData.socialLinks.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-indigo-400 transition-colors"
                  aria-label="Twitter"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </motion.a>
              )}
            </div>
          </motion.div>
        </motion.div>
        
        {/* Bio Section */}
        <motion.div className="mb-16" variants={itemVariants}>
          <motion.h2 
            className="text-2xl font-bold mb-6 text-white border-b border-indigo-500/30 pb-2"
            variants={itemVariants}
          >
            About Me
          </motion.h2>
          <motion.div 
            className="prose prose-invert prose-indigo max-w-none"
            variants={itemVariants}
          >
            <div className="text-gray-300 font-mono leading-relaxed" dangerouslySetInnerHTML={{ __html: aboutData.longBio }} />
          </motion.div>
        </motion.div>
        
        {/* Tabs Section */}
        <motion.div variants={itemVariants}>
          <motion.div 
            className="flex mb-8 border-b border-gray-800"
            variants={itemVariants}
          >
            <button 
              onClick={() => setActiveTab('skills')} 
              className={`px-4 py-2 font-medium ${activeTab === 'skills' ? 'text-indigo-400 border-b-2 border-indigo-500' : 'text-gray-400'}`}
            >
              Skills
            </button>
            <button 
              onClick={() => setActiveTab('experience')} 
              className={`px-4 py-2 font-medium ${activeTab === 'experience' ? 'text-indigo-400 border-b-2 border-indigo-500' : 'text-gray-400'}`}
            >
              Experience
            </button>
            <button 
              onClick={() => setActiveTab('education')} 
              className={`px-4 py-2 font-medium ${activeTab === 'education' ? 'text-indigo-400 border-b-2 border-indigo-500' : 'text-gray-400'}`}
            >
              Education
            </button>
          </motion.div>
          
          {/* Skills Tab */}
          {activeTab === 'skills' && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              {aboutData.skills.map((skillGroup, index) => (
                <div key={index} className="mb-8">
                  <h3 className="text-xl font-bold mb-4 text-indigo-400">{skillGroup.category}</h3>
                  <div className="flex flex-wrap gap-2">
                    {skillGroup.technologies.map((tech, techIndex) => (
                      <span 
                        key={techIndex} 
                        className="px-3 py-1 bg-gray-800 text-gray-300 rounded-full text-sm font-mono"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </motion.div>
          )}
          
          {/* Experience Tab */}
          {activeTab === 'experience' && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              {aboutData.experience.map((exp, index) => (
                <div key={index} className="mb-8 border-l-2 border-indigo-500/30 pl-4">
                  <h3 className="text-xl font-bold text-white">{exp.position}</h3>
                  <p className="text-indigo-400 mb-2">{exp.company}</p>
                  <p className="text-gray-500 mb-4 text-sm font-mono">{exp.period}</p>
                  <p className="text-gray-300">{exp.description}</p>
                </div>
              ))}
            </motion.div>
          )}
          
          {/* Education Tab */}
          {activeTab === 'education' && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              {aboutData.education.map((edu, index) => (
                <div key={index} className="mb-8 border-l-2 border-indigo-500/30 pl-4">
                  <h3 className="text-xl font-bold text-white">{edu.degree}</h3>
                  <p className="text-indigo-400 mb-2">{edu.institution}</p>
                  <p className="text-gray-500 mb-4 text-sm font-mono">{edu.period}</p>
                </div>
              ))}
            </motion.div>
          )}
        </motion.div>
      </motion.div>
    </div>
  );
}
