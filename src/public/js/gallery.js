import * as THREE from 'three';
import { OrbitControls } from 'OrbitControls';
import { GLTFLoader } from 'GLTFLoader';
import { GET } from './ajax.js';
import * as ImageLoader from './imageLoader.js';


let models = [];
let currentModel;
let currentLights = [];
let container;
let scene, renderer, camera, controls;
let $modelsList;


const createSpotLight = (position=new THREE.Vector3(0, 0, 0), intensity=1, color=0xffffff) => {
    const light = new THREE.SpotLight(color, intensity);
    light.position.set(position.x, position.y, position.z);
    light.angle = Math.PI / 6;
    light.penumbra = 1;
    light.decay = 1;
    light.distance = 0;
    
    light.castShadow = true;
    light.shadow.mapSize.width = 1024;
    light.shadow.mapSize.height = 1024;
    light.shadow.camera.near = 1;
    light.shadow.camera.far = 10;
    light.shadow.focus = 1;

    return light;
};


export async function load() {
    container = document.getElementById('model-viewer');
    $modelsList = document.body.querySelector('#side-controls ul');

    window.addEventListener('resize', onWindowResize, false);


    scene = new THREE.Scene();

    scene.background = new THREE.Color(0xeeeeee);

    camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
    camera.position.set(6, 5, 6);

    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(container.clientWidth, container.clientHeight);

    container.appendChild(renderer.domElement);

    controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.target.set(0, 3, 0);

    const aLight = new THREE.AmbientLight(0xffffff, .8);
    scene.add(aLight);


    models = await GET('/models');

    models.sort((a, b) => a.name.localeCompare(b.name));
    
    models.forEach(async (model, i) => {
        models[i].model = await loadModel(model.id);

        const $li = document.createElement('li');
        const $liImg = document.createElement('div');
        const $liName = document.createElement('span');

        $liImg.classList.add('img');
        $liImg.dataset.img = `/static/thumbnails/${model.id}.png`;

        $liName.textContent = model.name;

        $li.append($liImg, $liName);

        models[i].$el = $li;

        ImageLoader.loadImages($li);

        $li.addEventListener('click', () => {

            if(currentModel) {
                scene.remove(currentModel);
            }

            currentModel = models[i].model;

            for(const light of currentLights) {
                scene.remove(light);
            }

            currentLights = [];

            for(const light of model.lights) {
                const l = createSpotLight(new THREE.Vector3(light[0][0], light[0][1], light[0][2]), light[1]);
                currentLights.push(l);
                scene.add(l);
            }

            scene.add(currentModel);

            const $descContainer = document.querySelector('#side-description');
            const $titleName = $descContainer?.querySelector('#description-title');
            const $desc = $descContainer?.querySelector('#description-text');

            if($titleName) {
                $titleName.textContent = model.name;
            }

            if($desc) {
                $desc.innerHTML = model.description;
            }

            if($descContainer) {
                if(window.getComputedStyle($descContainer).opacity === "0") {
                    $descContainer.style.opacity = 1;
                }
            }
        });

        $modelsList.appendChild($li);
    });
}

export function start() {
    onWindowResize();
    animate();
}


function onWindowResize() {
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);
    render();
}

function animate() {
    requestAnimationFrame(animate);
    controls.update();

    if(currentModel) {
        currentModel.rotation.y += 0.001;
    }

    render();
}

function render() {
    renderer.render(scene, camera);
}



function loadModel(modelPath) {
    return new Promise((res, rej) => {
        const loader = new GLTFLoader();

        loader.load(`/static/models/${modelPath}.glb`, gltf => {
            const m = gltf.scene;
            
            m.children[0].material.side = THREE.DoubleSide;

            m.scale.set(1, 1, 1);
            m.position.set(0, 0, 0);
            m.rotation.set(0, 0, 0);
            m.castShadow = true;
            m.receiveShadow = true;

            res(m);
        });
    });
}