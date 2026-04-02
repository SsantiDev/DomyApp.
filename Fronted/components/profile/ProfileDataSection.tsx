import React, { useMemo } from 'react';
import { View, Text, TextInput } from 'react-native';
import { ClientProfile, WorkerProfile } from '../../types/auth';
import { useTheme } from '../../context/ThemeContext';
import { getStyles } from './ProfileDataSection.styles';

type ProfileData = Partial<ClientProfile & WorkerProfile>;

interface Props {
    data: ProfileData;
    isEditing: boolean;
    onChange: (field: string, value: string) => void;
    role: 'CLIENT' | 'WORKER';
}

interface FieldConfig {
    key: string;
    label: string;
    placeholder: string;
    keyboardType?: 'default' | 'phone-pad' | 'email-address';
    multiline?: boolean;
}

export default function ProfileDataSection({ data, isEditing, onChange, role }: Props) {
    const { colors } = useTheme();
    const styles = useMemo(() => getStyles(colors), [colors]);

    const getFields = (): FieldConfig[] => {
        if (role === 'WORKER') {
            return [
                { key: 'identity_document', label: 'Documento de Identidad', placeholder: 'C.C. 12345678' },
                { key: 'bio', label: 'Biografía / Especialidad', placeholder: 'Ej: Especialista en limpieza profunda con 5 años de experiencia...', multiline: true },
            ];
        }
        // CLIENT
        return [
            { key: 'city', label: 'Ciudad', placeholder: 'Ej: Medellín' },
            { key: 'address', label: 'Dirección', placeholder: 'Ej: Calle 10 # 20-30' },
            { key: 'phone_number', label: 'Teléfono', placeholder: 'Ej: +573001234567', keyboardType: 'phone-pad' },
        ];
    };

    const fields = getFields();

    return (
        <View style={styles.section}>
            <Text style={styles.sectionTitle}>
                {role === 'WORKER' ? 'Información Profesional' : 'Información de contacto'}
            </Text>
            {fields.map(({ key, label, placeholder, keyboardType, multiline }) => (
                <View key={key} style={styles.row}>
                    <Text style={styles.label}>{label}</Text>
                    {isEditing ? (
                        <TextInput
                            style={[styles.input, multiline && { minHeight: 80, textAlignVertical: 'top' }]}
                            value={(data as any)[key] ?? ''}
                            onChangeText={(val) => onChange(key, val)}
                            placeholder={placeholder}
                            placeholderTextColor={colors.textMuted}
                            keyboardType={keyboardType ?? 'default'}
                            multiline={multiline}
                        />
                    ) : (
                        <Text style={[styles.value, !(data as any)[key] && styles.empty]}>
                            {(data as any)[key] || 'No especificado'}
                        </Text>
                    )}
                </View>
            ))}
        </View>
    );
}
