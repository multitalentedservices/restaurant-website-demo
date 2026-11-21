/* Saffron House (Demo) — menu + reviews data. Fictional demo data only. */
(function (global) {
  'use strict';
  var CATEGORIES = [
    { id: 'starters', label: 'Starters' },
    { id: 'grill', label: 'From the Grill' },
    { id: 'mains', label: 'Mains' },
    { id: 'breads', label: 'Breads & Rice' },
    { id: 'desserts', label: 'Desserts' },
    { id: 'drinks', label: 'Drinks' }
  ];
  var MENU = [
    { id: 'smoked-tomato-soup', cat: 'starters', name: 'Smoked Tomato Soup', desc: 'Roasted tomatoes, basil oil, grilled sourdough', price: 545, tags: ['V'] },
    { id: 'dahi-ke-kebab', cat: 'starters', name: 'Dahi ke Kebab', desc: 'Hung curd, mint chutney, chaat masala', price: 625, tags: ['V'] },
    { id: 'chicken-65', cat: 'starters', name: 'Chicken 65', desc: 'Curry leaves, red chilli, lemon', price: 845, tags: ['S'] },
    { id: 'garlic-prawns', cat: 'starters', name: 'Garlic Butter Prawns', desc: 'Pan-tossed prawns, garlic butter, parsley', price: 1295, tags: [] },
    { id: 'beef-seekh-kebab', cat: 'grill', name: 'Beef Seekh Kebab', desc: 'Hand-minced beef, green chilli, ginger — four skewers', price: 995, tags: ['S'], signature: true },
    { id: 'chicken-malai-boti', cat: 'grill', name: 'Chicken Malai Boti', desc: 'Cream and white pepper marinade, charcoal-grilled', price: 1095, tags: [], signature: true },
    { id: 'chicken-tikka', cat: 'grill', name: 'Chicken Tikka', desc: 'Leg quarter, overnight marinade, smoked over coals', price: 895, tags: ['S'] },
    { id: 'lamb-chops', cat: 'grill', name: 'Lamb Chops', desc: 'Rosemary, rock salt, grilled pink in the middle', price: 2495, tags: [] },
    { id: 'grilled-fish', cat: 'grill', name: 'Grilled Fish of the Day', desc: 'Ajwain and lemon butter — ask your server what came in', price: 1895, tags: [] },
    { id: 'chicken-karahi', cat: 'mains', name: 'Chicken Karahi — Half', desc: 'Tomato, green chillies, ginger, finished in desi ghee', price: 1795, tags: ['S'], signature: true },
    { id: 'white-karahi', cat: 'mains', name: 'Chicken White Karahi — Half', desc: 'Yoghurt, black pepper, green chillies', price: 1895, tags: [] },
    { id: 'beef-nihari', cat: 'mains', name: 'Beef Nihari', desc: 'Slow-cooked overnight, fried onion, ginger, lemon', price: 1495, tags: [] },
    { id: 'chicken-steak', cat: 'mains', name: 'Grilled Chicken Steak', desc: 'Mushroom sauce, seasonal vegetables, fries', price: 1695, tags: [] },
    { id: 'palak-paneer', cat: 'mains', name: 'Palak Paneer', desc: 'Spinach, cottage cheese, a little cream', price: 895, tags: ['V'] },
    { id: 'daal-e-khaas', cat: 'mains', name: 'Daal-e-Khaas', desc: 'Black lentils simmered all day, white butter', price: 745, tags: ['V'] },
    { id: 'chicken-biryani', cat: 'breads', name: 'Chicken Biryani', desc: 'Sealed handi opened at your table, raita on the side', price: 645, tags: ['S'], signature: true },
    { id: 'vegetable-pulao', cat: 'breads', name: 'Vegetable Pulao', desc: 'Seasonal vegetables, whole spices', price: 545, tags: ['V'] },
    { id: 'zeera-rice', cat: 'breads', name: 'Zeera Rice', desc: 'Basmati, cumin, ghee', price: 395, tags: [] },
    { id: 'roghni-naan', cat: 'breads', name: 'Roghni Naan', desc: 'Sesame and milk wash, from the tandoor to order', price: 145, tags: [] },
    { id: 'garlic-naan', cat: 'breads', name: 'Garlic Naan', desc: 'Garlic and coriander, brushed with butter', price: 165, tags: [] },
    { id: 'tandoori-roti', cat: 'breads', name: 'Tandoori Roti', desc: 'Whole wheat, baked to order', price: 60, tags: [] },
    { id: 'kulfa-falooda', cat: 'desserts', name: 'Kulfa Falooda', desc: 'Dense kulfa, vermicelli, basil seeds, rose syrup', price: 595, tags: [] },
    { id: 'lava-cake', cat: 'desserts', name: 'Chocolate Lava Cake', desc: 'Baked to order — twelve minutes, worth it', price: 695, tags: [] },
    { id: 'gulab-jamun', cat: 'desserts', name: 'Gulab Jamun with Rabri', desc: 'Two pieces, warm, with thickened milk', price: 445, tags: [] },
    { id: 'shahi-kheer', cat: 'desserts', name: 'Shahi Kheer', desc: 'Rice pudding, cardamom, crushed pistachio', price: 395, tags: [] },
    { id: 'kashmiri-chai', cat: 'drinks', name: 'Kashmiri Chai', desc: 'Pink tea, crushed pistachio and almonds', price: 445, tags: [] },
    { id: 'lassi', cat: 'drinks', name: 'Lassi — Sweet or Salted', desc: 'Churned yoghurt, served in a steel glass', price: 345, tags: [] },
    { id: 'mint-lemonade', cat: 'drinks', name: 'Mint Lemonade', desc: 'Fresh mint, lemon, soda', price: 295, tags: [] },
    { id: 'fresh-lime-soda', cat: 'drinks', name: 'Fresh Lime Soda', desc: 'Sweet, salted or mixed', price: 245, tags: [] },
    { id: 'mineral-water', cat: 'drinks', name: 'Mineral Water — 1 Litre', desc: 'Still, chilled', price: 180, tags: [] },
    { id: 'soft-drink', cat: 'drinks', name: 'Soft Drink', desc: 'Can, 330 ml', price: 150, tags: [] }
  ];
  var REVIEWS = [
    { name: 'Ayesha K. (demo review)', stars: 5, when: '2 weeks ago', text: 'The seekh kebabs are the best we have had in Gulberg — smoky, soft, properly spiced. Booked again for next Friday.' },
    { name: 'Bilal R. (demo review)', stars: 5, when: '1 month ago', text: 'Ordered on WhatsApp for a family dinner. The biryani handi arrived hot and the total was confirmed before payment. Smooth.' },
    { name: 'Mahnoor S. (demo review)', stars: 4, when: '1 month ago', text: 'Lovely room, unhurried service. The white karahi is rich — share it. Parking on Main Boulevard can be tight at peak hours.' },
    { name: 'Hamza T. (demo review)', stars: 5, when: '2 months ago', text: 'Took clients here for a working dinner. Quiet corner tables, honest prices printed on the menu, and the kulfa falooda finished it perfectly.' }
  ];
  var api = { CATEGORIES: CATEGORIES, MENU: MENU, REVIEWS: REVIEWS };
  global.SAFFRON_DATA = api;
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
})(typeof window !== 'undefined' ? window : globalThis);
