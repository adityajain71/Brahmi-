import { SignIn1 } from "@/components/ui/modern-stunning-sign-in"
import { Metadata } from "next"

export const metadata: Metadata = {
    title: "Sign In | Brahmi",
    description: "Access your Brahmi learning journey.",
}

export default function LoginPage() {
    return (
        <SignIn1 />
    )
}
