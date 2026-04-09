import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, FlatList, KeyboardAvoidingView, Platform, ActivityIndicator, Modal } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { useChatMessages, useSendMessage } from '../../hooks/useChat';
import { useGetServiceDetail } from '../../hooks/useServices';
import { Message } from '../../types/chat';
import { Send, X, ShieldAlert, Users } from 'lucide-react-native';

import { useQueryClient } from '@tanstack/react-query';

export const ChatRoom = ({
    serviceId,
    visible,
    onClose,
    defaultTab = 'COORDINATION'
}: {
    serviceId: number;
    visible: boolean;
    onClose: () => void;
    defaultTab?: 'COORDINATION' | 'SUPPORT';
}) => {
    const { colors } = useTheme();
    const { user } = useAuth();
    const queryClient = useQueryClient();
    const [activeTab, setActiveTab] = useState<'COORDINATION' | 'SUPPORT'>(defaultTab);
    const [messageText, setMessageText] = useState('');
    const flatListRef = useRef<FlatList>(null);

    const handleClose = () => {
        // Force refresh service list data to update the unread counters
        queryClient.invalidateQueries({ queryKey: ['service-requests'] });
        queryClient.invalidateQueries({ queryKey: ['admin-services'] });
        onClose();
    };
    
    // Always force ADMIN to SUPPORT tab in UI logically
    const isSupport = activeTab === 'SUPPORT' || user?.role === 'ADMIN';

    const { data: messages, isLoading } = useChatMessages(serviceId, isSupport);
    const { mutate: sendMessage, isPending: isSending } = useSendMessage();
    const { data: serviceDetails } = useGetServiceDetail(serviceId);
    
    const unreadCoord = serviceDetails?.unread_coordination_count || 0;
    const unreadSupp = serviceDetails?.unread_support_count || 0;

    useEffect(() => {
        if (user?.role === 'ADMIN') {
            setActiveTab('SUPPORT'); // Admins primarily chat in support (or we can let them see both). Let's let them see both if they want, but default to SUPPORT
        } else {
            setActiveTab(defaultTab);
        }
    }, [defaultTab, user?.role, visible]);

    // Force refresh service list data to update the unread counters IMMEDIATELY when entering a tab
    useEffect(() => {
        if (visible) {
            queryClient.invalidateQueries({ queryKey: ['service-request', serviceId] });
            queryClient.invalidateQueries({ queryKey: ['service-requests'] });
            queryClient.invalidateQueries({ queryKey: ['admin-services'] });
        }
    }, [activeTab, visible]);

    const handleSend = () => {
        if (!messageText.trim()) return;

        sendMessage({
            service_request: serviceId,
            is_support_chat: activeTab === 'SUPPORT',
            content: messageText.trim()
        }, {
            onSuccess: () => {
                setMessageText('');
                // Scroll down will happen automatically since data updates
            }
        });
    };

    const renderMessage = ({ item }: { item: Message }) => {
        const isMyMessage = item.sender === user?.id;
        const isIncidentResponse = item.content.startsWith('⚠️ [Respuesta a Incidencia]');

        return (
            <View style={[
                styles.messageWrapper,
                isMyMessage ? styles.myMessageWrapper : styles.otherMessageWrapper,
                isIncidentResponse && { width: '90%', maxWidth: '90%' }
            ]}>
                {!isMyMessage && (
                    <Text style={[styles.senderName, { color: colors.textMuted }]}>
                        {item.sender_name} {item.sender_role === 'ADMIN' ? '🛡️' : ''}
                    </Text>
                )}
                <View style={[
                    styles.messageBubble,
                    isIncidentResponse ? { backgroundColor: colors.warning + '15', borderColor: colors.warning, borderWidth: 1 }
                    : isMyMessage 
                        ? { backgroundColor: colors.primary } 
                        : { backgroundColor: colors.surface, borderColor: colors.border, borderWidth: 1 }
                ]}>
                    <Text style={[
                        styles.messageText,
                        isIncidentResponse ? { color: colors.text, fontWeight: '500' }
                        : isMyMessage ? { color: '#fff' } : { color: colors.text }
                    ]}>
                        {item.content}
                    </Text>
                    <Text style={[
                        styles.timestamp,
                        isIncidentResponse ? { color: colors.textMuted }
                        : isMyMessage ? { color: 'rgba(255,255,255,0.7)' } : { color: colors.textMuted }
                    ]}>
                        {new Date(item.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </Text>
                </View>
            </View>
        );
    };

    return (
        <Modal visible={visible} animationType="slide" presentationStyle="pageSheet" onRequestClose={handleClose}>
            <KeyboardAvoidingView 
                style={[{ flex: 1, backgroundColor: colors.background }]} 
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            >
                {/* Header */}
                <View style={[styles.header, { borderBottomColor: colors.border, backgroundColor: colors.surface }]}>
                    <View>
                        <Text style={[styles.title, { color: colors.text }]}>Servicio #{serviceId}</Text>
                        <Text style={[styles.subtitle, { color: colors.textMuted }]}>
                            {activeTab === 'SUPPORT' ? 'Soporte Técnico' : 'Coordinación'}
                        </Text>
                    </View>
                    <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
                        <X size={24} color={colors.text} />
                    </TouchableOpacity>
                </View>

                {/* Tabs (Only if not Admin, or if you want Admin to see coordination as well) */}
                <View style={styles.tabContainer}>
                    <TouchableOpacity 
                        style={[styles.tab, activeTab === 'COORDINATION' && { borderBottomColor: colors.primary, borderBottomWidth: 2 }]}
                        onPress={() => setActiveTab('COORDINATION')}
                    >
                        <Users size={18} color={activeTab === 'COORDINATION' ? colors.primary : colors.textMuted} />
                        <Text style={[styles.tabText, { color: activeTab === 'COORDINATION' ? colors.primary : colors.textMuted }]}>
                            Operaria / Cliente
                        </Text>
                        {unreadCoord > 0 && <View style={[styles.badge, { backgroundColor: colors.danger }]} />}
                    </TouchableOpacity>
                    
                    <TouchableOpacity 
                        style={[styles.tab, activeTab === 'SUPPORT' && { borderBottomColor: colors.primary, borderBottomWidth: 2 }]}
                        onPress={() => setActiveTab('SUPPORT')}
                    >
                        <ShieldAlert size={18} color={activeTab === 'SUPPORT' ? colors.primary : colors.textMuted} />
                        <Text style={[styles.tabText, { color: activeTab === 'SUPPORT' ? colors.primary : colors.textMuted }]}>
                            Soporte
                        </Text>
                        {unreadSupp > 0 && <View style={[styles.badge, { backgroundColor: colors.danger }]} />}
                    </TouchableOpacity>
                </View>

                {/* Chat Area */}
                {isLoading ? (
                    <View style={styles.center}>
                        <ActivityIndicator size="large" color={colors.primary} />
                    </View>
                ) : (
                    <FlatList
                        ref={flatListRef}
                        data={messages}
                        keyExtractor={item => item.id.toString()}
                        renderItem={renderMessage}
                        contentContainerStyle={styles.chatContainer}
                        onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
                        onLayout={() => flatListRef.current?.scrollToEnd({ animated: true })}
                        ListEmptyComponent={
                            <View style={styles.centerEmpty}>
                                <Text style={{ color: colors.textMuted, textAlign: 'center', marginTop: 40 }}>
                                    No hay mensajes en este chat aún.{'\n'}¡Escribe el primero!
                                </Text>
                            </View>
                        }
                    />
                )}

                {/* Input Area */}
                <View style={[styles.inputContainer, { borderTopColor: colors.border, backgroundColor: colors.surface }]}>
                    <TextInput
                        style={[styles.textInput, { color: colors.text, backgroundColor: colors.background, borderColor: colors.border }]}
                        placeholder="Escribe un mensaje..."
                        placeholderTextColor={colors.textMuted}
                        value={messageText}
                        onChangeText={setMessageText}
                        multiline
                        maxLength={1000}
                    />
                    <TouchableOpacity 
                        style={[styles.sendButton, { backgroundColor: messageText.trim() ? colors.primary : colors.textMuted }]}
                        onPress={handleSend}
                        disabled={!messageText.trim() || isSending}
                    >
                        {isSending ? (
                            <ActivityIndicator size="small" color="#fff" />
                        ) : (
                            <Send size={20} color="#fff" />
                        )}
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </Modal>
    );
};

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
        paddingTop: Platform.OS === 'ios' ? 60 : 20,
        borderBottomWidth: 1,
    },
    title: { fontSize: 18, fontWeight: 'bold' },
    subtitle: { fontSize: 12, marginTop: 2 },
    closeButton: { padding: 5 },
    tabContainer: {
        flexDirection: 'row',
        zIndex: 10,
        elevation: 2,
    },
    tab: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 12,
        gap: 8,
    },
    tabText: {
        fontWeight: '600',
        fontSize: 14,
    },
    chatContainer: {
        padding: 16,
        paddingBottom: 20,
    },
    center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    centerEmpty: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    messageWrapper: {
        marginBottom: 16,
        maxWidth: '85%',
    },
    myMessageWrapper: {
        alignSelf: 'flex-end',
    },
    otherMessageWrapper: {
        alignSelf: 'flex-start',
    },
    senderName: {
        fontSize: 11,
        marginBottom: 4,
        marginLeft: 4,
    },
    messageBubble: {
        padding: 12,
        borderRadius: 16,
    },
    messageText: {
        fontSize: 15,
        lineHeight: 20,
    },
    timestamp: {
        fontSize: 10,
        alignSelf: 'flex-end',
        marginTop: 4,
    },
    inputContainer: {
        flexDirection: 'row',
        padding: 12,
        paddingBottom: Platform.OS === 'ios' ? 30 : 12,
        borderTopWidth: 1,
        alignItems: 'flex-end',
    },
    textInput: {
        flex: 1,
        minHeight: 44,
        maxHeight: 120,
        borderWidth: 1,
        borderRadius: 22,
        paddingHorizontal: 16,
        paddingTop: 12,
        paddingBottom: 12,
        fontSize: 15,
        marginRight: 12,
    },
    sendButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        justifyContent: 'center',
        alignItems: 'center',
    },
    badge: {
        position: 'absolute',
        top: 8,
        right: 15,
        width: 8,
        height: 8,
        borderRadius: 4,
    }
});
