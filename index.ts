import app from "./src/app";
import { sequelize } from "./src/database/database";

const port = process.env.PORT || 3000;

async function main() {
  try {
    await sequelize.sync({force: true})

    app.listen(3000, () => {
      console.log(`Server listening on port ${port}`);
    });
  } catch (error) {
    console.log(error);
  }
}

main();
