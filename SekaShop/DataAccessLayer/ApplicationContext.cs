using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata;

#nullable disable

namespace SekaShop
{
    public partial class ApplicationContext : DbContext
    {
        public ApplicationContext()
        {
        }

        public ApplicationContext(DbContextOptions<ApplicationContext> options)
            : base(options)
        {
        }

        public virtual DbSet<Cart> Carts { get; set; }
        public virtual DbSet<CartProduct> CartProducts { get; set; }
        public virtual DbSet<Category> Categories { get; set; }
        public virtual DbSet<CartLikedProduct> CartLikedProducts { get; set; }
        public virtual DbSet<Product> Products { get; set; }
        public virtual DbSet<Role> Roles { get; set; }
        public virtual DbSet<User> Users { get; set; }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            if (!optionsBuilder.IsConfigured)
            {
                optionsBuilder.UseSqlServer("Server=DESKTOP-Q9JK4PT;Database=shopdblearning;Trusted_Connection=True;");
            }
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.HasAnnotation("Relational:Collation", "SQL_Latin1_General_CP1_CI_AS");

            modelBuilder.Entity<CartProduct>(entity =>
            {
                entity.HasKey(e => new { e.CartId, e.ProductId });

                entity.ToTable("CartProduct");

                entity.HasIndex(e => e.ProductId, "IX_CartProduct_ProductId");

                entity.HasOne(d => d.Cart)
                    .WithMany(p => p.CartProducts)
                    .HasForeignKey(d => d.CartId);

                entity.HasOne(d => d.Product)
                    .WithMany(p => p.CartProducts)
                    .HasForeignKey(d => d.ProductId);
            });

            modelBuilder.Entity<Category>(entity =>
            {
                entity.HasIndex(e => e.Name, "AK_Categories_Name")
                    .IsUnique();

                entity.Property(e => e.Name).IsRequired();
            });

            modelBuilder.Entity<CartLikedProduct>(entity =>
            {
                entity.HasKey(e => new { e.CartId, e.ProductId });

                entity.ToTable("CartLikedProducts");

                entity.HasOne(d => d.Cart)
                    .WithMany(p => p.CartLikedProducts)
                    .HasForeignKey(d => d.CartId);

                entity.HasOne(d => d.Product)
                    .WithMany(p => p.CartLikedProducts)
                    .HasForeignKey(d => d.ProductId);
            });

            modelBuilder.Entity<Product>(entity =>
            {
                entity.HasIndex(e => e.CategoryId, "IX_Products_CategoryId");

                entity.Property(e => e.Price).HasColumnType("decimal(18, 2)");

                entity.HasOne(d => d.Category)
                    .WithMany(p => p.Products)
                    .HasForeignKey(d => d.CategoryId);
            });

            modelBuilder.Entity<Cart>(entity =>
            {
                entity.HasOne(d => d.User)
                    .WithOne(p => p.Cart)
                    .HasForeignKey<User>(d => d.CartId);
            });

            modelBuilder.Entity<User>(entity =>
            {
                entity.HasOne(d => d.Role)
                    .WithMany(p => p.Users)
                    .HasForeignKey(d => d.RoleId);
            });

            OnModelCreatingPartial(modelBuilder);
        }

        partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
    }
}
