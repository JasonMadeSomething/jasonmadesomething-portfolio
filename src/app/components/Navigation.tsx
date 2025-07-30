"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { siteConfig } from "../data/config";
import { useTheme } from "./ThemeProvider";

export default function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <nav
      className={`fixed w-full z-50 transition-all duration-300 ${isScrolled ? "bg-white/90 dark:bg-gray-900/90 shadow-md backdrop-blur-md py-2" : "bg-white/70 dark:bg-gray-900/70 backdrop-blur-sm py-4"}`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link href="/" className="group relative overflow-hidden">
            <div className="flex items-center">
              <div className="relative">
                <motion.div 
                  className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full opacity-70 blur-sm group-hover:opacity-100 transition duration-300"
                  animate={{ 
                    rotate: [0, 360],
                  }}
                  transition={{
                    duration: 20,
                    repeat: Infinity,
                    ease: "linear"
                  }}
                />
                <div className="relative dark:bg-gray-900 bg-gray-100 text-xl font-mono font-bold dark:text-white text-gray-900 px-3 py-1 rounded-md">
                  {siteConfig.name}<span className="text-indigo-400">@</span><span className="text-purple-400">dev</span><span className="text-pink-400 animate-pulse">_</span>
                </div>
              </div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <NavLink href="/" isActive={pathname === "/"} label={siteConfig.nav.home} />
            <NavLink
              href="/projects"
              isActive={pathname === "/projects"}
              label={siteConfig.nav.projects}
            />
            <NavLink
              href="/about"
              isActive={pathname === "/about"}
              label={siteConfig.nav.about}
            />
            
            {/* Theme Toggle */}
            <button 
              onClick={() => {
                toggleTheme();
                console.log('Theme toggled to:', theme === 'dark' ? 'light' : 'dark');
              }}
              className="p-2 rounded-full hover:bg-gray-800/30 dark:hover:bg-gray-700/50 transition-colors focus:outline-none"
              aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {theme === 'dark' ? (
                <svg className="w-5 h-5 text-yellow-300" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg className="w-5 h-5 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                </svg>
              )}
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-gray-300 hover:text-indigo-400 focus:outline-none transition-colors duration-300"
              aria-label="Toggle menu"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {isMobileMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div 
              className="md:hidden mt-4 dark:bg-gray-900/95 bg-white/95 backdrop-blur-md rounded-lg border dark:border-indigo-500/30 border-gray-200 shadow-lg dark:shadow-indigo-500/20 p-4 overflow-hidden"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex flex-col space-y-4">
                <MobileNavLink
                  href="/"
                  isActive={pathname === "/"}
                  label={siteConfig.nav.home}
                  onClick={() => setIsMobileMenuOpen(false)}
                />
                <MobileNavLink
                  href="/projects"
                  isActive={pathname === "/projects"}
                  label={siteConfig.nav.projects}
                  onClick={() => setIsMobileMenuOpen(false)}
                />
                <MobileNavLink
                  href="/about"
                  isActive={pathname === "/about"}
                  label={siteConfig.nav.about}
                  onClick={() => setIsMobileMenuOpen(false)}
                />
                
                {/* Mobile Theme Toggle */}
                <div className="pt-2 border-t dark:border-gray-700 border-gray-200">
                  <button 
                    onClick={() => {
                      toggleTheme();
                      console.log('Mobile theme toggled to:', theme === 'dark' ? 'light' : 'dark');
                      setIsMobileMenuOpen(false);
                    }}
                    className="flex items-center w-full px-3 py-2 rounded-md dark:hover:bg-gray-800 hover:bg-gray-100 transition-colors"
                  >
                    <span className="mr-3">
                      {theme === 'dark' ? (
                        <svg className="w-5 h-5 text-yellow-300" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
                        </svg>
                      ) : (
                        <svg className="w-5 h-5 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                        </svg>
                      )}
                    </span>
                    <span className="dark:text-gray-300 text-gray-700">
                      {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
                    </span>
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
}

function NavLink({ href, isActive, label }: { href: string; isActive: boolean; label: string }) {
  return (
    <Link
      href={href}
      className="group relative"
    >
      <span className={`${isActive ? "text-indigo-400 font-medium" : "dark:text-gray-300 text-gray-700 dark:group-hover:text-gray-100 group-hover:text-gray-900"} transition-colors duration-300 block py-1 px-2`}>
        {isActive && (
          <span className="absolute -left-2 -mt-0.5 text-xs text-pink-400 font-mono">$</span>
        )}
        {label}
      </span>
      {isActive && (
        <motion.span 
          className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-indigo-500 to-purple-500"
          layoutId="navIndicator"
          transition={{ type: "spring", bounce: 0.25 }}
        />
      )}
    </Link>
  );
}

function MobileNavLink({
  href,
  isActive,
  label,
  onClick,
}: {
  href: string;
  isActive: boolean;
  label: string;
  onClick: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={`${isActive ? "bg-indigo-900/50 text-indigo-300 font-medium" : "text-gray-300 hover:bg-gray-800/50"} block px-3 py-2 rounded-md transition-colors duration-300 font-mono`}
    >
      {isActive && <span className="text-pink-400 mr-1">$</span>}
      {label}
    </Link>
  );
}
