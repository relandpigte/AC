using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text.RegularExpressions;
using Abp.Auditing;
using Abp.Authorization.Users;
using Abp.Extensions;
using Academically.Validation;

namespace Academically.Authorization.Accounts.Dto
{
    public class RegisterInput : IValidatableObject
    {
        [Required]
        [StringLength(AbpUserBase.MaxNameLength)]
        public string Name { get; set; }

        [Required]
        [StringLength(AbpUserBase.MaxSurnameLength)]
        public string Surname { get; set; }

        [Required]
        [StringLength(AbpUserBase.MaxUserNameLength)]
        public string UserName { get; set; }

        [Required]
        [EmailAddress]
        [StringLength(AbpUserBase.MaxEmailAddressLength)]
        public string EmailAddress { get; set; }

        [Required]
        [StringLength(AbpUserBase.MaxPlainPasswordLength)]
        [DisableAuditing]
        public string Password { get; set; }

        [Required]
        [StringLength(AbpUserBase.MaxPlainPasswordLength)]
        [DisableAuditing]
        public string PasswordConfirmation { get; set; }

        [DisableAuditing]
        public string CaptchaResponse { get; set; }

        [Required]
        public Guid RegistrationId { get; set; }

        public IEnumerable<ValidationResult> Validate(ValidationContext validationContext)
        {
            if (!UserName.IsNullOrEmpty())
            {
                if (!UserName.Equals(EmailAddress) && ValidationHelper.IsEmail(UserName))
                {
                    yield return new ValidationResult("Username cannot be an email address unless it's the same as your email address!");
                }
            }
            if (!Password.IsNullOrEmpty() && !PasswordConfirmation.IsNullOrEmpty())
            {
                if (!Password.Equals(PasswordConfirmation))
                {
                    yield return new ValidationResult("Password and Confirmation does not match.");
                }
                if (!(Regex.Match(Password, AcademicallyConsts.PasswordRegexValidator)).Success)
                {
                    yield return new ValidationResult("Password must be at least 8 charachters and must contain 1 uppercase letter, 1 lowercase letter and 1 number.");
                }
            }
        }
    }
}
