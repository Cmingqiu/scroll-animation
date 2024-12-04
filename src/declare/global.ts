declare global {
  interface Window {
    PxLoader: any;
  }

  type Sections = Array<{
    id?: number;
    name: string;
    frameCnt: number;
    imgs: HTMLImageElement[];
    rawUrl: string;
  }>;
}
