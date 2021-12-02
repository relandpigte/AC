using Abp.Domain.Entities.Auditing;
using Academically.Authorization.Users;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;

namespace Academically.Domain.Entities
{
    [Table("AcademicallyStudentCourses")]
    public class StudentCourse : CreationAuditedEntity<Guid>
    {
        public Guid CourseId { get; set; }

        [ForeignKey("CourseId")]
        public virtual Course Course { get; set; }
        [ForeignKey("CreatorUserId")]
        public virtual User CreatorUser { get; set; }

        public virtual ICollection<StudentCourseSection> StudentCourseSections { get; set; }
        public virtual ICollection<CourseConversation> StudentCourseConversations { get; set; }

        public StudentCourse()
        {
            StudentCourseSections = new HashSet<StudentCourseSection>();
            StudentCourseConversations = new HashSet<CourseConversation>();
        }
    }
}
