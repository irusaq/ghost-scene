// ========================
// Sophie Thorpe and Indira Ruslanova
// Assigment: Final Project
// Last Updated: 5/8/2025
// This is the scene for the final project
// This scene includes a ghost, graves, 
// candles, and a surrounding fence
// ========================

// ========================
// Import Libraries
// ========================
import * as THREE from 'three';
import { TW } from 'tw';

console.log(
    `Loaded Three.js version 
    ${THREE.REVISION}`
);

//For debugging
globalThis.THREE = THREE;
globalThis.TW = TW;

//Parameters
const params = {
    groundSize: 9,
    graveWidth: 0.5,
    graveHeight: 0.9,
    graveDepth: 1,
    fenceHeight: 1.2,
    picketWidth: 0.1,
    picketDepth: 0.2,
    picketSpacing: 0.15,
};

// ========================
// Scene Setup
// ========================
var scene = new THREE.Scene();
globalThis.scene = scene;

const renderer = new THREE.WebGLRenderer();
renderer.shadowMap.enabled = true;

// ========================
// Camera Setup
// ========================
const state = TW.cameraSetup(renderer, scene, 
    {
        minx: -params.groundSize / 2 - 2,
        maxx: params.groundSize / 2 + 2,
        miny: 0, maxy: 12,
        minz: -params.groundSize / 2 - 2,
        maxz: params.groundSize / 2 + 2
});

//Camera
const camera = new THREE.PerspectiveCamera(
    60, window.innerWidth / window.innerHeight, 
    1, 1000
);
camera.position.set(5, 5, 5);
camera.lookAt(scene.position);
scene.add(camera);

renderer.render(scene, camera);
TW.mainInit(renderer, scene);

//Background color
const backgroundColor = "#3b3b3b";

//Fog for spookyness
scene.fog = new THREE.Fog("#3b3b3b", 10, 20);
renderer.setClearColor(backgroundColor);

// ========================
// Fence Creation
// ========================
const textureLoader = new THREE.TextureLoader();
//Possible fence texture will be added for final 
//(we do also like the all black)
//const fenceTexture = textureLoader.load
//('fence.jpg');

/*
 * Create one side of a fence made of pickets 
 * and a top rail
 * length - Total length of the fence
 * xpos - X offset for the top rail
 * returns - Fence segment
 */
function makeFence(length, xpos) {
    const fence = new THREE.Group();
    const picketG = new THREE.BoxGeometry(
        params.picketWidth, 
        params.fenceHeight, 
        params.picketDepth
    );
    const picketM = new THREE.MeshStandardMaterial
    (
        { color: "black" }
    );
    const numPickets = Math.floor(
        length / (params.picketWidth 
        + params.picketSpacing)
    );

    //Loops the creating of the pickets
    for (let i = 0; i < numPickets; ++i) {
        const picket = new THREE.Mesh(
            picketG, picketM
        );
        picket.castShadow = true;
        picket.receiveShadow = true;

        picket.position.x = 
        i * (params.picketWidth + 
        params.picketSpacing) 
        - (length - params.picketWidth 
        - params.picketSpacing * 
        (numPickets - 1)) / 2;

        fence.add(picket);
    }

    //Top railing of fence
    const railGeom = new THREE.BoxGeometry(
        length, 0.1, 0.2
    );
    const railMat = new THREE.MeshStandardMaterial(
        { color: 0x444444 }
    );
    const topRail = new THREE.Mesh(
        railGeom, railMat
    );

    topRail.position.y = 
    params.fenceHeight / 2 + 0.05;

    topRail.position.x = xpos
    fence.add(topRail);

    return fence;
}

//Adding 4 fences to the scene (front, back, 
//left, right)

//Length
const fenceLength = params.groundSize;

//Front
const fenceFront = makeFence(
    fenceLength, 2.5
);
fenceFront.position.set(
    -2.5, params.fenceHeight / 2, 
    params.groundSize / 2
);
scene.add(fenceFront);

//Back
const fenceBack = makeFence(
    fenceLength, 2.5
);
fenceBack.position.set(
    -2.5, params.fenceHeight / 2, 
    -params.groundSize / 2
);
scene.add(fenceBack);

