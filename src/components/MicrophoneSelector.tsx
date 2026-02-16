'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Mic, Settings, Check, RefreshCw } from 'lucide-react';
import { useMicrophoneDevices } from '@/hooks/useMicrophoneDevices';
import { cn } from '@/lib/utils';

interface MicrophoneSelectorProps {
    onDeviceSelect: (deviceId: string) => void;
    className?: string;
}

export function MicrophoneSelector({ onDeviceSelect, className }: MicrophoneSelectorProps) {
    const [isOpen, setIsOpen] = useState(false);
    const { devices, selectedDeviceId, setSelectedDeviceId, refreshDevices, isLoading } = useMicrophoneDevices();

    const handleDeviceSelect = (deviceId: string) => {
        setSelectedDeviceId(deviceId);
        onDeviceSelect(deviceId);
        setIsOpen(false);
    };

    const selectedDevice = devices.find(d => d.deviceId === selectedDeviceId);

    return (
        <div className={cn("relative", className)}>
            {/* Trigger Button */}
            <Button
                variant="outline"
                size="sm"
                onClick={() => setIsOpen(!isOpen)}
                className="h-8 px-2 border border-gray-300 dark:border-slate-600 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
                title="Selecionar microfone"
            >
                <Settings className="w-3 h-3 mr-1" />
                <Mic className="w-3 h-3" />
            </Button>

            {/* Dropdown */}
            {isOpen && (
                <div className="absolute bottom-full left-0 mb-2 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg shadow-lg z-50 min-w-[250px] max-w-[300px]">
                    <div className="p-3">
                        <div className="flex items-center justify-between mb-2">
                            <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                                Selecionar Microfone
                            </h3>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={refreshDevices}
                                disabled={isLoading}
                                className="h-6 w-6 p-0"
                                title="Atualizar lista"
                            >
                                <RefreshCw className={cn("w-3 h-3", isLoading && "animate-spin")} />
                            </Button>
                        </div>

                        {/* Device List */}
                        <div className="space-y-1 max-h-40 overflow-y-auto">
                            {devices.length === 0 ? (
                                <div className="text-sm text-gray-500 dark:text-gray-400 text-center py-2">
                                    {isLoading ? 'Carregando...' : 'Nenhum microfone encontrado'}
                                </div>
                            ) : (
                                devices.map((device) => (
                                    <button
                                        key={device.deviceId}
                                        onClick={() => handleDeviceSelect(device.deviceId)}
                                        className="w-full flex items-center gap-2 p-2 text-left text-sm rounded-md hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors"
                                    >
                                        <Mic className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
                                        <span className="flex-1 truncate text-gray-900 dark:text-white">
                                            {device.label}
                                        </span>
                                        {device.deviceId === selectedDeviceId && (
                                            <Check className="w-4 h-4 text-green-600 dark:text-green-400 shrink-0" />
                                        )}
                                    </button>
                                ))
                            )}
                        </div>

                        {/* Current Selection */}
                        {selectedDevice && (
                            <div className="mt-3 pt-3 border-t border-gray-200 dark:border-slate-600">
                                <div className="text-xs text-gray-500 dark:text-gray-400">
                                    Selecionado:
                                </div>
                                <div className="text-sm text-gray-900 dark:text-white truncate">
                                    {selectedDevice.label}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Close Button */}
                    <div className="px-3 pb-3">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setIsOpen(false)}
                            className="w-full h-7 text-xs"
                        >
                            Fechar
                        </Button>
                    </div>
                </div>
            )}

            {/* Backdrop */}
            {isOpen && (
                <div 
                    className="fixed inset-0 z-40"
                    onClick={() => setIsOpen(false)}
                />
            )}
        </div>
    );
}