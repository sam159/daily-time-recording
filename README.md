# `Daily Time Recording`

Simple utility to calculate how much time you have left to record today.

Inputs:

- Start Time
- Target Duration
- Break Duration
- Break Taken Yes/No
- Recorded Duration
- Remaining Duration

Calculation:

Remaining = Now - Start - Break (if taken) - Recorded

## Getting Started

-   `npm run dev` - Starts a dev server at http://localhost:5173/

-   `npm run build` - Builds for production, emitting to `dist/`

-   `npm run preview` - Starts a server at http://localhost:4173/ to test production build locally

# Todo

- Save start, target & break duration in browser storage