let _handlers: any = null
let _auth: any = null

export async function getHandlers() {
  if (_handlers) return _handlers
  const NextAuth = (await import("next-auth")).default
  const Credentials = (await import("next-auth/providers/credentials")).default
  const { compare } = await import("bcryptjs")
  const { getDb } = await import("@/lib/db")

  _handlers = NextAuth({
    providers: [
      Credentials({
        name: "credentials",
        credentials: {
          email: { label: "Email", type: "email" },
          password: { label: "Senha", type: "password" },
        },
        async authorize(credentials) {
          if (!credentials?.email || !credentials?.password) return null

          const db = await getDb()
          const user = await db.user.findUnique({
            where: { email: credentials.email as string },
          })

          if (!user || !user.password) return null

          const isValid = await compare(credentials.password as string, user.password)
          if (!isValid) return null

          const store = await db.store.findUnique({ where: { ownerId: user.id } })

          return {
            id: user.id,
            email: user.email,
            name: user.name,
            image: user.image,
            role: user.role,
            storeId: store?.id,
          }
        },
      }),
    ],
    callbacks: {
      async jwt({ token, user }: { token: any; user?: any }) {
        if (user) {
          token.role = user.role
          token.storeId = user.storeId
        }
        return token
      },
      async session({ session, token }: { session: any; token: any }) {
        if (session.user) {
          session.user.role = token.role
          session.user.storeId = token.storeId
        }
        return session
      },
    },
    pages: { signIn: "/auth/login" },
    session: { strategy: "jwt" as const },
  })

  return _handlers
}

export async function auth() {
  if (_auth !== null) return _auth()
  try {
    const handlers = await getHandlers()
    _auth = handlers.auth
    return _auth()
  } catch {
    return null
  }
}
