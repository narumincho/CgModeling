import * as THREE from "three";
import "three/examples/js/controls/orbitControls";
import * as TWEEN from "@tweenjs/tween.js";

/**
 * @author 17FI082 鳴海秀人
 * @description CGモデリングおよび演習 第11回 の 課題16
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

const createPoints = (): THREE.Points => {
    const geometry = new THREE.Geometry();
    for (let x = 0; x < 100; x++) {
        for (let y = 0; y < 100; y++) {
            geometry.vertices.push(new THREE.Vector3(x - 50, y - 50, 0));
            geometry.colors.push(
                new THREE.Color(0xff0000 + Math.random() * 0x00ffff)
            );
        }
    }
    return new THREE.Points(
        geometry,
        new THREE.PointsMaterial({
            size: 2,
            map: makeStarTexture(),
            blending: THREE.AdditiveBlending,
            vertexColors: THREE.VertexColors,
            transparent: true
        })
    );
};

const scene: THREE.Scene = new THREE.Scene();
scene.add(new THREE.AxesHelper(25));

const points = createPoints();
scene.add(points);

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

const getZ = (count: number, x: number, y: number) => {
    const diff =
        (count | 0) % 2 === 0 ? count - (count | 0) : 1 - (count - (count | 0));
    const a = -Math.sqrt(x * x + y * y);
    return (
        a +
        (Math.abs(Math.sin((x + y) / 10) * 10) - a) *
            TWEEN.Easing.Elastic.InOut(diff)
    );
};

let count = 0;
const update = (): void => {
    count += 0.01;
    (points.geometry as THREE.Geometry).vertices.forEach(v =>
        v.copy(new THREE.Vector3(v.x, v.y, getZ(count, v.x, v.y)))
    );
    (points.geometry as THREE.Geometry).verticesNeedUpdate = true;
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
