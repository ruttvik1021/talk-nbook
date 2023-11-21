export const base64ToByteArray = (base64Data: string) => {
  if (!base64Data) return '';
  const imageData = Buffer.from(base64Data, 'base64');
  return imageData;
};

export const byteArrayToBase64 = (imageData: any) => {
  if (!imageData) return '';
  const imageBuffer = Buffer.from(imageData, 'binary');

  const base64String = imageBuffer.toString('base64');

  console.log(base64String);
  return base64String;
};
