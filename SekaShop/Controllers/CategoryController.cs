using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SekaShop.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CategoryController : ControllerBase
    {
        private static ApplicationService _appService;

        public CategoryController(ApplicationContext context)
        {
            _appService = new ApplicationService(context);
        }

        [HttpGet("{categoryId}")]
        public Category Get(int categoryId)
        {
            return _appService.FindCategory(categoryId);
        }
    }
}
