using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Alps.Web.Canteen.Model
{
    public class BookRecord:EntityBase
    {

    #region 操作者信息 
    public Guid BookerID { get; set; }
    public virtual CanteenUser Booker { get; set; }
    public DateTime BookTime { get; set; }
    #endregion

    #region 用餐者信息
    public Guid DinerID { get; set; }
    public virtual Diner Diner { get; set; }

    #endregion

    #region 餐饭信息
    public Guid DinnerID { get; set; }
    public virtual Dinner Dinner { get; set; }
    public DateTime DinnerDate{ get; set; }
    #endregion

    #region 用餐信息
    public DateTime? TakeTime { get; set; }
    #endregion
    public static BookRecord CreateNewBookRecord(Guid dinerID, Guid dinnerID,DateTime dinnerDate,Guid bookerID)
    {
      var bookRecord = new BookRecord() { DinerID=dinerID,DinnerID=dinnerID,DinnerDate= dinnerDate, BookerID=bookerID,BookTime=DateTime.Now};
      return bookRecord;
    }

  }
}
