import React, { useEffect, useRef, useMemo } from 'react';
import { View, Text, Animated, TouchableOpacity, Easing } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { CheckCircle, User, ChevronRight, Clock } from 'lucide-react-native';
import { getStyles } from './ActiveServiceCard.styles';
import { ServiceRequest } from '../../types/services';

const STATUS_STEPS = ['PENDING', 'ACCEPTED', 'IN_PROGRESS'] as const;
const STATUS_LABELS = { PENDING: 'Buscando', ACCEPTED: 'Confirmado', IN_PROGRESS: 'En curso' };
type StepStatus = typeof STATUS_STEPS[number];

interface Props {
    activeRequest: ServiceRequest;
    onNavigate: (id: number | string | undefined) => void;
}

const STATUS_COLOR_KEY: Record<StepStatus, 'warning' | 'primary' | 'success'> = {
    PENDING: 'warning',
    ACCEPTED: 'primary',
    IN_PROGRESS: 'success',
};

export function ActiveServiceCard({ activeRequest, onNavigate }: Props) {
    const { colors } = useTheme();
    const styles = useMemo(() => getStyles(colors), [colors]);

    const status = activeRequest.status || 'PENDING';
    const currentStep = STATUS_STEPS.indexOf(status as StepStatus);
    const colorKey = STATUS_COLOR_KEY[status as StepStatus] ?? 'primary';
    const statusColor = colors[colorKey];

    // Per-dot spring scale (0.3 → 1 when dot activates)
    const dotScales = useRef(STATUS_STEPS.map(() => new Animated.Value(0.3))).current;

    // Expanding ring on current dot
    const pulseScale = useRef(new Animated.Value(1)).current;
    const pulseOpacity = useRef(new Animated.Value(0.65)).current;

    // Slow breathing on current dot
    const breatheScale = useRef(new Animated.Value(1)).current;

    // Line fill (2 lines for 3 steps)
    const lineAnims = useRef([new Animated.Value(0), new Animated.Value(0)]).current;

    // Worker avatar pulse (IN_PROGRESS only)
    const avatarPulse = useRef(new Animated.Value(1)).current;

    // Dot spring-in when activated
    useEffect(() => {
        STATUS_STEPS.forEach((_, i) => {
            if (i <= currentStep) {
                Animated.spring(dotScales[i], {
                    toValue: 1,
                    friction: 5,
                    tension: 100,
                    useNativeDriver: true,
                }).start();
            }
        });
    }, [currentStep]);

    // Radar pulse loop — restarts when status changes
    useEffect(() => {
        pulseScale.setValue(1);
        pulseOpacity.setValue(0.65);
        const loop = Animated.loop(
            Animated.parallel([
                Animated.timing(pulseScale, {
                    toValue: 2.6,
                    duration: 1500,
                    easing: Easing.out(Easing.ease),
                    useNativeDriver: true,
                }),
                Animated.timing(pulseOpacity, {
                    toValue: 0,
                    duration: 1500,
                    easing: Easing.out(Easing.ease),
                    useNativeDriver: true,
                }),
            ])
        );
        loop.start();
        return () => loop.stop();
    }, [status]);

    // Breathing loop — restarts when status changes
    useEffect(() => {
        breatheScale.setValue(1);
        const loop = Animated.loop(
            Animated.sequence([
                Animated.timing(breatheScale, {
                    toValue: 1.18,
                    duration: 950,
                    easing: Easing.inOut(Easing.ease),
                    useNativeDriver: true,
                }),
                Animated.timing(breatheScale, {
                    toValue: 1,
                    duration: 950,
                    easing: Easing.inOut(Easing.ease),
                    useNativeDriver: true,
                }),
            ])
        );
        loop.start();
        return () => loop.stop();
    }, [status]);

    // Lines animate fill when step advances
    useEffect(() => {
        lineAnims.forEach((anim, i) => {
            Animated.timing(anim, {
                toValue: i < currentStep ? 1 : 0,
                duration: 550,
                delay: i * 120,
                easing: Easing.out(Easing.cubic),
                useNativeDriver: false,
            }).start();
        });
    }, [currentStep]);

    // Avatar pulse only for IN_PROGRESS
    useEffect(() => {
        if (status !== 'IN_PROGRESS') {
            avatarPulse.setValue(1);
            return;
        }
        const loop = Animated.loop(
            Animated.sequence([
                Animated.timing(avatarPulse, {
                    toValue: 1.14,
                    duration: 750,
                    easing: Easing.inOut(Easing.ease),
                    useNativeDriver: true,
                }),
                Animated.timing(avatarPulse, {
                    toValue: 1,
                    duration: 750,
                    easing: Easing.inOut(Easing.ease),
                    useNativeDriver: true,
                }),
            ])
        );
        loop.start();
        return () => loop.stop();
    }, [status]);

    return (
        <View
            style={[
                styles.statusCard,
                { borderColor: statusColor + '38', shadowColor: statusColor },
            ]}
        >
            {/* ── Progress dots + lines ─────────────────────────────────── */}
            <View style={styles.progressRow}>
                {STATUS_STEPS.map((step, i) => {
                    const isCompleted = i < currentStep;
                    const isCurrent = i === currentStep;
                    const dotColor = i <= currentStep ? statusColor : colors.border;

                    return (
                        <React.Fragment key={step}>
                            <View style={styles.dotWrapper}>
                                {/* Expanding ring — current dot only */}
                                {isCurrent && (
                                    <Animated.View
                                        style={[
                                            styles.pulseRing,
                                            {
                                                borderColor: statusColor,
                                                transform: [{ scale: pulseScale }],
                                                opacity: pulseOpacity,
                                            },
                                        ]}
                                    />
                                )}

                                {/* The dot */}
                                <Animated.View
                                    style={[
                                        styles.progressDot,
                                        {
                                            backgroundColor: dotColor,
                                            borderColor: dotColor,
                                            transform: [
                                                { scale: isCurrent ? breatheScale : dotScales[i] },
                                            ],
                                        },
                                    ]}
                                >
                                    {isCompleted && <CheckCircle size={11} color="#fff" />}
                                </Animated.View>
                            </View>

                            {/* Animated fill line */}
                            {i < STATUS_STEPS.length - 1 && (
                                <View style={styles.progressLineContainer}>
                                    <View style={styles.progressLineBase} />
                                    <Animated.View
                                        style={[
                                            styles.progressLineFill,
                                            {
                                                backgroundColor: statusColor,
                                                width: lineAnims[i].interpolate({
                                                    inputRange: [0, 1],
                                                    outputRange: ['0%', '100%'],
                                                }),
                                            },
                                        ]}
                                    />
                                </View>
                            )}
                        </React.Fragment>
                    );
                })}
            </View>

            {/* ── Labels ───────────────────────────────────────────────── */}
            <View style={styles.progressLabels}>
                {STATUS_STEPS.map((step, i) => (
                    <Text
                        key={step}
                        style={[
                            styles.progressLabel,
                            i === currentStep && { color: statusColor, fontWeight: '800' },
                            i < currentStep && { color: statusColor + 'aa' },
                        ]}
                    >
                        {STATUS_LABELS[step]}
                    </Text>
                ))}
            </View>

            <View style={styles.statusDivider} />

            {/* ── Service info ──────────────────────────────────────────── */}
            <Text style={styles.activeServiceName}>{activeRequest.category_name}</Text>
            <Text style={styles.addressText}>{activeRequest.address}</Text>

            {/* ── Worker / searching row ────────────────────────────────── */}
            {activeRequest.worker ? (
                <View style={styles.workerRow}>
                    <Animated.View
                        style={[
                            styles.avatarMini,
                            {
                                backgroundColor: statusColor,
                                transform: [{ scale: avatarPulse }],
                            },
                        ]}
                    >
                        <User size={15} color="#fff" />
                    </Animated.View>
                    <Text style={styles.workerText}>
                        {status === 'IN_PROGRESS'
                            ? 'Tu operaria está trabajando'
                            : 'Tu operaria está en camino'}
                    </Text>
                </View>
            ) : (
                <View style={styles.workerRow}>
                    <View style={[styles.avatarMini, { backgroundColor: colors.warning }]}>
                        <Clock size={14} color="#fff" />
                    </View>
                    <Text style={styles.workerText}>Buscando la mejor operaria para ti...</Text>
                </View>
            )}

            {/* ── Track button ──────────────────────────────────────────── */}
            <TouchableOpacity
                style={[styles.trackButton, { backgroundColor: statusColor + '14' }]}
                onPress={() => onNavigate(activeRequest.id)}
                activeOpacity={0.75}
            >
                <Text style={[styles.trackButtonText, { color: statusColor }]}>
                    Seguir mi servicio
                </Text>
                <ChevronRight size={15} color={statusColor} />
            </TouchableOpacity>
        </View>
    );
}
