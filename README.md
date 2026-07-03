# 📸 FrameTogether

> **Create memories together, no matter where you are.**

FrameTogether is a real-time virtual photo booth that allows two or more people to capture authentic photo booth memories together from anywhere. Inspired by the warmth of instant film photography and classic photo booth strips, FrameTogether combines modern web technologies with a nostalgic visual experience.

Rather than feeling like another video call application, FrameTogether recreates the experience of stepping into a physical photo booth with friends—complete with customizable camera looks, countdown timers, multiple strip layouts, and downloadable photo strips.

---

## ✨ Features

### 🏠 Beautiful Landing Experience

- Retro-inspired landing page
- Polaroid styled navigation
- Warm paper-inspired design language
- Responsive layout

---

### 🎟 Create & Join Booths

- Create a private photo booth session
- Share a unique room code
- Join an existing booth instantly
- Copy room code with one click

---

### 📹 Real-Time Photo Booth

- Live webcam preview
- Multi-user booth experience
- Real-time participant status
- Built-in booth chat
- Responsive workspace layout

---

### 🎨 Camera Looks

Choose from carefully designed film-inspired camera looks.

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

Each filter uses a shared preset system so the live preview matches the exported images.

---

### ⏱ Capture Controls

Customize every session with:

- Countdown timer
    - 3 Seconds
    - 5 Seconds
    - 10 Seconds

- Multiple print layouts
    - 2 × 2
    - 2 × 3
    - 2 × 4

- Camera look selection

---

### 📸 Session Workflow

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
Countdown
      │
      ▼
Capture Photos
      │
      ▼
Generate Photo Strip
      │
      ▼
Download & Share
```

---

## 🎯 Project Goals

FrameTogether focuses on creating an experience rather than simply solving a problem.

The project explores how thoughtful interaction design, nostalgic aesthetics, and modern browser APIs can recreate a familiar physical experience inside the browser.

Instead of building another video meeting platform, the goal is to create something that feels personal, memorable, and fun.

---

# 🖼 Design Philosophy

The design draws inspiration from

- Instant film photography
- Vintage photo booths
- Fujifilm Instax
- Warm paper textures
- Minimal workspace applications

The visual language revolves around warm paper tones, deep coffee-inspired backgrounds, and tactile interactions.

---

## 🎨 Color Palette

### Whipped Butter

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

### Cookie Crumble

| Color | Hex |
|--------|------|
| Light | `#7A5545` |
| Medium | `#654132` |
| Base | `#4B2E21` |
| Shadow | `#3B2419` |
| Dark | `#2F1B13` |
| Deep | `#1E110C` |

---

### Accent Colors

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
- React Webcam
- Canvas API *(planned for export pipeline)*

---

## Communication *(In Progress)*

- WebRTC
- Socket.IO
- Peer-to-Peer Connections

---

# 📁 Project Structure

```text
src
│
├── assets
│
├── camera
│   ├── filters.js
│   ├── capturePhoto.js
│   ├── applyFilter.js
│   └── filterPresets.js
│
├── components
│
├── pages
│   ├── Home
│   ├── CreateRoom
│   ├── JoinRoom
│   └── Booth
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

Open

```
http://localhost:5173
```

---

# 🚧 Roadmap

## Version 0.1

- [x] Landing Page
- [x] Create Booth
- [x] Join Booth
- [x] Camera Workspace
- [x] Session Controls
- [x] Filter System
- [x] Design System

---

## Version 0.2

- [ ] WebRTC Integration
- [ ] Live Chat
- [ ] Countdown Animation
- [ ] Camera Flash Animation
- [ ] Photo Capture Pipeline

---

## Version 0.3

- [ ] Photo Strip Generator
- [ ] Download High Resolution Strip
- [ ] Retake Photos
- [ ] Session Preview

---

## Future Ideas

- GIF Booth
- Stickers & Frames
- QR Code Sharing
- Gallery
- AI Camera Looks
- Mobile Optimization
- Multiple Participants
- Cloud Session History

---

# 💡 Why FrameTogether?

Most online communication platforms focus on meetings.

FrameTogether focuses on **moments.**

Instead of asking people to join another call, it invites them to create something together—a memory that can be downloaded, printed, and shared.

The project combines modern browser technologies with thoughtful interaction design to recreate the feeling of an old-fashioned photo booth inside a modern web application.

---

# 👨‍💻 Author

**AbuHamza AbuZafar**

AI & Data Science Undergraduate • Frontend Developer • Product Builder

- GitHub: https://github.com/aiibooouuu
- LinkedIn: https://linkedin.com/in/abu-hamza-601a71276

---

# ⭐ Support

If you enjoyed this project or found it interesting, consider giving it a ⭐ on GitHub.

It helps others discover the project and motivates future development.

---

> **"Two people. One memory."**
>
> **FrameTogether**