import { BadRequestException } from '@nestjs/common';
import * as sizeOf from 'image-size';
import { commonMessages } from './constants';

export const validateImageSize = (base64EncodedImage: string) => {
  // Extract the base64 data
  const base64Data = base64EncodedImage.replace(/^data:image\/\w+;base64,/, '');

  // Convert base64 to buffer
  const buffer = Buffer.from(base64Data, 'base64');

  // Check image type
  const type = sizeOf.default(buffer);
  const allowedTypes = ['jpg', 'jpeg', 'png'];

  if (!allowedTypes.includes(type.type)) {
    throw new BadRequestException(commonMessages.errors.invalidImageType);
  }

  // Check image size
  const maxSizeInBytes = 500 * 1024; // 500KB
  if (buffer.length > maxSizeInBytes) {
    throw new BadRequestException(commonMessages.errors.imageSizeExceeds);
  }

  return base64EncodedImage;
};
