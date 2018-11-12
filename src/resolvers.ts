import { IResolvers } from "graphql-tools";

const books = [
  {
    title: "Harry Potter and the Chamber of Secrets",
    author: "J.K. Rowling"
  },
  {
    title: "Jurassic Park",
    author: "Michael Crichton"
  }
];

export const resolvers: IResolvers = {
  Query: {
    books: (_a, _b, c) => {
      console.log(c.req.user)
      return books;
    }
  }
};
