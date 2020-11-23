using Academically.Authorization.Users;
using Academically.Entities;

namespace Academically.DomainServices.Tutorials
{
    public class SearchTutorDomainDto
    {
        public User User { get; set; }
        public double Score { get; set; }
    }
}
