export const NAV_LINKS = [
  { href: '#menu', label: 'Menu' },
  { href: '#bubuk', label: 'Bubuk Matcha' },
  { href: '#flavor', label: 'Flavor Baru' },
  { href: '#tentang', label: 'Tentang' },
  { href: '#tanya', label: 'Tanya Kami' },
]

export const IMAGES = {
  signature: './images/signature-cup.webp',
  strawberryCut: './images/strawberry-cutout.webp',
  strawberry: './images/strawberry-matcha.jpg',
  latte: './images/iced-matcha-latte.jpg',
  usucha: './images/hot-usucha.jpg',
  powder: './images/matcha-powder.jpg',
}

export const STATS = [
  { value: '4.9/5 ★', label: 'Rating Pelanggan' },
  { value: '100%', label: 'Ceremonial Grade' },
  { value: '500+', label: 'Cangkir Diseduh/Hari' },
]

export const MENU_CARDS = [
  {
    image: IMAGES.strawberry,
    tag: 'Baru',
    title: 'Strawberry Matcha',
    desc: 'Matcha, strawberry segar, susu creamy',
    price: 'Rp 34.000',
  },
  {
    image: IMAGES.latte,
    tag: 'Favorit',
    title: 'Iced Matcha Latte',
    desc: 'Matcha ceremonial grade, susu pilihan, es batu',
    price: 'Rp 30.000',
  },
  {
    image: IMAGES.usucha,
    tag: 'Klasik',
    title: 'Hot Usucha',
    desc: 'Matcha murni diseduh tradisional ala Jepang',
    price: 'Rp 28.000',
  },
]

export const MENU_ROWS = [
  {
    swatch: 'linear-gradient(135deg,#F4E27A,#E1546E)',
    title: 'Matcha Yuzu Fizz',
    desc: 'Matcha, yuzu, soda segar',
    price: 'Rp 32.000',
  },
  {
    swatch: 'linear-gradient(135deg,#6B934F,#8A5A34)',
    title: 'Matcha Hojicha Swirl',
    desc: 'Perpaduan matcha & hojicha panggang',
    price: 'Rp 33.000',
  },
  {
    swatch: 'linear-gradient(135deg,#8AAE6C,#FBF6EA)',
    title: 'Matcha Frappe',
    desc: 'Matcha diblender dengan es krim vanila',
    price: 'Rp 36.000',
  },
]

export const VARIANTS = [
  {
    color: '#4F7A3D',
    grams: '30G',
    title: 'Ceremonial Grade',
    desc: 'Untuk usucha, rasa paling halus & lembut',
    price: 'Rp 145.000',
  },
  {
    color: '#8AAE6C',
    grams: '100G',
    title: 'Culinary Grade',
    desc: 'Untuk latte & baking sehari-hari',
    price: 'Rp 95.000',
  },
  {
    color: '#C9A73D',
    grams: '150G',
    title: 'Latte Blend',
    desc: 'Sudah dicampur rendah gula, siap seduh susu',
    price: 'Rp 89.000',
  },
  {
    color: '#8A5A34',
    grams: '100G',
    title: 'Hojicha Blend',
    desc: 'Campuran matcha & hojicha panggang',
    price: 'Rp 99.000',
  },
]

export const FEATURES = [
  'Bersumber langsung dari petani mitra di Uji',
  'Digiling dengan batu tradisional (ishi-usu)',
  'Tanpa pewarna & pengawet tambahan',
]

export const CHAT_MESSAGES = [
  {
    from: 'bot',
    text: 'Halo! Aku asisten Xiaomimi Matcha 🍵 Ada yang bisa dibantu seputar menu, promo, harga, atau bubuk matcha kami?',
  },
]

export const EASE_OUT_EXPO = [0.22, 1, 0.36, 1]

