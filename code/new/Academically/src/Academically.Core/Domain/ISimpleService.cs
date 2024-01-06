using Academically.Authorization.Users;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Academically.Domain
{
    public interface ISimpleService
    {
        public string Name { get; set; }
        public long? CreatorUserId { get; set; }
    }
}
