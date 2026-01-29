import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';

const handler = NextAuth({
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID || '',
            clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
        }),
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                action: { label: "Action", type: "text" },
                phone: { label: "Phone", type: "text" }
            },
            async authorize(credentials, req) {
                if (credentials?.action === 'guest') {
                    return {
                        id: "guest_" + Date.now(),
                        name: "Guest User",
                        email: "guest@brahmi.app",
                        image: null
                    };
                }

                if (credentials?.action === 'mobile') {
                    // In a real app, you would verify OTP here
                    // For now, we allow any login
                    return {
                        id: "mobile_" + credentials.phone,
                        name: "Mobile User",
                        email: `${credentials.phone}@mobile.brahmi.app`,
                        image: null
                    };
                }

                return null;
            }
        })
    ],
    session: {
        strategy: 'jwt',
    },
    pages: {
        signIn: '/login',
    },

});

export { handler as GET, handler as POST };
