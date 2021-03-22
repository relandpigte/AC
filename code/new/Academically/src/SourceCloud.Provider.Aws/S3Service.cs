using Amazon.S3;
using Amazon.S3.Model;
using Amazon.S3.Transfer;
using Microsoft.Extensions.Configuration;
using SourceCloud.Core.Configurations;
using SourceCloud.Core.Services;
using System;
using System.IO;
using System.Threading.Tasks;

namespace SourceCloud.Provider.Aws
{
    public class S3Service : IFileManagerService, IDisposable
    {
        private readonly IAmazonS3 _client;
        private readonly FileManagerConfiguration _configuration;

        private string _bucket;

        public S3Service(FileManagerConfiguration configuration, IConfiguration awsConfiguration)
        {
            _configuration = configuration;
            _bucket = configuration.Bucket;
            var options = awsConfiguration.GetAWSOptions();
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
                BucketName = _bucket,
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

        public async Task UploadAsync(string fileName, string type, byte[] fileBytes, string folder = null, bool isSecured = false)
        {
            if (!string.IsNullOrWhiteSpace(folder))
            {
                fileName = $"{folder}/{fileName}";
            }

            string bucket = isSecured ? _configuration.SecuredBucket : _bucket;

            var fileTransferUtility = new TransferUtility(_client);
            using (MemoryStream ms = new MemoryStream())
            {
                ms.Write(fileBytes, 0, fileBytes.Length);
                ms.Seek(0, SeekOrigin.Begin);

                string extension = Path.GetExtension(fileName);
                var fileTransferUtilityRequest = new TransferUtilityUploadRequest
                {
                    BucketName = bucket,
                    InputStream = ms,
                    StorageClass = S3StorageClass.Standard,
                    PartSize = fileBytes.Length,
                    Key = fileName,
                    ContentType = type,
                };

                if (!isSecured)
                {
                    fileTransferUtilityRequest.CannedACL = S3CannedACL.PublicRead;
                }

                await fileTransferUtility.UploadAsync(fileTransferUtilityRequest);
            }
        }

        public async Task DeleteAsync(string folder, string fileName)
        {
            if (!string.IsNullOrWhiteSpace(folder))
            {
                fileName = $"{folder}/{fileName}";
            }
            await _client.DeleteObjectAsync(_bucket, fileName);
        }

        public void Dispose()
        {
            if (_client != null)
                _client.Dispose();
        }

        public string GetFileUrl(string fileName, long userId, string folder = null)
        {
            if (!string.IsNullOrWhiteSpace(fileName))
            {
                var s3Bucket = GetDirectoryUrl();
                if (!string.IsNullOrWhiteSpace(folder))
                {
                    return $"{s3Bucket}/{userId}/{folder}/{fileName}";
                }
                return $"{s3Bucket}/{userId}/{fileName}";
            }

            return string.Empty;
        }

        public string GetDirectoryUrl()
        {
            return $"https://{_bucket}.s3.{_configuration.Region}.amazonaws.com";
        }
    }
}
