import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { ClientProfile, WorkerProfile } from '../../types/auth';
import { useTheme } from '../../context/ThemeContext';
import { SPACING, RADIUS } from '../../constants/theme';

type ProfileData = Partial<ClientProfile & WorkerProfile>;

interface Props {
    data: ProfileData;
    isEditing: boolean;
    onChange: (field: string, value: string) => void;
}

interface FieldConfig {
    key: string;
    label: string;
    placeholder: string;
    keyboardType?: 'default' | 'phone-pad' | 'email-address';
    multiline?: boolean;
}

export default function ProfileDataSection({ data, isEditing, onChange }: Props) {
    const { colors } = useTheme();

    const getFields = (): FieldConfig[] => {
        // If data contains 'address', it's likely a client (or has client fields)
        if ('address' in data || 'phone_number' in data) {
            return [
                { key: 'city', label: 'Ciudad', placeholder: 'Ej: Medellín' },
                { key: 'address', label: 'Dirección', placeholder: 'Ej: Calle 10 # 20-30' },
                { key: 'phone_number', label: 'Teléfono', placeholder: 'Ej: +573001234567', keyboardType: 'phone-pad' },
            ];
        }
        // If it has bio or identity_document, it's a worker
        return [
            { key: 'identity_document', label: 'Documento de Identidad', placeholder: 'C.C. 12345678', keyboardType: 'default' },
            { key: 'bio', label: 'Biografía', placeholder: 'Cuéntanos un poco sobre ti...', multiline: true },
        ];
    };

    const fields = getFields();

    const dynamicStyles = StyleSheet.create({
        section: {
            backgroundColor: colors.surface,
            marginTop: SPACING.md,
            paddingHorizontal: SPACING.lg,
            paddingVertical: SPACING.sm,
            borderTopWidth: 1,
            borderBottomWidth: 1,
            borderColor: colors.border,
        },
        sectionTitle: {
            fontSize: 13,
            fontWeight: '600',
            color: colors.textLight,
            textTransform: 'uppercase',
            letterSpacing: 0.8,
            paddingVertical: SPACING.md,
        },
        row: {
            paddingVertical: SPACING.md,
            borderTopWidth: 1,
            borderTopColor: colors.border,
        },
        label: {
            fontSize: 12,
            color: colors.textMuted,
            marginBottom: 4,
            fontWeight: '500',
        },
        value: {
            fontSize: 16,
            color: colors.text,
            fontWeight: '400',
        },
        empty: {
            color: colors.textMuted,
            fontStyle: 'italic',
        },
        input: {
            fontSize: 16,
            color: colors.text,
            borderWidth: 1,
            borderColor: colors.primary,
            borderRadius: RADIUS.md,
            paddingHorizontal: SPACING.md,
            paddingVertical: SPACING.sm,
            backgroundColor: colors.primary + '11',
            minHeight: 40,
        },
    });

    return (
        <View style={dynamicStyles.section}>
            <Text style={dynamicStyles.sectionTitle}>
                {'address' in data ? 'Información de contacto' : 'Información Profesional'}
            </Text>
            {fields.map(({ key, label, placeholder, keyboardType, multiline }) => (
                <View key={key} style={dynamicStyles.row}>
                    <Text style={dynamicStyles.label}>{label}</Text>
                    {isEditing ? (
                        <TextInput
                            style={[dynamicStyles.input, multiline && { minHeight: 80, textAlignVertical: 'top' }]}
                            value={(data as any)[key] ?? ''}
                            onChangeText={(val) => onChange(key, val)}
                            placeholder={placeholder}
                            placeholderTextColor={colors.textMuted}
                            keyboardType={keyboardType ?? 'default'}
                            multiline={multiline}
                        />
                    ) : (
                        <Text style={[dynamicStyles.value, !(data as any)[key] && dynamicStyles.empty]}>
                            {(data as any)[key] || 'No especificado'}
                        </Text>
                    )}
                </View>
            ))}
        </View>
    );
}
