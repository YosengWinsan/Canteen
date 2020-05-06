using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Principal;
using Alps.Web.Canteen.Model;
using Microsoft.IdentityModel.Tokens;
using Alps.Web.Canteen.JwtAuth;
using Newtonsoft.Json;
using Microsoft.AspNetCore.Authorization;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace Alps.Web.Canteen.Controllers
{
  [Route("api/[controller]")]
  public class TokenController : Controller
  {
    private readonly CanteenDbContext _context;
    public TokenController(CanteenDbContext context)
    {
      this._context = context;
    }
    // GET: api/values
    [HttpPost]
    [Route("gettoken")]
    public string GetToken([FromBody]CanteenUser user)
    {
      var existUser = this._context.CanteenUsers.FirstOrDefault(p => p.Name == user.Name && p.Password == user.Password);
      if (existUser != null)
      {
        var requestAt = DateTime.Now;

        //
        var expiresSpan = JwtAuthOption.ExpiresSpan;
        if (existUser.Role == "canteen")
          //if (existUser.Name.ToLower() == "czt")
          expiresSpan = TimeSpan.FromHours(3);
        var expiresIn = requestAt + expiresSpan;// JwtAuthOption.ExpiresSpan;
        var token = GenerateToken(existUser, expiresIn);
        return JsonConvert.SerializeObject(new RequestResult
        {
          State = RequestState.Success,
          Data = new
          {
            requertAt = requestAt,
            expiresIn = expiresSpan.TotalSeconds,//JwtAuthOption.ExpiresSpan.TotalSeconds,
            tokeyType = JwtAuthOption.TokenType,
            accessToken = token
          }
        });
      }
      else
      {
        return JsonConvert.SerializeObject(new RequestResult
        {
          State = RequestState.Failed,
          Msg = "用户名或密码错误"
        });
      }
    }
    [HttpGet]
    [Route("getuserinfo")]
    [Authorize("Bearer")]
    public string GetUserInfo()
    {
      var claimsIdentity = User.Identity as ClaimsIdentity;
      var expiresTime = User.Claims.SingleOrDefault(p => p.Type == "exp").Value;
      var existUser = _context.CanteenUsers.Find(Guid.Parse(User.Claims.FirstOrDefault(p => p.Type == "ID").Value));
      return JsonConvert.SerializeObject(new RequestResult
      {
        State = RequestState.Success,
        Data = new
        {
          name = claimsIdentity.Name,
          realname = existUser.RealName,
          expiresTime = expiresTime
        }
      });
    }
    private string GenerateToken(CanteenUser user, DateTime expires)
    {
      var handler = new JwtSecurityTokenHandler();

      ClaimsIdentity identity = new ClaimsIdentity(
          new GenericIdentity(user.Name, "TokenAuth"),
          new[] {
                    new Claim("ID", user.ID.ToString()),
                    new Claim(ClaimTypes.Role,user.Role)
          }
      );

      var securityToken = handler.CreateToken(new SecurityTokenDescriptor
      {
        Issuer = JwtAuthOption.Issuer,
        Audience = JwtAuthOption.Audience,
        SigningCredentials = JwtAuthOption.SigningCredentials,
        Subject = identity,
        Expires = expires
      });
      return handler.WriteToken(securityToken);
    }

    public class RegisterDto
    {
      public string Username { get; set; }
      public string Password { get; set; }
      public string RealName { get; set; }
    }

    [HttpPost("register")]
    public JsonResult Register([FromBody]RegisterDto dto)
    {
      var existUser = _context.CanteenUsers.FirstOrDefault(p => p.Name == dto.Username);
      if (existUser != null)
        return Json(new RequestResult { State = RequestState.Failed, Msg = "用户名已存在" });
      else
      {
        var newUser = new CanteenUser { Name = dto.Username, Password = dto.Password, RealName = dto.RealName, Role = "user" };
        _context.CanteenUsers.Add(newUser);
        if (_context.SaveChanges() == 1)
          return Json(new RequestResult { State = RequestState.Success });
        else
          return Json(new RequestResult { State = RequestState.Failed, Msg = "保存失败" });
      }
    }

  }
}
