/**
 * workGallery.js
 * ---------------
 * Bespoke Three.js scene for the Work section — a "museum vitrine"
 * display: faceted gems (one per project) arranged along a gentle arc,
 * with a real THREE.SpotLight that sweeps along the arc as the visitor
 * scrolls, illuminating one gem at a time. Distinct in kind from the
 * previous three bespoke scenes:
 *   - Experience = a path drawn once, left to right
 *   - Process    = an orthogonal circuit with continuous flowing pulses
 *   - About      = a slow ambient orbit, no directional story
 *   - Work       = a fixed arc of display pieces + a moving spotlight
 *                  actively "selecting" one at a time — the only scene
 *                  where a light itself is the animated protagonist
 */

export class WorkGallery {
  /**
   * @param {Object} opts
   * @param {HTMLCanvasElement} opts.canvas
   * @param {HTMLElement} opts.container
   * @param {string} opts.color        base gem color
   * @param {string} [opts.lightColor] spotlight color
   * @param {number} opts.gemCount     number of projects / gems
   */
  constructor({
    canvas,
    container,
    color = "#C9A876",
    lightColor,
    gemCount = 5,
  }) {
    this.canvas = canvas;
    this.container = container;
    this.color = color;
    this.lightColor = lightColor || color;
    this.gemCount = Math.max(1, gemCount);
    this.disposed = false;
    this.scrollFrac = 0;
    this.spotT = 0; // smoothed 0..1 position along the arc
  }

  async init(THREE) {
    if (this.disposed) return;
    this.THREE = THREE;

    const renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
      alpha: true,
      powerPreference: "low-power",
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer = renderer;

    const scene = new THREE.Scene();
    this.scene = scene;

    const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100);
    camera.position.set(0, 0.15, 3.8);
    this.camera = camera;

    const base = new THREE.Color(this.color);
    const spotCol = new THREE.Color(this.lightColor);

    // Dim ambient — the gallery should feel darker than every other
    // section — plus a constant warm rim light so gems have real
    // dimensional highlights independent of the moving spotlight.
    scene.add(new THREE.AmbientLight(0x6b5c46, 0.55));
    const fillKey = new THREE.DirectionalLight(0xfff4de, 0.35);
    fillKey.position.set(2, 3, 4);
    scene.add(fillKey);
    const rim = new THREE.DirectionalLight(spotCol, 0.5);
    rim.position.set(-2, 1.5, 3);
    scene.add(rim);

    const n = this.gemCount;
    const arcSpan = Math.PI * 0.62; // gentle arc, not a full half-circle
    const arcRadius = 3.4;
    const startAngle = Math.PI / 2 + arcSpan / 2;

    this.gemPositions = [];
    for (let i = 0; i < n; i++) {
      const t = n === 1 ? 0.5 : i / (n - 1);
      const angle = startAngle - t * arcSpan;
      const x = Math.cos(angle) * arcRadius;
      const y = Math.sin(angle) * arcRadius - arcRadius + 0.9;
      this.gemPositions.push({ x, y, t });
    }

    const gemGeo = new THREE.IcosahedronGeometry(0.4, 0);
    this.gems = [];
    for (let i = 0; i < n; i++) {
      const pos = this.gemPositions[i];
      const mat = new THREE.MeshStandardMaterial({
        color: base,
        emissive: base,
        emissiveIntensity: 0.4,
        roughness: 0.28,
        metalness: 0.35,
      });
      const gem = new THREE.Mesh(gemGeo, mat);
      gem.position.set(pos.x, pos.y, 0);
      scene.add(gem);

      // A low glowing plinth beneath each gem — museum-display base,
      // not a tall stick (which would read as a tree trunk).
      const pedestal = new THREE.Mesh(
        new THREE.CylinderGeometry(0.16, 0.2, 0.05, 20),
        new THREE.MeshStandardMaterial({
          color: base,
          emissive: base,
          emissiveIntensity: 0.25,
          roughness: 0.4,
          metalness: 0.3,
        }),
      );
      pedestal.position.set(pos.x, pos.y - 0.4, 0);
      scene.add(pedestal);

      this.gems.push({
        mesh: gem,
        mat,
        t: pos.t,
        spinSpeed: 0.12 + (i % 3) * 0.05,
      });
    }

