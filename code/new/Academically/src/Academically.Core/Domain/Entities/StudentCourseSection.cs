using Abp.Domain.Entities.Auditing;
using Academically.Authorization.Users;
using Academically.Domain.Enums;
using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace Academically.Domain.Entities
{
    [Table("AcademicallyStudentCourses")]
    public class StudentCourseSection : CreationAuditedEntity<Guid>
    {
        public StudentCourseSectionStatus Status { get; set; }
        public Guid StudentCourseId { get; set; }
        public Guid CourseSectionId { get; set; }

        [ForeignKey("StudentCourseId")]
        public virtual StudentCourse StudentCourse { get; set; }
        [ForeignKey("CourseSectionId")]
        public virtual CourseSection CourseSection { get; set; }
        [ForeignKey("CreatorUserId")]
        public virtual User CreatorUser { get; set; }
    }
}
