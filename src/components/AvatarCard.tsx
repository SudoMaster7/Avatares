'use client';

import { AvatarConfig } from '@/lib/avatars';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MessageCircle, Sparkles } from 'lucide-react';

interface AvatarCardProps {
    avatar: AvatarConfig;
    onSelect: (avatar: AvatarConfig) => void;
    onSelectScenario?: (avatar: AvatarConfig) => void;
}

export function AvatarCard({ avatar, onSelect, onSelectScenario }: AvatarCardProps) {
    return (
        <Card className="overflow-hidden hover:shadow-2xl transition-all duration-300 group border-2 border-transparent hover:border-blue-300">
            {/* Image Container */}
            <div className="relative h-40 sm:h-48 bg-gradient-to-br from-blue-100 to-purple-100 overflow-hidden flex items-center justify-center">
                <img 
                    src={avatar.imageUrl} 
                    alt={avatar.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        const fallback = target.parentElement?.querySelector(`#fallback-${avatar.id}`) as HTMLDivElement;
                        if (fallback) fallback.style.display = 'flex';
                    }}
                />
                <div 
                    id={`fallback-${avatar.id}`}
                    className="absolute inset-0 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center text-white text-6xl font-bold"
                    style={{ display: 'none' }}
                >
                    {avatar.name.charAt(0)}
                </div>
            </div>

            <div className="p-4 sm:p-5">
                {/* Info */}
                <h3 className="text-base sm:text-lg font-bold text-center mb-1">{avatar.name}</h3>
                <p className="text-xs sm:text-sm font-semibold text-center text-blue-600 mb-2">{avatar.subject}</p>
                <p className="text-xs text-center text-gray-600 mb-3 sm:mb-4 line-clamp-2 h-8">
                    {avatar.description}
                </p>

                {/* Language Badge */}
                <div className="flex justify-center mb-3 sm:mb-4">
                    <span className="px-2 sm:px-3 py-1 bg-blue-100 text-blue-800 text-xs font-semibold rounded-full">
                        {avatar.language === 'pt-BR' ? '🇧🇷 Português' : '🇺🇸 English'}
                    </span>
                </div>

                {/* Action Buttons */}
                <div className="space-y-1.5 sm:space-y-2">
                    <Button
                        onClick={() => onSelect(avatar)}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md hover:shadow-lg transition-all text-xs sm:text-sm py-2 sm:py-2.5"
                        variant="default"
                    >
                        <MessageCircle className="w-3 sm:w-4 h-3 sm:h-4 mr-1 sm:mr-2" />
                        <span className="hidden sm:inline">Conversar Livremente</span>
                        <span className="sm:hidden">Conversar</span>
                    </Button>

                    {onSelectScenario && (
                        <Button
                            onClick={() => onSelectScenario(avatar)}
                            className="w-full border-2 border-purple-500 text-purple-600 hover:bg-purple-50 font-semibold transition-all text-xs sm:text-sm py-2 sm:py-2.5"
                            variant="outline"
                        >
                            <Sparkles className="w-3 sm:w-4 h-3 sm:h-4 mr-1 sm:mr-2" />
                            <span className="hidden sm:inline">Cenários Práticos</span>
                            <span className="sm:hidden">Cenários</span>
                        </Button>
                    )}
                </div>
            </div>
        </Card>
    );
}
