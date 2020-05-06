using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Alps.Web.Canteen.Model
{
    public class TakeRecord:EntityBase
    {
    
    public Guid DinnerID { get; set; }
    public DateTime TakeDate { get; set; }
    public string CardNumber { get; set; }
    public DateTime TakeTime { get; set; }
     
    }
}
