import * as THREE from "three";
import { GUI } from "dat.gui";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

/**
 * @author 17FI082 鳴海秀人
 * @description CGモデリングおよび演習 第6回 の 課題7
 */

/** 波の設定 */
const waveData = {
  waveNum: 5
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

const gui = new GUI();
gui.add(waveData, "waveNum", 0, 10, 0.1);
gui.domElement.style.position = "absolute";
document.body.append(gui.domElement, canvasElement);

const scene: THREE.Scene = new THREE.Scene();
scene.add(new THREE.AxesHelper(25));

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
camera.position.copy(new THREE.Vector3(0, 50, 40));
camera.lookAt(new THREE.Vector3(0, 0, 0));

const orbitControls = new OrbitControls(camera, canvasElement);
const material = new THREE.MeshNormalMaterial({ side: THREE.DoubleSide });
const lineMaterial = new THREE.LineBasicMaterial({ color: 0xffffff });

const makeGeometry = (
  count: number
): { wave: THREE.Mesh; line: THREE.LineSegments } => {
  const geometry = new THREE.ParametricGeometry(
    (u0: number, v0: number, out: THREE.Vector3): void => {
      const r = 30;
      const u = (u0 - 0.5) * 2; // -1 ... 1
      const v = (v0 - 0.5) * 2; // -1 ... 1
      const d = Math.sqrt(u ** 2 + v ** 2); // 0 ... 1
      out.set(
        u * r,
        Math.sin((((d * 360 - count) * Math.PI * 2) / 360) * waveData.waveNum) *
          (1 - d) *
          3,
        v * r
      );
    },
    30,
    30
  );
  return {
    wave: new THREE.Mesh(geometry, material),
    line: new THREE.LineSegments(geometry, lineMaterial)
  };
};

let geometry = makeGeometry(0);
scene.add(geometry.wave);
scene.add(geometry.line);

let count = 0;

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

  count += 1;
  scene.remove(geometry.line);
  scene.remove(geometry.wave);
  geometry = makeGeometry(count);
  scene.add(geometry.wave);
  scene.add(geometry.line);

  requestAnimationFrame(update);
};
update();
