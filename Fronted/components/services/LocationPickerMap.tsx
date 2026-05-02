import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import {
    View,
    Text,
    TextInput,
    ActivityIndicator,
    Platform,
} from 'react-native';
import * as Location from 'expo-location';
import { MapPin, Navigation, AlertCircle } from 'lucide-react-native';
import { useTheme } from '../../context/ThemeContext';
import { getStyles } from './LocationPickerMap.styles';

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

export interface LocationPickerMapProps {
    onLocationSelected: (lat: number, lng: number, address: string) => void;
    initialAddress?: string;
    initialLat?: number;
    initialLng?: number;
}

type PermissionState = 'unknown' | 'loading' | 'granted' | 'denied';

interface Coordinate {
    latitude: number;
    longitude: number;
}

// Default coordinates: Bogotá, Colombia
const DEFAULT_COORD: Coordinate = { latitude: 4.711, longitude: -74.0721 };

export const LocationPickerMap = ({
    onLocationSelected,
    initialAddress = '',
    initialLat,
    initialLng,
}: LocationPickerMapProps) => {
    const { colors } = useTheme();
    const styles = useMemo(() => getStyles(colors), [colors]);

    const [permission, setPermission] = useState<PermissionState>('unknown');
    const [coordinate, setCoordinate] = useState<Coordinate>(
        initialLat && initialLng
            ? { latitude: initialLat, longitude: initialLng }
            : DEFAULT_COORD
    );
    const [address, setAddress] = useState(initialAddress);
    const [isGeocoding, setIsGeocoding] = useState(false);
    const [inputFocused, setInputFocused] = useState(false);

    // Track if the last address change came from geocoding (not user typing)
    const skipNextGeocode = useRef(false);

    // Request permission and fetch current location on mount
    useEffect(() => {
        if (Platform.OS === 'web') return;

        let cancelled = false;

        const init = async () => {
            setPermission('loading');

            const { status } = await Location.requestForegroundPermissionsAsync();

            if (cancelled) return;

            if (status !== 'granted') {
                setPermission('denied');
                return;
            }

            setPermission('granted');

            // If initial coordinates are provided, skip geolocation
            if (initialLat && initialLng) return;

            try {
                const loc = await Location.getCurrentPositionAsync({
                    accuracy: Location.Accuracy.Balanced,
                });
                if (cancelled) return;
                const coord = {
                    latitude: loc.coords.latitude,
                    longitude: loc.coords.longitude,
                };
                setCoordinate(coord);
                reverseGeocode(coord);
            } catch {
                // Location unavailable – keep default coordinate
            }
        };

        init();
        return () => { cancelled = true; };
        // Run only once on mount
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const reverseGeocode = useCallback(
        async (coord: Coordinate) => {
            if (Platform.OS === 'web') return;
            setIsGeocoding(true);
            try {
                const results = await Location.reverseGeocodeAsync({
                    latitude: coord.latitude,
                    longitude: coord.longitude,
                });
                if (results.length > 0) {
                    const r = results[0];
                    const parts = [
                        r.street,
                        r.streetNumber,
                        r.district,
                        r.city,
                    ].filter(Boolean);
                    const formatted = parts.join(', ');
                    if (!isNaN(coord.latitude) && !isNaN(coord.longitude)) {
                        skipNextGeocode.current = true;
                        setAddress(formatted);
                        onLocationSelected(coord.latitude, coord.longitude, formatted);
                    }
                }
            } catch {
                // Geocoding failed silently; address remains as typed
                if (!isNaN(coord.latitude) && !isNaN(coord.longitude)) {
                    onLocationSelected(coord.latitude, coord.longitude, address);
                }
            } finally {
                setIsGeocoding(false);
            }
        },
        // address is intentionally excluded to avoid stale closure issues
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [onLocationSelected]
    );

    const handleMarkerDragEnd = useCallback(
        (e: any) => {
            const { latitude, longitude } = e.nativeEvent.coordinate;
            const coord = { latitude, longitude };
            setCoordinate(coord);
            reverseGeocode(coord);
        },
        [reverseGeocode]
    );

    const handleAddressChange = useCallback(
        (text: string) => {
            if (skipNextGeocode.current === true) {
                skipNextGeocode.current = false;
                return;
            }
            setAddress(text);
            // Propagate the manually typed address with current coordinates
            const lat = coordinate.latitude;
            const lng = coordinate.longitude;
            if (!isNaN(lat) && !isNaN(lng)) {
                onLocationSelected(lat, lng, text);
            }
        },
        [coordinate, onLocationSelected]
    );

    // ----------------------------------------------------------------
    // Web: only show a text input
    // ----------------------------------------------------------------
    if (Platform.OS === 'web') {
        return (
            <View style={styles.container}>
                <TextInput
                    style={[styles.addressInput, inputFocused && styles.addressInputFocused]}
                    placeholder="Ej: Calle 123 #45-67, Apto 501"
                    placeholderTextColor={colors.textMuted}
                    value={address}
                    onChangeText={handleAddressChange}
                    onFocus={() => setInputFocused(true)}
                    onBlur={() => setInputFocused(false)}
                />
                <View style={styles.hintRow}>
                    <MapPin size={12} color={colors.textMuted} />
                    <Text style={styles.hintText}>Ingresa la dirección manualmente</Text>
                </View>
            </View>
        );
    }

    // ----------------------------------------------------------------
    // Native: loading state
    // ----------------------------------------------------------------
    if (permission === 'unknown' || permission === 'loading') {
        return (
            <View style={styles.container}>
                <View style={styles.loadingContainer}>
                    <ActivityIndicator color={colors.primary} size="small" />
                    <Text style={styles.loadingText}>Obteniendo ubicación…</Text>
                </View>
                <TextInput
                    style={[styles.addressInput, inputFocused && styles.addressInputFocused]}
                    placeholder="Ej: Calle 123 #45-67, Apto 501"
                    placeholderTextColor={colors.textMuted}
                    value={address}
                    onChangeText={handleAddressChange}
                    onFocus={() => setInputFocused(true)}
                    onBlur={() => setInputFocused(false)}
                />
            </View>
        );
    }

    // ----------------------------------------------------------------
    // Native: permission denied
    // ----------------------------------------------------------------
    if (permission === 'denied') {
        return (
            <View style={styles.container}>
                <View style={styles.deniedContainer}>
                    <AlertCircle size={28} color={colors.warning} />
                    <Text style={styles.deniedTitle}>Permiso de ubicación no concedido</Text>
                    <Text style={styles.deniedSubtitle}>
                        Escribe la dirección manualmente o activa los permisos en Ajustes.
                    </Text>
                </View>
                <TextInput
                    style={[styles.addressInput, inputFocused && styles.addressInputFocused]}
                    placeholder="Ej: Calle 123 #45-67, Apto 501"
                    placeholderTextColor={colors.textMuted}
                    value={address}
                    onChangeText={handleAddressChange}
                    onFocus={() => setInputFocused(true)}
                    onBlur={() => setInputFocused(false)}
                />
            </View>
        );
    }

    // ----------------------------------------------------------------
    // Native: map visible (permission granted)
    // ----------------------------------------------------------------
    return (
        <View style={styles.container}>
            <View style={styles.mapWrapper}>
                <MapView
                    style={styles.map}
                    region={{
                        latitude: coordinate.latitude,
                        longitude: coordinate.longitude,
                        latitudeDelta: 0.004,
                        longitudeDelta: 0.004,
                    }}
                    showsUserLocation
                    showsMyLocationButton={false}
                >
                    <Marker
                        coordinate={coordinate}
                        draggable
                        onDragEnd={handleMarkerDragEnd}
                        pinColor={colors.primary}
                    />
                </MapView>
            </View>

            {isGeocoding ? (
                <View style={styles.geocodingRow}>
                    <ActivityIndicator color={colors.primary} size="small" />
                    <Text style={styles.geocodingText}>Obteniendo dirección…</Text>
                </View>
            ) : null}

            <TextInput
                style={[styles.addressInput, inputFocused && styles.addressInputFocused]}
                placeholder="Mueve el pin o escribe la dirección"
                placeholderTextColor={colors.textMuted}
                value={address}
                onChangeText={handleAddressChange}
                onFocus={() => setInputFocused(true)}
                onBlur={() => setInputFocused(false)}
            />

            <View style={styles.hintRow}>
                <Navigation size={12} color={colors.textMuted} />
                <Text style={styles.hintText}>Arrastra el marcador para ajustar la ubicación exacta</Text>
            </View>
        </View>
    );
};
