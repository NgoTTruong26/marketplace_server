import { v2 as cloudinary } from 'cloudinary'

interface UploadResult {
  status: boolean
  url: string
}

export class CloudinaryService {
  static async upload(filePath: string): Promise<UploadResult> {
    try {
      const response = await cloudinary.uploader.upload(filePath, { folder: 'test' })
      // console.log(response)
      return { status: true, url: response.secure_url }
    } catch (error) {
      return { status: false, url: (error as Error).message }
    }
  }
}

export default CloudinaryService
