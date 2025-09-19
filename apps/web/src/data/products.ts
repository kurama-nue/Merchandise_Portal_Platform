// ArtisianX Enhanced Product Database - Inspired by The Souled Store
export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  subcategory: string;
  rating: number;
  reviews: number;
  discount?: number;
  isBestseller?: boolean;
  isNew?: boolean;
  tags: string[];
  sizes?: string[];
  colors: string[];
  description?: string;
  features?: string[];
  material?: string;
  care?: string[];
}

export const allProducts: Product[] = [
  // Men's Collection - Inspired by The Souled Store
  {
    id: "AX-M-001",
    name: "Plaid Shirt Driftwood",
    price: 1499,
    originalPrice: 1699,
    image: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=600&h=600&fit=crop&crop=center",
    category: "Men",
    subcategory: "Shirts",
    rating: 4.6,
    reviews: 342,
    isNew: true,
    tags: ["Plaid", "Cotton Linen", "Casual", "New Arrival", "Driftwood"],
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["Brown", "Beige", "Green"],
    description: "Premium cotton linen plaid shirt in driftwood pattern. Features relaxed fit, breathable fabric, and vintage-inspired design. Perfect for casual outings and weekend wear. Inspired by The Souled Store's contemporary fashion collection.",
    features: ["100% Cotton Linen", "Relaxed Fit", "Breathable Fabric", "Button-Down Collar", "Vintage Pattern"],
    material: "Cotton Linen Blend",
    care: ["Machine wash cold", "Iron on medium heat"]
  },
  {
    id: "AX-M-002",
    name: "TSS Originals Midnight Sky Oversized T-Shirt",
    price: 1049,
    originalPrice: 1199,
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&h=600&fit=crop&crop=center",
    category: "Men",
    subcategory: "T-Shirts",
    rating: 4.7,
    reviews: 567,
    isNew: true,
    isBestseller: true,
    tags: ["TSS Originals", "Midnight Sky", "Oversized", "Premium", "Comfort"],
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["Midnight Blue", "Black", "Navy"],
    description: "Premium oversized t-shirt from TSS Originals collection featuring midnight sky artwork. Made with ultra-soft cotton for maximum comfort and style. Perfect for casual wear and streetwear fashion. Inspired by The Souled Store's signature originals line.",
    features: ["Premium Cotton", "Oversized Fit", "Exclusive Midnight Sky Design", "Ultra-Soft Fabric", "Reinforced Seams"],
    material: "100% Premium Cotton",
    care: ["Machine wash cold", "Tumble dry low"]
  },
  {
    id: "AX-M-003",
    name: "Oversized T-Shirt Blackout",
    price: 899,
    originalPrice: 999,
    image: "https://images.unsplash.com/photo-1583743089695-4b013aba3fb5?w=600&h=600&fit=crop&crop=center",
    category: "Men",
    subcategory: "T-Shirts",
    rating: 4.5,
    reviews: 234,
    isNew: true,
    tags: ["Blackout", "Oversized", "Minimalist", "Stealth", "Modern"],
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["Black", "Charcoal", "Dark Grey"],
    description: "Sleek oversized t-shirt in blackout design for the modern minimalist. Features premium cotton construction, relaxed fit, and timeless black colorway. Perfect for creating effortless urban looks. Inspired by The Souled Store's contemporary streetwear collection.",
    features: ["Premium Cotton", "Oversized Relaxed Fit", "Minimalist Design", "Fade-Resistant Color", "Pre-Shrunk"],
    material: "100% Cotton",
    care: ["Machine wash cold", "Tumble dry low"]
  },
  {
    id: "AX-M-004",
    name: "Captain America First Avenger Oversized Jersey",
    price: 1199,
    originalPrice: 1399,
    image: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=600&h=600&fit=crop&crop=center",
    category: "Men",
    subcategory: "Jerseys",
    rating: 4.8,
    reviews: 789,
    isNew: true,
    isBestseller: true,
    tags: ["Captain America", "Marvel", "First Avenger", "Superhero", "Jersey", "Official Merch"],
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["Navy Blue", "Red", "White"],
    description: "Official Marvel Captain America First Avenger oversized jersey featuring authentic superhero design and premium fabric construction. Perfect for Marvel fans and comic enthusiasts. Licensed merchandise from The Souled Store's official Marvel collection.",
    features: ["Official Marvel License", "Oversized Jersey Fit", "Premium Cotton", "Authentic Graphics", "Collectible Design"],
    material: "100% Premium Cotton",
    care: ["Machine wash cold", "Tumble dry low"]
  },
  {
    id: "AX-M-005",
    name: "Demon Slayer: Zenitsu Oversized T-Shirt",
    price: 999,
    originalPrice: 1199,
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&h=600&fit=crop&crop=center",
    category: "Men",
    subcategory: "T-Shirts",
    rating: 4.9,
    reviews: 1567,
    isBestseller: true,
    tags: ["Demon Slayer", "Zenitsu", "Anime", "Oversized", "Japanese", "Official Merch"],
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["Yellow", "Orange", "Black"],
    description: "Official Demon Slayer Zenitsu oversized t-shirt featuring authentic anime artwork and premium cotton construction. Perfect for anime fans and otaku culture enthusiasts. Licensed merchandise from The Souled Store's official anime collection.",
    features: ["Official Anime License", "Oversized Fit", "Premium Cotton", "Authentic Artwork", "Collectible Design"],
    material: "100% Cotton",
    care: ["Machine wash cold", "Do not bleach", "Tumble dry low"]
  },
  {
    id: "AX-M-006",
    name: "Mortal Kombat: Scorpion Low Top Sneakers",
    price: 3499,
    originalPrice: 3999,
    image: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=600&h=600&fit=crop&crop=center",
    category: "Men",
    subcategory: "Sneakers",
    rating: 4.8,
    reviews: 567,
    isBestseller: true,
    tags: ["Mortal Kombat", "Scorpion", "Gaming", "Sneakers", "Limited Edition"],
    sizes: ["UK 6", "UK 7", "UK 8", "UK 9", "UK 10", "UK 11"],
    colors: ["Black", "Yellow", "Orange"],
    description: "Official Mortal Kombat Scorpion themed low-top sneakers. Features authentic game artwork, premium construction, and comfortable fit. Perfect for gaming enthusiasts and sneaker collectors. Get over here! From The Souled Store's gaming collection.",
    features: ["Official Gaming License", "Premium Sneaker Construction", "Authentic Game Graphics", "Comfortable Fit", "Limited Edition"],
    material: "Canvas & Synthetic Leather",
    care: ["Spot clean only", "Air dry", "Avoid machine wash"]
  },
  {
    id: "AX-M-007",
    name: "Iron Man Mark L Oversized T-Shirt",
    price: 1099,
    originalPrice: 1299,
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&h=600&fit=crop&crop=center",
    category: "Men",
    subcategory: "T-Shirts",
    rating: 4.8,
    reviews: 654,
    isBestseller: true,
    tags: ["Iron Man", "Mark L", "Marvel", "Technology", "Official Merch"],
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["Red", "Gold", "Black"],
    description: "Official Marvel Iron Man Mark L oversized tee featuring cutting-edge suit design and premium fabric. Perfect for tech enthusiasts and Marvel fans. I am Iron Man! From The Souled Store's Marvel collection.",
    features: ["Official Marvel License", "Mark L Suit Graphics", "Premium Cotton", "Oversized Fit", "Tech-Inspired Design"],
    material: "100% Cotton",
    care: ["Machine wash cold", "Tumble dry low"]
  },
  {
    id: "AX-M-008",
    name: "Harry Potter Mischief Managed Oversized T-Shirt",
    price: 1199,
    originalPrice: 1399,
    image: "https://images.unsplash.com/photo-1583743089695-4b013aba3fb5?w=600&h=600&fit=crop&crop=center",
    category: "Men",
    subcategory: "T-Shirts",
    rating: 4.8,
    reviews: 567,
    isBestseller: true,
    tags: ["Harry Potter", "Mischief Managed", "Marauders", "Magic", "Official Merch"],
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["Black", "Maroon", "Grey"],
    description: "Official Harry Potter 'Mischief Managed' oversized tee featuring authentic Marauder's Map design. Perfect for Potterheads and magic enthusiasts. I solemnly swear! From The Souled Store's Harry Potter collection.",
    features: ["Official Harry Potter License", "Marauder's Map Design", "Premium Cotton", "Oversized Fit", "Magic-Inspired Graphics"],
    material: "100% Cotton",
    care: ["Machine wash cold", "Tumble dry low"]
  },

  // Women's Collection - Inspired by The Souled Store
  {
    id: "AX-W-001",
    name: "Disney Pizza Planet Oversized Jersey",
    price: 1049,
    originalPrice: 1249,
    image: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=600&h=600&fit=crop&crop=center",
    category: "Women",
    subcategory: "Jerseys",
    rating: 4.7,
    reviews: 432,
    isNew: true,
    tags: ["Disney", "Pizza Planet", "Toy Story", "Retro", "Official Merch", "Nostalgia"],
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["Yellow", "Red", "White"],
    description: "Official Disney Pizza Planet oversized jersey from Toy Story collection. Features authentic retro design, premium cotton construction, and nostalgic graphics. Perfect for Disney fans and Pixar enthusiasts. To infinity and beyond! From The Souled Store's Disney collection.",
    features: ["Official Disney License", "Oversized Jersey Fit", "Premium Cotton", "Retro Pixar Design", "Nostalgic Graphics"],
    material: "100% Premium Cotton",
    care: ["Machine wash cold", "Tumble dry low"]
  },
  {
    id: "AX-W-002",
    name: "Tennis Dress Soft Sage",
    price: 1699,
    originalPrice: 1899,
    image: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=600&h=600&fit=crop&crop=center",
    category: "Women",
    subcategory: "Dresses",
    rating: 4.6,
    reviews: 234,
    isNew: true,
    tags: ["Tennis", "Sports", "Sage", "Active", "Athletic"],
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["Sage", "Green", "White"],
    description: "Premium tennis dress in soft sage color perfect for active lifestyle and sports activities. Features breathable fabric, comfortable fit, and elegant design. From The Souled Store's women's activewear collection.",
    features: ["Premium Cotton Blend", "Athletic Fit", "Breathable Fabric", "Soft Sage Color", "Sports Design"],
    material: "Cotton Blend",
    care: ["Machine wash cold", "Hang dry"]
  },
  {
    id: "AX-W-003",
    name: "Linen Blend Platinum Shirt",
    price: 1299,
    originalPrice: 1499,
    image: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=600&h=600&fit=crop&crop=center",
    category: "Women",
    subcategory: "Shirts",
    rating: 4.5,
    reviews: 321,
    isNew: true,
    tags: ["Linen", "Platinum", "Premium", "Office", "Elegant"],
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["Platinum", "Silver", "White"],
    description: "Elegant linen blend shirt in platinum finish. Features premium fabric, professional cut, and sophisticated styling. Perfect for office wear and formal occasions. Elevate your wardrobe with premium comfort. From The Souled Store's women's collection.",
    features: ["Premium Linen Blend", "Professional Cut", "Breathable Fabric", "Elegant Design", "Wrinkle Resistant"],
    material: "Linen Cotton Blend",
    care: ["Machine wash cold", "Iron on medium heat"]
  },

  // Accessories Collection - Inspired by The Souled Store
  {
    id: "AX-A-001",
    name: "Hulk: 3-in-1 Rage Backpack",
    price: 2999,
    originalPrice: 3499,
    image: "https://images.unsplash.com/photo-1574125530503-69ad9b6a9b0c?w=600&h=600&fit=crop&crop=center",
    category: "Accessories",
    subcategory: "Backpacks",
    rating: 4.8,
    reviews: 876,
    isBestseller: true,
    tags: ["Hulk", "Marvel", "3-in-1", "Rage", "Versatile", "Official Merch"],
    colors: ["Green", "Purple", "Black"],
    description: "Official Marvel Hulk 3-in-1 rage backpack with versatile design and incredible durability. Features multiple configurations, premium materials, and authentic Hulk graphics. Perfect for Marvel fans who need maximum functionality. Smash your daily routine! From The Souled Store's Marvel collection.",
    features: ["3-in-1 Versatile Design", "Premium Durability", "Multiple Compartments", "Official Marvel License", "Weather Resistant"],
    material: "High-Grade Polyester",
    care: ["Spot clean only", "Air dry"]
  },
  {
    id: "AX-A-002",
    name: "Batman: Gotham Gear Backpack",
    price: 3499,
    originalPrice: 3999,
    image: "https://images.unsplash.com/photo-1574125530503-69ad9b6a9b0c?w=600&h=600&fit=crop&crop=center",
    category: "Accessories",
    subcategory: "Backpacks",
    rating: 4.9,
    reviews: 892,
    isBestseller: true,
    tags: ["Batman", "Gotham", "DC Comics", "Premium", "Urban"],
    colors: ["Black", "Grey", "Dark Blue"],
    description: "Official DC Comics Batman Gotham Gear backpack with premium construction and authentic design. Features multiple compartments, laptop protection, and Batman branding. Perfect for DC fans and urban explorers. Be the hero Gotham needs! From The Souled Store's DC collection.",
    features: ["Official DC License", "Laptop Protection", "Multiple Compartments", "Premium Materials", "Urban Design"],
    material: "High-Grade Polyester & Nylon",
    care: ["Spot clean only", "Air dry"]
  },
  {
    id: "AX-A-003",
    name: "FCB Legacy Backpack",
    price: 2999,
    originalPrice: 3299,
    image: "https://images.unsplash.com/photo-1581605405669-fcdf81165afa?w=600&h=600&fit=crop&crop=center",
    category: "Accessories",
    subcategory: "Backpacks",
    rating: 4.7,
    reviews: 432,
    tags: ["FCB", "Football", "Legacy", "Sports", "Official"],
    colors: ["Blue", "Red", "Navy"],
    description: "Official FCB legacy backpack for true football fans. Features team logo, spacious compartments, and quality construction. Perfect for sports enthusiasts and Barcelona supporters. From The Souled Store's sports collection.",
    features: ["Official Team Logo", "Spacious Design", "Quality Build", "Sports Inspired", "Fan Merchandise"],
    material: "Polyester",
    care: ["Spot clean only", "Air dry"]
  },

  // Electronics & Gadgets
  {
    id: "AX-E-001",
    name: "Wireless Gaming Mouse Pro",
    price: 2499,
    originalPrice: 2799,
    image: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=600&h=600&fit=crop&crop=center",
    category: "Electronics",
    subcategory: "Gaming",
    rating: 4.7,
    reviews: 543,
    isBestseller: true,
    tags: ["Gaming", "Wireless", "Pro", "RGB", "Precision"],
    colors: ["Black", "White", "RGB"],
    description: "Professional wireless gaming mouse with precision tracking, customizable RGB lighting, and ergonomic design. Perfect for gaming enthusiasts and tech lovers.",
    features: ["Wireless Connectivity", "RGB Lighting", "Precision Tracking", "Ergonomic Design", "Gaming Grade"],
    material: "Premium Plastic & Electronics",
    care: ["Keep dry", "Clean with soft cloth"]
  },
  {
    id: "AX-E-002",
    name: "Smartphone Protective Case",
    price: 1299,
    originalPrice: 1499,
    image: "https://images.unsplash.com/photo-1556656793-08538906a9f8?w=600&h=600&fit=crop&crop=center",
    category: "Electronics",
    subcategory: "Accessories",
    rating: 4.5,
    reviews: 321,
    tags: ["Protection", "Smartphone", "Durable", "Style"],
    colors: ["Black", "Clear", "Blue"],
    description: "Premium smartphone protective case with shock absorption and sleek design. Provides maximum protection while maintaining style and functionality.",
    features: ["Shock Absorption", "Wireless Charging Compatible", "Precise Cutouts", "Anti-Slip Grip", "Clear Design"],
    material: "TPU & Polycarbonate",
    care: ["Clean with mild soap", "Air dry"]
  },

  // Additional Men's Collection
  {
    id: "AX-M-009",
    name: "Naruto Shippuden: Uchiha Clan Oversized T-Shirt",
    price: 1299,
    originalPrice: 1499,
    image: "https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=600&h=600&fit=crop&crop=center",
    category: "Men",
    subcategory: "T-Shirts",
    rating: 4.8,
    reviews: 987,
    isBestseller: true,
    isNew: true,
    tags: ["Naruto", "Uchiha", "Anime", "Sharingan", "Japanese", "Official"],
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["Black", "Red", "Navy"],
    description: "Official Naruto Shippuden Uchiha Clan oversized t-shirt featuring the iconic Sharingan design. Premium cotton construction with authentic anime artwork. Perfect for Naruto fans and anime enthusiasts. Embrace the power of the Uchiha clan! From The Souled Store's anime collection.",
    features: ["Official Naruto License", "Uchiha Clan Graphics", "Sharingan Design", "Premium Cotton", "Oversized Fit", "Authentic Anime Art"],
    material: "100% Premium Cotton",
    care: ["Machine wash cold", "Do not bleach", "Tumble dry low", "Iron on reverse"]
  },
  {
    id: "AX-M-010",
    name: "Punisher: Classic Logo Oversized T-Shirt",
    price: 1199,
    originalPrice: 1399,
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&h=600&fit=crop&crop=center",
    category: "Men",
    subcategory: "T-Shirts",
    rating: 4.7,
    reviews: 654,
    isBestseller: true,
    tags: ["Punisher", "Marvel", "Anti-Hero", "Classic", "Logo", "Official"],
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["Black", "White", "Grey"],
    description: "Official Marvel Punisher classic logo oversized t-shirt featuring the iconic skull design. Premium fabric with bold graphics perfect for anti-hero fans. Justice through vengeance! From The Souled Store's Marvel collection.",
    features: ["Official Marvel License", "Classic Punisher Logo", "Bold Skull Design", "Premium Cotton", "Oversized Fit", "Anti-Hero Style"],
    material: "100% Cotton",
    care: ["Machine wash cold", "Tumble dry low", "Iron on reverse"]
  },
  {
    id: "AX-M-011",
    name: "Batman: The Dark Knight 2.0 Premium T-Shirt",
    price: 1299,
    originalPrice: 1499,
    image: "https://images.unsplash.com/photo-1583743089695-4b013aba3fb5?w=600&h=600&fit=crop&crop=center",
    category: "Men",
    subcategory: "T-Shirts",
    rating: 4.9,
    reviews: 1234,
    isBestseller: true,
    tags: ["Batman", "Dark Knight", "DC Comics", "Gotham", "Premium", "Official"],
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["Black", "Dark Grey", "Navy"],
    description: "Official DC Comics Batman The Dark Knight 2.0 premium t-shirt featuring enhanced Gotham graphics and superior fabric quality. Perfect for DC fans and superhero enthusiasts. Be the hero Gotham deserves! From The Souled Store's DC collection.",
    features: ["Official DC License", "Dark Knight Graphics", "Premium Fabric", "Enhanced Design", "Gotham Theme", "Superhero Style"],
    material: "100% Premium Cotton",
    care: ["Machine wash cold", "Tumble dry low", "Iron inside out"]
  },
  {
    id: "AX-M-012",
    name: "Ben 10: Alien Force Holiday Special Shirt",
    price: 1399,
    originalPrice: 1599,
    image: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=600&h=600&fit=crop&crop=center",
    category: "Men",
    subcategory: "Shirts",
    rating: 4.5,
    reviews: 432,
    isNew: true,
    tags: ["Ben 10", "Alien Force", "Cartoon", "Holiday", "Special Edition", "Nostalgia"],
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["Green", "Black", "White"],
    description: "Official Ben 10 Alien Force holiday special shirt featuring iconic alien transformations and premium construction. Perfect for cartoon fans and nostalgic adventures. It's hero time! From The Souled Store's cartoon collection.",
    features: ["Official Ben 10 License", "Alien Force Graphics", "Holiday Special Design", "Premium Shirt", "Nostalgic Appeal", "Cartoon Style"],
    material: "Cotton Blend",
    care: ["Machine wash cold", "Iron on medium heat", "Hang dry"]
  },
  {
    id: "AX-M-013",
    name: "Gurkha Pants Light Olive Super Flex",
    price: 2599,
    originalPrice: 2899,
    image: "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=600&h=600&fit=crop&crop=center",
    category: "Men",
    subcategory: "Pants",
    rating: 4.6,
    reviews: 234,
    isNew: true,
    tags: ["Gurkha", "Military", "Olive", "Super Flex", "Comfort", "Tactical"],
    sizes: ["30", "32", "34", "36", "38", "40"],
    colors: ["Light Olive", "Khaki", "Military Green"],
    description: "Premium Gurkha pants in light olive with super flex technology for maximum comfort and mobility. Military-inspired design with modern functionality. Perfect for adventure and urban exploration. From The Souled Store's tactical collection.",
    features: ["Super Flex Technology", "Military Inspired", "Comfort Fit", "Durable Construction", "Multiple Pockets", "Tactical Design"],
    material: "Cotton Stretch Blend",
    care: ["Machine wash cold", "Iron on medium heat", "Do not bleach"]
  },

  // Additional Women's Collection
  {
    id: "AX-W-004",
    name: "Botanical Garden Floral Midi Dress",
    price: 1899,
    originalPrice: 2199,
    image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=600&h=600&fit=crop&crop=center",
    category: "Women",
    subcategory: "Dresses",
    rating: 4.7,
    reviews: 456,
    isNew: true,
    tags: ["Floral", "Botanical", "Midi", "Garden", "Elegant", "Spring"],
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["Floral Multi", "Garden Green", "Botanical Blue"],
    description: "Elegant botanical garden floral midi dress featuring beautiful flower patterns and comfortable fit. Perfect for spring occasions, garden parties, and elegant outings. Embrace nature's beauty with style! From The Souled Store's women's collection.",
    features: ["Botanical Print", "Midi Length", "Comfortable Fit", "Spring Colors", "Elegant Design", "Breathable Fabric"],
    material: "Cotton Viscose Blend",
    care: ["Machine wash cold", "Hang dry", "Iron on low heat"]
  },
  {
    id: "AX-W-005",
    name: "Cosmic Galaxy Oversized Hoodie",
    price: 1799,
    originalPrice: 2099,
    image: "https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?w=600&h=600&fit=crop&crop=center",
    category: "Women",
    subcategory: "Hoodies",
    rating: 4.8,
    reviews: 789,
    isBestseller: true,
    isNew: true,
    tags: ["Galaxy", "Cosmic", "Space", "Oversized", "Hoodie", "Universe"],
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["Cosmic Purple", "Galaxy Blue", "Stellar Black"],
    description: "Stunning cosmic galaxy oversized hoodie featuring universe-inspired graphics and premium comfort. Perfect for space enthusiasts and cozy style lovers. Reach for the stars in comfort! From The Souled Store's women's collection.",
    features: ["Galaxy Graphics", "Oversized Fit", "Premium Hoodie", "Cosmic Design", "Ultra Soft", "Space Theme"],
    material: "Cotton Polyester Blend",
    care: ["Machine wash cold", "Tumble dry low", "Do not iron on print"]
  },
  {
    id: "AX-W-006",
    name: "Vintage Band Tour Crop Top",
    price: 999,
    originalPrice: 1199,
    image: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=600&h=600&fit=crop&crop=center",
    category: "Women",
    subcategory: "Tops",
    rating: 4.6,
    reviews: 543,
    isNew: true,
    tags: ["Vintage", "Band", "Tour", "Crop", "Music", "Retro"],
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["Vintage Black", "Band Grey", "Tour White"],
    description: "Vintage band tour crop top featuring retro music graphics and trendy cropped fit. Perfect for music lovers and vintage style enthusiasts. Rock your style with musical flair! From The Souled Store's women's collection.",
    features: ["Vintage Design", "Crop Top Fit", "Band Graphics", "Music Theme", "Retro Style", "Trendy Cut"],
    material: "100% Cotton",
    care: ["Machine wash cold", "Tumble dry low", "Iron on reverse"]
  },
  {
    id: "AX-W-007",
    name: "Sakura Blossom Kimono Cardigan",
    price: 2199,
    originalPrice: 2499,
    image: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=600&h=600&fit=crop&crop=center",
    category: "Women",
    subcategory: "Cardigans",
    rating: 4.9,
    reviews: 321,
    isBestseller: true,
    tags: ["Sakura", "Kimono", "Japanese", "Blossom", "Elegant", "Floral"],
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["Cherry Blossom", "Sakura Pink", "Spring White"],
    description: "Elegant sakura blossom kimono cardigan featuring traditional Japanese-inspired design and flowing silhouette. Perfect for layering and adding cultural elegance to any outfit. Embrace the beauty of cherry blossoms! From The Souled Store's women's collection.",
    features: ["Kimono Style", "Sakura Print", "Flowing Silhouette", "Japanese Inspired", "Elegant Drape", "Cultural Design"],
    material: "Viscose Blend",
    care: ["Hand wash cold", "Hang dry", "Iron on low heat"]
  },

  // Additional Accessories Collection
  {
    id: "AX-A-004",
    name: "Nimbus Berry Utility Backpack",
    price: 1999,
    originalPrice: 2299,
    image: "https://images.unsplash.com/photo-1574125530503-69ad9b6a9b0c?w=600&h=600&fit=crop&crop=center",
    category: "Accessories",
    subcategory: "Backpacks",
    rating: 4.5,
    reviews: 432,
    isNew: true,
    tags: ["Nimbus", "Berry", "Utility", "Functional", "Daily Use", "Compact"],
    colors: ["Berry Red", "Nimbus Grey", "Utility Black"],
    description: "Nimbus berry utility backpack with functional design and compact size perfect for daily use. Features multiple compartments, durable construction, and stylish berry color. Perfect for students and professionals! From The Souled Store's utility collection.",
    features: ["Utility Design", "Compact Size", "Multiple Compartments", "Daily Use", "Durable Build", "Stylish Colors"],
    material: "Polyester Canvas",
    care: ["Spot clean only", "Air dry", "Wipe with damp cloth"]
  },
  {
    id: "AX-A-005",
    name: "Wireless Earbuds Pro Max",
    price: 4999,
    originalPrice: 5999,
    image: "https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?w=600&h=600&fit=crop&crop=center",
    category: "Accessories",
    subcategory: "Audio",
    rating: 4.8,
    reviews: 1234,
    isBestseller: true,
    tags: ["Wireless", "Earbuds", "Pro", "Audio", "Technology", "Premium"],
    colors: ["Midnight Black", "Pearl White", "Space Grey"],
    description: "Premium wireless earbuds pro max featuring advanced audio technology, noise cancellation, and long battery life. Perfect for music lovers, gamers, and professionals. Experience audio excellence! From The Souled Store's tech collection.",
    features: ["Active Noise Cancellation", "Premium Audio", "Long Battery Life", "Wireless Technology", "Touch Controls", "Premium Build"],
    material: "Premium Plastic & Electronics",
    care: ["Keep dry", "Clean with soft cloth", "Store in case"]
  },
  {
    id: "AX-A-006",
    name: "Designer Leather Wallet Classic",
    price: 1499,
    originalPrice: 1799,
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&h=600&fit=crop&crop=center",
    category: "Accessories",
    subcategory: "Wallets",
    rating: 4.7,
    reviews: 567,
    isBestseller: true,
    tags: ["Leather", "Wallet", "Designer", "Classic", "Premium", "Elegant"],
    colors: ["Classic Brown", "Elegant Black", "Designer Tan"],
    description: "Designer leather wallet classic featuring premium leather construction, multiple card slots, and elegant design. Perfect for professionals and style-conscious individuals. Carry your essentials in style! From The Souled Store's leather collection.",
    features: ["Premium Leather", "Multiple Card Slots", "Cash Compartment", "RFID Protection", "Elegant Design", "Durable Construction"],
    material: "Genuine Leather",
    care: ["Clean with leather cleaner", "Keep dry", "Condition regularly"]
  },
  {
    id: "AX-A-007",
    name: "Smart Fitness Watch Sport Edition",
    price: 7999,
    originalPrice: 9999,
    image: "https://images.unsplash.com/photo-1544117519-31a4b719223d?w=600&h=600&fit=crop&crop=center",
    category: "Accessories",
    subcategory: "Watches",
    rating: 4.6,
    reviews: 890,
    isNew: true,
    tags: ["Smart", "Fitness", "Watch", "Sport", "Health", "Technology"],
    colors: ["Sport Black", "Fitness Blue", "Health White"],
    description: "Smart fitness watch sport edition featuring comprehensive health tracking, sport modes, and long battery life. Perfect for fitness enthusiasts and health-conscious individuals. Track your fitness journey! From The Souled Store's tech collection.",
    features: ["Health Tracking", "Sport Modes", "Heart Rate Monitor", "GPS Tracking", "Water Resistant", "Long Battery"],
    material: "Aluminum & Silicone",
    care: ["Clean after workouts", "Keep dry", "Charge regularly"]
  }
];

