-- Tren Rezervasyon Sistemi - Test Verileri
-- Bu script schema.sql çalıştırıldıktan sonra çalıştırılmalıdır

USE tren_rezervasyon_db;

-- 1. Kullanıcılar (3 adet - 1 admin, 2 normal kullanıcı)
-- Şifreler bcrypt ile hash'lenmiş (tümü için şifre: "123456")
-- Hash güncellendi: 2025-11-18
INSERT INTO Kullanici (kullanici_adi, eposta, sifre_hash, ad_soyad, telefon, rol) VALUES
('admin', 'admin@tren.com', '$2b$12$ccPXXNAUT/3cukWb1MoWMOCC4IjbV0gafVYtylTqFZbfySPmZM/BO', 'Admin Kullanıcı', '05551111111', 'admin'),
('ahmet123', 'ahmet@email.com', '$2b$12$ccPXXNAUT/3cukWb1MoWMOCC4IjbV0gafVYtylTqFZbfySPmZM/BO', 'Ahmet Yılmaz', '05552222222', 'kullanici'),
('ayse456', 'ayse@email.com', '$2b$12$ccPXXNAUT/3cukWb1MoWMOCC4IjbV0gafVYtylTqFZbfySPmZM/BO', 'Ayşe Kara', '05553333333', 'kullanici');

-- 2. İstasyonlar (4 adet)
INSERT INTO Istasyon (ad, sehir) VALUES
('Ankara Garı', 'Ankara'),
('İstanbul Söğütlüçeşme', 'İstanbul'),
('Eskişehir Garı', 'Eskişehir'),
('İzmir Basmane', 'İzmir');

-- 3. Trenler (2 adet)
INSERT INTO Tren (kod, koltuk_sayisi) VALUES
('T01', 60),
('T02', 80);

-- 4. Seferler (2 adet - yarın için)
INSERT INTO Sefer (tren_id, kalkis_istasyon_id, varis_istasyon_id, kalkis_zamani, varis_zamani, durum) VALUES
(1, 1, 2, DATE_ADD(CURDATE(), INTERVAL 1 DAY) + INTERVAL 9 HOUR, DATE_ADD(CURDATE(), INTERVAL 1 DAY) + INTERVAL 13 HOUR + INTERVAL 30 MINUTE, 'satisa_acik'),
(2, 4, 1, DATE_ADD(CURDATE(), INTERVAL 1 DAY) + INTERVAL 8 HOUR, DATE_ADD(CURDATE(), INTERVAL 1 DAY) + INTERVAL 15 HOUR, 'satisa_acik');

-- Bugün için bir sefer
INSERT INTO Sefer (tren_id, kalkis_istasyon_id, varis_istasyon_id, kalkis_zamani, varis_zamani, durum) VALUES
(1, 3, 2, CURDATE() + INTERVAL 18 HOUR, CURDATE() + INTERVAL 20 HOUR + INTERVAL 30 MINUTE, 'satisa_acik');

-- 5. Yolcular (3 adet)
INSERT INTO Yolcu (ad_soyad, eposta, telefon) VALUES
('Ahmet Yılmaz', 'ahmet.yilmaz@email.com', '05551234567'),
('Ayşe Kaya', 'ayse.kaya@email.com', '05559876543'),
('Mehmet Demir', 'mehmet.demir@email.com', '05555555555');

-- 6. Rezervasyonlar (2 adet)
-- Rezervasyon 1: Ödendi (ahmet123)
INSERT INTO Rezervasyon (pnr, durum, kullanici_id) VALUES
('ABC123XYZ', 'odendi', 2);

-- Rezervasyon 2: Oluşturuldu (henüz ödenmedi - ayse456)
INSERT INTO Rezervasyon (pnr, durum, kullanici_id) VALUES
('DEF456UVW', 'olusturuldu', 3);

-- 7. Biletler (4 adet)
-- Rezervasyon 1 için 2 bilet (Ankara -> İstanbul seferi)
INSERT INTO Bilet (rezervasyon_id, sefer_id, yolcu_id, koltuk_no, fiyat, durum) VALUES
(1, 1, 1, 15, 250.00, 'kesildi'),
(1, 1, 2, 16, 250.00, 'kesildi');

-- Rezervasyon 2 için 1 bilet (İzmir -> Ankara seferi)
INSERT INTO Bilet (rezervasyon_id, sefer_id, yolcu_id, koltuk_no, fiyat, durum) VALUES
(2, 2, 3, 20, 300.00, 'rezerve');

-- İptal edilmiş bir bilet örneği
INSERT INTO Bilet (rezervasyon_id, sefer_id, yolcu_id, koltuk_no, fiyat, durum) VALUES
(2, 2, 2, 21, 300.00, 'iade');

-- 8. Ödeme (1 adet - başarılı)
INSERT INTO Odeme (rezervasyon_id, yontem, tutar, durum) VALUES
(1, 'kart', 500.00, 'basarili');

-- Daha fazla test verisi ekleyelim
-- Dolu koltuk kontrolü için
INSERT INTO Bilet (rezervasyon_id, sefer_id, yolcu_id, koltuk_no, fiyat, durum) VALUES
(1, 1, 1, 1, 250.00, 'kesildi'),
(1, 1, 1, 2, 250.00, 'kesildi'),
(1, 1, 2, 3, 250.00, 'kesildi'),
(1, 1, 3, 4, 250.00, 'kesildi');

-- Verification Queries (Test için)
-- Tüm verileri kontrol et
SELECT 'Kullanıcılar' AS Tablo, COUNT(*) AS Kayit_Sayisi FROM Kullanici
UNION ALL
SELECT 'İstasyonlar', COUNT(*) FROM Istasyon
UNION ALL
SELECT 'Trenler', COUNT(*) FROM Tren
UNION ALL
SELECT 'Seferler', COUNT(*) FROM Sefer
UNION ALL
SELECT 'Yolcular', COUNT(*) FROM Yolcu
UNION ALL
SELECT 'Rezervasyonlar', COUNT(*) FROM Rezervasyon
UNION ALL
SELECT 'Biletler', COUNT(*) FROM Bilet
UNION ALL
SELECT 'Ödemeler', COUNT(*) FROM Odeme;

-- Sefer detaylarını görüntüle
SELECT * FROM vw_sefer_detay;

-- Rezervasyon özetini görüntüle
SELECT * FROM vw_rezervasyon_ozet;
