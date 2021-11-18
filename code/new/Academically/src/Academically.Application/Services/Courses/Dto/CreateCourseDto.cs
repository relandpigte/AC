using Abp.AutoMapper;
using Academically.Domain.Entities;

namespace Academically.Services.Courses.Dto
{
    [AutoMapTo(typeof(Course))]
    public class CreateCourseDto
    {
        public string Name { get; set; }
    }
}
