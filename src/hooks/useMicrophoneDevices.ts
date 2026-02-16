import { useState, useEffect } from 'react';

export interface AudioDevice {
    deviceId: string;
    label: string;
    kind: 'audioinput' | 'audiooutput';
}

export interface UseMicrophoneDevicesResult {
    devices: AudioDevice[];
    selectedDeviceId: string;
    setSelectedDeviceId: (deviceId: string) => void;
    refreshDevices: () => Promise<void>;
    isLoading: boolean;
}

export function useMicrophoneDevices(): UseMicrophoneDevicesResult {
    const [devices, setDevices] = useState<AudioDevice[]>([]);
    const [selectedDeviceId, setSelectedDeviceId] = useState<string>('default');
    const [isLoading, setIsLoading] = useState(false);

    const getDevices = async (): Promise<AudioDevice[]> => {
        // Check if we're in the browser environment
        if (typeof window === 'undefined' || !navigator?.mediaDevices) {
            return [];
        }

        try {
            // Request permission first to get device labels
            await navigator.mediaDevices.getUserMedia({ audio: true });
            
            const mediaDevices = await navigator.mediaDevices.enumerateDevices();
            
            const audioInputs = mediaDevices
                .filter(device => device.kind === 'audioinput')
                .map(device => ({
                    deviceId: device.deviceId,
                    label: device.label || `Microfone ${device.deviceId.slice(-4)}`,
                    kind: device.kind as 'audioinput',
                }));

            return audioInputs;
        } catch (error) {
            console.error('Error getting audio devices:', error);
            return [];
        }
    };

    const refreshDevices = async () => {
        setIsLoading(true);
        try {
            const audioDevices = await getDevices();
            setDevices(audioDevices);
            
            // Set default device if none selected or if selected device is no longer available
            if (!selectedDeviceId || selectedDeviceId === 'default' || 
                !audioDevices.find(d => d.deviceId === selectedDeviceId)) {
                const defaultDevice = audioDevices[0];
                if (defaultDevice) {
                    setSelectedDeviceId(defaultDevice.deviceId);
                }
            }
        } catch (error) {
            console.error('Error refreshing devices:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        // Only run on client side
        if (typeof window === 'undefined' || !navigator?.mediaDevices) {
            return;
        }

        refreshDevices();

        // Listen for device changes
        const handleDeviceChange = () => {
            refreshDevices();
        };

        navigator.mediaDevices.addEventListener('devicechange', handleDeviceChange);

        return () => {
            navigator.mediaDevices.removeEventListener('devicechange', handleDeviceChange);
        };
    }, []);

    return {
        devices,
        selectedDeviceId,
        setSelectedDeviceId,
        refreshDevices,
        isLoading,
    };
}