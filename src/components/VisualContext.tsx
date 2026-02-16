'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Utensils, Plane, Calendar, Info } from 'lucide-react';

interface VisualContextProps {
    scenarioId: string;
    isVisible?: boolean;
}

// Mock Data for Visual Contexts
const CONTEXT_DATA: Record<string, any> = {
    'restaurant-order': {
        type: 'menu',
        title: 'Le Bistro Menu',
        categories: [
            {
                name: 'Starters',
                items: [
                    { name: 'French Onion Soup', price: '$8', desc: 'Classic soup with melted cheese' },
                    { name: 'Escargots', price: '$12', desc: 'Snails in garlic butter' }
                ]
            },
            {
                name: 'Mains',
                items: [
                    { name: 'Steak Frites', price: '$22', desc: 'Grilled steak with fries' },
                    { name: 'Ratatouille', price: '$18', desc: 'Stewed vegetables' },
                    { name: 'Coq au Vin', price: '$20', desc: 'Chicken braised with wine' }
                ]
            },
            {
                name: 'Drinks',
                items: [
                    { name: 'Red Wine', price: '$9', desc: 'Bordeaux' },
                    { name: 'Sparkling Water', price: '$4', desc: 'Perrier' }
                ]
            }
        ]
    },
    'travel-airport': {
        type: 'flight-board',
        title: 'Departures / Partidas',
        flights: [
            { time: '10:00', dest: 'London', flight: 'BA249', status: 'Boarding' },
            { time: '10:30', dest: 'New York', flight: 'AA908', status: 'Delayed' },
            { time: '11:15', dest: 'Paris', flight: 'AF452', status: 'On Time' },
            { time: '12:00', dest: 'Tokyo', flight: 'JL773', status: 'On Time' },
            { time: '12:45', dest: 'Dubai', flight: 'EK262', status: 'Gate Open' },
        ]
    },
    'history-debate': {
        type: 'timeline',
        title: 'Brasil Império - Linha do Tempo',
        events: [
            { year: '1822', event: 'Independência do Brasil', desc: 'Grito do Ipiranga por D. Pedro I' },
            { year: '1831', event: 'Abdicação de D. Pedro I', desc: 'Início do Período Regencial' },
            { year: '1840', event: 'Golpe da Maioridade', desc: 'D. Pedro II assume o trono aos 14 anos' },
            { year: '1850', event: 'Lei Eusébio de Queirós', desc: 'Fim do tráfico negreiro' },
            { year: '1888', event: 'Abolição da Escravatura', desc: 'Lei Áurea assinada pela Princesa Isabel' },
            { year: '1889', event: 'Proclamação da República', desc: 'Fim do Império' }
        ]
    }
};

export function VisualContext({ scenarioId, isVisible = true }: VisualContextProps) {
    const data = CONTEXT_DATA[scenarioId];

    if (!data || !isVisible) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="h-full border-l bg-white/50 backdrop-blur w-80 lg:w-80 md:w-72 flex-shrink-0"
            >
                <Card className="h-full border-0 rounded-none bg-transparent flex flex-col shadow-none">
                    <div className="p-3 sm:p-4 bg-white/80 border-b flex items-center gap-2 sm:gap-3">
                        <div className="p-1.5 sm:p-2 bg-blue-100 rounded-lg">
                            {data.type === 'menu' && <Utensils className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />}
                            {data.type === 'flight-board' && <Plane className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />}
                            {data.type === 'timeline' && <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />}
                        </div>
                        <div className="min-w-0">
                            <h3 className="font-bold text-xs sm:text-sm text-gray-900 leading-tight truncate">{data.title}</h3>
                            <p className="text-[9px] sm:text-[10px] text-gray-500 uppercase tracking-wider font-semibold">Contexto Visual</p>
                        </div>
                    </div>

                    <ScrollArea className="flex-1 p-3 sm:p-4">
                        {data.type === 'menu' && (
                            <div className="space-y-4 sm:space-y-6">
                                {data.categories.map((cat: any, i: number) => (
                                    <div key={i}>
                                        <h4 className="font-bold text-blue-800 text-xs uppercase tracking-wider mb-2 sm:mb-3 pb-1 border-b border-blue-100">{cat.name}</h4>
                                        <div className="space-y-2 sm:space-y-3">
                                            {cat.items.map((item: any, j: number) => (
                                                <div key={j} className="group hover:bg-white p-2 rounded-lg transition-all hover:shadow-sm border border-transparent hover:border-gray-100 cursor-default">
                                                    <div className="flex justify-between items-start mb-0.5">
                                                        <span className="font-medium text-xs sm:text-sm text-gray-800 truncate pr-2">{item.name}</span>
                                                        <span className="font-bold text-xs sm:text-sm text-blue-600 shrink-0">{item.price}</span>
                                                    </div>
                                                    <p className="text-xs text-gray-500 leading-snug line-clamp-2">{item.desc}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {data.type === 'flight-board' && (
                            <div className="space-y-1 sm:space-y-2">
                                <div className="grid grid-cols-1 gap-1 sm:gap-2">
                                    {data.flights.map((flight: any, i: number) => (
                                        <div key={i} className="flex items-center justify-between p-2 sm:p-3 bg-white border border-gray-100 rounded shadow-sm">
                                            <div className="min-w-0 flex-1">
                                                <div className="flex items-center gap-1 sm:gap-2 mb-1">
                                                    <span className="font-mono text-sm sm:text-lg font-bold text-gray-900">{flight.time}</span>
                                                    <span className="px-1 sm:px-1.5 py-0.5 bg-gray-100 rounded text-[8px] sm:text-[10px] font-mono text-gray-500">{flight.flight}</span>
                                                </div>
                                                <div className="font-bold text-blue-700 text-xs sm:text-sm truncate">{flight.dest}</div>
                                            </div>
                                            <div className={`text-xs font-bold px-1.5 sm:px-2 py-0.5 sm:py-1 rounded shrink-0 ${flight.status === 'Delayed' ? 'bg-red-100 text-red-700' :
                                                    flight.status === 'Boarding' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                                                }`}>
                                                <span className="hidden sm:inline">{flight.status}</span>
                                                <span className="sm:hidden">
                                                    {flight.status === 'Delayed' ? '🔴' : 
                                                     flight.status === 'Boarding' ? '🟢' : '🟡'}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {data.type === 'timeline' && (
                            <div className="relative pl-3 sm:pl-4 ml-1 sm:ml-2 border-l-2 border-blue-200 space-y-6 sm:space-y-8 py-2">
                                {data.events.map((ev: any, i: number) => (
                                    <div key={i} className="relative">
                                        <div className="absolute -left-[17px] sm:-left-[21px] top-1.5 w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-white border-2 border-blue-500 shadow-sm z-10" />
                                        <div className="mb-1">
                                            <span className="text-xs font-bold text-blue-600 bg-blue-50 px-1.5 sm:px-2 py-0.5 rounded-full border border-blue-100 shadow-sm">
                                                {ev.year}
                                            </span>
                                        </div>
                                        <h4 className="font-bold text-gray-900 text-xs sm:text-sm leading-tight mb-1">{ev.event}</h4>
                                        <p className="text-xs text-gray-500 leading-relaxed bg-gray-50 p-2 rounded border border-gray-100 line-clamp-3">
                                            {ev.desc}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </ScrollArea>
                </Card>
            </motion.div>
        </AnimatePresence>
    );
}
