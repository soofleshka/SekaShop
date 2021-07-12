using System;
using System.Text.Json.Serialization;

namespace SekaShop
{
    public class CartLikedProduct
    {
        public Guid CartId { get; set; }
        public int ProductId { get; set; }

        [JsonIgnore]
        public virtual Cart Cart { get; set; }
        [JsonIgnore]
        public virtual Product Product { get; set; }
    }
}

