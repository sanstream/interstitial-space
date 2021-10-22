// Ensure ThreeJS is in global scope for the 'examples/'
global.THREE = require("three");

// Include any additional ThreeJS examples below
require("three/examples/js/controls/OrbitControls");

const canvasSketch = require("canvas-sketch");
const { GridHelper } = require("three")

const settings = {
  // Make the loop animated
  dimensions: [512, 512],
  animate: true,
  // Get a WebGL canvas rather than 2D
  context: "webgl"
};

const gridSize = {
  width: 100,
  height: 100,
}

const sketch = ({ context }) => {
  // Create a renderer
  const renderer = new THREE.WebGLRenderer({
    canvas: context.canvas
  });

  // WebGL background color
  renderer.setClearColor('#ffffff', 1);

  // Setup a camera
  const camera = new THREE.OrthographicCamera(
    -(gridSize.height / 2),
    gridSize.height / 2,
    gridSize.width / 2,
    -(gridSize.width / 2),
    0.01,
  );
  // const camera = new THREE.PerspectiveCamera(50, 1, 0.01, 100);
  camera.position.set(0,gridSize.height, 0); // position camera
  camera.lookAt(0,0,0);

  // Setup camera controller
  const controls = new THREE.OrbitControls(camera, context.canvas);

  // Setup your scene
  const scene = new THREE.Scene();

  // Setup a geometry
  const geometry = new THREE.BoxGeometry(3,3,3);

  // Setup a material
  const material = new THREE.MeshBasicMaterial({
    color: "red",
    wireframe: false
  });

  const lineMaterial = new THREE.LineBasicMaterial({
    color: '#121212',
    linewidth: 1,
  });

  // Setup a mesh with geometry + material
  const mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);
  mesh.position.set(0,0,0)

  const points = [
    new THREE.Vector3( 0, 0, 0 ),
    new THREE.Vector3( 5, 0, 5 ),
  ]
  const lineGeometry = new THREE.BufferGeometry()
    .setFromPoints(points)
  const line = new THREE.Line(lineGeometry, lineMaterial)
  scene.add(line)
  const light = new THREE.PointLight('white')
  scene.add(light)
  // light.position.set(7, 7, 0)
  // light.lookAt(0,0,0)

  // const lighthelper = new THREE.PointLightHelper(light)
  // scene.add(lighthelper)

  const gridHelper = new THREE.GridHelper(gridSize.height, 10, 'green')
  scene.add(gridHelper)

  return {
    // Handle resize events here
    resize({ pixelRatio, viewportWidth, viewportHeight }) {
      renderer.setPixelRatio(pixelRatio);
      renderer.setSize(viewportWidth, viewportHeight, false);
      camera.aspect = viewportWidth / viewportHeight;
      camera.updateProjectionMatrix();
    },
    // Update & render your scene here
    render({ time }) {
      controls.update();
      renderer.render(scene, camera);
    },
    // Dispose of events & renderer for cleaner hot-reloading
    unload() {
      controls.dispose();
      renderer.dispose();
    }
  };
};

canvasSketch(sketch, settings);
