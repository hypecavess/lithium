import NextAuth, { DefaultSession } from "next-auth"
import Discord, { DiscordProfile } from "next-auth/providers/discord"

declare module "next-auth" {
  interface Session {
    accessToken?: string;
    user: {
      id?: string;
      username?: string;
    } & DefaultSession["user"]
  }

  interface User {
    username?: string;
  }
}

declare module "@auth/core/jwt" {
  interface JWT {
    id?: string;
    username?: string;
    accessToken?: string;
  }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Discord({
      authorization: "https://discord.com/api/oauth2/authorize?scope=identify+email+guilds",
      profile(profile: DiscordProfile) {
        if (profile.avatar === null) {
          const defaultAvatarIndex = Math.floor(Math.random() * 6);
          profile.image_url = `https://cdn.discordapp.com/embed/avatars/${defaultAvatarIndex}.png`
        } else {
          const format = profile.avatar.startsWith("a_") ? "gif" : "png"
          profile.image_url = `https://cdn.discordapp.com/avatars/${profile.id}/${profile.avatar}.${format}`
        }
        return {
          id: profile.id,
          name: profile.global_name || profile.username,
          email: profile.email,
          image: profile.image_url,
          username: profile.username,
        }
      }
    })
  ],
  session: { strategy: "jwt" },
  callbacks: {
    jwt({ token, user, account }) {
      if (user) {
        token.id = user.id;
        token.username = user.username;
      }
      if (account) {
        token.accessToken = account.access_token;
      }
      return token;
    },
    session({ session, token }) {
      if (session.user && token.id) {
        session.user.id = token.id;
        session.user.username = token.username;
        session.accessToken = token.accessToken;
      }
      return session;
    },
  },
})
