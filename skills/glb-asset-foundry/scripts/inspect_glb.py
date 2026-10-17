#!/usr/bin/env python3
"""Dependency-free structural census for binary glTF 2.0 files."""

import argparse
import json
import struct
from pathlib import Path

JSON_CHUNK = 0x4E4F534A


def load_glb(path: Path):
    data = path.read_bytes()
    if len(data) < 12:
        raise ValueError("file is shorter than a GLB header")
    magic, version, declared_length = struct.unpack_from("<4sII", data, 0)
    if magic != b"glTF":
        raise ValueError("not a GLB file")
    if version != 2:
        raise ValueError(f"unsupported GLB version {version}")
    if declared_length != len(data):
        raise ValueError(
            f"declared length {declared_length} does not match file size {len(data)}"
        )
    offset = 12
    document = None
    chunks = []
    while offset + 8 <= len(data):
        length, kind = struct.unpack_from("<II", data, offset)
        offset += 8
        end = offset + length
        if end > len(data):
            raise ValueError("chunk extends beyond file")
        chunks.append({"type": f"0x{kind:08x}", "bytes": length})
        if kind == JSON_CHUNK:
            document = json.loads(data[offset:end].decode("utf-8").rstrip(" \t\r\n\x00"))
        offset = end
    if document is None:
        raise ValueError("GLB has no JSON chunk")
    return document, chunks, len(data)


def triangle_census(document):
    accessors = document.get("accessors", [])
    total = 0
    primitive_rows = []
    for mesh_index, mesh in enumerate(document.get("meshes", [])):
        for primitive_index, primitive in enumerate(mesh.get("primitives", [])):
            mode = primitive.get("mode", 4)
            triangles = None
            source = None
            count = None
            if mode == 4:
                if "indices" in primitive:
                    accessor_index = primitive["indices"]
                    count = accessors[accessor_index].get("count", 0)
                    source = f"indices:{accessor_index}"
                else:
                    position_index = primitive.get("attributes", {}).get("POSITION")
                    if position_index is not None:
                        count = accessors[position_index].get("count", 0)
                        source = f"POSITION:{position_index}"
                if count is not None:
                    triangles = count // 3
                    total += triangles
            primitive_rows.append(
                {
                    "mesh": mesh_index,
                    "primitive": primitive_index,
                    "mode": mode,
                    "count_source": source,
                    "element_count": count,
                    "estimated_triangles": triangles,
                    "material": primitive.get("material"),
                }
            )
    return total, primitive_rows


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("glb", type=Path)
    args = parser.parse_args()
    document, chunks, byte_size = load_glb(args.glb)
    triangles, primitives = triangle_census(document)
    report = {
        "path": str(args.glb.resolve()),
        "bytes": byte_size,
        "asset": document.get("asset", {}),
        "counts": {
            "scenes": len(document.get("scenes", [])),
            "nodes": len(document.get("nodes", [])),
            "meshes": len(document.get("meshes", [])),
            "primitives": sum(len(m.get("primitives", [])) for m in document.get("meshes", [])),
            "materials": len(document.get("materials", [])),
            "textures": len(document.get("textures", [])),
            "images": len(document.get("images", [])),
            "accessors": len(document.get("accessors", [])),
            "animations": len(document.get("animations", [])),
            "skins": len(document.get("skins", [])),
        },
        "estimated_triangles": triangles,
        "primitives": primitives,
        "chunks": chunks,
    }
    print(json.dumps(report, indent=2, sort_keys=True))


if __name__ == "__main__":
    main()
