using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Text.Json.Serialization;
using System.ComponentModel.DataAnnotations;

namespace SekaShop
{
    public class User
    {
        public int Id { get; set; }
        [Required(ErrorMessage = "Введите имя пользователя")]
        public string Email { get; set; }
        [Required(ErrorMessage = "Введите пароль пользователя")]
        public string Password { get; set; }

        public Guid CartId { get; set; }        
        public int? RoleId { get; set; }
        [JsonIgnore]
        public Cart Cart { get; set; }
        [JsonIgnore]
        public Role Role { get; set; }
    }
}
