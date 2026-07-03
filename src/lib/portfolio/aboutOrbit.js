/**
 * aboutOrbit.js
 * --------------
 * Bespoke Three.js scene for the About section — deliberately the
 * calmest, most organic motion of the three bespoke scenes so far:
 *   - Experience = a single path drawn once, left to right (linear, career)
 *   - Process    = an orthogonal circuit with flowing pulses (technical)
 *   - About      = a slow multi-plane ORBIT of soft facets around a
 *                  center point, each a different primitive (personal
 *                  traits/interests), breathing gently — no hard edges,
 *                  no directional "progress" story. Scroll only controls
 *                  how far the orbit has "opened up" from a tight cluster
 *                  into its full slow orbit, echoing "getting to know
 *                  someone" as the visitor reads the bio.
 */

export class AboutOrbit {
  /**
   * @param {Object} opts
   * @param {HTMLCanvasElement} opts.canvas
   * @param {HTMLElement} opts.container
   * @param {string} opts.color        base facet color
   * @param {string} [opts.lightColor] highlight/key light color
   * @param {number} opts.facetCount   number of orbiting facets
   */
  constructor({
    canvas,
    container,
    color = "#7E9C7A",
    lightColor,
    facetCount = 7,
  }) {
    this.canvas = canvas;
    this.container = container;
    this.color = color;
    this.lightColor = lightColor || color;
    this.facetCount = Math.max(3, facetCount);
    this.disposed = false;
    this.scrollFrac = 0;
    this.openness = 0; // smoothed 0..1
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

    const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 100);
    camera.position.set(0, 0, 9);
    this.camera = camera;

    const base = new THREE.Color(this.color);
    const highlight = new THREE.Color(this.lightColor);

    scene.add(new THREE.HemisphereLight(0xf3fbf0, 0xdfeadb, 0.75));
    const key = new THREE.DirectionalLight(highlight, 0.75);
    key.position.set(3, 4, 5);
    scene.add(key);

    // Distinct soft primitives, one per facet — variety without any
    // single one dominating, all rendered as gentle frosted glass.
    const shapeGeos = [
      new THREE.IcosahedronGeometry(0.28, 0),
      new THREE.DodecahedronGeometry(0.24, 0),
      new THREE.SphereGeometry(0.22, 16, 16),
      new THREE.TorusGeometry(0.22, 0.07, 10, 22),
      new THREE.OctahedronGeometry(0.26, 0),
    ];

    this.facets = [];
    const n = this.facetCount;
    for (let i = 0; i < n; i++) {
      const geo = shapeGeos[i % shapeGeos.length];
      const mat = new THREE.MeshStandardMaterial({
        color: i % 3 === 0 ? highlight : base,
        roughness: 0.35,
        metalness: 0.05,
        transparent: true,
        opacity: 0.55,
      });
      const mesh = new THREE.Mesh(geo, mat);
      scene.add(mesh);

      // Each facet gets its own orbital plane (tilt), radius, speed and
      // phase so the cluster reads as organic rather than mechanical.
      this.facets.push({
        mesh,
        mat,
        radius: 3.1 + (i / n) * 3.0 + (i % 2 === 0 ? 0.25 : -0.2),
        speed: 0.06 + (i % 4) * 0.025,
        phase: (i / n) * Math.PI * 2,
        tilt: (i % 2 === 0 ? 1 : -1) * (0.25 + (i % 3) * 0.12),
        bobSpeed: 0.5 + (i % 3) * 0.2,
        spinSpeed: 0.15 + (i % 3) * 0.1,
      });
    }

    // A very faint central glow to anchor the orbit visually.
    const coreGeo = new THREE.SphereGeometry(0.14, 20, 20);
    const coreMat = new THREE.MeshBasicMaterial({
      color: highlight,
      transparent: true,
      opacity: 0.28,
    });
    this.core = new THREE.Mesh(coreGeo, coreMat);
    scene.add(this.core);

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

    // Orbit "opens up" from a tight cluster into its full radius as
    // scroll progresses — smoothed so it never feels mechanical.
    const targetOpen = 0.7 + Math.min(1, this.scrollFrac * 1.3) * 0.3;
    this.openness += (targetOpen - this.openness) * 0.04;

    for (const f of this.facets) {
      const angle = f.phase + t * f.speed;
      const r = f.radius * this.openness;
      const x = Math.cos(angle) * r;
      const yFlat = Math.sin(angle) * r;
      const y =
        yFlat * Math.cos(f.tilt) + Math.sin(t * f.bobSpeed + f.phase) * 0.12;
      const z = yFlat * Math.sin(f.tilt);

      f.mesh.position.set(x, y, z);
      f.mesh.rotation.x = t * f.spinSpeed;
      f.mesh.rotation.y = t * f.spinSpeed * 0.7;

      // Facets nearer the camera read slightly more present.
      const depthT = (z + 2) / 4;
      f.mat.opacity = 0.4 + depthT * 0.35;
    }

    this.core.scale.setScalar(1 + Math.sin(t * 0.8) * 0.08);

    // Whole assembly drifts very slightly for a sense of life. Camera
    // target is biased left of scene-center so the orbit reads further
    // from the text column (right side has a tighter CSS containment).
    this.scene.rotation.y = Math.sin(t * 0.04) * 0.08;
    this.camera.position.x = 0.5 + Math.sin(t * 0.03) * 0.2;
    this.camera.lookAt(0.5, 0, 0);

    this.renderer.render(this.scene, this.camera);
    this._animId = requestAnimationFrame(() => this._tick());
  }

  dispose() {
    this.disposed = true;
    if (this._animId) cancelAnimationFrame(this._animId);
    if (this._onResize) window.removeEventListener("resize", this._onResize);
    this.facets?.forEach((f) => {
      f.mesh.geometry?.dispose();
      f.mat.dispose();
    });
    this.core?.geometry?.dispose();
    this.core?.material?.dispose();
    this.renderer?.dispose();
  }
}
