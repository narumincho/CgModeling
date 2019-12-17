import * as THREE from "three";
import * as dat from "dat.gui";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

/**
 * @author 17FI082 鳴海秀人
 * @description CGモデリングおよび演習 最終課題
 *
 */

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

const scene = new THREE.Scene();
scene.add(new THREE.AxesHelper(25));

const setting = {
  num: 11,
  lineNum: 30,
  diff: 1
};

const pointsMaterial: THREE.PointsMaterial = new THREE.PointsMaterial({
  size: 1,
  map: makeStarTexture(),
  blending: THREE.AdditiveBlending,
  color: new THREE.Color(0xffdd00),
  transparent: true,
  opacity: 0.8,
  depthWrite: false
});

const createPoints = (): THREE.Points => {
  const angleDiff = (Math.PI * 2 * Math.floor(setting.num / 2)) / setting.num;
  const geometry = new THREE.Geometry();
  for (let a = 0; a < setting.num; a++) {
    for (let b = 0; b < setting.num; b++) {
      const angleA = b * setting.diff + angleDiff * a;
      const angleABefore = b * setting.diff + angleDiff * (a - 1);
      const angleB = angleDiff * b;
      const angleBBefore = angleDiff * (b - 1);
      for (let l = 0; l < setting.lineNum; l++) {
        geometry.vertices.push(
          new THREE.Vector3().lerpVectors(
            new THREE.Vector3(
              20 * Math.cos(angleABefore),
              20 * Math.sin(angleBBefore),
              20 * -Math.sin(angleABefore)
            ),
            new THREE.Vector3(
              20 * Math.cos(angleA),
              20 * Math.sin(angleB),
              20 * -Math.sin(angleA)
            ),
            l / setting.lineNum
          )
        );
      }
    }
  }
  return new THREE.Points(geometry, pointsMaterial);
};

let model: THREE.Points = createPoints();
scene.add(model);

const gui = new dat.GUI();
gui.domElement.style.position = "absolute";

gui.add(setting, "num", 3, 29, 1).onChange(() => {
  scene.remove(model);
  model = createPoints();
  scene.add(model);
});
gui.add(setting, "lineNum", 3, 50, 1).onChange(() => {
  scene.remove(model);
  model = createPoints();
  scene.add(model);
});
gui.add(setting, "diff", 1, 10, 0.1).onChange(() => {
  scene.remove(model);
  model = createPoints();
  scene.add(model);
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
  1000
);
camera.position.set(0, 50, 0);
camera.lookAt(new THREE.Vector3(0, 0, 0));

const orbitControls = new OrbitControls(camera, canvasElement);

const update = (): void => {
  orbitControls.update();
  model.rotateY(0.025);

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
