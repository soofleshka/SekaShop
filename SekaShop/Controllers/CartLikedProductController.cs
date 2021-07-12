using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SekaShop.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CartLikedProductController : ControllerBase
    {
        private static ApplicationService _appService;

        public CartLikedProductController()
        {
            _appService = new ApplicationService(new ApplicationContext());
        }

        [HttpGet("{cartId}")]
        public ActionResult<IReadOnlyCollection<Product>> Get(Guid cartId)
        {
            return _appService.FindProductsInCartLikedProducts(cartId);
        }

        [HttpPost]
        public CartLikedProduct Post(Guid cartId, int productId)
        {
            return _appService.AddProductToCartLikedProducts(cartId, productId);
        }
    }
}
