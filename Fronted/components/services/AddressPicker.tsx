import React, { useState, useMemo } from 'react';
import { View, Text, TouchableOpacity, FlatList, Modal, TextInput, Alert } from 'react-native';
import { MapPin, Plus, Check, Trash2, X } from 'lucide-react-native';
import { useTheme } from '../../context/ThemeContext';
import { SPACING, RADIUS } from '../../constants/theme';
import { useAddresses, useCreateAddress, useDeleteAddress } from '../../hooks/useAddresses';
import { UserAddress } from '../../types/user';
import { LocationPickerMap } from './LocationPickerMap';

interface Props {
    selectedAddress: string;
    selectedLat: number | null;
    selectedLng: number | null;
    onSelect: (address: string, lat: number | null, lng: number | null) => void;
}

export const AddressPicker = ({ selectedAddress, selectedLat, selectedLng, onSelect }: Props) => {
    const { colors } = useTheme();
    const { data: addresses } = useAddresses();
    const createAddress = useCreateAddress();
    const deleteAddress = useDeleteAddress();

    const [showNewForm, setShowNewForm] = useState(false);
    const [alias, setAlias] = useState('');
    const [newAddress, setNewAddress] = useState('');
    const [newLat, setNewLat] = useState<number | null>(null);
    const [newLng, setNewLng] = useState<number | null>(null);
    const [saveNew, setSaveNew] = useState(false);

    const handleSelectSaved = (addr: UserAddress) => {
        onSelect(addr.address_line, addr.latitude ?? null, addr.longitude ?? null);
    };

    const handleSaveNew = async () => {
        if (!newAddress.trim()) return;
        if (saveNew && alias.trim()) {
            await createAddress.mutateAsync({
                alias: alias.trim(),
                address_line: newAddress,
                latitude: newLat !== null ? Number(newLat.toFixed(6)) : null,
                longitude: newLng !== null ? Number(newLng.toFixed(6)) : null,
            });
        }
        onSelect(newAddress, newLat, newLng);
        setShowNewForm(false);
        setAlias('');
        setNewAddress('');
        setNewLat(null);
        setNewLng(null);
        setSaveNew(false);
    };

    const handleDelete = (id: number) => {
        Alert.alert('Eliminar dirección', '¿Confirmas?', [
            { text: 'Cancelar', style: 'cancel' },
            { text: 'Eliminar', style: 'destructive', onPress: () => deleteAddress.mutate(id) },
        ]);
    };

    const inputStyle = useMemo(() => ({
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: RADIUS.md,
        padding: SPACING.sm,
        color: colors.text,
        backgroundColor: colors.surface,
        marginBottom: SPACING.sm,
    }), [colors]);

    return (
        <View>
            {addresses && addresses.length > 0 && (
                <View style={{ marginBottom: SPACING.sm }}>
                    {addresses.map((addr) => {
                        const isSelected = selectedAddress === addr.address_line;
                        return (
                            <TouchableOpacity
                                key={addr.id}
                                onPress={() => handleSelectSaved(addr)}
                                style={{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    padding: SPACING.sm,
                                    borderRadius: RADIUS.md,
                                    borderWidth: 1,
                                    borderColor: isSelected ? colors.primary : colors.border,
                                    backgroundColor: isSelected ? colors.primary + '10' : colors.surface,
                                    marginBottom: SPACING.xs,
                                }}
                            >
                                <MapPin size={16} color={isSelected ? colors.primary : colors.textLight} />
                                <View style={{ flex: 1, marginLeft: SPACING.sm }}>
                                    <Text style={{ fontWeight: '600', color: colors.text, fontSize: 13 }}>{addr.alias}</Text>
                                    <Text style={{ fontSize: 12, color: colors.textLight }} numberOfLines={1}>{addr.address_line}</Text>
                                </View>
                                {isSelected && <Check size={16} color={colors.primary} />}
                                <TouchableOpacity onPress={() => handleDelete(addr.id)} style={{ padding: 4, marginLeft: 4 }}>
                                    <Trash2 size={14} color={colors.danger} />
                                </TouchableOpacity>
                            </TouchableOpacity>
                        );
                    })}
                </View>
            )}

            <TouchableOpacity
                onPress={() => setShowNewForm(true)}
                style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    padding: SPACING.sm,
                    borderRadius: RADIUS.md,
                    borderWidth: 1,
                    borderStyle: 'dashed',
                    borderColor: colors.primary,
                }}
            >
                <Plus size={16} color={colors.primary} />
                <Text style={{ marginLeft: SPACING.xs, color: colors.primary, fontWeight: '600', fontSize: 13 }}>
                    {selectedAddress && !addresses?.some(a => a.address_line === selectedAddress)
                        ? selectedAddress
                        : '+ Nueva dirección'}
                </Text>
            </TouchableOpacity>

            <Modal visible={showNewForm} transparent animationType="slide" onRequestClose={() => setShowNewForm(false)}>
                <View style={{ flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <View style={{ backgroundColor: colors.background, borderTopLeftRadius: RADIUS.xl, borderTopRightRadius: RADIUS.xl, padding: SPACING.xl }}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: SPACING.md }}>
                            <Text style={{ fontSize: 16, fontWeight: '700', color: colors.text }}>Nueva Dirección</Text>
                            <TouchableOpacity onPress={() => setShowNewForm(false)}><X size={20} color={colors.text} /></TouchableOpacity>
                        </View>

                        {__DEV__ ? (
                            <LocationPickerMap
                                initialAddress={newAddress}
                                initialLat={newLat ?? undefined}
                                initialLng={newLng ?? undefined}
                                onLocationSelected={(lat: number, lng: number, addr: string) => {
                                    setNewLat(lat);
                                    setNewLng(lng);
                                    setNewAddress(addr);
                                }}
                            />
                        ) : (
                            <View style={{
                                borderWidth: 1,
                                borderColor: colors.border,
                                borderRadius: RADIUS.md,
                                padding: SPACING.md,
                                backgroundColor: colors.surface,
                                marginBottom: SPACING.sm,
                            }}>
                                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: SPACING.sm }}>
                                    <MapPin size={16} color={colors.primary} />
                                    <Text style={{ marginLeft: SPACING.xs, color: colors.textLight, fontSize: 12 }}>
                                        Ingresar dirección manualmente
                                    </Text>
                                </View>
                                <TextInput
                                    style={inputStyle}
                                    placeholder='Ej: Calle 123 #45-67, Apto 501'
                                    placeholderTextColor={colors.textLight + '80'}
                                    value={newAddress}
                                    onChangeText={setNewAddress}
                                    autoFocus
                                    multiline={false}
                                />
                            </View>
                        )}

                        <TouchableOpacity
                            onPress={() => setSaveNew(!saveNew)}
                            style={{ flexDirection: 'row', alignItems: 'center', marginTop: SPACING.sm, marginBottom: SPACING.sm }}
                        >
                            <View style={{
                                width: 20, height: 20, borderRadius: 4, borderWidth: 2,
                                borderColor: saveNew ? colors.primary : colors.border,
                                backgroundColor: saveNew ? colors.primary : 'transparent',
                                alignItems: 'center', justifyContent: 'center', marginRight: SPACING.xs,
                            }}>
                                {saveNew && <Check size={12} color={colors.white} />}
                            </View>
                            <Text style={{ color: colors.text, fontSize: 13 }}>Guardar para futuras solicitudes</Text>
                        </TouchableOpacity>

                        {saveNew && (
                            <TextInput
                                style={inputStyle}
                                placeholder='Alias (ej. "Casa", "Oficina")'
                                placeholderTextColor={colors.textLight + '80'}
                                value={alias}
                                onChangeText={setAlias}
                            />
                        )}

                        <TouchableOpacity
                            onPress={handleSaveNew}
                            disabled={!newAddress.trim()}
                            style={{
                                backgroundColor: newAddress.trim() ? colors.primary : colors.border,
                                padding: SPACING.md,
                                borderRadius: RADIUS.md,
                                alignItems: 'center',
                            }}
                        >
                            <Text style={{ color: colors.white, fontWeight: '700' }}>Usar esta dirección</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    );
};
