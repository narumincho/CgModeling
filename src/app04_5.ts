import * as THREE from "three";
import "three/examples/js/controls/orbitControls";

/**
 * @author 17FI082 鳴海秀人
 * @description CGモデリングおよび演習 第4回 の 課題5
 */

/** ルービックキューブの立方体と位置情報を作る */
const makeRubiksCubeMesh = (cubeNum: Size, cubeSize: Size): Array<Array<Array<{ mesh: THREE.Mesh, position: THREE.Vector3 }>>> => {
    const geometry: THREE.Geometry = new THREE.BoxGeometry(cubeSize.width * 0.95, cubeSize.height * 0.95, cubeSize.depth * 0.95)
    const blackMaterial: THREE.Material = new THREE.MeshLambertMaterial({ color: 0x000000 })
    const meshListListList: Array<Array<Array<{ mesh: THREE.Mesh, position: THREE.Vector3 }>>> = [];
    const faseTexture: THREE.Texture = makeFaceTexture();
    const greenMaterial = new THREE.MeshPhysicalMaterial({ color: 0x009e60, map: faseTexture })
    const blueMaterial = new THREE.MeshPhysicalMaterial({ color: 0x0051ba, map: faseTexture })
    const yellowMaterial = new THREE.MeshPhysicalMaterial({ color: 0xffd500, map: faseTexture })
    const orangeMaterial = new THREE.MeshPhysicalMaterial({ color: 0xff5800, map: faseTexture })
    const redMaterial = new THREE.MeshPhysicalMaterial({ color: 0xc41e3a, map: faseTexture })
    const whiteMaterial = new THREE.MeshPhysicalMaterial({ color: 0xffffff, map: faseTexture })
    for (let x = 0; x < cubeNum.width; x++) {
        const meshListList: Array<Array<{ mesh: THREE.Mesh, position: THREE.Vector3 }>> = [];
        for (let y = 0; y < cubeNum.height; y++) {
            const meshList: Array<{ mesh: THREE.Mesh, position: THREE.Vector3 }> = [];
            for (let z = 0; z < cubeNum.depth; z++) {
                meshList.push({
                    mesh: new THREE.Mesh(geometry, [
                        x === cubeNum.width - 1 ? greenMaterial : blackMaterial,
                        x === 0 ? blueMaterial : blackMaterial,
                        y === cubeNum.height - 1 ? yellowMaterial : blackMaterial,
                        y === 0 ? orangeMaterial : blackMaterial,
                        z === cubeNum.depth - 1 ? redMaterial : blackMaterial,
                        z === 0 ? whiteMaterial : blackMaterial
                    ]),
                    position: new THREE.Vector3(
                        x * cubeSize.width - (cubeSize.width * (cubeNum.width - 1) / 2),
                        y * cubeSize.height - (cubeSize.height * (cubeNum.height - 1) / 2),
                        z * cubeSize.depth - (cubeSize.depth * (cubeNum.depth - 1) / 2)
                    )
                });
            }
            meshListList.push(meshList);
        }
        meshListListList.push(meshListList);
    }
    return meshListListList;
}

/**
 * ルービックキューブのテクスチャを作る。節が黒で、面が白
 * @param width 
 * @param height 
 */
const makeFaceTexture = (): THREE.Texture => {
    const width = 64;
    const height = 64;
    const canvas = document.createElement("canvas")
    canvas.width = width
    canvas.height = height
    const context = canvas.getContext("2d") as CanvasRenderingContext2D
    drawFace(context, width, height, 0xffffff)
    document.body.append(canvas)
    const texture = new THREE.Texture(canvas)
    texture.needsUpdate = true;
    return texture
}
/**
 * 
 * @param context 
 * @param width 領域の幅
 * @param height 領域の高さ
 * @param color 塗りつぶしの色
 */
