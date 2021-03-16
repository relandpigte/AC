namespace Academically.Configuration
{
    public static class AppSettingNames
    {
        public const string UiTheme = "App.UiTheme";
        public const string Aws_Region = "Aws.Region";
        public const string Aws_S3_AssetsBucket = "Aws.S3.AssetsBucket";
        public const string Aws_S3_Folders_CoverPhotos = "Aws.S3.Folders.CoverPhotos";
        public const string ITagg_Sms_Username = "ITagg.Sms.Username";
        public const string ITagg_Sms_Password = "ITagg.Sms.Password";

        public static string ToAppSettingKey(this string settingName)
        {
            return settingName.Replace(".", ":");
        }
    }
}
