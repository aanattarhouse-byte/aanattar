export type Product = {
  id: string;
  slug: string;
  name: string;
  image: string;
  shortDescription: string;
  description: string;
  notes: string[];
  vibe: string;
  bestFor: string;
  price: number;
  category: string;
  premium?: boolean;
  discountPercent?: number;
  hoverImage?: string;
};

export const productImages: Record<string, string> = {
  "salim-luxury-attar": "/salim1.jpg",
  "royal-confidence": "/Royal Confidence 1.png",
  "purple-oudh-mystique": "/Purple Oudh Mystique 1.jpeg",
  "aqua-prestige": "/Aqua Prestige 1.jpeg",
  "jannat-essence": "/Jannat Essence 1.jpeg",
  "velvet-oudh-royale": "/Velvet Oudh Royal 1.jpeg",
  "ameer-al-oudh-reserve": "/Ameer Al Oudh Reserve 1.jpeg",
  "one-man-show-signature": "/One Man Show Signature 1.jpeg",
  "white-musk-pure": "/white musk 1.jpeg",
  "raw-woods-intense": "/Raw Woods Intense 1.jpeg",
  "champions-reserve": "/Champions Reserve 1.jpeg",
  "mediterranean-luxe": "/Mediterranean Luxe 1.jpeg",
  "cypress-supreme": "/Cypress Supreme 1.jpeg",
  "signature-noir": "/Signature Noir 1.jpeg",
  "intemate-velvet": "/Intemate Velvet 1.jpeg",
  "azure-cedar-reserve": "/Azure Cedar Reserve 1.jpeg",
  "garden-bloom": "/Garden Bloom 1.jpeg",
  "white-oudh-classic": "/White Oudh Classic 1.jpeg",
  "blue-musk-fresh": "/Blue Musk Fresh 1.jpeg",
  "yellow-musk-gold": "/Yellow Musk Gold 1.jpeg",
  "boutique-reserve-select": "/Boutique Reserve Select 1.jpeg",
  "majmua-heritage": "/Majmua Heritage 1.jpeg",
  "jannatul-firdaus-royal": "/Jannatul Firdaus Royal 1.jpeg",
  "t-rose-elegance": "/T Rose Elegance 1.png",
  "sandal-supreme": "/Sandal Supreme 1.png",
  "velvet-desire": "/Velvet Desire 1.jpeg",
  "suede-signature": "/Suede Signature 1.jpeg",
  "musk-rizali-premium": "/Musk Rizali Premium 1.jpeg",
  "black-edition": "/Black Edition 1.jpeg",
  "mogra-garden-bloom": "/Mogra Garden Bloom 1.jpeg",
  "jasmin-pure": "/Jasmin Pure 1.jpeg",
  "lavender-mist": "/Lavender Mist 1.jpeg",
  "marigold-blossom": "/Marigold Blossom 1.jpeg",
  "chocolate-musk-reserve": "/Chocolate Musk Reserve 1.jpeg",
  "1001-nights-exclusive": "/1001 Nights Exclusive 1.jpeg",
  "mukhallat-royale": "/Mukhallat Royale 1.jpeg",
};

export const productDiscountPercents: Record<string, number> = {
  "salim-luxury-attar": 33,
  "royal-confidence": 10,
  "aqua-prestige": 27,
  "jannat-essence": 34,
  "velvet-oudh-royale": 22,
  "ameer-al-oudh-reserve": 22,
  "one-man-show-signature": 25,
  "white-musk-pure": 19,
  "raw-woods-intense": 11,
  "champions-reserve": 15,
  "mediterranean-luxe": 11,
  "cypress-supreme": 18,
  "signature-noir": 21,
  "intemate-velvet": 15,
  "azure-cedar-reserve": 20,
  "garden-bloom": 18,
  "white-oudh-classic": 27,
  "purple-oudh-mystique": 20,
  "blue-musk-fresh": 18,
  "yellow-musk-gold": 18,
  "boutique-reserve-select": 33,
  "majmua-heritage": 23,
  "jannatul-firdaus-royal": 26,
  "t-rose-elegance": 30,
  "sandal-supreme": 30,
  "velvet-desire": 10,
  "suede-signature": 13,
  "musk-rizali-premium": 32,
  "black-edition": 10,
  "mogra-garden-bloom": 16,
  "jasmin-pure": 12,
  "lavender-mist": 23,
  "marigold-blossom": 27,
  "chocolate-musk-reserve": 29,
  "1001-nights-exclusive": 12,
  "mukhallat-royale": 25,
};

