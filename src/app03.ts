import * as THREE from "three";
import "three/examples/js/controls/orbitControls";

/**
 * @author 17FI082 鳴海秀人
 * @description CGモデリングおよび演習 第3回 の 課題
 */

(document.querySelector("html") as HTMLHtmlElement).style.height = "100%";
document.body.style.width = "100%";
document.body.style.height = "100%";
document.body.style.margin = "0";
const canvasElement: HTMLCanvasElement = document.createElement("canvas");
document.body.appendChild(canvasElement);
canvasElement.style.display = "block";
canvasElement.style.width = "100%";
canvasElement.style.height = "100%";
canvasElement.style.margin = "0";

/**
 * ランダムなMesh(物体)のリストを生成する
 * @param number 個数
 */
const createRandomMeshList = (number: number): Array<{ mesh: THREE.Mesh, speed: number, axis: THREE.Vector3 }> => {
    const list: Array<{ mesh: THREE.Mesh, speed: number, axis: THREE.Vector3 }> = [];
    for (let i = 0; i < number; i++) {
        list.push({
            mesh: randomMesh(),
            speed: Math.random(),
            axis: new THREE.Vector3(Math.random(), Math.random(), Math.random()).normalize()
        });
    }
    return list;
}

/**
 * ランダムなMesh(物体)を生成する
 */
const randomMesh = (): THREE.Mesh => {
    const mesh = new THREE.Mesh(randomGeometry(), randomMaterial());
    mesh.position.copy(new THREE.Vector3(20 - Math.random() * 40, 0, 20 - Math.random() * 40));
    mesh.castShadow = true;
    return mesh;
}

/**
 * ランダムなGeometry(形状)を生成する
 */
const randomGeometry = (): THREE.Geometry => {
    switch (Math.floor(Math.random() * 6)) {
        case 0:
            return new THREE.BoxGeometry(Math.random() * 5, Math.random() * 5, Math.random() * 5);
        case 1:
            const circle = new THREE.CircleGeometry(1, 32)
            circle.scale(0.5 + Math.random(), 0.5 + Math.random(), 0.5 + Math.random());
            return circle;
        case 2:
            const cone = new THREE.ConeGeometry(1, 2 + Math.random() * 10, 32);
            cone.scale(0.5 + Math.random(), 0.5 + Math.random(), 0.5 + Math.random());
            return cone;
        case 3:
            const cylinder = new THREE.CylinderGeometry(2, 2, 20, 32);
            cylinder.scale(0.1 + Math.random() * 0.2, 0.1 + Math.random() * 0.2, 0.1 + Math.random() * 0.2);
            return cylinder;
        case 4:
            const torusKnot = new THREE.TorusKnotGeometry(Math.random() * 10, 3, 100, 16);
            torusKnot.scale(0.1 + Math.random() * 0.2, 0.1 + Math.random() * 0.2, 0.1 + Math.random() * 0.2);
            return torusKnot;
        default:
            return new THREE.DodecahedronGeometry(2, 5);
    }
}

/**
 * ランダムなMaterial(見え方)を生成する
 */
const randomMaterial = (): THREE.Material =>
    new THREE.MeshLambertMaterial({ color: Math.random() * 0xffffff });

const scene: THREE.Scene = new THREE.Scene();

const meshList = createRandomMeshList(60);
for (const { mesh } of meshList) {
    scene.add(mesh);
}

// 地面の設定
const ground = new THREE.Mesh(new THREE.PlaneGeometry(40, 40, 10), new THREE.MeshLambertMaterial({ color: 0x44ffaa }));
ground.rotateX(-Math.PI * 0.5);
ground.position.copy(new THREE.Vector3(0, -3, 0));
ground.receiveShadow = true;
scene.add(ground);

// ライトの設定
const light: THREE.Light = new THREE.DirectionalLight(0xffffff)
light.position.copy(new THREE.Vector3(1, 10, 1));
light.castShadow = true;
light.shadow.camera = new THREE.OrthographicCamera(-30, 30, -30, 30);
scene.add(light);

const renderer: THREE.WebGLRenderer = new THREE.WebGLRenderer({ canvas: canvasElement });

const width = canvasElement.clientWidth;
const height = canvasElement.clientHeight;
renderer.setSize(width, height, false);
renderer.setClearColor(new THREE.Color(0x495ed));
renderer.shadowMap.enabled = true;

//カメラの設定
const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
camera.position.copy(new THREE.Vector3(-30, 20, 20));
camera.lookAt(new THREE.Vector3(0, 0, 0));

const orbitControls = new (THREE as any).OrbitControls(camera, canvasElement);

const update = () => {
    for (const { mesh, axis, speed } of meshList) {
        mesh.applyQuaternion(new THREE.Quaternion().setFromAxisAngle(axis, speed * 0.2));
    }
    orbitControls.update();
    renderer.setSize(canvasElement.clientWidth, canvasElement.clientHeight, false);

    camera.aspect = canvasElement.clientWidth / canvasElement.clientHeight;
    camera.updateProjectionMatrix()
    renderer.render(scene, camera);
    requestAnimationFrame(update);
}
update();
