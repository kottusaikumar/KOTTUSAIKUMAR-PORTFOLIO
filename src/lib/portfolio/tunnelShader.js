/**
 * tunnelShader.js
 * ----------------
 * Custom GLSL vertex + fragment shader pair used by the hero canvas.
 *
 * Effect: a subtle center-out "resolve" — as scroll progress increases,
 * the image sequence frame is sampled with a lens-like radial distortion
 * anchored on the model's focal point, plus a soft chromatic fringe and
 * a vignette that deepens at the extremes of the scroll range. The net
 * effect reads as the image pulling the viewer inward, in sync with the
 * rotating ember/signal form on screen.
 *
 * Uniforms:
 *  uTexture     sampler2D   current frame texture
 *  uProgress    float       0..1 scroll progress within the pinned hero
 *  uZoom        float       0..1 intensity of the zoom/distortion (eased)
 *  uResolution  vec2        canvas resolution in pixels
 *  uImageAspect float       width/height of the source frame
 *  uFocal       vec2        normalized focal point, ~ (0.5, 0.51)
 */

export const vertexShader = /* glsl */ `
  varying vec2 vUv;

  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

export const fragmentShader = /* glsl */ `
  precision highp float;

  uniform sampler2D uTexture;
  uniform float uProgress;
  uniform float uZoom;
  uniform vec2 uResolution;
  uniform float uImageAspect;
  uniform vec2 uFocal;

  uniform vec2 uMouse;
  uniform float uMouseStrength;

  varying vec2 vUv;

  #include <common>

  // Cover-fit a UV coordinate so the source image always fills the
  // canvas without stretching, the way CSS background-size: cover would.
  vec2 coverUv(vec2 uv, float screenAspect, float imageAspect) {
    vec2 ratio;
    if (screenAspect > imageAspect) {
      ratio = vec2(imageAspect / screenAspect, 1.0);
    } else {
      ratio = vec2(1.0, screenAspect / imageAspect);
    }
    return (uv - 0.5) * ratio + 0.5;
  }

  void main() {
    float screenAspect = uResolution.x / uResolution.y;
    vec2 uv = coverUv(vUv, screenAspect, uImageAspect);

    // Vector from the focal point (the model's face) to this fragment.
    vec2 toFocal = uv - uFocal;
    float dist = length(toFocal);

    // FIX 4 — subtler lens distortion (was 0.42, now 0.16).
    float distortionStrength = uZoom * 0.16;
    float falloff = smoothstep(0.0, 0.95, dist);
    vec2 distortedUv = uv - toFocal * distortionStrength * falloff;

    // FIX 4 — gentler uniform push-in (was 0.18, now 0.07).
    float pushIn = 1.0 - uZoom * 0.07;
    vec2 zoomedUv = uFocal + (distortedUv - uFocal) * pushIn;

    // Interactive mouse distortion (gently warp UVs near the mouse pointer)
    vec2 toMouse = uv - uMouse;
    float mouseDist = length(toMouse);
    float mouseInfluence = smoothstep(0.35, 0.0, mouseDist) * uMouseStrength * 0.035;
    vec2 finalUv = zoomedUv - toMouse * mouseInfluence;

    // FIX 4 — softer chromatic fringe (was 0.0035, now 0.0014).
    float fringe = uZoom * 0.0014 * falloff;
    float r = texture2D(uTexture, finalUv + toFocal * fringe).r;
    float g = texture2D(uTexture, finalUv).g;
    float b = texture2D(uTexture, finalUv - toFocal * fringe).b;
    vec3 color = vec3(r, g, b);

    // Vignette: deepens toward the frame edges, and breathes slightly
    // with scroll progress so the image feels like it's being drawn
    // inward rather than just cropped.
    float vignette = smoothstep(0.95, 0.25, dist + uProgress * 0.05);
    color *= mix(0.55, 1.0, vignette);

    // Mild contrast lift to keep the embers reading as bright signal
    // against the void background at every frame of the sequence.
    color = pow(color, vec3(0.92));

    gl_FragColor = vec4(color, 1.0);

    // ShaderMaterial does not auto-apply output color space conversion
    // the way built-in materials do — this chunk performs the linear
    // working-space -> renderer.outputColorSpace conversion explicitly,
    // so frame colors match what the source JPGs actually look like.
    #include <colorspace_fragment>
  }
`;
