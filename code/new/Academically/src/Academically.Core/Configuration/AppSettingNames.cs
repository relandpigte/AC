namespace Academically.Configuration
{
    public static class AppSettingNames
    {
        public const string UiTheme = "App.UiTheme";
        public const string App_ClientRootAddress = "App.ClientRootAddress";
        public const string Aws_Region = "Aws.Region";
        public const string Aws_S3_AssetsBucket = "Aws.S3.AssetsBucket";
        public const string Aws_S3_SecureAssetsBucket = "Aws.S3.SecureAssetsBucket";
        public const string Aws_S3_Folders_CoverPhotos = "Aws.S3.Folders.CoverPhotos";
        public const string Aws_S3_Folders_Qualifications = "Aws.S3.Folders.Qualifications";
        public const string Aws_S3_Folders_Passports = "Aws.S3.Folders.Passports";
        public const string Aws_S3_Folders_ProfilePictures = "Aws.S3.Folders.ProfilePictures";
        public const string Aws_S3_Folders_Educations = "Aws.S3.Folders.Educations";
        public const string Aws_S3_Folders_PhotoIds = "Aws.S3.Folders.PhotoIds";
        public const string Aws_S3_Folders_References = "Aws.S3.Folders.References";
        public const string Aws_S3_Folders_DbsCertificates = "Aws.S3.Folders.DbsCertificates";
        public const string Aws_S3_Folders_IntroVideos = "Aws.S3.Folders.IntroVideos";
        public const string Aws_S3_Folders_Conversations = "Aws.S3.Folders.Conversations";
        public const string Aws_S3_Folders_CourseImages = "Aws.S3.Folders.CourseImages";
        public const string Aws_S3_Folders_CourseSectionPage = "Aws.S3.Folders.CourseSectionPage";
        public const string Aws_S3_Folders_CourseAssignments = "Aws.S3.Folders.CourseAssignments";
        public const string ITagg_Sms_Username = "ITagg.Sms.Username";
        public const string ITagg_Sms_Password = "ITagg.Sms.Password";
        public const string Email_FromName = "Email.FromName";
        public const string Email_FromEmail = "Email.FromEmail";
        public const string Providers_Stripe_ClientId = "Providers.Stripe.ClientId";
        public const string Providers_Stripe_PublicKey = "Providers.Stripe.PublicKey";
        public const string Providers_Stripe_SecretKey = "Providers.Stripe.SecretKey";
        public const string Providers_GetAddress_ApiKey = "Providers.GetAddress.ApiKey";
        public const string Providers_TurnServer_Username = "Providers.TurnServer.Username";
        public const string Providers_TurnServer_Password = "Providers.TurnServer.Password";

        public static string ToAppSettingKey(this string settingName)
        {
            return settingName.Replace(".", ":");
        }
    }
}
