import React, { useState, useMemo } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, Alert, ActivityIndicator, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { Camera, FileText, CheckCircle, ChevronLeft, Upload, AlertCircle } from 'lucide-react-native';
import { useTheme } from '../context/ThemeContext';
import { RADIUS } from '../constants/theme';
import { Card } from '../components/ui/NativeCard';
import { Button } from '../components/ui/NativeButton';
import { useSubmitVerification } from '../hooks/useVerification';
import { getStyles } from '../styles/verification.styles';

export default function VerificationScreen() {
    const { colors } = useTheme();
    const router = useRouter();
    const [idNumber, setIdNumber] = useState('');
    const [frontImage, setFrontImage] = useState<any>(null);
    const [backImage, setBackImage] = useState<any>(null);
    const [step, setStep] = useState(1);

    const { mutate: submit, isPending } = useSubmitVerification();
    const styles = useMemo(() => getStyles(colors), [colors]);

    const pickImage = async (side: 'front' | 'back') => {
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Permiso denegado', 'Necesitamos acceso a la cámara para verificar tu identidad.');
            return;
        }

        let result = await ImagePicker.launchCameraAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 0.7,
        });

        if (!result.canceled) {
            if (side === 'front') setFrontImage(result.assets[0]);
            else setBackImage(result.assets[0]);
        }
    };

    const handleSubmit = () => {
        if (!frontImage || !backImage) {
            Alert.alert('Faltan documentos', 'Por favor sube ambas caras de tu documento.');
            return;
        }

        if (!idNumber.trim()) {
            Alert.alert('Falta documento', 'Por favor ingresa tu número de documento de identidad.');
            return;
        }

        submit({
            identity_document: idNumber.trim(),
            document_front: frontImage,
            document_back: backImage,
        }, {
            onSuccess: () => {
                setStep(4);
            },
            onError: (error: any) => {
                Alert.alert('Error', error?.message || 'Hubo un problema subiendo los documentos.');
            }
        });
    };

    if (step === 4) {
        return (
            <View style={styles.successContainer}>
                <CheckCircle size={80} color={colors.success} />
                <Text style={styles.successTitle}>¡Documentos Enviados!</Text>
                <Text style={styles.successDesc}>
                    Estamos validando tu información. Te notificaremos en cuanto tu perfil sea aprobado para que puedas empezar a trabajar.
                </Text>
                <Button
                    title="Volver al Inicio"
                    onPress={() => router.replace('/(tabs)')}
                    style={{ width: '100%', marginTop: 20 }}
                />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()}>
                    <ChevronLeft size={24} color={colors.text} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Verificación de Identidad</Text>
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                <View style={styles.stepIndicator}>
                    {[1, 2, 3].map(s => (
                        <View
                            key={s}
                            style={[
                                styles.stepDot,
                                { backgroundColor: s <= step ? colors.primary : colors.border }
                            ]}
                        />
                    ))}
                </View>

                {step === 1 && (
                    <View>
                        <Text style={styles.title}>Datos del Documento</Text>
                        <Text style={styles.description}>
                            Ingresa tu número de identificación y captura la parte frontal de tu cédula.
                        </Text>

                        <View style={{ marginBottom: 20 }}>
                            <Text style={{ fontSize: 14, fontWeight: '600', color: colors.text, marginBottom: 8 }}>
                                Número de Identificación
                            </Text>
                            <TextInput
                                style={{
                                    backgroundColor: colors.surface,
                                    borderWidth: 1,
                                    borderColor: colors.border,
                                    borderRadius: RADIUS.md,
                                    padding: 12,
                                    color: colors.text,
                                    fontSize: 16,
                                }}
                                value={idNumber}
                                onChangeText={setIdNumber}
                                placeholder="Ej: 123456789"
                                placeholderTextColor={colors.textMuted}
                                keyboardType="numeric"
                            />
                        </View>

                        <Text style={{ fontSize: 14, fontWeight: '600', color: colors.text, marginBottom: 8 }}>
                            Foto Frontal
                        </Text>
                        <TouchableOpacity style={styles.uploadCard} onPress={() => pickImage('front')}>
                            {frontImage ? (
                                <View style={{ width: '100%', alignItems: 'center' }}>
                                    <Image source={{ uri: frontImage.uri }} style={styles.preview} />
                                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 16 }}>
                                        <Camera size={20} color={colors.primary} />
                                        <Text style={{ color: colors.primary, fontWeight: '700' }}>Repetir foto</Text>
                                    </View>
                                </View>
                            ) : (
                                <>
                                    <Camera size={40} color={colors.primary} />
                                    <Text style={{ fontWeight: '700', color: colors.primary }}>Tomar foto frontal</Text>
                                </>
                            )}
                        </TouchableOpacity>
                        <Button
                            title="Siguiente"
                            disabled={!frontImage}
                            onPress={() => setStep(2)}
                        />
                    </View>
                )}

                {step === 2 && (
                    <View>
                        <Text style={styles.title}>Foto Posterior</Text>
                        <Text style={styles.description}>
                            Ahora captura la parte de atrás de tu documento.
                        </Text>
                        <TouchableOpacity style={styles.uploadCard} onPress={() => pickImage('back')}>
                            {backImage ? (
                                <View style={{ width: '100%', alignItems: 'center' }}>
                                    <Image source={{ uri: backImage.uri }} style={styles.preview} />
                                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 16 }}>
                                        <Camera size={20} color={colors.primary} />
                                        <Text style={{ color: colors.primary, fontWeight: '700' }}>Repetir foto</Text>
                                    </View>
                                </View>
                            ) : (
                                <>
                                    <Camera size={40} color={colors.primary} />
                                    <Text style={{ fontWeight: '700', color: colors.primary }}>Tomar foto posterior</Text>
                                </>
                            )}
                        </TouchableOpacity>
                        <View style={{ flexDirection: 'row', gap: 12 }}>
                            <Button
                                title="Atrás"
                                variant="outline"
                                onPress={() => setStep(1)}
                                style={{ flex: 1 }}
                            />
                            <Button
                                title="Siguiente"
                                disabled={!backImage}
                                onPress={() => setStep(3)}
                                style={{ flex: 2 }}
                            />
                        </View>
                    </View>
                )}

                {step === 3 && (
                    <View>
                        <Text style={styles.title}>Confirmar Envío</Text>
                        <Text style={styles.description}>
                            Revisa que ambas fotos se vean bien antes de enviarlas a nuestro equipo de seguridad.
                        </Text>

                        <View style={{ flexDirection: 'row', gap: 12, marginBottom: 20 }}>
                            <Card style={{ flex: 1, padding: 8 }}>
                                <Image source={{ uri: frontImage?.uri }} style={{ height: 100, borderRadius: 8 }} />
                                <Text style={{ textAlign: 'center', fontSize: 10, marginTop: 4, fontWeight: '600' }}>FRONTAL</Text>
                            </Card>
                            <Card style={{ flex: 1, padding: 8 }}>
                                <Image source={{ uri: backImage?.uri }} style={{ height: 100, borderRadius: 8 }} />
                                <Text style={{ textAlign: 'center', fontSize: 10, marginTop: 4, fontWeight: '600' }}>POSTERIOR</Text>
                            </Card>
                        </View>

                        <Card style={{ backgroundColor: colors.warning + '10', borderColor: colors.warning + '30', marginBottom: 24 }}>
                            <View style={{ flexDirection: 'row', gap: 12, padding: 12 }}>
                                <AlertCircle size={20} color={colors.warning} />
                                <Text style={{ flex: 1, fontSize: 13, color: colors.warning, fontWeight: '500' }}>
                                    Al enviar estos documentos, confirmas que son tuyos y que la información proporcionada es verídica.
                                </Text>
                            </View>
                        </Card>

                        <Button
                            title="Enviar para Revisión"
                            loading={isPending}
                            onPress={handleSubmit}
                        />
                        <TouchableOpacity
                            onPress={() => setStep(2)}
                            style={{ alignSelf: 'center', marginTop: 16 }}
                            disabled={isPending}
                        >
                            <Text style={{ color: colors.textLight, fontWeight: '600' }}>Editar fotos</Text>
                        </TouchableOpacity>
                    </View>
                )}
            </ScrollView>
        </View>
    );
}
