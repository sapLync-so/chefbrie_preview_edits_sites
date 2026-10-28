export type MealPrepWeek = {
  id: string;
  breakfast: { name: string; price: number };
  dinner: { name: string; price: number };
};

export type MenuItem = {
  name: string;
  price: string;
  tags?: string;
  note?: string;
};

export type MenuSection = {
  id: string;
  title: string;
  items: MenuItem[];
  footerNote?: string;
};

export const mealPrepMenu = {
  title: "Weekly Meal Prep Menu",
  serviceNote:
    "Recurring weekly Sunday meal prep — menus rotate seasonally. Many clients order several weeks (or a month) at a time.",
  weeks: [
    {
      id: "rotation-1",
      breakfast: { name: "Pancakes, turkey sausage & fruit", price: 15 },
      dinner: { name: "BBQ chicken, corn maque choux & tossed salad", price: 25 },
    },
    {
      id: "rotation-2",
      breakfast: { name: "Cinnamon roll overnight oats", price: 8 },
      dinner: { name: "Salisbury steak, mashed potatoes & string beans", price: 25 },
    },
    {
      id: "rotation-3",
      breakfast: {
        name: "Breakfast burrito. Eggs, turkey sausage & potatoes with sour cream, guacamole & salsa",
        price: 15,
      },
      dinner: {
        name: "Salmon, turmeric rice, cucumber salad, tzatziki sauce & pita",
        price: 30,
      },
    },
    {
      id: "rotation-4",
      breakfast: { name: "Greek yogurt, granola & bananas Foster", price: 8 },
      dinner: { name: "Crispy honey chicken, mac and cheese & collard greens", price: 28 },
    },
    {
      id: "rotation-5",
      breakfast: { name: "Marinated fruit", price: 5 },
      dinner: { name: "Butter chicken, basmati rice & vegetable samosas", price: 28 },
    },
    {
      id: "rotation-6",
      breakfast: { name: "Vegetable frittata & toast", price: 8 },
      dinner: {
        name: "Jerk chicken, rice, caramelized plantain, avocado, pico & charred scallion sauce",
        price: 25,
      },
    },
  ] satisfies MealPrepWeek[],
  pickup: {
    heading: "Pick Up Days",
    locations: [
      { day: "Sunday", place: "Langhorne, PA" },
      { day: "Monday", place: "Princeton, New Jersey" },
    ],
    phone: "609-213-4778",
    email: "chefbrie.01@gmail.com",
    instagram: "bellavita_015",
  },
};

export const cateringMenu = {
  title: "The Menu",
  legend: "V = Vegan | GFO = Gluten Free option available (add $3pp)",
  sections: [
    {
      id: "appetizer",
      title: "Appetizer",
      items: [
        { name: "Marinated Kale, Brussels & Apple salad", price: "$4pp" },
        { name: "Caesar Wedge", price: "$4pp" },
        { name: "Classic, Jerk Shroom, or Curry Hummus", price: "$4pp" },
        { name: "Curry Tomato Soup (V)", price: "$4pp" },
        { name: "Potato Pancakes", price: "$4pp" },
        {
          name: "Crispy Chicken / Crispy Tofu (V, GFO)",
          price: "$5pp",
          note: "Plain, Hot Curry or Jerk Tso",
        },
        {
          name: "Jamaican Patties",
          price: "$5pp",
          note: "Garlic Beef, Jerk Chicken or Lentil & Shroom (V)",
        },
        { name: "Codfish Fritters", price: "$5pp" },
        { name: "Jamaican Grilled Cheese", price: "$6pp" },
        { name: '"Calamari" (V, GFO)', price: "$6pp" },
        { name: "Scallop & Plantain Puree", price: "$12pp" },
      ],
    },
    {
      id: "charcuterie",
      title: "Charcuterie & Grazing Tables",
      items: [
        {
          name: "Classic Board",
          price: "$25pp",
          note:
            "A curated selection of artisan cheeses, cured meats, fresh fruits, seasonal accompaniments, crackers, nuts and house-made dips.",
        },
        {
          name: "Grazing Table",
          price: "Custom Pricing",
          note: "Mix of appetizers and charcuterie options.",
        },
      ],
    },
    {
      id: "entrees",
      title: "Entrees",
      items: [
        { name: "Cauliflower Steak (V, GFO)", price: "$12pp", note: "Roasted or Fried" },
        { name: "Curry Chickpea Stew (V)", price: "$12pp" },
        { name: "Chicken / Shroom Brown Stew (V)", price: "$15pp" },
        { name: 'Fried "Chicken" (V, GFO)', price: "$15pp" },
        { name: 'Jerk "Salmon" (V)', price: "$18pp" },
        { name: "Plantain Lasagna", price: "$20pp" },
        {
          name: "Chicken Roulade",
          price: "$20pp",
          note: "With Fried Shrimp & Green Seasoning Chimichurri",
        },
        { name: "Pan Seared Salmon & Buere Blanc", price: "$22pp" },
        { name: 'Oxtail / "Oxtail" (V)', price: "$30pp" },
        { name: "12 oz Ribeye", price: "$40pp" },
      ],
    },
    {
      id: "sides",
      title: "Sides",
      footerNote: "$8 per person",
      items: [
        { name: "That Mac (add $3 pp)", price: "" },
        { name: "Rasta Pasta (add $3 pp)", price: "" },
        { name: "Cider Greens", price: "" },
        { name: "Fried Cabbage", price: "" },
        { name: "Rice and Peas", price: "" },
        { name: "Coconut Rice", price: "" },
        { name: "Fried Plantain", price: "" },
        { name: "Sweet Potato Salad (cold)", price: "" },
      ],
    },
    {
      id: "dessert",
      title: "Dessert",
      items: [
        { name: "Marinated Fruit Skewers", price: "$4pp" },
        { name: "Plantain Smores", price: "$4pp" },
        {
          name: "Bread Pudding",
          price: "$6pp",
          note: "Classic, sweet potato or banana foster",
        },
      ],
    },
  ] satisfies MenuSection[],
  customItemsNote:
    "Custom items and additional selections are available upon request and can be priced accordingly.",
};

/** Display label for a meal prep rotation (no calendar dates). */
export function mealPrepRotationLabel(index: number): string {
  return `Weekly menu ${index + 1}`;
}
