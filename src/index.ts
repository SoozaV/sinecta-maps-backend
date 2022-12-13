import app from "./src/app";
import sequelize from "./src/database/database";

const port = process.env.PORT || 3000;

async function main() {
  try {
    await sequelize.sync({ force: false });

    app.listen(port, () => {
      console.log(`Server listening on port ${port}`);
    });
  } catch (error) {
    console.log(error);
  }
}

main();
