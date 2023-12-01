import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UploadApiErrorResponse, UploadApiResponse, v2 } from 'cloudinary';

@Injectable()
export class CloudinaryService {
  private readonly configService: ConfigService;
  constructor(configService: ConfigService) {
    this.configService = configService;
  }

  async uploadProfileImage(
    data: string,
    userEmail: string,
    userId: string,
  ): Promise<UploadApiResponse | UploadApiErrorResponse> {
    const fileName = `${userEmail}-${userId}`;
    const folderName = this.configService.get('PROFILE_PIC_CLOUDINARY_FOLDER');
    const filePath = `${folderName}/${fileName}`;

    let existingImage: UploadApiResponse | null = null;

    try {
      existingImage = await v2.api.resource(filePath);
    } catch (error) {
      if (error.http_code !== 404) {
        existingImage = null;
      }
    }

    if (existingImage) {
      await v2.uploader.destroy(filePath);
    }
    return v2.uploader.upload(data, {
      public_id: fileName,
      folder: folderName,
    });
  }

  async uploadCertificateImage(
    data: string,
    userEmail: string,
    imageIndex: number,
    userId: string,
  ): Promise<UploadApiResponse | UploadApiErrorResponse> {
    const fileName = `${userEmail}-${userId}-${imageIndex}`;
    const folderName = this.configService.get('CERTIFICATES_CLOUDINARY_FOLDER');
    const filePath = `${folderName}/${fileName}`;

    let existingImage: UploadApiResponse | null = null;

    try {
      existingImage = await v2.api.resource(filePath);
    } catch (error) {
      if (error.http_code !== 404) {
        existingImage = null;
      }
    }

    if (existingImage) {
      await v2.uploader.destroy(filePath);
    }
    return v2.uploader.upload(data, {
      public_id: fileName,
      folder: folderName,
    });
  }
}
