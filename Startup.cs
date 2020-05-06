using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Rewrite;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using Microsoft.AspNetCore.Authorization;
using Alps.Web.Canteen.JwtAuth;
using Microsoft.AspNetCore.Diagnostics;
using Microsoft.AspNetCore.Http;
using Newtonsoft.Json;
using Alps.Web.Canteen.Model;

namespace Alps.Web.Canteen
{
  public class Startup
  {
    public Startup(IHostingEnvironment env)
    {
      var builder = new ConfigurationBuilder()
          .SetBasePath(env.ContentRootPath)
          .AddJsonFile("appsettings.json", optional: false, reloadOnChange: true)
          .AddJsonFile($"appsettings.{env.EnvironmentName}.json", optional: true)
          .AddEnvironmentVariables();
      Configuration = builder.Build();
    }

    public IConfigurationRoot Configuration { get; }

    // This method gets called by the runtime. Use this method to add services to the container.
    public void ConfigureServices(IServiceCollection services)
    {

      services.AddAuthorization(option => option.AddPolicy("Bearer", policy =>
      {
        policy.AddAuthenticationSchemes(JwtBearerDefaults.AuthenticationScheme);
        policy.RequireAuthenticatedUser();
        policy.Build();
      }));

      services.AddCors(option => option.AddPolicy("CanteenFront", builder => builder.AllowAnyHeader().AllowAnyMethod().AllowCredentials().WithOrigins("http://localhost:4200")));
      // Add framework services.
      services.AddMvc();

      services.AddDbContext<Model.CanteenDbContext>(p => p.UseSqlServer(Configuration.GetConnectionString("CanteenDbContext")));
      //,k => k.MigrationsAssembly("Alps.Web.Canteen")


      //using (var db = services.BuildServiceProvider().GetService<Model.CanteenDbContext>())
      //{
      //  db.Database.EnsureDeleted();
      //  db.Database.EnsureCreated();
      //  CanteenDbContext.InitData(db);
      //}
    }

    // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
    public void Configure(IApplicationBuilder app, IHostingEnvironment env, ILoggerFactory loggerFactory)
    {
      loggerFactory.AddConsole(Configuration.GetSection("Logging"));
      loggerFactory.AddDebug();
      if (env.IsProduction())
        app.UseRewriter(new RewriteOptions().AddRedirectToHttps(303, 444));
      app.UseDefaultFiles();
      app.UseStaticFiles();
      app.UseStatusCodePages(async context =>
      {
        if (context.HttpContext.Request.Path.StartsWithSegments("/api") &&
           (context.HttpContext.Response.StatusCode == 401 ||
            context.HttpContext.Response.StatusCode == 403))
        {
          await context.HttpContext.Response.WriteAsync(JsonConvert.SerializeObject(new RequestResult
          {
            State = RequestState.NotAuth,
            Msg = "unAuthentication"
          }));
        }
      });
      app.UseExceptionHandler(appBuilder =>
      {
        appBuilder.Use(async (context, next) =>
        {
          var error = context.Features[typeof(IExceptionHandlerFeature)] as IExceptionHandlerFeature;

          //when authorization has failed, should retrun a json message to client 
          if (error != null && error.Error is SecurityTokenExpiredException)
          {
            context.Response.StatusCode = 401;
            context.Response.ContentType = "application/json";

            await context.Response.WriteAsync(JsonConvert.SerializeObject(new RequestResult
            {
              State = RequestState.NotAuth,
              Msg = "token expired"
            }));
          }
          //when orther error, retrun a error message json to client 
          else if (error != null && error.Error != null)
          {
            context.Response.StatusCode = 500;
            context.Response.ContentType = "application/json";
            await context.Response.WriteAsync(JsonConvert.SerializeObject(new RequestResult
            {
              State = RequestState.Failed,
              Msg = error.Error.Message
            }));
          }
          //when no error, do next. 
          else await next();
        });
      });
      app.UseJwtBearerAuthentication(new JwtBearerOptions
      {
        TokenValidationParameters = new TokenValidationParameters()
        {
          IssuerSigningKey = JwtAuthOption.Key,
          ValidAudience = JwtAuthOption.Audience,
          ValidIssuer = JwtAuthOption.Issuer,
          ValidateAudience = true,
          ValidateIssuer = true,
          ValidateIssuerSigningKey = true,
          ValidateLifetime = true,
          ClockSkew = TimeSpan.FromMinutes(0)
        }
      });
      app.UseCors("CanteenFront");
      app.UseMvc();

    }
  }
}
