# CutFlow

> AI-Powered Video Editing Suite for Creative Professionals

CutFlow is a browser-based video editing platform with multi-track timelines, AI-assisted editing tools, and support for multiple resolution presets from 4K to vertical mobile formats.

## Features

- **Project Management** -- Create, search, and organize video projects with grid/list views
- **Multi-Track Timeline** -- Video, audio, and text tracks with drag-and-drop editing
- **Resolution Presets** -- 4K, 1080p, 720p, vertical, square, and cinematic 21:9 formats
- **AI-Assisted Editing** -- Smart cuts, scene detection, and content-aware tools
- **Media Asset Library** -- Import and manage video, audio, and image assets
- **Cloud Storage** -- S3-compatible storage with presigned URL uploads
- **Context Menus** -- Professional editing workflow with keyboard shortcuts
- **Real-Time Preview** -- In-browser video preview with playback controls

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **UI Components:** Radix UI (Dialog, Dropdown, Select, Slider, Tabs, Tooltip)
- **Database:** Supabase (PostgreSQL)
- **Storage:** AWS S3 (presigned uploads)
- **State Management:** Zustand
- **Animation:** Framer Motion
- **Icons:** Lucide React

## Getting Started

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Add SUPABASE_URL, SUPABASE_ANON_KEY, AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY

# Run database migrations
npm run db:migrate

# Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
src/
  app/
    page.tsx              # Project dashboard
    editor/[projectId]/   # Video editor workspace
  components/             # Timeline, preview, toolbar components
  types/                  # TypeScript type definitions
  lib/                    # Supabase client, utilities
```

