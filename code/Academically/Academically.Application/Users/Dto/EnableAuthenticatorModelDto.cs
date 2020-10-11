using System;
using System.Collections.Generic;
using System.Text;

namespace Academically.Users.Dto
{
    public class EnableAuthenticatorModelDto
    {
        public string SharedKey { get; set; }
        public string AuthenticationUri { get; set;}
        public List<string> RecoveryCode { get; set; }
        public string StatusMessage { get; set; }
        public bool Status { get; set; }
    }
}
