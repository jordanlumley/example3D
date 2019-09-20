// var config = {
//     type: Phaser.CANVAS,
//     width: window.innerWidth,
//     height: window.innerHeight,
//     backgroundColor: '#ffffff',
//     scene: {
//         preload: preload,
//         create: create,
//     }
// };

// var game = new Phaser.Game(config);

// var anim;
// var sprite;

// function preload() {
//     this.load.spritesheet('mummy', 'assets/runningStickFigure.png', { frameWidth: 75, frameHeight: 125 });
// }

// function create() {
//     var config = {
//         key: 'walk',
//         frames: this.anims.generateFrameNumbers('mummy'),
//         frameRate: 10,
//         yoyo: false,
//         repeat: -1
//     };

//     anim = this.anims.create(config);

//     sprite = this.add.sprite(400, 300, 'mummy').setScale(1);

//     sprite.anims.load('walk');

//     //  Debug text

//     this.input.keyboard.on('keydown_SPACE', function (event) {

//         sprite.anims.play('walk');

//     });

//     this.input.keyboard.on('keydown_P', function (event) {

//         if (sprite.anims.isPaused) {
//             sprite.anims.resume();
//         }
//         else {
//             sprite.anims.pause();
//         }

//     });

//     this.input.keyboard.on('keydown_R', function (event) {

//         sprite.anims.restart();

//     });

// }

var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

scene.background = new THREE.Color('#FFFFF')

var renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

camera.position.z = 200;

var controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.campingFactor = 0.25;
controls.enableZoom = true;

var keyLight = new THREE.DirectionalLight(new THREE.Color('hsl(30, 100%, 75%)', 1.0));
keyLight.position.set(-100, 0, 100);

var fillLight = new THREE.DirectionalLight(new THREE.Color('hsl(240, 100%, 75%)', 0.75));
fillLight.position.set(100, 0, 100);

var backLight = new THREE.DirectionalLight(new THREE.Color('hsl(30, 100%, 75%)', 1.0));
backLight.position.set(100, 0, -100).normalize();

scene.add(keyLight);
scene.add(fillLight);
scene.add(backLight);

var loader = new THREE.GLTFLoader();

loader.load('assets/mesh/dude.glb', function (gltf) {

    console.log(gltf)

    scene.add(gltf.scene);

}, undefined, function (error) {

    console.error(error);

});

var animate = function () {
    requestAnimationFrame(animate);

    controls.update();

    renderer.render(scene, camera);
};

animate();