using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SekaShop.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CartProductController : ControllerBase
    {
        private static ApplicationService _appService;

        public CartProductController(ApplicationContext context)
        {
            _appService = new ApplicationService(context);
        }

        [HttpGet("{cartId}")]
        public ActionResult<IReadOnlyCollection<Product>> Get(Guid cartId)
        {
            return _appService.FindProductsInCart(cartId);
        }

        [HttpPost]
        public void Post(Guid cartId, int productId, int count)
        {
            _appService.AddProductToCart(cartId, productId, count);
        }
        [HttpPut]
        public CartProduct Put(Guid cartId, int productId, int count)
        {
            return _appService.PutCartProduct(cartId, productId,count);
        }
        [HttpDelete]
        public CartProduct Delete(Guid cartId, int productId)
        {
            return _appService.DeleteProductFromCart(cartId, productId);
        }
    }
}
