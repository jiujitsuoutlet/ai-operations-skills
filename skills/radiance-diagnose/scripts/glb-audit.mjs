#!/usr/bin/env node

import fs from "node:fs";

const assetPath = process.argv[2];
if (!assetPath) throw new Error("usage: node glb-audit.mjs <asset.glb>");

const bytes = fs.readFileSync(assetPath);
if (bytes.toString("ascii", 0, 4) !== "glTF") throw new Error("input is not a binary glTF file");

let offset = 12;
let json = null;
let binary = null;
while (offset < bytes.length) {
  const length = bytes.readUInt32LE(offset);
  const type = bytes.toString("ascii", offset + 4, offset + 8);
  const payload = bytes.subarray(offset + 8, offset + 8 + length);
  if (type === "JSON") json = JSON.parse(payload.toString("utf8").replace(/\0+$/u, ""));
  if (type.startsWith("BIN")) binary = payload;
  offset += 8 + length;
}
if (!json || !binary) throw new Error("GLB must contain JSON and BIN chunks");

const componentInfo = {
  5120: [Int8Array, 1],
  5121: [Uint8Array, 1],
  5122: [Int16Array, 2],
  5123: [Uint16Array, 2],
  5125: [Uint32Array, 4],
  5126: [Float32Array, 4],
};
const typeSize = { SCALAR: 1, VEC2: 2, VEC3: 3, VEC4: 4, MAT2: 4, MAT3: 9, MAT4: 16 };

function readAccessor(index) {
  const accessor = json.accessors[index];
  const view = json.bufferViews[accessor.bufferView];
  const [ArrayType, componentBytes] = componentInfo[accessor.componentType] || [];
  const components = typeSize[accessor.type];
  if (!ArrayType || !components) throw new Error(`unsupported accessor ${index}`);
  const sourceOffset = (view.byteOffset || 0) + (accessor.byteOffset || 0);
  const stride = view.byteStride || componentBytes * components;
  const result = new ArrayType(accessor.count * components);
  for (let item = 0; item < accessor.count; item += 1) {
    for (let component = 0; component < components; component += 1) {
      result[item * components + component] = new ArrayType(
        binary.buffer,
        binary.byteOffset + sourceOffset + item * stride + component * componentBytes,
        1,
      )[0];
    }
  }
  return { values: result, count: accessor.count, components };
}

function eigenvalues3(matrix) {
  const a = matrix.map((row) => row.slice());
  for (let iteration = 0; iteration < 24; iteration += 1) {
    let p = 0;
    let q = 1;
    for (const [left, right] of [[0, 1], [0, 2], [1, 2]]) {
      if (Math.abs(a[left][right]) > Math.abs(a[p][q])) [p, q] = [left, right];
    }
    if (Math.abs(a[p][q]) < 1e-14) break;
    const angle = 0.5 * Math.atan2(2 * a[p][q], a[q][q] - a[p][p]);
    const cosine = Math.cos(angle);
    const sine = Math.sin(angle);
    const app = cosine * cosine * a[p][p] - 2 * sine * cosine * a[p][q] + sine * sine * a[q][q];
    const aqq = sine * sine * a[p][p] + 2 * sine * cosine * a[p][q] + cosine * cosine * a[q][q];
    for (let k = 0; k < 3; k += 1) {
      if (k === p || k === q) continue;
      const akp = cosine * a[k][p] - sine * a[k][q];
      const akq = sine * a[k][p] + cosine * a[k][q];
      a[k][p] = a[p][k] = akp;
      a[k][q] = a[q][k] = akq;
    }
    a[p][p] = app;
    a[q][q] = aqq;
    a[p][q] = a[q][p] = 0;
  }
  return [a[0][0], a[1][1], a[2][2]].sort((left, right) => left - right);
}

