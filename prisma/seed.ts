import "dotenv/config";
import bcrypt from "bcryptjs";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { DEFAULT_WHATSAPP_TEMPLATE } from "../src/lib/whatsapp/defaultTemplate";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

function slugify(value: string) {
  return value
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

const SNEAKER_PRODUCT_IMAGES: Record<string, string[]> = {
  "nike-air-zoom-pulse": [
    "/images/products/nike-air-zoom-pulse-1.png",
    "/images/products/nike-air-zoom-pulse-2.png",
  ],
  "nike-revolution-flux": [
    "https://images.unsplash.com/photo-1511556532299-8f662fc26c06?w=1000&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?w=1000&auto=format&fit=crop&q=80",
  ],
  "nike-court-vision-neo": [
    "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=1000&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=1000&auto=format&fit=crop&q=80",
  ],
  "adidas-ultraboost-circuit": [
    "https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?w=1000&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1587563871167-1ee9c731aefb?w=1000&auto=format&fit=crop&q=80",
  ],
  "adidas-superstar-chrome": [
    "https://images.unsplash.com/photo-1518002171953-a080ee817e1f?w=1000&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=1000&auto=format&fit=crop&q=80",
  ],
  "adidas-forum-ignite": [
    "https://images.unsplash.com/photo-1552346154-21d32810aba3?w=1000&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1607522370275-f14206abe5d3?w=1000&auto=format&fit=crop&q=80",
  ],
  "mizuno-wave-rider-prime": [
    "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=1000&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=1000&auto=format&fit=crop&q=80",
  ],
  "mizuno-wave-sky-nova": [
    "https://images.unsplash.com/photo-1582588678413-dbf45f4823e9?w=1000&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1595341888016-a392ef81b7de?w=1000&auto=format&fit=crop&q=80",
  ],
  "puma-rs-x-voltage": [
    "https://images.unsplash.com/photo-1539185441755-769473a23570?w=1000&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1512374382149-233c42b6a83b?w=1000&auto=format&fit=crop&q=80",
  ],
  "puma-suede-classic-neon": [
    "https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=1000&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=1000&auto=format&fit=crop&q=80",
  ],
  "puma-velocity-nitro": [
    "https://images.unsplash.com/photo-1605348532760-6753d2c43329?w=1000&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=1000&auto=format&fit=crop&q=80",
  ],
  "new-balance-990-vector": [
    "https://images.unsplash.com/photo-1539185441755-769473a23570?w=1000&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?w=1000&auto=format&fit=crop&q=80",
  ],
  "new-balance-fuelcell-rebel": [
    "https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?w=1000&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=1000&auto=format&fit=crop&q=80",
  ],
  "new-balance-fresh-foam-kids": [
    "https://images.unsplash.com/photo-1514989940723-e8e51635b782?w=1000&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=1000&auto=format&fit=crop&q=80",
  ],
  "nike-star-runner-junior": [
    "https://images.unsplash.com/photo-1515955656352-a1fa3ffcd111?w=1000&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1511556532299-8f662fc26c06?w=1000&auto=format&fit=crop&q=80",
  ],
};

const CATEGORY_IMAGES: Record<string, string> = {
  corrida: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=1000&auto=format&fit=crop&q=80",
  casual: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=1000&auto=format&fit=crop&q=80",
  esportivo: "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=1000&auto=format&fit=crop&q=80",
  lifestyle: "https://images.unsplash.com/photo-1539185441755-769473a23570?w=1000&auto=format&fit=crop&q=80",
  infantil: "https://images.unsplash.com/photo-1514989940723-e8e51635b782?w=1000&auto=format&fit=crop&q=80",
};

function getProductSneakerImages(slug: string): string[] {
  return SNEAKER_PRODUCT_IMAGES[slug] ?? [
    "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=1000&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=1000&auto=format&fit=crop&q=80",
  ];
}

function placeholderImage(seed: string, size = 800) {
  return `https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=${size}&auto=format&fit=crop&q=80`;
}

async function seedAdminUser() {
  const passwordHash = await bcrypt.hash("admin123", 10);
  return prisma.adminUser.upsert({
    where: { email: "admin@jettasport.com.br" },
    update: {},
    create: {
      name: "Admin Jetta Sport",
      email: "admin@jettasport.com.br",
      passwordHash,
      role: "ADMIN",
    },
  });
}

async function seedStoreSettings() {
  return prisma.storeSettings.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      storeName: "Jetta Sport",
      whatsappNumber: process.env.WHATSAPP_DEFAULT_NUMBER ?? "5511999999999",
      instagramUrl: "https://instagram.com/jettasport",
      address: "Goiânia - GO",
      businessHours: "Segunda a sábado, 9h às 18h",
      whatsappMessageTemplate: DEFAULT_WHATSAPP_TEMPLATE,
      exchangePolicy:
        "Trocas em até 7 dias corridos após o recebimento, mediante confirmação pelo WhatsApp. O produto deve estar sem uso, com etiquetas e embalagem originais.",
      privacyPolicy:
        "Seus dados são utilizados apenas para processar seu pedido e contato pelo WhatsApp. Não compartilhamos suas informações com terceiros.",
      shippingInfo:
        "Frete calculado por CEP e confirmado pelo vendedor durante o atendimento no WhatsApp.",
    },
  });
}