const baseImage = "/attar-bottle.svg";

const productCatalog: Product[] = [
  {
    id: "salim-luxury-attar",
    slug: "salim-luxury-attar",
    name: "Salim Luxury Attar",
    image: "/salim1.jpg",
    hoverImage: "/salim2.jpg",
    shortDescription:
      "A premium 12 ML luxury attar with a rich, lasting signature.",
    description:
      "Most perfumes fade the moment you start sweating. Salim does the opposite — body heat gradually draws out the oil's deeper notes, so it gets stronger through your day instead of disappearing by noon.",
    notes: ["Premium attar oil", "Soft musk", "Warm amber"],
    vibe: "Premium & Memorable",
    bestFor: "Daily wear, gifting, evening plans, and signature scent lovers.",
    price: 499,
    category: "Signature Classics",
    premium: true,
  },
  {
    id: "1",
    slug: "royal-confidence",
    name: "Royal Confidence",
    image: baseImage,
    shortDescription: "A bold, commanding blend of spicy citrus and deep woods.",
    description:
      "The name says it all. This is a bold, commanding blend of spicy citrus and deep woods for the man who walks into a room and is immediately noticed.",
    notes: ["Spicy citrus", "Dark woods", "Warm amber"],
    vibe: "Authoritative & Sharp",
    bestFor: "Boardroom meetings and high-stakes events.",
    price: 28,
    category: "Signature Classics",
    premium: true,
  },
  {
    id: "2",
    slug: "aqua-prestige",
    name: "Aqua Prestige",
    image: baseImage,
    shortDescription: "A sophisticated suit-and-tie scent with fresh aquatic polish.",
    description:
      "A sophisticated, suit-and-tie scent. It balances fresh aquatic notes with a warm, refined woody base and smells like understated luxury.",
    notes: ["Aquatic accord", "Refined woods", "Clean musk"],
    vibe: "Polished & Expensive",
    bestFor: "Evening dinners and formal gatherings.",
    price: 29,
    category: "Signature Classics",
    premium: true,
  },
  {
    id: "3",
    slug: "jannat-essence",
    name: "Jannat Essence",
    image: baseImage,
    shortDescription: "A heavenly, airy blend of white florals and cool mint.",
    description:
      "A heavenly experience. This is a light, airy blend of sweet white florals and a hint of cool mint that feels calming and pure.",
    notes: ["White florals", "Cool mint", "Soft musk"],
    vibe: "Peaceful & Ethereal",
    bestFor: "Daily wear and moments of reflection.",
    price: 28,
    category: "Signature Classics",
  },
  {
    id: "4",
    slug: "velvet-oudh-royale",
    name: "Velvet Oudh Royale",
    image: baseImage,
    shortDescription: "Smooth, creamy oudh with resin and vanilla-like warmth.",
    description:
      "Oudh, but make it smooth. This creamy, resinous blend has a touch of vanilla-like sweetness and feels like wearing expensive fabric.",
    notes: ["Creamy oudh", "Resins", "Vanilla warmth"],
    vibe: "Rich & Mysterious",
    bestFor: "Winter nights and cold-weather occasions.",
    price: 30,
    category: "Signature Classics",
    premium: true,
  },
  {
    id: "5",
    slug: "ameer-al-oudh-reserve",
    name: "Ameer Al Oudh Reserve",
    image: baseImage,
    shortDescription: "A deep, smoky oudh with spice and old-world charm.",
    description:
      "A prince's choice. This deep, smoky oudh has a spicy heart, a heavy trail, and an old-world charm made for grand moments.",
    notes: ["Smoky oudh", "Warm spice", "Dry woods"],
    vibe: "Traditional & Powerful",
    bestFor: "Weddings and traditional celebrations.",
    price: 31,
    category: "Signature Classics",
    premium: true,
  },
  {
    id: "6",
    slug: "one-man-show-signature",
    name: "One Man Show Signature",
    image: baseImage,
    shortDescription: "A rugged classic of herbs, spices, leather, and power.",
    description:
      "A classic powerhouse. It is a complex mix of herbs, spices, and leather: rugged, masculine, and unapologetically bold.",
    notes: ["Aromatic herbs", "Leather", "Spices"],
    vibe: "Retro & Strong",
    bestFor: "Outdoor events and high-intensity days.",
    price: 28,
    category: "Signature Classics",
  },
  {
    id: "7",
    slug: "white-musk-pure",
    name: "White Musk Pure",
    image: baseImage,
    shortDescription: "Soft, powdery, freshly washed skin in fragrance form.",
    description:
      "The scent of clean. It is soft, powdery, and mimics freshly washed skin with a subtle profile that can be worn anywhere.",
    notes: ["White musk", "Powder", "Clean cotton"],
    vibe: "Soapy & Gentle",
    bestFor: "Post-shower freshness or office wear.",
    price: 29,
    category: "Signature Classics",
  },
  {
    id: "8",
    slug: "raw-woods-intense",
    name: "Raw Woods Intense",
    image: baseImage,
    shortDescription: "Bergamot, pepper, and raw woods with magnetic freshness.",
    description:
      "An explosion of bergamot and pepper grounded by raw woody notes. It is the ultimate blue fragrance: wild, fresh, and magnetic.",
    notes: ["Bergamot", "Black pepper", "Raw woods"],
    vibe: "Raw & Edgy",
    bestFor: "Late-night parties and first dates.",
    price: 30,
    category: "Modern Elite Inspired Collection",
    premium: true,
  },
  {
    id: "9",
    slug: "champions-reserve",
    name: "Champion's Reserve",
    image: baseImage,
    shortDescription: "Smoky pineapple, birch wood, and musk for a victorious aura.",
    description:
      "The scent of success. A legendary blend of smoky pineapple, birch wood, and musk: an alpha fragrance every enthusiast knows.",
    notes: ["Smoky pineapple", "Birch wood", "Musk"],
    vibe: "Heroic & Iconic",
    bestFor: "When you want to make a statement of victory.",
    price: 32,
    category: "Modern Elite Inspired Collection",
    premium: true,
  },
  {
    id: "10",
    slug: "mediterranean-luxe",
    name: "Mediterranean Luxe",
    image: baseImage,
    shortDescription: "Mediterranean sea breeze over warm sun-kissed rocks.",
    description:
      "A timeless aquatic masterpiece. It smells like Mediterranean sea breeze hitting warm, sun-kissed rocks: crisp and effortlessly cool.",
    notes: ["Marine breeze", "Citrus", "Mineral woods"],
    vibe: "Fresh & Classic",
    bestFor: "Brunch dates and summer afternoons.",
    price: 30,
    category: "Modern Elite Inspired Collection",
  },
  {
    id: "11",
    slug: "cypress-supreme",
    name: "Cypress Supreme",
    image: baseImage,
    shortDescription: "Green cypress, noble woods, and masculine herbal energy.",
    description:
      "A modern take on traditional cologne, heavy on noble woods and cypress for a green, herbal, and very masculine energy.",
    notes: ["Cypress", "Noble woods", "Herbal greens"],
    vibe: "Green & Masculine",
    bestFor: "Semi-formal day wear.",
    price: 30,
    category: "Modern Elite Inspired Collection",
  },
  {
    id: "12",
    slug: "signature-noir",
    name: "Signature Noir",
    image: baseImage,
    shortDescription: "Dark spices, leather, and woods made for night.",
    description:
      "Dark, seductive, and intense. This night-only scent features spicy notes and a heavy base of leather and dark woods.",
    notes: ["Dark spice", "Leather", "Black woods"],
    vibe: "Seductive & Dark",
    bestFor: "Black-tie events and intimate evenings.",
    price: 29,
    category: "Modern Elite Inspired Collection",
    premium: true,
  },
  {
    id: "13",
    slug: "intemate-velvet",
    name: "Intemate Velvet",
    image: baseImage,
    shortDescription: "Warm, slightly sweet, cozy, and close to the skin.",
    description:
      "A sensual, close-to-the-skin scent. It is warm, slightly sweet, and incredibly cozy, like a soft embrace.",
    notes: ["Warm musk", "Soft amber", "Sweet woods"],
    vibe: "Warm & Inviting",
    bestFor: "Quiet evenings at home or close encounters.",
    price: 29,
    category: "Modern Elite Inspired Collection",
  },
  {
    id: "14",
    slug: "azure-cedar-reserve",
    name: "Azure Cedar Reserve",
    image: baseImage,
    shortDescription: "Ginger, grapefruit, and cedarwood in refined balance.",
    description:
      "The gold standard of masculine elegance. A perfect balance of ginger, grapefruit, and cedarwood that is fresh yet deeply professional.",
    notes: ["Ginger", "Grapefruit", "Cedarwood"],
    vibe: "Versatile & Refined",
    bestFor: "The modern professional's daily signature.",
    price: 31,
    category: "Modern Elite Inspired Collection",
    premium: true,
  },
  {
    id: "15",
    slug: "garden-bloom",
    name: "Garden Bloom",
    image: baseImage,
    shortDescription: "A vibrant garden of tuberose and jasmine in full bloom.",
    description:
      "A lush, blooming garden in a bottle. Heavy on tuberose and jasmine, it is a floral explosion that feels young and vibrant.",
    notes: ["Tuberose", "Jasmine", "Fresh petals"],
    vibe: "Floral & Feminine",
    bestFor: "Garden parties and daytime celebrations.",
    price: 30,
    category: "Modern Elite Inspired Collection",
  },
  {
    id: "16",
    slug: "white-oudh-classic",
    name: "White Oudh Classic",
    image: baseImage,
    shortDescription: "A clean, approachable oudh with soft woods and sweetness.",
    description:
      "A lighter, cleaner version of oudh. It mixes soft woods with a touch of sweetness, making oudh approachable even for beginners.",
    notes: ["White oudh", "Soft woods", "Gentle sweetness"],
    vibe: "Airy & Sweet-Woody",
    bestFor: "Daily wear for Oudh lovers.",
    price: 30,
    category: "Oudh & Musk Heritage",
  },
  {
    id: "17",
    slug: "purple-oudh-mystique",
    name: "Purple Oudh Mystique",
    image: baseImage,
    shortDescription: "Oudh meets dark berries and saffron in a modern attar.",
    description:
      "An exotic blend where oudh meets dark berries and saffron. It is fruity yet deep: a very modern take on traditional attars.",
    notes: ["Oudh", "Dark berries", "Saffron"],
    vibe: "Unique & Fruity-Deep",
    bestFor: "Stand-out moments where you want to be different.",
    price: 31,
    category: "Oudh & Musk Heritage",
    premium: true,
  },
  {
    id: "18",
    slug: "blue-musk-fresh",
    name: "Blue Musk Fresh",
    image: baseImage,
    shortDescription: "Cooling sea salt and citrus over clean forest musk.",
    description:
      "The ocean meets the forest. It takes the depth of musk and infuses it with cooling sea-salt and citrus notes.",
    notes: ["Sea salt", "Citrus", "Blue musk"],
    vibe: "Cooling & Energizing",
    bestFor: "Gym, sports, or hot summer days.",
    price: 81,
    category: "Oudh & Musk Heritage",
  },
  {
    id: "19",
    slug: "yellow-musk-gold",
    name: "Yellow Musk Gold",
    image: baseImage,
    shortDescription: "Radiant, sunny musk with soft spice and warmth.",
    description:
      "A warm, sunny, slightly spicy musk. It feels like golden sunlight on your skin, extremely long-lasting and radiant.",
    notes: ["Golden musk", "Warm spice", "Amber glow"],
    vibe: "Radiant & Warm",
    bestFor: "Casual outings and daytime errands.",
    price: 87,
    category: "Oudh & Musk Heritage",
  },
  {
    id: "20",
    slug: "boutique-reserve-select",
    name: "Boutique Reserve Select",
    image: baseImage,
    shortDescription: "Herbal, woody quiet luxury with boutique-hotel polish.",
    description:
      "A refined, niche-inspired blend. It is herbal, woody, and smells like an expensive boutique hotel with quiet luxury energy.",
    notes: ["Herbs", "Dry woods", "Soft spice"],
    vibe: "Niche & Intellectual",
    bestFor: "Art galleries and creative workspaces.",
    price: 71,
    category: "Oudh & Musk Heritage",
    premium: true,
  },
  {
    id: "21",
    slug: "majmua-heritage",
    name: "Majmua Heritage",
    image: baseImage,
    shortDescription: "Earthy, floral, cooling Indian heritage in a classic blend.",
    description:
      "The ultimate Indian heritage scent. A secret blend of four essential oils: earthy, floral, deeply cooling, and old-school.",
    notes: ["Earthy oils", "Florals", "Cooling greens"],
    vibe: "Earthy & Nostalgic",
    bestFor: "Traditional ceremonies and monsoon days.",
    price: 28,
    category: "Oudh & Musk Heritage",
  },
  {
    id: "22",
    slug: "jannatul-firdaus-royal",
    name: "Jannatul Firdaus Royal",
    image: baseImage,
    shortDescription: "Sharp, green, mossy, cooling, and deeply spiritual.",
    description:
      "The Garden of Paradise. This sharp, green, mossy scent is legendary in attars, with a cooling and medicinal character.",
    notes: ["Green moss", "Herbal accord", "Cooling florals"],
    vibe: "Deep Green & Spiritual",
    bestFor: "Spiritual gatherings and extreme heat.",
    price: 28,
    category: "Oudh & Musk Heritage",
  },
  {
    id: "23",
    slug: "t-rose-elegance",
    name: "T Rose Elegance",
    image: baseImage,
    shortDescription: "Dewy Taif rose, fresh as a garden at first light.",
    description:
      "The purest expression of a Taif Rose. Dewy, fresh, and like a rose garden at 5 AM with no artificial sweetness.",
    notes: ["Taif rose", "Dew", "Fresh petals"],
    vibe: "Floral & Romantic",
    bestFor: "Gift-giving and romantic evenings.",
    price: 28,
    category: "Single-Note Botanical Bliss",
  },
  {
    id: "24",
    slug: "sandal-supreme",
    name: "Sandal Supreme",
    image: baseImage,
    shortDescription: "Creamy Mysore sandalwood with a meditative softness.",
    description:
      "Pure, creamy Mysore sandalwood. Woody, milky, and naturally chill, this meditative scent stays close to you.",
    notes: ["Mysore sandalwood", "Milky woods", "Soft cream"],
    vibe: "Grounding & Creamy",
    bestFor: "Focus, work, and relaxation.",
    price: 30,
    category: "Single-Note Botanical Bliss",
    premium: true,
  },
  {
    id: "25",
    slug: "velvet-desire",
    name: "Velvet Desire",
    image: baseImage,
    shortDescription: "Sexy floral-fruity glam with a rich patchouli base.",
    description:
      "A modern, sexy floral-fruity blend with a patchouli base. Sweet, glam, and perfect for the woman who loves to stand out.",
    notes: ["Fruity florals", "Patchouli", "Sweet amber"],
    vibe: "Glamorous & Sweet",
    bestFor: "Nightclubs and social mixers.",
    price: 30,
    category: "Single-Note Botanical Bliss",
  },
  {
    id: "26",
    slug: "suede-signature",
    name: "Suede Signature",
    image: baseImage,
    shortDescription: "Raspberry, pear, and suede with bright optimism.",
    description:
      "A bright, cheerful scent with notes of raspberry, pear, and suede. Bubbly, optimistic, and easy to love.",
    notes: ["Raspberry", "Pear", "Suede"],
    vibe: "Playful & Airy",
    bestFor: "College, office, and daily errands.",
    price: 29,
    category: "Single-Note Botanical Bliss",
  },
  {
    id: "27",
    slug: "musk-rizali-premium",
    name: "Musk Rizali Premium",
    image: baseImage,
    shortDescription: "Rare creamy white musk with a premium floral undertone.",
    description:
      "A rare, high-grade white musk that is thicker and creamier than usual, with a slight floral undertone that makes it feel premium.",
    notes: ["Creamy white musk", "Floral nuance", "Skin accord"],
    vibe: "Luxurious & Clean",
    bestFor: "Layering with other perfumes or wearing alone as a skin-scent.",
    price: 29,
    category: "Single-Note Botanical Bliss",
    premium: true,
  },
  {
    id: "28",
    slug: "black-edition",
    name: "Black Edition",
    image: baseImage,
    shortDescription: "Smoky, leathery, spicy, and impossible to ignore.",
    description:
      "The Dark Horse. Smoky, leathery, and spicy, it is mysterious and difficult to pin down, but impossible to stop smelling.",
    notes: ["Smoke", "Leather", "Dark spice"],
    vibe: "Intimidating & Cool",
    bestFor: "Leather jacket weather and late-night drives.",
    price: 30,
    category: "Single-Note Botanical Bliss",
    premium: true,
  },
  {
    id: "29",
    slug: "mogra-garden-bloom",
    name: "Mogra Garden Bloom",
    image: baseImage,
    shortDescription: "Sweet Indian jasmine with the richness of a fresh garland.",
    description:
      "The intoxicating scent of Indian jasmine. Sweet, heavy, and like a fresh mogra garland in full bloom.",
    notes: ["Mogra", "Sweet jasmine", "Fresh garland"],
    vibe: "Traditional & Sweet Floral",
    bestFor: "Evening wear and festive events.",
    price: 28,
    category: "Floral & Dessert Series",
  },
  {
    id: "30",
    slug: "jasmin-pure",
    name: "Jasmin Pure",
    image: baseImage,
    shortDescription: "Fresh-cut jasmine with a sharper, greener edge.",
    description:
      "A sharper, greener version of jasmine. Less sweet than mogra and more fresh-cut, with an energizing floral lift.",
    notes: ["Green jasmine", "Fresh stems", "Soft petals"],
    vibe: "Energizing & Floral",
    bestFor: "Morning wear.",
    price: 28,
    category: "Floral & Dessert Series",
  },
  {
    id: "31",
    slug: "lavender-mist",
    name: "Lavender Mist",
    image: baseImage,
    shortDescription: "Herbal, floral, minty calm that feels like a spa.",
    description:
      "The ultimate sleep and relaxation scent. Herbal, floral, and slightly minty, it feels like a spa in a bottle.",
    notes: ["Lavender", "Herbal mist", "Cool mint"],
    vibe: "Calming & Herbaceous",
    bestFor: "Stressful days or before bed.",
    price: 28,
    category: "Floral & Dessert Series",
  },
  {
    id: "32",
    slug: "marigold-blossom",
    name: "Marigold Blossom",
    image: baseImage,
    shortDescription: "A rare earthy floral with spicy, golden brightness.",
    description:
      "A unique, earthy floral. Spicy, bright, and carrying a golden energy that is rare in perfumery.",
    notes: ["Marigold", "Earthy spice", "Golden florals"],
    vibe: "Earthy & Bright",
    bestFor: "Cultural festivals.",
    price: 28,
    category: "Floral & Dessert Series",
  },
  {
    id: "33",
    slug: "chocolate-musk-reserve",
    name: "Chocolate Musk Reserve",
    image: baseImage,
    shortDescription: "Dark cocoa and warm musk, delicious but refined.",
    description:
      "A gourmand delight. It smells like dark cocoa mixed with warm musk, delicious without becoming overly sugary.",
    notes: ["Dark cocoa", "Warm musk", "Soft amber"],
    vibe: "Edible & Cozy",
    bestFor: "Winter days and dessert lovers.",
    price: 29,
    category: "Floral & Dessert Series",
  },
  {
    id: "34",
    slug: "1001-nights-exclusive",
    name: "1001 Nights Exclusive",
    image: baseImage,
    shortDescription: "A complex mukhallat of spices, rose, and oudh.",
    description:
      "A story in a bottle. This complex mukhallat blend of spices, rose, and oudh evolves on your skin every hour.",
    notes: ["Spices", "Rose", "Oudh"],
    vibe: "Exotic & Storytelling",
    bestFor: "When you want to be remembered.",
    price: 32,
    category: "Floral & Dessert Series",
    premium: true,
  },
  {
    id: "35",
    slug: "mukhallat-royale",
    name: "Mukhallat Royale",
    image: baseImage,
    shortDescription: "Saffron, amber, rose, and oudh in royal harmony.",
    description:
      "The King's blend. Saffron, amber, rose, and oudh come together in a symphony of royal Arabian perfumery.",
    notes: ["Saffron", "Amber", "Rose", "Oudh"],
    vibe: "Opulent & Grand",
    bestFor: "Once-in-a-lifetime events.",
    price: 32,
    category: "Floral & Dessert Series",
    premium: true,
  },
];

