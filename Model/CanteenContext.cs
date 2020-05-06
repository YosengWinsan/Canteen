using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Alps.Web.Canteen.Model
{
  public class CanteenDbContext : DbContext
  {
    public CanteenDbContext(DbContextOptions<CanteenDbContext> options)
      : base(options)
    {

    }

    public DbSet<CanteenUser> CanteenUsers { get; set; }
    public DbSet<Dinner> Dinners { get; set; }
    public DbSet<BookRecord> BookRecords { get; set; }
    public DbSet<Diner> Diners { get; set; }
    public DbSet<TakeRecord> TakeRecords { get; set; }
    public DbSet<BindRecord> BindRecords { get; set; }
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
      base.OnModelCreating(modelBuilder);
      //modelBuilder.Entity<User>().Property(p => p.Timestamp).ValueGeneratedOnAddOrUpdate().ForSqlServerHasColumnType("timestamp").IsConcurrencyToken();
        
      modelBuilder.Entity<BookRecord>().HasOne(p => p.Booker).WithMany().OnDelete(Microsoft.EntityFrameworkCore.Metadata.DeleteBehavior.Restrict);
      modelBuilder.Entity<BookRecord>().HasOne(p => p.Diner).WithMany().OnDelete(Microsoft.EntityFrameworkCore.Metadata.DeleteBehavior.Restrict);
      modelBuilder.Entity<BookRecord>().HasOne(p => p.Dinner).WithMany().OnDelete(Microsoft.EntityFrameworkCore.Metadata.DeleteBehavior.Restrict);
    }
    public static void InitData(CanteenDbContext db)
    {
      var canteenUser = new Model.CanteenUser { Name = "canteen", Password = "password" };
      db.CanteenUsers.Add(canteenUser);
      var secondCanteenUser = new Model.CanteenUser { Name = "Yan", Password = "password" };
      db.CanteenUsers.Add(secondCanteenUser);
      db.Dinners.Add(new Dinner { Name = "早餐",DinnerTime=new TimeSpan(7,0,0) });
      db.Dinners.Add(new Dinner { Name = "午餐" ,DinnerTime = new TimeSpan(11, 0, 0) });
      db.Dinners.Add(new Dinner { Name = "晚餐", DinnerTime =  new TimeSpan(17, 0, 0) });
      db.Dinners.Add(new Dinner { Name = "夜宵", DinnerTime = new TimeSpan(0, 0, 0) });
      db.Diners.Add(new Diner { Name = "张三", CardNumber = "123456" });//,AdminUserID=canteenUser.ID });
      db.Diners.Add(new Diner { Name = "李四", CardNumber = "223344" });//, AdminUserID = canteenUser.ID });
      db.Diners.Add(new Diner { Name = "王五", CardNumber = "555555" });// , AdminUserID = secondCanteenUser.ID });
      db.SaveChanges();
    }
  }
}
