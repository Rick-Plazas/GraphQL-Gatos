require('dotenv').config(); // Usar la llave de los gatos del .env

const sequelize = require('./database/db');
const Student = require('./models/Student');

const { ApolloServer, gql } = require('apollo-server');
const axios = require('axios');

const CAT_API_URL = "https://api.thecatapi.com/v1/breeds";

const typeDefs = gql`
  type CatBreed {
    id: String
    name: String
    origin: String
    temperament: String
    description: String
  }

  type Student {
    id: ID
    name: String
    career: String
    age: Int
    semester: Int
  }

  type Query {
    getCatBreed(id: String!): CatBreed
    getAllCats: [CatBreed]
    getStudents: [Student]
  }
`;

const resolvers = {
  Query: {
    // Traer un gato por ID
    getCatBreed: async (_, { id }) => {
      try {
        const response = await axios.get(CAT_API_URL, {
          headers: { 'x-api-key': process.env.CAT_API_KEY }
        });

        const breed = response.data.find(b => b.id === id);

        if (!breed) {
          throw new Error(`No se encontró la raza de gatos ${id}`);
        }

        return {
          id: breed.id,
          name: breed.name,
          origin: breed.origin,
          temperament: breed.temperament,
          description: breed.description
        };
      } catch (error) {
        console.error("Error al consultar la API de gatos:", error.message);
        throw new Error("Error consultando la API externa");
      }
    },

    // Traer todos los gatos (para dropdown)
    getAllCats: async () => {
      try {
        const response = await axios.get(CAT_API_URL, {
          headers: { 'x-api-key': process.env.CAT_API_KEY }
        });

        // Solo devolver id y name para el dropdown
        return response.data.map(breed => ({
          id: breed.id,
          name: breed.name,
          origin: breed.origin,
          temperament: breed.temperament,
          description: breed.description
        }));
      } catch (error) {
        console.error("Error al consultar la API de gatos:", error.message);
        throw new Error("Error consultando la API externa");
      }
    },

    getStudents: async () => {
      return await Student.findAll();
    }
  }
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

sequelize.sync().then(() => {
  console.log('Base de datos sincronizada correctamente');
  server.listen().then(({ url }) => {
    console.log(`Servidor GraphQL corriendo en: ${url}`);
  });
}).catch(err => console.error('Error al sincronizar con la base de datos:', err));
