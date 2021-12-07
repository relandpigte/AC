using System;
using System.ComponentModel.DataAnnotations.Schema;
using Abp.Domain.Entities.Auditing;
using Academically.Authorization.Users;

namespace Academically.Domain.Entities
{
    [Table("AcademicallyCourseAssignments")]
    public class CourseAssignment : CreationAuditedEntity<Guid>
    {
        public Guid StudentCourseSectionId { get; set; }
        public Guid DocumentId { get; set; }

        public virtual StudentCourseSection StudentCourseSection { get; set; }
        public virtual Document Document { get; set; }
        public virtual User CreatorUser { get; set; }

        public CourseAssignment()
        {
        }
    }
}

