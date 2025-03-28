import { MongoDBAdapter } from "@auth/mongodb-adapter"; // Connects NextAuth to MongoDB for session and user management.
import bcrypt from "bcryptjs"; // Used to hash and compare passwords.
import CredentialsProvider from "next-auth/providers/credentials"; // Enables email-password authentication.
import { connectToDatabase } from "./lib/db"; // A function to connect to MongoDB.
import client from "./lib/db/client"; // A MongoDB client instance
import User from "./lib/db/models/user.model"; // The Mongoose model for user data
import Google from "next-auth/providers/google"; // Enables Google OAuth login.
import NextAuth, { type DefaultSession } from "next-auth"; // The main authentication handler.
import authConfig from "./auth.config"; // Contains general NextAuth settings

declare module "next-auth" {
  // eslint-disable-next-line no-unused-vars
  // Extending NextAuth Session
  // Why? By default, session.user only includes id, name, and email. We add role so we can track user permissions.
  interface Session {
    user: {
      role: string;
    } & DefaultSession["user"];
  }
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  // signIn → Redirects users to /sign-in when they need to log in.
  // newUser → Redirects new users to /sign-up.
  // error → If an error occurs, they are redirected to /sign-in.
  pages: {
    signIn: "/sign-in",
    newUser: "/sign-up",
    error: "/sign-in",
  },
  // Configuring Session Strategy
  // Strategy: "jwt" → Uses JSON Web Tokens (JWT) to store session data.
  // maxAge → The session expires after 30 days.
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
  },
  // Connecting NextAuth to MongoDB 'adapter: MongoDBAdapter(client)'
  // This connects NextAuth to MongoDB using the MongoDBAdapter, allowing session storage in the database.
  adapter: MongoDBAdapter(client),
  providers: [
    Google({
      // allowDangerousEmailAccountLinking: true → Allows users to link multiple accounts with the same email (e.g., Google and password login).
      allowDangerousEmailAccountLinking: true,
    }),
    CredentialsProvider({
      credentials: {
        email: {
          type: "email",
        },
        password: { type: "password" },
      },
      async authorize(credentials) {
        await connectToDatabase();
        if (credentials == null) return null;

        const user = await User.findOne({ email: credentials.email });

        if (user && user.password) {
          const isMatch = await bcrypt.compare(
            credentials.password as string,
            user.password
          );
          if (isMatch) {
            return {
              id: user._id,
              name: user.name,
              email: user.email,
              role: user.role,
            };
          }
        }
        return null;
      },
    }),
  ],
  callbacks: {
    jwt: async ({ token, user, trigger, session }) => {
      if (user) {
        if (!user.name) {
          await connectToDatabase();
          await User.findByIdAndUpdate(user.id, {
            name: user.name || user.email!.split("@")[0],
            role: "user",
          });
        }
        token.name = user.name || user.email!.split("@")[0];
        token.role = (user as { role: string }).role;
      }

      if (session?.user?.name && trigger === "update") {
        token.name = session.user.name;
      }
      return token;
    },
    // Runs when a session is created or updated.
    session: async ({ session, user, trigger, token }) => {
      // Syncs session.user with token values
      session.user.id = token.sub as string;
      session.user.role = token.role as string;
      session.user.name = token.name;
      // When the session updates (trigger: "update"), it updates the session name.
      if (trigger === "update") {
        session.user.name = user.name;
      }
      return session;
    },
  },
});
