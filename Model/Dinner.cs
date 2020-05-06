using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Alps.Web.Canteen.Model
{
  public class Dinner : EntityBase
  {
    public string Name { get; set; }
    public TimeSpan DinnerTime { get; set; }
    

  }
}
