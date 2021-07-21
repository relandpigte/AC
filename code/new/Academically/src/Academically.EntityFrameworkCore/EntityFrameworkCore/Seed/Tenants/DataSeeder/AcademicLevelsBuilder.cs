using Abp.Timing;
using Academically.Domain.Entities;
using Academically.Domain.Enums;
using System.Collections.Generic;
using System.Linq.Dynamic.Core;

namespace Academically.EntityFrameworkCore.Seed.Tenants.DataSeeder
{
    public class AcademicLevelsBuilder
    {
        public AcademicLevelsBuilder(AcademicallyDbContext context)
        {
            var totalAcademicLevels = context.AcademicLevels.Count();
            if (totalAcademicLevels == 0)
            {
                var academicLevelDefinitions = new List<KeyValuePair<string, List<string>>>()
                {
                    new KeyValuePair<string, List<string>>("Primary school", new List<string>()
                    {
                        "Entry Level",
                    }),
                    new KeyValuePair<string, List<string>>("High School", new List<string>()
                    {
                        "iGCSE",
                        "GCSE",
                        "SAT",
                    }),
                    new KeyValuePair<string, List<string>>("Pre-degree", new List<string>()
                    {
                        "A Level",
                        "AP",
                        "IB",
                    }),
                    new KeyValuePair<string, List<string>>("Undergraduate", new List<string>()
                    {
                        "HNC",
                        "HND",
                        "Foundation Degree",
                    }),
                    new KeyValuePair<string, List<string>>("Graduate", new List<string>()
                    {
                        "BA",
                        "BSc",
                        "BEng",
                    }),
                    new KeyValuePair<string, List<string>>("Postgraduate", new List<string>()
                    {
                        "MSc",
                        "MA",
                        "MEng",
                        "MPhil",
                        "PGCE",
                    }),
                    new KeyValuePair<string, List<string>>("Doctorate", new List<string>()
                    {
                        "PhD",
                        "DPhil",
                    }),
                };
                int displayOrder = 0;
                foreach (var academicLevelDefinition in academicLevelDefinitions)
                {
                    var academicLevel = new AcademicLevel()
                    {
                        Name = academicLevelDefinition.Key,
                        DisplayOrder = displayOrder,
                    };

                    context.AcademicLevels.Add(academicLevel);
                    context.SaveChanges();

                    int displayOrder2 = 0;
                    foreach (var academicLevelQualificationName in academicLevelDefinition.Value)
                    {
                        var academicLevelQualficiation = new AcademicLevelQualification();
                        academicLevelQualficiation.Name = academicLevelQualificationName;
                        academicLevelQualficiation.DisplayOrder = displayOrder2;
                        academicLevelQualficiation.AcademicLevelId = academicLevel.Id;
                        academicLevelQualficiation.CreationTime = Clock.Now;
                        academicLevelQualficiation.ReviewStatus = AcademicLevelQualificationReviewStatus.Pending;

                        context.AcademicLevelQualifications.Add(academicLevelQualficiation);
                        context.SaveChanges();

                        displayOrder2++;
                    }

                    displayOrder++;
                }
            }
        }
    }
}
