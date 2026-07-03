/**
 * heroScene.js
 * ------------
 * Airy, light-studio 3D hero for the cream/editorial redesign.
 * A small cluster of soft glass-like forms (icosahedra + a torus ring)
 * slowly rotate under warm studio lighting, casting soft shadows onto
 * a floor plane. Responds gently to mouse parallax and to scroll
 * progress (camera drifts forward + forms drift apart as you scroll
 * out of the hero), replacing the old frame-sequence skull shader.
 *
 * Deliberately restrained: a handful of meshes, two lights, capped
 * pixel ratio. This is meant to feel like a quiet product photography
 * set, not a spectacle.
 */

export class HeroScene {
  constructor({ canvas, container }) {
    this.canvas = canvas;
    this.container = container;
    this.disposed = false;
    this.scrollProgress = 0;
    this.mouse = { x: 0, y: 0 };
    this.targetMouse = { x: 0, y: 0 };
  }

  async init(THREE) {
    if (this.disposed) return;
    this.THREE = THREE;

    const renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer = renderer;

    const scene = new THREE.Scene();
    this.scene = scene;

    const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100);
    camera.position.set(0, 1.1, 9);
    camera.lookAt(0, 0.3, 0);
    this.camera = camera;
    this.baseCamY = camera.position.y;
    this.baseCamZ = camera.position.z;

    // Warm, soft studio lighting
    const hemi = new THREE.HemisphereLight(0xfff7ec, 0xe7ded0, 0.9);
    scene.add(hemi);

    const key = new THREE.DirectionalLight(0xfff3e0, 1.6);
    key.position.set(4, 6, 5);
    key.castShadow = true;
    key.shadow.mapSize.set(1024, 1024);
    key.shadow.camera.near = 1;
    key.shadow.camera.far = 20;
    key.shadow.radius = 6;
    scene.add(key);

    const rim = new THREE.DirectionalLight(0xd8c3ff, 0.45);
    rim.position.set(-5, 3, -4);
    scene.add(rim);

    // Floor — soft shadow catcher, invisible material edges blended into bg
    const floorGeo = new THREE.PlaneGeometry(40, 40);
    const floorMat = new THREE.ShadowMaterial({ opacity: 0.16 });
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -1.6;
    floor.receiveShadow = true;
    scene.add(floor);

    // Cluster of soft forms
    const palette = [0xfaf3e8, 0xead9cf, 0xd7c9b8, 0xc9b79f];
    const shapes = [
      {
        geo: new THREE.IcosahedronGeometry(1, 0),
        pos: [-1.6, 0.2, 0.4],
        scale: 1.05,
      },
      {
        geo: new THREE.TorusGeometry(0.85, 0.28, 24, 64),
        pos: [1.6, 0.5, -0.6],
        scale: 1,
      },
      {
        geo: new THREE.OctahedronGeometry(0.75, 0),
        pos: [0.3, -0.5, 1.3],
        scale: 0.9,
      },
      {
        geo: new THREE.IcosahedronGeometry(0.5, 1),
        pos: [2.6, -0.6, 0.8],
        scale: 0.7,
      },
    ];

    this.meshes = shapes.map(({ geo, pos, scale }, i) => {
      const mat = new THREE.MeshStandardMaterial({
        color: palette[i % palette.length],
        roughness: 0.42,
        metalness: 0.08,
        envMapIntensity: 0.6,
      });
      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.set(...pos);
      mesh.scale.setScalar(scale);
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      mesh.userData.basePos = pos.slice();
      mesh.userData.spin = {
        x: (Math.random() - 0.5) * 0.12,
        y: 0.06 + Math.random() * 0.08,
      };
      mesh.userData.bob = {
        amp: 0.12 + Math.random() * 0.1,
        speed: 0.3 + Math.random() * 0.25,
        phase: Math.random() * Math.PI * 2,
      };
      scene.add(mesh);
      return mesh;
    });

    this._resize();
    this._onResize = () => this._resize();
    window.addEventListener("resize", this._onResize);

    this.clock = new THREE.Clock();
    this._animId = requestAnimationFrame(() => this._tick());
  }

  setMouse(x, y) {
    // x, y in [-1, 1]
    this.targetMouse.x = x;
    this.targetMouse.y = y;
  }

  setScrollProgress(p) {
    this.scrollProgress = p;
  }

  _resize() {
    if (!this.renderer || !this.container) return;
    const w = this.container.clientWidth || 1;
    const h = this.container.clientHeight || 1;
    this.renderer.setSize(w, h, false);
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
  }

  _tick() {
    if (this.disposed) return;
    const t = this.clock.getElapsedTime();

    this.mouse.x += (this.targetMouse.x - this.mouse.x) * 0.05;
    this.mouse.y += (this.targetMouse.y - this.mouse.y) * 0.05;

    this.camera.position.x = this.mouse.x * 0.6;
    this.camera.position.y = this.baseCamY + this.mouse.y * -0.3;
    this.camera.position.z = this.baseCamZ + this.scrollProgress * 2.5;
    this.camera.lookAt(0, 0.2, 0);

    for (const mesh of this.meshes) {
      const { spin, bob, basePos } = mesh.userData;
      mesh.rotation.x += spin.x * 0.01;
      mesh.rotation.y += spin.y * 0.01;
      mesh.position.y =
        basePos[1] + Math.sin(t * bob.speed + bob.phase) * bob.amp;
      // Drift apart slightly as the visitor scrolls past the hero
      const drift = this.scrollProgress * 1.6;
      mesh.position.x = basePos[0] * (1 + drift * 0.4);
      mesh.position.z = basePos[2] - drift * 1.2;
    }

    this.renderer.render(this.scene, this.camera);
    this._animId = requestAnimationFrame(() => this._tick());
  }

  dispose() {
    this.disposed = true;
    if (this._animId) cancelAnimationFrame(this._animId);
    if (this._onResize) window.removeEventListener("resize", this._onResize);
    if (this.meshes) {
      for (const m of this.meshes) {
        this.scene?.remove(m);
        m.geometry?.dispose();
        m.material?.dispose();
      }
    }
    this.renderer?.dispose();
  }
}
