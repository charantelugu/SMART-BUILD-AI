import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import {
  RotateCcw,
  Play,
  Pause,
  Sun,
  Moon,
  Compass,
  Sparkles
} from 'lucide-react';

export default function ArchitecturalVisualizer({
  type = 'exterior',
  style = 'Modern',
  room = 'Living Room',
  floors = 'G + 3',
  lighting = 'Daylight'
}) {
  const mountRef = useRef(null);
  const [isAutoRotate, setIsAutoRotate] = useState(true);
  const [activeLighting, setActiveLighting] = useState(lighting);
  const controlsRef = useRef(null);
  const sceneRef = useRef(null);
  const rendererRef = useRef(null);
  const cameraRef = useRef(null);

  const isExterior = type === 'exterior';
  const numFloors = floors.includes('G + 3') ? 4 : floors.includes('G + 2') ? 3 : floors.includes('G + 1') ? 2 : 1;

  useEffect(() => {
    setActiveLighting(lighting);
  }, [lighting]);

  useEffect(() => {
    if (!mountRef.current) return;

    const width = mountRef.current.clientWidth || 800;
    const height = mountRef.current.clientHeight || 480;

    // 1. Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Background color based on type and lighting
    let bgColor = 0x0f172a;
    if (isExterior) {
      if (activeLighting === 'Daylight') bgColor = 0x60a5fa;
      else if (activeLighting === 'Twilight Accent' || activeLighting === 'Twilight') bgColor = 0x1e1b4b;
      else bgColor = 0x070b14;
    } else {
      bgColor = 0x0d1322;
    }
    scene.background = new THREE.Color(bgColor);

    if (isExterior && activeLighting === 'Daylight') {
      scene.fog = new THREE.FogExp2(0x93c5fd, 0.009);
    } else if (isExterior) {
      scene.fog = new THREE.FogExp2(0x0f172a, 0.012);
    } else {
      scene.fog = new THREE.FogExp2(0x0d1322, 0.015);
    }

    // 2. Camera & Target
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 200);
    cameraRef.current = camera;

    const floorHeight = 3.2;
    const buildingHeight = numFloors * floorHeight;
    const exteriorTargetY = Math.max(2.5, buildingHeight * 0.45);
    const exteriorDist = 18 + numFloors * 3.2;

    if (isExterior) {
      camera.position.set(exteriorDist * 0.72, exteriorTargetY + exteriorDist * 0.38, exteriorDist * 0.75);
    } else {
      camera.position.set(0, 3.2, 6.8);
    }

    // 3. WebGL Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = isExterior ? (activeLighting === 'Daylight' ? 1.15 : 1.3) : 1.2;
    rendererRef.current = renderer;

    mountRef.current.innerHTML = '';
    mountRef.current.appendChild(renderer.domElement);

    // 4. OrbitControls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.06;
    controls.autoRotate = isAutoRotate;
    controls.autoRotateSpeed = 1.0;

    if (isExterior) {
      controls.target.set(0, exteriorTargetY, 0);
      controls.maxPolarAngle = Math.PI / 2 - 0.03; // Keep above ground level
      controls.minDistance = 8;
      controls.maxDistance = 65;
    } else {
      controls.target.set(0, 1.6, 0);
      controls.maxPolarAngle = Math.PI / 2 + 0.1;
      controls.minDistance = 2.5;
      controls.maxDistance = 15;
    }
    controlsRef.current = controls;

    // 5. Lighting Setup
    const setupLights = () => {
      const isDay = activeLighting === 'Daylight';

      if (isExterior) {
        // Sky & Ground Ambient
        const ambColor = isDay ? 0xffffff : 0xfde047;
        const ambIntensity = isDay ? 0.85 : 0.45;
        scene.add(new THREE.AmbientLight(ambColor, ambIntensity));

        const skyColor = isDay ? 0xbae6fd : 0xf472b6;
        const groundBounce = isDay ? 0x334155 : 0x1e1b4b;
        const hemiLight = new THREE.HemisphereLight(skyColor, groundBounce, isDay ? 0.55 : 0.35);
        hemiLight.position.set(0, 40, 0);
        scene.add(hemiLight);

        // Key Sun Light
        const sunLight = new THREE.DirectionalLight(0xfffaed, isDay ? 1.8 : 0.9);
        sunLight.position.set(24, 34, 22);
        sunLight.castShadow = true;
        sunLight.shadow.mapSize.width = 2048;
        sunLight.shadow.mapSize.height = 2048;
        sunLight.shadow.camera.near = 1;
        sunLight.shadow.camera.far = 80;
        const shadowSize = 20 + numFloors * 3.5;
        sunLight.shadow.camera.left = -shadowSize;
        sunLight.shadow.camera.right = shadowSize;
        sunLight.shadow.camera.top = shadowSize;
        sunLight.shadow.camera.bottom = -shadowSize;
        sunLight.shadow.bias = -0.0004;
        scene.add(sunLight);

        // Fill Light
        const fillLight = new THREE.DirectionalLight(isDay ? 0x93c5fd : 0x38bdf8, 0.45);
        fillLight.position.set(-20, 18, -20);
        scene.add(fillLight);

        // Warm Building Uplights & Entrance Glows
        const mainDoorGlow = new THREE.PointLight(0xf59e0b, isDay ? 1.2 : 2.5, 10);
        mainDoorGlow.position.set(-0.5, 2.2, 5.2);
        scene.add(mainDoorGlow);

        const carportGlow = new THREE.PointLight(0xfef08a, 1.4, 8);
        carportGlow.position.set(-5.5, 2.7, 4.5);
        scene.add(carportGlow);

        if (!isDay) {
          // Night/Dusk facade wall uplights
          const facadeUplight1 = new THREE.PointLight(0x38bdf8, 2.0, 14);
          facadeUplight1.position.set(4.5, 0.8, 6.0);
          scene.add(facadeUplight1);

          const facadeUplight2 = new THREE.PointLight(0xf59e0b, 2.0, 14);
          facadeUplight2.position.set(-4.5, 0.8, 6.0);
          scene.add(facadeUplight2);
        }
      } else {
        // Interior Lighting (Bright, rich, attractive studio lighting)
        scene.add(new THREE.AmbientLight(0xfffbeb, 0.9));

        const mainCeilingLight = new THREE.PointLight(0xffedd5, 2.2, 16);
        mainCeilingLight.position.set(0, 3.2, 0);
        mainCeilingLight.castShadow = true;
        mainCeilingLight.shadow.bias = -0.0005;
        scene.add(mainCeilingLight);

        // Accent Cove & Warm Floor Illumination
        const accentWarm = new THREE.PointLight(0xf59e0b, 1.8, 12);
        accentWarm.position.set(-2.5, 1.8, -2.5);
        scene.add(accentWarm);

        const softCoolFill = new THREE.PointLight(0x38bdf8, 1.1, 12);
        softCoolFill.position.set(2.8, 2.2, 2.5);
        scene.add(softCoolFill);
      }
    };
    setupLights();

    // 6. Build Models
    if (isExterior) {
      buildRealisticExteriorScene(scene, style, numFloors, activeLighting);
    } else {
      buildAttractiveInteriorScene(scene, room, style, activeLighting);
    }

    // 7. Animation Loop
    let animationFrameId;
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    // 8. Responsive Resize
    const handleResize = () => {
      if (!mountRef.current) return;
      const w = mountRef.current.clientWidth;
      const h = mountRef.current.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      if (rendererRef.current && rendererRef.current.domElement) {
        rendererRef.current.dispose();
      }
      controls.dispose();
    };
  }, [type, style, room, floors, activeLighting, numFloors]);

  // Update auto-rotate
  useEffect(() => {
    if (controlsRef.current) {
      controlsRef.current.autoRotate = isAutoRotate;
    }
  }, [isAutoRotate]);

  // Camera preset handler
  const setCameraPreset = (angle) => {
    if (!controlsRef.current || !cameraRef.current) return;
    const controls = controlsRef.current;
    const camera = cameraRef.current;

    setIsAutoRotate(false);
    if (isExterior) {
      const targetY = Math.max(2.5, numFloors * 1.5);
      const dist = 18 + numFloors * 3.2;

      if (angle === 'front') {
        camera.position.set(0, targetY + dist * 0.15, dist);
      } else if (angle === 'corner') {
        camera.position.set(dist * 0.72, targetY + dist * 0.38, dist * 0.75);
      } else if (angle === 'left') {
        camera.position.set(-dist, targetY + dist * 0.2, 0);
      } else if (angle === 'right') {
        camera.position.set(dist, targetY + dist * 0.2, 0);
      } else if (angle === 'rear') {
        camera.position.set(0, targetY + dist * 0.25, -dist);
      } else if (angle === 'top') {
        camera.position.set(0, dist * 1.25, dist * 0.35);
      }
      controls.target.set(0, targetY, 0);
    } else {
      if (angle === 'front') {
        camera.position.set(0, 2.2, 6.2);
        controls.target.set(0, 1.5, 0);
      } else if (angle === 'corner') {
        camera.position.set(4.5, 3.2, 4.5);
        controls.target.set(0, 1.3, 0);
      } else if (angle === 'top') {
        camera.position.set(0, 7.5, 0.1);
        controls.target.set(0, 0, 0);
      } else if (angle === 'rear') {
        camera.position.set(0, 2.2, -6.2);
        controls.target.set(0, 1.5, 0);
      }
    }
    controls.update();
  };

  return (
    <div style={{ position: 'relative', width: '100%', height: '470px', borderRadius: 'var(--radius-md)', overflow: 'hidden', userSelect: 'none' }}>
      {/* Three.js Canvas Container */}
      <div ref={mountRef} style={{ width: '100%', height: '100%', cursor: 'grab', touchAction: 'none' }} />

      {/* 360° Interactive HUD Banner Overlay */}
      <div style={{
        position: 'absolute',
        top: '14px',
        left: '14px',
        background: 'rgba(15, 23, 42, 0.88)',
        backdropFilter: 'blur(8px)',
        border: '1px solid rgba(56, 189, 248, 0.4)',
        borderRadius: 'var(--radius-sm)',
        padding: '6px 14px',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        color: '#f8fafc',
        fontSize: '0.82rem',
        boxShadow: '0 4px 14px rgba(0,0,0,0.5)'
      }}>
        <Compass size={16} className="text-primary-light" color="#38bdf8" />
        <span>
          <strong>3D 360° ORBIT:</strong> Drag with mouse or swipe finger to rotate all sides
        </span>
      </div>

      {/* Top Right Controls (Auto-Rotate & Lighting) */}
      <div style={{
        position: 'absolute',
        top: '14px',
        right: '14px',
        display: 'flex',
        gap: '8px',
        zIndex: 10
      }}>
        <button
          onClick={() => setIsAutoRotate(!isAutoRotate)}
          className="btn btn-sm"
          style={{
            background: isAutoRotate ? 'var(--primary)' : 'rgba(15, 23, 42, 0.85)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            color: '#fff',
            fontSize: '0.78rem',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '5px 12px',
            backdropFilter: 'blur(6px)'
          }}
          title="Toggle continuous 360° rotation"
        >
          {isAutoRotate ? <Pause size={13} /> : <Play size={13} />}
          {isAutoRotate ? '360° Auto-Rotate ON' : 'Auto-Rotate OFF'}
        </button>

        {isExterior && (
          <div style={{ display: 'flex', background: 'rgba(15, 23, 42, 0.88)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: 'var(--radius-sm)', padding: '2px' }}>
            <button
              onClick={() => setActiveLighting('Daylight')}
              style={{
                background: activeLighting === 'Daylight' ? '#0284c7' : 'transparent',
                border: 'none',
                color: '#fff',
                padding: '4px 8px',
                borderRadius: '4px',
                fontSize: '0.75rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              <Sun size={12} /> Day
            </button>
            <button
              onClick={() => setActiveLighting('Twilight Accent')}
              style={{
                background: activeLighting.includes('Twilight') ? '#d97706' : 'transparent',
                border: 'none',
                color: '#fff',
                padding: '4px 8px',
                borderRadius: '4px',
                fontSize: '0.75rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              <Moon size={12} /> Dusk
            </button>
          </div>
        )}
      </div>

      {/* Bottom Floating Camera Angle Presets Strip */}
      <div style={{
        position: 'absolute',
        bottom: '14px',
        left: '50%',
        transform: 'translateX(-50%)',
        background: 'rgba(15, 23, 42, 0.92)',
        backdropFilter: 'blur(8px)',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        borderRadius: '999px',
        padding: '5px 12px',
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        boxShadow: '0 6px 22px rgba(0, 0, 0, 0.65)',
        flexWrap: 'nowrap',
        overflowX: 'auto',
        maxWidth: '94%'
      }}>
        <span style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 700, paddingLeft: '6px', textTransform: 'uppercase' }}>
          VIEWS:
        </span>
        <button
          onClick={() => setCameraPreset('front')}
          className="btn btn-outline btn-sm"
          style={{ fontSize: '0.72rem', padding: '3px 10px', borderRadius: '999px' }}
        >
          Front (0°)
        </button>
        <button
          onClick={() => setCameraPreset('corner')}
          className="btn btn-outline btn-sm"
          style={{ fontSize: '0.72rem', padding: '3px 10px', borderRadius: '999px' }}
        >
          3D Corner (45°)
        </button>
        {isExterior ? (
          <>
            <button
              onClick={() => setCameraPreset('left')}
              className="btn btn-outline btn-sm"
              style={{ fontSize: '0.72rem', padding: '3px 10px', borderRadius: '999px' }}
            >
              Left (90°)
            </button>
            <button
              onClick={() => setCameraPreset('right')}
              className="btn btn-outline btn-sm"
              style={{ fontSize: '0.72rem', padding: '3px 10px', borderRadius: '999px' }}
            >
              Right (270°)
            </button>
            <button
              onClick={() => setCameraPreset('rear')}
              className="btn btn-outline btn-sm"
              style={{ fontSize: '0.72rem', padding: '3px 10px', borderRadius: '999px' }}
            >
              Rear (180°)
            </button>
            <button
              onClick={() => setCameraPreset('top')}
              className="btn btn-outline btn-sm"
              style={{ fontSize: '0.72rem', padding: '3px 10px', borderRadius: '999px' }}
            >
              Aerial / Drone
            </button>
          </>
        ) : (
          <>
            <button
              onClick={() => setCameraPreset('rear')}
              className="btn btn-outline btn-sm"
              style={{ fontSize: '0.72rem', padding: '3px 10px', borderRadius: '999px' }}
            >
              Opposite Side
            </button>
            <button
              onClick={() => setCameraPreset('top')}
              className="btn btn-outline btn-sm"
              style={{ fontSize: '0.72rem', padding: '3px 10px', borderRadius: '999px' }}
            >
              Ceiling / Plan
            </button>
          </>
        )}
        <button
          onClick={() => {
            setCameraPreset('corner');
            setIsAutoRotate(true);
          }}
          className="btn btn-outline btn-sm"
          style={{ fontSize: '0.72rem', padding: '3px 8px', borderRadius: '999px', color: '#38bdf8' }}
          title="Reset View"
        >
          <RotateCcw size={12} />
        </button>
      </div>
    </div>
  );
}

// =========================================================================
// ARCHITECTURAL HELPERS (Realistic Windows, Doors, Balconies & Foliage)
// =========================================================================

// Realistic Window Generator with Frame, Panes, Cross Mullions & Sill
function createArchitecturalWindow({
  width = 2.0,
  height = 1.6,
  frameColor = 0x0f172a,
  glassColor = 0x38bdf8,
  hasMullions = true,
  isLit = true,
  cols = 2,
  rows = 2
}) {
  const winGroup = new THREE.Group();
  const frameThickness = 0.08;
  const frameDepth = 0.12;

  const frameMat = new THREE.MeshStandardMaterial({
    color: frameColor,
    roughness: 0.35,
    metalness: 0.7
  });

  const glassMat = new THREE.MeshStandardMaterial({
    color: glassColor,
    roughness: 0.05,
    metalness: 0.85,
    transparent: true,
    opacity: 0.72,
    emissive: isLit ? 0xfef08a : 0x000000,
    emissiveIntensity: isLit ? 0.25 : 0.0
  });

  // Window Glass Pane
  const glass = new THREE.Mesh(new THREE.BoxGeometry(width - frameThickness, height - frameThickness, 0.03), glassMat);
  winGroup.add(glass);

  // Outer Window Frame
  // Top & Bottom Rails
  const topRail = new THREE.Mesh(new THREE.BoxGeometry(width, frameThickness, frameDepth), frameMat);
  topRail.position.y = height / 2 - frameThickness / 2;
  const btmRail = new THREE.Mesh(new THREE.BoxGeometry(width, frameThickness, frameDepth), frameMat);
  btmRail.position.y = -height / 2 + frameThickness / 2;

  // Left & Right Stiles
  const leftStile = new THREE.Mesh(new THREE.BoxGeometry(frameThickness, height, frameDepth), frameMat);
  leftStile.position.x = -width / 2 + frameThickness / 2;
  const rightStile = new THREE.Mesh(new THREE.BoxGeometry(frameThickness, height, frameDepth), frameMat);
  rightStile.position.x = width / 2 - frameThickness / 2;

  winGroup.add(topRail, btmRail, leftStile, rightStile);

  // Protruding Architectural Window Sill
  const sillMat = new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.6 });
  const sill = new THREE.Mesh(new THREE.BoxGeometry(width + 0.2, 0.07, frameDepth + 0.1), sillMat);
  sill.position.set(0, -height / 2 - 0.035, 0.04);
  winGroup.add(sill);

  // Internal Mullions (Grids)
  if (hasMullions) {
    const mullionMat = new THREE.MeshStandardMaterial({ color: frameColor, roughness: 0.4, metalness: 0.6 });
    if (cols > 1) {
      const vMullion = new THREE.Mesh(new THREE.BoxGeometry(0.04, height - frameThickness, frameDepth * 0.8), mullionMat);
      winGroup.add(vMullion);
    }
    if (rows > 1) {
      const hMullion = new THREE.Mesh(new THREE.BoxGeometry(width - frameThickness, 0.04, frameDepth * 0.8), mullionMat);
      winGroup.add(hMullion);
    }
  }

  return winGroup;
}

// Realistic Grand Entrance Door Generator
function createGrandMainDoor({
  width = 1.8,
  height = 2.6,
  woodColor = 0x854d0e,
  frameColor = 0x0f172a
}) {
  const doorGroup = new THREE.Group();

  const frameMat = new THREE.MeshStandardMaterial({ color: frameColor, roughness: 0.35, metalness: 0.7 });
  const woodMat = new THREE.MeshStandardMaterial({ color: woodColor, roughness: 0.45, metalness: 0.1 });
  const handleMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b, metalness: 0.9, roughness: 0.2 });

  // Outer Door Frame
  const frameT = 0.1;
  const frameD = 0.16;
  const topF = new THREE.Mesh(new THREE.BoxGeometry(width + frameT * 2, frameT, frameD), frameMat);
  topF.position.y = height / 2 + frameT / 2;
  const leftF = new THREE.Mesh(new THREE.BoxGeometry(frameT, height, frameD), frameMat);
  leftF.position.x = -width / 2 - frameT / 2;
  const rightF = new THREE.Mesh(new THREE.BoxGeometry(frameT, height, frameD), frameMat);
  rightF.position.x = width / 2 + frameT / 2;
  doorGroup.add(topF, leftF, rightF);

  // Solid Teak Wood Door Leaf
  const doorLeaf = new THREE.Mesh(new THREE.BoxGeometry(width, height, 0.08), woodMat);
  doorGroup.add(doorLeaf);

  // Modern Architectural Grooves (Horizontal Slits)
  const grooveMat = new THREE.MeshStandardMaterial({ color: 0x451a03, roughness: 0.6 });
  for (let g = -0.9; g <= 0.9; g += 0.45) {
    const groove = new THREE.Mesh(new THREE.BoxGeometry(width * 0.9, 0.02, 0.09), grooveMat);
    groove.position.y = g;
    doorGroup.add(groove);
  }

  // Vertical Architectural Stainless Steel / Brass Long Bar Handle
  const handle = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 1.3, 16), handleMat);
  handle.position.set(width / 2 - 0.25, 0, 0.08);
  const handleMount1 = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 0.06, 12), handleMat);
  handleMount1.rotation.x = Math.PI / 2;
  handleMount1.position.set(width / 2 - 0.25, 0.5, 0.05);
  const handleMount2 = handleMount1.clone();
  handleMount2.position.set(width / 2 - 0.25, -0.5, 0.05);
  doorGroup.add(handle, handleMount1, handleMount2);

  // Transom Glass Panel Above Door
  const transomGlass = new THREE.Mesh(
    new THREE.BoxGeometry(width, 0.5, 0.04),
    new THREE.MeshStandardMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.7, emissive: 0xfef08a, emissiveIntensity: 0.3 })
  );
  transomGlass.position.y = height / 2 + frameT + 0.25;
  const transomFrame = new THREE.Mesh(new THREE.BoxGeometry(width + frameT * 2, 0.06, frameD), frameMat);
  transomFrame.position.y = height / 2 + frameT + 0.5;
  doorGroup.add(transomGlass, transomFrame);

  // Entrance Step Plinth with Granite Risers
  const step1 = new THREE.Mesh(new THREE.BoxGeometry(width + 0.8, 0.18, 0.8), new THREE.MeshStandardMaterial({ color: 0xe2e8f0, roughness: 0.5 }));
  step1.position.set(0, -height / 2 - 0.09, 0.4);
  const step2 = new THREE.Mesh(new THREE.BoxGeometry(width + 1.2, 0.18, 1.4), new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.7 }));
  step2.position.set(0, -height / 2 - 0.27, 0.7);
  doorGroup.add(step1, step2);

  return doorGroup;
}

