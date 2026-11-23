"""Central catalog of kitchen ingredients, preparation forms, units, and tools."""

from dataclasses import dataclass, field


@dataclass(frozen=True)
class Unit:
    """Unit of measurement with English and Urdu labels."""

    key: str
    en: str
    ur: str


@dataclass(frozen=True)
class Ingredient:
    """An ingredient with English/Urdu names and per-form illustration paths."""

    key: str
    en: str
    ur: str
    forms: dict[str, str] = field(default_factory=dict)
    default_form: str = "whole"

    def resolve(self, form: str | None = None, amount: float | str | None = None, unit: str | None = None) -> dict:
        """Resolve an ingredient form, quantity, and bilingual captions."""
        chosen_form = form or self.default_form
        if self.forms and chosen_form not in self.forms:
            available = ", ".join(sorted(self.forms))
            raise ValueError(f"Unknown form '{chosen_form}' for '{self.key}'. Available: {available}")

        unit_obj = UNITS.get(unit) if unit else None
        return {
            "kind": "ingredient",
            "key": self.key,
            "form": chosen_form,
            "image": self.forms.get(chosen_form, ""),
            "amount": amount,
            "unit": unit,
            "en": self.en,
            "ur": self.ur,
            "unit_labels": {
                "en": unit_obj.en if unit_obj else (unit or ""),
                "ur": unit_obj.ur if unit_obj else (unit or ""),
            },
        }


@dataclass(frozen=True)
class Tool:
    """A cooking vessel or tool with English/Urdu names and optional illustration."""

    key: str
    en: str
    ur: str
    image: str = ""


UNITS: dict[str, Unit] = {
    "tsp": Unit("tsp", "tsp", "چائے کا چمچ"),
    "tbsp": Unit("tbsp", "tbsp", "کھانے کا چمچ"),
    "cup": Unit("cup", "cup", "کپ"),
    "cups": Unit("cups", "cups", "کپ"),
    "cloves": Unit("cloves", "cloves", "جوے"),
    "medium": Unit("medium", "medium", "درمیانہ"),
    "piece": Unit("piece", "piece", "ٹکڑا"),
    "pinch": Unit("pinch", "pinch", "چٹکی"),
    "whole": Unit("whole", "whole", "ثابت"),
}


