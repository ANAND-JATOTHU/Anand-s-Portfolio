# 🎄 Portfolio

A festive, interactive portfolio website featuring a stunning North Pole Christmas theme with Three.js animations.

## ✨Features

- **Animated Santa**: Flying Santa sleigh with green screen chroma keying
- **Aurora Borealis**: GLSL shader-based northern lights effect
- **Falling Snow**: Particle system with realistic snow physics
- **Responsive Design**: Works on all devices (mobile, tablet, desktop)
- **Glassmorphism UI**: Modern frosted glass aesthetic
- **Scroll Animations**: Santa changes direction based on scroll

## 🛠️ Technologies

- **HTML5/CSS3**: Modern semantic markup and styling
- **Three.js**: 3D graphics and particle systems
- **JavaScript (ES6+)**: Module-based architecture
- **GLSL Shaders**: Custom aurora effect

## 📁 Project Structure

```
portfolio/
├── index.html          # Main HTML file
├── style.css           # Styling and theme
├── script.js           # Three.js logic
└── assets/             # Media files
    ├── bg6.jpg         # Background image
    └── sgs2.webm       # Santa animation video
```

## 🚀 Quick Start

1. Clone the repository
2. Open `index.html` in a modern web browser
3. No build process required!

## 🎨 Customization

### Change Background
Update the background image path in `style.css`:
```css
background: url('assets/your-image.jpg') no-repeat center center fixed;
```

## Adjust Snow
Modify snow particle count and speed in `script.js`:
```javascript
const snowCount = 200;  // Number of snowflakes
sprite.userData.fallSpeed = Math.random() * 0.07 + 0.08;  // Fall speed
```

## Santa Animation
Update Santa video source in `script.js`:
```javascript
video.src = 'assets/your-video.webm';
```

## 📱 Browser Support

- Chrome/Edge (recommended)
- Firefox
- Safari
- Mobile browsers (iOS Safari, Chrome Mobile)

## 📄 License

MIT License - Feel free to use this for your own portfolio!

## 👤 Author

**Jatothu Anand**
- GitHub: [@JATOTHU-ANAND](https://github.com/JATOTHU-ANAND)
- LinkedIn: [anandjatothu](https://linkedin.com/in/anandjatothu)
- Email: anandhyd2005@gmail.com

---

⭐ If you like this project, please give it a star on GitHub!

