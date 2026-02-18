'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { AVATARS } from '@/lib/avatars';
import {
    Shield, Users, BookOpen, TrendingUp, LogOut, GraduationCap,
    Star, Lock, Activity, ChevronRight, AlertTriangle, CheckCircle,
    RefreshCw, Tag, BarChart2, Plus, Trash2, UserCheck, UserX,
    Crown, Edit2, X, Save, Eye, EyeOff, Ticket, MessageSquare,
    ArrowUpRight, ArrowDownRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';

// ─── Types ───────────────────────────────────────────────────────────────────
interface AdminUser {
    id: string; email: string; name: string; plan: string;
    role: string; created_at: string; last_sign_in: string; confirmed: boolean;
}
interface Coupon {
    id: string; code: string; discount_pct: number; max_uses: number | null;
    uses_count: number; expires_at: string | null; active: boolean;
}
interface Metrics {
    users: { total: number; pro: number; free: number; newLast30d: number; newLast7d: number; activeLast7d: number; conversionRate: number };
    charts: { signupsByDay: { date: string; count: number }[] };
    conversations: { totalLast30d: number };
    coupons: { totalUses: number; activeCoupons: number };
}

type Tab = 'overview' | 'users' | 'coupons' | 'analytics' | 'avatars';

// ─── Helpers ─────────────────────────────────────────────────────────────────
function Badge({ children, color }: { children: React.ReactNode; color: string }) {
    return (
        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${color}`}>
            {children}
        </span>
    );
}

// ─── Main Component ──────────────────────────────────────────────────────────
export default function AdminPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [authorized, setAuthorized] = useState(false);
    const [adminEmail, setAdminEmail] = useState('');
    const [token, setToken] = useState('');
    const [activeTab, setActiveTab] = useState<Tab>('overview');
    const [refreshing, setRefreshing] = useState(false);

    // Data
    const [users, setUsers] = useState<AdminUser[]>([]);
    const [coupons, setCoupons] = useState<Coupon[]>([]);
    const [metrics, setMetrics] = useState<Metrics | null>(null);

    // UI state
    const [userSearch, setUserSearch] = useState('');
    const [editUser, setEditUser] = useState<AdminUser | null>(null);
    const [editPlan, setEditPlan] = useState('free');
    const [editRole, setEditRole] = useState('');
    const [savingUser, setSavingUser] = useState(false);
    const [deletingId, setDeletingId] = useState<string | null>(null);

    // Create user
    const [showCreateUser, setShowCreateUser] = useState(false);
    const [newEmail, setNewEmail] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [newName, setNewName] = useState('');
    const [newPlan, setNewPlan] = useState('free');
    const [newRole, setNewRole] = useState('');
    const [showPw, setShowPw] = useState(false);
    const [creatingUser, setCreatingUser] = useState(false);

    // Coupon form
    const [showCouponForm, setShowCouponForm] = useState(false);
    const [couponCode, setCouponCode] = useState('');
    const [couponDiscount, setCouponDiscount] = useState(20);
    const [couponMaxUses, setCouponMaxUses] = useState('');
    const [couponExpires, setCouponExpires] = useState('');
    const [creatingCoupon, setCreatingCoupon] = useState(false);

    // ── Auth check ──────────────────────────────────────────────────────────
    useEffect(() => { checkAdmin(); }, []);

    const checkAdmin = async () => {
        setLoading(true);
        try {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session?.user || session.user.user_metadata?.role !== 'admin') {
                router.replace('/'); return;
            }
            setAuthorized(true);
            setAdminEmail(session.user.email ?? '');
            setToken(session.access_token);
            await Promise.all([fetchUsers(session.access_token), fetchCoupons(session.access_token), fetchMetrics(session.access_token)]);
        } finally { setLoading(false); }
    };

    const authHeaders = useCallback((t: string) => ({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${t}`,
    }), []);

    // ── Data fetching ────────────────────────────────────────────────────────
    const fetchUsers = async (t = token) => {
        const res = await fetch('/api/admin/users', { headers: authHeaders(t) });
        if (res.ok) { const d = await res.json(); setUsers(d.users ?? []); }
    };
    const fetchCoupons = async (t = token) => {
        const res = await fetch('/api/admin/coupons', { headers: authHeaders(t) });
        if (res.ok) { const d = await res.json(); setCoupons(d.coupons ?? []); }
    };
    const fetchMetrics = async (t = token) => {
        const res = await fetch('/api/admin/metrics', { headers: authHeaders(t) });
        if (res.ok) { const d = await res.json(); setMetrics(d); }
    };

    const refresh = async () => {
        setRefreshing(true);
        await Promise.all([fetchUsers(), fetchCoupons(), fetchMetrics()]);
        setRefreshing(false);
    };

    // ── User actions ─────────────────────────────────────────────────────────
    const saveUser = async () => {
        if (!editUser) return;
        setSavingUser(true);
        await fetch('/api/admin/users', {
            method: 'PATCH',
            headers: authHeaders(token),
            body: JSON.stringify({ userId: editUser.id, updates: { plan: editPlan, role: editRole, name: editUser.name } }),
        });
        await fetchUsers();
        setEditUser(null);
        setSavingUser(false);
    };

    const deleteUser = async (id: string) => {
        if (!confirm('Tem certeza que quer excluir este usuário?')) return;
        setDeletingId(id);
        await fetch('/api/admin/users', {
            method: 'DELETE',
            headers: authHeaders(token),
            body: JSON.stringify({ userId: id }),
        });
        setUsers(prev => prev.filter(u => u.id !== id));
        setDeletingId(null);
    };

    const createUser = async () => {
        if (!newEmail || !newPassword) return;
        setCreatingUser(true);
        const res = await fetch('/api/admin/users', {
            method: 'POST',
            headers: authHeaders(token),
            body: JSON.stringify({ email: newEmail, password: newPassword, name: newName, plan: newPlan, role: newRole }),
        });
        if (res.ok) {
            await fetchUsers();
            setShowCreateUser(false);
            setNewEmail(''); setNewPassword(''); setNewName(''); setNewPlan('free'); setNewRole('');
        }
        setCreatingUser(false);
    };

    // ── Coupon actions ───────────────────────────────────────────────────────
    const createCoupon = async () => {
        if (!couponCode || !couponDiscount) return;
        setCreatingCoupon(true);
        const res = await fetch('/api/admin/coupons', {
            method: 'POST',
            headers: authHeaders(token),
            body: JSON.stringify({
                code: couponCode,
                discount_pct: couponDiscount,
                max_uses: couponMaxUses ? parseInt(couponMaxUses) : null,
                expires_at: couponExpires || null,
            }),
        });
        if (res.ok) {
            await fetchCoupons();
            setShowCouponForm(false);
            setCouponCode(''); setCouponDiscount(20); setCouponMaxUses(''); setCouponExpires('');
        }
        setCreatingCoupon(false);
    };

    const deleteCoupon = async (id: string) => {
        if (!confirm('Excluir este cupom?')) return;
        await fetch('/api/admin/coupons', {
            method: 'DELETE',
            headers: authHeaders(token),
            body: JSON.stringify({ id }),
        });
        setCoupons(prev => prev.filter(c => c.id !== id));
    };

    const handleLogout = async () => { await supabase.auth.signOut(); router.replace('/'); };

    // ── Render guards ────────────────────────────────────────────────────────
    if (loading) {
        return (
            <div className="min-h-screen bg-slate-950 flex items-center justify-center">
                <div className="text-white text-center">
                    <Shield className="w-12 h-12 mx-auto mb-4 animate-pulse text-indigo-400" />
                    <p className="text-lg font-semibold">Verificando permissões...</p>
                </div>
            </div>
        );
    }
    if (!authorized) return null;

    const filteredUsers = users.filter(u =>
        u.email.toLowerCase().includes(userSearch.toLowerCase()) ||
        u.name.toLowerCase().includes(userSearch.toLowerCase())
    );

    const navItems: { id: Tab; label: string; icon: React.ElementType }[] = [
        { id: 'overview', label: 'Visão Geral', icon: TrendingUp },
        { id: 'analytics', label: 'Métricas', icon: BarChart2 },
        { id: 'users', label: 'Usuários', icon: Users },
        { id: 'coupons', label: 'Cupons', icon: Tag },
        { id: 'avatars', label: 'Avatares', icon: BookOpen },
    ];

    return (
        <div className="min-h-screen bg-slate-950 text-white flex">
            {/* ── Sidebar ─────────────────────────────────────────────── */}
            <aside className="fixed inset-y-0 left-0 w-64 bg-slate-900 border-r border-slate-800 flex flex-col z-30">
                <div className="p-6 border-b border-slate-800">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                            <Shield className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <p className="font-bold text-white text-sm">Painel Admin</p>
                            <p className="text-xs text-slate-400 truncate max-w-[140px]">{adminEmail}</p>
                        </div>
                    </div>
                </div>
                <nav className="flex-1 p-4 space-y-1">
                    {navItems.map(({ id, label, icon: Icon }) => (
                        <button
                            key={id}
                            onClick={() => setActiveTab(id)}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all
                                ${activeTab === id ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
                        >
                            <Icon className="w-4 h-4" />
                            {label}
                            {activeTab === id && <ChevronRight className="w-4 h-4 ml-auto" />}
                        </button>
                    ))}
                </nav>
                <div className="p-4 border-t border-slate-800 space-y-2">
                    <a href="/" className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-slate-400 hover:bg-slate-800 hover:text-white text-sm transition-all">
                        <GraduationCap className="w-4 h-4" /> Ir para o App
                    </a>
                    <button onClick={handleLogout} className="w-full flex items-center gap-2 px-4 py-2.5 rounded-xl text-red-400 hover:bg-red-900/30 text-sm transition-all">
                        <LogOut className="w-4 h-4" /> Sair
                    </button>
                </div>
            </aside>

            {/* ── Main ────────────────────────────────────────────────── */}
            <div className="ml-64 flex-1 p-8">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-2xl font-black text-white">
                            {navItems.find(n => n.id === activeTab)?.label}
                        </h1>
                        <p className="text-slate-400 text-sm mt-1">Avatares Educacionais — Admin</p>
                    </div>
                    <Button variant="outline" size="sm" className="border-slate-700 text-slate-300 hover:bg-slate-800 gap-2" onClick={refresh} disabled={refreshing}>
                        <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} /> Atualizar
                    </Button>
                </div>

                {/* ── OVERVIEW ──────────────────────────────────────── */}
                {activeTab === 'overview' && (
                    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
                        <div className="grid grid-cols-2 xl:grid-cols-4 gap-5 mb-8">
                            {[
                                { label: 'Total Usuários', value: metrics?.users.total ?? '—', icon: Users, color: 'from-blue-500 to-blue-700', bg: 'from-blue-900/30 to-blue-900/10', trend: `+${metrics?.users.newLast7d ?? 0} esta semana` },
                                { label: 'Usuários Pro', value: metrics?.users.pro ?? '—', icon: Crown, color: 'from-yellow-400 to-orange-500', bg: 'from-yellow-900/30 to-orange-900/10', trend: `${metrics?.users.conversionRate ?? 0}% conversão` },
                                { label: 'Conversas (30d)', value: metrics?.conversations.totalLast30d ?? '—', icon: MessageSquare, color: 'from-green-500 to-emerald-600', bg: 'from-green-900/30 to-emerald-900/10', trend: 'último mês' },
                                { label: 'Cupons Usados', value: metrics?.coupons.totalUses ?? '—', icon: Ticket, color: 'from-purple-500 to-purple-700', bg: 'from-purple-900/30 to-purple-900/10', trend: `${metrics?.coupons.activeCoupons ?? 0} ativos` },
                            ].map((c, i) => (
                                <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
                                    className={`bg-gradient-to-br ${c.bg} rounded-2xl p-6 border border-slate-800`}>
                                    <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${c.color} flex items-center justify-center mb-4`}>
                                        <c.icon className="w-5 h-5 text-white" />
                                    </div>
                                    <p className="text-3xl font-black text-white mb-1">{c.value}</p>
                                    <p className="text-sm text-slate-400 mb-1">{c.label}</p>
                                    <p className="text-xs text-slate-500">{c.trend}</p>
                                </motion.div>
                            ))}
                        </div>

                        {/* System status + quick actions */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6">
                                <div className="flex items-center gap-2 mb-4">
                                    <Activity className="w-5 h-5 text-indigo-400" />
                                    <h2 className="text-lg font-bold">Status do Sistema</h2>
                                </div>
                                <div className="space-y-2">
                                    {['API Chat (Groq)', 'TTS Lemonfox (Free)', 'TTS ElevenLabs (Pro)', 'Supabase Auth', 'Stripe Payments'].map(svc => (
                                        <div key={svc} className="flex items-center justify-between py-2 border-b border-slate-800 last:border-0">
                                            <span className="text-sm text-slate-300">{svc}</span>
                                            <span className="flex items-center gap-1.5 text-xs font-semibold text-green-400">
                                                <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" /> online
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6">
                                <div className="flex items-center gap-2 mb-4">
                                    <TrendingUp className="w-5 h-5 text-indigo-400" />
                                    <h2 className="text-lg font-bold">Ações Rápidas</h2>
                                </div>
                                <div className="space-y-2">
                                    {[
                                        { label: 'Criar novo usuário', icon: Plus, action: () => { setActiveTab('users'); setShowCreateUser(true); } },
                                        { label: 'Criar cupom de desconto', icon: Tag, action: () => { setActiveTab('coupons'); setShowCouponForm(true); } },
                                        { label: 'Ver métricas detalhadas', icon: BarChart2, action: () => setActiveTab('analytics') },
                                        { label: 'Gerenciar avatares', icon: BookOpen, action: () => setActiveTab('avatars') },
                                    ].map(({ label, icon: Icon, action }) => (
                                        <button key={label} onClick={action}
                                            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-sm text-slate-300 hover:text-white transition-all text-left">
                                            <Icon className="w-4 h-4 text-indigo-400" /> {label}
                                            <ArrowUpRight className="w-3.5 h-3.5 ml-auto text-slate-500" />
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* ── ANALYTICS ─────────────────────────────────────── */}
                {activeTab === 'analytics' && (
                    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">

                        {/* KPI row */}
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
                            {[
                                { label: 'Taxa de Conversão', value: `${metrics?.users.conversionRate ?? 0}%`, sub: 'free → pro', up: true },
                                { label: 'Novos (7 dias)', value: metrics?.users.newLast7d ?? 0, sub: 'novos cadastros', up: true },
                                { label: 'Ativos (7 dias)', value: metrics?.users.activeLast7d ?? 0, sub: 'fizeram login', up: true },
                                { label: 'Usuários Free', value: metrics?.users.free ?? 0, sub: 'sem assinatura', up: false },
                            ].map((k, i) => (
                                <div key={i} className="bg-slate-900 rounded-2xl border border-slate-800 p-5">
                                    <p className="text-2xl font-black text-white">{k.value}</p>
                                    <p className="text-sm text-slate-400 mt-1">{k.label}</p>
                                    <p className="text-xs mt-1 flex items-center gap-1 text-slate-500">
                                        {k.up ? <ArrowUpRight className="w-3.5 h-3.5 text-green-400" /> : <ArrowDownRight className="w-3.5 h-3.5 text-yellow-400" />}
                                        {k.sub}
                                    </p>
                                </div>
                            ))}
                        </div>

                        {/* Signups chart (bar) */}
                        <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6">
                            <h2 className="text-lg font-bold mb-4">Cadastros — últimos 30 dias</h2>
                            {metrics?.charts.signupsByDay ? (
                                <div className="flex items-end gap-1 h-28 overflow-x-auto pb-2">
                                    {metrics.charts.signupsByDay.map(({ date, count }) => {
                                        const max = Math.max(...metrics.charts.signupsByDay.map(d => d.count), 1);
                                        const pct = (count / max) * 100;
                                        return (
                                            <div key={date} className="flex flex-col items-center gap-1 flex-shrink-0 w-5 group relative">
                                                <div
                                                    className="w-4 rounded-t bg-indigo-500 hover:bg-indigo-400 transition-all"
                                                    style={{ height: `${Math.max(pct, 3)}%` }}
                                                />
                                                <span className="absolute -top-6 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-xs px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 whitespace-nowrap z-10">
                                                    {count} · {date.slice(5)}
                                                </span>
                                            </div>
                                        );
                                    })}
                                </div>
                            ) : (
                                <p className="text-slate-500 text-sm">Carregando dados...</p>
                            )}
                        </div>

                        {/* Conversion funnel */}
                        <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6">
                            <h2 className="text-lg font-bold mb-4">Funil de Conversão</h2>
                            <div className="space-y-3">
                                {[
                                    { label: 'Total Cadastros', value: metrics?.users.total ?? 0, pct: 100, color: 'bg-blue-500' },
                                    { label: 'Ativos (últimos 7 dias)', value: metrics?.users.activeLast7d ?? 0, pct: metrics && metrics.users.total > 0 ? Math.round((metrics.users.activeLast7d / metrics.users.total) * 100) : 0, color: 'bg-indigo-500' },
                                    { label: 'Assinantes Pro', value: metrics?.users.pro ?? 0, pct: metrics ? Math.round(metrics.users.conversionRate) : 0, color: 'bg-yellow-500' },
                                ].map((f, i) => (
                                    <div key={i}>
                                        <div className="flex justify-between text-sm mb-1">
                                            <span className="text-slate-300">{f.label}</span>
                                            <span className="font-semibold text-white">{f.value} <span className="text-slate-400 font-normal">({f.pct}%)</span></span>
                                        </div>
                                        <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                                            <div className={`h-full ${f.color} rounded-full transition-all`} style={{ width: `${f.pct}%` }} />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Coupon performance */}
                        <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6">
                            <h2 className="text-lg font-bold mb-4">Performance de Cupons</h2>
                            {coupons.length === 0 ? (
                                <p className="text-slate-500 text-sm">Nenhum cupom criado ainda.</p>
                            ) : (
                                <table className="w-full text-sm">
                                    <thead className="text-slate-400 text-xs uppercase">
                                        <tr>
                                            <th className="text-left pb-3">Código</th>
                                            <th className="text-left pb-3">Desconto</th>
                                            <th className="text-left pb-3">Usos</th>
                                            <th className="text-left pb-3">Limite</th>
                                            <th className="text-left pb-3">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-800">
                                        {coupons.map(c => (
                                            <tr key={c.id} className="text-slate-300">
                                                <td className="py-2.5 font-mono font-bold text-white">{c.code}</td>
                                                <td className="py-2.5 text-green-400">{c.discount_pct}% off</td>
                                                <td className="py-2.5">{c.uses_count}</td>
                                                <td className="py-2.5">{c.max_uses ?? '∞'}</td>
                                                <td className="py-2.5">
                                                    <Badge color={c.active ? 'bg-green-900/40 text-green-400 border-green-700' : 'bg-slate-800 text-slate-400 border-slate-700'}>
                                                        {c.active ? <CheckCircle className="w-3 h-3" /> : <X className="w-3 h-3" />}
                                                        {c.active ? 'ativo' : 'inativo'}
                                                    </Badge>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    </motion.div>
                )}

                {/* ── USERS ─────────────────────────────────────────── */}
                {activeTab === 'users' && (
                    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                        {/* Toolbar */}
                        <div className="flex flex-wrap gap-3 items-center">
                            <input
                                type="text"
                                placeholder="Buscar por email ou nome..."
                                value={userSearch}
                                onChange={e => setUserSearch(e.target.value)}
                                className="flex-1 min-w-[200px] bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                            <Button onClick={() => setShowCreateUser(true)} className="bg-indigo-600 hover:bg-indigo-700 gap-2 text-sm">
                                <Plus className="w-4 h-4" /> Novo Usuário
                            </Button>
                        </div>

                        {/* Create user modal */}
                        <AnimatePresence>
                            {showCreateUser && (
                                <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                                    className="bg-slate-800 rounded-2xl border border-indigo-500/30 p-6">
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className="font-bold text-white">Criar Novo Usuário</h3>
                                        <button onClick={() => setShowCreateUser(false)} className="text-slate-400 hover:text-white"><X className="w-5 h-5" /></button>
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                            <label className="text-xs text-slate-400 mb-1 block">Email *</label>
                                            <input type="email" value={newEmail} onChange={e => setNewEmail(e.target.value)} placeholder="usuario@email.com"
                                                className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                                        </div>
                                        <div>
                                            <label className="text-xs text-slate-400 mb-1 block">Senha *</label>
                                            <div className="relative">
                                                <input type={showPw ? 'text' : 'password'} value={newPassword} onChange={e => setNewPassword(e.target.value)} placeholder="Mínimo 6 caracteres"
                                                    className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 pr-10 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                                                <button onClick={() => setShowPw(p => !p)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
                                                    {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                                </button>
                                            </div>
                                        </div>
                                        <div>
                                            <label className="text-xs text-slate-400 mb-1 block">Nome</label>
                                            <input type="text" value={newName} onChange={e => setNewName(e.target.value)} placeholder="Nome do usuário"
                                                className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                                        </div>
                                        <div>
                                            <label className="text-xs text-slate-400 mb-1 block">Plano</label>
                                            <select value={newPlan} onChange={e => setNewPlan(e.target.value)}
                                                className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500">
                                                <option value="free">Free</option>
                                                <option value="pro">Pro</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="text-xs text-slate-400 mb-1 block">Role</label>
                                            <select value={newRole} onChange={e => setNewRole(e.target.value)}
                                                className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500">
                                                <option value="">Usuário comum</option>
                                                <option value="admin">Admin</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="flex gap-3 mt-4">
                                        <Button onClick={createUser} disabled={creatingUser || !newEmail || !newPassword} className="bg-indigo-600 hover:bg-indigo-700 gap-2">
                                            {creatingUser ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                                            Criar Usuário
                                        </Button>
                                        <Button variant="outline" onClick={() => setShowCreateUser(false)} className="border-slate-600 text-slate-300">Cancelar</Button>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Edit user modal */}
                        <AnimatePresence>
                            {editUser && (
                                <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                                    className="bg-slate-800 rounded-2xl border border-yellow-500/30 p-6">
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className="font-bold text-white">Editar: <span className="text-indigo-400">{editUser.email}</span></h3>
                                        <button onClick={() => setEditUser(null)} className="text-slate-400 hover:text-white"><X className="w-5 h-5" /></button>
                                    </div>
                                    <div className="flex flex-wrap gap-4">
                                        <div>
                                            <label className="text-xs text-slate-400 mb-1 block">Plano</label>
                                            <select value={editPlan} onChange={e => setEditPlan(e.target.value)}
                                                className="bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500">
                                                <option value="free">Free</option>
                                                <option value="pro">Pro</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="text-xs text-slate-400 mb-1 block">Role</label>
                                            <select value={editRole} onChange={e => setEditRole(e.target.value)}
                                                className="bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500">
                                                <option value="">Usuário comum</option>
                                                <option value="admin">Admin</option>
                                            </select>
                                        </div>
                                        <div className="flex items-end gap-2">
                                            <Button onClick={saveUser} disabled={savingUser} className="bg-green-600 hover:bg-green-700 gap-2">
                                                {savingUser ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} Salvar
                                            </Button>
                                            <Button variant="outline" onClick={() => setEditUser(null)} className="border-slate-600 text-slate-300">Cancelar</Button>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Users table */}
                        <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden">
                            <div className="p-5 border-b border-slate-800 flex items-center justify-between">
                                <h2 className="font-bold">Lista de Usuários</h2>
                                <span className="text-xs text-slate-400 bg-slate-800 rounded-full px-3 py-1">{filteredUsers.length} encontrados</span>
                            </div>
                            {filteredUsers.length === 0 ? (
                                <div className="p-12 text-center">
                                    <AlertTriangle className="w-10 h-10 text-slate-600 mx-auto mb-3" />
                                    <p className="text-slate-400 text-sm">Nenhum usuário encontrado.</p>
                                </div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="w-full text-sm">
                                        <thead className="bg-slate-800 text-slate-400 text-xs uppercase tracking-wider">
                                            <tr>
                                                <th className="text-left px-6 py-3">Usuário</th>
                                                <th className="text-left px-6 py-3">Plano</th>
                                                <th className="text-left px-6 py-3">Role</th>
                                                <th className="text-left px-6 py-3">Cadastro</th>
                                                <th className="text-left px-6 py-3">Último login</th>
                                                <th className="text-left px-6 py-3">Ações</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-800">
                                            {filteredUsers.map(u => (
                                                <tr key={u.id} className="hover:bg-slate-800/50 transition-colors">
                                                    <td className="px-6 py-4">
                                                        <p className="font-medium text-white">{u.name || 'Sem nome'}</p>
                                                        <p className="text-xs text-slate-400 truncate max-w-[180px]">{u.email}</p>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <Badge color={u.plan === 'pro' ? 'bg-yellow-900/40 text-yellow-400 border-yellow-700' : 'bg-slate-800 text-slate-400 border-slate-700'}>
                                                            {u.plan === 'pro' ? <Star className="w-3 h-3" /> : null}
                                                            {u.plan || 'free'}
                                                        </Badge>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        {u.role === 'admin' && (
                                                            <Badge color="bg-indigo-900/40 text-indigo-400 border-indigo-700">
                                                                <Shield className="w-3 h-3" /> admin
                                                            </Badge>
                                                        )}
                                                    </td>
                                                    <td className="px-6 py-4 text-slate-500 text-xs">{new Date(u.created_at).toLocaleDateString('pt-BR')}</td>
                                                    <td className="px-6 py-4 text-slate-500 text-xs">{u.last_sign_in ? new Date(u.last_sign_in).toLocaleDateString('pt-BR') : '—'}</td>
                                                    <td className="px-6 py-4">
                                                        <div className="flex gap-2">
                                                            <button onClick={() => { setEditUser(u); setEditPlan(u.plan || 'free'); setEditRole(u.role || ''); }}
                                                                className="p-1.5 rounded-lg bg-slate-700 hover:bg-indigo-600 text-slate-300 hover:text-white transition-all" title="Editar">
                                                                <Edit2 className="w-3.5 h-3.5" />
                                                            </button>
                                                            {u.plan !== 'pro' ? (
                                                                <button onClick={() => fetch('/api/admin/users', { method: 'PATCH', headers: authHeaders(token), body: JSON.stringify({ userId: u.id, updates: { plan: 'pro', name: u.name, role: u.role } }) }).then(() => fetchUsers())}
                                                                    className="p-1.5 rounded-lg bg-slate-700 hover:bg-yellow-600 text-slate-300 hover:text-white transition-all" title="Promover para Pro">
                                                                    <UserCheck className="w-3.5 h-3.5" />
                                                                </button>
                                                            ) : (
                                                                <button onClick={() => fetch('/api/admin/users', { method: 'PATCH', headers: authHeaders(token), body: JSON.stringify({ userId: u.id, updates: { plan: 'free', name: u.name, role: u.role } }) }).then(() => fetchUsers())}
                                                                    className="p-1.5 rounded-lg bg-slate-700 hover:bg-slate-500 text-slate-300 hover:text-white transition-all" title="Rebaixar para Free">
                                                                    <UserX className="w-3.5 h-3.5" />
                                                                </button>
                                                            )}
                                                            <button onClick={() => deleteUser(u.id)} disabled={deletingId === u.id}
                                                                className="p-1.5 rounded-lg bg-slate-700 hover:bg-red-600 text-slate-300 hover:text-white transition-all" title="Excluir">
                                                                {deletingId === u.id ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}

                {/* ── COUPONS ───────────────────────────────────────── */}
                {activeTab === 'coupons' && (
                    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                        <div className="flex justify-between items-center">
                            <p className="text-slate-400 text-sm">{coupons.length} cupons cadastrados</p>
                            <Button onClick={() => setShowCouponForm(true)} className="bg-indigo-600 hover:bg-indigo-700 gap-2 text-sm">
                                <Plus className="w-4 h-4" /> Novo Cupom
                            </Button>
                        </div>

                        {/* Coupon form */}
                        <AnimatePresence>
                            {showCouponForm && (
                                <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                                    className="bg-slate-800 rounded-2xl border border-indigo-500/30 p-6">
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className="font-bold text-white">Criar Cupom de Desconto</h3>
                                        <button onClick={() => setShowCouponForm(false)} className="text-slate-400 hover:text-white"><X className="w-5 h-5" /></button>
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                            <label className="text-xs text-slate-400 mb-1 block">Código do Cupom *</label>
                                            <input type="text" value={couponCode} onChange={e => setCouponCode(e.target.value.toUpperCase())} placeholder="PROMO20"
                                                className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-sm font-mono text-white focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                                        </div>
                                        <div>
                                            <label className="text-xs text-slate-400 mb-1 block">Desconto (%) *</label>
                                            <input type="number" min="1" max="100" value={couponDiscount} onChange={e => setCouponDiscount(parseInt(e.target.value))}
                                                className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                                        </div>
                                        <div>
                                            <label className="text-xs text-slate-400 mb-1 block">Usos máximos (vazio = ilimitado)</label>
                                            <input type="number" min="1" value={couponMaxUses} onChange={e => setCouponMaxUses(e.target.value)} placeholder="100"
                                                className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                                        </div>
                                        <div>
                                            <label className="text-xs text-slate-400 mb-1 block">Expira em (vazio = nunca)</label>
                                            <input type="date" value={couponExpires} onChange={e => setCouponExpires(e.target.value)}
                                                className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                                        </div>
                                    </div>

                                    {/* Preview */}
                                    {couponCode && (
                                        <div className="mt-4 p-3 bg-slate-900 rounded-xl border border-slate-700 flex items-center gap-3">
                                            <Ticket className="w-5 h-5 text-green-400" />
                                            <div>
                                                <p className="font-mono font-bold text-white">{couponCode}</p>
                                                <p className="text-xs text-slate-400">{couponDiscount}% de desconto · {couponMaxUses ? `${couponMaxUses} usos` : 'usos ilimitados'} · {couponExpires ? `expira ${couponExpires}` : 'sem validade'}</p>
                                            </div>
                                        </div>
                                    )}

                                    <div className="flex gap-3 mt-4">
                                        <Button onClick={createCoupon} disabled={creatingCoupon || !couponCode} className="bg-green-600 hover:bg-green-700 gap-2">
                                            {creatingCoupon ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Tag className="w-4 h-4" />} Criar Cupom
                                        </Button>
                                        <Button variant="outline" onClick={() => setShowCouponForm(false)} className="border-slate-600 text-slate-300">Cancelar</Button>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Coupons list */}
                        <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden">
                            {coupons.length === 0 ? (
                                <div className="p-12 text-center">
                                    <Tag className="w-10 h-10 text-slate-600 mx-auto mb-3" />
                                    <p className="text-slate-400 text-sm">Nenhum cupom criado ainda.</p>
                                    <p className="text-slate-600 text-xs mt-1">Crie a tabela <code className="text-indigo-400">coupons</code> no Supabase para habilitar.</p>
                                </div>
                            ) : (
                                <table className="w-full text-sm">
                                    <thead className="bg-slate-800 text-slate-400 text-xs uppercase tracking-wider">
                                        <tr>
                                            <th className="text-left px-6 py-3">Código</th>
                                            <th className="text-left px-6 py-3">Desconto</th>
                                            <th className="text-left px-6 py-3">Usos</th>
                                            <th className="text-left px-6 py-3">Expiração</th>
                                            <th className="text-left px-6 py-3">Status</th>
                                            <th className="text-left px-6 py-3">Ações</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-800">
                                        {coupons.map(c => (
                                            <tr key={c.id} className="hover:bg-slate-800/50 transition-colors">
                                                <td className="px-6 py-4 font-mono font-bold text-white">{c.code}</td>
                                                <td className="px-6 py-4 text-green-400 font-semibold">{c.discount_pct}% off</td>
                                                <td className="px-6 py-4 text-slate-300">{c.uses_count} / {c.max_uses ?? '∞'}</td>
                                                <td className="px-6 py-4 text-slate-400 text-xs">{c.expires_at ? new Date(c.expires_at).toLocaleDateString('pt-BR') : 'Sem validade'}</td>
                                                <td className="px-6 py-4">
                                                    <Badge color={c.active ? 'bg-green-900/40 text-green-400 border-green-700' : 'bg-slate-800 text-slate-400 border-slate-700'}>
                                                        {c.active ? 'ativo' : 'inativo'}
                                                    </Badge>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <button onClick={() => deleteCoupon(c.id)} className="p-1.5 rounded-lg bg-slate-700 hover:bg-red-600 text-slate-300 hover:text-white transition-all">
                                                        <Trash2 className="w-3.5 h-3.5" />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    </motion.div>
                )}

                {/* ── AVATARS ───────────────────────────────────────── */}
                {activeTab === 'avatars' && (
                    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
                        <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden">
                            <div className="p-5 border-b border-slate-800 flex items-center justify-between">
                                <h2 className="font-bold">Todos os Avatares</h2>
                                <span className="text-xs text-slate-400 bg-slate-800 rounded-full px-3 py-1">{AVATARS.length} avatares</span>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead className="bg-slate-800 text-slate-400 text-xs uppercase tracking-wider">
                                        <tr>
                                            <th className="text-left px-6 py-3">Nome</th>
                                            <th className="text-left px-6 py-3">Matéria</th>
                                            <th className="text-left px-6 py-3">Tipo</th>
                                            <th className="text-left px-6 py-3">Plano</th>
                                            <th className="text-left px-6 py-3">Idioma</th>
                                            <th className="text-left px-6 py-3">Voz</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-800">
                                        {AVATARS.map(a => (
                                            <tr key={a.id} className="hover:bg-slate-800/50 transition-colors">
                                                <td className="px-6 py-4 font-medium text-white">{a.name}</td>
                                                <td className="px-6 py-4 text-slate-300">{a.subject}</td>
                                                <td className="px-6 py-4 text-slate-400 capitalize">{a.type}</td>
                                                <td className="px-6 py-4">
                                                    <Badge color={a.isFree ? 'bg-green-900/40 text-green-400 border-green-700' : 'bg-yellow-900/40 text-yellow-400 border-yellow-700'}>
                                                        {a.isFree ? <CheckCircle className="w-3 h-3" /> : <Lock className="w-3 h-3" />}
                                                        {a.isFree ? 'Grátis' : 'Pro'}
                                                    </Badge>
                                                </td>
                                                <td className="px-6 py-4 text-slate-400 text-xs">{a.language}</td>
                                                <td className="px-6 py-4 text-slate-500 text-xs font-mono">{a.voiceConfig.lemonfoxVoiceId ?? '—'}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </motion.div>
                )}
            </div>
        </div>
    );
}
