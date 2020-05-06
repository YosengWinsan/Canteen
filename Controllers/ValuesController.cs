using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Alps.Web.Canteen.Model;
namespace Alps.Web.Canteen.Controllers
{
  [Route("api/[controller]")]
  public class ValuesController : Controller
  {
    private readonly CanteenDbContext _context;
    public ValuesController(CanteenDbContext context)
    {
      this._context = context;
    }
    // GET api/values
    [HttpGet]
    public IEnumerable<string> Get()
    {

      return new string[] { "FF","XX"};
     //this._context.Customers.Add(new Customer() { CardNumber = "123456", Name = "Winsan" });
     // this._context.SaveChanges();
     // return this._context.Customers.Select(p => p.Name);
    }

    // GET api/values/5
    [HttpGet("{id}")]
    public string Get(int id)
    {
      return "value";
    }

    // POST api/values
    [HttpPost]
    public void Post([FromBody]string value)
    {
    }

    // PUT api/values/5
    [HttpPut("{id}")]
    public void Put(int id, [FromBody]string value)
    {
    }

    // DELETE api/values/5
    [HttpDelete("{id}")]
    public void Delete(int id)
    {
    }
  }
}
