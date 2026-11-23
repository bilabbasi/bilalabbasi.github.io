const RECIPE_DATA = `
title: "Ammi’s Yellow Daal"
subtitle: "تڑکا دال"
description: "One of the quintessential dishes demonstrating the beauty of a tarka."
image: "../../../assets/kitchen_sketch.png"

ingredients:
  - section: "Daal (دال)"
    items:
      - "1/2 cup Toor Daal (تور دال)"
      - "1 tbsp Chana Daal (چنا دال)"
      - "1/2 medium Yellow Onion, thinly sliced (پیاز)"
      - "1/2 medium Tomato, chopped (ٹماٹر)"
      - "2 tsp Garlic Paste or 4-6 cloves, minced (لہسن کا پیسٹ)"
      - "2 tsp Ginger Paste or 2-3cm piece, minced (ادرک کا پیسٹ)"
      - "1/2 tsp Turmeric / Haldi (ہلدی)"
      - "1.5 tsp Coriander Powder / Dhaniya Powder (دھنیا پاؤڈر)"
      - "5-6 Indian Green Chillies, whole or sliced (ہری مرچیں)"
      - "4 tsp Olive Oil (زیتون کا تیل)"
      - "1.5 cups Water (پانی)"
      - "Salt to taste (نمک)"
  - section: "Tarka (تڑکا)"
    items:
      - "3 tbsp Ghee (گھی)"
      - "2 tbsp Cumin Seeds (زیرہ)"
      - "1/4 medium Yellow Onion, chopped (پیاز)"
      - "5 Garlic cloves, minced (لہسن)"
  - section: "Kachumbar - Optional (کچومبر)"
    items:
      - "1/4 medium Yellow Onion, chopped (پیاز)"
      - "1 tsp Vinegar (سرکہ)"
      - "1 Green Chilli, sliced (ہری مرچ)"
      - "Pinch of Sugar (چینی)"
      - "Pinch of Kashmiri Chili Powder (کشمیری لال مرچ)"
      - "Salt to taste (نمک)"
      - "Juice from half a lemon / ~1 tbsp (لیموں کا رس)"

steps:
  - section: "Pressure Cooker Method"
    image: "../../../assets/kitchen_sketch_step1.png"
    tools:
      - pressure_cooker
    ingredients:
      - name: toor_daal
        form: dry
        amount: "1/2"
        unit: cup
      - name: chana_daal
        form: dry
        amount: 1
        unit: tbsp
      - name: onion
        form: sliced
        amount: "1/2"
        unit: medium
      - name: tomato
        form: chopped
        amount: "1/2"
        unit: medium
      - name: garlic
        form: paste
        amount: 2
        unit: tsp
      - name: ginger
        form: paste
        amount: 2
        unit: tsp
      - name: turmeric
        form: powder
        amount: "1/2"
        unit: tsp
      - name: coriander_powder
        form: powder
        amount: 1.5
        unit: tsp
      - name: green_chilli
        form: whole
        amount: "5-6"
      - name: olive_oil
        form: liquid
        amount: 4
        unit: tsp
      - name: water
        form: liquid
        amount: 1.5
        unit: cups
      - name: salt
        form: powder
        amount: to taste
    items:
      - "Put all of the ingredients for the daal into a pressure cooker and set to medium-high."
      - "Wait for 7-8 whistles and then reduce heat to low."
      - "Open the lid carefully. Use a hand blender to blend until about 80% is a puree (you still want some daal bits)."
      - "Season with salt to taste."
  - section: "Alternative Stovetop Method"
    image: "../../../assets/kitchen_sketch_step2.png"
    items:
      - "Thoroughly rinse the daal."
      - "In a medium saucepan, bring the daal to a boil with 2 cups of water, skim off any foam."
      - "Add all of the ingredients except for the salt. Reduce to a simmer on low heat, cover, and cook for 15 minutes."
      - "Add salt and continue to simmer covered for about 40 minutes until tender."
      - "Use a hand blender to lightly blend the daal mixture (do not turn into a smooth purée)."
  - section: "Prepare the Tarka"
    image: "../../../assets/kitchen_sketch_step4.png"
    tools:
      - saucepan
    ingredients:
      - name: ghee
        form: melted
        amount: 3
        unit: tbsp
      - name: cumin_seeds
        form: whole
        amount: 2
        unit: tbsp
      - name: onion
        form: chopped
        amount: "1/4"
        unit: medium
      - name: garlic
        form: minced
        amount: 5
        unit: cloves
    items:
      - "In a small saucepan, heat the ghee over medium heat."
      - "Once the ghee is glistening, add the cumin seeds, minced garlic, and chopped onions."
      - "Fry until golden brown and aromatic, being careful not to burn the garlic."
      - "Pour the hot tarka mixture directly into the cooked daal and stir."
  - section: "Kachumbar & Serve"
    tools:
      - bowl
    ingredients:
      - name: onion
        form: chopped
        amount: "1/4"
        unit: medium
      - name: vinegar
        form: liquid
        amount: 1
        unit: tsp
      - name: green_chilli
        form: sliced
        amount: 1
      - name: sugar
        form: granulated
        amount: 1
        unit: pinch
      - name: kashmiri_chili
        form: powder
        amount: 1
        unit: pinch
      - name: lemon_juice
        form: liquid
        amount: 1
        unit: tbsp
      - name: salt
        form: powder
        amount: to taste
    items:
      - "Kachumbar: Mix all of the chopped onion, vinegar, green chilli, sugar, Kashmiri chili powder, lemon juice, and salt in a bowl."
      - "Serve the hot tarka daal over rice with the fresh kachumbar salad on the side."
      - "Enjoy by taking bites of the rice, daal, and kachumbar together!"
`;
