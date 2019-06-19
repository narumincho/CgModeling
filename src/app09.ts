import * as THREE from "three";
import { GUI } from "dat.gui";
import "three/examples/js/controls/orbitControls";

/**
 * @author 17FI082 鳴海秀人
 * @description CGモデリングおよび演習 第7回 の 課題9
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

const sphere0 = new THREE.Mesh(
    new THREE.SphereGeometry(),
    new THREE.MeshBasicMaterial({ color: Math.random() * 0xffffff })
);
sphere0.position.set(10, 0, 10);
const sphere1 = new THREE.Mesh(
    new THREE.SphereGeometry(),
    new THREE.MeshBasicMaterial({ color: Math.random() * 0xffffff })
);
sphere1.position.set(0, 0, 10);
const sphere2 = new THREE.Mesh(
    new THREE.SphereGeometry(),
    new THREE.MeshBasicMaterial({ color: Math.random() * 0xffffff })
);
sphere2.position.set(10, 10, 10);
const sphere3 = new THREE.Mesh(
    new THREE.SphereGeometry(),
    new THREE.MeshBasicMaterial({ color: Math.random() * 0xffffff })
);
sphere3.position.set(10, 0, 0);
scene.add(sphere0, sphere1, sphere2, sphere3);

const gui = new GUI();
gui.domElement.style.position = "absolute";
gui.add(sphere1.position, "x", -10, 10);
gui.add(sphere1.position, "y", -10, 10);
gui.add(sphere1.position, "z", -10, 10);
gui.add(sphere2.position, "x", -10, 10);
gui.add(sphere2.position, "y", -10, 10);
gui.add(sphere2.position, "z", -10, 10);

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

const orbitControls = new (THREE as any).OrbitControls(camera, canvasElement);

const newLineMesh = () =>
    new THREE.Line(
        new THREE.BufferGeometry().setFromPoints(
            new THREE.CubicBezierCurve3(
                sphere0.position,
                sphere1.position,
                sphere2.position,
                sphere3.position
            ).getPoints(50)
        ),
        new THREE.LineBasicMaterial({ color: 0xff0000 })
    );

let lineMesh = newLineMesh();
scene.add(lineMesh);

const update = (): void => {
    scene.remove(lineMesh);
    lineMesh = newLineMesh();
    scene.add(lineMesh);
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
