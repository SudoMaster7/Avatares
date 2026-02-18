'use client';

import { AvatarConfig } from '@/lib/avatars';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MessageCircle, Sparkles, Lock, Crown } from 'lucide-react';

interface AvatarCardProps {
    avatar: AvatarConfig;
    onSelect: (avatar: AvatarConfig) => void;
    onSelectScenario?: (avatar: AvatarConfig) => void;
    isLocked?: boolean;
    onUpgrade?: () => void;
}

export function AvatarCard({ avatar, onSelect, onSelectScenario, isLocked = false, onUpgrade }: AvatarCardProps) {
    const handleSelect = () => {
        if (isLocked && onUpgrade) {
            onUpgrade();
        } else {
            onSelect(avatar);
        }
    };

    const handleSelectScenario = () => {
        if (isLocked && onUpgrade) {
            onUpgrade();
        } else {
            onSelectScenario?.(avatar);
        }
    };

    return (
        <Card className={`overflow-hidden transition-all duration-300 group border-2 ${
            isLocked 
                ? 'border-amber-300/50 hover:border-amber-400' 
                : 'border-transparent hover:border-blue-300 hover:shadow-2xl'
        } relative`}>
            {/* Locked Overlay */}
            {isLocked && (
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent z-20 flex flex-col items-center justify-end pb-20">
                    <div className="bg-amber-400 text-black px-3 py-1.5 rounded-full flex items-center gap-2 font-bold text-sm shadow-lg">
                        <Crown className="w-4 h-4" />
                        Exclusivo Pro
                    </div>
                </div>
            )}

            {/* Image Container */}
            <div className="relative h-40 sm:h-48 bg-gradient-to-br from-blue-100 to-purple-100 overflow-hidden flex items-center justify-center">
                <img 
                    src={avatar.imageUrl} 
                    alt={avatar.name}
                    className={`w-full h-full object-cover transition-transform duration-300 ${
                        isLocked ? 'grayscale-[30%]' : 'group-hover:scale-110'
                    }`}
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
                
                {/* Lock Icon */}
                {isLocked && (
                    <div className="absolute top-3 right-3 z-30 bg-black/50 backdrop-blur-sm p-2 rounded-full">
                        <Lock className="w-5 h-5 text-amber-400" />
                    </div>
                )}
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
                        onClick={handleSelect}
                        className={`w-full font-semibold shadow-md transition-all text-xs sm:text-sm py-2 sm:py-2.5 ${
                            isLocked 
                                ? 'bg-amber-400 hover:bg-amber-500 text-black hover:shadow-lg'
                                : 'bg-blue-600 hover:bg-blue-700 text-white hover:shadow-lg'
                        }`}
                        variant="default"
                    >
                        {isLocked ? (
                            <>
                                <Crown className="w-3 sm:w-4 h-3 sm:h-4 mr-1 sm:mr-2" />
                                <span>Desbloquear Pro</span>
                            </>
                        ) : (
                            <>
                                <MessageCircle className="w-3 sm:w-4 h-3 sm:h-4 mr-1 sm:mr-2" />
                                <span className="hidden sm:inline">Conversar Livremente</span>
                                <span className="sm:hidden">Conversar</span>
                            </>
                        )}
                    </Button>

                    {onSelectScenario && !isLocked && (
                        <Button
                            onClick={handleSelectScenario}
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
