# Jason's Portfolio Website

A modern, interactive portfolio website built with Next.js, TypeScript, and Tailwind CSS. This portfolio showcases my projects, skills, and experience with a unique terminal-inspired interface.

## 🌟 Features

- **Interactive Terminal**: A fully functional terminal component that responds to commands like `help`, `ls`, `cat`, and `run`
- **Dynamic Project Showcase**: Projects are loaded from a JSON configuration file
- **Terminal Programs**: Terminal programs and commands are abstracted into a JSON configuration for easy maintenance
- **Responsive Design**: Fully responsive layout that works on mobile, tablet, and desktop
- **Dark/Light Mode**: Toggle between dark and light themes with persistent preference storage
- **Animations**: Smooth animations and transitions using Framer Motion
- **TypeScript**: Type-safe code with TypeScript

## 🚀 Getting Started

### Prerequisites

- Node.js 18.x or higher
- npm or yarn

### Installation

1. Clone the repository
   ```bash
   git clone https://github.com/jasonmadesomething/jasonmadesomething-portfolio.git
   cd jasonmadesomething-portfolio
   ```

2. Install dependencies
   ```bash
   npm install
   # or
   yarn install
   ```

3. Start the development server
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## 🛠️ Project Structure

- `src/app/components/` - React components including the Terminal component
- `src/app/data/` - JSON configuration files for projects, terminal programs, and site settings
- `src/app/(pages)/` - Page components for different routes
- `public/` - Static assets like images

## ⚙️ Configuration

The site is highly configurable through JSON files:

- `src/app/data/config.ts` - Site-wide configuration including theme, navigation, and social links
- `src/app/data/projects.json` - Project details and metadata
- `src/app/data/about.json` - Personal information, skills, and experience
- `src/app/data/terminal-programs.json` - Terminal commands and program outputs

## 🎨 Customization

To customize the site for your own use:

1. Update the configuration files in `src/app/data/`
2. Replace images in the `public/images/` directory
3. Modify the theme colors in `src/app/data/config.ts`

## 📦 Deployment

This site can be deployed on any platform that supports Next.js applications, such as Vercel, Netlify, or GitHub Pages.

```bash
# Build for production
npm run build

# Start production server
npm start
```

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.
