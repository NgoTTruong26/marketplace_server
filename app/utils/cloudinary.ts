import cloudinary from '#config/cloudinary'
import env from '#start/env'
import { CloudinaryStorage } from 'multer-storage-cloudinary'

export const cloudinaryStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: () => ({
    folder: env.get('CLOUDINARY_CLOUD_NAME'),
  }),
})
