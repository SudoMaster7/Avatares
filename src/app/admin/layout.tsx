import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Admin | Avatares Educacionais',
    description: 'Painel de Administração',
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
