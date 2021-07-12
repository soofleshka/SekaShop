using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

#nullable disable

namespace SekaShop
{
    public partial class CartProduct
    {
        public Guid CartId { get; set; }
        public int ProductId { get; set; }
        public int Quantity { get; set; }

        [JsonIgnore]
        public virtual Cart Cart { get; set; }
        [JsonIgnore]
        public virtual Product Product { get; set; }
    }
}
