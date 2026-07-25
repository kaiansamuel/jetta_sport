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

function placeholderImage(seed: string, size = 800) {
  return `https://picsum.photos/seed/${seed}/${size}/${size}`;
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
      const imageUrl = placeholderImage(`category-${slugify(name)}`, 900);
      return prisma.category.upsert({
        where: { slug: slugify(name) },
        // Unlike AdminUser/StoreSettings (real admin-owned data we never
        // want to clobber on reseed), category images are demo placeholder
        // data — re-asserting it here is what caught this bug: imageUrl was
        // added to the schema after categories already existed, so an
        // empty `update: {}` silently left every pre-existing row at NULL
        // on every subsequent `db seed` run.
        update: { imageUrl },
        create: { name, slug: slugify(name), isActive: true, imageUrl },
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

    const product = await prisma.product.upsert({
      where: { slug },
      update: {},
      create: {
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
          create: [0, 1].map((imgIndex) => ({
            url: placeholderImage(`${slug}-${imgIndex}`),
            altText: `${seed.name} - imagem ${imgIndex + 1}`,
            order: imgIndex,
          })),
        },
      },
    });

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
      imageUrl: placeholderImage("banner-hero", 1600),
      buttonLabel: "Explorar coleção",
      buttonLink: "/catalogo",
      placement: "hero",
      displayOrder: 0,
    },
    {
      title: "Ofertas que correm rápido.",
      subtitle: "Garanta seu modelo antes que a numeração acabe.",
      imageUrl: placeholderImage("banner-promo", 1600),
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
    if (!existing) {
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
