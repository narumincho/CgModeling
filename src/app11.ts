import * as THREE from "three";
import { GUI } from "dat.gui";
import "three/examples/js/controls/orbitControls";

/**
 * @author 17FI082 鳴海秀人
 * @description CGモデリングおよび演習 第8回 の 課題11
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

const makeCatmullRomCurve3 = (count: number): THREE.CatmullRomCurve3 =>
    new THREE.CatmullRomCurve3(
        new Array(count)
            .fill(0)
            .map(
                () =>
                    new THREE.Vector3(
                        (Math.random() - 0.5) * 50,
                        (Math.random() - 0.5) * 50,
                        (Math.random() - 0.5) * 50
                    )
            )
    );

const setting = {
    segments: 50,
    radius: 2,
    radiusSegments: 5,
    count: 10
};

let mesh: THREE.Mesh;
let line: THREE.LineSegments;
let catmullRomCurve3: THREE.CatmullRomCurve3 = makeCatmullRomCurve3(
    setting.count
);
const disposeAndSetExtrude = () => {
    scene.remove(mesh);
    scene.remove(line);
    setExtrude();
};

const setExtrude = (): void => {
    const geometry = new THREE.TubeGeometry(
        catmullRomCurve3,
        setting.segments,
        setting.radius,
        setting.radiusSegments
    );
    mesh = new THREE.Mesh(
        geometry,
        new THREE.MeshPhongMaterial({
            color: 0x156289,
            emissive: 0x072534,
            side: THREE.DoubleSide,
            flatShading: true
        })
    );
    line = new THREE.LineSegments(
        geometry,
        new THREE.LineBasicMaterial({
            color: 0xffffff,
            transparent: true,
            opacity: 0.5
        })
    );
    scene.add(mesh, line);
};
setExtrude();

const gui = new GUI();
gui.domElement.style.position = "absolute";
gui.add(setting, "count", 3, 100, 1).onChange(() => {
    catmullRomCurve3 = makeCatmullRomCurve3(setting.count);
    disposeAndSetExtrude();
});
gui.add(setting, "segments", 3, 200, 1).onChange(disposeAndSetExtrude);
gui.add(setting, "radius", 0.1, 10).onChange(disposeAndSetExtrude);
gui.add(setting, "radiusSegments", 3, 10, 1).onChange(disposeAndSetExtrude);

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
