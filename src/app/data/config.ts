export const siteConfig = {
  name: "Jason",
  title: "Backend Developer & Systems Thinker",
  description: "Engineering strange, scalable, and slightly sarcastic software.",
  
  // Splash page content
  splash: {
    greeting: "Hey, I'm",
    taglines: [
      "Engineering meaning into the meaningless",
      "Turning chaos into code",
      "CORS: Because nothing says 'web dev' like arbitrary suffering.",
      "404s shouldn't be boring. Mine aren't.",
      "Distributed systems, unified vision",
      "Ops brain, dev heart, chaos soul",
    ],
    bio: "I’m a backend engineer with a taste for the absurd and a focus on systems that scale. Whether it's rewriting legacy APIs, building semantic authentication layers, or making 404 pages argue with you, I enjoy crafting software that's both functional and a little bit fun.",
    ctaPrimary: "See My Projects",
    ctaSecondary: "Learn More"
  },

  // Navigation
  nav: {
    home: "Home",
    projects: "Projects",
    about: "About"
  },

  // Footer
  footer: {
    copyright: `© ${new Date().getFullYear()} Jason Teitelman. All rights reserved.`,
    tagline: "Crafted with caffeine, chaos, and curiosity."
  },

  // Social links
  social: {
    github: "https://github.com/jasonmadesomething",
    linkedin: "https://linkedin.com/in/jasonmadesomething"
  },

  // Theme
  theme: {
    default: "dark", // "light" or "dark"
    colors: {
      primary: "#6366f1", // indigo
      secondary: "#8b5cf6", // violet
      accent: "#ec4899"     // pink
    }
  }
}