async function seedOrderSequence() {
  return prisma.orderSequence.upsert({
    where: { id: 1 },
    update: {},
    create: { id: 1, nextVal: 1 },
  });
}

const brandNames = ["Nike", "Adidas", "Mizuno", "Puma", "New Balance"];

async function seedBrands() {
  return Promise.all(
    brandNames.map((name) =>
      prisma.brand.upsert({
        where: { slug: slugify(name) },
        update: {},
        create: { name, slug: slugify(name), isActive: true },
      }),
    ),
  );
}

const categoryNames = ["Corrida", "Casual", "Esportivo", "Lifestyle", "Infantil"];

async function seedCategories() {
  return Promise.all(
    categoryNames.map((name) => {
      const slug = slugify(name);
      const imageUrl = CATEGORY_IMAGES[slug] ?? placeholderImage(`category-${slug}`, 900);
      return prisma.category.upsert({
        where: { slug },
        update: { imageUrl },
        create: { name, slug, isActive: true, imageUrl },
      });
    }),
  );
}

interface ProductSeed {
  name: string;
  brand: string;
  category: string;
  gender: string;
  style: string;
  price: number;
  promotionalPrice?: number;
  isFeatured?: boolean;
  isNew?: boolean;
  isPromotion?: boolean;
  colors: string[];
  sizes: string[];
  stockPattern: number[]; // one entry per (color,size) combo generated, cycled
}

