import * as THREE from "three";
import { GUI } from "dat.gui";
import "three/examples/js/controls/orbitControls";

/**
 * @author 17FI082 鳴海秀人
 * @description CGモデリングおよび演習 第8回 の 課題10
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

const scene: THREE.Scene = new THREE.Scene();
scene.add(new THREE.AxesHelper(25));

const shape = (count: number): THREE.Shape => {
    const shape = new THREE.Shape();
    const r = 50;
    shape.moveTo(r, 0);
    for (let i = 0; i <= count; i++) {
        const angle = (i * Math.PI * 2) / count;
        const miniAngle = ((i + 0.5) * Math.PI * 2) / count;
        shape.quadraticCurveTo(
            (Math.cos(miniAngle) * r) / 3,
            (Math.sin(miniAngle) * r) / 3,
            Math.cos(angle) * r,
            Math.sin(angle) * r
        );
    }
    return shape;
};

const setting = {
    depth: 5,
    bevelThickness: 7,
    bevelSize: 2,
    count: 7
};

let extrudeMesh: THREE.Mesh;
let extrudeLine: THREE.LineSegments;
const disposeAndSetExtrude = () => {
    scene.remove(extrudeMesh);
    scene.remove(extrudeLine);
    setExtrude();
};

const setExtrude = (): void => {
    const geometry = new THREE.ExtrudeGeometry(shape(setting.count), {
        depth: setting.depth,
        bevelThickness: setting.bevelThickness,
        bevelSize: setting.bevelSize
    });
    extrudeMesh = new THREE.Mesh(
        geometry,
        new THREE.MeshPhongMaterial({
            color: 0x156289,
            emissive: 0x072534,
            side: THREE.DoubleSide,
            flatShading: true
        })
    );
    extrudeLine = new THREE.LineSegments(
        geometry,
        new THREE.LineBasicMaterial({
            color: 0xffffff,
            transparent: true,
            opacity: 0.5
        })
    );
    scene.add(extrudeMesh, extrudeLine);
};
setExtrude();

const gui = new GUI();
gui.domElement.style.position = "absolute";
gui.add(setting, "count", 3, 19, 1).onChange(disposeAndSetExtrude);
gui.add(setting, "depth", 0, 20).onChange(disposeAndSetExtrude);
gui.add(setting, "bevelThickness", 0, 10).onChange(disposeAndSetExtrude);
gui.add(setting, "bevelSize", 0, 10).onChange(disposeAndSetExtrude);

const renderer: THREE.WebGLRenderer = new THREE.WebGLRenderer({
    canvas: canvasElement
});
const canvasWidth = canvasElement.clientWidth;
const canvasHeight = canvasElement.clientHeight;
renderer.setSize(canvasWidth, canvasHeight, false);
renderer.setClearColor(new THREE.Color(0x495ed));
renderer.shadowMap.enabled = true;
// カメラの設定
const camera = new THREE.PerspectiveCamera(
    75,
    canvasWidth / canvasHeight,
    0.1,
    1000
);
camera.position.set(20, 50, 40);
camera.lookAt(new THREE.Vector3(0, 0, 0));

const orbitControls = new THREE.OrbitControls(camera, canvasElement);

const update = (): void => {
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