// Realistic Balcony Sliding Glass Door
function createBalconySliderDoor({
  width = 2.6,
  height = 2.4,
  frameColor = 0x0f172a
}) {
  const sliderGroup = new THREE.Group();
  const frameMat = new THREE.MeshStandardMaterial({ color: frameColor, roughness: 0.35, metalness: 0.8 });
  const glassMat = new THREE.MeshStandardMaterial({
    color: 0x38bdf8,
    roughness: 0.05,
    metalness: 0.85,
    transparent: true,
    opacity: 0.7,
    emissive: 0xfde047,
    emissiveIntensity: 0.2
  });

  // Outer Box Frame
  const fT = 0.06;
  const fD = 0.1;
  const top = new THREE.Mesh(new THREE.BoxGeometry(width, fT, fD), frameMat);
  top.position.y = height / 2 - fT / 2;
  const btm = new THREE.Mesh(new THREE.BoxGeometry(width, fT, fD), frameMat);
  btm.position.y = -height / 2 + fT / 2;
  const l = new THREE.Mesh(new THREE.BoxGeometry(fT, height, fD), frameMat);
  l.position.x = -width / 2 + fT / 2;
  const r = new THREE.Mesh(new THREE.BoxGeometry(fT, height, fD), frameMat);
  r.position.x = width / 2 - fT / 2;
  sliderGroup.add(top, btm, l, r);

  // Left & Right Glass Panels with Center Overlap Stile
  const paneW = (width - fT * 3) / 2;
  const glassL = new THREE.Mesh(new THREE.BoxGeometry(paneW, height - fT * 2, 0.03), glassMat);
  glassL.position.x = -paneW / 2 - 0.01;
  const glassR = new THREE.Mesh(new THREE.BoxGeometry(paneW, height - fT * 2, 0.03), glassMat);
  glassR.position.x = paneW / 2 + 0.01;

  const centerStile = new THREE.Mesh(new THREE.BoxGeometry(fT * 1.2, height - fT * 2, fD * 0.9), frameMat);
  sliderGroup.add(glassL, glassR, centerStile);

  // Vertical Handle on active slider
  const handle = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.4, 0.04), new THREE.MeshStandardMaterial({ color: 0xf59e0b, metalness: 0.9 }));
  handle.position.set(0.12, 0, 0.04);
  sliderGroup.add(handle);

  return sliderGroup;
}

