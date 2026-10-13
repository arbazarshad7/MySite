/**
 * ARBAZ ARSHAD — CREATIVE PORTFOLIO
 * ADVANCED MOTION GRAPHICS & WEBGL INTERACTION ENGINE
 * Inspired by 株式会社ジュニ (junni.co.jp)
 */

(function () {
  'use strict';

  /* ==========================================================================
     1. WEB AUDIO SYNTHESIZER (MICRO-FEEDBACK SFX)
     ========================================================================== */
  class SoundEngine {
    constructor() {
      this.ctx = null;
      this.enabled = false;
      this.toggleBtn = document.getElementById('sound-toggle');
      this.init();
    }

    init() {
      if (this.toggleBtn) {
        this.toggleBtn.addEventListener('click', () => this.toggleSound());
      }
    }

    ensureContext() {
      if (!this.ctx) {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        this.ctx = new AudioCtx();
      }
      if (this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
    }

    toggleSound() {
      this.ensureContext();
      this.enabled = !this.enabled;
      if (this.toggleBtn) {
        this.toggleBtn.classList.toggle('is-playing', this.enabled);
        const label = this.toggleBtn.querySelector('.sound-status-text');
        if (label) label.textContent = this.enabled ? 'ON' : 'OFF';
      }
      if (this.enabled) {
        this.playTone(580, 'sine', 0.08, 0.06);
      }
    }

    playHover() {
      if (!this.enabled || !this.ctx) return;
      try {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(820, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(1240, this.ctx.currentTime + 0.035);
        gain.gain.setValueAtTime(0.015, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.035);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start();
        osc.stop(this.ctx.currentTime + 0.035);
      } catch (e) {}
    }

    playFlip() {
      if (!this.enabled || !this.ctx) return;
      try {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(340, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(780, this.ctx.currentTime + 0.07);
        gain.gain.setValueAtTime(0.03, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.07);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start();
        osc.stop(this.ctx.currentTime + 0.07);
      } catch (e) {}
    }

    playClick() {
      if (!this.enabled || !this.ctx) return;
      try {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'square';
        osc.frequency.setValueAtTime(160, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(60, this.ctx.currentTime + 0.04);
        gain.gain.setValueAtTime(0.04, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.04);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start();
        osc.stop(this.ctx.currentTime + 0.04);
      } catch (e) {}
    }

    playTone(freq, type, duration, volume) {
      if (!this.ctx) return;
      try {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = type || 'sine';
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
        gain.gain.setValueAtTime(volume, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + duration);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start();
        osc.stop(this.ctx.currentTime + duration);
      } catch (e) {}
    }
  }

  const sfx = new SoundEngine();

  /* ==========================================================================
     2. CUSTOM MAGNETIC CIRCLE CURSOR (DESKTOP ONLY)
     ========================================================================== */
  class CustomCursor {
    constructor() {
      this.dot = document.querySelector('.cursor-dot');
      this.follower = document.querySelector('.cursor-follower');
      this.followerLabel = this.follower ? this.follower.querySelector('span') : null;
      this.mouseX = -100;
      this.mouseY = -100;
      this.followerX = -100;
      this.followerY = -100;
      this.active = false;
      this.init();
    }

    init() {
      if (!this.dot || !this.follower) return;
      if (window.innerWidth <= 768 || window.matchMedia('(pointer: coarse)').matches) {
        return;
      }

      document.body.classList.add('custom-cursor-active');

      window.addEventListener('mousemove', (e) => {
        this.mouseX = e.clientX;
        this.mouseY = e.clientY;
        if (!this.active) {
          this.active = true;
          this.followerX = this.mouseX;
          this.followerY = this.mouseY;
        }
        this.dot.style.transform = `translate(${this.mouseX}px, ${this.mouseY}px)`;
      });

      window.addEventListener('mousedown', () => {
        this.follower.classList.add('is-clicked');
        sfx.playClick();
      });

      window.addEventListener('mouseup', () => {
        this.follower.classList.remove('is-clicked');
      });

      this.bindHoverElements();
      this.render();
    }

    bindHoverElements() {
      const targets = document.querySelectorAll('a, button, [data-cursor], .matrix-panel, .project-card, [data-scramble]');
      targets.forEach((el) => {
        el.addEventListener('mouseenter', () => {
          this.follower.classList.add('is-hovered');
          const customText = el.getAttribute('data-cursor') || (el.classList.contains('matrix-panel') ? 'FLIP' : 'EXPLORE');
          if (this.followerLabel) this.followerLabel.textContent = customText;
          sfx.playHover();
        });

        el.addEventListener('mouseleave', () => {
          this.follower.classList.remove('is-hovered');
          if (this.followerLabel) this.followerLabel.textContent = '';
        });
      });
    }

    render() {
      this.followerX += (this.mouseX - this.followerX) * 0.16;
      this.followerY += (this.mouseY - this.followerY) * 0.16;

      if (this.follower) {
        this.follower.style.transform = `translate(${this.followerX}px, ${this.followerY}px)`;
      }

      requestAnimationFrame(() => this.render());
    }
  }

  /* ==========================================================================
     3. THE CRESCENDO OF TIDES — REAL-TIME 3D WEBGL OCEAN SIMULATION
     Authentic implementation inspired by "The Symphony of Vines" (Château Oublié / Unseen Studio)
     - Multi-harmonic geological wave terrain displacement (Gerstner swells + FBM noise)
     - Mathematical anti-aliased topographic contour lines (strata isolines in burnished bronze & gold)
     - Analytical finite-difference normal reconstruction with Blinn-Phong directional lighting
     - Interactive cursor tidal surge vortex & expanding click crescendo pulse
     - 1,200 suspended marine sediment & mineral stardust particles
     ========================================================================== */
  class WebGLCanvas {
    constructor() {
      this.canvas = document.getElementById('webgl-canvas');
      if (!this.canvas || typeof THREE === 'undefined') return;

      this.scene = new THREE.Scene();
      this.scene.fog = new THREE.FogExp2(0x08080a, 0.016);

      this.camera = new THREE.PerspectiveCamera(52, window.innerWidth / window.innerHeight, 0.1, 1000);
      this.camera.position.set(0, 18, 28);
      this.camera.lookAt(0, -1, -5);

      this.renderer = new THREE.WebGLRenderer({
        canvas: this.canvas,
        alpha: true,
        antialias: true,
        powerPreference: 'high-performance'
      });
      this.renderer.setSize(window.innerWidth, window.innerHeight);
      this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

      this.clock = new THREE.Clock();

      // Interactive cursor & tidal surge physics
      this.mouseX = 0;
      this.mouseY = 0;
      this.targetX = 0;
      this.targetY = 0;
      this.mouseSpeed = 0;
      this.targetMouseSpeed = 0;

      // Plane coordinate tracking for ocean current vortex
      this.planeCoords = new THREE.Vector2(0, 0);
      this.targetPlaneCoords = new THREE.Vector2(0, 0);
      this.lastWhooshTime = 0;

      // Crescendo pulse physics (triggered on click or pill tap)
      this.crescendoTime = -1.0;
      this.crescendoStrength = 1.0;

      this.initOcean();
      this.initSedimentParticles();
      this.bindEvents();
      this.animate();
    }

    initOcean() {
      this.oceanGroup = new THREE.Group();
      this.oceanGroup.position.set(0, -6.5, -4);
      this.oceanGroup.rotation.x = -Math.PI * 0.40;
      this.scene.add(this.oceanGroup);

      // High-resolution plane geometry for silky smooth wave contours
      const width = 150;
      const height = 110;
      const segW = 200;
      const segH = 150;
      this.oceanGeometry = new THREE.PlaneGeometry(width, height, segW, segH);

      // GLSL Vertex Shader: Multi-Harmonic Gerstner, FBM Simplex Noise & Tidal Vortex
      const vertexShader = `
        uniform float uTime;
        uniform vec2 uMouse;
        uniform float uMouseSpeed;
        uniform float uCrescendoTime;
        uniform float uCrescendoStrength;

        varying vec2 vUv;
        varying float vElevation;
        varying vec3 vNormalVec;
        varying vec3 vViewPos;
        varying vec4 vWorldPos;
        varying float vDistToMouse;

        // Simplex 2D noise implementation (Ashima Arts / Ian McEwan)
        vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
        vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
        vec3 permute(vec3 x) { return mod289(((x * 34.0) + 1.0) * x); }

        float snoise(vec2 v) {
          const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
          vec2 i  = floor(v + dot(v, C.yy));
          vec2 x0 = v - i + dot(i, C.xx);
          vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
          vec4 x12 = x0.xyxy + C.xxzz;
          x12.xy -= i1;
          i = mod289(i);
          vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
          vec3 m = max(0.5 - vec3(dot(x0, x0), dot(x12.xy, x12.xy), dot(x12.zw, x12.zw)), 0.0);
          m = m * m;
          m = m * m;
          vec3 x = 2.0 * fract(p * C.www) - 1.0;
          vec3 h = abs(x) - 0.5;
          vec3 ox = floor(x + 0.5);
          vec3 a0 = x - ox;
          m *= 1.79284291400159 - 0.85373472095314 * (a0 * a0 + h * h);
          vec3 g;
          g.x = a0.x * x0.x + h.x * x0.y;
          g.yz = a0.yz * x12.xz + h.yz * x12.yw;
          return 130.0 * dot(m, g);
        }

        float fbm(vec2 p) {
          float v = 0.0;
          v += 0.500 * snoise(p);
          v += 0.250 * snoise(p * 2.02);
          v += 0.125 * snoise(p * 4.04);
          return v;
        }

        // Multi-Harmonic Geological Ocean & Terroir Elevation Function (Rhythmic Atlantic Swells)
        float getOceanElevation(vec2 pos, float t) {
          float wave = 0.0;
          
          // 1. Broad oceanic swells (The slow, majestic respiration of the deep Atlantic tide)
          wave += sin(pos.x * 0.06 + t * 0.52) * cos(pos.y * 0.04 + t * 0.38) * 2.2;
          
          // 2. Cross-current tidal flow (Tectonic estuaries & sediment flow)
          wave += sin(pos.x * 0.11 - pos.y * 0.08 + t * 0.65) * 1.15;
          
          // 3. FBM Geological terroir terrain (undulating sedimentary ridges and valleys)
          wave += fbm(pos * 0.040 + vec2(t * 0.015, t * 0.011)) * 3.1;
          
          // 4. Subtle capillary sediment ripple
          wave += cos(pos.x * 0.22 + pos.y * 0.17 + t * 1.05) * 0.32;
          
          // 5. Interactive cursor tidal surge — dynamic fluid response to cursor movement
          float d = distance(pos, uMouse);
          float surge = exp(-d * 0.055) * (0.6 + uMouseSpeed * 1.4);
          wave += surge * cos(d * 0.85 - t * 2.2);
          
          // 6. Interactive Click Crescendo Ripple Pulse (vibrant expanding gold wave ring)
          if (uCrescendoTime > 0.0) {
            float speed = 22.0;
            float currentRadius = uCrescendoTime * speed;
            float ringDist = abs(d - currentRadius);
            float ringFalloff = exp(-ringDist * ringDist * 0.14);
            float timeDecay = exp(-uCrescendoTime * 1.5);
            wave += ringFalloff * timeDecay * uCrescendoStrength * 2.4 * sin(ringDist * 0.75 - t * 2.8);
          }
          
          return wave;
        }

        void main() {
          vUv = uv;
          vec3 pos = position;
          
          // Calculate surface elevation
          float elevation = getOceanElevation(pos.xy, uTime);
          pos.z += elevation;
          vElevation = elevation;
          vDistToMouse = distance(position.xy, uMouse);
          
          // High-precision finite differences for analytical normal
          float eps = 0.08;
          float elevX = getOceanElevation(position.xy + vec2(eps, 0.0), uTime);
          float elevY = getOceanElevation(position.xy + vec2(0.0, eps), uTime);
          vec3 p0 = vec3(position.xy, elevation);
          vec3 pX = vec3(position.xy + vec2(eps, 0.0), elevX);
          vec3 pY = vec3(position.xy + vec2(0.0, eps), elevY);
          vec3 tangent = normalize(pX - p0);
          vec3 bitangent = normalize(pY - p0);
          vec3 normalDisplaced = normalize(cross(tangent, bitangent));
          
          vNormalVec = normalize(normalMatrix * normalDisplaced);
          
          vec4 worldPos = modelMatrix * vec4(pos, 1.0);
          vWorldPos = worldPos;
          
          vec4 mvPos = modelViewMatrix * vec4(pos, 1.0);
          vViewPos = -mvPos.xyz;
          
          gl_Position = projectionMatrix * mvPos;
        }
      `;

      // GLSL Fragment Shader: Balanced Rich Topographic Contours & Deep Terroir Shading
      const fragmentShader = `
        uniform vec3 uDepthColor;        // Obsidian charcoal: #0a0b0e
        uniform vec3 uMidColor;          // Volcanic slate: #161720
        uniform vec3 uHighColor;         // Deep earth: #25221d
        uniform vec3 uPrimaryLineColor;  // Warm burnished bronze: #cca262
        uniform vec3 uSecondaryLineColor;// Smoked platinum: #6a6c76
        uniform vec3 uCrestColor;        // Champagne crest: #f3d59b
        uniform vec3 uSunColor;          // Warm sunlight: #ffeed8
        uniform vec3 uSunDir;            // Directional sun
        uniform float uTime;
        uniform float uCrescendoTime;

        varying vec2 vUv;
        varying float vElevation;
        varying vec3 vNormalVec;
        varying vec3 vViewPos;
        varying vec4 vWorldPos;
        varying float vDistToMouse;

        void main() {
          vec3 normal = normalize(vNormalVec);
          vec3 viewDir = normalize(vViewPos);
          vec3 lightDir = normalize(uSunDir);
          
          // 1. Elevation base color ramp (Deep obsidian -> Slate slope -> Warm earth ridge)
          float heightNorm = clamp((vElevation + 3.2) * 0.15, 0.0, 1.0);
          vec3 baseColor = mix(uDepthColor, uMidColor, smoothstep(0.0, 0.5, heightNorm));
          baseColor = mix(baseColor, uHighColor, smoothstep(0.5, 1.0, heightNorm));
          
          // 2. Blinn-Phong Diffuse & Specular Shading (Lustrous wet mineral sheen)
          float NdotL = max(dot(normal, lightDir), 0.0);
          vec3 halfDir = normalize(lightDir + viewDir);
          float NdotH = max(dot(normal, halfDir), 0.0);
          float specular = pow(NdotH, 30.0) * 0.32;
          
          // Ambient base illumination
          vec3 ambient = vec3(0.045, 0.048, 0.055) * baseColor;
          vec3 diffuse = NdotL * uSunColor * baseColor;
          vec3 surfaceLit = ambient + diffuse + (specular * uSunColor);
          
          // 3. Mathematical Anti-Aliased Topographic Contour Lines (Clear, rich bronze & gold strata)
          // Primary Major Strata lines (Every 1.25 elevation units)
          float majorSpacing = 1.25;
          float majorVal = vElevation / majorSpacing;
          float majorFract = abs(fract(majorVal - 0.5) - 0.5);
          float majorDf = fwidth(majorVal) * 1.35;
          float majorLine = 1.0 - smoothstep(0.0, majorDf, majorFract);
          
          // Secondary Minor Strata lines (Every 0.3125 units)
          float minorSpacing = 0.3125;
          float minorVal = vElevation / minorSpacing;
          float minorFract = abs(fract(minorVal - 0.5) - 0.5);
          float minorDf = fwidth(minorVal) * 1.15;
          float minorLine = 1.0 - smoothstep(0.0, minorDf, minorFract);
          
          // Mix contour lines with balanced vibrancy
          surfaceLit = mix(surfaceLit, uSecondaryLineColor, minorLine * 0.26);
          surfaceLit = mix(surfaceLit, uPrimaryLineColor, majorLine * 0.68);
          
          // 4. Wave Crest Mineral Foam & Illuminated Ridges (Luminous crests)
          float crest = smoothstep(1.9, 4.5, vElevation);
          surfaceLit = mix(surfaceLit, uCrestColor, crest * 0.48);
          
          // 5. Click Crescendo Expanding Ring Glow
          if (uCrescendoTime > 0.0) {
            float speed = 22.0;
            float currentRadius = uCrescendoTime * speed;
            float ringDist = abs(vDistToMouse - currentRadius);
            float ringGlow = exp(-ringDist * ringDist * 0.28) * exp(-uCrescendoTime * 1.4);
            surfaceLit += uCrestColor * ringGlow * 0.85;
          }
          
          // 6. Glancing Fresnel Rim Light (Warm bronze rim on wave edges)
          float fresnel = pow(1.0 - max(dot(normal, viewDir), 0.0), 3.5);
          surfaceLit += vec3(0.85, 0.58, 0.32) * fresnel * 0.30;
          
          // 7. Distance Atmospheric Fog into Deep Darkness (#08080a)
          float dist = length(vViewPos);
          float fogFactor = smoothstep(20.0, 72.0, dist);
          vec3 fogColor = vec3(0.028, 0.030, 0.038);
          surfaceLit = mix(surfaceLit, fogColor, fogFactor);
          
          // 8. Soft Edge Alpha Vignette (seamless plane borders)
          float edgeAlpha = smoothstep(0.0, 0.12, vUv.x) * smoothstep(1.0, 0.88, vUv.x) *
                            smoothstep(0.0, 0.12, vUv.y) * smoothstep(1.0, 0.88, vUv.y);
          
          gl_FragColor = vec4(surfaceLit, 0.92 * edgeAlpha);
        }
      `;

      this.oceanMaterial = new THREE.ShaderMaterial({
        vertexShader,
        fragmentShader,
        uniforms: {
          uTime: { value: 0 },
          uMouse: { value: new THREE.Vector2(0, 0) },
          uMouseSpeed: { value: 0 },
          uCrescendoTime: { value: -1.0 },
          uCrescendoStrength: { value: 1.0 },
          uDepthColor: { value: new THREE.Color(0x0a0b0e) },        // Deep obsidian abyss
          uMidColor: { value: new THREE.Color(0x161720) },          // Dark slate slope
          uHighColor: { value: new THREE.Color(0x25221d) },         // Warm earth ridge
          uPrimaryLineColor: { value: new THREE.Color(0xcca262) },  // Burnished gold contour
          uSecondaryLineColor: { value: new THREE.Color(0x6a6c76) },// Fine platinum strata
          uCrestColor: { value: new THREE.Color(0xf3d59b) },        // Champagne crest
          uSunColor: { value: new THREE.Color(0xffeed8) },          // Warm golden sunlight
          uSunDir: { value: new THREE.Vector3(0.55, 0.75, 0.45).normalize() }
        },
        transparent: true,
        blending: THREE.NormalBlending,
        depthWrite: false
      });

      this.oceanMesh = new THREE.Mesh(this.oceanGeometry, this.oceanMaterial);
      this.oceanGroup.add(this.oceanMesh);
    }

    initSedimentParticles() {
      // 720 suspended marine sediment & mineral stardust particles
      const count = 720;
      this.particlePositions = new Float32Array(count * 3);
      this.particleVelocities = [];
      const colors = new Float32Array(count * 3);

      const colGold = new THREE.Color(0xe5c07b);
      const colBronze = new THREE.Color(0xcca262);
      const colIvory = new THREE.Color(0xfff6ea);
      const colSilver = new THREE.Color(0x9fa4b2);

      for (let i = 0; i < count; i++) {
        const x = (Math.random() - 0.5) * 110;
        const y = (Math.random() - 0.5) * 85;
        const z = (Math.random() - 0.5) * 15 + 2;

        this.particlePositions[i * 3] = x;
        this.particlePositions[i * 3 + 1] = y;
        this.particlePositions[i * 3 + 2] = z;

        this.particleVelocities.push({
          x: (Math.random() - 0.5) * 0.028 + 0.012,
          y: (Math.random() - 0.5) * 0.018,
          baseZ: z,
          seed: Math.random() * 20
        });

        const rand = Math.random();
        const c = rand > 0.65 ? colGold : (rand > 0.35 ? colBronze : (rand > 0.15 ? colIvory : colSilver));
        colors[i * 3] = c.r;
        colors[i * 3 + 1] = c.g;
        colors[i * 3 + 2] = c.b;
      }

      this.sedimentGeometry = new THREE.BufferGeometry();
      this.sedimentGeometry.setAttribute('position', new THREE.BufferAttribute(this.particlePositions, 3));
      this.sedimentGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

      const sedimentMat = new THREE.PointsMaterial({
        size: 0.28,
        vertexColors: true,
        transparent: true,
        opacity: 0.38,
        blending: THREE.AdditiveBlending
      });

      this.sedimentCloud = new THREE.Points(this.sedimentGeometry, sedimentMat);
      this.oceanGroup.add(this.sedimentCloud);
    }

    triggerCrescendo(intensity = 1.0) {
      this.crescendoTime = 0.0;
      this.crescendoStrength = intensity;
      sfx.playTone(110, 'sine', 0.8, 0.02);

      const pill = document.querySelector('.tides-pill');
      if (pill) {
        pill.classList.add('is-surging');
        setTimeout(() => pill.classList.remove('is-surging'), 1400);
      }
    }

    bindEvents() {
      window.addEventListener('resize', () => {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
      });

      window.addEventListener('mousemove', (e) => {
        this.mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
        this.mouseY = -(e.clientY / window.innerHeight - 0.5) * 2;

        const speed = Math.hypot(e.movementX || 0, e.movementY || 0);
        this.targetMouseSpeed = Math.min(speed * 0.10, 2.5);

        const normX = (e.clientX / window.innerWidth - 0.5) * 60;
        const normY = -(e.clientY / window.innerHeight - 0.5) * 44;
        this.targetPlaneCoords.set(normX, normY);
      });

      window.addEventListener('touchmove', (e) => {
        if (e.touches.length > 0) {
          const touch = e.touches[0];
          const normX = (touch.clientX / window.innerWidth - 0.5) * 60;
          const normY = -(touch.clientY / window.innerHeight - 0.5) * 44;
          this.targetPlaneCoords.set(normX, normY);
          this.targetMouseSpeed = 1.6;
        }
      }, { passive: true });

      // Click on background or empty spaces triggers the Crescendo tidal ripple
      window.addEventListener('click', (e) => {
        if (e.target.closest('button, a, input, textarea, .modal, .project-card, .flip-btn, .matrix-panel')) return;
        this.triggerCrescendo(1.2);
      });

      const tidesPill = document.querySelector('.tides-pill');
      if (tidesPill) {
        tidesPill.addEventListener('click', (e) => {
          e.stopPropagation();
          this.triggerCrescendo(1.4);
        });
      }

      // Expose globally for dedicated UI buttons (like [TRIGGER WAVE])
      window.triggerOceanCrescendo = () => this.triggerCrescendo(1.4);
    }

    animate() {
      const delta = this.clock.getDelta();
      const time = this.clock.getElapsedTime();

      // Fluid, natural tidal cursor easing
      this.planeCoords.lerp(this.targetPlaneCoords, 0.055);
      this.mouseSpeed += (this.targetMouseSpeed - this.mouseSpeed) * 0.07;
      this.targetMouseSpeed *= 0.93; // Exponential velocity decay

      // Crescendo pulse time advancement
      if (this.crescendoTime >= 0.0) {
        this.crescendoTime += delta;
        if (this.crescendoTime > 3.0) {
          this.crescendoTime = -1.0;
        }
      }

      // Update Shader Uniforms
      if (this.oceanMaterial) {
        this.oceanMaterial.uniforms.uTime.value = time;
        this.oceanMaterial.uniforms.uMouse.value.copy(this.planeCoords);
        this.oceanMaterial.uniforms.uMouseSpeed.value = this.mouseSpeed;
        this.oceanMaterial.uniforms.uCrescendoTime.value = this.crescendoTime;
        this.oceanMaterial.uniforms.uCrescendoStrength.value = this.crescendoStrength;
      }

      // Drift Sediment Particles along flow field
      if (this.sedimentGeometry) {
        const pArray = this.sedimentGeometry.attributes.position.array;
        const pCount = pArray.length / 3;
        for (let i = 0; i < pCount; i++) {
          const vel = this.particleVelocities[i];
          pArray[i * 3] += vel.x;
          if (pArray[i * 3] > 55) pArray[i * 3] = -55;
          if (pArray[i * 3] < -55) pArray[i * 3] = 55;

          pArray[i * 3 + 1] += vel.y;
          if (pArray[i * 3 + 1] > 42) pArray[i * 3 + 1] = -42;
          if (pArray[i * 3 + 1] < -42) pArray[i * 3 + 1] = 42;

          pArray[i * 3 + 2] = vel.baseZ + Math.sin(time * 0.7 + vel.seed) * 1.1;
        }
        this.sedimentGeometry.attributes.position.needsUpdate = true;
      }

      // Living camera breathing & natural mouse parallax
      this.targetX += (this.mouseX * 1.4 - this.targetX) * 0.028;
      this.targetY += (this.mouseY * 0.9 - this.targetY) * 0.028;

      this.camera.position.x = this.targetX;
      this.camera.position.y = 18 + this.targetY + Math.sin(time * 0.28) * 0.32;
      this.camera.lookAt(0, -1, -5);

      this.renderer.render(this.scene, this.camera);
      requestAnimationFrame(() => this.animate());
    }
  }

  /* ==========================================================================
     4. 6x6 3D KEY VISUAL MATRIX (JUNNI SIGNATURE GRID + IDLE WAVES)
     ========================================================================== */
  class MatrixGrid {
    constructor() {
      this.container = document.querySelector('.matrix-grid');
      this.flipAllBtn = document.getElementById('trigger-matrix-wave');
      this.panels = [];
      this.idleTimer = null;
      this.init();
    }

    init() {
      if (!this.container) return;

      const techBadges = [
        'C#', 'UNITY', 'UNREAL', 'AI', 'XR', 'GLSL',
        '3D', 'MATH', 'LOGIC', 'PHYS', 'NET', 'STATE',
        'DEV', 'CODE', 'GAME', 'LOOP', 'SPEC', 'DOT',
        'OPENCV', 'SWING', 'UI/UX', 'BLENDER', 'SHADERS', 'SIM',
        'ROBOT', 'AGENTS', 'AUDIO', 'ALGO', 'WAVE', 'FLOW',
        'HLSL', 'VFX', '01', '06', 'FAST', 'SHIP'
      ];

      for (let i = 0; i < 36; i++) {
        const x = i % 6;
        const y = Math.floor(i / 6);
        const badge = techBadges[i % techBadges.length];

        const panel = document.createElement('div');
        panel.className = 'matrix-panel';
        panel.setAttribute('data-x', x);
        panel.setAttribute('data-y', y);
        panel.setAttribute('data-cursor', 'FLIP');

        panel.innerHTML = `
          <div class="matrix-face matrix-front">
            <span style="opacity:0.6">${String(i + 1).padStart(2, '0')}</span>
          </div>
          <div class="matrix-face matrix-back">
            <span>${badge}</span>
          </div>
        `;

        let isMouseDown = false;
        window.addEventListener('mousedown', () => { isMouseDown = true; });
        window.addEventListener('mouseup', () => { isMouseDown = false; });

        panel.addEventListener('mouseenter', () => {
          panel.classList.toggle('flipped');
          sfx.playFlip();
          this.resetIdleTimer();
          if (isMouseDown) {
            this.triggerRipple(x, y);
          }
        });

        panel.addEventListener('click', () => {
          this.triggerRipple(x, y);
          sfx.playClick();
          this.resetIdleTimer();
        });

        this.container.appendChild(panel);
        this.panels.push(panel);
      }

      // Touch drag-to-flip support for mobile
      this.container.addEventListener('touchmove', (e) => {
        const touch = e.touches[0];
        const target = document.elementFromPoint(touch.clientX, touch.clientY);
        const panel = target ? target.closest('.matrix-panel') : null;
        if (panel && !panel._touched) {
          panel._touched = true;
          panel.classList.toggle('flipped');
          sfx.playFlip();
          setTimeout(() => { panel._touched = false; }, 320);
        }
      }, { passive: true });

      // Initial subtle wave
      setTimeout(() => {
        this.triggerRipple(2, 2);
      }, 1000);

      if (this.flipAllBtn) {
        this.flipAllBtn.addEventListener('click', () => {
          this.triggerWave();
          if (window.triggerOceanCrescendo) window.triggerOceanCrescendo();
          sfx.playFlip();
          this.resetIdleTimer();
        });
      }

      this.startIdleLoop();
    }

    triggerRipple(originX, originY) {
      this.panels.forEach((p) => {
        const px = parseInt(p.getAttribute('data-x'), 10);
        const py = parseInt(p.getAttribute('data-y'), 10);
        const distance = Math.hypot(px - originX, py - originY);

        setTimeout(() => {
          p.classList.toggle('flipped');
        }, distance * 60);
      });
    }

    triggerWave() {
      this.panels.forEach((p, index) => {
        setTimeout(() => {
          p.classList.toggle('flipped');
        }, index * 18);
      });
    }

    startIdleLoop() {
      this.idleTimer = setInterval(() => {
        // Subtle organic diagonal wave sweep every 9 seconds
        const randomX = Math.floor(Math.random() * 6);
        const randomY = Math.floor(Math.random() * 6);
        this.triggerRipple(randomX, randomY);
      }, 9000);
    }

    resetIdleTimer() {
      clearInterval(this.idleTimer);
      this.startIdleLoop();
    }
  }

  /* ==========================================================================
     5. 3D CARD TILT & HOLOGRAPHIC SPECULAR SHINE
     ========================================================================== */
  class CardTilt3D {
    constructor() {
      this.cards = document.querySelectorAll('.project-card, .timeline-card');
      this.init();
    }

    init() {
      if (window.innerWidth <= 768 || window.matchMedia('(pointer: coarse)').matches) {
        return; // Skip 3D tilt on mobile
      }

      this.cards.forEach((card) => {
        // Inject specular glare overlay
        const glare = document.createElement('div');
        glare.className = 'card-glare';
        card.appendChild(glare);

        card.addEventListener('mousemove', (e) => {
          const rect = card.getBoundingClientRect();
          const x = e.clientX - rect.left;
          const y = e.clientY - rect.top;

          const centerX = rect.width / 2;
          const centerY = rect.height / 2;

          // Maximum rotation 7 degrees
          const rotateX = ((y - centerY) / centerY) * -7;
          const rotateY = ((x - centerX) / centerX) * 7;

          card.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateY(-6px)`;
          card.style.setProperty('--mouse-x', `${x}px`);
          card.style.setProperty('--mouse-y', `${y}px`);
        });

        card.addEventListener('mouseleave', () => {
          card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0)';
        });
      });
    }
  }

  /* ==========================================================================
     6. MAGNETIC BUTTONS & ELEMENTS PHYSICS
     ========================================================================== */
  class MagneticPhysics {
    constructor() {
      this.elements = document.querySelectorAll('[data-magnetic]');
      this.init();
    }

    init() {
      if (window.innerWidth <= 768 || window.matchMedia('(pointer: coarse)').matches) return;

      this.elements.forEach((el) => {
        el.addEventListener('mousemove', (e) => {
          const rect = el.getBoundingClientRect();
          const centerX = rect.left + rect.width / 2;
          const centerY = rect.top + rect.height / 2;

          const deltaX = (e.clientX - centerX) * 0.28;
          const deltaY = (e.clientY - centerY) * 0.28;

          el.style.transform = `translate(${deltaX}px, ${deltaY}px)`;
        });

        el.addEventListener('mouseleave', () => {
          el.style.transform = 'translate(0px, 0px)';
        });
      });
    }
  }

  /* ==========================================================================
     7. CYBER HACKER TEXT SCRAMBLE DECODER EFFECT
     ========================================================================== */
  class TextScrambler {
    constructor() {
      this.chars = '!<>-_\\/[]{}—=+*^?#________010101XYZ';
      this.elements = document.querySelectorAll('[data-scramble]');
      this.init();
    }

    init() {
      this.elements.forEach((el) => {
        const originalText = el.textContent.trim();
        el.setAttribute('data-original-text', originalText);

        el.addEventListener('mouseenter', () => {
          this.scramble(el, originalText);
          sfx.playHover();
        });
      });
    }

    scramble(el, targetText) {
      let iteration = 0;
      clearInterval(el._scrambleInterval);

      el._scrambleInterval = setInterval(() => {
        el.innerText = targetText
          .split('')
          .map((letter, index) => {
            if (index < iteration) {
              return targetText[index];
            }
            if (letter === ' ') return ' ';
            return this.chars[Math.floor(Math.random() * this.chars.length)];
          })
          .join('');

        if (iteration >= targetText.length) {
          clearInterval(el._scrambleInterval);
        }

        iteration += 1 / 2;
      }, 30);
    }
  }

  /* ==========================================================================
     8. LIVE TELEMETRY HUD (FPS, MOUSE COORDS, SCROLL DEPTH)
     ========================================================================== */
  class TelemetryHUD {
    constructor() {
      this.fpsEl = document.getElementById('hud-fps');
      this.coordsEl = document.getElementById('hud-coords');
      this.scrollEl = document.getElementById('hud-scroll');
      this.frameCount = 0;
      this.lastTime = performance.now();
      this.init();
    }

    init() {
      if (!this.fpsEl) return;

      // Mouse tracking
      window.addEventListener('mousemove', (e) => {
        if (this.coordsEl) {
          this.coordsEl.textContent = `${e.clientX},${e.clientY}`;
        }
      });

      // Scroll tracking
      window.addEventListener('scroll', () => {
        if (this.scrollEl) {
          const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
          const pct = maxScroll > 0 ? Math.round((window.scrollY / maxScroll) * 100) : 0;
          this.scrollEl.textContent = `${pct}%`;
        }
      });

      // FPS loop
      const calcFPS = () => {
        this.frameCount++;
        const now = performance.now();
        if (now - this.lastTime >= 1000) {
          const fps = Math.round((this.frameCount * 1000) / (now - this.lastTime));
          if (this.fpsEl) this.fpsEl.textContent = `${fps}`;
          this.frameCount = 0;
          this.lastTime = now;
        }
        requestAnimationFrame(calcFPS);
      };
      requestAnimationFrame(calcFPS);
    }
  }

  /* ==========================================================================
     9. SCROLL REVEAL (VIEWPORT INTERSECTION OBSERVER)
     ========================================================================== */
  class ScrollReveal {
    constructor() {
      this.elements = document.querySelectorAll('.reveal');
      this.init();
    }

    init() {
      if (!('IntersectionObserver' in window)) {
        this.elements.forEach((el) => el.classList.add('is-revealed'));
        return;
      }

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add('is-revealed');
            }
          });
        },
        { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
      );

      this.elements.forEach((el) => observer.observe(el));
    }
  }

  /* ==========================================================================
     10. INTERACTIVE TERMINAL HUD
     ========================================================================== */
  class TerminalHUD {
    constructor() {
      this.body = document.getElementById('terminal-hud-body');
      this.tabs = document.querySelectorAll('.terminal-tab-btn');
      this.init();
    }

    init() {
      if (!this.body) return;

      const commands = {
        whoami: {
          cmd: 'whoami',
          out: `Arbaz Arshad — Game Developer, AI Power User, Tech Wizard.
Currently crafting games, XR, AR/VR, and immersive spatial solutions.
"I build games and interactive software with Unity, Unreal, C#, Java, Python, and AI."`
        },
        stack: {
          cmd: 'engine --list --verbose',
          out: `[PRIMARY ENGINES] : Unity, Unreal Engine 5, Blender 3D
[SYSTEMS & LANGS] : C#, Python, Java (Swing), WebGL, HLSL/GLSL
[SPECIALTIES]     : Deterministic State Machines, AI Behavior Trees, Robotics CV, UI Toolkit, DOTween`
        },
        philosophy: {
          cmd: 'cat ./manifesto.md',
          out: `"I care about the systems nobody imagines — Game Design, Game Mechanics, UX, Story Elements, clean architecture — because that is where an experience lives or dies."`
        },
        contact: {
          cmd: 'ping arbazarshad7@gmail.com',
          out: `STATUS: ONLINE · READY FOR NEW BUILDS
EMAIL: arbazarshad7@gmail.com
GITHUB: https://github.com/arbazarshad7
LINKEDIN: https://linkedin.com/in/arbaz-arshad-x7`
        }
      };

      this.tabs.forEach((tab) => {
        tab.addEventListener('click', () => {
          this.tabs.forEach((t) => t.classList.remove('active'));
          tab.classList.add('active');
          const cmdKey = tab.getAttribute('data-tab');
          if (commands[cmdKey]) {
            this.execute(commands[cmdKey]);
            sfx.playClick();
          }
        });
      });
    }

    execute(item) {
      this.body.innerHTML = `
        <div class="prompt-line">
          <span class="prompt-prefix">$</span>
          <span class="prompt-cmd">${item.cmd}</span>
        </div>
        <div class="prompt-output">${item.out.replace(/\n/g, '<br>')}</div>
        <div class="prompt-line">
          <span class="prompt-prefix">$</span>
          <span class="cursor-blink"></span>
        </div>
      `;
    }
  }

  /* ==========================================================================
     11. PROJECT FILTERING SYSTEM
     ========================================================================== */
  class ProjectFilter {
    constructor() {
      this.filterBtns = document.querySelectorAll('.filter-btn');
      this.cards = document.querySelectorAll('.project-card');
      this.init();
    }

    init() {
      if (!this.filterBtns.length) return;

      this.filterBtns.forEach((btn) => {
        btn.addEventListener('click', () => {
          this.filterBtns.forEach((b) => b.classList.remove('active'));
          btn.classList.add('active');
          const filter = btn.getAttribute('data-filter');
          sfx.playClick();

          this.cards.forEach((card) => {
            const cat = card.getAttribute('data-category');
            if (filter === 'all' || cat === filter) {
              card.style.display = 'flex';
              setTimeout(() => {
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
              }, 10);
            } else {
              card.style.opacity = '0';
              card.style.transform = 'translateY(15px)';
              setTimeout(() => {
                card.style.display = 'none';
              }, 250);
            }
          });
        });
      });
    }
  }

  /* ==========================================================================
     12. CASE STUDY QUICK-INSPECT MODAL & DATA
     ========================================================================== */
  const PROJECT_DATA = {
    'cobra-card': {
      title: 'Cobra Card Game',
      subtitle: 'Multiplayer Card Game with Deterministic State Machines',
      image: 'assets/images/p1-cobra.jpg',
      category: 'Game Development',
      spec: {
        type: 'Multiplayer Card Game',
        systems: 'State Machines · Scoring',
        engine: 'Unity 3D',
        language: 'C#'
      },
      tags: ['Unity', 'C#', 'DOTween', 'UI Toolkit', 'Multiplayer'],
      body: `A custom multiplayer card game built around serious systems. Every phase of play — dealing, turn resolution, scoring — is driven by explicit state machines so the flow stays deterministic even as the table grows.<br><br>The presentation layer runs on a professional UI Toolkit setup, with DOTween driving the animation so card movement stays responsive, crisp, and responsive.`,
      highlights: [
        'Complex turn management with per-phase state machines',
        'Sophisticated mathematical score calculation logic',
        'Professional UI Toolkit interface + synchronized DOTween animations'
      ]
    },
    'online-chess': {
      title: 'Online Chess Game',
      subtitle: 'Multiplayer Turn-Based Strategy with Real-Time Networking',
      image: 'assets/images/p2-chess.jpg',
      category: 'Multiplayer / AI',
      spec: {
        type: 'Turn-Based Strategy',
        systems: 'Logic · Enemy AI · Netcode',
        engine: 'Unity 3D',
        language: 'C#'
      },
      tags: ['Unity', 'C#', 'Networking', 'AI', 'UI/UX'],
      body: `A multiplayer online chess game built in Unity with real-time networking, synchronized gameplay, and a responsive board interface for smooth competitive matches.<br><br>Implements complete chess rules, legal move validation, check/checkmate detection, and turn-based synchronization to ensure accurate gameplay across clients.`,
      highlights: [
        'Real-time multiplayer with synchronized game state database',
        'Complete chess logic with move validation and special rules',
        'Responsive UI and efficient turn-based networking for seamless gameplay'
      ]
    },
    'digital-blackjack': {
      title: 'Digital Blackjack',
      subtitle: 'Deterministic Probability Card Game & Rules Engine',
      image: 'assets/images/p3-blackjack.jpg',
      category: 'Game Systems',
      spec: {
        type: 'Card Game Engine',
        systems: 'Shuffling · Probability',
        platform: 'Desktop / WebGL',
        language: 'C# / .NET'
      },
      tags: ['C#', '.NET', 'Probability Logic', 'WebGL', 'UI Design'],
      body: `A polished reimagining of the classic card game. The rules engine executes real deck shuffling and probability calculations rather than pseudo-random luck, giving players a fair, analysable game.<br><br>The interface is responsive and deliberately clean — designed to run seamlessly on desktop or browser with instant feedback.`,
      highlights: [
        'Advanced C# deck-shuffling and probability logic',
        'Responsive, high-quality user interface with table telemetry',
        'Deterministic rules engine behind the visual polish'
      ]
    },
    'java-games': {
      title: 'Java Desktop Games Collection',
      subtitle: 'Retro Arcade Classics & Custom Game Loop Architecture',
      image: 'assets/images/p4-retro.jpg',
      category: 'Desktop Games',
      spec: {
        type: 'Arcade Games Suite',
        stack: 'Java · Swing API',
        titles: '5 (4 Classics + 1 Original)',
        ui: 'Swing Desktop'
      },
      tags: ['Java', 'Swing', 'Arcade Game Loops', 'Input Handling'],
      body: `A retrospective collection of arcade classics built from scratch in Java — Snake, Breakout, Pac-Man, and Sokoban — alongside an original custom puzzle game.<br><br>Each title is its own self-contained Swing application: tight input response, solid 60fps game loops, and no external frameworks hiding the core computer science fundamentals.`,
      highlights: [
        'Snake · Breakout · Pac-Man · Sokoban · Custom Puzzle Game',
        'Clean Swing implementations, self-contained per title',
        'Focus on custom game loops and low-level input handling fundamentals'
      ]
    },
    'ai-crop': {
      title: 'AI Crop Recommendation System',
      subtitle: 'Sensor Fusion & Random Forest Agricultural Prediction',
      image: 'assets/images/p5-crop.jpg',
      category: 'AI / Machine Learning',
      spec: {
        type: 'ML Analytics Application',
        model: 'Random Forest Classifier',
        stack: 'Python · Scikit-learn',
        data: 'Soil · GPS · Weather APIs'
      },
      tags: ['Python', 'Scikit-learn', 'Random Forest', 'Live APIs', 'ML'],
      body: `A Python application that predicts and recommends optimal crop yields by combining three live data streams: soil telemetry, GPS positioning, and real-time atmospheric weather APIs.<br><br>Predictions run on a trained Random Forest classifier with Scikit-learn, ensuring the output is transparent and explainable by the measured soil and climatic features.`,
      highlights: [
        'Random Forest Classifier (Scikit-learn) for high-accuracy crop prediction',
        'Fuses soil analysis, GPS telemetry, and live weather APIs',
        'Explainable predictions grounded in measured agricultural data'
      ]
    },
    'robotic-teleop': {
      title: 'Vision-Based Robotic Teleoperation',
      subtitle: 'Real-Time Gesture Tracking & Low-Latency Robotic Control',
      image: 'assets/images/p6-teleop.jpg',
      category: 'Computer Vision & Robotics',
      spec: {
        type: 'Robotics / CV Pipeline',
        stack: 'Python · OpenCV',
        input: 'Hand Gestures / Sign Language',
        output: 'Real-Time Robotic Movement'
      },
      tags: ['Python', 'OpenCV', 'Robotics', 'Sign Language CV', 'Low Latency'],
      body: `An advanced integration of computer vision with hardware robotics: human hand gestures — including sign-language patterns — are translated into real-time robotic actuator commands.<br><br>The vision pipeline detects and classifies gestures, maps them to Cartesian control vectors, and streams them to the robot with latency low enough for natural teleoperation.`,
      highlights: [
        'Computer vision hand-gesture recognition (incl. sign language mapping)',
        'Real-time translation of gestures into low-latency robotic movement',
        'Engineered for fluid, natural teleoperation'
      ]
    }
  };

  class CaseModal {
    constructor() {
      this.overlay = document.getElementById('project-modal');
      this.closeBtn = document.getElementById('modal-close-btn');
      this.init();
    }

    init() {
      if (!this.overlay) return;

      document.addEventListener('click', (e) => {
        const btn = e.target.closest('[data-inspect]');
        if (btn) {
          e.preventDefault();
          const key = btn.getAttribute('data-inspect');
          this.open(key);
        }
      });

      if (this.closeBtn) {
        this.closeBtn.addEventListener('click', () => this.close());
      }

      this.overlay.addEventListener('click', (e) => {
        if (e.target === this.overlay) this.close();
      });

      window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && this.overlay.classList.contains('is-active')) {
          this.close();
        }
      });
    }

    open(key) {
      const data = PROJECT_DATA[key];
      if (!data) return;

      const media = document.getElementById('modal-media');
      const category = document.getElementById('modal-category');
      const title = document.getElementById('modal-title');
      const body = document.getElementById('modal-body-content');
      const specGrid = document.getElementById('modal-spec-grid');
      const highlights = document.getElementById('modal-highlights');
      const fullLink = document.getElementById('modal-full-link');

      if (media) media.src = data.image;
      if (category) category.textContent = data.category;
      if (title) title.textContent = data.title;
      if (body) body.innerHTML = data.body;
      if (fullLink) fullLink.href = `projects.html#${key}`;

      if (specGrid) {
        specGrid.innerHTML = Object.entries(data.spec)
          .map(([k, v]) => `
            <div class="modal-spec-item">
              <dt>${k}</dt>
              <dd>${v}</dd>
            </div>
          `).join('');
      }

      if (highlights) {
        highlights.innerHTML = data.highlights
          .map((h) => `<li>${h}</li>`)
          .join('');
      }

      this.overlay.classList.add('is-active');
      document.body.style.overflow = 'hidden';
      sfx.playClick();
    }

    close() {
      this.overlay.classList.remove('is-active');
      document.body.style.overflow = '';
      sfx.playClick();
    }
  }

  /* ==========================================================================
     13. GLITCH VIDEO CINEMA MODAL
     ========================================================================== */
  class VideoModal {
    constructor() {
      this.trigger = document.getElementById('trigger-glitch-video');
      this.overlay = document.getElementById('video-modal');
      this.closeBtn = document.getElementById('video-modal-close');
      this.video = document.getElementById('glitch-video-player');
      this.init();
    }

    init() {
      if (!this.trigger || !this.overlay || !this.video) return;

      this.trigger.addEventListener('click', () => {
        this.overlay.classList.add('is-active');
        this.video.currentTime = 0;
        this.video.play().catch(() => {});
        document.body.style.overflow = 'hidden';
        sfx.playClick();
      });

      const closeHandler = () => {
        this.overlay.classList.remove('is-active');
        this.video.pause();
        document.body.style.overflow = '';
        sfx.playClick();
      };

      if (this.closeBtn) this.closeBtn.addEventListener('click', closeHandler);
      this.overlay.addEventListener('click', (e) => {
        if (e.target === this.overlay) closeHandler();
      });

      window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && this.overlay.classList.contains('is-active')) {
          closeHandler();
        }
      });
    }
  }

  /* ==========================================================================
     15. CYBER SHUTTER PRELOADER & BOOT SEQUENCE ENGINE
     ========================================================================== */
  class PreloaderEngine {
    constructor() {
      this.overlay = document.getElementById('preloader');
      this.bar = document.getElementById('preloader-bar');
      this.log = document.getElementById('preloader-log');
      this.pct = document.getElementById('preloader-pct');
      this.skipBtn = document.getElementById('preloader-skip');
      this.progress = 0;
      this.finished = false;
      this.init();
    }

    init() {
      if (!this.overlay) return;

      const logs = [
        'INITIALIZING GRAPHICS ENGINE...',
        'MOUNTING THREE.JS SHADERS... [OK]',
        'COMPILING C# STATE MACHINES... [OK]',
        'CALIBRATING MOTION KINEMATICS... [OK]',
        'LAUNCHING CONQUER PROTOCOL... [READY]'
      ];

      const finish = () => {
        if (this.finished) return;
        this.finished = true;
        this.overlay.classList.add('is-finished');
        sfx.playTone(520, 'triangle', 0.16, 0.05);
        setTimeout(() => {
          sfx.playTone(880, 'sine', 0.22, 0.04);
        }, 70);
        setTimeout(() => {
          if (this.overlay && this.overlay.parentNode) {
            this.overlay.parentNode.removeChild(this.overlay);
          }
        }, 900);
      };

      if (this.skipBtn) {
        this.skipBtn.addEventListener('click', finish);
      }

      window.addEventListener('keydown', (e) => {
        if ((e.key === ' ' || e.key === 'Enter' || e.key === 'Escape') && !this.finished) {
          finish();
        }
      });

      const interval = setInterval(() => {
        this.progress += Math.floor(Math.random() * 8) + 5;
        if (this.progress > 100) this.progress = 100;

        if (this.bar) this.bar.style.width = `${this.progress}%`;
        if (this.pct) this.pct.textContent = `${String(this.progress).padStart(2, '0')}%`;

        const logIdx = Math.min(Math.floor((this.progress / 100) * logs.length), logs.length - 1);
        if (this.log) this.log.textContent = logs[logIdx];

        if (this.progress >= 100) {
          clearInterval(interval);
          setTimeout(finish, 160);
        }
      }, 35);
    }
  }

  /* ==========================================================================
     16. MOUSE PARTICLE COMET TRAIL & CLICK SPARK VFX ENGINE
     ========================================================================== */
  class ParticleVFX {
    constructor() {
      this.canvas = document.getElementById('fx-canvas');
      if (!this.canvas) return;
      this.ctx = this.canvas.getContext('2d');
      this.particles = [];
      this.init();
    }

    init() {
      this.resize();
      window.addEventListener('resize', () => this.resize());

      window.addEventListener('mousemove', (e) => {
        this.spawnTrail(e.clientX, e.clientY);
      });

      window.addEventListener('click', (e) => {
        this.spawnBurst(e.clientX, e.clientY);
      });

      this.render();
    }

    resize() {
      this.canvas.width = window.innerWidth;
      this.canvas.height = window.innerHeight;
    }

    spawnTrail(x, y) {
      if (this.particles.length > 95) return;
      this.particles.push({
        x: x + (Math.random() - 0.5) * 5,
        y: y + (Math.random() - 0.5) * 5,
        vx: (Math.random() - 0.5) * 0.9,
        vy: (Math.random() - 0.5) * 0.9 - 0.35,
        size: Math.random() * 2.2 + 1.2,
        color: Math.random() > 0.5 ? '#e5ff00' : '#00f0ff',
        alpha: 0.75,
        decay: 0.032
      });
    }

    spawnBurst(x, y) {
      for (let i = 0; i < 14; i++) {
        const angle = (Math.PI * 2 * i) / 14 + (Math.random() - 0.5) * 0.35;
        const speed = Math.random() * 4.2 + 2.5;
        this.particles.push({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          size: Math.random() * 2.8 + 1.5,
          color: i % 2 === 0 ? '#e5ff00' : '#00f0ff',
          alpha: 1,
          decay: 0.024,
          gravity: 0.12
        });
      }
    }

    render() {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

      for (let i = this.particles.length - 1; i >= 0; i--) {
        const p = this.particles[i];
        p.x += p.vx;
        p.y += p.vy;
        if (p.gravity) p.vy += p.gravity;
        p.alpha -= p.decay;

        if (p.alpha <= 0) {
          this.particles.splice(i, 1);
          continue;
        }

        this.ctx.save();
        this.ctx.globalAlpha = Math.max(0, p.alpha);
        this.ctx.fillStyle = p.color;
        this.ctx.shadowBlur = 6;
        this.ctx.shadowColor = p.color;
        this.ctx.beginPath();
        this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.restore();
      }

      requestAnimationFrame(() => this.render());
    }
  }

  /* ==========================================================================
     17. LIVE OSCILLOSCOPE WAVEFORM VISUALIZER (MOTION SENSITIVE)
     ========================================================================== */
  class OscilloscopeVisualizer {
    constructor() {
      this.canvas = document.getElementById('hero-oscilloscope');
      if (!this.canvas) return;
      this.ctx = this.canvas.getContext('2d');
      this.phase = 0;
      this.speedMod = 1;
      this.targetMod = 1;
      this.init();
    }

    init() {
      window.addEventListener('mousemove', (e) => {
        const speed = Math.hypot(e.movementX || 0, e.movementY || 0);
        this.targetMod = 1 + Math.min(speed * 0.14, 3.2);
      });

      this.render();
    }

    render() {
      this.targetMod += (1 - this.targetMod) * 0.05;
      this.speedMod += (this.targetMod - this.speedMod) * 0.1;
      this.phase += 0.085 * this.speedMod;

      const w = this.canvas.width;
      const h = this.canvas.height;
      const mid = h / 2;

      this.ctx.clearRect(0, 0, w, h);

      // Primary Wave (Neon Yellow)
      this.ctx.beginPath();
      this.ctx.strokeStyle = '#e5ff00';
      this.ctx.lineWidth = 1.5;
      for (let x = 0; x < w; x++) {
        const y = mid + Math.sin(x * 0.12 + this.phase) * (6 * this.speedMod) * Math.sin(x * 0.03);
        if (x === 0) this.ctx.moveTo(x, y);
        else this.ctx.lineTo(x, y);
      }
      this.ctx.stroke();

      // Secondary Harmonic Wave (Cyan)
      this.ctx.beginPath();
      this.ctx.strokeStyle = 'rgba(0, 240, 255, 0.6)';
      this.ctx.lineWidth = 1;
      for (let x = 0; x < w; x++) {
        const y = mid + Math.cos(x * 0.18 - this.phase * 0.8) * (4 * this.speedMod) * Math.sin(x * 0.04);
        if (x === 0) this.ctx.moveTo(x, y);
        else this.ctx.lineTo(x, y);
      }
      this.ctx.stroke();

      requestAnimationFrame(() => this.render());
    }
  }

  /* ==========================================================================
     18. VELOCITY-REACTIVE KINETIC MARQUEE ENGINE (SCROLL PHYSICS)
     ========================================================================== */
  class KineticMarquee {
    constructor() {
      this.marquee = document.querySelector('.marquee-content');
      this.lastScroll = window.scrollY;
      this.velocity = 0;
      this.currentSkew = 0;
      this.init();
    }

    init() {
      if (!this.marquee) return;

      window.addEventListener('scroll', () => {
        const now = window.scrollY;
        const delta = now - this.lastScroll;
        this.lastScroll = now;
        this.velocity = delta * 0.22;
      });

      const update = () => {
        this.velocity += (0 - this.velocity) * 0.08;
        const targetSkew = Math.max(-5, Math.min(5, -this.velocity * 0.35));
        this.currentSkew += (targetSkew - this.currentSkew) * 0.1;

        if (Math.abs(this.currentSkew) > 0.04) {
          this.marquee.style.transform = `skewX(${this.currentSkew.toFixed(2)}deg)`;
        } else {
          this.marquee.style.transform = 'none';
        }

        requestAnimationFrame(update);
      };
      requestAnimationFrame(update);
    }
  }

  /* ==========================================================================
     19. SCROLL-TRIGGERED NUMERICAL COUNTER TICKERS
     ========================================================================== */
  class CounterTickers {
    constructor() {
      this.tickers = document.querySelectorAll('.counter-ticker');
      this.init();
    }

    init() {
      if (!this.tickers.length) return;

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              const el = entry.target;
              observer.unobserve(el);
              this.animateCounter(el);
            }
          });
        },
        { threshold: 0.3 }
      );

      this.tickers.forEach((t) => observer.observe(t));
    }

    animateCounter(el) {
      const target = parseInt(el.getAttribute('data-target'), 10) || 0;
      const duration = 1200;
      const startTime = performance.now();

      const step = (now) => {
        const progress = Math.min((now - startTime) / duration, 1);
        const ease = 1 - Math.pow(1 - progress, 3); // Ease out cubic
        const current = Math.round(target * ease);
        el.textContent = current < 10 && target < 10 ? `0${current}` : `${current}`;

        if (progress < 1) {
          requestAnimationFrame(step);
        } else {
          el.textContent = target < 10 ? `0${target}` : `${target}`;
        }
      };
      requestAnimationFrame(step);
    }
  }

  /* ==========================================================================
     20. PROJECT CARD TARGETING RETICLE & HUD COORDINATE TRACKING
     ========================================================================== */
  class ProjectReticles {
    constructor() {
      this.cards = document.querySelectorAll('.project-card');
      this.init();
    }

    init() {
      this.cards.forEach((card) => {
        const reticle = card.querySelector('.project-reticle');
        const coords = reticle ? reticle.querySelector('.reticle-coords') : null;
        const mediaWrap = card.querySelector('.project-media-wrap');

        if (!reticle || !mediaWrap) return;

        mediaWrap.addEventListener('mousemove', (e) => {
          const rect = mediaWrap.getBoundingClientRect();
          const x = Math.round(e.clientX - rect.left);
          const y = Math.round(e.clientY - rect.top);

          reticle.style.left = `${x}px`;
          reticle.style.top = `${y}px`;
          if (coords) {
            const badge = card.querySelector('.project-badge-num');
            const code = badge ? badge.textContent.trim() : 'TARGET';
            coords.textContent = `${code} [${x},${y}]`;
          }
        });
      });
    }
  }

  /* ==========================================================================
     21. MULTI-BLADE CYBER SHUTTER PAGE TRANSITIONS
     ========================================================================== */
  class PageTransitions {
    constructor() {
      this.shutter = document.getElementById('page-shutter');
      this.init();
    }

    init() {
      if (!this.shutter) return;

      // Reveal on page open
      this.shutter.classList.add('is-opening');
      setTimeout(() => {
        this.shutter.classList.remove('is-opening');
      }, 550);

      // Intercept internal page link transitions
      const links = document.querySelectorAll('a[href$=".html"], a.flip-btn[href*=".html"]');
      links.forEach((link) => {
        link.addEventListener('click', (e) => {
          const href = link.getAttribute('href');
          if (!href || href.startsWith('#') || href.startsWith('mailto:') || link.target === '_blank') return;

          e.preventDefault();
          this.shutter.classList.add('is-closing');
          sfx.playClick();

          setTimeout(() => {
            window.location.href = href;
          }, 360);
        });
      });
    }
  }

  /* ==========================================================================
     22. GENERAL UI ENHANCEMENTS (TOPBAR SCROLL, CLOCK, MOBILE SLIDE-IN NAV)
     ========================================================================== */
  function initGeneralUI() {
    const topbar = document.querySelector('.topbar');
    window.addEventListener('scroll', () => {
      if (topbar) {
        if (window.scrollY > 30) {
          topbar.classList.add('scrolled');
        } else {
          topbar.classList.remove('scrolled');
        }
      }
    });

    const menuToggle = document.querySelector('.menu-toggle');
    if (menuToggle) {
      menuToggle.addEventListener('click', () => {
        document.body.classList.toggle('nav-open');
        sfx.playClick();
      });
    }

    const mobileLinks = document.querySelectorAll('.nav-link');
    mobileLinks.forEach((link) => {
      link.addEventListener('click', () => {
        document.body.classList.remove('nav-open');
      });
    });

    const clockEl = document.getElementById('live-time');
    function updateClock() {
      if (!clockEl) return;
      const now = new Date();
      clockEl.textContent = now.toLocaleTimeString('en-US', { hour12: false });
    }
    updateClock();
    setInterval(updateClock, 1000);
  }

  /* ==========================================================================
     BOOTSTRAP ALL ADVANCED MOTION ENGINES ON DOM READY
     ========================================================================== */
  document.addEventListener('DOMContentLoaded', () => {
    new PreloaderEngine();
    new PageTransitions();
    new CustomCursor();
    new ParticleVFX();
    new WebGLCanvas();
    new OscilloscopeVisualizer();
    new MatrixGrid();
    new CardTilt3D();
    new MagneticPhysics();
    new TextScrambler();
    new KineticMarquee();
    new CounterTickers();
    new ProjectReticles();
    new TelemetryHUD();
    new ScrollReveal();
    new TerminalHUD();
    new ProjectFilter();
    new CaseModal();
    new VideoModal();
    initGeneralUI();
  });
})();
