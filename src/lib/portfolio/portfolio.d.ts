declare module "*/scrubEngine.js" {
  export class ScrubEngine {
    constructor(opts: any);
    imageAspect: number;
    init(THREE: any): Promise<any>;
    setFrameByProgress(p: number): void;
    dispose(): void;
  }
}
declare module "*/tunnelShader.js" {
  export const vertexShader: string;
  export const fragmentShader: string;
}
declare module "*/ambientField.js" {
  export class AmbientField {
    constructor(opts: any);
    init(THREE: any): Promise<any>;
    setScrollProgress(p: number): void;
    dispose(): void;
  }
}
declare module "*/heroScene.js" {
  export class HeroScene {
    constructor(opts: any);
    init(THREE: any): Promise<any>;
    setMouse(x: number, y: number): void;
    setScrollProgress(p: number): void;
    dispose(): void;
  }
}
declare module "*/experienceTimeline.js" {
  export class ExperienceTimeline {
    constructor(opts: any);
    init(THREE: any): Promise<any>;
    setScrollProgress(p: number): void;
    dispose(): void;
  }
}
declare module "*/processCircuit.js" {
  export class ProcessCircuit {
    constructor(opts: any);
    init(THREE: any): Promise<any>;
    setScrollProgress(p: number): void;
    dispose(): void;
  }
}
declare module "*/aboutOrbit.js" {
  export class AboutOrbit {
    constructor(opts: any);
    init(THREE: any): Promise<any>;
    setScrollProgress(p: number): void;
    dispose(): void;
  }
}
declare module "*/workGallery.js" {
  export class WorkGallery {
    constructor(opts: any);
    init(THREE: any): Promise<any>;
    setScrollProgress(p: number): void;
    dispose(): void;
  }
}
declare module "*/proofRadar.js" {
  export class ProofRadar {
    constructor(opts: any);
    init(THREE: any): Promise<any>;
    setScrollProgress(p: number): void;
    dispose(): void;
  }
}
