using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

#nullable disable

namespace SekaShop
{
    public partial class Cart
    {
        public Cart()
        {
            CartProducts = new HashSet<CartProduct>();
            CartLikedProducts = new HashSet<CartLikedProduct>();
        }

        public Guid Id { get; set; }
        public string Name { get; set; }
        public int CartQuantity { get; set; }
        public int LikedProductsQuantity { get; set; }

        [JsonIgnore]
        public User User { get; set; }
        public virtual ICollection<CartProduct> CartProducts { get; set; }
        public virtual ICollection<CartLikedProduct> CartLikedProducts { get; set; }
    }
}
