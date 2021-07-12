using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

#nullable disable

namespace SekaShop
{
    public partial class Product
    {
        public Product()
        {
            CartProducts = new HashSet<CartProduct>();
            CartLikedProducts = new HashSet<CartLikedProduct>();
        }

        public int Id { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public decimal Price { get; set; }
        public int Quantity { get; set; }
        public int CategoryId { get; set; }
        public string MainImage { get; set; }

        [JsonIgnore]
        public virtual Category Category { get; set; }
        [JsonIgnore]
        public virtual ICollection<CartProduct> CartProducts { get; set; }
        public virtual ICollection<CartLikedProduct> CartLikedProducts { get; set; }
    }
}
