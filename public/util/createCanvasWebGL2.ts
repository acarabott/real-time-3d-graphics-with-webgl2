export const createCanvasWebGL2 = (width: number, height: number) => {
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;

    const gl = canvas.getContext("webgl2");

    if (gl === null) {
        throw new Error("Could not create WebGL2 context");
    }

    return { canvas, gl };
};
