using System;
using System.Collections.Generic;

namespace Academically.Sessions.Dto
{
    public class ApplicationInfoDto
    {
        public string Version { get; set; }

        public DateTime ReleaseDate { get; set; }

        public Dictionary<string, bool> Features { get; set; }

        public string BaseDirectory { get; set; }

        public string ProfilePicturesFolderName { get; set; }

        public string CoverPhotoFolderName { get; set; }
    }
}
