using Abp.AutoMapper;
using Academically.Authorization.Users;

namespace Academically.Services.TutorWizard.Dto
{
    [AutoMap(typeof(User))]
    public class AboutYouDto
    {
        public string Name { get; set; }
        public string Surname { get; set; }
        public string About { get; set; }
    }
}
