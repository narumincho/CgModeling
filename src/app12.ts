import * as THREE from "three";
import { GUI } from "dat.gui";
import "three/examples/js/controls/orbitControls";

/**
 * @author 17FI082 鳴海秀人
 * @description CGモデリングおよび演習 第9回 の 課題12
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

const option = {
    num: 29,
    transparent: false,
    opacity: 0
};

const createCloud = (num: number): THREE.Points => {
    const geometry = new THREE.Geometry();
    const side = num ** (1 / 3);
    for (let x = 0; x < side; x++) {
        for (let y = 0; y < side; y++) {
            for (let z = 0; z < side; z++) {
                geometry.vertices.push(
                    new THREE.Vector3(
                        (x - side / 2) * 10,
                        (y - side / 2) * 10,
                        (z - side / 2) * 10
                    )
                );
                geometry.colors.push(new THREE.Color(Math.random() * 0x00ffff));
            }
        }
    }
    return new THREE.Points(
        geometry,
        new THREE.PointsMaterial({ size: 4, vertexColors: THREE.VertexColors })
    );
};

let cloud: THREE.Points = createCloud(option.num);
scene.add(cloud);
const gui = new GUI();
gui.domElement.style.position = "absolute";
gui.add(option, "num", 9, 10000000).onChange(() => {
    scene.remove(cloud);
    cloud = createCloud(option.num);
    scene.add(cloud);
});
gui.add(option, "transparent").onChange(() => {
    (cloud.material as THREE.Material).transparent = option.transparent;
});
gui.add(option, "opacity", 0, 1, 0.001).onChange(() => {
    (cloud.material as THREE.Material).opacity = option.opacity;
});

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
    100000
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
