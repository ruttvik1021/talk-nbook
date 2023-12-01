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
  ): Promise<UploadApiResponse | UploadApiErrorResponse> {
    const fileName = `${userEmail}-${new Date()}`;
    const folderName = this.configService.get('PROFILE_PIC_CLOUDINARY_FOLDER');
    return v2.uploader.upload(data, {
      public_id: fileName,
      folder: folderName,
    });
  }

  async uploadCertificateImage(
    data: string,
    userEmail: string,
    imageIndex: number,
  ): Promise<UploadApiResponse | UploadApiErrorResponse> {
    const fileName = `${userEmail}-${new Date()}-${imageIndex}`;
    const folderName = this.configService.get('CERTIFICATES_CLOUDINARY_FOLDER');
    return v2.uploader.upload(data, {
      public_id: fileName,
      folder: folderName,
    });
  }
}
