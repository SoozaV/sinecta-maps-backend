import buildApp from "./app";
import { sequelize } from "./database/database";
import { createSpatialIndex } from "./database/migrations/001-create-spatial-index";
require("dotenv").config();

const port = process.env.PORT || 3000;

async function main() {
  try {
    await sequelize.authenticate(); // Solo verificar conexión
    console.log('Database connection established');
    
    // Crear índice espacial si no existe
    await createSpatialIndex();

    const fastify = await buildApp();
    
    await fastify.listen({ 
      port: Number(port), 
      host: '0.0.0.0' 
    });
    console.log(`Server listening on port ${port}`);
  } catch (error) {
    console.error('Error starting server:', error);
    process.exit(1);
  }
}

main();
