import { v4 as uuidv4 } from 'uuid';

export const itemsCategories = [
  {
    itemId: uuidv4(),
    itemName: "Slot1",
    image: "https://images.unsplash.com/photo-1589302168068-964664d93dc0?q=80&w=1000",
    description: "Slot1",
    cost: 1.50,
    stock: 3,
  },
  {
     itemId: uuidv4(),
    itemName: "Slot2",
    image: "https://images.unsplash.com/photo-1581804928342-4e3405e39c91?q=80&w=1000",
    description: "Slot2",
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