// Realistic Balcony with Slab, Decking, Glass Railing & Handrail
function createBalconyBalustrade({
  width = 5.6,
  depth = 1.8,
  floorY = 3.2,
  handrailColor = 0x0f172a,
  deckColor = 0xa16207
}) {
  const balconyGroup = new THREE.Group();

  // Cantilevered Reinforced Slab
  const slabMat = new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.7 });
  const slab = new THREE.Mesh(new THREE.BoxGeometry(width, 0.25, depth), slabMat);
  slab.position.set(0, floorY - 0.125, depth / 2);
  slab.castShadow = true;
  slab.receiveShadow = true;
  balconyGroup.add(slab);

  // Teak Wood Balcony Floor Decking
  const deck = new THREE.Mesh(new THREE.BoxGeometry(width - 0.1, 0.04, depth - 0.1), new THREE.MeshStandardMaterial({ color: deckColor, roughness: 0.6 }));
  deck.position.set(0, floorY + 0.02, depth / 2);
  balconyGroup.add(deck);

  // Tempered Glass Balustrade (Front)
  const glassMat = new THREE.MeshStandardMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.45, roughness: 0.05, metalness: 0.9 });
  const frontGlass = new THREE.Mesh(new THREE.BoxGeometry(width, 1.05, 0.04), glassMat);
  frontGlass.position.set(0, floorY + 0.55, depth);
  balconyGroup.add(frontGlass);

  // Left & Right Glass Balustrades
  const sideGlassL = new THREE.Mesh(new THREE.BoxGeometry(0.04, 1.05, depth), glassMat);
  sideGlassL.position.set(-width / 2, floorY + 0.55, depth / 2);
  const sideGlassR = new THREE.Mesh(new THREE.BoxGeometry(0.04, 1.05, depth), glassMat);
  sideGlassR.position.set(width / 2, floorY + 0.55, depth / 2);
  balconyGroup.add(sideGlassL, sideGlassR);

  // Architectural Top Handrail (Continuous Stainless Steel / Dark Aluminum)
  const railMat = new THREE.MeshStandardMaterial({ color: handrailColor, metalness: 0.85, roughness: 0.25 });
  const frontRail = new THREE.Mesh(new THREE.BoxGeometry(width + 0.08, 0.06, 0.08), railMat);
  frontRail.position.set(0, floorY + 1.08, depth);
  const sideRailL = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.06, depth + 0.04), railMat);
  sideRailL.position.set(-width / 2, floorY + 1.08, depth / 2);
  const sideRailR = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.06, depth + 0.04), railMat);
  sideRailR.position.set(width / 2, floorY + 1.08, depth / 2);
  balconyGroup.add(frontRail, sideRailL, sideRailR);

  return balconyGroup;
}

// Foliage & Planter Box
function createPlanterBox({ width = 3.0, height = 0.6, depth = 0.8 }) {
  const pGroup = new THREE.Group();
  const planterMat = new THREE.MeshStandardMaterial({ color: 0x475569, roughness: 0.8 });
  const foliageMat1 = new THREE.MeshStandardMaterial({ color: 0x15803d, roughness: 0.9 });
  const foliageMat2 = new THREE.MeshStandardMaterial({ color: 0x22c55e, roughness: 0.85 });

  const box = new THREE.Mesh(new THREE.BoxGeometry(width, height, depth), planterMat);
  box.castShadow = true;
  pGroup.add(box);

  // Lush Green Foliage Clusters
  const numBushes = Math.floor(width / 0.5);
  for (let i = 0; i < numBushes; i++) {
    const x = -width / 2 + 0.25 + i * 0.5;
    const r = 0.28 + (i % 2) * 0.06;
    const bush = new THREE.Mesh(new THREE.SphereGeometry(r, 10, 10), (i % 2 === 0) ? foliageMat1 : foliageMat2);
    bush.position.set(x, height / 2 + r * 0.7, 0);
    pGroup.add(bush);
  }
  return pGroup;
}

// Wall-mounted Modern Cylinder Sconce Lights
function createSconceLight() {
  const sGroup = new THREE.Group();
  const metalMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, metalness: 0.9, roughness: 0.2 });
  const lightMat = new THREE.MeshStandardMaterial({ color: 0xfef08a, emissive: 0xf59e0b, emissiveIntensity: 1.5 });

  const body = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.28, 16), metalMat);
  const glowTop = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.045, 0.04, 16), lightMat);
  glowTop.position.y = 0.15;
  const glowBtm = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.045, 0.04, 16), lightMat);
  glowBtm.position.y = -0.15;

  sGroup.add(body, glowTop, glowBtm);
  return sGroup;
}

