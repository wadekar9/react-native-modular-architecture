import { IMediaFile } from '@shared/types/dto';
import { useCallback } from 'react';
import { launchCamera, launchImageLibrary, MediaType } from 'react-native-image-picker';
import { requestCameraPermissions, requestMediaPermissions } from './permissions';
import { generateImageFileSchema } from './files.helper';

export const useImagePicker = (onSelect: (e: IMediaFile[]) => void, onPermissionFailed?: (mode: 'media' | 'camera') => void) => {

    const openGallery = useCallback(async (type: MediaType = 'photo', limit = 0) => {
        try {

            const isPermissionAvailable = await requestMediaPermissions();

            if (!isPermissionAvailable) {
                onPermissionFailed && onPermissionFailed('media');
                return;
            }

            const response = await launchImageLibrary({ mediaType: type, selectionLimit: limit });

            if (response.assets && !response.didCancel) {
                onSelect(response.assets.map((image) => generateImageFileSchema(image)));
            }
        } catch (error) {
            console.log("ERROR", error);
        }
    }, [onSelect, onPermissionFailed]);

    const openCamera = useCallback(async (type: MediaType = 'photo') => {
        try {

            const isPermissionAvailable = await requestCameraPermissions();

            if (!isPermissionAvailable) {
                onPermissionFailed && onPermissionFailed('camera');
                return;
            }

            const response = await launchCamera({ mediaType: type });

            if (response.assets && !response.didCancel) {
                onSelect(response.assets.map((image) => generateImageFileSchema(image)));
            }
        } catch (error) {
            console.log("ERROR", error);
        }
    }, [onSelect, onPermissionFailed]);

    return { openGallery, openCamera };
};