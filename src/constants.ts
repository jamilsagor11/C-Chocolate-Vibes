export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  category: string;
  stock: number;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface Order {
  id?: string;
  userId: string;
  customerName: string;
  customerEmail: string;
  address: string;
  phone: string;
  items: {
    productId: string;
    name: string;
    quantity: number;
    price: number;
  }[];
  totalAmount: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  createdAt: any;
}

export const INITIAL_PRODUCTS: Omit<Product, 'id'>[] = [
  {
    name: "Medium Large Pistachio Kunafa",
    description: "Our signature pistachio kunafa chocolate bar in medium-large size. Handmade with premium ingredients.",
    price: 1500,
    imageUrl: "https://images.unsplash.com/photo-1623227866282-40e446055969?q=80&w=1024",
    category: "Signature Bars",
    stock: 50
  },
  {
    name: "Mini Treat Dubai Pistachio Kunafa",
    description: "A perfect bite-sized mini treat of our viral Dubai pistachio kunafa chocolate.",
    price: 750,
    imageUrl: "https://images.unsplash.com/photo-1549007994-cb92caebd54b?q=80&w=1024",
    category: "Mini Bites",
    stock: 100
  },
  {
    name: "Big Size Pistachio Kunafa",
    description: "Maximum indulgence! The largest size of our handmade pistachio kunafa chocolate bar.",
    price: 2800,
    imageUrl: "https://images.unsplash.com/photo-1548907040-4baa42d10919?q=80&w=1024",
    category: "Signature Bars",
    stock: 25
  },
  {
    name: "Midnight Dark Truffles",
    description: "70% intense dark chocolate truffles with a silky smooth ganache center.",
    price: 1800,
    imageUrl: "https://images.unsplash.com/photo-1542843137-8791a50c42e1?q=80&w=1024",
    category: "Truffles",
    stock: 45
  },
  {
    name: "Sea Salt Caramel Noir",
    description: "Exquisite dark chocolate paired with hand-harvested sea salt and flowing caramel.",
    price: 1350,
    imageUrl: "https://images.unsplash.com/photo-1511381939415-e44015466834?q=80&w=1024",
    category: "Dark Series",
    stock: 60
  },
  {
    name: "Royal Pistachio Kunafa Box",
    description: "A royal collection of our finest pistachio kunafa chocolates in an elegant gift box.",
    price: 3200,
    imageUrl: "https://images.unsplash.com/photo-1582298538104-fe2e74c27f59?q=80&w=1024",
    category: "Gift Sets",
    stock: 15
  },
  {
    name: "Velvet Milk Hazelnut",
    description: "Creamy milk chocolate packed with slow-roasted Piedmont hazelnuts.",
    price: 1100,
    imageUrl: "https://images.unsplash.com/photo-1541832069-e4f3ed33083e?q=80&w=1024",
    category: "Milk Classics",
    stock: 80
  },
  {
    name: "Ruby Rose Petal Heart",
    description: "Naturally pink ruby chocolate infused with delicate rose essence and dried petals.",
    price: 1650,
    imageUrl: "https://images.unsplash.com/photo-1511381939415-e44015466834?q=80&w=1024",
    category: "Limited Edition",
    stock: 20
  },
  {
    name: "Vegan Oat Milk Galaxy",
    description: "Dairy-free perfection. Smooth oat milk chocolate that melts in your mouth.",
    price: 1400,
    imageUrl: "https://images.unsplash.com/photo-1559181567-c3190ca9959b?q=80&w=1024",
    category: "Vegan Selection",
    stock: 40
  },
  {
    name: "Queen Size Pistachio Kunafa",
    description: "Fit for royalty. A queen-sized bar with extra pistachio filling and rich dark chocolate.",
    price: 2200,
    imageUrl: "https://images.unsplash.com/photo-1614088685112-0a760b71a3c8?q=80&w=1024",
    category: "Signature Bars",
    stock: 30
  },
  {
    name: "White Gold Macadamia",
    description: "Buttery white chocolate with toasted macadamia nuts and a hint of vanilla.",
    price: 1250,
    imageUrl: "https://images.unsplash.com/photo-1549007994-cb92caebd54b?q=80&w=1024",
    category: "White Collection",
    stock: 55
  },
  {
    name: "Espresso Bean Crunch",
    description: "Strong arabica coffee beans covered in intense dark chocolate for the ultimate wake-up call.",
    price: 950,
    imageUrl: "https://images.unsplash.com/photo-1599599810769-bcde5a160d32?q=80&w=1024",
    category: "Mini Bites",
    stock: 120
  },
  {
    name: "Salted Almond Bark",
    description: "Classic almond bark with a generous sprinkle of sea salt and 60% cocoa.",
    price: 1150,
    imageUrl: "https://images.unsplash.com/photo-1606312619070-d48b4c652a52?q=80&w=1024",
    category: "Fruit & Nut",
    stock: 70
  },
  {
    name: "Dulce de Leche Swirl",
    description: "Marble chocolate with creamy Argentinian dulce de leche folded in.",
    price: 1550,
    imageUrl: "https://images.unsplash.com/photo-1511381939415-e44015466834?q=80&w=1024",
    category: "Caramel Heaven",
    stock: 35
  },
  {
    name: "Zesty Orange Noir",
    description: "Dark chocolate infused with candied orange peel and citrus essential oils.",
    price: 1300,
    imageUrl: "https://images.unsplash.com/photo-1511381939415-e44015466834?q=80&w=1024",
    category: "Dark Series",
    stock: 50
  }
];