const productSeeds: ProductSeed[] = [
  {
    name: "Nike Air Zoom Pulse",
    brand: "Nike",
    category: "Corrida",
    gender: "masculino",
    style: "Corrida de rua",
    price: 599.9,
    isFeatured: true,
    isNew: true,
    colors: ["Preto", "Azul"],
    sizes: ["39", "40", "41", "42"],
    stockPattern: [8, 5, 0, 3],
  },
  {
    name: "Nike Revolution Flux",
    brand: "Nike",
    category: "Corrida",
    gender: "feminino",
    style: "Corrida leve",
    price: 449.9,
    promotionalPrice: 379.9,
    isPromotion: true,
    colors: ["Branco", "Dourado"],
    sizes: ["35", "36", "37", "38"],
    stockPattern: [6, 4, 2, 0],
  },
  {
    name: "Nike Court Vision Neo",
    brand: "Nike",
    category: "Casual",
    gender: "unissex",
    style: "Casual urbano",
    price: 429.9,
    colors: ["Preto", "Branco"],
    sizes: ["38", "39", "40", "41"],
    stockPattern: [10, 7, 5, 4],
  },
  {
    name: "Adidas Ultraboost Circuit",
    brand: "Adidas",
    category: "Corrida",
    gender: "masculino",
    style: "Alta performance",
    price: 799.9,
    isFeatured: true,
    colors: ["Preto", "Cinza"],
    sizes: ["40", "41", "42", "43"],
    stockPattern: [5, 3, 0, 2],
  },
  {
    name: "Adidas Superstar Chrome",
    brand: "Adidas",
    category: "Casual",
    gender: "unissex",
    style: "Ícone street",
    price: 549.9,
    isNew: true,
    colors: ["Branco", "Dourado"],
    sizes: ["37", "38", "39", "40"],
    stockPattern: [9, 6, 3, 1],
  },
  {
    name: "Adidas Forum Ignite",
    brand: "Adidas",
    category: "Lifestyle",
    gender: "masculino",
    style: "Lifestyle premium",
    price: 649.9,
    promotionalPrice: 519.9,
    isPromotion: true,
    colors: ["Vermelho", "Preto"],
    sizes: ["40", "41", "42"],
    stockPattern: [4, 0, 2],
  },
  {
    name: "Mizuno Wave Rider Prime",
    brand: "Mizuno",
    category: "Corrida",
    gender: "masculino",
    style: "Corrida profissional",
    price: 699.9,
    isFeatured: true,
    colors: ["Azul", "Vermelho"],
    sizes: ["39", "40", "41", "42"],
    stockPattern: [7, 5, 4, 0],
  },
  {
    name: "Mizuno Wave Sky Nova",
    brand: "Mizuno",
    category: "Corrida",
    gender: "feminino",
    style: "Amortecimento máximo",
    price: 729.9,
    isNew: true,
    colors: ["Branco", "Azul"],
    sizes: ["35", "36", "37", "38"],
    stockPattern: [6, 3, 2, 5],
  },
  {
    name: "Puma RS-X Voltage",
    brand: "Puma",
    category: "Lifestyle",
    gender: "unissex",
    style: "Chunky retrô",
    price: 579.9,
    colors: ["Cinza", "Dourado"],
    sizes: ["38", "39", "40", "41"],
    stockPattern: [8, 4, 0, 1],
  },
  {
    name: "Puma Suede Classic Neon",
    brand: "Puma",
    category: "Casual",
    gender: "unissex",
    style: "Clássico renovado",
    price: 399.9,
    promotionalPrice: 329.9,
    isPromotion: true,
    colors: ["Preto", "Vermelho"],
    sizes: ["37", "38", "39", "40"],
    stockPattern: [10, 6, 3, 2],
  },
  {
    name: "Puma Velocity Nitro",
    brand: "Puma",
    category: "Esportivo",
    gender: "masculino",
    style: "Alta performance",
    price: 649.9,
    isFeatured: true,
    isNew: true,
    colors: ["Azul", "Preto"],
    sizes: ["40", "41", "42", "43"],
    stockPattern: [5, 2, 0, 3],
  },
  {
    name: "New Balance 990 Vector",
    brand: "New Balance",
    category: "Lifestyle",
    gender: "masculino",
    style: "Lifestyle clássico",
    price: 899.9,
    colors: ["Cinza", "Branco"],
    sizes: ["40", "41", "42"],
    stockPattern: [4, 3, 0],
  },
  {
    name: "New Balance FuelCell Rebel",
    brand: "New Balance",
    category: "Esportivo",
    gender: "feminino",
    style: "Corrida veloz",
    price: 679.9,
    isNew: true,
    colors: ["Dourado", "Preto"],
    sizes: ["35", "36", "37", "38"],
    stockPattern: [6, 4, 5, 0],
  },
  {
    name: "New Balance Fresh Foam Kids",
    brand: "New Balance",
    category: "Infantil",
    gender: "infantil",
    style: "Conforto infantil",
    price: 279.9,
    colors: ["Azul", "Vermelho"],
    sizes: ["30", "32", "34"],
    stockPattern: [8, 6, 4],
  },
  {
    name: "Nike Star Runner Junior",
    brand: "Nike",
    category: "Infantil",
    gender: "infantil",
    style: "Corrida infantil",
    price: 299.9,
    promotionalPrice: 249.9,
    isPromotion: true,
    colors: ["Rosa", "Preto"],
    sizes: ["28", "30", "32"],
    stockPattern: [7, 5, 0],
  },
];