//Left
const fenceLeft = makeFence(
    fenceLength, 2.5
);

fenceLeft.rotation.y = 
Math.PI / 2;

fenceLeft.position.set(
    -params.groundSize / 2, 
    params.fenceHeight / 2, 2.5
);
scene.add(fenceLeft);

//Right
const fenceRight = makeFence(
    fenceLength,2.5
);

fenceRight.rotation.y = 
Math.PI / 2;

fenceRight.position.set(
    params.groundSize / 2, 
    params.fenceHeight / 2, 2.5
);
scene.add(fenceRight);

// ========================
// Grave Creation
// ========================
const graveTexture = 
textureLoader.load('grave_cs307.jpg');

/*
 * Creates a single grave with a box 
 * base and curved top
 * 
 * 
 * width - Width of the grave base.
 * height - Height of the grave base.
 * depth - Depth of the grave base.
 * returns fullGrave - The 
 * assembled grave mesh.
 */
function createGrave(width, height, depth) {
    //Creates individual graves
    const materials = [
        new THREE.MeshPhongMaterial(
            { map: graveTexture }
        ),     
        new THREE.MeshPhongMaterial(
            { map: graveTexture }
        ),       
        new THREE.MeshPhongMaterial(
            { color: 0x666666 }
        ), 
        new THREE.MeshPhongMaterial(
            { color: 0x666666 }
        ),       
        new THREE.MeshPhongMaterial(
            { color: 0x666666 }
        ),       
        new THREE.MeshPhongMaterial(
            { color: 0x666666 }
        )        
    ];

    //3D object for all of the individual grave
    const fullGrave = new THREE.Object3D();
    const base = new THREE.Mesh(
        new THREE.BoxGeometry(
            width, height, depth
        ), materials
    );
    fullGrave.add(base);

    //Top curved part of the grave
    const top = new THREE.Mesh(
        new THREE.CylinderGeometry(
            width / 2, width / 2, 
            depth, 8, 1, false, 
            0, Math.PI),
        new THREE.MeshPhongMaterial(
            { color: 0x666666 }
        )
    );
    top.rotation.set(
        Math.PI/2, Math.PI/2, 0
    );
    top.position.y = height - width;
    fullGrave.add(top);

    return fullGrave;
}

/*
 * Creates a row of four graves, 
 * spaced vertically
 * 
 * xpos - The X position of the row.
 * returns row - A group of four graves.
 */
function createGraveRow(xpos) {
    //Creates a row of graves and aligns them 
    //based on x position
    const row = new THREE.Object3D();
    for (let i = 0; i < 4; i++) {
        const grave = createGrave(
            params.graveWidth,
            params.graveHeight, 
            params.graveDepth
        );
        grave.position.set(
            xpos, params.graveHeight / 2, 
            -3 + i * 2
        );
        row.add(grave);
    }
    return row;
}

// ========================
// Ground and Lighting
// ========================
const ground = new THREE.Mesh(
    new THREE.PlaneGeometry(
        params.groundSize, params.groundSize
    ),
    new THREE.MeshPhongMaterial(
        { color: 0x3f7f3f}
    )
);
ground.rotation.x = -Math.PI / 2;
ground.position.y = 0;
scene.add(ground);

//Lights

//Ambient light 
scene.add(new THREE.AmbientLight(0xffffff, 0.6));

//Main directional light
const directionalLight = 
new THREE.DirectionalLight(0xffffff, 0.8);

directionalLight.position.set(10, 15, 10);
scene.add(directionalLight);

// ========================
// Ghost Animation
// ========================
const clock = new THREE.Clock();
let isAnimating = false;
let animationId = null; 

/*
 * Animate ghost movement in a loop
 */
