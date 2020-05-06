using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Alps.Web.Canteen.Model
{
  public class CanteenUser : EntityBase
  {
    public string Name { get; set; }
    public string Password { get; set; }

    public DateTime LastLoginTime { get; set; }
    public string RealName { get; set; }
    public string Role { get; set; }

    //public IEnumerable<Diner> ManageDiners { get; set; }
    //public string Roles { get; set; }
  }

}
