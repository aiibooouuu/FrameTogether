# 📸 FrameTogether

> **Create memories together, no matter where you are.**

FrameTogether is a real-time virtual photo booth that lets two people capture authentic photo booth memories together from anywhere. Inspired by instant film photography and classic photo booth strips, it combines warm nostalgic visuals with modern web technologies to recreate the feeling of stepping into a real photo booth.

Instead of feeling like another video calling application, FrameTogether focuses on creating shared moments through customizable camera looks, countdowns, retakes, photo strip layouts, and downloadable memories.

---

## ✨ Features

### 🏠 Beautiful Landing Experience

- Retro-inspired landing page
- Polaroid-style navigation
- Warm paper-inspired design language
- Fully responsive layout

---

### 🎟 Create & Join Booths

- Create a private photo booth session
- Share a unique room code
- Join an existing booth instantly
- One-click room code copy

---

### 📹 Real-Time Booth Experience

- Live webcam preview
- Two-person collaborative booth
- Participant status
- Built-in booth chat
- Responsive workspace layout

---

### 🎨 Camera Looks

Choose from carefully curated film-inspired camera presets.

#### Film Collection

- Natural
- Kodak Gold
- Fuji Classic
- Portra 400
- Vintage

#### Creative Collection

- Soft Glow
- Cinema
- Monochrome
- Cool Blue

Each preset is defined in a shared filter system, ensuring the live preview matches the exported capture.

---

### 📷 Capture Controls

Customize every booth session with:

- Countdown Timer
  - 3 Seconds
  - 5 Seconds
  - 10 Seconds
- Photo Retake Flow
- Session Preview
- Layout Selection
- Camera Look Selection

---

## 📸 Session Workflow

```text
Create Booth
      │
      ▼
Share Room Code
      │
      ▼
Friend Joins
      │
      ▼
Choose Camera Look
      │
      ▼
Select Layout
      │
      ▼
Start Session
      │
      ▼
Countdown
      │
      ▼
Capture Photos
      │
      ▼
Retake if Needed
      │
      ▼
Generate Photo Strip
      │
      ▼
Download & Share
```

---

# 🎯 Project Goals

FrameTogether is built around creating an experience rather than simply solving a problem.

The project explores how thoughtful interaction design, nostalgic aesthetics, and modern browser APIs can recreate a familiar physical experience directly inside the browser.

Instead of building another meeting application, the goal is to create something personal, memorable, and fun.

---

# 🎨 Design Philosophy

The visual identity draws inspiration from:

- Instant Film Photography
- Vintage Photo Booths
- Fujifilm Instax
- Warm Paper Textures
- Minimal Workspace Interfaces

The design language combines warm paper tones, deep coffee-inspired backgrounds, and tactile interactions to create a nostalgic yet modern interface.

---

# 🎨 Color Palette

## Whipped Butter

| Color | Hex |
|--------|------|
| Highlight | `#FFF8E7` |
| Light | `#FAF3D5` |
| Base | `#F2E6B3` |
| Mid | `#E8D89F` |
| Shadow | `#D8C98F` |
| Warm | `#CFAF7C` |
| Deep | `#C4B278` |
| Dark | `#A38F5E` |

---

## Cookie Crumble

| Color | Hex |
|--------|------|
| Light | `#7A5545` |
| Medium | `#654132` |
| Base | `#4B2E21` |
| Shadow | `#3B2419` |
| Dark | `#2F1B13` |
| Deep | `#1E110C` |

---

## Accent Colors

| Color | Hex |
|--------|------|
| Gold | `#C89B3C` |
| Caramel | `#B97A3D` |
| Latte | `#C8A67E` |

---

# 🛠 Tech Stack

## Frontend

- React
- Vite
- React Router
- React Webcam
- React Icons

---

## Styling

- CSS3
- CSS Variables
- Flexbox
- CSS Grid
- Responsive Design

---

## Camera

- MediaDevices API
- Canvas API
- Shared Camera Filter Presets
- Session Capture & Retake Flow

---

## Communication

- WebRTC
- Socket.IO
- Peer-to-Peer Signaling

---

# 📁 Project Structure

```text
src
│
├── assets
│
├── camera
│   ├── filter.js
│   ├── captureFrame.js
│   └── ...
│
├── components
│
├── hooks
│
├── pages
│   ├── Home
│   ├── CreateRoom
│   ├── JoinRoom
│   ├── Booth
│   └── Preview
│
├── socket
│
├── App.jsx
└── main.jsx
```

---

# 🚀 Getting Started

Clone the repository

```bash
git clone https://github.com/aiibooouuu/FrameTogether.git
```

Move into the project

```bash
cd FrameTogether
```

Install dependencies

```bash
npm install
```

Start the development server

```bash
npm run dev
```

Open your browser

```text
http://localhost:5173
```

---

# 🗺 Roadmap

## ✅ Completed

- Landing Page
- Create Booth
- Join Booth
- Camera Workspace
- Session Controls
- Filter System
- Retake Flow
- Responsive Booth Layout
- Design System

---

## 🚧 Next

- WebRTC Polish
- Live Chat Refinement
- Countdown Animation
- Camera Flash Animation
- Photo Strip Export Pipeline
- High Resolution Download

---

## 💡 Future Ideas

- GIF Booth
- Stickers & Frames
- QR Code Sharing
- Gallery
- AI Camera Looks
- Multiple Participants
- Cloud Session History

---

# 💭 Why FrameTogether?

Most online communication platforms focus on meetings.

**FrameTogether focuses on moments.**

Instead of asking people to join another video call, it invites them to create something together—a memory that can be downloaded, shared, and kept.

The project combines modern browser technologies with nostalgic interaction design to recreate the feeling of an old-fashioned photo booth inside a modern web application.

---

# 👨‍💻 Author

**AbuHamza AbuZafar**

AI & Data Science Undergraduate • Frontend Developer • Product Builder

- **GitHub:** https://github.com/aiibooouuu
- **LinkedIn:** https://linkedin.com/in/abu-hamza-601a71276

---

# ⭐ Support

If you enjoyed this project or found it interesting, consider giving it a ⭐ on GitHub.

It helps others discover the project and supports future development.

---

> **"Two people. One memory."**
>
> **FrameTogether**