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

  const lineMaterial = new THREE.LineBasicMaterial({
    color: '#121212',
    linewidth: 1,
  });

  const defaultY = 0
  const seedArray = new Array(1000)
  const sizing = gridSize.height
  const vertices = new Float32Array(
    [].concat(...seedArray.fill(null).map(_ => {
      return [Math.random() * sizing - sizing/2, defaultY, Math.random() * sizing - sizing/2,]
    }))
  );

  // itemSize = 3 because there are 3 values (components) per vertex
  // geometry.setAttribute( 'position', new THREE.BufferAttribute( vertices, 3 ) );
  const lineGeometry = new THREE.BufferGeometry()
  lineGeometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3))
  const lines = new THREE.LineSegments(lineGeometry, lineMaterial)
  scene.add(lines)
  const light = new THREE.PointLight('white')
  scene.add(light)
  // light.position.set(7, 7, 0)
  // light.lookAt(0,0,0)

  // const lighthelper = new THREE.PointLightHelper(light)
  // scene.add(lighthelper)

  // const gridHelper = new THREE.GridHelper(gridSize.height, 10, 'green')
  // scene.add(gridHelper)

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
