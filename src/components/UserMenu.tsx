'use client';

import { Button } from "@/components/ui/button";
import { User, LogIn, Copy, LogOut } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useEffect, useState } from "react";
import { getCurrentUser, signOutCommand, UserProfile } from "@/services/auth-service";
import { toast } from "sonner";
import { AuthDialog } from "./AuthDialog";

export function UserMenu() {
    const [user, setUser] = useState<UserProfile | null>(null);
    const [showAuth, setShowAuth] = useState(false);

    useEffect(() => {
        const loadUser = async () => {
            const u = await getCurrentUser();
            setUser(u);
        };
        loadUser();
    }, []);

    const copyId = () => {
        if (user) {
            navigator.clipboard.writeText(user.id);
            toast.success("ID de acesso copiado!");
        }
    };

    const handleLogout = async () => {
        if (confirm("Tem certeza que deseja sair?")) {
            await signOutCommand();
        }
    };

    if (!user) {
        return (
            <>
                <Button variant="outline" className="gap-2" onClick={() => setShowAuth(true)}>
                    <LogIn className="w-4 h-4" />
                    Entrar
                </Button>
                <AuthDialog open={showAuth} onOpenChange={setShowAuth} />
            </>
        );
    }

    const isGuest = user.name === 'Visitante';

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="rounded-full w-10 h-10 p-0 bg-indigo-100 ring-2 ring-indigo-200">
                        <User className="w-5 h-5 text-indigo-700" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel>
                        <div className="flex flex-col space-y-1">
                            <p className="text-sm font-medium leading-none">{user.name}</p>
                            <p className="text-xs leading-none text-muted-foreground truncate">{user.email}</p>
                        </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />

                    {isGuest && (
                        <DropdownMenuItem onClick={() => setShowAuth(true)} className="text-blue-600 font-medium">
                            <LogIn className="mr-2 h-4 w-4" />
                            <span>Criar Conta / Entrar</span>
                        </DropdownMenuItem>
                    )}

                    <DropdownMenuItem onClick={copyId}>
                        <Copy className="mr-2 h-4 w-4" />
                        <span>Copiar ID</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout} className="text-red-600 focus:bg-red-50">
                        <LogOut className="mr-2 h-4 w-4" />
                        <span>Sair</span>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
            <AuthDialog open={showAuth} onOpenChange={setShowAuth} />
        </>
    );
}
