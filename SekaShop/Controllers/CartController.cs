using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SekaShop.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CartController : ControllerBase
    {
        private static ApplicationService _appService;

        public CartController(ApplicationContext context)
        {
            _appService = new ApplicationService(context);
        }

        [HttpGet]
        public Cart Get()
        {
            var newCart = new Cart() { Id = Guid.NewGuid(), Name = "Temp name", CartQuantity = 0 };
            _appService.Add(newCart);
            return newCart;
        }

        [HttpGet("{cartId}")]
        public Cart Get(Guid cartId)
        {
            return _appService.FindCart((Guid)cartId);  
        }
        [HttpPut]
        public ActionResult Purchase(Guid cartId)
        {
            return _appService.PurchaseCart(cartId) ? Ok() : BadRequest();
        }
    }
}
