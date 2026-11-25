"""Tests for kitchen/ingredients/ingredients.py and export_catalog.py."""

import json
import sys
import unittest
from pathlib import Path

INGREDIENTS_DIR = Path(__file__).resolve().parent.parent / "kitchen" / "ingredients"
sys.path.insert(0, str(INGREDIENTS_DIR))

from export_catalog import build_catalog  # noqa: E402
from ingredients import INGREDIENTS, TOOLS, UNITS  # noqa: E402


class TestIngredientsCatalog(unittest.TestCase):
    def test_resolve_valid_form_and_unit(self):
        resolved = INGREDIENTS["garlic"].resolve(form="paste", amount=2, unit="tsp")
        self.assertEqual(resolved["en"], "Garlic")
        self.assertEqual(resolved["ur"], "لہسن")
        self.assertEqual(resolved["form"], "paste")
        self.assertEqual(resolved["unit_labels"]["ur"], UNITS["tsp"].ur)
        self.assertTrue(resolved["image"].endswith("garlic/paste.png"))

    def test_resolve_unknown_form_raises(self):
        with self.assertRaises(ValueError):
            INGREDIENTS["garlic"].resolve(form="julienned", amount=1, unit="tsp")

    def test_catalog_export_matches_registries(self):
        catalog = build_catalog()
        self.assertEqual(set(catalog["ingredients"].keys()), set(INGREDIENTS.keys()))
        self.assertEqual(set(catalog["tools"].keys()), set(TOOLS.keys()))
        self.assertEqual(set(catalog["units"].keys()), set(UNITS.keys()))

        catalog_js = (INGREDIENTS_DIR / "catalog.js").read_text(encoding="utf-8")
        self.assertIn("const INGREDIENT_CATALOG =", catalog_js)
        json_text = catalog_js.split("const INGREDIENT_CATALOG =", 1)[1].strip().rstrip(";")
        parsed = json.loads(json_text)
        self.assertEqual(parsed["ingredients"]["onion"]["ur"], "پیاز")
        self.assertEqual(parsed["existingAssets"], catalog["existingAssets"])
        self.assertGreater(len(parsed["existingAssets"]), 0)

        sample_recipe_dir = INGREDIENTS_DIR.parent / "recipes" / "_sample"
        for rel_path in parsed["existingAssets"]:
            self.assertTrue((sample_recipe_dir / rel_path).resolve().is_file(), f"Missing asset listed in existingAssets: {rel_path}")


if __name__ == "__main__":
    unittest.main()
