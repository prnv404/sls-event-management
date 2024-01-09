/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable prettier/prettier */
import S3 from "aws-sdk/clients/s3";

const configs = {
    bucketName: process.env.BUCKET_NAME!,
  accessKey: process.env.ACCESS_KEY!,
  secretKey: process.env.AWS_SECRET_ACCESS_KEY!,
};

export class AWS {
  async s3GetSignedUrl(data: {
    fileName: string;
    extension: string;
    mediaType: string;
  }) {
    const s3 = new S3({
      credentials: {
        accessKeyId: configs.accessKey!,
        secretAccessKey: configs.secretKey!,
      },
    });
    const params = {
      Bucket: configs.bucketName,
      Key: `${data.fileName}.${data.extension}`,
      Expires: 300,
      ContentType: `${data.mediaType}/${data.extension}`,
    };

    const url = await s3.getSignedUrlPromise("putObject", params);
    return url;
  }

  async signedUrlAcess(key:any) {
    const s3 = new S3({
      credentials: {
        accessKeyId: configs.accessKey,
        secretAccessKey: configs.secretKey,
      },
    });

    const params = {
      Bucket: configs.bucketName,
      Key: key,
      Expires: 3600, 
    };

      const url = await s3.getSignedUrlPromise("getObject", params);
      return url
  }
}
