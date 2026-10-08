  import { betterAuth } from "better-auth";
  import { MongoClient } from "mongodb";
  import { mongodbAdapter } from "@better-auth/mongo-adapter";

  const client = new MongoClient(process.env.BETTER_AUTH_MONGODB_URL);
  const db = client.db("BAZAR-DOR");

  export const auth = betterAuth({
      
      emailAndPassword: { 
      enabled: true, 
    }, 
    socialProviders: {
          google: { 
              clientId: process.env.GOOGLE_CLIENT_ID , 
              clientSecret: process.env.GOOGLE_CLIENT_SECRET , 
          }, 
          github: { 
              clientId: process.env.GITHUB_CLIENT_ID , 
              clientSecret: process.env.GITHUB_CLIENT_SECRET , 
          }, 
      },
    database: mongodbAdapter(db, {
      client,
    }),
  });