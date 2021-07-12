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

        public CategoryController()
        {
            _appService = new ApplicationService(new ApplicationContext());
        }

        [HttpGet("{categoryId}")]
        public Category Get(int categoryId)
        {
            return _appService.FindCategory(categoryId);
        }
    }
}
