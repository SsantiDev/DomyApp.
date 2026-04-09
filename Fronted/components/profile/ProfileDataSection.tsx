import React, { useMemo } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import { ClientProfile, WorkerProfile } from '../../types/auth';
import { useTheme } from '../../context/ThemeContext';
import { useCategories } from '../../hooks/useServices';
import { getStyles } from './ProfileDataSection.styles';

type ProfileData = Partial<ClientProfile & WorkerProfile>;

interface Props {
    data: ProfileData;
    isEditing: boolean;
    onChange: (field: string, value: string) => void;
    role: 'CLIENT' | 'WORKER';
    selectedCategories?: number[];
    onCategoryToggle?: (id: number) => void;
}

interface FieldConfig {
    key: string;
    label: string;
    placeholder: string;
    keyboardType?: 'default' | 'phone-pad' | 'email-address';
    multiline?: boolean;
}

export default function ProfileDataSection({
    data,
    isEditing,
    onChange,
    role,
    selectedCategories = [],
    onCategoryToggle,
}: Props) {
    const { colors } = useTheme();
    const styles = useMemo(() => getStyles(colors), [colors]);
    const { data: categories, isLoading: loadingCategories } = useCategories();

    const getFields = (): FieldConfig[] => {
        if (role === 'WORKER') {
            return [
                { key: 'identity_document', label: 'Documento de Identidad', placeholder: 'C.C. 12345678' },
                { key: 'bio', label: 'Biografía / Presentación', placeholder: 'Ej: Especialista en limpieza profunda con 5 años de experiencia...', multiline: true },
            ];
        }
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

            {role === 'WORKER' && (
                <View style={styles.row}>
                    <Text style={styles.label}>Servicios que ofrezco</Text>

                    {loadingCategories ? (
                        <ActivityIndicator size="small" color={colors.primary} style={{ marginTop: 8 }} />
                    ) : (
                        <View style={styles.chipsContainer}>
                            {categories?.map((cat) => {
                                const selected = selectedCategories.includes(cat.id);
                                return (
                                    <TouchableOpacity
                                        key={cat.id}
                                        onPress={() => isEditing && onCategoryToggle?.(cat.id)}
                                        activeOpacity={isEditing ? 0.7 : 1}
                                        style={[
                                            styles.chip,
                                            selected && styles.chipSelected,
                                            !isEditing && !selected && styles.chipDisabled,
                                        ]}
                                    >
                                        <Text style={[
                                            styles.chipText,
                                            selected && styles.chipTextSelected,
                                            !isEditing && !selected && styles.chipTextDisabled,
                                        ]}>
                                            {cat.name}
                                        </Text>
                                    </TouchableOpacity>
                                );
                            })}
                            {!isEditing && selectedCategories.length === 0 && (
                                <Text style={styles.empty}>No especificado</Text>
                            )}
                        </View>
                    )}
                </View>
            )}
        </View>
    );
}
