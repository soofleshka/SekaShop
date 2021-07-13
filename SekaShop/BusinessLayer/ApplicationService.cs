using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SekaShop
{
    public class ApplicationService
    {
        private DBService _dbService;

        public ApplicationService(ApplicationContext dbContext)
        {
            _dbService = new DBService(dbContext);
        }

        public void Add<T>(T entity) where T : class
        {
            _dbService.Add(entity);
        }
        public void Remove<T>(T entity) where T : class
        {
            _dbService.Remove(entity);
        }
        public T Find<T>(T entity) where T : class
        {
            return _dbService.Find(entity);
        }

        public Product FindProductById(int productId)
        {
            return _dbService.FindProduct(productId);
        }
        public List<Product> FindAllProducts()
        {
            return _dbService.FindAll<Product>();
        }        
        public List<Product> FindProductsBySearchingString(string searchString)
        {
            return _dbService.FindProductsBySearchingString(searchString);
        }
        public List<Product> FindProductsByCategoryId(int categoryId)
        {
            return _dbService.FindProductsByCategoryId(categoryId);
        }
        public List<Product> FindProductsInCart(Guid cartId)
        {
            var cartProducts = FindCartProducts(cartId);
            var productList = new List<Product>();
            foreach (var cartProduct in cartProducts)
            {
                var product = cartProduct.Product;
                product.Quantity = cartProduct.Quantity;
                productList.Add(product);
            }

            return productList;
        }
        public List<Product> FindProductsInCartLikedProducts(Guid cartId)
        {
            var cartLikedProducts = FindCartLikedProducts(cartId);
            var productList = new List<Product>();
            foreach (var cartProduct in cartLikedProducts)
            {
                var product = cartProduct.Product;
                productList.Add(product);
            }

            return productList;
        }

        public Cart FindCart(Guid cartId)
        {
            return _dbService.FindCart(cartId);
        }
        public Cart FindCartWithCartProductsAndWithCartLikedProducts(Guid cartId)
        {
            return _dbService.FindCartWithCartProductsAndWithCartLikedProducts(cartId);
        }
        public void AddProductToCart(Guid cartId, int productId, int count)
        {
            var cartProducts = FindCartProducts(cartId);
            var cartProduct = cartProducts.FirstOrDefault(cp => cp.ProductId == productId);
            if (cartProduct != null)
            {
                cartProduct.Cart.CartQuantity += count;
                cartProduct.Quantity += count;
                _dbService.SaveChanges();
            }
            else
            {
                cartProduct = new CartProduct { CartId = cartId, ProductId = productId, Quantity = count };
                _dbService.Add(cartProduct);

                var cart = _dbService.FindCart(cartId);
                cart.CartQuantity += count;
                _dbService.SaveChanges();
            }
        }
        public bool PurchaseCart(Guid cartId)
        {
            try
            {
                var cart = FindCartWithCartProductsAndWithCartLikedProducts(cartId);
                foreach (var cartProduct in cart.CartProducts)
                {
                    var product = FindProductById(cartProduct.ProductId);
                    if (product.Quantity - cartProduct.Quantity < 0)
                        throw new Exception("Столько " + product.Title + " нет в наличии. Максимум для заказа: " + product.Quantity);
                }
                foreach (var cartProduct in cart.CartProducts)
                {
                    FindProductById(cartProduct.ProductId).Quantity -= cartProduct.Quantity;
                    cart.CartQuantity -= cartProduct.Quantity;
                    _dbService.Remove(cartProduct);
                }
                return true;
            }
            catch (Exception)
            {
                return false;
            }
        }

        public Category FindCategory(int categoryId)
        {
            return _dbService.FindCategory(categoryId);
        }

        public CartProduct FindCartProduct(Guid cartId, int productId)
        {
            return _dbService.FindCartProduct(cartId, productId);
        }
        public List<CartProduct> FindCartProducts(Guid cartId)
        {
            return _dbService.FindProductsInCart(cartId);
        }
        public CartProduct PutCartProduct(Guid cartId, int productId, int count)
        {
            var cartProduct = FindCartProduct(cartId, productId);
            var cart = FindCart(cartId);
            if (cartProduct != null)
            {
                cart.CartQuantity += (count - cartProduct.Quantity);
                cartProduct.Quantity = count;
                _dbService.SaveChanges();
            }
            return cartProduct;
        }
        public CartProduct DeleteProductFromCart(Guid cartId, int productId)
        {
            var cartProduct = FindCartProduct(cartId, productId);
            var cart = FindCart(cartId);
            if (cartProduct != null)
            {
                cart.CartQuantity -= cartProduct.Quantity;
                _dbService.SaveChanges();
                _dbService.Remove(cartProduct);
            }
            return cartProduct;
        }

        public CartLikedProduct FindCartLikedProduct(Guid cartId, int productId)
        {
            return _dbService.FindProductInCartLikedProducts(cartId, productId);
        }
        public List<CartLikedProduct> FindCartLikedProducts(Guid cartId)
        {
            return _dbService.FindProductsInCartLikedProducts(cartId);
        }
        public CartLikedProduct AddProductToCartLikedProducts(Guid cartId, int productId)
        {
            var cartLikedProduct = FindCartLikedProduct(cartId, productId);
            if (cartLikedProduct != null)
            {
                _dbService.Remove(cartLikedProduct);
                cartLikedProduct.Cart.LikedProductsQuantity -= 1;
                _dbService.SaveChanges();
                return null;
            }
            else
            {
                cartLikedProduct = new CartLikedProduct { CartId = cartId, ProductId = productId};
                _dbService.Add(cartLikedProduct);
                var cart = FindCart(cartId);
                cart.LikedProductsQuantity += 1;
                _dbService.SaveChanges();
                return cartLikedProduct;
            }
        }

        public User FindUser(User user)
        {
            return _dbService.FindUser(user);
        }
        public User FindUserByEmail(string email)
        {
            return _dbService.FindUserByEmail(email);
        }
        public Role FindRoleByName(string name)
        {
            return _dbService.FindRoleByName(name);
        }
    }
}
