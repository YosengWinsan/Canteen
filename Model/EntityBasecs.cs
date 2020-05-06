using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace Alps.Web.Canteen.Model
{
  public abstract partial class EntityBase
  {
    public Guid ID { get; set; }
    [Timestamp]
    [ScaffoldColumn(false)]
    public byte[] Timestamp { get; set; }

    public EntityBase()
    {
      ID = IdentityGenerator.NewSequentialGuid();
    }
  }
}
