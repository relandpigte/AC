using System;
using System.IO;
using System.Threading.Tasks;
using Abp.Configuration;
using Abp.Extensions;
using Academically.Application.Shared.Services;
using Academically.Configuration;
using Amazon.S3;
using Amazon.S3.Model;
using Amazon.S3.Transfer;
using Microsoft.Extensions.Configuration;

namespace Academically.Aws.Services
{
    public class S3Service : IFileManagerService, IDisposable
    {
        private readonly IAmazonS3 _client;
        private readonly ISettingManager _settingManager;

        private string bucket;

        public S3Service(IConfiguration configuration, ISettingManager settingManager)
        {
            _settingManager = settingManager;
            bucket = settingManager.GetSettingValue(AppSettingNames.Aws_S3_AssetsBucket);
            var options = configuration.GetAWSOptions();
            _client = options.CreateServiceClient<IAmazonS3>();
        }

        public async Task<byte[]> DownloadAsync(string fileName, string folder = null)
        {
            if (!string.IsNullOrWhiteSpace(folder))
            {
                fileName = $"{folder}/{fileName}";
            }

            GetObjectRequest request = new GetObjectRequest
            {
                BucketName = bucket,
                Key = fileName,
            };
            using (GetObjectResponse response = await _client.GetObjectAsync(request))
            using (Stream responseStream = response.ResponseStream)
            {
                byte[] buffer = new byte[responseStream.Length];
                using (MemoryStream ms = new MemoryStream())
                {
                    int read;
                    while ((read = await responseStream.ReadAsync(buffer, 0, buffer.Length)) > 0)
                    {
                        ms.Write(buffer, 0, read);
                    }
                    return ms.ToArray();
                }
            }
        }

        public async Task UploadAsync(string fileName, byte[] fileBytes, string folder = null)
        {
            if (!string.IsNullOrWhiteSpace(folder))
            {
                fileName = $"{folder}/{fileName}";
            }

            var fileTransferUtility = new TransferUtility(_client);
            using (MemoryStream ms = new MemoryStream())
            {
                ms.Write(fileBytes, 0, fileBytes.Length);
                ms.Seek(0, SeekOrigin.Begin);

                string extension = Path.GetExtension(fileName);
                string contentType = extension == ".png" ? "image/png" : "images/jpeg";
                var fileTransferUtilityRequest = new TransferUtilityUploadRequest
                {
                    BucketName = bucket,
                    InputStream = ms,
                    StorageClass = S3StorageClass.Standard,
                    PartSize = fileBytes.Length,
                    Key = fileName,
                    CannedACL = S3CannedACL.PublicRead,
                    ContentType = contentType,
                };

                await fileTransferUtility.UploadAsync(fileTransferUtilityRequest);
            }
        }

        public async Task DeleteAsync(string folder, string fileName)
        {
            if (!string.IsNullOrWhiteSpace(folder))
            {
                fileName = $"{folder}/{fileName}";
            }
            await _client.DeleteObjectAsync(bucket, fileName);
        }

        public void Dispose()
        {
            if (_client != null)
                _client.Dispose();
        }

        public string GetFileUrl(string fileName, long userId, string folderSetting = null)
        {
            if (!fileName.IsNullOrWhiteSpace())
            {
                var s3Bucket = GetDirectoryUrl();
                if (!folderSetting.IsNullOrWhiteSpace())
                {
                    string folder = _settingManager.GetSettingValue(folderSetting);
                    return $"{s3Bucket}/{userId}/{folder}/{fileName}";
                }
                return $"{s3Bucket}/{userId}/{fileName}";
            }

            return string.Empty;
        }

        public string GetDirectoryUrl()
        {
            string region = _settingManager.GetSettingValue(AppSettingNames.Aws_Region);
            string bucket = _settingManager.GetSettingValue(AppSettingNames.Aws_S3_AssetsBucket);
            return $"https://{bucket}.s3.{region}.amazonaws.com";
        }
    }
}
