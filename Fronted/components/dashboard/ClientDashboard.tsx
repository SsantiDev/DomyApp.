import React from 'react';
import { StyleSheet, ScrollView, View, Text } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { UserMenu } from '../ui/UserMenu';
import { Button } from '../ui/NativeButton';
import { Card } from '../ui/NativeCard';
import { SPACING, TYPOGRAPHY } from '../../constants/theme';

export default function ClientDashboard() {
    const { colors } = useTheme();

    return (
        <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
            <View style={styles.header}>
                <UserMenu />
                <View style={styles.greetingHeader}>
                    <Text style={[styles.greeting, { color: colors.text }]}>¡Hola!</Text>
                    <Text style={[styles.subtitle, { color: colors.textLight }]}>¿Qué servicio necesitas hoy?</Text>
                </View>
            </View>

            <View style={styles.section}>
                <Text style={[styles.sectionTitle, { color: colors.text }]}>Categorías</Text>
                <View style={styles.row}>
                    <Card style={[styles.categoryCard, { backgroundColor: colors.categoryBg }]}>
                        <Text style={styles.cardEmoji}>🧹</Text>
                        <Text style={[styles.categoryName, { color: colors.text }]}>Limpieza</Text>
                    </Card>
                    <Card style={[styles.categoryCard, { backgroundColor: colors.categoryBg }]}>
                        <Text style={styles.cardEmoji}>🧺</Text>
                        <Text style={[styles.categoryName, { color: colors.text }]}>Lavandería</Text>
                    </Card>
                </View>
            </View>

            <Button
                title="Solicitar servicio"
                onPress={() => console.log('Solicitar')}
            />
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: SPACING.lg,
    },
    header: {
        marginBottom: SPACING.xl,
    },
    greetingHeader: {
        marginTop: SPACING.lg,
    },
    greeting: {
        fontSize: TYPOGRAPHY.h1.fontSize,
        fontWeight: TYPOGRAPHY.h1.fontWeight,
    },
    subtitle: {
        fontSize: TYPOGRAPHY.body.fontSize,
        marginTop: SPACING.xs
    },
    section: {
        marginBottom: SPACING.xl
    },
    sectionTitle: {
        fontSize: TYPOGRAPHY.h3.fontSize,
        fontWeight: TYPOGRAPHY.h3.fontWeight,
        marginBottom: SPACING.md,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    categoryCard: {
        width: '48%',
        alignItems: 'center'
    },
    categoryName: {
        fontSize: TYPOGRAPHY.caption.fontSize,
        fontWeight: '600'
    },
    cardEmoji: {
        fontSize: 30,
        marginBottom: SPACING.sm
    },
});
