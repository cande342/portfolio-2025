import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

// === ESCENA, CÁMARA, RENDERER ===
const scene = new THREE.Scene();
scene.background = null; // canvas transparente

const camera = new THREE.PerspectiveCamera(75, 500 / 250, 0.1, 1000);
camera.position.set(0, 1.5, 4);
camera.lookAt(0, 1, 0);

const canvas = document.getElementById('flowerCanvas');
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
renderer.setSize(500, 350);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// === LUCES ===
const ambient = new THREE.AmbientLight(0xffffff, 1.3);
scene.add(ambient);

const dirLight = new THREE.DirectionalLight(0xffffff, 2);
dirLight.position.set(5, 10, 7.5);
scene.add(dirLight);

// === CONTROLES ===
const controls = new OrbitControls(camera, renderer.domElement);
controls.update();

// === MODELO 3D ===
const loader = new GLTFLoader();

loader.load(
  '/chibi_cute.glb',
  (glb) => {
    const model = glb.scene;

    // === centramos y escalamos ===
    const box = new THREE.Box3().setFromObject(model);
    const center = new THREE.Vector3();
    box.getCenter(center);
    model.position.sub(center); // centramos el modelo
    const size = box.getSize(new THREE.Vector3());
    const maxDim = Math.max(size.x, size.y, size.z);
    const scale = 1.5 / maxDim * 1.5;
    model.scale.setScalar(scale);
    scene.add(model);

    console.log('🐱 Modelo GLB cargado correctamente');

    // === ENCUADRE AUTOMÁTICO ===
    // Recalculamos el box del modelo escalado
    const boxScaled = new THREE.Box3().setFromObject(model);
    const sizeScaled = boxScaled.getSize(new THREE.Vector3());
    const centerScaled = boxScaled.getCenter(new THREE.Vector3());

    // distancia ideal según tamaño y fov de la cámara
    const fov = camera.fov * (Math.PI / 180);
    const distance = (sizeScaled.y / 2) / Math.tan(fov / 2);

    camera.position.copy(centerScaled);
    camera.position.z += distance * 1.5; // un poco más atrás
    camera.position.y += sizeScaled.y * 0.2; // leve inclinación hacia arriba
    camera.lookAt(centerScaled);

    controls.target.copy(centerScaled);
    controls.update();

    // === ANIMACIÓN ===
    let clock = new THREE.Clock();

    function animateModel() {
      const t = clock.getElapsedTime();
      model.position.y = Math.sin(t * 2) * 0.1;
      model.rotation.y = Math.sin(t) * 0.35;
    }

    function animate() {
      requestAnimationFrame(animate);
      animateModel();
      renderer.render(scene, camera);
      controls.update();
    }

    animate();
  },
  undefined,
  (error) => console.error('Error al cargar el modelo:', error)
);


// === ANIMACIÓN ===
function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
  controls.update();
}

animate();

// === RESIZE RESPONSIVO ===
window.addEventListener('resize', () => {
  const width = 700;
  const height = 500;
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
  renderer.setSize(width, height);
});


    // Obtener elementos
    const modal = document.getElementById('modalQueHago');
    const btn = document.getElementById('btnQueHago');
    const closeBtn = document.querySelector('.close');

    // Abrir modal
    btn.addEventListener('click', () => {
      modal.style.display = 'block';
    });

    // Cerrar modal con X
    closeBtn.addEventListener('click', () => {
      modal.style.display = 'none';
    });

    // Cerrar modal al hacer click fuera
    window.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.style.display = 'none';
      }
    });

    // Cerrar con ESC
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modal.style.display === 'block') {
        modal.style.display = 'none';
      }
    });