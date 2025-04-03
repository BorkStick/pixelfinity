# 🧱 Pixelfinity

**Pixelfinity** is a pixel art builder inspired by Gridfinity — but instead of storage bins, you're placing colorful pixel tiles!  
Design, save, and export your own pixelplates using a limited color palette based on real 3D-printable filament colors.

---

## ✨ Features

- 🎨 16×16 grid canvas with click-to-color tile editing  
- 🧱 Realistic color palette with support for PLA filament codes  
- 💾 Save and load pixelplates to local gallery  
- 🖼 Export as PNG (scaled for clean printing or sharing)  
- 🌙 Toggle light/dark theme and grid visibility  
- 📊 Live stats: see how many tiles of each color are used  
- 🧠 Built with React + TypeScript + Tailwind CSS + Vite

---

## 🚀 Getting Started

```bash
git clone https://github.com/BorkStick/pixelfinity.git
cd pixelfinity
npm install
npm run dev
```

Then open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 🖌 Color Palette

All colors are based on real filament hex codes:

| Name             | Hex       |
|------------------|-----------|
| Red PLA          | `#cc3232` |
| Light Green PLA  | `#a4cb88` |
| Green PLA        | `#57d188` |
| Purple PLA       | `#800080` |
| Grey PLA         | `#868489` |
| Light Blue PLA   | `#8abed4` |
| Dark Blue PLA    | `#1e255c` |
| White PLA        | `#ffffff` |
| Black PLA        | `#000000` |

---

## 📁 Project Structure

```
src/
├── components/      # UI pieces (Grid, Palette, Gallery)
├── context/         # Grid context provider
├── types/           # Grid and color types
├── App.tsx          # Main layout
└── main.tsx         # Entry point
```

---

## 📸 Screenshots

Coming soon...

---

## 🛠 Built With

- [Vite](https://vitejs.dev/)
- [React](https://react.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)

---

## 📦 Future Ideas

- 🔧 Custom filament/color management  
- 🧩 Download printable tile layout  
- 🌈 Pattern/glyph generator  
- ☁️ Cloud save (with Firebase or Supabase?)

---

## 🧙‍♂️ License

MIT License — build, remix, or print pixel magic!

---

> Made with 🧱 by BorkStick