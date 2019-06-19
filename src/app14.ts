import * as THREE from "three";
import "three/examples/js/controls/orbitControls";

/**
 * @author 17FI082 鳴海秀人
 * @description CGモデリングおよび演習 第10回 の 課題14
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

/**
 * 星型のテクスチャを作る
 */
const makeStarTexture = (): THREE.Texture => {
    const sideLength = 256;
    const canvas = document.createElement("canvas");
    canvas.width = sideLength;
    canvas.height = sideLength;
    const context = canvas.getContext("2d") as CanvasRenderingContext2D;
    drawStar(context, sideLength, 0xffffff);
    const texture = new THREE.Texture(canvas);
    texture.needsUpdate = true;
    return texture;
};
/**
 *
 * @param context
 * @param sideLength キャンパスの辺の長さ
 * @param color 塗りつぶしの色
 */
const drawStar = (
    context: CanvasRenderingContext2D,
    sideLength: number,
    color: number
): void => {
    context.clearRect(0, 0, sideLength, sideLength);

    const radius = sideLength / 2 - 4;
    context.beginPath();
    context.lineWidth = 1;
    context.strokeStyle = "#" + color.toString(16).padStart(6, "0");
    context.fillStyle = "#" + color.toString(16).padStart(6, "0");
    const starCount = 5;
    for (let i = 0; i < starCount; i++) {
        const angle = -Math.PI / 2 + (i * 2 * Math.PI) / starCount;
        context.lineTo(
            sideLength / 2 + Math.cos(angle) * radius,
            sideLength / 2 + Math.sin(angle) * radius
        );
        const betweenAngle = angle + Math.PI / starCount;
        context.lineTo(
            sideLength / 2 + (Math.cos(betweenAngle) * radius) / 2,
            sideLength / 2 + (Math.sin(betweenAngle) * radius) / 2
        );
    }
    context.closePath();
    context.stroke();
    context.fill();
};

const scene: THREE.Scene = new THREE.Scene();
scene.add(new THREE.AxesHelper(25));

const makeTorus = (color: THREE.Color): THREE.Points =>
    new THREE.Points(
        new THREE.TorusGeometry(16, 2, 16, 16),
        new THREE.PointsMaterial({
            color: color,
            size: 2,
            map: makeStarTexture(),
            transparent: true,
            blending: THREE.AdditiveBlending,
            depthWrite: false
        })
    );
const torusGroup = (() => {
    const group = new THREE.Group();
    group.add(makeTorus(new THREE.Color(0.8, 0.4, 0.4)));
    group.add(makeTorus(new THREE.Color(0.4, 0.8, 0.4)));
    group.add(makeTorus(new THREE.Color(0.4, 0.4, 0.8)));
    return group;
})();

const torusGroupList: Array<THREE.Group> = new Array(5).fill(0).map(() => {
    const group = torusGroup.clone();
    scene.add(group);
    return group;
});

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
camera.position.set(10, 20, 20);
camera.lookAt(new THREE.Vector3(0, 0, 0));

const orbitControls = new (THREE as any).OrbitControls(camera, canvasElement);

let count = 0;
const update = (): void => {
    torusGroupList.forEach((element, index) => {
        element.position.setZ(-125 + ((count + index * 50) % 250));
        element.children[0].rotateZ(Math.PI * 2 * 0.002);
        element.children[1].rotateZ(Math.PI * 2 * 0.004);
        element.children[2].rotateZ(Math.PI * 2 * -0.002);
    });
    count += 1;
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
