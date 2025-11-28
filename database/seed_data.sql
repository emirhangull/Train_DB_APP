
USE tren_rezervasyon_db;

INSERT INTO Kullanici (kullanici_adi, eposta, sifre_hash, ad_soyad, telefon, rol) VALUES
('admin', 'admin@tren.com', '123456', 'Admin Kullanıcı', '05551111111', 'admin'),
('ahmet123', 'ahmet@email.com', '123456', 'Ahmet Yılmaz', '05552222222', 'kullanici'),
('ayse456', 'ayse@email.com', '123456', 'Ayşe Kara', '05553333333', 'kullanici');

INSERT INTO Istasyon (ad, sehir) VALUES
('Ankara Garı', 'Ankara'),
('İstanbul Söğütlüçeşme', 'İstanbul'),
('Eskişehir Garı', 'Eskişehir'),
('İzmir Basmane', 'İzmir');

INSERT INTO Tren (kod, koltuk_sayisi) VALUES
('T01', 60),
('T02', 80);

INSERT INTO Sefer (tren_id, kalkis_istasyon_id, varis_istasyon_id, kalkis_zamani, varis_zamani, durum) VALUES
(1, 1, 2, CURRENT_DATE + 1 + 9/24, CURRENT_DATE + 1 + (13/24) + (30/1440), 'satisa_acik'),
(2, 4, 1, CURRENT_DATE + 1 + 8/24, CURRENT_DATE + 1 + 15/24, 'satisa_acik');

INSERT INTO Sefer (tren_id, kalkis_istasyon_id, varis_istasyon_id, kalkis_zamani, varis_zamani, durum) VALUES
(1, 3, 2, CURRENT_DATE + 18/24, CURRENT_DATE + (20/24) + (30/1440), 'satisa_acik');

INSERT INTO Yolcu (ad_soyad, eposta, telefon) VALUES
('Ahmet Yılmaz', 'ahmet.yilmaz@email.com', '05551234567'),
('Ayşe Kaya', 'ayse.kaya@email.com', '05559876543'),
('Mehmet Demir', 'mehmet.demir@email.com', '05555555555');

INSERT INTO Rezervasyon (pnr, durum, kullanici_id) VALUES
('ABC123XYZ', 'odendi', 2);



INSERT INTO Bilet (rezervasyon_id, sefer_id, yolcu_id, koltuk_no, fiyat, durum) VALUES
(1, 1, 1, 15, 250.00, 'kesildi'),
(1, 1, 2, 16, 250.00, 'kesildi');

INSERT INTO Bilet (rezervasyon_id, sefer_id, yolcu_id, koltuk_no, fiyat, durum) VALUES
(2, 2, 3, 20, 300.00, 'rezerve');

INSERT INTO Bilet (rezervasyon_id, sefer_id, yolcu_id, koltuk_no, fiyat, durum) VALUES
(2, 2, 2, 21, 300.00, 'iade');

INSERT INTO Odeme (rezervasyon_id, yontem, tutar, durum) VALUES
(1, 'kart', 500.00, 'basarili');


INSERT INTO Bilet (rezervasyon_id, sefer_id, yolcu_id, koltuk_no, fiyat, durum) VALUES
(1, 1, 1, 1, 250.00, 'kesildi'),
(1, 1, 1, 2, 250.00, 'kesildi'),
(1, 1, 2, 3, 250.00, 'kesildi'),
(1, 1, 3, 4, 250.00, 'kesildi');


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

SELECT * FROM vw_sefer_detay;

SELECT * FROM vw_rezervasyon_ozet;
