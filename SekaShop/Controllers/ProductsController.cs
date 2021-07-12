using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SekaShop
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProductsController : ControllerBase
    {
        private static ApplicationService _appService;

        public ProductsController(ApplicationContext context)
        {
            _appService = new ApplicationService(context);
        }

        [HttpGet]
        public ActionResult<IReadOnlyCollection<Product>> Get()
        {
            return _appService.FindAllProducts();
        }

        [HttpGet("{productId}")]
        public Product Get(int productId)
        {
            return _appService.FindProductById(productId);
        }
        [HttpGet("[action]")]
        public List<Product> Search(string searchString)
        {
            return _appService.FindProductsBySearchingString(searchString);
        }

        [HttpGet("[action]/{categoryId}")]
        public ActionResult<IReadOnlyCollection<Product>> GetProductsByCategory(int categoryId)
        {
            return _appService.FindProductsByCategoryId(categoryId);
        }
    }
}
