using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Academically.Services.UserFollowers.Dto
{
    public class SearchFollowingInvitedDto
    {
        public string Keyword { get; set; }
        public int? Take { get; set; }
        public Guid? PostId { get; set; }
        public long? InviterUserId { get; set; }
        public bool? IsInvitedOnly { get; set; }
    }
}
