import * as dotenv from "dotenv";
dotenv.config();

import { ApolloServer } from "apollo-server-express";
import * as express from "express";
import { typeDefs } from "./typeDefs";
import { resolvers } from "./resolvers";

import { passportStrategy } from "./passport-strat";

import * as mongoose from "mongoose";
import * as passport from "passport";

const startServer = async () => {
  const server = new ApolloServer({
    // These will be defined for both new or existing servers
    typeDefs,
    resolvers,
    context: ({ req, res }: any) => ({ req, res })
  });

  const app = express();

  app.use(passport.initialize());
  passportStrategy(passport);

  await mongoose.connect(
    process.env.MONGO_URL as string,
    { useNewUrlParser: true }
  );
  app.use(passport.authenticate("jwt", { session: false }));

  server.applyMiddleware({
    app,
    cors: {
      credentials: true,
      origin: "http://localhost:3000" // frontend
    }
  });

  app.listen({ port: 4000 }, () =>
    console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`)
  );
};

startServer();
