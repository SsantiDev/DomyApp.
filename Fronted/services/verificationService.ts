import api from './api';

export interface VerificationData {
    identity_document: string;
    document_front: any; // Image picked via expo-image-picker
    document_back: any;  // Image picked via expo-image-picker
}

export const submitVerification = async (data: VerificationData) => {
    const formData = new FormData();
    formData.append('identity_document', data.identity_document);

    // Expecting image data derived from expo-image-picker (uri, name, type)
    if (data.document_front) {
        formData.append('document_front', {
            uri: data.document_front.uri,
            name: 'front.jpg',
            type: 'image/jpeg',
        } as any);
    }

    if (data.document_back) {
        formData.append('document_back', {
            uri: data.document_back.uri,
            name: 'back.jpg',
            type: 'image/jpeg',
        } as any);
    }

    const response = await api.patch('/users/profile/worker/submit-verification/', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });

    return response.data;
};
