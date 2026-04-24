export type Category = "levres" | "yeux" | "teint";

export interface Product {
  id: string;
  name: string;
  category: Category;

  price: number;
  oldPrice?: number;

  images: string[]; // plusieurs images

  description: string;

  rating: number;
  reviews: number;

  colors?: string[]; // hex colors

  details: string[]; // bullet points
  ingredients: string[]; // bullet points

  isBestSeller?: boolean;
  gallery: string[];
}

export const products: Product[] = [
  {
    id: "1",
    name: "Rouge à lèvres matte",
    category: "levres",

    price: 1200,
    oldPrice: 1500,

    images: ["/assets/levres.png", "/assets/levres.png"],

    description:
      "Un rouge à lèvres au fini mat intense qui offre une tenue longue durée sans dessécher les lèvres.",

    rating: 4.5,
    reviews: 32,

    colors: ["#8B0000", "#B22222", "#DC143C"],

    details: ["Fini mat velouté", "Longue tenue", "Texture confortable"],
    ingredients: ["Aqua", "Glycerin", "Parfum", "Vitamin E"],
    isBestSeller: true,
    gallery: [
      "/assets/levres.png",
      "/assets/yeux.png",
      "/assets/teint.png",
      "/assets/tuto.png",
    ],
  },

  {
    id: "2",
    name: "Gloss brillant",
    category: "levres",

    price: 900,

    images: ["/assets/levres.png", "/assets/levres.png"],

    description:
      "Un gloss ultra brillant qui apporte volume et hydratation aux lèvres.",

    rating: 4.3,
    reviews: 21,

    colors: ["#FFC0CB", "#FF69B4"],

    details: [
      "Effet brillant intense",
      "Hydratation longue durée",
      "Texture non collante",
    ],
    ingredients: ["Aqua", "Glycerin", "Parfum", "Vitamin E"],
    gallery: [
      "/assets/levres.png",
      "/assets/yeux.png",
      "/assets/teint.png",
      "/assets/tuto.png",
    ],
  },

  {
    id: "3",
    name: "Mascara volume",
    category: "yeux",

    price: 1500,

    images: ["/assets/yeux.png", "/assets/yeux.png"],

    description:
      "Mascara volumisant pour des cils plus épais et plus longs dès le premier passage.",

    rating: 4.7,
    reviews: 45,

    details: ["Volume intense", "Allonge les cils", "Ne fait pas de paquets"],
    ingredients: ["Aqua", "Glycerin", "Parfum", "Vitamin E"],
    isBestSeller: true,
    gallery: [
      "/assets/levres.png",
      "/assets/yeux.png",
      "/assets/teint.png",
      "/assets/tuto.png",
    ],
  },

  {
    id: "4",
    name: "Eyeliner noir intense",
    category: "yeux",

    price: 1100,

    images: ["/assets/yeux.png", "/assets/yeux.png"],

    description:
      "Un eyeliner liquide avec une pointe précise pour un tracé net et intense.",

    rating: 4.4,
    reviews: 28,

    details: ["Noir profond", "Application facile", "Tenue longue durée"],
    ingredients: ["Aqua", "Glycerin", "Parfum", "Vitamin E"],
    gallery: [
      "/assets/levres.png",
      "/assets/yeux.png",
      "/assets/teint.png",
      "/assets/tuto.png",
    ],
  },

  {
    id: "5",
    name: "Fond de teint naturel",
    category: "teint",

    price: 2500,
    oldPrice: 3000,

    images: ["/assets/teint.png", "/assets/teint.png"],

    description:
      "Fond de teint fluide offrant une couvrance modulable pour un teint naturel et uniforme.",

    rating: 4.6,
    reviews: 38,

    colors: ["#F5D6C6", "#EAC1A3", "#D8A07A"],

    details: ["Couvrance modulable", "Effet naturel", "Longue tenue"],
    ingredients: ["Aqua", "Glycerin", "Parfum", "Vitamin E"],
    gallery: [
      "/assets/levres.png",
      "/assets/yeux.png",
      "/assets/teint.png",
      "/assets/tuto.png",
    ],
  },

  {
    id: "6",
    name: "Poudre matifiante",
    category: "teint",

    price: 1800,

    images: ["/assets/teint.png", "/assets/teint.png"],

    description:
      "Poudre légère qui matifie la peau et fixe le maquillage toute la journée.",

    rating: 4.2,
    reviews: 19,

    details: ["Matifie instantanément", "Fixe le maquillage", "Texture légère"],
    ingredients: ["Aqua", "Glycerin", "Parfum", "Vitamin E"],
    gallery: [
      "/assets/levres.png",
      "/assets/yeux.png",
      "/assets/teint.png",
      "/assets/tuto.png",
    ],
  },
];
