import { createCanvasWebGL2 } from "./util/createCanvasWebGL2";
import { loadTextFile } from "./util/loadTextFile";

const renderingModes = [
    "TRIANGLES",
    "LINES",
    "POINTS",
    "LINE_LOOP",
    "LINE_STRIP",
    "TRIANGLE_STRIP",
    "TRIANGLE_FAN",
] as const;

type RenderingMode = typeof renderingModes[number];

type RenderingModeLookup<T> = { [key in RenderingMode]: T };

const initBuffers = (
    gl: WebGL2RenderingContext,
    vertices: Float32Array,
    indicesLookup: RenderingModeLookup<Uint16Array>,
    vertexPosition: number,
) => {
    // setup VBO
    const vertexBuffer = gl.createBuffer();
    if (vertexBuffer === null) {
        throw new Error("could not create buffer");
    }
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

    // setup IBOs
    const indexBuffers = Object.entries(indicesLookup).reduce<RenderingModeLookup<WebGLBuffer>>(
        (accum, [key, indices]) => {
            const indexBuffer = gl.createBuffer();
            if (indexBuffer === null) {
                throw new Error("could not create buffer");
            }
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
            gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);

            return { ...accum, [key as RenderingMode]: indexBuffer };
        },
        {} as RenderingModeLookup<WebGLBuffer>,
    );

    // setup VAO
    const trapezoidVAO = gl.createVertexArray();
    if (trapezoidVAO === null) {
        throw new Error("could not create vertexArrayObject");
    }
    gl.bindVertexArray(trapezoidVAO);
    // Provide instructions for VAO to use data later in draw
    gl.enableVertexAttribArray(vertexPosition);
    if (gl.getError() !== gl.NO_ERROR) {
        throw new Error("could not enable vertexAttribArray");
    }
    gl.vertexAttribPointer(vertexPosition, 3, gl.FLOAT, false, 0, 0);

    // clean up
    gl.bindVertexArray(null);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);

    return { vertexBuffer, indexBuffers, vertexArrayObject: trapezoidVAO };
};

function loadShader(gl: WebGL2RenderingContext, type: "vertex" | "fragment", source: string) {
    const shader = gl.createShader({ vertex: gl.VERTEX_SHADER, fragment: gl.FRAGMENT_SHADER }[type]);
    if (shader === null) {
        throw new Error(`could not create ${type} shader`);
    }

    // Compile the shader using the supplied shader code
    gl.shaderSource(shader, source);
    gl.compileShader(shader);

    // Ensure the shader is valid
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        throw new Error(gl.getShaderInfoLog(shader) ?? `Could not compile ${type} shader`);
    }

    return shader;
}

const initProgram = async (gl: WebGL2RenderingContext) => {
    const program = gl.createProgram();
    if (program === null) {
        throw new Error("could not create gl program");
    }

    const vertexSource = await loadTextFile("./ch02_04_rendering-modes.vert");
    const vertexShader = loadShader(gl, "vertex", vertexSource);
    gl.attachShader(program, vertexShader);

    const fragmentSource = await loadTextFile("./ch02_04_rendering-modes.frag");
    const fragmentShader = loadShader(gl, "fragment", fragmentSource);
    gl.attachShader(program, fragmentShader);

    gl.linkProgram(program);

    const didLink = gl.getProgramParameter(program, gl.LINK_STATUS) as boolean;
    if (!didLink) {
        throw new Error("could not link gl program");
    }

    gl.useProgram(program);

    return program;
};

interface Data {
    vertices: Float32Array;
    vertexBuffer: WebGLBuffer;
    indices: RenderingModeLookup<Uint16Array>;
    indexBuffers: RenderingModeLookup<WebGLBuffer>;
    vertexArrayObject: WebGLVertexArrayObject;
    vertexPosition: number;
}

const draw = (gl: WebGL2RenderingContext, data: Data, renderingMode: RenderingMode) => {
    // clear the scene
    gl.clearColor(0, 0, 0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

    // bind the VAO
    gl.bindVertexArray(data.vertexArrayObject);

    // bind IBO
    const indexBuffer = data.indexBuffers[renderingMode];
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);

    // draw using triangle primitive
    gl.drawElements(gl[renderingMode], data.indices[renderingMode].length, gl.UNSIGNED_SHORT, 0);

    // clean up
    gl.bindVertexArray(null);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
};

const createSelect = (onChange: (renderingMode: RenderingMode) => void) => {
    const selectEl = document.createElement("select");

    selectEl.onchange = () => onChange(renderingModes[selectEl.selectedIndex]);

    for (const mode of renderingModes) {
        const optionEl = document.createElement("option");
        optionEl.textContent = mode;
        selectEl.appendChild(optionEl);
    }

    return selectEl;
};

const main = async () => {
    const { canvas, gl } = createCanvasWebGL2(window.innerWidth, window.innerHeight);

    /* eslint-disable no-multi-spaces */
    // prettier-ignore
    const vertices = new Float32Array([
        -0.5,  -0.5, 0.0, // 0 bottom left
        -0.25,  0.5, 0.0, // 1 top left 
         0.00, -0.5, 0.0, // 2 bottom mid
         0.25,  0.5, 0.0, // 3 top right
         0.50, -0.5, 0.0, // 4 bottom right
    ]);

    // prettier-ignore
    const indices: RenderingModeLookup<Uint16Array> = {
        TRIANGLES: new Uint16Array([
            0, 1, 2, 
            1, 2, 3, 
            2, 3, 4
        ]),
        LINES: new Uint16Array([
            0, 1, 
            1, 2, 
            2, 3, 
            3, 4
        ]),
        POINTS: new Uint16Array([1, 2, 3]),
        LINE_LOOP: new Uint16Array([0, 1, 3, 4]),
        LINE_STRIP: new Uint16Array([2, 3, 4, 1, 0]),
        TRIANGLE_STRIP: new Uint16Array([0, 1, 2, 3, 4]),
        TRIANGLE_FAN: new Uint16Array([
            0, 
            1, 2, 
            3, 4
        ]),
    };

    const program = await initProgram(gl);

    const vertexPosition = gl.getAttribLocation(program, "aVertexPosition");
    const buffers = initBuffers(gl, vertices, indices, vertexPosition);

    const data: Data = {
        vertices,
        indices,
        ...buffers,
        vertexPosition,
    };

    const storageKey = "ac-renderingMode";
    document.body.appendChild(
        createSelect((mode) => {
            localStorage.setItem(storageKey, mode);
            draw(gl, data, mode);
        }),
    );
    document.body.appendChild(canvas);

    const loaded = localStorage.getItem(storageKey);
    draw(gl, data, (loaded as RenderingMode) ?? "TRIANGLES");
};

window.onload = main;
