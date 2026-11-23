const RECIPE_DATA = `
title: "Test Tarka Aloo"
subtitle: "ٹیسٹ تڑکا آلو"
description: "A 4-step stress-test recipe using only real hand-drawn ingredient and tool PNGs across repeated forms and quantities."
image: "assets/kitchen_sketch.png"

ingredients:
  - section: "Main Base (بنیاد)"
    items:
      - "2 medium Potatoes, diced (آلو)"
      - "2 medium Tomatoes, chopped (ٹماٹر)"
      - "2 tsp Coriander Powder, split (دھنیا پاؤڈر)"
  - section: "Aromatics & Tarka (مصالحہ اور تڑکا)"
    items:
      - "1 medium Yellow Onion, split: 1/2 sliced, 1/2 diced (پیاز)"
      - "2 tsp Garlic Paste + 6 Garlic cloves (4 minced, 2 diced) (لہسن)"
      - "1 tsp Ginger Paste + 1 piece Ginger, minced (ادرک)"
      - "3 Green Chillies, sliced, split across steps (ہری مرچ)"

steps:
  - section: "Simmer Potatoes & Masala"
    ingredients:
      - name: potato
        form: diced
        amount: 2
        unit: medium
      - name: tomato
        form: chopped
        amount: 2
        unit: medium
      - name: coriander_powder
        form: powder
        amount: 1.5
        unit: tsp
    tools:
      - pressure_cooker
    items:
      - "Combine the diced potatoes, chopped tomatoes, and 1.5 tsp coriander powder in the pressure cooker until tender."

  - section: "Build the Karahi Base"
    ingredients:
      - name: onion
        form: sliced
        amount: 0.5
        unit: medium
      - name: garlic
        form: paste
        amount: 2
        unit: tsp
      - name: ginger
        form: paste
        amount: 1
        unit: tsp
      - name: green_chilli
        form: sliced
        amount: 2
        unit: whole
    tools:
      - karahi
    items:
      - "In the karahi, sauté the sliced onion with garlic paste, ginger paste, and 2 sliced green chillies until fragrant."

  - section: "Temper the Tarka"
    ingredients:
      - name: onion
        form: diced
        amount: 0.5
        unit: medium
      - name: garlic
        form: minced
        amount: 4
        unit: cloves
      - name: ginger
        form: minced
        amount: 1
        unit: piece
    tools:
      - saucepan
    items:
      - "In the small saucepan, sizzle diced onion, minced garlic, and minced ginger until golden brown."

  - section: "Crisp Garlic Finish"
    ingredients:
      - name: garlic
        form: diced
        amount: 2
        unit: cloves
      - name: green_chilli
        form: sliced
        amount: 1
        unit: whole
      - name: coriander_powder
        form: powder
        amount: 0.5
        unit: tsp
    tools:
      - karahi
    items:
      - "Return everything to the karahi and finish with crisp diced garlic, the remaining sliced green chilli, and a dusting of coriander powder."
`;