INGREDIENTS: dict[str, Ingredient] = {
    "garlic": Ingredient(
        key="garlic",
        en="Garlic",
        ur="لہسن",
        default_form="minced",
        forms={
            "whole": "../../ingredients/images/garlic/whole.png",
            "minced": "../../ingredients/images/garlic/minced.png",
            "diced": "../../ingredients/images/garlic/diced.png",
            "paste": "../../ingredients/images/garlic/paste.png",
        },
    ),
    "onion": Ingredient(
        key="onion",
        en="Yellow Onion",
        ur="پیاز",
        default_form="chopped",
        forms={
            "whole": "../../ingredients/images/onion/whole.png",
            "sliced": "../../ingredients/images/onion/sliced.png",
            "chopped": "../../ingredients/images/onion/chopped.png",
            "diced": "../../ingredients/images/onion/diced.png",
            "paste": "../../ingredients/images/onion/paste.png",
        },
    ),
    "tomato": Ingredient(
        key="tomato",
        en="Tomato",
        ur="ٹماٹر",
        default_form="chopped",
        forms={
            "whole": "../../ingredients/images/tomato/whole.png",
            "chopped": "../../ingredients/images/tomato/chopped.png",
        },
    ),
    "ginger": Ingredient(
        key="ginger",
        en="Ginger",
        ur="ادرک",
        default_form="paste",
        forms={
            "whole": "../../ingredients/images/ginger/whole.png",
            "minced": "../../ingredients/images/ginger/minced.png",
            "paste": "../../ingredients/images/ginger/paste.png",
        },
    ),
    "toor_daal": Ingredient(
        key="toor_daal",
        en="Toor Daal",
        ur="تور دال",
        default_form="dry",
        forms={"dry": "../../ingredients/images/toor_daal/dry.png"},
    ),
    "chana_daal": Ingredient(
        key="chana_daal",
        en="Chana Daal",
        ur="چنا دال",
        default_form="dry",
        forms={"dry": "../../ingredients/images/chana_daal/dry.png"},
    ),
    "turmeric": Ingredient(
        key="turmeric",
        en="Turmeric",
        ur="ہلدی",
        default_form="powder",
        forms={"powder": "../../ingredients/images/turmeric/powder.png"},
    ),
    "coriander_powder": Ingredient(
        key="coriander_powder",
        en="Coriander Powder",
        ur="دھنیا پاؤڈر",
        default_form="powder",
        forms={"powder": "../../ingredients/images/coriander_powder/powder.png"},
    ),
    "green_chilli": Ingredient(
        key="green_chilli",
        en="Green Chilli",
        ur="ہری مرچ",
        default_form="whole",
        forms={
            "whole": "../../ingredients/images/green_chilli/whole.png",
            "sliced": "../../ingredients/images/green_chilli/sliced.png",
        },
    ),
    "olive_oil": Ingredient(
        key="olive_oil",
        en="Olive Oil",
        ur="زیتون کا تیل",
        default_form="liquid",
        forms={"liquid": "../../ingredients/images/olive_oil/liquid.png"},
    ),
    "water": Ingredient(
        key="water",
        en="Water",
        ur="پانی",
        default_form="liquid",
        forms={"liquid": "../../ingredients/images/water/liquid.png"},
    ),
    "salt": Ingredient(
        key="salt",
        en="Salt",
        ur="نمک",
        default_form="powder",
        forms={"powder": "../../ingredients/images/salt/powder.png"},
    ),
    "ghee": Ingredient(
        key="ghee",
        en="Ghee",
        ur="گھی",
        default_form="melted",
        forms={"melted": "../../ingredients/images/ghee/melted.png"},
    ),
    "cumin_seeds": Ingredient(
        key="cumin_seeds",
        en="Cumin Seeds",
        ur="زیرہ",
        default_form="whole",
        forms={"whole": "../../ingredients/images/cumin_seeds/whole.png"},
    ),
    "vinegar": Ingredient(
        key="vinegar",
        en="Vinegar",
        ur="سرکہ",
        default_form="liquid",
        forms={"liquid": "../../ingredients/images/vinegar/liquid.png"},
    ),
    "sugar": Ingredient(
        key="sugar",
        en="Sugar",
        ur="چینی",
        default_form="granulated",
        forms={"granulated": "../../ingredients/images/sugar/granulated.png"},
    ),
    "kashmiri_chili": Ingredient(
        key="kashmiri_chili",
        en="Kashmiri Chili",
        ur="کشمیری لال مرچ",
        default_form="powder",
        forms={"powder": "../../ingredients/images/kashmiri_chili/powder.png"},
    ),
    "lemon_juice": Ingredient(
        key="lemon_juice",
        en="Lemon Juice",
        ur="لیموں کا رس",
        default_form="liquid",
        forms={"liquid": "../../ingredients/images/lemon_juice/liquid.png"},
    ),
    "potato": Ingredient(
        key="potato",
        en="Potato",
        ur="آلو",
        default_form="diced",
        forms={"diced": "../../ingredients/images/potato/diced.png"},
    ),
}


TOOLS: dict[str, Tool] = {
    "pressure_cooker": Tool(
        key="pressure_cooker",
        en="Pressure Cooker",
        ur="پریشر ککر",
        image="../../ingredients/images/tools/pressure_cooker.png",
    ),
    "saucepan": Tool(
        key="saucepan",
        en="Small Saucepan",
        ur="سوس پین",
        image="../../ingredients/images/tools/saucepan.png",
    ),
    "karahi": Tool(
        key="karahi",
        en="Karahi",
        ur="کڑاہی",
        image="../../ingredients/images/tools/karahi.png",
    ),
    "bowl": Tool(
        key="bowl",
        en="Mixing Bowl",
        ur="پیالہ",
    ),
}
