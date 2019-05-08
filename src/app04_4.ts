import * as THREE from "three";
import "three/examples/js/controls/orbitControls";
import { Mesh } from "three";

/**
 * @author 17FI082 鳴海秀人
 * @description CGモデリングおよび演習 第4回 の 課題4
 */

/** 2.9x2.9x2.9の立方体を3x3x3個作る */
const getMeshList = (): Array<THREE.Mesh> => {
    const templateGeometry: THREE.Geometry = new THREE.BoxGeometry(2.9, 2.9, 2.9);
    const templateMaterial: THREE.Material = new THREE.MultiMaterial([
        new THREE.MeshStandardMaterial({ color: 0x009e60, roughness: 0.1 }),
        new THREE.MeshToonMaterial({ color: 0x0051ba }),
        new THREE.MeshStandardMaterial({ color: 0xffd500 }),
        new THREE.MeshPhysicalMaterial({ color: 0xff5800 }),
        new THREE.MeshToonMaterial({ color: 0xc41e3a }),
        new THREE.MeshMatcapMaterial({ color: 0xffffff })
    ]);
    const templateMesh: THREE.Mesh = new Mesh(templateGeometry, templateMaterial);
    const meshList: Array<THREE.Mesh> = [];
    for (let x = 0; x < 3; x++) {
        for (let y = 0; y < 3; y++) {
            for (let z = 0; z < 3; z++) {
                const mesh: THREE.Mesh = templateMesh.clone();
                mesh.position.copy(new THREE.Vector3(-3 + x * 3, -3 + y * 3, -3 + z * 3));
                meshList.push(mesh);
            }
        }
    }
    return meshList;
}

{
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

    // メッシュの設定
    const meshList = getMeshList();
    const group: THREE.Group = new THREE.Group()
    for (const mesh of meshList) {
        group.add(mesh);
    }
    scene.add(group);

    // ライトの設定
    const light: THREE.Light = new THREE.DirectionalLight(0xffffff)
    light.position.copy(new THREE.Vector3(1, 10, 1));
    light.castShadow = true;
    light.shadow.camera = new THREE.OrthographicCamera(-30, 30, -30, 30);
    scene.add(light);

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

    // 更新
    const update = () => {
        group.rotateX(0.01);
        group.rotateY(0.015);

        orbitControls.update();
        renderer.setSize(canvasElement.clientWidth, canvasElement.clientHeight, false);

        camera.aspect = canvasElement.clientWidth / canvasElement.clientHeight;
        camera.updateProjectionMatrix()
        renderer.render(scene, camera);
        requestAnimationFrame(update);
    }
    update();
}