// =========================================================================
// 3D REALISTIC EXTERIOR SCENE (Full G+3 Multi-Floor Scaling, Doors & Windows)
// =========================================================================
function buildRealisticExteriorScene(scene, style, numFloors, lighting) {
  const isTwilight = lighting.includes('Twilight');
  const bldgGroup = new THREE.Group();

  // 1. Ground Landscape & Site Works
  const groundMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.85 });
  const ground = new THREE.Mesh(new THREE.BoxGeometry(38, 0.4, 38), groundMat);
  ground.position.y = -0.2;
  ground.receiveShadow = true;
  scene.add(ground);

  // Manicured Grass Lawn
  const grassMat = new THREE.MeshStandardMaterial({ color: 0x15803d, roughness: 0.9 });
  const grass = new THREE.Mesh(new THREE.BoxGeometry(32, 0.45, 14), grassMat);
  grass.position.set(0, -0.17, 9);
  grass.receiveShadow = true;
  scene.add(grass);

  // Paved Driveway with Concrete Paver Curb
  const drivewayMat = new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.65 });
  const driveway = new THREE.Mesh(new THREE.BoxGeometry(7, 0.48, 16), drivewayMat);
  driveway.position.set(-6.5, -0.15, 8);
  driveway.receiveShadow = true;
  scene.add(driveway);

  // Pedestrian Walkway to Main Door
  const walkwayMat = new THREE.MeshStandardMaterial({ color: 0x64748b, roughness: 0.5 });
  const walkway = new THREE.Mesh(new THREE.BoxGeometry(3.2, 0.49, 10), walkwayMat);
  walkway.position.set(-0.2, -0.14, 8);
  walkway.receiveShadow = true;
  scene.add(walkway);

  // Front Planter Boxes
  const planterL = createPlanterBox({ width: 4.5, height: 0.55, depth: 0.8 });
  planterL.position.set(5.5, 0.28, 6.2);
  scene.add(planterL);

  // 2. Modern SUV in Carport
  const carMat = new THREE.MeshStandardMaterial({ color: 0x0284c7, metalness: 0.85, roughness: 0.2 });
  const wheelMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.95 });
  const rimMat = new THREE.MeshStandardMaterial({ color: 0xe2e8f0, metalness: 0.9, roughness: 0.1 });
  const glassCarMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.1, metalness: 0.9 });

  const carGroup = new THREE.Group();
  const carBody = new THREE.Mesh(new THREE.BoxGeometry(2.3, 1.0, 4.6), carMat);
  carBody.position.y = 0.8;
  carBody.castShadow = true;

  const carCabin = new THREE.Mesh(new THREE.BoxGeometry(2.0, 0.8, 2.6), glassCarMat);
  carCabin.position.set(0, 1.6, -0.2);
  carCabin.castShadow = true;

  // Headlights
  const headlightMat = new THREE.MeshStandardMaterial({ color: 0xfef08a, emissive: 0xfef08a, emissiveIntensity: isTwilight ? 1.8 : 0.8 });
  const hlLeft = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.18, 0.05), headlightMat);
  hlLeft.position.set(-0.8, 0.85, 2.31);
  const hlRight = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.18, 0.05), headlightMat);
  hlRight.position.set(0.8, 0.85, 2.31);

  // 4 Wheels
  [[-1.2, 0.38, 1.4], [1.2, 0.38, 1.4], [-1.2, 0.38, -1.4], [1.2, 0.38, -1.4]].forEach(([wx, wy, wz]) => {
    const tire = new THREE.Mesh(new THREE.CylinderGeometry(0.38, 0.38, 0.28, 20), wheelMat);
    tire.rotation.z = Math.PI / 2;
    tire.position.set(wx, wy, wz);
    const rim = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.24, 0.29, 16), rimMat);
    rim.rotation.z = Math.PI / 2;
    rim.position.set(wx, wy, wz);
    carGroup.add(tire, rim);
  });
  carGroup.add(carBody, carCabin, hlLeft, hlRight);
  carGroup.position.set(-6.5, 0, 4.8);
  bldgGroup.add(carGroup);

  // -------------------------------------------------------------
  // ARCHITECTURAL STYLES WITH REAL DOORS & WINDOWS (GROUND TO G+3)
  // -------------------------------------------------------------
  const floorH = 3.2;

  if (style === 'Traditional') {
    // ================= TRADITIONAL ELEVATION =================
    const wallColor = 0xfef3c7; // Sand/lime plaster
    const roofColor = 0x9a3412; // Terracotta Mangalore tiles
    const timberColor = 0x78350f; // Carved teakwood

    const wallMat = new THREE.MeshStandardMaterial({ color: wallColor, roughness: 0.8 });
    const roofMat = new THREE.MeshStandardMaterial({ color: roofColor, roughness: 0.65, metalness: 0.1 });
    const timberMat = new THREE.MeshStandardMaterial({ color: timberColor, roughness: 0.55 });

    // Raised Plinth (Thinnai)
    const plinth = new THREE.Mesh(new THREE.BoxGeometry(14.5, 0.8, 12), timberMat);
    plinth.position.y = 0.4;
    plinth.receiveShadow = true;
    bldgGroup.add(plinth);

    // Multi-Floor Stack
    for (let f = 0; f < numFloors; f++) {
      const fy = 0.8 + f * floorH;
      const w = 13.5 - f * 0.8;
      const d = 10.5 - f * 0.5;

      const floorWalls = new THREE.Mesh(new THREE.BoxGeometry(w, floorH, d), wallMat);
      floorWalls.position.set(0, fy + floorH / 2, 0);
      floorWalls.castShadow = true;
      floorWalls.receiveShadow = true;
      bldgGroup.add(floorWalls);

      if (f === 0) {
        // Ground Floor Carved Teakwood Main Door
        const mainDoor = createGrandMainDoor({ width: 1.8, height: 2.6, woodColor: timberColor, frameColor: 0x451a03 });
        mainDoor.position.set(-0.2, fy + 1.3, d / 2 + 0.05);
        bldgGroup.add(mainDoor);

        // Verandah Carved Columns (4 columns)
        [-5.2, -2.2, 2.2, 5.2].forEach((cx) => {
          const col = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.25, floorH, 16), timberMat);
          col.position.set(cx, fy + floorH / 2, d / 2 + 1.8);
          col.castShadow = true;
          bldgGroup.add(col);
        });

        // Verandah Sloped Eaves Roof
        const vRoof = new THREE.Mesh(new THREE.ConeGeometry(w + 3.2, 1.8, 4), roofMat);
        vRoof.position.set(0, fy + floorH + 0.8, 1.2);
        vRoof.rotation.y = Math.PI / 4;
        vRoof.castShadow = true;
        bldgGroup.add(vRoof);

        // Ground Floor Arched Mullioned Windows (Front, Sides, Rear)
        const winFrontR = createArchitecturalWindow({ width: 2.2, height: 1.7, frameColor: timberColor, cols: 2, rows: 3 });
        winFrontR.position.set(3.8, fy + 1.6, d / 2 + 0.05);
        bldgGroup.add(winFrontR);

        const winLeft = createArchitecturalWindow({ width: 2.0, height: 1.6, frameColor: timberColor });
        winLeft.rotation.y = -Math.PI / 2;
        winLeft.position.set(-w / 2 - 0.05, fy + 1.6, 0);
        const winRight = winLeft.clone();
        winRight.rotation.y = Math.PI / 2;
        winRight.position.set(w / 2 + 0.05, fy + 1.6, 0);
        bldgGroup.add(winLeft, winRight);
      } else {
        // Upper Floor Traditional Balcony & Windows
        const balc = createBalconyBalustrade({ width: 5.5, depth: 1.6, floorY: fy, handrailColor: timberColor, deckColor: timberColor });
        bldgGroup.add(balc);

        // Balcony Double Shutter Door
        const balcDoor = createBalconySliderDoor({ width: 2.4, height: 2.4, frameColor: timberColor });
        balcDoor.position.set(0, fy + 1.2, d / 2 + 0.05);
        bldgGroup.add(balcDoor);

        // Front Upper Windows
        const upWinL = createArchitecturalWindow({ width: 1.8, height: 1.6, frameColor: timberColor });
        upWinL.position.set(-4.0, fy + 1.6, d / 2 + 0.05);
        const upWinR = createArchitecturalWindow({ width: 1.8, height: 1.6, frameColor: timberColor });
        upWinR.position.set(4.0, fy + 1.6, d / 2 + 0.05);
        bldgGroup.add(upWinL, upWinR);

        // Side & Rear Windows for 360° completeness
        const sideWinL = createArchitecturalWindow({ width: 1.8, height: 1.5, frameColor: timberColor });
        sideWinL.rotation.y = -Math.PI / 2;
        sideWinL.position.set(-w / 2 - 0.05, fy + 1.6, 1.2);
        const sideWinR = createArchitecturalWindow({ width: 1.8, height: 1.5, frameColor: timberColor });
        sideWinR.rotation.y = Math.PI / 2;
        sideWinR.position.set(w / 2 + 0.05, fy + 1.6, 1.2);
        const rearWin = createArchitecturalWindow({ width: 2.2, height: 1.6, frameColor: timberColor });
        rearWin.rotation.y = Math.PI;
        rearWin.position.set(0, fy + 1.6, -d / 2 - 0.05);
        bldgGroup.add(sideWinL, sideWinR, rearWin);
      }
    }

    // Top Terracotta Mangalore Roof with Brass Kalasam Finial
    const topY = 0.8 + numFloors * floorH;
    const topRoof = new THREE.Mesh(new THREE.ConeGeometry(13.5, 3.4, 4), roofMat);
    topRoof.position.set(0, topY + 1.7, 0);
    topRoof.rotation.y = Math.PI / 4;
    topRoof.castShadow = true;
    bldgGroup.add(topRoof);

    // Brass Kalasam Finial
    const finial = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.25, 0.9, 16), new THREE.MeshStandardMaterial({ color: 0xeab308, metalness: 0.9, roughness: 0.2 }));
    finial.position.set(0, topY + 3.8, 0);
    bldgGroup.add(finial);

    // Ceremonial Brass Kuthuvilakku Lamp in Courtyard
    const lampMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b, metalness: 0.9, roughness: 0.25 });
    const lampBase = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.45, 0.25, 16), lampMat);
    const lampStem = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.1, 1.8, 16), lampMat);
    lampStem.position.y = 0.9;
    const lampCrown = new THREE.Mesh(new THREE.SphereGeometry(0.28, 16, 16), lampMat);
    lampCrown.position.y = 1.9;
    const lampGroup = new THREE.Group();
    lampGroup.add(lampBase, lampStem, lampCrown);
    lampGroup.position.set(2.4, 0, 7.8);
    bldgGroup.add(lampGroup);

  } else if (style === 'Minimalist') {
    // ================= MINIMALIST MONOLITHIC ELEVATION =================
    const whiteMat = new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.35 });
    const concreteMat = new THREE.MeshStandardMaterial({ color: 0x64748b, roughness: 0.9 });
    const darkFrame = 0x0f172a;

    for (let f = 0; f < numFloors; f++) {
      const fy = f * floorH;
      const isAlt = f % 2 === 1;

      // Main Intersecting Volumes
      const cube1 = new THREE.Mesh(new THREE.BoxGeometry(8.5, floorH, 9.5), whiteMat);
      cube1.position.set(isAlt ? -1.5 : 1.5, fy + floorH / 2, 0);
      cube1.castShadow = true;
      cube1.receiveShadow = true;

      const cube2 = new THREE.Mesh(new THREE.BoxGeometry(5.5, floorH, 10.5), concreteMat);
      cube2.position.set(isAlt ? 3.5 : -3.5, fy + floorH / 2, 0.4);
      cube2.castShadow = true;
      cube2.receiveShadow = true;
      bldgGroup.add(cube1, cube2);

      if (f === 0) {
        // Ground Floor Recessed Frameless Pivot Door
        const mainDoor = createGrandMainDoor({ width: 1.7, height: 2.6, woodColor: 0x1e293b, frameColor: darkFrame });
        mainDoor.position.set(-0.5, 1.3, 5.3);
        bldgGroup.add(mainDoor);

        // Floor-to-Ceiling Flush Ribbon Glass
        const win1 = createArchitecturalWindow({ width: 4.8, height: 2.4, frameColor: darkFrame, hasMullions: false });
        win1.position.set(2.8, 1.4, 4.8);
        bldgGroup.add(win1);
      } else {
        // Upper Balconies & Ribbon Windows
        const balc = createBalconyBalustrade({ width: 4.8, depth: 1.6, floorY: fy, handrailColor: darkFrame });
        balc.position.set(isAlt ? -1.5 : 1.5, 0, 4.8);
        bldgGroup.add(balc);

        const slider = createBalconySliderDoor({ width: 2.6, height: 2.4, frameColor: darkFrame });
        slider.position.set(isAlt ? -1.5 : 1.5, fy + 1.2, 4.8);
        bldgGroup.add(slider);

        // Side Windows for 360°
        const sideWinL = createArchitecturalWindow({ width: 2.4, height: 1.8, frameColor: darkFrame });
        sideWinL.rotation.y = -Math.PI / 2;
        sideWinL.position.set(-6.3, fy + 1.6, 0);
        const sideWinR = createArchitecturalWindow({ width: 2.4, height: 1.8, frameColor: darkFrame });
        sideWinR.rotation.y = Math.PI / 2;
        sideWinR.position.set(6.3, fy + 1.6, 0);
        bldgGroup.add(sideWinL, sideWinR);
      }
    }

    // Rooftop Parapet
    const topY = numFloors * floorH;
    const parapet = new THREE.Mesh(new THREE.BoxGeometry(13.2, 0.9, 10.2), whiteMat);
    parapet.position.set(0, topY + 0.45, 0);
    bldgGroup.add(parapet);

  } else if (style === 'Contemporary') {
    // ================= CONTEMPORARY ELEVATION (Slate Stone & Mono-Pitch) =================
    const stuccoMat = new THREE.MeshStandardMaterial({ color: 0xf1f5f9, roughness: 0.5 });
    const stoneMat = new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.95 });
    const darkFrame = 0x0f172a;
    const woodMat = new THREE.MeshStandardMaterial({ color: 0x9a3412, roughness: 0.6 });

    // Double-Height Slate Stone Tower
    const totalBldgH = numFloors * floorH;
    const stoneTower = new THREE.Mesh(new THREE.BoxGeometry(3.8, totalBldgH + 1.2, 6.5), stoneMat);
    stoneTower.position.set(4.8, (totalBldgH + 1.2) / 2, 2.0);
    stoneTower.castShadow = true;
    bldgGroup.add(stoneTower);

    // Floor-by-Floor Construction
    for (let f = 0; f < numFloors; f++) {
      const fy = f * floorH;

      const coreWalls = new THREE.Mesh(new THREE.BoxGeometry(10.5, floorH, 9.5), stuccoMat);
      coreWalls.position.set(-1.8, fy + floorH / 2, 0);
      coreWalls.castShadow = true;
      bldgGroup.add(coreWalls);

      if (f === 0) {
        // Ground Floor Main Door
        const mainDoor = createGrandMainDoor({ width: 1.8, height: 2.6, woodColor: 0x78350f, frameColor: darkFrame });
        mainDoor.position.set(0.2, 1.3, 4.8);
        bldgGroup.add(mainDoor);

        // Ground Floor Windows
        const gWin = createArchitecturalWindow({ width: 3.6, height: 2.2, frameColor: darkFrame, cols: 3, rows: 2 });
        gWin.position.set(-3.6, 1.5, 4.8);
        bldgGroup.add(gWin);
      } else {
        // Balcony & Sliding Glass Doors
        const balc = createBalconyBalustrade({ width: 5.2, depth: 1.8, floorY: fy, handrailColor: darkFrame });
        balc.position.set(-2.0, 0, 4.8);
        bldgGroup.add(balc);

        const slider = createBalconySliderDoor({ width: 2.8, height: 2.4, frameColor: darkFrame });
        slider.position.set(-2.0, fy + 1.2, 4.8);
        bldgGroup.add(slider);

        // Stone Tower Slit Windows
        const slitWin = createArchitecturalWindow({ width: 0.8, height: 1.8, frameColor: darkFrame, hasMullions: false });
        slitWin.position.set(4.8, fy + 1.6, 5.3);
        bldgGroup.add(slitWin);

        // Side Windows
        const sideWin = createArchitecturalWindow({ width: 2.2, height: 1.6, frameColor: darkFrame });
        sideWin.rotation.y = -Math.PI / 2;
        sideWin.position.set(-7.1, fy + 1.6, 0);
        bldgGroup.add(sideWin);
      }
    }

    // Dynamic Angled Mono-Pitch Roof Line
    const roof = new THREE.Mesh(new THREE.BoxGeometry(14.5, 0.45, 11.5), new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.3, metalness: 0.8 }));
    roof.position.set(-1.0, totalBldgH + 0.8, 0);
    roof.rotation.z = -0.09; // Angled slope
    roof.castShadow = true;
    bldgGroup.add(roof);

    // Rooftop Steel & Wood Pergola
    for (let p = 0; p < 7; p++) {
      const slat = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.25, 5.2), woodMat);
      slat.position.set(-5.5 + p * 0.9, totalBldgH + 0.6, 2.5);
      bldgGroup.add(slat);
    }

  } else if (style === 'Luxury') {
    // ================= LUXURY NEOCLASSICAL ELEVATION =================
    const marbleMat = new THREE.MeshStandardMaterial({ color: 0xfef9c3, roughness: 0.35, metalness: 0.1 });
    const trimMat = new THREE.MeshStandardMaterial({ color: 0xfffbeb, roughness: 0.4 });
    const roofTileMat = new THREE.MeshStandardMaterial({ color: 0x475569, roughness: 0.6 });
    const darkBronze = 0x1e293b;

    for (let f = 0; f < numFloors; f++) {
      const fy = f * floorH;
      const w = 14.5;
      const d = 10.5;

      const floorMain = new THREE.Mesh(new THREE.BoxGeometry(w, floorH, d), marbleMat);
      floorMain.position.set(0, fy + floorH / 2, 0);
      floorMain.castShadow = true;
      bldgGroup.add(floorMain);

      if (f === 0) {
        // Grand Entrance Double Door
        const mainDoor = createGrandMainDoor({ width: 2.0, height: 2.8, woodColor: 0x451a03, frameColor: 0x78350f });
        mainDoor.position.set(0, 1.4, d / 2 + 0.05);
        bldgGroup.add(mainDoor);

        // 4 Monumental Corinthian Portico Columns
        [-3.6, -1.2, 1.2, 3.6].forEach((cx) => {
          const col = new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.3, floorH * (numFloors >= 2 ? 2 : 1), 24), trimMat);
          col.position.set(cx, (floorH * (numFloors >= 2 ? 2 : 1)) / 2, d / 2 + 2.4);
          col.castShadow = true;
          bldgGroup.add(col);
        });

        // Portico Pediment Triangle
        const pediment = new THREE.Mesh(new THREE.ConeGeometry(5.2, 1.9, 4), trimMat);
        pediment.position.set(0, floorH * (numFloors >= 2 ? 2 : 1) + 0.95, d / 2 + 2.4);
        pediment.rotation.y = Math.PI / 4;
        pediment.castShadow = true;
        bldgGroup.add(pediment);

        // Symmetrical Arched Windows
        [-5.2, 5.2].forEach((wx) => {
          const win = createArchitecturalWindow({ width: 2.2, height: 2.0, frameColor: darkBronze, cols: 2, rows: 3 });
          win.position.set(wx, 1.6, d / 2 + 0.05);
          bldgGroup.add(win);
        });
      } else {
        // Upper Windows with Classical Keystones & Sills
        [-5.2, 0, 5.2].forEach((wx) => {
          if (wx === 0) {
            // French Balcony Door
            const frenchDoor = createBalconySliderDoor({ width: 2.4, height: 2.4, frameColor: darkBronze });
            frenchDoor.position.set(0, fy + 1.2, d / 2 + 0.05);
            bldgGroup.add(frenchDoor);
          } else {
            const upWin = createArchitecturalWindow({ width: 2.0, height: 1.8, frameColor: darkBronze, cols: 2, rows: 2 });
            upWin.position.set(wx, fy + 1.6, d / 2 + 0.05);
            bldgGroup.add(upWin);
          }
        });

        // Side & Rear Windows for 360° inspection
        const sideWinL = createArchitecturalWindow({ width: 2.0, height: 1.7, frameColor: darkBronze });
        sideWinL.rotation.y = -Math.PI / 2;
        sideWinL.position.set(-w / 2 - 0.05, fy + 1.6, 0);
        const sideWinR = createArchitecturalWindow({ width: 2.0, height: 1.7, frameColor: darkBronze });
        sideWinR.rotation.y = Math.PI / 2;
        sideWinR.position.set(w / 2 + 0.05, fy + 1.6, 0);
        bldgGroup.add(sideWinL, sideWinR);
      }
    }

    // Classical Mansard Roof with Dormer Pediments
    const topY = numFloors * floorH;
    const mansard = new THREE.Mesh(new THREE.BoxGeometry(15.2, 1.6, 11.2), roofTileMat);
    mansard.position.set(0, topY + 0.8, 0);
    mansard.castShadow = true;
    bldgGroup.add(mansard);

    // Circular Illuminated Courtyard Fountain
    const fountainRing = new THREE.Mesh(new THREE.CylinderGeometry(1.8, 2.0, 0.45, 32), trimMat);
    fountainRing.position.set(0, 0.22, 8.5);
    const fountainWater = new THREE.Mesh(new THREE.CylinderGeometry(1.7, 1.7, 0.44, 32), new THREE.MeshStandardMaterial({ color: 0x38bdf8, roughness: 0.1, metalness: 0.9 }));
    fountainWater.position.set(0, 0.23, 8.5);
    bldgGroup.add(fountainRing, fountainWater);

  } else {
    // ================= MODERN ELEVATION (Default: G+3 with Rich Realism) =================
    const whiteStucco = new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.45 });
    const darkAccent = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.65 });
    const woodLouverMat = new THREE.MeshStandardMaterial({ color: 0xb45309, roughness: 0.55 });
    const darkFrame = 0x0f172a;

    // Ground Floor: Main Living Core + Carport + Main Door + Picture Windows
    const gCore = new THREE.Mesh(new THREE.BoxGeometry(13.5, floorH, 10), whiteStucco);
    gCore.position.set(0, floorH / 2, 0);
    gCore.castShadow = true;
    gCore.receiveShadow = true;
    bldgGroup.add(gCore);

    // Ground Floor Main Entrance Door
    const mainDoor = createGrandMainDoor({ width: 1.8, height: 2.6, woodColor: 0x78350f, frameColor: darkFrame });
    mainDoor.position.set(-0.2, 1.3, 5.05);
    bldgGroup.add(mainDoor);

    // Ground Floor Entrance Canopy
    const canopy = new THREE.Mesh(new THREE.BoxGeometry(3.4, 0.18, 2.2), darkAccent);
    canopy.position.set(-0.2, 2.9, 5.8);
    canopy.castShadow = true;
    bldgGroup.add(canopy);

    // Ground Floor Large Picture Windows with Mullions (Front)
    const gWinFront = createArchitecturalWindow({ width: 4.2, height: 2.2, frameColor: darkFrame, cols: 3, rows: 2 });
    gWinFront.position.set(3.8, 1.5, 5.05);
    bldgGroup.add(gWinFront);

    // Ground Floor Carport Canopy & Pillars
    const carportCanopy = new THREE.Mesh(new THREE.BoxGeometry(6.2, 0.22, 6.5), darkAccent);
    carportCanopy.position.set(-5.8, 3.0, 4.5);
    carportCanopy.castShadow = true;
    const cpPillar1 = new THREE.Mesh(new THREE.BoxGeometry(0.2, 3.0, 0.2), darkAccent);
    cpPillar1.position.set(-8.6, 1.5, 7.4);
    const cpPillar2 = new THREE.Mesh(new THREE.BoxGeometry(0.2, 3.0, 0.2), darkAccent);
    cpPillar2.position.set(-3.0, 1.5, 7.4);
    bldgGroup.add(carportCanopy, cpPillar1, cpPillar2);

    // Ground Floor Side & Rear Windows for 360° View
    const gWinLeft = createArchitecturalWindow({ width: 2.4, height: 1.6, frameColor: darkFrame });
    gWinLeft.rotation.y = -Math.PI / 2;
    gWinLeft.position.set(-6.8, 1.6, 0);
    const gWinRight = createArchitecturalWindow({ width: 2.4, height: 1.6, frameColor: darkFrame });
    gWinRight.rotation.y = Math.PI / 2;
    gWinRight.position.set(6.8, 1.6, 0);
    const gWinRear = createArchitecturalWindow({ width: 3.2, height: 1.8, frameColor: darkFrame });
    gWinRear.rotation.y = Math.PI;
    gWinRear.position.set(0, 1.6, -5.05);
    bldgGroup.add(gWinLeft, gWinRight, gWinRear);

    // Sconce Lights on Ground Floor
    const sconce1 = createSconceLight();
    sconce1.position.set(1.2, 2.2, 5.1);
    const sconce2 = createSconceLight();
    sconce2.position.set(-1.6, 2.2, 5.1);
    bldgGroup.add(sconce1, sconce2);

    // Stacking Upper Floors: Floor 1, Floor 2, Floor 3 (G+3)
    for (let f = 1; f < numFloors; f++) {
      const fy = f * floorH;
      const isEven = f % 2 === 0;

      // Cantilever Projection Slab
      const floorSlab = new THREE.Mesh(new THREE.BoxGeometry(14.0, 0.24, 10.8), darkAccent);
      floorSlab.position.set(0, fy - 0.12, 0.4);
      floorSlab.castShadow = true;
      bldgGroup.add(floorSlab);

      // Floor Main Walls (Alternating modern cantilevered boxes)
      const floorBox = new THREE.Mesh(new THREE.BoxGeometry(13.2, floorH, 9.8), isEven ? whiteStucco : darkAccent);
      floorBox.position.set(isEven ? 0.4 : -0.4, fy + floorH / 2, 0.4);
      floorBox.castShadow = true;
      floorBox.receiveShadow = true;
      bldgGroup.add(floorBox);

      // Balcony with Glass Railing & Handrail
      const balcony = createBalconyBalustrade({
        width: 6.2,
        depth: 2.0,
        floorY: fy,
        handrailColor: darkFrame,
        deckColor: 0x9a3412
      });
      balcony.position.set(isEven ? -2.8 : 2.8, 0, 5.3);
      bldgGroup.add(balcony);

      // Balcony Sliding Double Glass Doors
      const balconyDoor = createBalconySliderDoor({ width: 2.8, height: 2.4, frameColor: darkFrame });
      balconyDoor.position.set(isEven ? -2.8 : 2.8, fy + 1.2, 5.32);
      bldgGroup.add(balconyDoor);

      // Floor Windows with Mullions (Front Facade)
      const frontWin = createArchitecturalWindow({
        width: 3.4,
        height: 2.0,
        frameColor: darkFrame,
        cols: 2,
        rows: 2
      });
      frontWin.position.set(isEven ? 3.6 : -3.6, fy + 1.6, 5.32);
      bldgGroup.add(frontWin);

      // Architectural Vertical Timber Louver Screen
      for (let l = 0; l < 9; l++) {
        const louver = new THREE.Mesh(new THREE.BoxGeometry(0.08, 2.8, 0.28), woodLouverMat);
        louver.position.set((isEven ? 2.0 : -4.8) + l * 0.35, fy + 1.6, 5.5);
        louver.castShadow = true;
        bldgGroup.add(louver);
      }

      // Side Windows on Left & Right Flanks (Inspectable via 360° Orbit)
      const sideWinL = createArchitecturalWindow({ width: 2.2, height: 1.6, frameColor: darkFrame });
      sideWinL.rotation.y = -Math.PI / 2;
      sideWinL.position.set(-6.65, fy + 1.6, 0.8);

      const sideWinR = createArchitecturalWindow({ width: 2.2, height: 1.6, frameColor: darkFrame });
      sideWinR.rotation.y = Math.PI / 2;
      sideWinR.position.set(6.65, fy + 1.6, 0.8);

      // Rear Windows on Backyard Facade
      const rearWin = createArchitecturalWindow({ width: 3.0, height: 1.7, frameColor: darkFrame, cols: 2, rows: 2 });
      rearWin.rotation.y = Math.PI;
      rearWin.position.set(0, fy + 1.6, -4.55);

      bldgGroup.add(sideWinL, sideWinR, rearWin);
    }

    // Rooftop Terrace & Pergola (Above Top Floor)
    const topY = numFloors * floorH;
    const roofSlab = new THREE.Mesh(new THREE.BoxGeometry(13.6, 0.25, 10.2), darkAccent);
    roofSlab.position.set(0, topY + 0.125, 0.2);
    bldgGroup.add(roofSlab);

    // Parapet Wall
    const parapetMat = new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.5 });
    const parapet = new THREE.Mesh(new THREE.BoxGeometry(13.6, 1.05, 10.2), parapetMat);
    parapet.position.set(0, topY + 0.65, 0.2);
    bldgGroup.add(parapet);

    // Rooftop Modern Timber & Steel Pergola Trellis
    for (let r = 0; r < 8; r++) {
      const pergolaBeam = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.25, 5.5), woodLouverMat);
      pergolaBeam.position.set(-3.2 + r * 0.9, topY + 2.4, 1.5);
      bldgGroup.add(pergolaBeam);
    }
    const pergolaPost1 = new THREE.Mesh(new THREE.BoxGeometry(0.18, 2.4, 0.18), darkAccent);
    pergolaPost1.position.set(-3.2, topY + 1.2, 4.0);
    const pergolaPost2 = new THREE.Mesh(new THREE.BoxGeometry(0.18, 2.4, 0.18), darkAccent);
    pergolaPost2.position.set(3.2, topY + 1.2, 4.0);
    bldgGroup.add(pergolaPost1, pergolaPost2);
  }

  scene.add(bldgGroup);
}

