const { PrismaClient } = require("@prisma/client");

const database = new PrismaClient();

async function main() {
  try {
    // await database.category.deleteMany();
    // await database.subcategory.deleteMany();

    // await database.category.createMany({
    //   data: [{ name: "Mathematics" }, { name: "Programming" }],
    // });

    // await database.subCategory.createMany({
    //   data: [
    //     {
    //       name: "Algebra",
    //       categoryId: "0f10dabf-277f-4048-85a4-f420798dbb2e",
    //     },
    //     {
    //       name: "Geometría",
    //       categoryId: "0f10dabf-277f-4048-85a4-f420798dbb2e",
    //     },
    //     {
    //       name: "Python",
    //       categoryId: "66205c5e-31cf-4547-8753-378d57d8220c",
    //     },
    //   ],
    // });

    const categories = [
      {
        name: "Mathematics",
        subCategories: {
          create: [{ name: "Álgebra" }, { name: "Geometría" }],
        },
      },
      {
        name: "Programming",
        subCategories: {
          create: [{ name: "Python" }],
        },
      },
    ];

    for (const category of categories) {
      await database.category.create({
        data: {
          name: category.name,
          subCategories: category.subCategories,
        },
        include: {
          subCategories: true,
        },
      });
    }

    console.log("Success");
  } catch (error) {
    console.log("Error seeding the database categories", error);
  } finally {
    await database.$disconnect();
  }
}

main();
