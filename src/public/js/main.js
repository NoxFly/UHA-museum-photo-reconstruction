import * as THREE from 'three';
import { OrbitControls } from 'OrbitControls';
import { GLTFLoader } from 'GLTFLoader';


let model;


const container = document.getElementById('model-viewer');

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
camera.position.x = 5;
camera.position.y = 5;
camera.position.z = 5;

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(container.clientWidth, container.clientHeight);

container.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;


// scene.add(new THREE.AxesHelper(5));


const sLight = new THREE.SpotLight(0xffffff, 2000);
sLight.position.set(-30, 30, 30);
sLight.angle = Math.PI / 6;
sLight.penumbra = 1;
sLight.decay = 2;
sLight.distance = 0;

sLight.castShadow = true;
sLight.shadow.mapSize.width = 1024;
sLight.shadow.mapSize.height = 1024;
sLight.shadow.camera.near = 1;
sLight.shadow.camera.far = 10;
sLight.shadow.focus = 1;

scene.add(sLight);

const sLightBlue = new THREE.SpotLight(0xffffff, 1000);
sLightBlue.position.set(30, -30, -30);
sLightBlue.angle = Math.PI / 6;
sLightBlue.penumbra = 1;
sLightBlue.decay = 2;
sLightBlue.distance = 0;

sLightBlue.castShadow = true;
sLightBlue.shadow.mapSize.width = 1024;
sLightBlue.shadow.mapSize.height = 1024;
sLightBlue.shadow.camera.near = 1;
sLightBlue.shadow.camera.far = 10;
sLightBlue.shadow.focus = 1;

scene.add(sLightBlue);

const aLight = new THREE.AmbientLight(0xffffff, .8);

scene.add(aLight);


window.addEventListener('resize', onWindowResize, false);


function onWindowResize() {
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);
    render();
}

function animate() {
    requestAnimationFrame(animate);
    controls.update();

    // if(model) {
    //     model.rotation.y += 0.01;
    // }

    render();
}

function render() {
    renderer.render(scene, camera);
}

animate();


const $modelsList = document.body.querySelector('#side-controls ul');

$modelsList.querySelectorAll('li').forEach($li => $li.addEventListener('click', function() {
    const modelPath = this.dataset.model;

    const loader = new GLTFLoader();

    loader.load(`/static/models/${modelPath}`, gltf => {
        if(model) {
            scene.remove(model);
        }

        model = gltf.scene;
        
        model.children[0].material.side = THREE.DoubleSide;

        model.scale.set(1, 1, 1);
        model.position.set(0, 0, 0);
        model.rotation.set(0, 0, 0);
        model.castShadow = true;
        model.receiveShadow = true;

        scene.add(model);
    });
}));