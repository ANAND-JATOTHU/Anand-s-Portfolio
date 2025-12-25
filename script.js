
import * as THREE from 'https://unpkg.com/three@0.170.0/build/three.module.js';

// --- SCENE GLOBALS ---
let scene, camera, renderer;
let auroraMesh, snowSystem, santaSprite;

// --- AURORA SHADERS ---
const auroraVertex = `
    varying vec2 vUv;
    void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
`;

const auroraFragment = `
    uniform float iTime;
    varying vec2 vUv;
    
    float hash(float n) { return fract(sin(n) * 43758.5453123); }
    float noise(in vec3 x) {
        vec3 p = floor(x);
        vec3 f = fract(x);
        f = f * f * (3.0 - 2.0 * f);
        float n = p.x + p.y * 57.0 + 113.0 * p.z;
        return mix(mix(mix(hash(n + 0.0), hash(n + 1.0), f.x),
                       mix(hash(n + 57.0), hash(n + 58.0), f.x), f.y),
                   mix(mix(hash(n + 113.0), hash(n + 114.0), f.x),
                        mix(hash(n + 170.0), hash(n + 171.0), f.x), f.y), f.z);
    }

    void main() {
        vec2 uv = vUv;
        float wave = sin(uv.x * 6.0 + iTime * 0.8) * 0.2; 
        float bands = noise(vec3(uv.x * 4.0, uv.y * 0.5 + iTime * 0.3, iTime * 0.2));
        
        vec3 c1 = vec3(0.0, 1.0, 0.4);
        vec3 c2 = vec3(0.4, 0.0, 1.0);
        
        float alpha = smoothstep(0.0, 0.6, uv.y + wave) * (1.0 - uv.y) * bands;
        vec3 col = mix(c1, c2, uv.y);
        gl_FragColor = vec4(col, alpha * 0.8);
    }
`;

function initThreeJS() {
    const canvas = document.querySelector('#bg');
    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 20;
    camera.position.y = 5;

    renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);

    createStars();
    createAurora();
    createSnow();
    createSanta();

    const clock = new THREE.Clock();

    function animate() {
        requestAnimationFrame(animate);
        const time = clock.getElapsedTime();

        if (auroraMesh) auroraMesh.material.uniforms.iTime.value = time;

        if (snowSystem && snowSystem.children) {
            snowSystem.children.forEach(sprite => {
                sprite.position.y -= sprite.userData.fallSpeed;
                sprite.position.x += sprite.userData.driftSpeed;

                if (sprite.position.y < -10) {
                    sprite.position.y = 20;
                    sprite.position.x = (Math.random() - 0.5) * 60;
                }
            });
        }

        renderer.render(scene, camera);
    }
    animate();

    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
}

function createStars() {
    const geo = new THREE.BufferGeometry();
    const count = 500;
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count * 3; i++) pos[i] = (Math.random() - 0.5) * 100;
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    const mat = new THREE.PointsMaterial({ size: 0.1, color: 0xffffff });
    scene.add(new THREE.Points(geo, mat));
}

function createAurora() {
    const uniforms = { iTime: { value: 0 } };
    const mat = new THREE.ShaderMaterial({
        uniforms: uniforms,
        vertexShader: auroraVertex,
        fragmentShader: auroraFragment,
        transparent: true,
        side: THREE.DoubleSide,
        depthWrite: false,
        blending: THREE.AdditiveBlending
    });
    const geo = new THREE.CylinderGeometry(20, 20, 15, 32, 1, true, 0, Math.PI);
    auroraMesh = new THREE.Mesh(geo, mat);
    auroraMesh.rotation.x = Math.PI / 2;
    auroraMesh.rotation.z = -0.2;
    auroraMesh.position.y = 12;
    auroraMesh.position.z = -10;
    scene.add(auroraMesh);
}

