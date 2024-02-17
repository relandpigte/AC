using System;
using System.Collections.Generic;
using System.IO;
using System.Threading.Tasks;
using Abp.Configuration;
using Amazon.S3;
using Amazon.S3.Model;
using Amazon.S3.Transfer;
using Academically.Application.Shared.Services;
using Academically.Configuration;
using Microsoft.Extensions.Configuration;

namespace Academically.Aws.Services
{
    public class S3Service: IFileManagerService, IDisposable
    {
        private readonly IAmazonS3 _client;
        private readonly ISettingManager _settingManager;

        private string _region;
        private string _bucketPublic;
        private string _bucketPrivate;

        private const double timeoutDuration = 12;

        public S3Service(IConfiguration configuration, ISettingManager settingManager)
        {
            _settingManager = settingManager;

            _region = settingManager.GetSettingValue(AppSettingNames.Aws_Region);
            _bucketPublic = settingManager.GetSettingValue(AppSettingNames.Aws_S3_AssetsBucket);
            _bucketPrivate = settingManager.GetSettingValue(AppSettingNames.Aws_S3_SecureAssetsBucket);

            var options = configuration.GetAWSOptions();
            _client = options.CreateServiceClient<IAmazonS3>();
        }

        public async Task<byte[]> DownloadAsync(string fileName, string? folder = null, bool isPrivate = false)
        {
            if (!string.IsNullOrWhiteSpace(folder))
            {
                fileName = $"{folder}/{fileName}";
            }

            GetObjectRequest request = new GetObjectRequest
            {
                BucketName = isPrivate ? _bucketPrivate : _bucketPublic,
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

        public async Task UploadAsync(string fileName, byte[] fileBytes, string? folder = null, bool isPrivate = false)
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
                    BucketName = isPrivate ? _bucketPrivate : _bucketPublic,
                    InputStream = ms,
                    StorageClass = S3StorageClass.Standard,
                    PartSize = fileBytes.Length,
                    Key = fileName,
                    CannedACL = isPrivate ? S3CannedACL.Private : S3CannedACL.PublicRead,
                    ContentType = contentType,
                };

                await fileTransferUtility.UploadAsync(fileTransferUtilityRequest);
            }
        }

        public async Task MoveAsync(string srcFolder, string srcFileName, string destFolder, string destFileName, bool isPrivate = false)
        {
            if (!string.IsNullOrWhiteSpace(srcFolder))
            {
                srcFileName = $"{srcFolder}/{srcFileName}";
            }

            if (!string.IsNullOrWhiteSpace(destFolder))
            {
                destFileName = $"{destFolder}/{destFileName}";
            }

            await _client.CopyObjectAsync(new CopyObjectRequest
                {
                    SourceBucket = isPrivate ? _bucketPrivate : _bucketPublic,
                    SourceKey = srcFileName,
                    DestinationBucket = isPrivate ? _bucketPrivate : _bucketPublic,
                    DestinationKey = destFileName,
                    CannedACL = isPrivate ? S3CannedACL.Private : S3CannedACL.PublicRead,
                });

            await _client.DeleteObjectAsync(isPrivate ? _bucketPrivate : _bucketPublic, srcFileName);
        }

        public async Task DeleteAsync(string folder, string fileName, bool isPrivate = false)
        {
            if (!string.IsNullOrWhiteSpace(folder))
            {
                fileName = $"{folder}/{fileName}";
            }

            await _client.DeleteObjectAsync(isPrivate ? _bucketPrivate : _bucketPublic, fileName);
        }

        public string GeneratePublicFileUrl(string fileName, string folder)
        {
            if (string.IsNullOrWhiteSpace(fileName))
                return string.Empty;

            var urlSegments = new List<string>() { 
                $"https://{_bucketPublic}.s3.{_region}.amazonaws.com",
                folder,
                fileName
            };

            return string.Join('/', urlSegments.ToArray());
        }

        public string GeneratePreSignedURL(string fileName, string folder)
        {
            if (string.IsNullOrWhiteSpace(fileName))
                return string.Empty;

            GetPreSignedUrlRequest request1 = new GetPreSignedUrlRequest
            {
                BucketName = _bucketPrivate,
                Key = $"{folder}/{fileName}",
                Expires = DateTime.UtcNow.AddHours(timeoutDuration)
            };
            return _client.GetPreSignedURL(request1);
        }

        public void Dispose()
        {
            if (_client != null)
                _client.Dispose();
        }

        public string GetRootPath()
        {
            string region = _settingManager.GetSettingValue(AppSettingNames.Aws_Region);
            string bucket = _settingManager.GetSettingValue(AppSettingNames.Aws_S3_AssetsBucket);
            return $"https://{bucket}.s3.{region}.amazonaws.com";
        }
    }
}