export function getProductDiscountPercent(
  product: Pick<Product, "slug" | "discountPercent">
) {
  return product.discountPercent ?? productDiscountPercents[product.slug] ?? 20;
}

export const productHoverImages: Record<string, string> = {
  "salim-luxury-attar": "/salim2.jpg",
  "royal-confidence": "/Royal Confidence 2.png",
  "purple-oudh-mystique": "/Purple Oudh Mystique 2.jpeg",
  "sandal-supreme": "/Sandal Supreme 2.png",
  "t-rose-elegance": "/T Rose Elegance 2.png",
  "white-musk-pure": "/white musk 2.jpeg",
  "white-oudh-classic": "/White Oudh Classic 2.jpeg",
  "musk-rizali-premium": "/Musk Rizali Premium 2.jpeg",
  "mukhallat-royale": "/Mukhallat Royale 2.jpeg",
  "majmua-heritage": "/Majmua Heritage 2.jpeg",
  "mogra-garden-bloom": "/Mogra Garden Bloom 2.jpeg",
  "marigold-blossom": "/Marigold Blossom 2.jpeg",
  "black-edition": "/Black Edition 2.jpeg",
  "blue-musk-fresh": "/Blue Musk Fresh 2.jpeg",
  "champions-reserve": "/Champions Reserve 2.jpeg",
  "chocolate-musk-reserve": "/Chocolate Musk Reserve 2.jpeg",
  "raw-woods-intense": "/Raw Woods Intense 2.jpeg",
  "mediterranean-luxe": "/Mediterranean Luxe 2.jpeg",
  "boutique-reserve-select": "/Boutique Reserve Select 2.jpeg",
  "aqua-prestige": "/Aqua Prestige 2.jpeg",
  "ameer-al-oudh-reserve": "/Ameer Al Oudh Reserve 2.jpeg",
  "azure-cedar-reserve": "/Azure Cedar Reserve 2.jpeg",
  "1001-nights-exclusive": "/1001 Nights Exclusive 2.jpeg",
  "yellow-musk-gold": "/Yellow Musk Gold 2.jpeg",
  "velvet-oudh-royale": "/Velvet Oudh Royal 2.jpeg",
  "signature-noir": "/Signature Noir 2.jpeg",
  "jannat-essence": "/Jannat Essence 2.jpeg",
  "cypress-supreme": "/Cypress Supreme 2.jpeg",
  "intemate-velvet": "/Intemate Velvet 2.jpeg",
  "garden-bloom": "/Garden Bloom 2.jpeg",
  "one-man-show-signature": "/One Man Show Signature 2.jpeg",
  "velvet-desire": "/Velvet Desire 2.jpeg",
  "lavender-mist": "/Lavender Mist 2.jpeg",
  "jannatul-firdaus-royal": "/Jannatul Firdaus Royal 2.jpeg",
  "jasmin-pure": "/Jasmin Pure 2.jpg",
  "suede-signature": "/Suede Signature 2.jpeg",
};

export const products: Product[] = productCatalog.map((product) => ({
  ...product,
  image: productImages[product.slug] ?? product.image,
  hoverImage: productHoverImages[product.slug] ?? product.hoverImage,
  discountPercent: getProductDiscountPercent(product),
}));

const salimProductSlugs = new Set(["salim-luxury-attar"]);

export const signatureProducts = products.filter(
  (product) => !salimProductSlugs.has(product.slug)
);

export const premiumProducts = signatureProducts.filter((product) => product.premium);

export function getProductBySlug(slug: string) {
  return products.find((product) => product.slug === slug);
}

export function getRelatedProducts(product: Product, limit = 4) {
  const sameCategory = products.filter(
    (item) => item.category === product.category && item.id !== product.id
  );
  const others = products.filter(
    (item) => item.category !== product.category && item.id !== product.id
  );

  return [...sameCategory, ...others].slice(0, limit);
}

export function formatPrice(price: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(price);
}

export function getCompareAtPrice(price: number, discountPercent: number) {
  return Math.round(price / (1 - discountPercent / 100));
}
