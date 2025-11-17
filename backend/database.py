"""
Veritabanı Bağlantı Modülü
MySQL bağlantısını yönetir - Connection Pooling ile
"""
import mysql.connector
from mysql.connector import Error, pooling
import os
from dotenv import load_dotenv

load_dotenv()

class Database:
    def __init__(self):
        self.host = os.getenv('DB_HOST', 'localhost')
        self.user = os.getenv('DB_USER', 'root')
        self.password = os.getenv('DB_PASSWORD', 'emre2004')
        self.database = os.getenv('DB_NAME', 'tren_rezervasyon_db')
        self.port = int(os.getenv('DB_PORT', '3306'))
        self.pool = None
        self._last_insert_id = None
        self._initialize_pool()
        
    def _initialize_pool(self):
        """Connection pool oluştur"""
        try:
            self.pool = pooling.MySQLConnectionPool(
                pool_name="tren_pool",
                pool_size=10,
                pool_reset_session=True,
                host=self.host,
                user=self.user,
                password=self.password,
                database=self.database,
                port=self.port,
                charset='utf8mb4',
                collation='utf8mb4_turkish_ci'
            )
            print(f"MySQL Connection Pool oluşturuldu (pool_size=10)")
        except Error as e:
            print(f"Connection Pool hatası: {e}")
            self.pool = None
        
    def get_connection(self):
        """Pool'dan bir bağlantı al"""
        try:
            if self.pool:
                return self.pool.get_connection()
            else:
                # Pool yoksa direkt bağlantı oluştur (fallback)
                connection = mysql.connector.connect(
                    host=self.host,
                    user=self.user,
                    password=self.password,
                    database=self.database,
                    port=self.port,
                    charset='utf8mb4',
                    collation='utf8mb4_turkish_ci'
                )
                if connection.is_connected():
                    return connection
        except Error as e:
            print(f"Veritabanı bağlantı hatası: {e}")
            raise e
    
    def connect(self):
        """Geriye uyumluluk için - get_connection'ı çağırır"""
        return self.get_connection()
    
    def disconnect(self, connection=None):
        """Veritabanı bağlantısını kapat"""
        if connection and connection.is_connected():
            connection.close()
    
    def execute_query(self, query, params=None, fetch=False):
        connection = None
        cursor = None
        try:
            connection = self.get_connection()
            cursor = connection.cursor(dictionary=True)
            cursor.execute(query, params or ())

            if fetch:
                result = cursor.fetchall()
                return result
            else:
                connection.commit()
                # INSERT ise lastrowid anlamlıdır
                self._last_insert_id = cursor.lastrowid
                return cursor.rowcount

        except Error as e:
            print(f"Sorgu hatası: {e}")
            if connection:
                connection.rollback()
            raise e
        finally:
            if cursor:
                cursor.close()
            if connection and connection.is_connected():
                connection.close()
    
    def execute_many(self, query, params_list):
        """
        Çoklu insert/update için - Her çağrıda yeni connection açar ve kapatır
        
        Args:
            query: SQL sorgusu
            params_list: Parametre listesi (list of tuples)
            
        Returns:
            Etkilenen satır sayısı
        """
        connection = None
        cursor = None
        try:
            connection = self.get_connection()
            cursor = connection.cursor()
            cursor.executemany(query, params_list)
            connection.commit()
            return cursor.rowcount
            
        except Error as e:
            print(f"Çoklu sorgu hatası: {e}")
            if connection:
                connection.rollback()
            raise e
        finally:
            if cursor:
                cursor.close()
            if connection and connection.is_connected():
                connection.close()
    
    def get_last_insert_id(self):
        """Son execute_query çağrısında oluşan AUTO_INCREMENT ID'yi döndür."""
        return self._last_insert_id

# Global database instance
db = Database()
