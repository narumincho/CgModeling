import * as THREE from "three";
import { GUI } from "dat.gui";
import "three/examples/js/controls/orbitControls";
import { VertexColors } from "three";

/**
 * @author 17FI082 鳴海秀人
 * @description CGモデリングおよび演習 第9回 の 課題13
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
    gravity: 0.9
};

const createCloud = (
    num: number
): { points: THREE.Points; velocityList: Array<THREE.Vector3> } => {
    const geometry = new THREE.Geometry();
    const side = num ** (1 / 3);
    const velocityList: Array<THREE.Vector3> = [];
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
                geometry.colors.push(
                    new THREE.Color(0xff0000 + Math.random() * 0x00ffff)
                );
                velocityList.push(
                    new THREE.Vector3(
                        Math.random(),
                        Math.random(),
                        Math.random()
                    )
                );
            }
        }
    }
    return {
        points: new THREE.Points(
            geometry,
            new THREE.PointsMaterial({
                size: 4,
                map: makeStarTexture(),
                blending: THREE.AdditiveBlending,
                vertexColors: THREE.VertexColors
            })
        ),
        velocityList: velocityList
    };
};

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

let cloudData = createCloud(option.num);
scene.add(cloudData.points);
const gui = new GUI();
gui.domElement.style.position = "absolute";
gui.add(option, "num", 9, 10000).onChange(() => {
    scene.remove(cloudData.points);
    cloudData = createCloud(option.num);
    scene.add(cloudData.points);
});
gui.add(option, "gravity", 0, 2);

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
camera.position.set(-20, 100, -40);
camera.lookAt(new THREE.Vector3(0, 0, 0));

const orbitControls = new THREE.OrbitControls(camera, canvasElement);

const update = (): void => {
    (cloudData.points.geometry as THREE.Geometry).vertices.map(
        (position: THREE.Vector3, index: number) => {
            const velocity = cloudData.velocityList[index];
            velocity.add(
                new THREE.Vector3(
                    10 < position.x ? -0.01 : 0.01,
                    10 < position.y ? -option.gravity : 0.02,
                    10 < position.z ? -0.01 : 0.02
                )
            );
            position.add(velocity);
            return position;
        }
    );
    (cloudData.points.geometry as THREE.Geometry).verticesNeedUpdate = true;

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
