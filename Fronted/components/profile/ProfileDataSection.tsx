import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { ClientProfile } from '../../types/auth';

interface Props {
    data: Partial<ClientProfile>;
    isEditing: boolean;
    onChange: (field: keyof ClientProfile, value: string) => void;
}

interface FieldConfig {
    key: keyof ClientProfile;
    label: string;
    placeholder: string;
    keyboardType?: 'default' | 'phone-pad' | 'email-address';
}

const FIELDS: FieldConfig[] = [
    { key: 'city', label: 'Ciudad', placeholder: 'Ej: Medellín' },
    { key: 'address', label: 'Dirección', placeholder: 'Ej: Calle 10 # 20-30' },
    { key: 'phone_number', label: 'Teléfono', placeholder: 'Ej: +573001234567', keyboardType: 'phone-pad' },
];

export default function ProfileDataSection({ data, isEditing, onChange }: Props) {
    return (
        <View style={styles.section}>
            <Text style={styles.sectionTitle}>Información de contacto</Text>
            {FIELDS.map(({ key, label, placeholder, keyboardType }) => (
                <View key={key} style={styles.row}>
                    <Text style={styles.label}>{label}</Text>
                    {isEditing ? (
                        <TextInput
                            style={styles.input}
                            value={data[key] ?? ''}
                            onChangeText={(val) => onChange(key, val)}
                            placeholder={placeholder}
                            placeholderTextColor="#C4C4C4"
                            keyboardType={keyboardType ?? 'default'}
                        />
                    ) : (
                        <Text style={[styles.value, !data[key] && styles.empty]}>
                            {data[key] || 'No especificado'}
                        </Text>
                    )}
                </View>
            ))}
        </View>
    );
}

const styles = StyleSheet.create({
    section: {
        backgroundColor: '#FFFFFF',
        marginTop: 16,
        paddingHorizontal: 20,
        paddingVertical: 8,
        borderTopWidth: 1,
        borderBottomWidth: 1,
        borderColor: '#F0F0F0',
    },
    sectionTitle: {
        fontSize: 13,
        fontWeight: '600',
        color: '#6B7280',
        textTransform: 'uppercase',
        letterSpacing: 0.8,
        paddingVertical: 12,
    },
    row: {
        paddingVertical: 12,
        borderTopWidth: 1,
        borderTopColor: '#F3F4F6',
    },
    label: {
        fontSize: 12,
        color: '#9CA3AF',
        marginBottom: 4,
        fontWeight: '500',
    },
    value: {
        fontSize: 16,
        color: '#1A1A2E',
        fontWeight: '400',
    },
    empty: {
        color: '#C4C4C4',
        fontStyle: 'italic',
    },
    input: {
        fontSize: 16,
        color: '#1A1A2E',
        borderWidth: 1,
        borderColor: '#4CAF93',
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 8,
        backgroundColor: '#F0FAF7',
    },
});
