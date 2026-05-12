import React from 'react';
import { View, Text, TouchableOpacity, Platform } from 'react-native';
import { MapPin, Navigation } from 'lucide-react-native';

// MapView and Marker are only imported on native to avoid crashing on web
let MapView: any = null;
let Marker: any = null;
if (Platform.OS !== 'web') {
    // Dynamic require so Metro does not bundle react-native-maps on web
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const RNMaps = require('react-native-maps');
    MapView = RNMaps.default;
    Marker = RNMaps.Marker;
}

interface MapSectionProps {
    colors: any;
    destCoords: { latitude: number; longitude: number };
    address: string;
    onOpenNavigation: () => void;
    showNativeMap: boolean;
    styles: any;
}

export const MapSection = ({
    colors,
    destCoords,
    address,
    onOpenNavigation,
    showNativeMap,
    styles,
}: MapSectionProps) => (
    <View style={[styles.mapContainer, { borderColor: colors.border }]}
    >
        {showNativeMap ? (
            <MapView
                style={styles.map}
                scrollEnabled={false}
                region={{
                    latitude: destCoords.latitude,
                    longitude: destCoords.longitude,
                    latitudeDelta: 0.005,
                    longitudeDelta: 0.005,
                }}
            >
                <Marker
                    coordinate={destCoords}
                    draggable={false}
                    pinColor={colors.primary}
                />
            </MapView>
        ) : (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', gap: 8 }}>
                <MapPin size={40} color={colors.primary} />
                <Text style={{ color: colors.text, fontWeight: '700', fontSize: 16, textAlign: 'center', paddingHorizontal: 16 }}>
                    {address}
                </Text>
            </View>
        )}
        {showNativeMap ? (
            <TouchableOpacity
                style={[styles.navBtn, { backgroundColor: colors.primary }]}
                onPress={onOpenNavigation}
            >
                <Navigation size={20} color="#ffffff" />
                <Text style={styles.navBtnText}>Abrir en Mapa</Text>
            </TouchableOpacity>
        ) : null}
    </View>
);
