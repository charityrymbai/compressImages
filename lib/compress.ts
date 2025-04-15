import imageCompression from 'browser-image-compression';

export const compressAndConvertToWebP = async (file: File, maxSizeMB: number) => {
  const options = {
    maxSizeMB: maxSizeMB,
    fileType: 'image/webp', 
    useWebWorker: true,
  };

  const compressedFile = await imageCompression(file, options);
  return compressedFile;
};