async function seedProducts(
  brands: { id: string; name: string }[],
  categories: { id: string; name: string }[],
) {
  const brandByName = new Map(brands.map((b) => [b.name, b.id]));
  const categoryByName = new Map(categories.map((c) => [c.name, c.id]));

  for (let i = 0; i < productSeeds.length; i++) {
    const seed = productSeeds[i];
    const slug = slugify(seed.name);
    const sku = `JS-${String(i + 1).padStart(4, "0")}`;
    const sneakerImages = getProductSneakerImages(slug);

    const existingProduct = await prisma.product.findUnique({
      where: { slug },
    });

    let product;
    if (existingProduct) {
      await prisma.productImage.deleteMany({ where: { productId: existingProduct.id } });
      product = await prisma.product.update({
        where: { id: existingProduct.id },
        data: {
          name: seed.name,
          sku,
          description: `${seed.name} é um modelo ${seed.style.toLowerCase()} da ${seed.brand}, desenvolvido para quem busca estilo, desempenho e presença no dia a dia.`,
          shortDescription: `${seed.style} · ${seed.brand}`,
          brandId: brandByName.get(seed.brand)!,
          categoryId: categoryByName.get(seed.category)!,
          gender: seed.gender,
          style: seed.style,
          price: seed.price,
          promotionalPrice: seed.promotionalPrice,
          isFeatured: seed.isFeatured ?? false,
          isNew: seed.isNew ?? false,
          isPromotion: seed.isPromotion ?? false,
          isActive: true,
          displayOrder: i,
          images: {
            create: sneakerImages.map((url, imgIndex) => ({
              url,
              altText: `${seed.name} - imagem ${imgIndex + 1}`,
              order: imgIndex,
            })),
          },
        },
      });
    } else {
      product = await prisma.product.create({
        data: {
          name: seed.name,
          slug,
          sku,
          description: `${seed.name} é um modelo ${seed.style.toLowerCase()} da ${seed.brand}, desenvolvido para quem busca estilo, desempenho e presença no dia a dia.`,
          shortDescription: `${seed.style} · ${seed.brand}`,
          brandId: brandByName.get(seed.brand)!,
          categoryId: categoryByName.get(seed.category)!,
          gender: seed.gender,
          style: seed.style,
          price: seed.price,
          promotionalPrice: seed.promotionalPrice,
          isFeatured: seed.isFeatured ?? false,
          isNew: seed.isNew ?? false,
          isPromotion: seed.isPromotion ?? false,
          isActive: true,
          displayOrder: i,
          images: {
            create: sneakerImages.map((url, imgIndex) => ({
              url,
              altText: `${seed.name} - imagem ${imgIndex + 1}`,
              order: imgIndex,
            })),
          },
        },
      });
    }

    let stockCursor = 0;
    for (const color of seed.colors) {
      for (const size of seed.sizes) {
        const stock =
          seed.stockPattern[stockCursor % seed.stockPattern.length];
        stockCursor++;
        await prisma.productVariant.upsert({
          where: {
            productId_color_size: {
              productId: product.id,
              color,
              size,
            },
          },
          update: { stock },
          create: {
            productId: product.id,
            color,
            size,
            stock,
          },
        });
      }
    }
  }
}

async function seedBanners() {
  const banners = [
    {
      title: "O próximo nível começa nos seus pés.",
      subtitle: "Tênis selecionados para quem busca estilo, desempenho e presença.",
      imageUrl: "https://images.unsplash.com/photo-1552346154-21d32810aba3?w=1600&auto=format&fit=crop&q=80",
      buttonLabel: "Explorar coleção",
      buttonLink: "/catalogo",
      placement: "hero",
      displayOrder: 0,
    },
    {
      title: "Ofertas que correm rápido.",
      subtitle: "Garanta seu modelo antes que a numeração acabe.",
      imageUrl: "https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=1600&auto=format&fit=crop&q=80",
      buttonLabel: "Ver promoções",
      buttonLink: "/promocoes",
      placement: "promo",
      displayOrder: 0,
    },
  ];

  for (const banner of banners) {
    const existing = await prisma.banner.findFirst({
      where: { title: banner.title },
    });
    if (existing) {
      await prisma.banner.update({
        where: { id: existing.id },
        data: { imageUrl: banner.imageUrl },
      });
    } else {
      await prisma.banner.create({ data: banner });
    }
  }
}

async function main() {
  await seedAdminUser();
  await seedStoreSettings();
  await seedOrderSequence();

  const brands = await seedBrands();
  const categories = await seedCategories();
  await seedProducts(brands, categories);
  await seedBanners();

  console.log("Seed concluído.");
  console.log("Login admin: admin@jettasport.com.br / admin123");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