const drawFace = (context: CanvasRenderingContext2D, width: number, height: number, color: number): void => {
    const padding = 4
    const r = 5
    context.fillStyle = "#000000"
    context.fillRect(0, 0, width, height)
    context.beginPath();
    context.lineWidth = 1;
    context.strokeStyle = "#" + color.toString(16).padStart(6, "0");
    context.fillStyle = "#" + color.toString(16).padStart(6, "0");
    context.moveTo(padding, padding + r);
    context.arc(padding + r, height - padding - r, r, Math.PI, Math.PI * 0.5, true);
    context.arc(width - padding - r, height - padding - r, r, Math.PI * 0.5, 0, true);
    context.arc(width - padding - r, padding + r, r, 0, Math.PI * 1.5, true);
    context.arc(padding + r, padding + r, r, Math.PI * 1.5, Math.PI, true);
    context.closePath();
    context.stroke();
    context.fill();
}

const enum BaseFace {
    Front,
    Left,
    Down
}

const enum TurnDirection {
    Clockwise,
    CounterClockwise
}

interface RotationData {
    face: BaseFace,
    index: number,
    turnDirection: TurnDirection
}

interface Size {
    width: number,
    height: number,
    depth: number
}

/** シンプルな表記 */
const rotationDataToSimpleName = (rotationData: RotationData, size: Size): string => {
    switch (rotationData.face) {
        case BaseFace.Front:
            return "Front" + (rotationData.index) + turnDirectionToString(rotationData.turnDirection)
        case BaseFace.Left:
            return "Left" + rotationData.index + turnDirectionToString(rotationData.turnDirection)
        case BaseFace.Down:
            return "Down" + rotationData.index + turnDirectionToString(rotationData.turnDirection)
    }
}

/** 3x3x3以下での普及している?表記 */
const rotationDataToStandardName = (rotationData: RotationData, size: Size): string | null => {
    switch (rotationData.face) {
        case BaseFace.Front:
            if (3 < size.depth) {
                return null;
            }
            if (rotationData.index === 0) {
                return "F" + turnDirectionToString(rotationData.turnDirection);
            }
            if (rotationData.index === 1 && size.depth === 3) {
                return "S" + turnDirectionToString(rotationData.turnDirection)
            }
            return "B" + turnDirectionToString(reverseTurnDirection(rotationData.turnDirection))
        case BaseFace.Left:
            if (3 < size.width) {
                return null;
            }
            if (rotationData.index === 0) {
                return "L" + turnDirectionToString(rotationData.turnDirection);
            }
            if (rotationData.index === 1 && size.width === 3) {
                return "M" + turnDirectionToString(rotationData.turnDirection)
            }
            return "R" + turnDirectionToString(reverseTurnDirection(rotationData.turnDirection))
        case BaseFace.Down:
            if (3 < size.height) {
                return null;
            }
            if (rotationData.index === 0) {
                return "D" + turnDirectionToString(rotationData.turnDirection);
            }
            if (rotationData.index === 1 && size.height === 3) {
                return "E" + turnDirectionToString(rotationData.turnDirection)
            }
            return "U" + turnDirectionToString(reverseTurnDirection(rotationData.turnDirection))
    }
}

const reverseTurnDirection = (turnDirection: TurnDirection): TurnDirection => {
    switch (turnDirection) {
        case TurnDirection.Clockwise:
            return TurnDirection.CounterClockwise
        case TurnDirection.CounterClockwise:
            return TurnDirection.Clockwise
    }
}

const turnDirectionToString = (turnDirection: TurnDirection): string => {
    switch (turnDirection) {
        case TurnDirection.Clockwise:
            return ""
        case TurnDirection.CounterClockwise:
            return "'"
    }
}

const makeLightList = (num: number): Array<THREE.PointLight> => {
    const lightList: Array<THREE.PointLight> = []
    for (let i = 0; i < num; i++) {
        const light = new THREE.PointLight(0xffffff);
        light.position.copy(
            new THREE.Vector3(
                Math.random() * 60 - 30,
                Math.random() * 60 - 30,
                Math.random() * 60 - 30)
        )
        lightList.push(light);
    }
    return lightList;
}

