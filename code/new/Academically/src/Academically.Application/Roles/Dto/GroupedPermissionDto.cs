using System.Collections.Generic;
using Abp.Application.Services.Dto;
using Abp.Authorization;
using Abp.AutoMapper;

namespace Academically.Roles.Dto
{
    [AutoMapFrom(typeof(Permission))]
    public class GroupedPermissionDto : EntityDto<long>
    {
        public string Name { get; set; }
        public string DisplayName { get; set; }
        public string Description { get; set; }

        public GroupedPermissionDto Parent { get; set; }
        public IEnumerable<GroupedPermissionDto> Children { get; set; }
    }
}
