using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Alps.Web.Canteen.Model
{
  public class BindRecord : EntityBase
  {
    public Guid? DinerID { get; set; }
    public Guid CanteenUserID { get; set; }
    public string BindName { get; set; }
    public string BindIDNumber { get; set; }
  }
}
