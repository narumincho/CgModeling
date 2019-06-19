import * as THREE from "three";
import "three/examples/js/controls/orbitControls";
import { GUI } from "dat.gui";
import Stats = require("stats.js");

/**
 * @author 17FI082 鳴海秀人
 * @description CGモデリングおよび演習 第10回 の 課題15
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

const makeGroup = (count: number): THREE.Group => {
    const group = new THREE.Group();
    const material = new THREE.MeshNormalMaterial();
    makeGeometryList(count).forEach(({ geometry, matrix }) => {
        const mesh = new THREE.Mesh(geometry, material);
        mesh.applyMatrix(matrix);
        group.add(mesh);
    });
    return group;
};
const makeMergedMesh = (count: number): THREE.Mesh => {
    const geometryBase = new THREE.Geometry();
    makeGeometryList(count).forEach(({ geometry, matrix }) => {
        geometryBase.merge(geometry, matrix);
    });
    return new THREE.Mesh(geometryBase, new THREE.MeshNormalMaterial());
};
const makeGeometryList = (
    count: number
): Array<{ geometry: THREE.Geometry; matrix: THREE.Matrix4 }> => {
    const result: Array<{
        geometry: THREE.Geometry;
        matrix: THREE.Matrix4;
    }> = [];
    const sideCount = count ** (1 / 3);
    for (let x = 0; x < sideCount; x++) {
        for (let y = 0; y < sideCount; y++) {
            for (let z = 0; z < sideCount; z++) {
                result.push({
                    geometry: randomGeometry(),
                    matrix: new THREE.Matrix4()
                        .makeTranslation(
                            -sideCount * 10 + x * 20,
                            -sideCount * 10 + y * 20,
                            -sideCount * 10 + z * 20
                        )
                        .multiply(
                            new THREE.Matrix4().makeRotationAxis(
                                new THREE.Vector3(
                                    Math.random(),
                                    Math.random(),
                                    Math.random()
                                ),
                                Math.random() * 2 * Math.PI
                            )
                        )
                });
            }
        }
    }
    return result;
};
const randomGeometry = (): THREE.Geometry => {
    switch ((Math.random() * 2) | 0) {
        case 0:
            return new THREE.BoxGeometry(
                5 + Math.random() * 5,
                5 + Math.random() * 5,
                5 + Math.random() * 5
            );
        default:
            return new THREE.ConeGeometry(
                5 + Math.random() * 5,
                5 + Math.random() * 10,
                3 + Math.random() * 5
            );
    }
};
const option = {
    merged: false,
    count: 1000
};
const targetFromOption = (): THREE.Mesh | THREE.Group => {
    if (option.merged) {
        return makeMergedMesh(option.count);
    }
    return makeGroup(option.count);
};
let target: THREE.Mesh | THREE.Group = targetFromOption();
scene.add(target);

const gui = new GUI();
gui.domElement.style.position = "absolute";
gui.add(option, "merged").onChange(() => {
    scene.remove(target);
    target = targetFromOption();
    scene.add(target);
});
gui.add(option, "count", 9, 10000).onChange(() => {
    scene.remove(target);
    target = targetFromOption();
    scene.add(target);
});
const stats = new Stats();
stats.dom.style.position = "absolute";
stats.dom.style.left = "";
stats.dom.style.right = "5px";
stats.dom.style.top = "5px";
document.body.appendChild(stats.dom);
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
camera.position.set(100, 200, 200);
camera.lookAt(new THREE.Vector3(0, 0, 0));

const orbitControls = new (THREE as any).OrbitControls(camera, canvasElement);

const axis = new THREE.Vector3(Math.random(), Math.random(), Math.random());
const update = (): void => {
    target.rotateOnAxis(axis, 0.01);
    orbitControls.update();

    renderer.setSize(
        canvasElement.clientWidth,
        canvasElement.clientHeight,
        false
    );

    camera.aspect = canvasElement.clientWidth / canvasElement.clientHeight;
    camera.updateProjectionMatrix();
    renderer.render(scene, camera);

    stats.update();
    requestAnimationFrame(update);
};
update();
