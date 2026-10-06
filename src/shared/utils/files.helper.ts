import type { IMediaFile } from '../types/common.types';
import type { DocumentPickerResponse } from '@react-native-documents/picker';
import type { Asset } from 'react-native-image-picker';
import * as mime from 'react-native-mime-types';

export const generateMediaFileSchema = (file: DocumentPickerResponse): IMediaFile => {
  const fileURL = file.uri;
  const filename = fileURL.split('/').pop();

  return {
    name: filename || file.name || 'unknown',
    type: file.type || (mime.lookup(fileURL) as string) || 'application/octet-stream',
    uri: fileURL,
  };
};

export const generateImageFileSchema = (file: Asset): IMediaFile => {
  const filename = file.uri?.split('/').pop();

  return {
    name: filename || file.fileName || 'unknown',
    type: file.type || (file.uri ? (mime.lookup(file.uri) as string) : 'image/jpeg') || 'image/jpeg',
    uri: file.uri ?? '',
  };
};

