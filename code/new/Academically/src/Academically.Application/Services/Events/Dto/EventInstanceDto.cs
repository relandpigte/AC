using System;
namespace Academically.Services.Events.Dto
{
	public class EventInstanceDto
	{
        public Guid Id { get; set; }
        public DateTime Date { get; set; }
        public string Time { get; set; }
        public int Registrants { get; set; }
        public int Duration { get; set; }
    }
}

