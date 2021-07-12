using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Security.Claims;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;

namespace SekaShop.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AccountController : ControllerBase
    {
        private static ApplicationService _appService;

        public AccountController()
        {
            _appService = new ApplicationService(new ApplicationContext());
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<ActionResult<User>> Register(User user)
        {
            if (ModelState.IsValid)
            {
                var userFromDB = _appService.FindUserByEmail(user.Email);
                if (userFromDB == null)
                {
                    var userRole = _appService.FindRoleByName("user");
                    if (userRole != null)
                    {
                        user.Role = userRole;
                        user.RoleId = userRole.Id;
                    }
                    _appService.Add(user);

                    await Authenticate(user);

                    return Ok();
                }
                ModelState.AddModelError("Data", "Такой пользователь существует");
            }            
            return BadRequest(ModelState);
        }
        [HttpPost]
        [Route("[action]")]
        public async Task<ActionResult<User>> Login(User user)
        {
            if (ModelState.IsValid)
            {
                var userFromDB = _appService.FindUser(user);
                if (userFromDB != null)
                {
                    await Authenticate(userFromDB);
                    return Ok(userFromDB);
                }
                ModelState.AddModelError("Data", "Некорректные логин и(или) пароль");
            }            
            return BadRequest(ModelState);
        }
        private async Task Authenticate(User user)
        {
            var claims = new List<Claim>
            {
                new Claim(ClaimsIdentity.DefaultNameClaimType,user.Email),
                new Claim(ClaimsIdentity.DefaultRoleClaimType,user.Role.Name)
            };
            ClaimsIdentity id = new ClaimsIdentity(claims, "ApplicationCookie", ClaimsIdentity.DefaultNameClaimType, ClaimsIdentity.DefaultRoleClaimType);
            await HttpContext.SignInAsync(CookieAuthenticationDefaults.AuthenticationScheme, new ClaimsPrincipal(id));
        }
        [HttpGet]
        [Route("[action]")]
        public ActionResult<User> IsAuthenticated()
        {
            if (User.Identity.IsAuthenticated)
            {
                var user = _appService.FindUserByEmail(User.Identity.Name);
                return Ok(user);
            }
            return Unauthorized();
        }
        [HttpGet]
        [Route("[action]")]
        public async Task<IActionResult> Logout()
        {
            await HttpContext.SignOutAsync(CookieAuthenticationDefaults.AuthenticationScheme);
            return Ok();
        }
    }
}