function primitiveReport(meshIndex, primitiveIndex, primitive) {
  const position = readAccessor(primitive.attributes.POSITION);
  const index = primitive.indices == null
    ? { values: Uint32Array.from({ length: position.count }, (_, item) => item), count: position.count }
    : readAccessor(primitive.indices);
  if (position.components !== 3 || index.count % 3 !== 0) {
    throw new Error(`mesh ${meshIndex} primitive ${primitiveIndex} is not indexed triangles`);
  }

  const parent = new Int32Array(position.count);
  const rank = new Uint8Array(position.count);
  for (let vertex = 0; vertex < parent.length; vertex += 1) parent[vertex] = vertex;
  const find = (value) => {
    let root = value;
    while (parent[root] !== root) root = parent[root];
    while (parent[value] !== value) {
      const next = parent[value];
      parent[value] = root;
      value = next;
    }
    return root;
  };
  const union = (left, right) => {
    let a = find(left);
    let b = find(right);
    if (a === b) return;
    if (rank[a] < rank[b]) [a, b] = [b, a];
    parent[b] = a;
    if (rank[a] === rank[b]) rank[a] += 1;
  };

  let maximumTriangleEdge = 0;
  let maximumTriangleArea = 0;
  for (let item = 0; item < index.count; item += 3) {
    const vertices = [index.values[item], index.values[item + 1], index.values[item + 2]];
    union(vertices[0], vertices[1]);
    union(vertices[1], vertices[2]);
    const points = vertices.map((vertex) => [
      position.values[vertex * 3],
      position.values[vertex * 3 + 1],
      position.values[vertex * 3 + 2],
    ]);
    const edge = (a, b) => Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]);
    maximumTriangleEdge = Math.max(maximumTriangleEdge, edge(points[0], points[1]), edge(points[1], points[2]), edge(points[2], points[0]));
    const u = points[1].map((value, axis) => value - points[0][axis]);
    const v = points[2].map((value, axis) => value - points[0][axis]);
    const cross = [u[1] * v[2] - u[2] * v[1], u[2] * v[0] - u[0] * v[2], u[0] * v[1] - u[1] * v[0]];
    maximumTriangleArea = Math.max(maximumTriangleArea, Math.hypot(...cross) * 0.5);
  }

  const components = new Map();
  for (let item = 0; item < index.count; item += 3) {
    const root = find(index.values[item]);
    let component = components.get(root);
    if (!component) {
      component = { triangles: 0, vertices: new Set() };
      components.set(root, component);
    }
    component.triangles += 1;
    component.vertices.add(index.values[item]);
    component.vertices.add(index.values[item + 1]);
    component.vertices.add(index.values[item + 2]);
  }

  const rows = [...components.values()].map((component, componentIndex) => {
    const vertices = [...component.vertices];
    const mean = [0, 0, 0];
    const min = [Infinity, Infinity, Infinity];
    const max = [-Infinity, -Infinity, -Infinity];
    for (const vertex of vertices) {
      for (let axis = 0; axis < 3; axis += 1) {
        const value = position.values[vertex * 3 + axis];
        mean[axis] += value / vertices.length;
        min[axis] = Math.min(min[axis], value);
        max[axis] = Math.max(max[axis], value);
      }
    }
    const covariance = Array.from({ length: 3 }, () => [0, 0, 0]);
    for (const vertex of vertices) {
      const delta = [0, 1, 2].map((axis) => position.values[vertex * 3 + axis] - mean[axis]);
      for (let row = 0; row < 3; row += 1) {
        for (let column = 0; column < 3; column += 1) {
          covariance[row][column] += delta[row] * delta[column] / vertices.length;
        }
      }
    }
    const eigenvalues = eigenvalues3(covariance).map((value) => Math.max(0, value));
    const planarityRatio = Math.sqrt(eigenvalues[0] / Math.max(eigenvalues[2], Number.EPSILON));
    return {
      component_index: componentIndex,
      triangles: component.triangles,
      vertices: vertices.length,
      bounds: { min, max, size: max.map((value, axis) => value - min[axis]) },
      covariance_eigenvalues: eigenvalues,
      planarity_ratio: planarityRatio,
      planar_candidate: component.triangles >= 2 && planarityRatio <= 0.02,
    };
  }).sort((left, right) => right.triangles - left.triangles);

  return {
    mesh_index: meshIndex,
    primitive_index: primitiveIndex,
    mode: primitive.mode ?? 4,
    triangles: index.count / 3,
    vertices: position.count,
    maximum_triangle_edge: maximumTriangleEdge,
    maximum_triangle_area: maximumTriangleArea,
    components: rows,
    planar_candidates: rows.filter((row) => row.planar_candidate),
  };
}

const primitives = [];
for (let meshIndex = 0; meshIndex < (json.meshes || []).length; meshIndex += 1) {
  const mesh = json.meshes[meshIndex];
  for (let primitiveIndex = 0; primitiveIndex < mesh.primitives.length; primitiveIndex += 1) {
    primitives.push(primitiveReport(meshIndex, primitiveIndex, mesh.primitives[primitiveIndex]));
  }
}

console.log(JSON.stringify({
  schema: "glb-asset-audit-v1",
  asset: assetPath,
  generator: json.asset?.generator || null,
  scene_index: json.scene ?? 0,
  nodes: (json.nodes || []).map((node, nodeIndex) => ({
    node_index: nodeIndex,
    node_name: node.name || null,
    mesh_index: node.mesh ?? null,
    children: node.children || [],
  })),
  meshes: (json.meshes || []).map((mesh, meshIndex) => ({
    mesh_index: meshIndex,
    mesh_name: mesh.name || null,
    primitive_count: mesh.primitives.length,
  })),
  primitives,
}, null, 2));
