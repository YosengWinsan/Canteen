using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Alps.Web.Canteen.Model
{
  public class Diner:EntityBase
  {
    public string Name { get; set; }
    public string CardNumber { get; set; }

    public string IDNumber { get; set; }

    public Boolean IsDeleted { get; set; }
    //public Guid AdminUserID { get; set; }

    //public virtual CanteenUser AdminUser { get; set; }

  }
}