// Category-specific product filters
export const getProductsByCategory = (category: string): Product[] => {
  return allProducts.filter(product => 
    product.category.toLowerCase() === category.toLowerCase()
  );
};

export const getNewArrivals = (): Product[] => {
  return allProducts.filter(product => product.isNew);
};

export const getBestsellers = (): Product[] => {
  return allProducts.filter(product => product.isBestseller);
};

export const getProductsByTag = (tag: string): Product[] => {
  return allProducts.filter(product => 
    product.tags.some(t => t.toLowerCase().includes(tag.toLowerCase()))
  );
};

// Product statistics
export const getProductStats = () => {
  const totalProducts = allProducts.length;
  const menProducts = getProductsByCategory('men').length;
  const womenProducts = getProductsByCategory('women').length;
  const accessoriesProducts = getProductsByCategory('accessories').length;
  const electronicsProducts = getProductsByCategory('electronics').length;
  const newArrivals = getNewArrivals().length;
  
  return {
    total: totalProducts,
    men: menProducts,
    women: womenProducts,
    accessories: accessoriesProducts,
    electronics: electronicsProducts,
    newArrivals: newArrivals
  };
};

// Featured product selections
export const getFeaturedProducts = (limit: number = 8): Product[] => {
  // Mix of bestsellers and new arrivals
  const bestsellers = getBestsellers().slice(0, Math.floor(limit * 0.6));
  const newArrivals = getNewArrivals().slice(0, Math.ceil(limit * 0.4));
  
  return [...bestsellers, ...newArrivals].slice(0, limit);
};