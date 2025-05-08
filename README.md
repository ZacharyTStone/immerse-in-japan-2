# Immerse In Japan

A blog designed to help Japanese language learners find content at their level, built with Next.js and Sanity.io as the headless CMS.

## Features

- Content categorized by JLPT levels (N5-N1)
- Articles tagged with content types (Text, Video, Audio, Game, Tools)
- Furigana support for reading assistance
- Responsive design optimized for all devices
- Advanced search functionality for finding level-appropriate content
- Author profiles with JLPT level indicators
- Image optimization
- SEO friendly
- TypeScript support

## Project Structure

```
immerse-in-japan-2/
├── app/                      # Next.js app directory
│   ├── (blog)/               # Main blog components and pages
│   │   ├── posts/            # Blog post pages
│   │   ├── authors/          # Author pages
│   │   ├── search/           # Search functionality
│   ├── (sanity)/             # Sanity Studio integration
│   │   ├── studio/           # Embedded Sanity Studio
│   ├── api/                  # API routes
│       ├── draft/            # Preview mode API
│       ├── search/           # Search functionality API
├── public/                   # Static assets
├── sanity/                   # Sanity configuration
│   ├── schemas/              # Content schemas
│   ├── lib/                  # Sanity utility functions
│   ├── plugins/              # Sanity plugins
```

## Getting Started

### Prerequisites

- Node.js (v16+)
- npm or yarn

### Installation

1. Clone the repository

```bash
git clone https://github.com/yourusername/immerse-in-japan-2.git
cd immerse-in-japan-2
```

2. Install dependencies

```bash
yarn install
# or
npm install
```

3. Set up environment variables

```bash
# Follow the guide for setting up Sanity environment variables
yarn setup
# or
npm run setup
```

4. Run the development server

```bash
yarn dev
# or
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Content Management

This project uses Sanity.io for content management with the following key schemas:

- **Posts**: Blog articles with JLPT level indicators, content types, and media embeds
- **Authors**: Content creators with their own JLPT proficiency levels
- **Tags**: For categorizing content

Sanity Studio is embedded in the application and can be accessed at `/studio` when running the development server.

## Build and Deployment

```bash
# Build the application
yarn build
# or
npm run build

# Start the production server
yarn start
# or
npm start
```

## Tech Stack

- **Frontend**: Next.js, React, TailwindCSS
- **CMS**: Sanity.io
- **Language**: TypeScript
- **Styling**: TailwindCSS with responsive design
- **Deployment**: Vercel (recommended)

## Dependencies

Key dependencies include:

- next-sanity: Integration between Next.js and Sanity
- tailwindcss: For styling
- react-icons: For UI icons