function createSnow() {
    const snowGroup = new THREE.Group();

    const createCircleTexture = () => {
        const canvas = document.createElement('canvas');
        canvas.width = 32;
        canvas.height = 32;
        const ctx = canvas.getContext('2d');

        const gradient = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
        gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
        gradient.addColorStop(0.5, 'rgba(255, 255, 255, 0.8)');
        gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');

        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, 32, 32);

        return new THREE.CanvasTexture(canvas);
    };

    const circleTexture = createCircleTexture();
    const snowCount = 200;

    for (let i = 0; i < snowCount; i++) {
        const material = new THREE.SpriteMaterial({
            map: circleTexture,
            transparent: true,
            opacity: Math.random() * 0.6 + 0.4
        });

        const sprite = new THREE.Sprite(material);
        const size = Math.random() * 0.6 + 0.2;
        sprite.scale.set(size, size, 1);

        sprite.position.x = (Math.random() - 0.5) * 60;
        sprite.position.y = Math.random() * 20 + 10;
        sprite.position.z = (Math.random() - 0.5) * 20;

        sprite.userData.fallSpeed = Math.random() * 0.07 + 0.08;
        sprite.userData.driftSpeed = (Math.random() - 0.5) * 0.04;

        snowGroup.add(sprite);
    }

    snowSystem = snowGroup;
    scene.add(snowSystem);
}

function createSanta() {
    const video = document.createElement('video');
    video.src = 'assets/sgs2.webm';
    video.loop = true;
    video.muted = true;
    video.autoplay = true;
    video.playsInline = true;

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    video.addEventListener('loadedmetadata', () => {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        video.play().catch(e => console.log('Video play failed:', e));

        const videoTexture = new THREE.CanvasTexture(canvas);

        const mat = new THREE.SpriteMaterial({
            map: videoTexture,
            transparent: true,
            blending: THREE.NormalBlending
        });

        santaSprite = new THREE.Sprite(mat);
        santaSprite.scale.set(10, 8, 1);
        santaSprite.position.set(50, 16, 0);
        scene.add(santaSprite);

        function updateVideoTexture() {
            if (video.readyState === video.HAVE_ENOUGH_DATA) {
                const cropTop = canvas.height * 0.05;
                const cropLeft = canvas.width * 0.01;
                const croppedHeight = canvas.height - (cropTop * 2);
                const croppedWidth = canvas.width - (cropLeft * 2);

                ctx.drawImage(
                    video,
                    cropLeft, cropTop, croppedWidth, croppedHeight,
                    0, 0, canvas.width, canvas.height
                );

                const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                const data = imageData.data;

                for (let i = 0; i < data.length; i += 4) {
                    const r = data[i];
                    const g = data[i + 1];
                    const b = data[i + 2];

                    if (g > 100 && g > r * 1.5 && g > b * 1.5) {
                        data[i + 3] = 0;
                    }
                }

                ctx.putImageData(imageData, 0, 0);
                videoTexture.needsUpdate = true;
            }

            requestAnimationFrame(updateVideoTexture);
        }

        updateVideoTexture();
    });
}

// --- INITIALIZATION ---
document.addEventListener('DOMContentLoaded', () => {
    initThreeJS();

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(e => {
            if (e.isIntersecting) e.target.classList.add('show');
        });
    });
    document.querySelectorAll('.animate-on-load, .glass-card, .section-title').forEach(el => observer.observe(el));
});

// --- SCROLL ANIMATIONS ---
let lastScrollY = window.scrollY;
let scrollDirection = 1;

window.addEventListener('scroll', () => {
    if (!santaSprite) return;

    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = scrollTop / (docHeight || 1);

    const newDirection = scrollTop > lastScrollY ? 1 : -1;
    if (newDirection !== scrollDirection) {
        scrollDirection = newDirection;
        santaSprite.scale.x = scrollDirection > 0 ? 10 : -10;
    }
    lastScrollY = scrollTop;

    if (scrollDirection > 0) {
        santaSprite.position.x = 50 - (scrollPercent * 100);
    } else {
        santaSprite.position.x = -50 + (scrollPercent * 100);
    }
    santaSprite.position.y = 16;
});
