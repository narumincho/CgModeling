import * as THREE from "three";
import { GUI } from "dat.gui";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

/**
 * @author 17FI082 鳴海秀人
 * @description CGモデリングおよび演習 第6回 の 課題8
 */

const option = {
  mobiusStrip: 0.1,
  kleinBottle: 0.1
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
gui.domElement.style.position = "absolute";
gui.add(option, "mobiusStrip", -1, 1);
gui.add(option, "kleinBottle", -1, 1);
document.body.append(canvasElement);

const scene: THREE.Scene = new THREE.Scene();
scene.add(new THREE.AxesHelper(25));

const mobiusStrip = new THREE.Mesh(
  new THREE.ParametricGeometry(
    (u: number, v: number, out: THREE.Vector3) => {
      const x = u - 0.5;
      const y = v * 2 * Math.PI;
      const a = 4;
      out.set(
        Math.cos(y) * (a + x * Math.cos(y / 2)),
        Math.sin(y) * (a + x * Math.cos(y / 2)),
        x * Math.sin(y / 2)
      );
    },
    10,
    10
  ),
  new THREE.MeshNormalMaterial({ side: THREE.DoubleSide })
);
mobiusStrip.position.copy(new THREE.Vector3(-20, 0, 0));
mobiusStrip.scale.copy(new THREE.Vector3(4, 4, 4));
scene.add(mobiusStrip);

const kleinBottle = new THREE.Mesh(
  new THREE.ParametricGeometry(
    (u0: number, v0: number, out: THREE.Vector3) => {
      const u = u0 * 2 * Math.PI;
      const v = v0 * 2 * Math.PI;
      const r = 4 * (1 - Math.cos(u) / 2);
      out.set(
        u <= Math.PI
          ? 6 * Math.cos(u) * (1 + Math.sin(u)) + r * Math.cos(u) * Math.cos(v)
          : 6 * Math.cos(u) * (1 + Math.sin(u)) + r * Math.cos(v + Math.PI),
        u <= Math.PI
          ? 16 * Math.sin(u) + r * Math.sin(u) * Math.cos(v)
          : 16 * Math.sin(u),
        r * Math.sin(v)
      );
    },
    10,
    10
  ),
  new THREE.MeshNormalMaterial({ side: THREE.DoubleSide })
);
kleinBottle.position.copy(new THREE.Vector3(20, 0, 0));
scene.add(kleinBottle);

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
camera.position.copy(new THREE.Vector3(0, 20, 30));
camera.lookAt(new THREE.Vector3(0, 0, 0));

const orbitControls = new OrbitControls(camera, canvasElement);

const mobiusStripRotateAxis = new THREE.Vector3(
  Math.random(),
  Math.random(),
  Math.random()
).normalize();
const kleinBottleRotateAxis = new THREE.Vector3(
  Math.random(),
  Math.random(),
  Math.random()
).normalize();

const update = (): void => {
  mobiusStrip.rotateOnAxis(mobiusStripRotateAxis, option.mobiusStrip);
  kleinBottle.rotateOnAxis(kleinBottleRotateAxis, option.kleinBottle);

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
