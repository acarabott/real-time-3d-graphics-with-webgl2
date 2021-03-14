# WebGL 2.0 Notes

- define a set of vertices, each have position, color, etc stored in VBOs
- connect VBOs to vertex shader with Attributes
- define relationships between points to create triangles (IBO)
- interpolate between them to fill in pixels (fragment shader)


Attributes are inputs to the vertex shader

Uniforms are inputs to vertex and fragment shader

Varyings pass data from the vertex shader to fragment shader

Vertex shader defines a set of points
Fragment shader defines what happens for each pixel between those points


VBO Vertex Buffer Objects = arrays of Vertices (vertex = 3 floats)
IBO Index Buffer Objects = arrays of Indices (indices of vertices to create triangles, usually counter-clockwise)
    e.g. create 9 points, first three indices will define the first triangle.
