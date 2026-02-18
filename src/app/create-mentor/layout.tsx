import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function CreateMentorLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white p-6">
            <div className="max-w-4xl mx-auto">
                <header className="mb-8">
                    <Link
                        href="/"
                        className="inline-flex items-center text-gray-400 hover:text-white transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Voltar para o Início
                    </Link>
                </header>
                <main>{children}</main>
            </div>
        </div>
    );
}
