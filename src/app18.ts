import { GUI } from "dat.gui";
import * as THREE from "three";
import Physijs from "physijs-webpack";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

/**
 * @author 17FI082 鳴海秀人
 * @description CGモデリングおよび演習 第13回 の 課題18
 */
document.documentElement.style.height = "100%";
document.body.style.width = "100%";
document.body.style.height = "100%";
document.body.style.margin = "0";
const canvasElement = document.createElement("canvas");
canvasElement.style.display = "block";
canvasElement.style.width = "100%";
canvasElement.style.height = "100%";
canvasElement.style.margin = "0";

const data = {
  wheelAngle: 0
};

const gui = new GUI();
gui.add(data, "wheelAngle", 0, 7, 0.01);
gui.domElement.style.position = "absolute";
document.body.append(gui.domElement, canvasElement);

document.body.append(canvasElement);

const makeLightList = num => {
  const lightList = [];
  for (let i = 0; i < num; i++) {
    const light = new THREE.PointLight(0xffffff);
    light.position.copy(
      new THREE.Vector3(
        Math.random() * 200 - 30,
        Math.random() * 200 - 30,
        Math.random() * 200 - 30
      )
    );
    lightList.push(light);
  }
  return lightList;
};

const createWheel = position => {
  const wheel = new Physijs.CylinderMesh(
    new THREE.CylinderGeometry(4, 4, 2, 10),
    Physijs.createMaterial(
      new THREE.MeshLambertMaterial({
        color: 0x444444,
        opacity: 0.9,
        transparent: true
      }),
      1.0,
      0.5
    ),
    100
  );
  //位置の設定
  wheel.rotation.x = Math.PI / 2;
  wheel.castShadow = true;
  wheel.position.copy(position);
  //作成したオブジェクトを返り値として返す
  return wheel;
};

const createCarBody = position => {
  //車のボディを作成
  const body = new Physijs.BoxMesh(
    new THREE.BoxGeometry(15, 4, 6),
    Physijs.createMaterial(
      new THREE.MeshLambertMaterial({
        color: 0xdd8800,
        opacity: 0.9,
        transparent: true
      }),
      0.5,
      0.5
    ),
    500
  );
  //位置を調整して、シーンに追加
  body.position.copy(position);
  body.castShadow = true;
  return body;
};

const scene = new Physijs.Scene();
scene.add(new THREE.AxesHelper(25));
scene.setGravity(new THREE.Vector3(0, -20, 0));
scene.add(
  new Physijs.BoxMesh(
    new THREE.BoxGeometry(500, 5, 500),
    new THREE.MeshPhysicalMaterial({ color: 0x3388dd }),
    0
  )
);

const body = createCarBody(new THREE.Vector3(0, 10, 0));
const frontLeftWheel = createWheel(new THREE.Vector3(-5, 10, -5));
const frontRightWheel = createWheel(new THREE.Vector3(-5, 10, 5));
const rearLeftWheel = createWheel(new THREE.Vector3(5, 10, -5));
const rearRightWheel = createWheel(new THREE.Vector3(5, 10, 5));
scene.add(body);
scene.add(frontLeftWheel);
scene.add(frontRightWheel);
scene.add(rearRightWheel);
scene.add(rearLeftWheel);

const frontLeftConstraint = new Physijs.DOFConstraint(
  frontLeftWheel,
  body,
  new THREE.Vector3(-5, 10, -3)
);
scene.addConstraint(frontLeftConstraint);
frontLeftConstraint.setAngularLowerLimit(new THREE.Vector3(0, 0, 0));
frontLeftConstraint.setAngularUpperLimit(new THREE.Vector3(0, 0.5, 0));
frontLeftConstraint.configureAngularMotor(2, 0.1, 0, -2, 1500);
frontLeftConstraint.enableAngularMotor(2);

const frontRightConstraint = new Physijs.DOFConstraint(
  frontRightWheel,
  body,
  new THREE.Vector3(-5, 10, 3)
);
scene.addConstraint(frontRightConstraint);
frontRightConstraint.setAngularLowerLimit(new THREE.Vector3(0, 0, 0));
frontRightConstraint.setAngularUpperLimit(new THREE.Vector3(0, 0.5, 0));
frontRightConstraint.configureAngularMotor(2, 0.1, 0, -2, 1500);
frontRightConstraint.enableAngularMotor(2);

const rearLeftConstraint = new Physijs.DOFConstraint(
  rearLeftWheel,
  body,
  new THREE.Vector3(5, 10, -3)
);
scene.addConstraint(rearLeftConstraint);
rearLeftConstraint.setAngularLowerLimit(new THREE.Vector3(0, 0, 0.1));
rearLeftConstraint.setAngularUpperLimit(new THREE.Vector3(0, 0, 0));

const rearRightConstraint = new Physijs.DOFConstraint(
  rearRightWheel,
  body,
  new THREE.Vector3(5, 10, 3)
);
scene.addConstraint(rearRightConstraint);
rearRightConstraint.setAngularLowerLimit(new THREE.Vector3(0, 0, 0.1));
rearRightConstraint.setAngularUpperLimit(new THREE.Vector3(0, 0, 0));

// ライトの設定
const lights = makeLightList(5);
for (let i = 0; i < lights.length; i++) {
  scene.add(lights[i]);
}

const renderer = new THREE.WebGLRenderer({
  canvas: canvasElement
});
const canvasWidth = canvasElement.clientWidth;
const canvasHeight = canvasElement.clientHeight;
renderer.setSize(canvasWidth, canvasHeight, false);
renderer.setClearColor(new THREE.Color(0x000000));
renderer.shadowMap.enabled = true;
const camera = new THREE.PerspectiveCamera(
  75,
  canvasWidth / canvasHeight,
  0.1,
  100000
);
camera.position.set(120, 30, 60);
camera.lookAt(new THREE.Vector3(0, 0, 0));
const orbitControls = new OrbitControls(camera, canvasElement);

let count = 0;

const update = () => {
  count += 0.01;
  orbitControls.update();
  renderer.setSize(
    canvasElement.clientWidth,
    canvasElement.clientHeight,
    false
  );
  frontLeftWheel.rotation.y = data.wheelAngle;
  frontRightWheel.rotation.y = -data.wheelAngle;
  scene.simulate();
  camera.aspect = canvasElement.clientWidth / canvasElement.clientHeight;
  camera.updateProjectionMatrix();
  renderer.render(scene, camera);
  requestAnimationFrame(update);
};
update();
