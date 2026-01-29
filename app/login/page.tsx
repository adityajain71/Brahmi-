import { SignIn } from "@clerk/nextjs";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Sign In | Brahmi",
    description: "Access your Brahmi learning journey.",
};

export default function LoginPage() {
    return (
        <div className="flex h-[calc(100vh-72px)] w-full items-center justify-center bg-[#1C1C1C]">
            <SignIn routing="hash" />
        </div>
    );
}
