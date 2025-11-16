import { v4 as uuidv4 } from 'uuid';

export const itemsCategories = [
  {
    itemId: uuidv4(),
    itemName: "wafer",
    image: "https://images.unsplash.com/photo-1589302168068-964664d93dc0?q=80&w=1000",
    description: "Delicious wafer snack",
    cost: 1.50,
    stock: 3,
  },
  {
     itemId: uuidv4(),
    itemName: "soda",
    image: "https://images.unsplash.com/photo-1581804928342-4e3405e39c91?q=80&w=1000",
    description: "Refreshing soda drink",
    cost: 2.00,
    stock: 1,
  },
  {
     itemId: uuidv4(),
    itemName: "chips",
    image: "https://images.unsplash.com/photo-1593005510504-86da53f2740e?q=80&w=1000",
    description: "Crispy potato chips",
    cost: 1.75,
    stock: 0,
  },
];
