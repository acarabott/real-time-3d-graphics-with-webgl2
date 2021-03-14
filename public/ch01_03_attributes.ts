type Color = [number, number, number, number];

const updateClearColor = (gl: WebGL2RenderingContext, ...color: Color) => {
    gl.clearColor(...color);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.viewport(0, 0, 0, 0);
};

const init = () => {
    const canvas = document.createElement("canvas");
    document.body.appendChild(canvas);
    const gl = canvas.getContext("webgl2");

    if (gl === null) {
        return;
    }

    updateClearColor(gl, 0.3, 0.4, 0.8, 1.0);

    document.body.addEventListener("keydown", (event: KeyboardEvent) => {
        switch (event.code) {
            case "Digit1":
                updateClearColor(gl, 0.2, 0.8, 0.2, 1.0);
                break;

            case "Digit2":
                updateClearColor(gl, 0.2, 0.2, 0.8, 1.0);
                break;

            case "Digit3":
                updateClearColor(gl, Math.random(), Math.random(), Math.random(), 1.0);
                break;

            case "Digit4": {
                // get color
                console.log(gl.getParameter(gl.COLOR_CLEAR_VALUE));

                break;
            }

            default:
                break;
        }
    });
};

window.onload = init;