    // The spotlight — a real light, plus a faint visible cone so the
    // beam itself is legible, not just its lighting effect.
    const spot = new THREE.SpotLight(spotCol, 0, 9, Math.PI / 9, 0.4, 1.2);
    spot.position.set(0, 3.2, 2.2);
    scene.add(spot);
    scene.add(spot.target);
    this.spot = spot;

    const coneGeo = new THREE.ConeGeometry(0.5, 3.0, 24, 1, true);
    const coneMat = new THREE.MeshBasicMaterial({
      color: spotCol,
      transparent: true,
      opacity: 0.09,
      side: THREE.DoubleSide,
      depthWrite: false,
    });
    this.beam = new THREE.Mesh(coneGeo, coneMat);
    this.beam.position.set(0, 3.2, 2.2);
    scene.add(this.beam);

    this._resize();
    this._onResize = () => this._resize();
    window.addEventListener("resize", this._onResize);

    this.clock = new THREE.Clock();
    this._animId = requestAnimationFrame(() => this._tick());
  }

  _resize() {
    if (!this.renderer || !this.container) return;
    const w = this.container.clientWidth || 1;
    const h = this.container.clientHeight || 1;
    this.renderer.setSize(w, h, false);
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
  }

  /** Call with 0..1 progress of this section through the viewport. */
  setScrollProgress(frac) {
    this.scrollFrac = frac;
  }

  _tick() {
    if (this.disposed) return;
    const t = this.clock.getElapsedTime();

    // Spotlight sweeps along the arc, smoothed toward the scroll
    // fraction so it always feels like it's gliding, never snapping.
    const target = Math.min(1, Math.max(0, this.scrollFrac));
    this.spotT += (target - this.spotT) * 0.045;

    // Find the current arc position for the spotlight to aim at.
    const idxF = this.spotT * (this.gemPositions.length - 1);
    const i0 = Math.floor(idxF);
    const i1 = Math.min(this.gemPositions.length - 1, i0 + 1);
    const localT = idxF - i0;
    const p0 = this.gemPositions[i0];
    const p1 = this.gemPositions[i1] || p0;
    const spotX = p0.x + (p1.x - p0.x) * localT;
    const spotY = p0.y + (p1.y - p0.y) * localT;

    this.spot.target.position.set(spotX, spotY, 0);
    this.spot.intensity = 3.2;
    this.beam.position.set(spotX * 0.3, 3.2, 2.2);
    this.beam.lookAt(spotX, spotY, 0);
    this.beam.rotation.x += Math.PI / 2;

    // Light up each gem based on proximity to the current spotlight
    // position along the arc — smooth falloff, not a hard on/off.
    for (const g of this.gems) {
      const dist = Math.abs(g.t - this.spotT) * (this.gemPositions.length - 1);
      const glow = Math.max(0, 1 - dist / 1.15);
      g.mat.emissiveIntensity = 0.4 + glow * 1.3;
      const scale = 1 + glow * 0.28;
      g.mesh.scale.setScalar(scale);
      g.mesh.rotation.y = t * g.spinSpeed;
      g.mesh.rotation.x = Math.sin(t * g.spinSpeed * 0.7) * 0.15;
    }

    this.renderer.render(this.scene, this.camera);
    this._animId = requestAnimationFrame(() => this._tick());
  }

  dispose() {
    this.disposed = true;
    if (this._animId) cancelAnimationFrame(this._animId);
    if (this._onResize) window.removeEventListener("resize", this._onResize);
    this.gems?.forEach((g) => {
      g.mesh.geometry?.dispose();
      g.mat.dispose();
    });
    this.beam?.geometry?.dispose();
    this.beam?.material?.dispose();
    this.renderer?.dispose();
  }
}
