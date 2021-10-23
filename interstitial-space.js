// Ensure ThreeJS is in global scope for the 'examples/'
global.THREE = require("three");

// Include any additional ThreeJS examples below
require("three/examples/js/controls/OrbitControls");

const canvasSketch = require("canvas-sketch");
const random = require('canvas-sketch-util/random')

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

let secondsTracker = 0

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
    color: 0x121212,
    linewidth: 1.5,
  });

  const defaultY = 2
  const halfAnEdge = gridSize.height / 2
  const standardDeviation = halfAnEdge * 0.1
  const intialNOLines = 1000
  const extraNOLines = 3000
  const seedArray = new Array(intialNOLines)

  const vertices = new Float32Array(intialNOLines * extraNOLines * 3 * 2)
  const lineGeometry = new THREE.BufferGeometry()
  lineGeometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3))
  let counter = 0
  seedArray.fill(null).forEach((_, index) => {
    let randomX = random.gaussian(0, standardDeviation)
    randomX = randomX <= 0 ? -halfAnEdge - randomX : halfAnEdge - randomX
    let randomZ = random.range(-halfAnEdge, halfAnEdge)
    // let randomZ = random.range(-halfAnEdge, halfAnEdge)
    randomZ = randomZ <= 0 ? -halfAnEdge - randomZ : halfAnEdge - randomZ
    const position = new THREE.Vector3(randomX, 0, randomZ)
    const otherPosition = position.multiply(
      new THREE.Vector3(halfAnEdge * 0.5, 0, 0)
    )
    // make segments smaller by bringing positions closer together.
    vertices[counter ++] = randomX
    vertices[counter ++] = defaultY
    vertices[counter ++] = randomZ
    vertices[counter ++] = otherPosition.x
    vertices[counter ++] = defaultY
    vertices[counter ++] =  otherPosition.z
  })

  const lines = new THREE.LineSegments(lineGeometry, lineMaterial)
  scene.add(lines)
  const light = new THREE.PointLight('white')
  scene.add(light)
  // light.position.set(7, 7, 0)
  // light.lookAt(0,0,0)

  // const lighthelper = new THREE.PointLightHelper(light)
  // scene.add(lighthelper)

  // const gridHelper = new THREE.GridHelper(gridSize.height, 10, 'green', 'red')
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
      const roundedTime = parseInt(time)
      if (secondsTracker < roundedTime) {
        secondsTracker = roundedTime
        // grow existing lines and kill some of them.
        //sample 3 random lines from the set and extend them:
      }
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
