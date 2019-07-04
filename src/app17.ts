import * as THREE from "three";
import "three/examples/js/controls/orbitControls";
import * as Physijs from "physijs-webpack";

/**
 * @author 17FI082 鳴海秀人
 * @description CGモデリングおよび演習 第12回 の 課題17
 */
document.documentElement.style.height = "100%";
document.body.style.width = "100%";
document.body.style.height = "100%";
document.body.style.margin = "0";
const canvasElement: HTMLCanvasElement = document.createElement("canvas");
canvasElement.style.display = "block";
canvasElement.style.width = "100%";
canvasElement.style.height = "100%";
canvasElement.style.margin = "0";
document.body.append(canvasElement);

const scene: Physijs.Scene = new Physijs.Scene();
scene.add(new THREE.AxesHelper(25));
scene.setGravity(new THREE.Vector3(0, -2, 0));

scene.add(new THREE.Mesh(new THREE.BoxGeometry(200, 5, 20)));
const dominoFirst = new THREE.Mesh(new THREE.BoxGeometry(2, 50, 5));
dominoFirst.position.setX(-80);
dominoFirst.position.setY(30);
dominoFirst.rotateZ(-0.2);
scene.add(dominoFirst);

for (let i = 0; i < 14; i++) {
    const domino = new THREE.Mesh(new THREE.BoxGeometry(2, 50, 5));
    domino.position.setX(i * 10 - 70);
    domino.position.setY(30);
    scene.add(domino);
}
scene.simulate();
const renderer: THREE.WebGLRenderer = new THREE.WebGLRenderer({
    canvas: canvasElement
});
const canvasWidth = canvasElement.clientWidth;
const canvasHeight = canvasElement.clientHeight;
renderer.setSize(canvasWidth, canvasHeight, false);
renderer.setClearColor(new THREE.Color(0x000000));
renderer.shadowMap.enabled = true;

// カメラの設定
const camera = new THREE.PerspectiveCamera(
    75,
    canvasWidth / canvasHeight,
    0.1,
    100000
);
camera.position.set(120, 30, 60);
camera.lookAt(new THREE.Vector3(0, 0, 0));

const orbitControls = new (THREE as any).OrbitControls(camera, canvasElement);

let count = 0;
const update = (): void => {
    count += 0.01;
    orbitControls.update();

    renderer.setSize(
        canvasElement.clientWidth,
        canvasElement.clientHeight,
        false
    );

    camera.aspect = canvasElement.clientWidth / canvasElement.clientHeight;
    camera.updateProjectionMatrix();
    renderer.render(scene, camera);

    requestAnimationFrame(update);
};
update();
