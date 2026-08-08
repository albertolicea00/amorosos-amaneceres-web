// Scope: book3d — the WebGL book (geometry + lights) and the
// CSS3D text overlay, kept as two mirrored scenes so the DOM
// page content renders crisp on top of the lit 3D pages.

import * as THREE from "three";
import { CSS3DRenderer, CSS3DObject } from "three/addons/renderers/CSS3DRenderer.js";

const PAGE_WIDTH = 520;
const PAGE_HEIGHT = 640;
const PAGE_GAP = 3;

export function createBook({ webglEl, cssEl, pageElements }) {
  const total = pageElements.length;

  const scene = new THREE.Scene();
  const sceneCSS = new THREE.Scene();

  const camera = new THREE.PerspectiveCamera(45, webglEl.clientWidth / webglEl.clientHeight, 1, 6000);
  camera.position.set(0, 30, 1150);
  camera.lookAt(0, 0, -total * PAGE_GAP * 0.5);

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(webglEl.clientWidth, webglEl.clientHeight);
  webglEl.appendChild(renderer.domElement);

  const cssRenderer = new CSS3DRenderer();
  cssRenderer.setSize(cssEl.clientWidth, cssEl.clientHeight);
  cssEl.appendChild(cssRenderer.domElement);

  // Lights — warm sunrise key + cool dusk rim, per the brand palette.
  scene.add(new THREE.AmbientLight(0xfff1de, 0.9));
  const key = new THREE.DirectionalLight(0xffd89a, 1.1);
  key.position.set(400, 500, 800);
  scene.add(key);
  const rim = new THREE.DirectionalLight(0x8a5aa8, 0.6);
  rim.position.set(-500, -200, -400);
  scene.add(rim);

  // Back cover — a simple box behind the stack for depth.
  const coverGeo = new THREE.BoxGeometry(PAGE_WIDTH + 24, PAGE_HEIGHT + 24, 12);
  const coverMat = new THREE.MeshStandardMaterial({ color: 0x4a3170, roughness: 0.7 });
  const backCover = new THREE.Mesh(coverGeo, coverMat);
  backCover.position.set(PAGE_WIDTH / 2 - 12, 0, -(total + 1) * PAGE_GAP);
  scene.add(backCover);

  const spineGeo = new THREE.BoxGeometry(10, PAGE_HEIGHT + 24, (total + 2) * PAGE_GAP);
  const spineMat = new THREE.MeshStandardMaterial({ color: 0x2c1b3d, roughness: 0.6 });
  const spine = new THREE.Mesh(spineGeo, spineMat);
  spine.position.set(-6, 0, -((total + 2) * PAGE_GAP) / 2 + PAGE_GAP);
  scene.add(spine);

  const planeGeo = new THREE.PlaneGeometry(PAGE_WIDTH, PAGE_HEIGHT);
  const paperMat = new THREE.MeshStandardMaterial({
    color: 0xfff8ef,
    roughness: 0.9,
    side: THREE.DoubleSide,
  });

  const pivotsGL = [];
  const pivotsCSS = [];

  pageElements.forEach((el, i) => {
    const z = -i * PAGE_GAP;

    const pivotGL = new THREE.Group();
    pivotGL.position.set(0, 0, z);
    const plane = new THREE.Mesh(planeGeo, paperMat);
    plane.position.x = PAGE_WIDTH / 2;
    pivotGL.add(plane);
    scene.add(pivotGL);
    pivotsGL.push(pivotGL);

    const pivotCSS = new THREE.Group();
    pivotCSS.position.set(0, 0, z);
    el.style.width = `${PAGE_WIDTH}px`;
    el.style.height = `${PAGE_HEIGHT}px`;
    const obj = new CSS3DObject(el);
    obj.position.x = PAGE_WIDTH / 2;
    pivotCSS.add(obj);
    sceneCSS.add(pivotCSS);
    pivotsCSS.push(pivotCSS);
  });

  function setProgress(progressFloat) {
    for (let i = 0; i < total; i++) {
      const angle = THREE.MathUtils.clamp(progressFloat - i, 0, 1) * -Math.PI;
      pivotsGL[i].rotation.y = angle;
      pivotsCSS[i].rotation.y = angle;
    }
  }

  function render() {
    renderer.render(scene, camera);
    cssRenderer.render(sceneCSS, camera);
  }

  function resize() {
    const w = webglEl.clientWidth;
    const h = webglEl.clientHeight;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
    cssRenderer.setSize(w, h);
    render();
  }

  window.addEventListener("resize", resize);

  function loop() {
    render();
    requestAnimationFrame(loop);
  }
  loop();

  return { setProgress, resize, total };
}
