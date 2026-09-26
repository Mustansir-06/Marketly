import ImageKit from '@imagekit/nodejs';
import config from '../config/config.js';

export const uploadFiles=async(buffer:Buffer)=>{
    const client = new ImageKit({
        privateKey: config.IMAGEKIT_PRIVATE_KEY
    });
    const response = await client.files.upload({
        file: buffer.toString("base64"),
        fileName: 'products.jpg',
    });
    return response
}
