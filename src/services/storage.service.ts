import { Injectable } from '@nestjs/common';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

@Injectable()
export class StorageService {
  S3_BUCKET = process.env.S3_BUCKET;
  s3 = new S3Client({
    region: process.env.S3_REGION,
    endpoint: process.env.S3_ENDPOINT,
    forcePathStyle: Boolean(process.env.AWS_USE_PATH_STYLE_ENDPOINT),
    credentials: {
      accessKeyId: process.env.S3_ACCESS_KEY,
      secretAccessKey: process.env.S3_SECRET_KEY,
    },
  });

  async upload(file, path, name): Promise<string | boolean> {
    return await this.s3_upload(file.buffer, this.S3_BUCKET, path, name);
  }
  get(path) {
    return process.env.S3_URL + `${path}`;
  }
  async s3_upload(file, bucket, path, name): Promise<string | boolean> {
    const uploadParams = {
      Bucket: bucket,
      Key: path + '/' + String(name),
      Body: file,
    };

    const uploadCommand = new PutObjectCommand(uploadParams);

    try {
      await this.s3.send(uploadCommand);
      return this.get(`${path}/${name}`);
    } catch (err) {
      console.error('Error uploading file:', err);
      return false;
    }
  }

  // getS3FileDigest(bucketName, key) {
  //     return new Promise((resolve, reject) => {
  //         const params = {
  //             Bucket: bucketName,
  //             Key: key
  //         };

  //         const hash = crypto.createHash('sha1');
  //         const s3Stream = this.s3.getObject(params).createReadStream();

  //         s3Stream.on('data', (chunk) => {
  //             hash.update(chunk);
  //         });

  //         s3Stream.on('end', () => {
  //             resolve(hash.digest('hex'));
  //         });

  //         s3Stream.on('error', (err) => {
  //             reject(err);
  //         });
  //     });
  // }
}