function animate() {
    if (!isAnimating) return;
    animationId = requestAnimationFrame(animate);

    const t = clock.getElapsedTime();
    const loopRange = params.groundSize / 2;
    const loopSpeed = Math.sin(t); 

    ghost1.position.x = loopRange * loopSpeed;
    ghost1.position.z = loopRange * loopSpeed;
    ghost1.position.y = 2.5 + Math.sin(t * 4) * 0.5;
    ghost1.rotation.y += 0.01;

    ghost2.position.x = -loopRange * loopSpeed;
    ghost2.position.z = loopRange * loopSpeed;
    ghost2.position.y = 2.5 + Math.cos(t * 4) * 0.5;
    ghost2.rotation.y -= 0.01;
}

// ========================
// Candle Creation
// ========================
/*
 * Creates a candle with a glowing 
 * flame effect.
 * 
 * The candle consists of:
 * - A white cylindrical base.
 * - An orange flame.
 * - A yellow point light to simulate 
 *   flickering light.
 * 
 * x - The X position of the candle 
 * in the scene.
 * z - The Z position of the candle 
 * in the scene.
 * returns the candle group containing 
 * base, flame, and light.
 */
function createCandle(x, z) {
    const candle = new THREE.Group();

    //Candle base
    const base = new THREE.Mesh(
        new THREE.CylinderGeometry(
            0.1, 0.1, 0.2, 20
        ),
        new THREE.MeshStandardMaterial(
            { color: "white" }
        )
    );
    base.castShadow = true;
    base.receiveShadow = true;
    base.position.y = 0.15;
    candle.add(base);

    //Flame
    const flame = new THREE.Mesh(
        new THREE.SphereGeometry(
            0.05, 8, 8
        ),
        new THREE.MeshBasicMaterial(
            { color: "orange" }
        )
    );
    flame.position.y = 0.35;
    candle.add(flame);

    //Point light to simulate flame glow
    const light = new THREE.PointLight(
        "yellow", 0.8, 2
    );
    light.position.set(0, 0.35, 0);
    light.castShadow = true;
    candle.add(light);

    candle.position.set(x, 0, z);
    return candle;
}

scene.add(createCandle(2, 2));
scene.add(createCandle(-2, 2));
scene.add(createCandle(2, -2));
scene.add(createCandle(-2, -2));
scene.add(createCandle(0, 0));

/*
 * Creates a cartoonish ghost with 
 * a rounded head, wavy skirt,
 * eyes, mouth, and hands. 
 * The skirt's bottom edge is wavy
 * to add ghost-like appearance.
 * 
 * position.x - X coordinate of the ghost.
 * position.y - Y coordinate of the ghost.
 * position.z - Z coordinate of the ghost.
 * returns the completed ghost mesh group.
 */