// =========================================================================
// 3D ATTRACTIVE & VIBRANT INTERIOR SCENE BUILDER (All 7 Rooms)
// =========================================================================
function buildAttractiveInteriorScene(scene, room, style, lighting) {
  const roomGroup = new THREE.Group();

  const roomW = 8.6;
  const roomH = 3.6;
  const roomD = 7.6;

  // 1. Flooring Material & Color
  let floorColor = 0xf8fafc;
  let floorRoughness = 0.15;
  let floorMetalness = 0.2;

  if (room.includes('Bedroom') || room.includes('Office')) {
    // Warm Natural Honey Oak Herringbone Wood Parquet
    floorColor = 0xa16207;
    floorRoughness = 0.45;
    floorMetalness = 0.1;
  } else if (room.includes('Kitchen')) {
    // Designer Carrara Satin Quartz
    floorColor = 0xf1f5f9;
    floorRoughness = 0.25;
  } else if (room.includes('Pooja')) {
    // Pure White Makrana Marble with Inlay
    floorColor = 0xffffff;
    floorRoughness = 0.1;
    floorMetalness = 0.3;
  }

  const floorMat = new THREE.MeshStandardMaterial({
    color: floorColor,
    roughness: floorRoughness,
    metalness: floorMetalness
  });
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(roomW, roomD), floorMat);
  floor.rotation.x = -Math.PI / 2;
  floor.receiveShadow = true;
  roomGroup.add(floor);

  // 2. Walls (Warm, inviting, bright designer studio colors)
  let wallColor = 0xf1f5f9; // Warm designer ivory/greige
  if (room.includes('Office')) wallColor = 0x1e3a8a; // Oxford Navy accent
  else if (room.includes('Living')) wallColor = 0xf8fafc; // Bright gallery white
  else if (room.includes('Bedroom')) wallColor = 0xede9fe; // Soft lavender/cashmere

  const wallMat = new THREE.MeshStandardMaterial({ color: wallColor, roughness: 0.8 });

  // Back Wall
  const backWall = new THREE.Mesh(new THREE.PlaneGeometry(roomW, roomH), wallMat);
  backWall.position.set(0, roomH / 2, -roomD / 2);
  backWall.receiveShadow = true;
  roomGroup.add(backWall);

  // Left & Right Walls
  const leftWall = new THREE.Mesh(new THREE.PlaneGeometry(roomD, roomH), wallMat);
  leftWall.position.set(-roomW / 2, roomH / 2, 0);
  leftWall.rotation.y = Math.PI / 2;
  leftWall.receiveShadow = true;
  roomGroup.add(leftWall);

  const rightWall = new THREE.Mesh(new THREE.PlaneGeometry(roomD, roomH), wallMat);
  rightWall.position.set(roomW / 2, roomH / 2, 0);
  rightWall.rotation.y = -Math.PI / 2;
  rightWall.receiveShadow = true;
  roomGroup.add(rightWall);

  // Architectural Ceiling with Warm LED Perimeter Cove
  const ceilingMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.9 });
  const ceiling = new THREE.Mesh(new THREE.PlaneGeometry(roomW, roomD), ceilingMat);
  ceiling.position.set(0, roomH, 0);
  ceiling.rotation.x = Math.PI / 2;
  roomGroup.add(ceiling);

  // Warm Amber Cove Light Frame
  const coveLightMat = new THREE.MeshStandardMaterial({
    color: 0xfbbf24,
    emissive: 0xf59e0b,
    emissiveIntensity: 1.6
  });
  const coveFrame = new THREE.Mesh(new THREE.BoxGeometry(roomW * 0.78, 0.08, roomD * 0.78), coveLightMat);
  coveFrame.position.set(0, roomH - 0.05, 0);
  roomGroup.add(coveFrame);

  // -------------------------------------------------------------
  // ATTRACTIVE ROOM-SPECIFIC FURNITURE, JOINERY & COLOR PALETTES
  // -------------------------------------------------------------
  if (room.includes('Living')) {
    // ================= 1. FORMAL LIVING ROOM & MEDIA LOUNGE =================
    // Vibrant Designer Area Rug (Sapphire Blue, Gold & Ivory geometric pattern)
    const rugMat = new THREE.MeshStandardMaterial({ color: 0x1e40af, roughness: 0.9 });
    const rug = new THREE.Mesh(new THREE.BoxGeometry(5.2, 0.03, 4.2), rugMat);
    rug.position.set(-0.2, 0.015, 0.8);
    roomGroup.add(rug);

    // Deep Emerald Velvet L-Sectional Sofa (Attractive Jewel Tone)
    const sofaMat = new THREE.MeshStandardMaterial({ color: 0x047857, roughness: 0.75 }); // Rich Emerald
    const sofaBase = new THREE.Mesh(new THREE.BoxGeometry(4.4, 0.48, 1.25), sofaMat);
    sofaBase.position.set(-0.4, 0.24, 0.4);
    sofaBase.castShadow = true;
    const sofaL = new THREE.Mesh(new THREE.BoxGeometry(1.25, 0.48, 2.6), sofaMat);
    sofaL.position.set(1.2, 0.24, 1.7);
    sofaL.castShadow = true;

    // Sofa Backrest
    const sofaBack = new THREE.Mesh(new THREE.BoxGeometry(4.4, 0.7, 0.35), sofaMat);
    sofaBack.position.set(-0.4, 0.8, -0.15);
    roomGroup.add(sofaBase, sofaL, sofaBack);

    // Vibrant Throw Pillows (Mustard Yellow, Terracotta & White)
    const pMatYellow = new THREE.MeshStandardMaterial({ color: 0xeab308, roughness: 0.7 });
    const pMatOrange = new THREE.MeshStandardMaterial({ color: 0xea580c, roughness: 0.7 });
    const pillow1 = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.45, 0.16), pMatYellow);
    pillow1.position.set(-1.8, 0.7, 0.05);
    const pillow2 = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.45, 0.16), pMatOrange);
    pillow2.position.set(-0.6, 0.7, 0.05);
    const pillow3 = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.45, 0.16), pMatYellow);
    pillow3.position.set(1.2, 0.7, 1.0);
    roomGroup.add(pillow1, pillow2, pillow3);

    // Designer Coffee Table (Calacatta Gold Marble Top + Brushed Brass Legs)
    const brassMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b, metalness: 0.9, roughness: 0.2 });
    const marbleTopMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.15, metalness: 0.1 });
    const tableTop = new THREE.Mesh(new THREE.CylinderGeometry(1.0, 1.0, 0.06, 32), marbleTopMat);
    tableTop.position.set(-0.5, 0.42, 1.8);
    tableTop.castShadow = true;
    const tableLegs = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.7, 0.4, 16), brassMat);
    tableLegs.position.set(-0.5, 0.2, 1.8);
    roomGroup.add(tableTop, tableLegs);

    // Acoustic Fluted Timber Slat Wall (Warm American Walnut)
    const slatMat = new THREE.MeshStandardMaterial({ color: 0x78350f, roughness: 0.6 });
    for (let s = -2.8; s <= 2.8; s += 0.2) {
      const slat = new THREE.Mesh(new THREE.BoxGeometry(0.08, 2.9, 0.06), slatMat);
      slat.position.set(s, 1.6, -roomD / 2 + 0.04);
      roomGroup.add(slat);
    }

    // 85" OLED TV Screen with Backlit Glow
    const tvScreen = new THREE.Mesh(new THREE.BoxGeometry(3.4, 1.9, 0.08), new THREE.MeshStandardMaterial({ color: 0x0369a1, emissive: 0x0284c7, emissiveIntensity: 0.6 }));
    tvScreen.position.set(0, 1.8, -roomD / 2 + 0.16);
    tvScreen.castShadow = true;
    roomGroup.add(tvScreen);

    // Floating Media Console (Rich Walnut with Brass Hardware)
    const consoleMat = new THREE.MeshStandardMaterial({ color: 0x451a03, roughness: 0.4 });
    const consoleBox = new THREE.Mesh(new THREE.BoxGeometry(4.8, 0.45, 0.55), consoleMat);
    consoleBox.position.set(0, 0.45, -roomD / 2 + 0.4);
    consoleBox.castShadow = true;
    roomGroup.add(consoleBox);

    // Arched Floor Lamp with Glowing Warm Shade
    const lampStem = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 2.6, 16), brassMat);
    lampStem.position.set(-3.2, 1.3, 0.5);
    const lampShade = new THREE.Mesh(new THREE.ConeGeometry(0.35, 0.4, 20), new THREE.MeshStandardMaterial({ color: 0xfef08a, emissive: 0xf59e0b, emissiveIntensity: 1.2 }));
    lampShade.position.set(-2.8, 2.5, 0.5);
    roomGroup.add(lampStem, lampShade);

    // Lush Potted Indoor Fiddle-Leaf Fig Plant
    const pot = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.28, 0.6, 20), new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.3 }));
    pot.position.set(3.2, 0.3, -2.5);
    const plantLeaves = new THREE.Mesh(new THREE.SphereGeometry(0.65, 12, 12), new THREE.MeshStandardMaterial({ color: 0x16a34a, roughness: 0.8 }));
    plantLeaves.position.set(3.2, 1.1, -2.5);
    roomGroup.add(pot, plantLeaves);

    // Colorful Framed Wall Art on Left Wall
    const artCanvas = new THREE.Mesh(new THREE.BoxGeometry(0.06, 2.0, 1.4), new THREE.MeshStandardMaterial({ color: 0xd97706, roughness: 0.4 }));
    artCanvas.position.set(-roomW / 2 + 0.05, 2.0, 1.0);
    roomGroup.add(artCanvas);

  } else if (room.includes('Bedroom')) {
    // ================= 2. MASTER BEDROOM LUXURY SUITE =================
    // Royal Indigo / Navy Velvet Tufted Headboard Wall
    const headboardMat = new THREE.MeshStandardMaterial({ color: 0x1e3a8a, roughness: 0.7 });
    const headboard = new THREE.Mesh(new THREE.BoxGeometry(4.0, 2.0, 0.22), headboardMat);
    headboard.position.set(0, 1.1, -roomD / 2 + 0.2);
    headboard.castShadow = true;

    // King-Size Platform Bed Frame (Warm Walnut)
    const bedFrame = new THREE.Mesh(new THREE.BoxGeometry(2.8, 0.45, 3.4), new THREE.MeshStandardMaterial({ color: 0x78350f, roughness: 0.5 }));
    bedFrame.position.set(0, 0.25, -roomD / 2 + 1.9);
    bedFrame.castShadow = true;

    // Crisp Egyptian White Linen Mattress & Duvet
    const duvet = new THREE.Mesh(new THREE.BoxGeometry(2.65, 0.3, 2.4), new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.9 }));
    duvet.position.set(0, 0.6, -roomD / 2 + 2.3);

    // Warm Saffron / Terracotta Bed Runner
    const runner = new THREE.Mesh(new THREE.BoxGeometry(2.68, 0.32, 0.7), new THREE.MeshStandardMaterial({ color: 0xd97706, roughness: 0.8 }));
    runner.position.set(0, 0.61, -roomD / 2 + 2.8);

    // 4 Plush Pillows (2 White + 2 Velvet Navy)
    const pMatWhite = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.85 });
    [-0.7, 0.7].forEach((px) => {
      const p1 = new THREE.Mesh(new THREE.BoxGeometry(0.85, 0.22, 0.5), pMatWhite);
      p1.position.set(px, 0.68, -roomD / 2 + 0.8);
      const p2 = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.2, 0.4), headboardMat);
      p2.position.set(px, 0.75, -roomD / 2 + 1.1);
      roomGroup.add(p1, p2);
    });

    // Floating Walnut Nightstands with Brass Trim
    const nsMat = new THREE.MeshStandardMaterial({ color: 0x9a3412, roughness: 0.5 });
    [-2.3, 2.3].forEach((nx) => {
      const ns = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.45, 0.5), nsMat);
      ns.position.set(nx, 0.45, -roomD / 2 + 0.45);
      ns.castShadow = true;

      // Warm Glowing Alabaster Lamp
      const lamp = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.22, 0.45, 16), new THREE.MeshStandardMaterial({ color: 0xfef08a, emissive: 0xf59e0b, emissiveIntensity: 1.4 }));
      lamp.position.set(nx, 0.9, -roomD / 2 + 0.45);
      roomGroup.add(ns, lamp);
    });

    // Floor-to-Ceiling Smoked Bronze Glass Wardrobe on Right Wall
    const wardrobeMat = new THREE.MeshStandardMaterial({ color: 0x78350f, metalness: 0.85, roughness: 0.15, transparent: true, opacity: 0.85 });
    const wardrobe = new THREE.Mesh(new THREE.BoxGeometry(0.75, 3.4, 4.4), wardrobeMat);
    wardrobe.position.set(roomW / 2 - 0.4, 1.7, 0.5);
    wardrobe.castShadow = true;
    roomGroup.add(wardrobe);

    roomGroup.add(headboard, bedFrame, duvet, runner);

  } else if (room.includes('Kitchen')) {
    // ================= 3. MODULAR KITCHEN & BREAKFAST ISLAND =================
    // Rich Deep Forest Green Base & Overhead Cabinetry
    const greenCabMat = new THREE.MeshStandardMaterial({ color: 0x064e3b, roughness: 0.45 });
    const quartzMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.15, metalness: 0.2 });
    const brassMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b, metalness: 0.9, roughness: 0.2 });

    // L-Shaped Base Counter
    const baseCounter = new THREE.Mesh(new THREE.BoxGeometry(6.4, 0.92, 0.95), greenCabMat);
    baseCounter.position.set(0, 0.46, -roomD / 2 + 0.6);
    baseCounter.castShadow = true;

    // Quartz Waterfall Countertop
    const counterTop = new THREE.Mesh(new THREE.BoxGeometry(6.5, 0.08, 1.0), quartzMat);
    counterTop.position.set(0, 0.96, -roomD / 2 + 0.6);

    // Overhead Cabinets with under-cabinet Warm LED Strip
    const overheadCabs = new THREE.Mesh(new THREE.BoxGeometry(6.4, 0.95, 0.55), greenCabMat);
    overheadCabs.position.set(0, 2.6, -roomD / 2 + 0.4);

    // Warm Sage / Terracotta Subway Backsplash
    const splashMat = new THREE.MeshStandardMaterial({ color: 0xe2e8f0, roughness: 0.25 });
    const splash = new THREE.Mesh(new THREE.BoxGeometry(6.4, 1.5, 0.04), splashMat);
    splash.position.set(0, 1.75, -roomD / 2 + 0.05);

    // Induction Cooktop with Glowing Red Cooking Rings
    const hobMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.1, metalness: 0.9 });
    const hob = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.03, 0.6), hobMat);
    hob.position.set(-1.0, 1.01, -roomD / 2 + 0.6);
    const burnerGlow = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.18, 0.04, 16), new THREE.MeshStandardMaterial({ color: 0xef4444, emissive: 0xdc2626, emissiveIntensity: 1.5 }));
    burnerGlow.position.set(-1.0, 1.02, -roomD / 2 + 0.6);

    // Stainless Steel Designer Chimney Hood
    const chimney = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.8, 0.65), new THREE.MeshStandardMaterial({ color: 0xe2e8f0, metalness: 0.9, roughness: 0.2 }));
    chimney.position.set(-1.0, 2.6, -roomD / 2 + 0.6);

    // Waterfall Quartz Kitchen Island
    const island = new THREE.Mesh(new THREE.BoxGeometry(3.6, 0.96, 1.4), quartzMat);
    island.position.set(0, 0.48, 1.3);
    island.castShadow = true;

    // 2 Cognac Leather Barstools with Brass Footrests
    const leatherMat = new THREE.MeshStandardMaterial({ color: 0xc2410c, roughness: 0.6 });
    [-0.9, 0.9].forEach((bx) => {
      const seat = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.24, 0.1, 20), leatherMat);
      seat.position.set(bx, 0.72, 2.3);
      const stoolLegs = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.7, 12), brassMat);
      stoolLegs.position.set(bx, 0.35, 2.3);
      roomGroup.add(seat, stoolLegs);
    });

    // Fresh Fruit Bowl (Vibrant Red Apples & Yellow Lemons)
    const bowl = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.18, 0.14, 20), new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.2 }));
    bowl.position.set(0, 1.04, 1.3);
    const fruit = new THREE.Mesh(new THREE.SphereGeometry(0.14, 12, 12), new THREE.MeshStandardMaterial({ color: 0xef4444, roughness: 0.5 }));
    fruit.position.set(0, 1.15, 1.3);
    roomGroup.add(bowl, fruit);

    roomGroup.add(baseCounter, counterTop, overheadCabs, splash, hob, burnerGlow, chimney, island);

  } else if (room.includes('Dining')) {
    // ================= 4. CENTRAL DINING ROOM =================
    // Rich Walnut 6-Seater Dining Table
    const tableMat = new THREE.MeshStandardMaterial({ color: 0x451a03, roughness: 0.45 });
    const tableTop = new THREE.Mesh(new THREE.BoxGeometry(3.8, 0.1, 1.9), tableMat);
    tableTop.position.set(0, 0.88, 0);
    tableTop.castShadow = true;
    [-1.6, 1.6].forEach((tx) => {
      const leg = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.88, 1.6), tableMat);
      leg.position.set(tx, 0.44, 0);
      roomGroup.add(leg);
    });
    roomGroup.add(tableTop);

    // 6 Upholstered Dining Chairs in Mustard Gold Velvet
    const chairMat = new THREE.MeshStandardMaterial({ color: 0xd97706, roughness: 0.7 });
    [-1.1, 0, 1.1].forEach((cx) => {
      const chFront = new THREE.Mesh(new THREE.BoxGeometry(0.58, 0.52, 0.58), chairMat);
      chFront.position.set(cx, 0.32, 1.4);
      chFront.castShadow = true;
      const chBack = new THREE.Mesh(new THREE.BoxGeometry(0.58, 0.52, 0.58), chairMat);
      chBack.position.set(cx, 0.32, -1.4);
      chBack.castShadow = true;
      roomGroup.add(chFront, chBack);
    });

    // Multi-Ring Brushed Brass Radiant Chandelier
    const brassMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b, metalness: 0.9, roughness: 0.2 });
    const ring1 = new THREE.Mesh(new THREE.TorusGeometry(1.0, 0.05, 12, 32), brassMat);
    ring1.position.set(0, 2.5, 0);
    ring1.rotation.x = Math.PI / 2;
    const ring2 = new THREE.Mesh(new THREE.TorusGeometry(0.65, 0.04, 12, 32), brassMat);
    ring2.position.set(0, 2.3, 0);
    ring2.rotation.x = Math.PI / 2;
    roomGroup.add(ring1, ring2);

    // Buffet Console Sideboard with Wine Decanter & Artwork
    const sideboard = new THREE.Mesh(new THREE.BoxGeometry(4.4, 0.9, 0.6), tableMat);
    sideboard.position.set(0, 0.45, -roomD / 2 + 0.35);
    roomGroup.add(sideboard);

    // Large Window on Left Wall with Sheer Curtains
    const gardenWindow = new THREE.Mesh(new THREE.BoxGeometry(0.04, 2.6, 4.4), new THREE.MeshStandardMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.5, roughness: 0.05 }));
    gardenWindow.position.set(-roomW / 2 + 0.05, 1.8, 0);
    roomGroup.add(gardenWindow);

  } else if (room.includes('Bathroom')) {
    // ================= 5. ENSUITE BATHROOM & SPA SHOWER =================
    // Bookmatched Italian Statuario Marble Walls
    const marbleMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.15, metalness: 0.15 });
    const marbleBack = new THREE.Mesh(new THREE.PlaneGeometry(roomW, roomH), marbleMat);
    marbleBack.position.set(0, roomH / 2, -roomD / 2 + 0.02);
    roomGroup.add(marbleBack);

    // Floating Teakwood Vanity Unit
    const vanityMat = new THREE.MeshStandardMaterial({ color: 0x9a3412, roughness: 0.5 });
    const vanity = new THREE.Mesh(new THREE.BoxGeometry(3.8, 0.58, 0.75), vanityMat);
    vanity.position.set(-0.6, 0.8, -roomD / 2 + 0.45);
    vanity.castShadow = true;

    // Dual White Vessel Basins + Matte Black Faucets
    const basinMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.1 });
    const tapMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, metalness: 0.9, roughness: 0.2 });
    [-1.6, 0.4].forEach((vx) => {
      const basin = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.3, 0.2, 24), basinMat);
      basin.position.set(vx, 1.18, -roomD / 2 + 0.45);
      const tap = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.32, 0.18), tapMat);
      tap.position.set(vx, 1.42, -roomD / 2 + 0.2);
      roomGroup.add(basin, tap);
    });

    // Dual Arched LED Backlit Mirrors
    const mirrorGlowMat = new THREE.MeshStandardMaterial({ color: 0xfef08a, emissive: 0xf59e0b, emissiveIntensity: 0.8, roughness: 0.05 });
    [-1.6, 0.4].forEach((mx) => {
      const mirror = new THREE.Mesh(new THREE.BoxGeometry(1.05, 1.5, 0.05), mirrorGlowMat);
      mirror.position.set(mx, 2.2, -roomD / 2 + 0.06);
      roomGroup.add(mirror);
    });

    // Walk-in Frameless Glass Shower Enclosure with Chrome Rainhead
    const glassMat = new THREE.MeshStandardMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.35, roughness: 0.05 });
    const showerScreen = new THREE.Mesh(new THREE.BoxGeometry(0.08, 2.7, 2.8), glassMat);
    showerScreen.position.set(2.4, 1.35, -roomD / 2 + 1.5);

    const rainhead = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 0.04, 20), new THREE.MeshStandardMaterial({ color: 0xe2e8f0, metalness: 0.95 }));
    rainhead.position.set(3.2, 2.7, -roomD / 2 + 1.2);
    roomGroup.add(vanity, showerScreen, rainhead);

  } else if (room.includes('Office')) {
    // ================= 6. EXECUTIVE HOME OFFICE & STUDY =================
    // American Walnut Executive Desk with Black Leather Inlay
    const deskMat = new THREE.MeshStandardMaterial({ color: 0x78350f, roughness: 0.45 });
    const deskTop = new THREE.Mesh(new THREE.BoxGeometry(3.4, 0.1, 1.8), deskMat);
    deskTop.position.set(0, 0.88, 0.3);
    deskTop.castShadow = true;
    const deskLegs = new THREE.Mesh(new THREE.BoxGeometry(3.2, 0.85, 0.1), deskMat);
    deskLegs.position.set(0, 0.44, 0.3);
    roomGroup.add(deskTop, deskLegs);

    // Dual Curved Widescreen Monitors with Active Graphical Glow
    const screenMat = new THREE.MeshStandardMaterial({ color: 0x0284c7, emissive: 0x38bdf8, emissiveIntensity: 0.6 });
    const mon1 = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.55, 0.04), screenMat);
    mon1.position.set(-0.5, 1.3, 0.3);
    const mon2 = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.55, 0.04), screenMat);
    mon2.position.set(0.5, 1.3, 0.3);
    roomGroup.add(mon1, mon2);

    // Ergonomic Cognac Leather Swivel Chair
    const chairMat = new THREE.MeshStandardMaterial({ color: 0xb45309, roughness: 0.65 });
    const chairSeat = new THREE.Mesh(new THREE.BoxGeometry(0.65, 0.12, 0.65), chairMat);
    chairSeat.position.set(0, 0.52, 1.2);
    const chairBack = new THREE.Mesh(new THREE.BoxGeometry(0.65, 0.75, 0.12), chairMat);
    chairBack.position.set(0, 0.95, 1.5);
    roomGroup.add(chairSeat, chairBack);

    // Brass Banker's Desk Lamp with Emerald Glass Shade
    const bankerLamp = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.15, 0.18), new THREE.MeshStandardMaterial({ color: 0x047857, emissive: 0x10b981, emissiveIntensity: 0.9 }));
    bankerLamp.position.set(-1.1, 1.1, 0.3);
    roomGroup.add(bankerLamp);

    // Full-Wall Bookshelf with Rows of Colorful Books
    const shelfMat = new THREE.MeshStandardMaterial({ color: 0x451a03, roughness: 0.6 });
    const shelf = new THREE.Mesh(new THREE.BoxGeometry(5.8, 3.2, 0.45), shelfMat);
    shelf.position.set(0, 1.6, -roomD / 2 + 0.28);
    roomGroup.add(shelf);

    // Colorful Book Spines (Reds, Blues, Yellows, Greens)
    const bookColors = [0xb91c1c, 0x1d4ed8, 0xeab308, 0x15803d, 0x7c3aed];
    for (let b = -2.2; b <= 2.2; b += 0.35) {
      const bColor = bookColors[Math.abs(Math.floor(b * 3)) % bookColors.length];
      const book = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.38, 0.28), new THREE.MeshStandardMaterial({ color: bColor, roughness: 0.6 }));
      book.position.set(b, 1.2, -roomD / 2 + 0.4);
      roomGroup.add(book);
    }

  } else {
    // ================= 7. POOJA SACRED MANDIR ROOM =================
    const teakMat = new THREE.MeshStandardMaterial({ color: 0x78350f, roughness: 0.5 });
    const brassMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b, metalness: 0.9, roughness: 0.2 });
    const pureMarbleMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.15, metalness: 0.2 });

    // Multi-Stepped Pure White Makrana Marble Altar
    const altarStep1 = new THREE.Mesh(new THREE.BoxGeometry(3.2, 0.3, 1.8), pureMarbleMat);
    altarStep1.position.set(0, 0.15, -roomD / 2 + 1.4);
    const altarStep2 = new THREE.Mesh(new THREE.BoxGeometry(2.6, 0.3, 1.2), pureMarbleMat);
    altarStep2.position.set(0, 0.45, -roomD / 2 + 1.1);

    // Sacred Crimson Red Velvet Altar Cloth
    const velvetCloth = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.03, 1.1), new THREE.MeshStandardMaterial({ color: 0x991b1b, roughness: 0.9 }));
    velvetCloth.position.set(0, 0.62, -roomD / 2 + 1.1);

    // Carved Teakwood Mandir Sanctum Frame
    const mandirFrame = new THREE.Mesh(new THREE.BoxGeometry(2.4, 2.2, 1.2), teakMat);
    mandirFrame.position.set(0, 1.7, -roomD / 2 + 1.1);

    // Pyramidal Shikhar Spire with Brass Finial Kalash
    const spire = new THREE.Mesh(new THREE.ConeGeometry(0.9, 1.3, 4), teakMat);
    spire.position.set(0, 3.3, -roomD / 2 + 1.1);
    spire.rotation.y = Math.PI / 4;

    const kalash = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.18, 0.4, 16), brassMat);
    kalash.position.set(0, 4.0, -roomD / 2 + 1.1);

    // Solid Brass Ceremonial Diyas (Oil Lamps) with Glowing Flame
    [-0.9, 0.9].forEach((dx) => {
      const diya = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.2, 0.45, 16), brassMat);
      diya.position.set(dx, 0.85, -roomD / 2 + 1.2);
      const flame = new THREE.Mesh(new THREE.SphereGeometry(0.08, 12, 12), new THREE.MeshStandardMaterial({ color: 0xf97316, emissive: 0xf59e0b, emissiveIntensity: 2.0 }));
      flame.position.set(dx, 1.12, -roomD / 2 + 1.2);
      roomGroup.add(diya, flame);
    });

    // Radiant Golden Brass Sun / Om Halo Disc with Divine Golden Rays
    const haloDisc = new THREE.Mesh(
      new THREE.CircleGeometry(1.3, 32),
      new THREE.MeshStandardMaterial({ color: 0xfbbf24, emissive: 0xf59e0b, emissiveIntensity: 1.8 })
    );
    haloDisc.position.set(0, 1.8, -roomD / 2 + 0.45);

    // Traditional Marigold Garland (Orange & Yellow Blooms)
    const garlandMat = new THREE.MeshStandardMaterial({ color: 0xf97316, roughness: 0.8 });
    const garland = new THREE.Mesh(new THREE.TorusGeometry(1.1, 0.08, 8, 24), garlandMat);
    garland.position.set(0, 1.8, -roomD / 2 + 1.0);

    roomGroup.add(altarStep1, altarStep2, velvetCloth, mandirFrame, spire, kalash, haloDisc, garland);
  }

  scene.add(roomGroup);
}
