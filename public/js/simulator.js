var SCREEN_WIDTH = window.innerWidth;
var SCREEN_HEIGHT = window.innerHeight;

var controls;
var camera, scene;
var canvasRenderer, webglRenderer;

var container, mesh, geometry, plane;

var windowHalfX = window.innerWidth / 2;
var windowHalfY = window.innerHeight / 2;

var group;


init();
render();

function init() {
    container = document.createElement('div');
    document.body.appendChild(container);

    group = new THREE.Group();

    camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 10000);
    camera.position.x = 45;
    camera.position.y = 25;
    camera.position.z = 50;


    scene = new THREE.Scene();

    // var groundMaterial = new THREE.MeshPhongMaterial({
    //     color: 0x6C6C6C
    // });
    // plane = new THREE.Mesh(new THREE.PlaneGeometry(1500, 1500), groundMaterial);
    // plane.rotation.x = -Math.PI / 2;
    // plane.receiveShadow = true;

    scene.add(plane);

    // LIGHTS
    scene.add(new THREE.AmbientLight(0x666666));

    var light;

    light = new THREE.DirectionalLight(0xdfebff, 1.75);
    light.position.set(100, 200, 100);
    light.position.multiplyScalar(1.3);

    light.castShadow = true;
    light.shadowCameraVisible = true;

    light.shadowMapWidth = 512;
    light.shadowMapHeight = 512;

    var d = 200;

    light.shadowCameraLeft = -d;
    light.shadowCameraRight = d;
    light.shadowCameraTop = d;
    light.shadowCameraBottom = -d;

    light.shadowCameraFar = 1000;
    light.shadowDarkness = 0.2;

    var helper = new THREE.DirectionalLightHelper(light, 5);

    scene.add(light);

    var axesHelper = new THREE.AxesHelper(50);

    var size = 100;
    var divisions = 10;
    var gridHelper = new THREE.GridHelper(size, divisions);
    scene.add(gridHelper);

    scene.add(axesHelper);

    // RENDERER
    webglRenderer = new THREE.WebGLRenderer();
    webglRenderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);
    webglRenderer.domElement.style.position = "relative";
    webglRenderer.shadowMapEnabled = true;
    webglRenderer.shadowMapSoft = true;


    container.appendChild(webglRenderer.domElement);
    window.addEventListener('resize', onWindowResize, false);
}

function onWindowResize() {
    windowHalfX = window.innerWidth / 2;
    windowHalfY = window.innerHeight / 2;

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    webglRenderer.setSize(window.innerWidth, window.innerHeight);
}

function render() {
    requestAnimationFrame(render);

    camera.lookAt(scene.position);
    webglRenderer.render(scene, camera);
}

var createTask = function (i, task, taskShape) {
    var loader = new THREE.GLTFLoader();

    loader.load('assets/glb/task.glb', function (gltf) {
        gltf.scene.traverse(function (node) {
            if (node instanceof THREE.Mesh) { node.castShadow = true; }
        });
        // bpmnShape[0].$.id
        // gltf.scene.scale.set(.9, .9, .9)
        gltf.scene.rotation.y = -150;
        gltf.scene.position.x = taskShape[0]["omgdc:Bounds"][0].$.x / 25;
        gltf.scene.position.z = taskShape[0]["omgdc:Bounds"][0].$.y / 25;
        group.add(gltf.scene);
    }, undefined, function (error) {
        console.error(error);
    });
};


$.get('/getxml', function (resp) {
    $.each(resp.definitions.process[0]["task"], function (i, task) {
        var bpmnShape = resp.definitions["bpmndi:BPMNDiagram"][0]["bpmndi:BPMNPlane"][0]["bpmndi:BPMNShape"]
        var taskShape = bpmnShape.filter(function (shape) {
            return shape.$.bpmnElement == task.$.id
        })

        createTask(i, task, taskShape);
    });
    group.up.set(200, 200, 200);
    scene.add(group);
});