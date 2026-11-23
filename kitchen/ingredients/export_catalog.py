#!/usr/bin/env python3
"""Export kitchen/ingredients/ingredients.py into kitchen/ingredients/catalog.js."""

from dataclasses import asdict
import json
from pathlib import Path

from ingredients import INGREDIENTS, TOOLS, UNITS


def build_catalog() -> dict:
    """Convert Python dataclasses into a JSON-serializable catalog."""
    return {
        "units": {k: asdict(v) for k, v in UNITS.items()},
        "ingredients": {k: asdict(v) for k, v in INGREDIENTS.items()},
        "tools": {k: asdict(v) for k, v in TOOLS.items()},
    }


def export_catalog(output_path: Path | None = None) -> Path:
    """Write catalog.js for static file:// and GitHub Pages consumption."""
    dest = output_path or (Path(__file__).resolve().parent / "catalog.js")
    payload = json.dumps(build_catalog(), ensure_ascii=False, indent=2)
    dest.write_text(
        "// Auto-generated from kitchen/ingredients/ingredients.py\n"
        "// Run: uv run python kitchen/ingredients/export_catalog.py\n"
        f"const INGREDIENT_CATALOG = {payload};\n",
        encoding="utf-8",
    )
    return dest


if __name__ == "__main__":
    written = export_catalog()
    print(f"Exported {written}")
