# NovaMind — Chat UI

A modern, responsive AI chat interface built with HTML, CSS, JavaScript, jQuery, and Bootstrap 5.

## How to Run

1. Unzip the folder
2. Open `index.html` in any modern browser (Chrome, Firefox, Safari, Edge)
3. No server or build step required — it runs entirely in the browser

## Project Structure

```
ChatUI/
├── index.html         — Main HTML file
├── css/
│   └── style.css      — All custom styles with CSS variables
├── js/
│   └── chat.js        — All JavaScript/jQuery functionality
├── screenshots/
│   ├── desktop.png    — Desktop view screenshot
│   ├── tablet.png     — Tablet view screenshot
│   └── mobile.png     — Mobile view screenshot
└── README.md          — This file
```

## Features

### Core Features (All 4 Tasks Complete)
- **Welcome screen** with 4 clickable suggestion cards in a grid layout
- **Message bubbles** — visually distinct user (right-aligned) vs AI (left-aligned) with avatars, names, and timestamps
- **Typing indicator** with animated bouncing dots (1–2 second simulated delay)
- **Auto-resizing textarea** — grows as you type up to 200px
- **Send button state management** — disabled when empty, enabled when text present
- **Enter to send** (Shift+Enter for new line)
- **Auto-scroll** to latest message on every new message
- **Sidebar** (260px) with new chat button, scrollable history, and user profile
- **Mobile responsive** — sidebar slides in from left with overlay, suggestion cards stack vertically, adjusts bubble width

### Bonus Features Implemented
- **Dark/Light theme toggle** with smooth CSS variable transitions (click moon icon)
- **Markdown-lite formatting** — supports `**bold**`, `*italic*`, `` `inline code` ``, code blocks, and bullet lists
- **Export chat** as .txt file using the Blob API (click download icon in header)
- **Custom scrollbar** styling throughout

## Technologies Used

- HTML5 (semantic tags: `<main>`, `<header>`, `<footer>`, `<aside>`, `<section>`)
- CSS3 (custom properties, flexbox, grid, keyframe animations, media queries)
- JavaScript (ES6+)
- jQuery 3.7.1
- Bootstrap 5.3.3
- Font Awesome 6.5.1
- Google Fonts: Syne (display) + DM Sans (body)

## Design Choices

- **Color palette:** Deep navy/slate dark theme with electric blue accent (#6c8fff)
- **Typography:** Syne (geometric, bold) for headings; DM Sans (clean, readable) for body
- **Animations:** Fade-slide-up for messages, bouncing dots for typing, pulse glow for the welcome orb
- **WCAG AA compliance:** All text colors pass minimum 4.5:1 contrast ratio on their backgrounds

## Testing Checklist

- [x] Messages appear correctly when sent
- [x] User and AI messages are visually different
- [x] Send button disabled when input is empty
- [x] Send button enabled when text present
- [x] Enter sends; Shift+Enter creates new line
- [x] Typing indicator shows and hides correctly
- [x] Auto-scroll works on new messages
- [x] Textarea auto-resizes as user types
- [x] Suggestion cards are clickable (populate and send)
- [x] Welcome screen hides after first message
- [x] Sidebar appears and hides on mobile
- [x] Responsive across 320px – 1920px
- [x] No console errors
