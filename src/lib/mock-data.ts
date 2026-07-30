import type { GoalId, Ingredient, PantryStaple, Recipe } from "@/lib/types";

let idCounter = 0;
function nextId(prefix: string) {
  idCounter += 1;
  return `${prefix}-${idCounter}`;
}

/** Simula el OCR/IA que lee el ticket. En producción esto llamará al backend real. */
export function detectIngredientsFromTicket(): Ingredient[] {
  return [
    { id: nextId("ing"), name: "Pechuga de pollo", quantity: 400, unit: "g", step: 50, detected: true },
    { id: nextId("ing"), name: "Arroz", quantity: 500, unit: "g", step: 50, detected: true },
    { id: nextId("ing"), name: "Tomate", quantity: 3, unit: "ud", step: 1, detected: true },
    { id: nextId("ing"), name: "Cebolla", quantity: 2, unit: "ud", step: 1, detected: true },
    { id: nextId("ing"), name: "Pimiento rojo", quantity: 1, unit: "ud", step: 1, detected: true },
    { id: nextId("ing"), name: "Brócoli", quantity: 300, unit: "g", step: 50, detected: true },
  ];
}

export function createIngredient(name: string): Ingredient {
  return { id: nextId("ing"), name, quantity: 1, unit: "ud", step: 1, detected: false };
}

/** Básicos que casi siempre hay en casa, se preguntan antes de generar la receta */
export function getDefaultPantryStaples(): PantryStaple[] {
  return [
    { id: "oil", name: "Aceite de oliva", quantity: 50, unit: "ml", step: 10, hasIt: true },
    { id: "salt", name: "Sal", quantity: 5, unit: "g", step: 1, hasIt: true },
    { id: "pepper", name: "Pimienta", quantity: 2, unit: "g", step: 1, hasIt: true },
    { id: "eggs", name: "Huevos", quantity: 2, unit: "ud", step: 1, hasIt: true },
    { id: "garlic", name: "Ajo", quantity: 2, unit: "diente", step: 1, hasIt: true },
    { id: "flour", name: "Harina", quantity: 100, unit: "g", step: 25, hasIt: true },
  ];
}

function fmt(list: Ingredient[] | PantryStaple[], filterFn?: (n: string) => boolean) {
  return list
    .filter((i) => (filterFn ? filterFn(i.name) : true))
    .map((i) => `${i.quantity} ${i.unit} de ${i.name}`);
}

/** Simula la generación de recetas de la IA a partir de ingredientes + despensa + objetivo. */
export function generateRecipes(
  goalId: GoalId | null,
  ingredients: Ingredient[],
  pantry: PantryStaple[]
): Recipe[] {
  const has = (name: string) => ingredients.some((i) => i.name.toLowerCase().includes(name));
  const pantryHas = (id: string) => pantry.find((p) => p.id === id)?.hasIt ?? false;

  const oil = pantryHas("oil") ? fmt(pantry, (n) => n === "Aceite de oliva") : [];
  const salt = pantryHas("salt") ? fmt(pantry, (n) => n === "Sal") : [];
  const eggs = pantryHas("eggs") ? fmt(pantry, (n) => n === "Huevos") : [];
  const garlic = pantryHas("garlic") ? fmt(pantry, (n) => n === "Ajo") : [];

  const recipes: Recipe[] = [
    {
      id: "pollo-salteado",
      title: has("pollo") ? "Pollo salteado con arroz y verduras" : "Salteado de verduras con arroz",
      emoji: "🍛",
      minutes: 30,
      calories: goalId === "fat" ? 480 : 620,
      protein: 45,
      carbs: 55,
      fat: 16,
      ingredients: [
        ...fmt(ingredients, (n) => n.includes("pollo") || n.includes("arroz") || n.includes("cebolla") || n.includes("pimiento")),
        ...oil,
        ...salt,
        ...garlic,
      ],
      steps: [
        "Corta el pollo en tacos y las verduras en juliana.",
        "Calienta el aceite en una sartén amplia y dora el ajo.",
        "Añade el pollo y saltéalo 5-6 minutos hasta que esté dorado.",
        "Incorpora la cebolla y el pimiento, cocina 4 minutos más.",
        "Añade el arroz cocido, salpimienta y saltea todo junto 2 minutos.",
      ],
      summary:
        "Se saltea todo en la misma sartén a fuego medio-alto: primero la proteína hasta dorarse, luego las verduras hasta que estén tiernas, y al final se mezcla con el arroz ya cocido para que se integren los sabores.",
    },
    {
      id: "tortilla-brocoli",
      title: "Tortilla de brócoli y tomate",
      emoji: "🍳",
      minutes: 20,
      calories: goalId === "fat" ? 320 : 410,
      protein: 28,
      carbs: 14,
      fat: 22,
      ingredients: [
        ...fmt(ingredients, (n) => n.includes("brócoli") || n.includes("tomate")),
        ...eggs,
        ...oil,
        ...salt,
      ],
      steps: [
        "Cuece el brócoli al vapor 5 minutos y trocéalo.",
        "Bate los huevos con una pizca de sal.",
        "Mezcla el brócoli y el tomate troceado con el huevo batido.",
        "Cuaja la tortilla en una sartén con un poco de aceite, 3-4 minutos por lado.",
      ],
      summary:
        "Se cuecen antes las verduras más duras, se mezclan con el huevo batido y se cuaja todo junto a fuego medio, vuelta y vuelta, hasta que quede dorada por fuera y jugosa por dentro.",
    },
    {
      id: "bowl-tomate",
      title: "Bowl fresco de tomate y cebolla encurtida",
      emoji: "🥗",
      minutes: 15,
      calories: 260,
      protein: 12,
      carbs: 30,
      fat: 9,
      ingredients: [
        ...fmt(ingredients, (n) => n.includes("tomate") || n.includes("cebolla")),
        ...oil,
        ...salt,
      ],
      steps: [
        "Corta el tomate y la cebolla en dados pequeños.",
        "Aliña con aceite de oliva y sal al gusto.",
        "Deja reposar 5 minutos en la nevera antes de servir.",
      ],
      summary:
        "Es una receta en frío: solo hay que cortar, aliñar y dejar reposar unos minutos para que el tomate y la cebolla suelten su jugo y se integren los sabores.",
    },
  ];

  return recipes;
}
