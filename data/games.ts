// src/data/games.ts

export interface GameItem {
  id: number;
  amount: string;
  price: string;
}

export interface Game {
  id: number;
  slug: string;
  name: string;
  category:  'cek' | 'esim' | 'game';
  publisher: string;
  image: string; 
  banner: string; 
  items: GameItem[];
}

export const games: Game[] = [
  {
    id: 1,
    slug: "mobile-legends",
    name: "Mobile Legends: Bang Bang",
    category: "game",
    publisher: "Moonton",
    image: "https://www.lapakgaming.com/cdn-cgi/image/width=360,format=auto,quality=75,onerror=redirect/static/category/Beli%20ML%20Diamond.png",
    banner: "https://placehold.co/800x300/png?text=Banner+MLBB",
    items: [
      { id: 1, amount: "5 Diamonds", price: "Rp 1.500" },
      { id: 2, amount: "12 Diamonds", price: "Rp 3.500" },
      { id: 3, amount: "50 Diamonds", price: "Rp 14.000" },
      { id: 4, amount: "77 Diamonds", price: "Rp 22.000" },
      { id: 5, amount: "250 Diamonds", price: "Rp 75.000" },
    ]
  },
  {
    id: 2,
    slug: "honor-of-kings",
    name: "Honor of Kings",
    category: "game",
    publisher: "Tencent",
    image: "https://www.lapakgaming.com/cdn-cgi/image/width=360,format=auto,quality=75,onerror=redirect/static/category/LG_PDP_HoK_x_JJK.png",
    banner: "https://placehold.co/800x300/png?text=Banner+HOK",
    items: [
      { id: 1, amount: "10 Tokens", price: "Rp 3.000" },
      { id: 2, amount: "60 Tokens", price: "Rp 16.000" },
    ]
  },
  {
    id: 3,
    slug: "free-fire",
    name: "Free Fire",
    category: "game",
    publisher: "Garena",
    image: "https://www.lapakgaming.com/cdn-cgi/image/width=360,format=auto,quality=75,onerror=redirect/static/category/Topup%20FF%20Diamond%20Diskon.png",
    banner: "https://placehold.co/800x300/png?text=Banner+FF",
    items: [
      { id: 1, amount: "5 Diamond", price: "Rp 1.000" },
      { id: 2, amount: "70 Diamond", price: "Rp 10.000" },
    ]
  },
  {
    id: 4,
    slug: "pubg-mobile",
    name: "PUBG Mobile",
    category: "game",
    publisher: "Tencent",
    image: "https://cdn1.codashop.com/S/content/mobile/images/product-tiles/pubgm_tile_aug2024.jpg",
    banner: "https://placehold.co/800x300/png?text=Banner+PUBG",
    items: [
      { id: 1, amount: "60 UC", price: "Rp 15.000" },
    ]
  },
  {
    id: 5,
    slug: "valorant",
    name: "Valorant",
    category: "game",
    publisher: "Riot Games",
    image: "https://www.lapakgaming.com/cdn-cgi/image/width=360,format=auto,quality=75,onerror=redirect/static/category/PDP-VALORANT.png",
    banner: "https://placehold.co/800x300/png?text=Banner+Valorant",
    items: [
      { id: 1, amount: "125 VP", price: "Rp 15.000" },
    ]
  },
  {
    id: 6,
    slug: "esim-indonesia",
    name: "eSim Indonesia",
    category: "esim",
    publisher: "Telekomsel",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9f/Flag_of_Indonesia.svg/1280px-Flag_of_Indonesia.svg.png",
    banner: "https://placehold.co/800x300/png?text=Banner+eSim+Indonesia",
    items: [
      { id: 1, amount: "1 GB | 2 DAYS", price: "Rp 23.000" },
      { id: 2, amount: "3 GB | 30 DAYS", price: "Rp 55.000" },
      { id: 3, amount: "5 GB | 30 DAYS", price: "Rp 70.000" },
      { id: 4, amount: "10 GB | 30 DAYS", price: "Rp 105.000" },
      
    ]
  },
  {
    id: 7,
    slug: "esim-data-usage",
    name: "Check Data Usage",
    category: "cek",
    publisher: "Telekomsel",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9f/Flag_of_Indonesia.svg/1280px-Flag_of_Indonesia.svg.png",
    banner: "https://placehold.co/800x300/png?text=Banner+eSim+Indonesia",
    items: [
      { id: 1, amount: "125 VP", price: "Rp 15.000" },
    ]
  },
   
];