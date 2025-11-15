"""
Veritabanı Bağlantı Modülü
MySQL bağlantısını yönetir
"""
import mysql.connector
from mysql.connector import Error
import os
from dotenv import load_dotenv

load_dotenv()

class Database:
    def __init__(self):
        self.host = os.getenv('DB_HOST', 'localhost')
        self.user = os.getenv('DB_USER', 'root')
        self.password = os.getenv('DB_PASSWORD', '')
        self.database = os.getenv('DB_NAME', 'tren_rezervasyon_db')
        self.port = int(os.getenv('DB_PORT', '3306'))
        self.connection = None
        
    def connect(self):
        """Veritabanı bağlantısı oluştur"""
        try:
            self.connection = mysql.connector.connect(
                host=self.host,
                user=self.user,
                password=self.password,
                database=self.database,
                port=self.port,
                charset='utf8mb4',
                collation='utf8mb4_turkish_ci'
            )
            if self.connection.is_connected():
                print("MySQL veritabanına başarıyla bağlanıldı!")
                return self.connection
        except Error as e:
            print(f"Veritabanı bağlantı hatası: {e}")
            return None
    
    def disconnect(self):
        """Veritabanı bağlantısını kapat"""
        if self.connection and self.connection.is_connected():
            self.connection.close()
            print("MySQL bağlantısı kapatıldı.")
    
    def execute_query(self, query, params=None, fetch=False):
        """
        SQL sorgusu çalıştır
        
        Args:
            query: SQL sorgusu
            params: Sorgu parametreleri (tuple)
            fetch: True ise sonuçları döndür
            
        Returns:
            fetch=True: Sorgu sonuçları (list of dict)
            fetch=False: Etkilenen satır sayısı
        """
        cursor = None
        try:
            if not self.connection or not self.connection.is_connected():
                self.connect()
            
            cursor = self.connection.cursor(dictionary=True)
            cursor.execute(query, params or ())
            
            if fetch:
                result = cursor.fetchall()
                return result
            else:
                self.connection.commit()
                return cursor.rowcount
                
        except Error as e:
            print(f"Sorgu hatası: {e}")
            if self.connection:
                self.connection.rollback()
            raise e
        finally:
            if cursor:
                cursor.close()
    
    def execute_many(self, query, params_list):
        """
        Çoklu insert/update için
        
        Args:
            query: SQL sorgusu
            params_list: Parametre listesi (list of tuples)
            
        Returns:
            Etkilenen satır sayısı
        """
        cursor = None
        try:
            if not self.connection or not self.connection.is_connected():
                self.connect()
            
            cursor = self.connection.cursor()
            cursor.executemany(query, params_list)
            self.connection.commit()
            return cursor.rowcount
            
        except Error as e:
            print(f"Çoklu sorgu hatası: {e}")
            if self.connection:
                self.connection.rollback()
            raise e
        finally:
            if cursor:
                cursor.close()
    
    def get_last_insert_id(self):
        """Son eklenen kaydın ID'sini döndür"""
        try:
            if not self.connection or not self.connection.is_connected():
                self.connect()
            cursor = self.connection.cursor()
            cursor.execute("SELECT LAST_INSERT_ID()")
            result = cursor.fetchone()
            cursor.close()
            return result[0] if result else None
        except Error as e:
            print(f"Last insert ID hatası: {e}")
            return None

# Global database instance
db = Database()
