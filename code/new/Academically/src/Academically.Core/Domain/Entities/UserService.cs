using Abp.Domain.Entities.Auditing;
using Academically.Authorization.Users;
using Academically.Domain.Enums;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;

namespace Academically.Domain.Entities
{
    [Table("AcademicallyUserServices")]
    public class UserService : CreationAuditedEntity<Guid>
    {
        public UserService()
        {
            UserServiceSubjects = new HashSet<UserServiceSubject>();
            UserServiceDisciplineTaxonomies = new HashSet<UserServiceDisciplineTaxonomy>();
        }

        public string Title { get; set; }
        public string Description { get; set; }
        public ServiceExpertiseLevel ExpertiseLevel { get; set; }
        public Guid ServiceMappingId { get; set; }

        [ForeignKey("ServiceMappingId")]
        public ServiceMapping ServiceMapping { get; set; }

        [ForeignKey("CreatorUserId")]
        public User CreatorUser { get; set; }

        public virtual ICollection<UserServiceSubject> UserServiceSubjects { get; set; }
        public virtual ICollection<UserServiceDisciplineTaxonomy> UserServiceDisciplineTaxonomies { get; set; }
    }
}
