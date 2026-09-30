import RNFS from 'react-native-fs';
import {v4 as uuidv4} from 'uuid';

export async function savePhoto(sourceUri: string): Promise<string> {
  const filename = `plant-${uuidv4()}.jpg`;
  const destPath = `${RNFS.DocumentDirectoryPath}/${filename}`;
  await RNFS.copyFile(sourceUri, destPath);
  return filename;
}

export function resolvePhotoUri(filename: string): string {
  return `file://${RNFS.DocumentDirectoryPath}/${filename}`;
}

export function readPhotoAsBase64(filename: string): Promise<string> {
  const path = `${RNFS.DocumentDirectoryPath}/${filename}`;
  return RNFS.readFile(path, 'base64');
}
