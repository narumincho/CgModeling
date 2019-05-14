import * as THREE from "three";
import "three/examples/js/controls/orbitControls";

/**
 * @author 17FI082 鳴海秀人
 * @description CGモデリングおよび演習 第5回 の 課題6
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

const octahedron = new THREE.Mesh(
    new THREE.OctahedronGeometry(),
    new THREE.MeshNormalMaterial()
);
octahedron.scale.copy(new THREE.Vector3(2, 2, 2));
scene.add(octahedron);

const tetrahedron = new THREE.Mesh(
    new THREE.TetrahedronGeometry(),
    new THREE.MeshNormalMaterial()
);
tetrahedron.position.copy(new THREE.Vector3(-5, 0, 0));
tetrahedron.scale.copy(new THREE.Vector3(2, 2, 2));
scene.add(tetrahedron);

const lathe = new THREE.Mesh(
    new THREE.LatheGeometry(
        new Array(10)
            .fill(0)
            .map(
                (_, index): THREE.Vector2 =>
                    new THREE.Vector2(
                        2 - Math.atan((index + 1) / 2),
                        (index - 5) / 2
                    )
            )
    ),
    new THREE.MeshNormalMaterial({ side: THREE.DoubleSide })
);
lathe.position.copy(new THREE.Vector3(5, 0, 0));

scene.add(lathe);

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
camera.position.copy(new THREE.Vector3(0, 10, 10));
camera.lookAt(new THREE.Vector3(0, 0, 0));

const orbitControls = new THREE.OrbitControls(camera, canvasElement);

const octahedronRotateAxis = new THREE.Vector3(
    Math.random(),
    Math.random(),
    Math.random()
);
const tetrahedronRotateAxis = new THREE.Vector3(
    Math.random(),
    Math.random(),
    Math.random()
);
const latheRotateAxis = new THREE.Vector3(
    Math.random(),
    Math.random(),
    Math.random()
);

const update = (): void => {
    octahedron.rotateOnAxis(octahedronRotateAxis, 0.04);
    tetrahedron.rotateOnAxis(tetrahedronRotateAxis, 0.04);
    lathe.rotateOnAxis(latheRotateAxis, 0.04);

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
