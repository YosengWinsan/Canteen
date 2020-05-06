using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Alps.Web.Canteen.Model;
// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace Alps.Web.Canteen.Controllers
{
  [Route("api/[controller]")]
  public class CanteenController : Controller
  {
    private readonly CanteenDbContext _context;
    public CanteenController(CanteenDbContext context)
    {
      this._context = context;
    }

    [HttpGet("getdinners")]
    public IEnumerable<Dinner> GetDinners()
    {
      return this._context.Dinners;
    }
    [HttpGet("getdiners/{isDeleleted}")]
    [Authorize("Bearer", Roles = "admin")]
    public JsonResult GetDiners(int isDeleleted)
    {
      bool deleted = isDeleleted == 0 ? false : true;

      var query = from p in _context.Diners
                  orderby p.Name ascending
                  where p.IsDeleted== deleted
                  select new { CardNumber = p.CardNumber, Name = p.Name, ID = p.ID, IDNumber = p.IDNumber == null || p.IDNumber == string.Empty ? "" : p.IDNumber.Substring(12) }
                  ;

      return Json(query);
    }
    [HttpGet("getbinddiners")]
    [Authorize("Bearer", Roles = "user,admin")]
    public JsonResult GetBindDiners()
    {
      var query = from b in _context.BindRecords
                  from d in _context.Diners
                  where b.DinerID == d.ID && b.CanteenUserID == GetUserID() &&d.IsDeleted==false
                  select new { id = b.ID, bindName = b.BindName, bindIDNumber = b.BindIDNumber, dinerName = d.CardNumber.Substring(4) };
      return Json(query);
    }
    [HttpGet("getbookablediners")]
    [Authorize("Bearer", Roles = "user,admin")]
    public JsonResult GetBookableDiners()
    {
      IQueryable query;
      if (User.IsInRole("admin"))
      {
        query = from d in _context.Diners
                where d.IsDeleted == false
                select new { ID = d.ID, Name = d.Name };
      }
      else
        query = from b in _context.BindRecords
                from d in _context.Diners
                where b.DinerID == d.ID && b.CanteenUserID == GetUserID() && d.IsDeleted == false
                select new { ID = d.ID, Name = d.Name };
      return Json(query);
    }
    [HttpGet("getbinddiner/{id}")]
    [Authorize("Bearer", Roles = "user,admin")]
    public JsonResult GetBindDiner(Guid id)
    {
      var query = (from b in _context.BindRecords
                   from d in _context.Diners
                   where b.DinerID == d.ID && b.CanteenUserID == GetUserID() && b.ID == id
                   select new { bindName = b.BindName, bindIDNumber = b.BindIDNumber, dinerName = d.CardNumber }).FirstOrDefault();

      return Json(query);
    }

    public class BindDinerDto
    {
      public string BindName { get; set; }
      public string BindIDNumber { get; set; }
      //public Guid ID { get; set; }
      //public Guid DinerID { get; set; }
    }
    [HttpPost("unbinddiner/{id}")]
    [Authorize("Bearer", Roles = "user,admin")]
    public bool UnbindDiner(Guid id)
    {
      var existRecord = _context.BindRecords.FirstOrDefault(p => p.ID == id && p.CanteenUserID == GetUserID());
      if (existRecord == null)
        return false;
      _context.BindRecords.Remove(existRecord);
      if (_context.SaveChanges() == 1)
      {
        return true;

      }
      else
        return false;

    }
    [HttpPost("binddiner")]
    [Authorize("Bearer", Roles = "user,admin")]
    public bool BindDiner([FromBody]BindDinerDto dto)
    {

      var existDiner = _context.Diners.FirstOrDefault(p => p.Name == dto.BindName && p.IsDeleted==false && (p.IDNumber != null && p.IDNumber != "" && p.IDNumber.Substring(p.IDNumber.Length - 6) == dto.BindIDNumber));
      if (existDiner == null)
        return false;
      else
      {
        var hasBind = (from b in _context.BindRecords
                       where b.DinerID == existDiner.ID && b.BindName == dto.BindName && b.BindIDNumber == dto.BindIDNumber && b.CanteenUserID == GetUserID() 
                       select b.ID).Count() > 0;
        if (hasBind)
          return false;
        var newRecord = new BindRecord() { BindIDNumber = dto.BindIDNumber, BindName = dto.BindName, CanteenUserID = GetUserID(), DinerID = existDiner.ID };
        _context.BindRecords.Add(newRecord);
        if (_context.SaveChanges() == 1)
          return true;
        else
          return false;

      }
      //var existRecord = this._context.BindRecords.Find(dto.ID);
      //if (existRecord == null)
      //{
      //  var newRecord = new BindRecord() { BindIDNumber = dto.BindIDNumber, BindName = dto.BindName, CanteenUserID = GetUserID() };
      //  if (User.IsInRole("admin"))
      //    newRecord.DinerID = dto.DinerID;
      //  _context.BindRecords.Add(newRecord);
      //}
      //else
      //{
      //  existRecord.BindIDNumber = dto.BindIDNumber;
      //  existRecord.BindName = dto.BindName;
      //  if (User.IsInRole("admin"))
      //    existRecord.DinerID = dto.DinerID;
      //}
      //if (_context.SaveChanges() == 1)
      //  return true;
      //else
      //  return false;
    }

    public class BookActionDto
    {
      public Guid DinerID { get; set; }
      public Guid DinnerID { get; set; }
      public DateTime DinnerDate { get; set; }
      public bool UnBook { get; set; }
    }
    [HttpPost("book")]
    [Authorize("Bearer", Roles = "admin,canteen,user")]
    public bool Book([FromBody]BookActionDto dto)
    {
      var dinner = _context.Dinners.Find(dto.DinnerID);
      if (dinner == null)
        return false;
      if (dto.DinnerDate.Add(dinner.DinnerTime).AddHours(7) < DateTime.Now)
        return false;
      var diner = _context.Diners.Find(dto.DinerID);
      if (diner == null)
        return false;
      if (dto.UnBook)
      {
        BookRecord existRecord = _context.BookRecords.FirstOrDefault(p => p.DinerID == dto.DinerID && p.DinnerID == dto.DinnerID && p.DinnerDate == dto.DinnerDate.AddHours(8));
        if (existRecord != null)
        {
          _context.BookRecords.Remove(existRecord);
        }
        else
          return false;
      }
      else
      {
        if (_context.BookRecords.Where(p => p.DinerID == dto.DinerID && p.DinnerID == dto.DinnerID && p.DinnerDate == dto.DinnerDate.AddHours(8)).Count() > 0)
          return false;
        BookRecord bookRecord = BookRecord.CreateNewBookRecord(dto.DinerID, dto.DinnerID, dto.DinnerDate.ToLocalTime().Date, GetUserID());
        this._context.BookRecords.Add(bookRecord);
      }
      if (this._context.SaveChanges() == 1)
        return true;
      else
        return false;
    }
    // GET api/values/5
    [HttpGet("getbookrecord/{id}")]
    [Authorize("Bearer", Roles = "admin,canteen,user")]
    public IEnumerable<BookRecord> GetBookRecordByDinerID(Guid id)
    {
      return this._context.BookRecords.Where(p => p.DinerID == id).OrderBy(p => p.DinnerDate);

    }
    [HttpGet("getbookinfo")]
    public JsonResult GetBookInfo()
    {
      var date = new DateTime[10];
      date[0] = DateTime.Today;
      for (int i = 1; i < 10; i++)
      {
        date[i] = date[0].AddDays(i);
      }

      var dinners = _context.Dinners.ToList();
      var bookInfoQuery = from t in date
                          from d in dinners
                          select new { Date = t.Date, Name = d.Name, ID = d.ID } into trix
                          join b in _context.BookRecords on new { trix.Date, trix.ID } equals new { Date = b.DinnerDate, ID = b.DinnerID } into jrst
                          from j in jrst.DefaultIfEmpty()
                          group j by new { trix.Date, trix.Name } into g
                          select new { d = g.Key.Date, b = new { n = g.Key.Name, q = g.Count(p => p != null) } } into k
                          group k by k.d into kg
                          select new { d = kg.Key, b = kg.Select(p => new { n = p.b.n, q = p.b.q }) };
      var takeInfoQuery = from d in _context.Dinners
                          join t in _context.TakeRecords.Where(p => p.TakeDate == DateTime.Today.AddHours(-8)) on d.ID equals t.DinnerID into jrst
                          from j in jrst.DefaultIfEmpty()
                          group j by d.Name into g
                          select new { n = g.Key, q = g.Count(p => p != null) };
      var takeInBookInfo = from dinner in _context.Dinners
                           join ss in (from rst in ((from t in _context.TakeRecords
                                                     from d in _context.Diners
                                                     from b in _context.BookRecords
                                                     from dn in _context.Dinners
                                                     where t.TakeDate == DateTime.Today.AddHours(-8) && t.DinnerID == b.DinnerID && t.CardNumber == d.CardNumber && b.DinerID == d.ID
                                                     && dn.ID == t.DinnerID && b.DinnerDate == DateTime.Today
                                                     select new { cn = t.CardNumber, n = dn.Name }).Distinct())
                                       group rst by rst.n into g
                                       select new { n = g.Key, q = g.Count() }) on dinner.Name equals ss.n into joinrst
                           from jrst in joinrst.DefaultIfEmpty()
                           select new { n = dinner.Name, q = jrst == null ? 0 : jrst.q };
      var secondTakeInfo = from dinner in _context.Dinners
                           join rst in (from k in (from t in _context.TakeRecords
                                                   from dn in _context.Dinners
                                                   where t.TakeDate == DateTime.Today.AddHours(-8) && t.DinnerID == dn.ID
                                                   group t by new { dn.Name, t.CardNumber } into g
                                                   select new { n = g.Key.Name, c = g.Key.CardNumber, q = g.Count() })
                                        where k.q > 1
                                        group k by k.n into gr
                                        select new { n = gr.Key, q = gr.Sum(p => p.q - 1) }) on dinner.Name equals rst.n into rr
                           from kk in rr.DefaultIfEmpty()
                           select new { n = dinner.Name, q = kk == null ? 0 : kk.q };




      //group dn by dn.Name into g
      //select new { dn = g.Key, q = g.Count() };
      return Json(new { BookInfo = bookInfoQuery.ToList(), TakeInfo = takeInfoQuery.ToList(), TakeInBookInfo = takeInBookInfo.ToList(), SecondTakeInfo = secondTakeInfo.ToList() });
    }
    [Authorize("Bearer", Roles = "admin")]
    [HttpGet("getdiner/{id}")]
    public JsonResult GetDiner(Guid id)
    {
      var query = (from p in _context.Diners
                   where p.ID == id
                   select new {IsDeleted=p.IsDeleted, Name = p.Name, ID = p.ID, IDNumber = p.IDNumber, CardNumber = p.CardNumber, BQuantity = _context.BindRecords.Count(b => b.DinerID == p.ID), TQuantity = _context.TakeRecords.Count(t => t.CardNumber == p.CardNumber) }).FirstOrDefault();
      return Json(query);
    }
    private Guid GetUserID()
    {
      var idClaim = User.Claims.SingleOrDefault(p => p.Type == "ID");
      if (idClaim == null)
        throw new Exception("令牌有问题");
      var userID = Guid.Parse(idClaim.Value);
      return userID;
    }
    public class DinerDto
    {
      public string CardNumber { get; set; }
      public string IDNumber { get; set; }
      public string Name { get; set; }
      public Guid ID { get; set; }
      public Boolean IsDeleted { get; set; }
    }

    [Authorize("bearer", Roles = "admin")]
    [HttpPost("updatediner")]
    public bool UpdateDiner([FromBody]DinerDto diner)
    {
      if (diner.IDNumber.Length != 18 || diner.CardNumber.Length != 10 || diner.Name == string.Empty)
        return false;

      if (diner.ID == Guid.Empty)
      {
        var newDiner = new Diner() { CardNumber = diner.CardNumber, Name = diner.Name, IDNumber = diner.IDNumber };
        this._context.Diners.Add(newDiner);
      }
      else
      {
        var existDiner = this._context.Diners.FirstOrDefault(p => p.ID == diner.ID);
        existDiner.Name = diner.Name;
        //existDiner.CardNumber = diner.CardNumber;
        existDiner.IDNumber = diner.IDNumber;
        existDiner.IsDeleted = diner.IsDeleted;
      }
      if (this._context.SaveChanges() == 1)
        return true;
      else
        return false;
    }
    [Authorize("bearer", Roles = "admin")]
    [HttpPost("blukupdatediner")]
    public bool BlukUpdateDiner([FromBody]IList<DinerDto> diners)
    {
      int updateCount = 0;
      foreach (var diner in diners)
      {
        var existDiner = this._context.Diners.FirstOrDefault(p => p.CardNumber == diner.CardNumber);
        if (existDiner == null)
        {
          var newDiner = new Diner() { CardNumber = diner.CardNumber, Name = diner.Name, IDNumber = diner.IDNumber,IsDeleted=diner.IsDeleted };
          this._context.Diners.Add(newDiner);
          updateCount++;
        }
        else
        {
          if (existDiner.Name != diner.Name || existDiner.IDNumber != diner.IDNumber)
          {
            existDiner.Name = diner.Name;
            existDiner.IDNumber = diner.IDNumber;
            existDiner.IsDeleted = diner.IsDeleted;
            updateCount++;
          }
        }
      }
      if (this._context.SaveChanges() == updateCount)
        return true;
      else
        return false;
      //if (diner.ID == Guid.Empty)
      //{
      //  var newDiner = new Diner() { CardNumber = diner.CardNumber, Name = diner.Name };
      //  this._context.Diners.Add(newDiner);
      //}
      //else
      //{
      //  var existDiner = this._context.Diners.FirstOrDefault(p => p.ID == diner.ID);
      //  existDiner.Name = diner.Name;
      //  existDiner.CardNumber = diner.CardNumber;
      //}
      //if (this._context.SaveChanges() == 1)
      //  return true;
      //else
      //  return false;
    }
    public class TakeDinnerDto
    {
      public Guid DinnerID { get; set; }
      public DateTime TakeDate { get; set; }
      public string CardNumber { get; set; }
      public bool NoBookTake { get; set; }
    }

    [Authorize("bearer", Roles = "admin,canteen")]
    [HttpPost("takedinner")]
    public JsonResult TakeDinner([FromBody]TakeDinnerDto dto)
    {
      if (_context.Diners.Count(p => p.CardNumber == dto.CardNumber) == 0)
        return Json(new { result = -4 });

      if (!dto.NoBookTake)
      {
        var bookInfo = (from b in _context.BookRecords
                        from d in _context.Diners
                        where b.DinerID == d.ID && d.CardNumber == dto.CardNumber && b.DinnerDate == dto.TakeDate.AddHours(8) && b.DinnerID == dto.DinnerID
                        select b.ID).Count();
        if (bookInfo == 0)
          return Json(new { result = -2 });
        var takeInfo = (from t in _context.TakeRecords
                        where t.CardNumber == dto.CardNumber && t.TakeDate == dto.TakeDate && t.DinnerID == dto.DinnerID
                        select t.ID).Count();
        if (takeInfo > 1)
          return Json(new { result = -3 });
      }
      var newTake = new TakeRecord { DinnerID = dto.DinnerID, TakeDate = dto.TakeDate, CardNumber = dto.CardNumber, TakeTime = DateTime.Now };
      this._context.TakeRecords.Add(newTake);
      if (this._context.SaveChanges() == 1)
        return Json(new { result = 1 });
      else
        return Json(new { result = -1 });
    }
    [Authorize("Bearer", Roles = "admin,canteen")]
    [HttpGet("gettakerecords")]
    public JsonResult GetTakeRecords()
    {
      var query = from t in this._context.TakeRecords
                  join d in _context.Diners on t.CardNumber equals d.CardNumber into joinrst
                  from d in joinrst.DefaultIfEmpty()
                  where t.TakeDate == DateTime.Today.AddHours(-8)
                  orderby t.TakeTime descending
                  select new
                  {
                    id = t.ID,
                    tt = t.TakeTime.ToString("HH:mm:ss"),
                    cn =
                  d == null ? t.CardNumber : d.Name
                  };

      return Json(query.Take(150));
    }
    [Authorize("Bearer", Roles = "admin,canteen")]
    [HttpPost("deletetakerecord/{id}")]
    public bool DeleteTakeRecords(Guid id)
    {
      var existRecord = this._context.TakeRecords.FirstOrDefault(p => p.ID == id);
      if (existRecord != null)
      {
        _context.TakeRecords.Remove(existRecord);
        if (_context.SaveChanges() == 1)
          return true;
        else
          return false;
      }
      else
        return false;
    }

    public class TakeInfoSearchDto
    {
      public string DinerName { get; set; }
      public string CardNumber { get; set; }
      public DateTime DateStart { get; set; }
      public DateTime DateEnd { get; set; }
    }
    [Authorize("Bearer", Roles = "admin")]
    [HttpPost("gettakeinfo")]
    public JsonResult GetTakeInfo([FromBody]TakeInfoSearchDto dto)
    {
      if (dto.CardNumber == null)
        dto.CardNumber = "";
      if (dto.DinerName == null)
        dto.DinerName = "";
      var query = from t in _context.TakeRecords
                  join d in _context.Diners on t.CardNumber equals d.CardNumber into dj
                  from djr in dj.DefaultIfEmpty()
                  join dd in _context.Dinners on t.DinnerID equals dd.ID into ddj
                  from ddjr in ddj.DefaultIfEmpty()
                  where t.CardNumber.Contains(dto.CardNumber) && (djr.Name.Contains(dto.DinerName))
                  && t.TakeDate >= dto.DateStart.AddHours(-8) && t.TakeDate <= dto.DateEnd.AddHours(-8)
                  orderby djr.Name, t.TakeTime descending
                  select new { Name = djr == null ? t.CardNumber : djr.Name, TakeTime = t.TakeTime.ToString("MM-dd HH:mm:ss"), DinnerName = ddjr.Name, CardNumber = t.CardNumber };
      return Json(query);
    }

    [Authorize("Bearer", Roles = "admin")]
    [HttpGet("deletediner/{id}")]
    public bool DeleteDiner(Guid id)
    {
      var existDiner = _context.Diners.Find(id);
      if (existDiner == null)
        return false;

      //_context.BookRecords.RemoveRange(_context.BookRecords.Where());
      _context.Diners.Remove(existDiner);
      if (_context.SaveChanges() == 1)
        return true;
      else
        return false;

    }
    public class BookInfoSearchDto
    {
      public string DinerName { get; set; }
      public string DinnerName { get; set; }
      public DateTime DateStart { get; set; }
      public DateTime DateEnd { get; set; }
    }
    [Authorize("Bearer", Roles = "admin")]
    [HttpPost("getbookdetail")]
    public JsonResult GetBookDetail([FromBody] BookInfoSearchDto dto)
    {
      if (dto.DinnerName == null)
        dto.DinnerName = "";
      if (dto.DinerName == null)
        dto.DinerName = "";
      var query = from b in _context.BookRecords
                  from d in _context.Diners
                  from dn in _context.Dinners
                  where b.DinnerID == dn.ID && b.DinerID == d.ID && dn.Name.Contains(dto.DinnerName) && d.Name.Contains(dto.DinerName)
                  && b.DinnerDate >= dto.DateStart && b.DinnerDate <= dto.DateEnd
                  orderby b.DinnerDate descending, dn.Name, d.Name
                  select new { dn = dn.Name, n = d.Name, d = b.DinnerDate.ToString("MM-dd") };
      return Json(query);
    }
    public class SettlementInfoSearchDto
    {
      public Guid DinerID { get; set; }
      public int YearMonth { get; set; }
    }
    [Authorize("Bearer", Roles = "admin,user")]
    [HttpPost("getsettlementinfo")]
    public JsonResult GetSettlementInfo([FromBody] SettlementInfoSearchDto dto)
    {
      if (!User.IsInRole("admin"))
      {
        var dinerBinded = (from bind in _context.BindRecords
                           where dto.DinerID == bind.DinerID && bind.CanteenUserID == GetUserID()
                           select bind.ID).Count() > 0;
        if (!dinerBinded)
          return Json(new { });
      }
      var year = dto.YearMonth / 100;
      var month = dto.YearMonth % 100;
      var days = DateTime.DaysInMonth(year, month);
      var date = new DateTime[days];
      date[0] = new DateTime(year, month, 1);
      for (int i = 0; i < days; i++)
      {
        date[i] = date[0].AddDays(i);
      }

      var bookInfo = (from b in _context.BookRecords
                      from dn in _context.Dinners
                      where b.DinerID == dto.DinerID && dn.ID == b.DinnerID
                      && (b.DinnerDate.Year * 100 + b.DinnerDate.Month) == dto.YearMonth
                      orderby b.DinnerDate, dn.Name
                      select new { DinnerName = dn.Name, Date = b.DinnerDate, Count = 1 }).ToList();
      var takeInfo = (from t in _context.TakeRecords
                      from d in _context.Diners
                      from dn in _context.Dinners
                      where t.CardNumber == d.CardNumber && dn.ID == t.DinnerID
                      && (t.TakeDate.AddHours(8).Year * 100 + t.TakeDate.AddHours(8).Month) == dto.YearMonth && d.ID == dto.DinerID
                      group dn by new { dn.Name, t.TakeDate } into g
                      orderby g.Key.TakeDate, g.Key.Name
                      select new { DinnerName = g.Key.Name, Date = g.Key.TakeDate.AddHours(8), Count = g.Count() }).ToList();

      var dinnerInfo = from dn in _context.Dinners
                       select dn.Name;
      var dateDinner = (from dn in dinnerInfo
                        from d in date
                        select new { DinnerName = dn, Date = d }).ToList();
      var rst = from dd in dateDinner
                select new
                {
                  d = dd.Date,
                  dn = dd.DinnerName,
                  bc =
                (from bi in bookInfo
                 where bi.Date == dd.Date && bi.DinnerName == dd.DinnerName
                 select bi.Count).Sum(),
                  tc = (from ti in takeInfo
                        where ti.Date == dd.Date && ti.DinnerName == dd.DinnerName
                        select ti.Count).Sum()
                } into k
                group k by k.d into g
                select new { d = g.Key.ToString("MM-dd"), i = g.Select(p => new { dn = p.dn, bc = p.bc, tc = p.tc }) };
      return Json(rst);
    }
    public class MonthlyStatementDto
    {
      public int YearMonth { get; set; }
    }
    [Authorize("Bearer", Roles = "admin")]
    [HttpPost("getmonthlystatement")]
    public JsonResult GetMonthlyStatement([FromBody] MonthlyStatementDto dto)
    {
      var year = dto.YearMonth / 100;
      var month = dto.YearMonth % 100;
      var days = DateTime.DaysInMonth(year, month);
      var date = new DateTime[days];
      date[0] = new DateTime(year, month, 1);
      for (int i = 0; i < days; i++)
      {
        date[i] = date[0].AddDays(i);
      }
      var takeInfo = (from t in _context.TakeRecords
                      from d in _context.Diners
                      from dn in _context.Dinners
                      where t.CardNumber == d.CardNumber && dn.ID == t.DinnerID
                      && (t.TakeDate.AddHours(8).Year * 100 + t.TakeDate.AddHours(8).Month) == dto.YearMonth
                      group dn by new { dn.Name, t.TakeDate, d.ID, DinerName = d.Name } into g

                      select new { DinnerName = g.Key.Name, Date = g.Key.TakeDate.AddHours(8), DinerID = g.Key.ID, DinerName = g.Key.DinerName, Count = 1, SecondTakeCount = g.Count() > 1 ? g.Count() - 1 : 0 } into ng
                      group ng by new { ng.DinnerName, ng.Date } into ngp
                      select new { DinnerName = ngp.Key.DinnerName, Date = ngp.Key.Date, FirstTake = ngp.Sum(p => p.Count), SecondTake = ngp.Sum(p => p.SecondTakeCount) }

                      ).ToList();
      var bookInfo = (from bi in (from b in _context.BookRecords
                                  from d in _context.Dinners
                                  where b.DinnerID == d.ID
                                  select new { d.Name, b.DinnerDate, b.DinerID }).Distinct()
                      group bi by new { bi.Name, bi.DinnerDate } into g
                      select new { n = g.Key.Name, d = g.Key.DinnerDate, c = g.Count() }).ToList();
      var dinnerInfo = from dn in _context.Dinners
                       select dn.Name;
      var dateDinner = (from dn in dinnerInfo
                        from d in date
                        select new { DinnerName = dn, Date = d }).ToList();
      var tlist = (from dd in dateDinner
                   join ti in takeInfo
                   on new { dd.Date, dd.DinnerName } equals new { ti.Date, ti.DinnerName } into joinrst
                   from j in joinrst.DefaultIfEmpty()
                   join bi in bookInfo
                   on new { dd.Date, dd.DinnerName } equals new { Date = bi.d, DinnerName = bi.n } into bijoinrst
                   from bij in bijoinrst.DefaultIfEmpty()
                   select new
                   {
                     d = dd.Date,
                     dn = dd.DinnerName,
                     ft = j == null ? 0 : j.FirstTake,
                     st = j == null ? 0 : j.SecondTake,
                     bt = bij == null ? 0 : bij.c
                   }).ToList();

      var rst = (from t in tlist
                 group t by t.d into g
                 select new { d = g.Key.ToString("MM-dd"), i = g.Select(p => new { dn = p.dn, ft = p.ft, st = p.st,bt=p.bt }) }
                ).ToList();
      rst.Add(
         new
         {
           d = "合计",
           i = (
        from t in tlist
        group t by t.dn into gt
        select new { dn = gt.Key, ft = gt.Sum(p => p.ft), st = gt.Sum(p => p.st),bt=gt.Sum(p=>p.bt) })
         });
      return Json(rst);
    }
  }

}
