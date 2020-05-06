﻿using Microsoft.IdentityModel.Tokens;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography;
using System.Threading.Tasks;

namespace Alps.Web.Canteen.JwtAuth
{
  public class JwtAuthOption
  {
    public static string Audience { get; } = "ExampleAudience";
    public static string Issuer { get; } = "ExampleIssuer";
    public static RsaSecurityKey Key { get; } = new RsaSecurityKey(RSAKeyHelper.GenerateKey());
    public static SigningCredentials SigningCredentials { get; } = new SigningCredentials(Key, SecurityAlgorithms.RsaSha256Signature);

    public static TimeSpan ExpiresSpan { get; } = TimeSpan.FromMinutes(40);
    public static string TokenType { get; } = "Bearer";
  }

  public class RSAKeyHelper
  {
    public static RSAParameters GenerateKey()
    {
      using (var key = new RSACryptoServiceProvider(2048))
      {
        return key.ExportParameters(true);
      }
    }
  }
}