(document.querySelector("html") as HTMLHtmlElement).style.height = "100%";
document.body.style.width = "100%";
document.body.style.height = "100%";
document.body.style.margin = "0";
const canvasElement: HTMLCanvasElement = document.createElement("canvas");
document.body.appendChild(canvasElement);
canvasElement.style.display = "block";
canvasElement.style.width = "100%";
canvasElement.style.height = "100%";
canvasElement.style.margin = "0";

const scene: THREE.Scene = new THREE.Scene();

scene.add(new THREE.AxesHelper(25))

const meshListListList = makeRubiksCubeMesh({ width: 4, height: 5, depth: 2 }, { width: 5, height: 4, depth: 3 });
for (const meshListList of meshListListList) {
    for (const meshList of meshListList) {
        for (const { mesh } of meshList) {
            scene.add(mesh);
        }
    }
}

// const rotationGroupA: Array<Array<{ mesh: THREE.Mesh, position: THREE.Vector3 }>> = [];
// const rotationGroupB: Array<Array<{ mesh: THREE.Mesh, position: THREE.Vector3 }>> = [];
// const rotationGroupC: Array<Array<{ mesh: THREE.Mesh, position: THREE.Vector3 }>> = [];
// for (let i = 0; i < 3; i++) {
//     const groupA: Array<{ mesh: THREE.Mesh, position: THREE.Vector3 }> = [];
//     const groupB: Array<{ mesh: THREE.Mesh, position: THREE.Vector3 }> = [];
//     const groupC: Array<{ mesh: THREE.Mesh, position: THREE.Vector3 }> = [];
//     for (let j = 0; j < 3; j++) {
//         for (let k = 0; k < 3; k++) {
//             groupA.push(meshListListList[i][j][k]);
//             groupB.push(meshListListList[j][k][i]);
//             groupC.push(meshListListList[k][i][j]);
//         }
//     }
//     rotationGroupA.push(groupA);
//     rotationGroupB.push(groupB);
//     rotationGroupC.push(groupC);

// ライトの設定
makeLightList(6).forEach(light => {
    scene.add(light);
    scene.add(new THREE.PointLightHelper(light))
})

const renderer: THREE.WebGLRenderer = new THREE.WebGLRenderer({ canvas: canvasElement });

const width = canvasElement.clientWidth;
const height = canvasElement.clientHeight;
renderer.setSize(width, height, false);
renderer.setClearColor(new THREE.Color(0x495ed));
renderer.shadowMap.enabled = true;

//カメラの設定
const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
camera.position.copy(new THREE.Vector3(-30, 20, 20));
camera.lookAt(new THREE.Vector3(0, 0, 0));

const orbitControls = new THREE.OrbitControls(camera, canvasElement);

let count = 0;
const axis = {
    x: new THREE.Vector3(1, 0, 0),
    y: new THREE.Vector3(0, 1, 0),
    z: new THREE.Vector3(0, 0, 1)
}
const update = () => {

    for (const meshListList of meshListListList) {
        for (const meshList of meshListList) {
            for (const { mesh, position } of meshList) {
                mesh.matrixAutoUpdate = false;
                mesh.matrix =
                    new THREE.Matrix4().setPosition(position);
                // new THREE.Matrix4().makeRotationAxis(axis.x, count * Math.PI * 10 / 360).multiply(
                //     new THREE.Matrix4().setPosition(position)
                // );
            }
        }
    }
    count = (count + 1) % 360;

    orbitControls.update();
    renderer.setSize(canvasElement.clientWidth, canvasElement.clientHeight, false);

    camera.aspect = canvasElement.clientWidth / canvasElement.clientHeight;
    camera.updateProjectionMatrix()
    renderer.render(scene, camera);
    requestAnimationFrame(update);
}
update();
