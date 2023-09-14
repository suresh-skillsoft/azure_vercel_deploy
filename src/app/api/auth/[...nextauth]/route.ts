import NextAuth, { AuthOptions } from "next-auth";
import AzureADProvider from "next-auth/providers/azure-ad";

export const authOptions: AuthOptions = {
  // Configure one or more authentication providers
  session: { strategy: "jwt" },
  providers: [
    AzureADProvider({
      clientId: process.env.AZURE_AD_CLIENT_ID!,
      clientSecret: process.env.AZURE_AD_CLIENT_SECRET!,
      tenantId: process.env.AZURE_AD_TENANT_ID!,
      authorization: { params: { scope: "openid profile user.Read email" } },
    }),
  ],
  callbacks: {
    // async jwt({ token, account }) {
    //   // IMPORTANT: Persist the access_token to the token right after sign in
    //   if (account) {
    //     token.idToken = account.id_token;
    //   }
    //   return token;
    // },
    async signIn({ user, account, profile, email, credentials }) {
      console.log({user, account, profile, email, credentials}, "Sign In")
      return true
    },
    async redirect({ url, baseUrl }) {
      console.log({url, baseUrl},"redirect")
      return baseUrl
    },
    async session({ session, token, user }) {
      console.log({session, token, user},"Session")
      session.user = token;
      return session
    },
    async jwt({ token, user, account, profile, isNewUser }) {
      console.log({token, user, account, profile, isNewUser}, "JWt")
      return {...token,...account}
    }
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
