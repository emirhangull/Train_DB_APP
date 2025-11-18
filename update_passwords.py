#!/usr/bin/env python3
"""
Update user passwords with correct bcrypt hashes
"""
import sys
sys.path.insert(0, '/Users/eylul/Desktop/72sonn/Train_DB_APP/backend')

from database import db
import bcrypt

# Generate hash for password "123456"
password = "123456"
hashed = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

print(f"Generated hash: {hashed}")

# Update all users
try:
    query = """
    UPDATE Kullanici
    SET sifre_hash = %s
    WHERE kullanici_adi IN ('admin', 'ahmet123', 'ayse456')
    """
    rows = db.execute_query(query, (hashed,))
    print(f"Updated {rows} users")
    print("Password update successful!")
except Exception as e:
    print(f"Error: {e}")
