import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const seedData = [
  {
    title: "Multi variant 3",
    customerName: "Multi variant 3",
    quantity: 1,
    preorderWhen: "out-of-stock",
    startsAt: new Date("2025-12-15T20:24:00"),
    endsAt: null,
    status: "INACTIVE",
  },
  {
    title: "Partial payment",
    customerName: "Partial payment",
    quantity: 1,
    preorderWhen: "regardless-of-stock",
    startsAt: new Date("2025-12-15T20:24:00"),
    endsAt: null,
    status: "ACTIVE",
  },
  {
    title: "Coming soon",
    customerName: "Coming soon",
    quantity: 1,
    preorderWhen: "regardless-of-stock",
    startsAt: new Date("2025-12-15T20:24:00"),
    endsAt: null,
    status: "ACTIVE",
  },
  {
    title: "Multi variant 2",
    customerName: "Multi variant 2",
    quantity: 1,
    preorderWhen: "regardless-of-stock",
    startsAt: new Date("2025-12-15T20:24:00"),
    endsAt: null,
    status: "ACTIVE",
  },
  {
    title: "Multi variant",
    customerName: "Multi variant",
    quantity: 1,
    preorderWhen: "regardless-of-stock",
    startsAt: new Date("2025-12-15T20:24:00"),
    endsAt: null,
    status: "ACTIVE",
  },
  {
    title: "Preorder",
    customerName: "Preorder",
    quantity: 1,
    preorderWhen: "regardless-of-stock",
    startsAt: new Date("2025-12-15T20:24:00"),
    endsAt: null,
    status: "ACTIVE",
  },
  {
    title: "Preorder with end date",
    customerName: "Preorder with end date",
    quantity: 1,
    preorderWhen: "regardless-of-stock",
    startsAt: new Date("2025-12-15T20:24:00"),
    endsAt: new Date("2025-12-15T20:27:00"),
    status: "ACTIVE",
  },
  {
    title: "Preorder with end date 2",
    customerName: "Preorder with end date 2",
    quantity: 1,
    preorderWhen: "regardless-of-stock",
    startsAt: new Date("2025-12-15T20:24:00"),
    endsAt: null,
    status: "ACTIVE",
  },
];

async function main() {
  await prisma.preorder.deleteMany();

  for (const item of seedData) {
    await prisma.preorder.create({ data: item });
  }

  console.log(`Seeded ${seedData.length} preorders`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
