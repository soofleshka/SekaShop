using System;
using System.Collections.Generic;
using System.Linq;
using Microsoft.EntityFrameworkCore;

namespace SekaShop
{
    public class DBService : IDBService
    {
        private ApplicationContext _dbContext;

        public DBService(ApplicationContext dbContext)
        {
            _dbContext = dbContext;
        }

        public void Add<T>(T entity) where T : class
        {
            _dbContext.Set<T>().Add(entity);
            _dbContext.SaveChanges();
        }
        public T Find<T>(T entity) where T : class
        {
            return _dbContext.Set<T>().Find(entity);
        }
        public void Remove<T>(T entity) where T : class
        {
            _dbContext.Set<T>().Remove(entity);
            _dbContext.SaveChanges();
        }
        public List<T> FindAll<T>() where T : class
        {
            return _dbContext.Set<T>().ToList();
        }
        public void SaveChanges()
        {
            _dbContext.SaveChanges();
        }

        public Product FindProduct(int productId)
        {
            return _dbContext.Products.FirstOrDefault(p => p.Id == productId);
        }
        public List<Product> FindProductsBySearchingString(string searchString)
        {
            return _dbContext.Products.Where(p => p.Title.ToLower().Contains(searchString.ToLower())).ToList();
        }
        public List<Product> FindProductsByCategoryId(int categoryId)
        {
            return _dbContext.Products.Include(p => p.Category).Where(pr => pr.CategoryId == categoryId).ToList();
        }

        public Cart FindCart(Guid cartId)
        {
            return _dbContext.Carts.FirstOrDefault(c => c.Id == cartId);
        }
        public Cart FindCartWithCartProductsAndWithCartLikedProducts(Guid cartId)
        {
            return _dbContext.Carts.Include(c=>c.CartProducts).Include(c=>c.CartLikedProducts).FirstOrDefault(c => c.Id == cartId);
        }
        public Cart FindCartIncludingProducts(Guid cartId)
        {   
            return _dbContext.Carts.Include(c => c.CartProducts).ThenInclude(cp => cp.Product)
                .FirstOrDefault(c => c.Id == cartId);
        }

        public CartProduct FindCartProduct(Guid cartId, int productId)
        {
            return _dbContext.CartProducts.FirstOrDefault(cp => cp.CartId == cartId && cp.ProductId == productId);
        }
        public List<CartProduct> FindProductsInCart(Guid cartId)
        {
            return _dbContext.CartProducts.Include(cp=>cp.Cart).Include(cp=>cp.Product).Where(cp => cp.CartId == cartId).ToList();
        }        
        public CartLikedProduct FindProductInCartLikedProducts(Guid cartId, int productId)
        {
            return _dbContext.CartLikedProducts.Include(clp => clp.Cart).Include(clp => clp.Product).FirstOrDefault(clp => clp.CartId == cartId && clp.ProductId == productId);
        }
        public List<CartLikedProduct> FindProductsInCartLikedProducts(Guid cartId)
        {
            return _dbContext.CartLikedProducts.Include(clp => clp.Cart).Include(clp => clp.Product).Where(clp => clp.CartId == cartId).ToList();
        }        

        public Category FindCategory(int categoryId)
        {
            return _dbContext.Categories.FirstOrDefault(c => c.Id == categoryId);
        }   

        public User FindUserByEmail(string email)
        {
            return _dbContext.Users.FirstOrDefault(u => u.Email == email);
        }
        public User FindUser(User user)
        {
            return _dbContext.Users.Include(u => u.Role).FirstOrDefault(u => u.Email == user.Email && u.Password == user.Password);
        }
        public Role FindRoleByName(string name)
        {
            return _dbContext.Roles.FirstOrDefault(r => r.Name == name);
        }
    }
}