function createGhost(position = {
    x: 0, y: 0, z: 0 
})
{
    const ghost = new THREE.Group();
  
    const ghostMaterial = new 
    THREE.MeshStandardMaterial(
        {
            color: 0xffffff,
            transparent: true,
            opacity: 0.5,
            emissive: "#2596be",
            roughness: 0.1,
            side: THREE.DoubleSide
        }
    );
  
    //Head
    const headGeo = new 
    THREE.SphereGeometry(
        1, 32, 32, 0, Math.PI * 2, 
        0, Math.PI * 0.5
    );
    const head = new THREE.Mesh(
        headGeo, ghostMaterial
    );
    head.position.y = 1.5;
  
    //Skirt
    const skirtGeo = 
    new THREE.CylinderGeometry(
        1, 1.2, 1.2, 32, 1, true
    );
    const skirt = new THREE.Mesh(
        skirtGeo, ghostMaterial
    );
    skirt.position.y = 0.9;

    //Make bottom edge wavy
    const positionAttr = 
    skirtGeo.attributes.position;
    for (let i = 0; i < positionAttr.count; i++) 
    {
        const y = positionAttr.getY(i);
        //Identify bottom ring by 
        //checking Y position
        if (Math.abs(y + 0.6) < 0.01) { 
            //bottom Y is -0.6 (half of 1.2 height)
            const x = positionAttr.getX(i);
            const z = positionAttr.getZ(i);
            const angle = Math.atan2(z, x);
            //6 waves
            const offset = 0.1 * Math.sin(6 * angle);
            positionAttr.setY(i, y + offset);
        }
    }
    positionAttr.needsUpdate = true;

    //Eyes
    const eyeGeo = 
    new THREE.SphereGeometry(0.1, 16, 16);

    const eyeMat = 
    new THREE.MeshStandardMaterial(
        { color: 0x000000 }
    );

    const leftEye = 
    new THREE.Mesh(eyeGeo, eyeMat);

    const rightEye = 
    new THREE.Mesh(eyeGeo, eyeMat);

    const faceZ = 0.95;

    leftEye.position.set(
        -0.25, 1.65, faceZ
    );

    rightEye.position.set(
        0.25, 1.65, faceZ
    );
  
    //Oval mouth
    const mouthGeo = 
    new THREE.SphereGeometry(0.1, 16, 16);

    const mouth = 
    new THREE.Mesh(mouthGeo, eyeMat);

    mouth.scale.set(
        0.6, 1.4, 0.6
    ); // vertically stretched oval

    mouth.position.set(
        0, 1.4, faceZ + 0.07
    );
  
    //Hands
    const handGeo = 
    new THREE.SphereGeometry(0.25, 16, 16);

    const leftHand = 
    new THREE.Mesh(handGeo, ghostMaterial);

    const rightHand = 
    new THREE.Mesh(handGeo, ghostMaterial);

    leftHand.position.set(-1, 1.2, 0.3);
    rightHand.position.set(1, 1.2, 0.3);
  
    ghost.add(
        head, skirt, leftEye, 
        rightEye, mouth, leftHand, 
        rightHand);

    ghost.position.set(
        position.x, 
        position.y, 
        position.z
    );

    scene.add(ghost);

    return ghost;
  }  
  
  const ghost2 = createGhost(
    { x: -2, y: 0, z: 0 }
  );
  const ghost1 = createGhost(
    { x: 2, y: 0, z: 0 }
  );

// ========================
// Sound
// ========================
  const listener = new THREE.AudioListener();
  camera.add(listener);
  
  const sound = new THREE.Audio(listener);
  const audioLoader = new THREE.AudioLoader();
  
  // load but DON'T play yet
  audioLoader.load('spooky.mp3', function(buffer) {
      sound.setBuffer(buffer);
      sound.setLoop(false);
      sound.setVolume(0.3);
  });
  
// ========================
// Keyboard Callbacks
// ========================
//Toggle ghost animation on 0
TW.setKeyboardCallback('0', () => {
    isAnimating = !isAnimating;
    if (isAnimating) {
      clock.start(); 
      animate();
    } else {
      cancelAnimationFrame(animationId);
      clock.stop();
    }
  },"Toggle ghost animation");
  
//For grave callbacks
const graveRows = {
    row1: null,
    row2: null,
    row3: null,
    row4: null,
};

//Toggle grave rows
TW.setKeyboardCallback('1', () => {
    if (graveRows.row1) {
        scene.remove(graveRows.row1);
        graveRows.row1 = null;
    } else {
        graveRows.row1 = createGraveRow(3);
        scene.add(graveRows.row1);
    }
},"Toggle grave row 1");

TW.setKeyboardCallback('2', () => {
    if (graveRows.row2) {
        scene.remove(graveRows.row2);
        graveRows.row2 = null;
    } else {
        graveRows.row2 = createGraveRow(1);
        scene.add(graveRows.row2);
    }
},"Toggle grave row 2");

TW.setKeyboardCallback('3', () => {
    if (graveRows.row3) {
        scene.remove(graveRows.row3);
        graveRows.row3 = null;
    } else {
        graveRows.row3 = createGraveRow(-1);
        scene.add(graveRows.row3);
    }
},"Toggle grave row 3");

TW.setKeyboardCallback('4', () => {
    if (graveRows.row4) {
        scene.remove(graveRows.row4);
        graveRows.row4 = null;
    } else {
        graveRows.row4 = createGraveRow(-3);
        scene.add(graveRows.row4);
    }
},"Toggle grave row 4");

//Turn the spooky sound on s
TW.setKeyboardCallback('s', () => {
    if (sound.buffer && !sound.isPlaying) {
        sound.play();
    } else {
        console.warn(
        "Sound not ready or already playing."
        );
    }
}, "Play spooky sound");


