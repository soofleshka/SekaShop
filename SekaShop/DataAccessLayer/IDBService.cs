using System.Collections.Generic;

namespace SekaShop
{
    public interface IDBService
    {
        void Add<T>(T entity) where T : class;
        void Remove<T>(T entity) where T : class;
        List<T> FindAll<T>() where T : class;
        void SaveChanges();
    }
}