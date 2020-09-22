using Abp.AutoMapper;
using Academically.Entities;
using System;

namespace Academically.Services.Registrations.Dto
{
    [AutoMap(typeof(Registration))]
    public class RegistrationDto
    {
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string EmailAddress { get; set; }
        public DateTime? DateOfBirth { get; set; }
    }
}
