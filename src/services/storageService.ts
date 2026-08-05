import storage from '@react-native-firebase/storage';

export const uploadImage = async (uri: string, folder: string): Promise<string> => {
  const filename = `${folder}/${Date.now()}_${Math.floor(Math.random() * 10000)}.jpg`;
  const reference = storage().ref(filename);
  await reference.putFile(uri);
  const url = await reference.getDownloadURL();
  return url;
};

export const uploadMultipleImages = async (uris: string[], folder: string): Promise<string[]> => {
  const uploadPromises = uris.map((uri) => uploadImage(uri, folder));
  return Promise.all(uploadPromises);
};
