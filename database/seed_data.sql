USE tren_rezervasyon_db;

-- Kullanıcılar (2 admin, 10 kullanıcı)
INSERT INTO Kullanici (kullanici_adi, eposta, sifre_hash, ad_soyad, telefon, rol) VALUES
('admin', 'admin@tren.com', '123456', 'Admin Kullanıcı', '05551111111', 'admin'),
('ahmet123', 'ahmet@email.com', '123456', 'Ahmet Yılmaz', '05552222222', 'kullanici'),
('ayse456', 'ayse@email.com', '123456', 'Ayşe Kara', '05553333333', 'kullanici'),
('mehmet34', 'mehmet@tren.com', '123456', 'Mehmet Arslan', '05554444444', 'kullanici'),
('fatma09', 'fatma@tren.com', '123456', 'Fatma Güneş', '05556666666', 'kullanici'),
('emrecan', 'emre@tren.com', '123456', 'Emre Can', '05557777777', 'kullanici'),
('zeynep99', 'zeynep@tren.com', '123456', 'Zeynep Aksoy', '05558888888', 'kullanici'),
('veli_tr', 'veli@tren.com', '123456', 'Veli Kaya', '05559999999', 'kullanici'),
('melis', 'melis@tren.com', '123456', 'Melis Demir', '05550001111', 'kullanici'),
('burak_admin', 'burak@tren.com', '123456', 'Burak Şahin', '05550002222', 'admin'),
('deniz89', 'deniz@tren.com', '123456', 'Deniz Çetin', '05550003333', 'kullanici'),
('ozge77', 'ozge@tren.com', '123456', 'Özge Yalçın', '05550004444', 'kullanici');

-- İstasyonlar (12 şehir)
INSERT INTO Istasyon (ad, sehir) VALUES
('Ankara Garı', 'Ankara'),
('İstanbul Söğütlüçeşme', 'İstanbul'),
('Eskişehir Garı', 'Eskişehir'),
('İzmir Basmane', 'İzmir'),
('Konya Garı', 'Konya'),
('Bursa Yenişehir', 'Bursa'),
('Adana Garı', 'Adana'),
('Gaziantep Garı', 'Gaziantep'),
('Samsun Garı', 'Samsun'),
('Antalya Terminal', 'Antalya'),
('Trabzon Garı', 'Trabzon'),
('Kayseri Garı', 'Kayseri');

-- Trenler (12 tren, farklı kapasite)
INSERT INTO Tren (kod, koltuk_sayisi) VALUES
('T01', 60),
('T02', 80),
('T03', 72),
('T04', 100),
('T05', 90),
('T06', 55),
('T07', 120),
('T08', 65),
('T09', 110),
('T10', 70),
('T11', 95),
('T12', 85);

-- Seferler (15 sefer, satisa_acik ve planli)
INSERT INTO Sefer (tren_id, kalkis_istasyon_id, varis_istasyon_id, kalkis_zamani, varis_zamani, durum) VALUES
(1, 1, 2, CURRENT_DATE + 1 + 9/24, CURRENT_DATE + 1 + (13/24) + (30/1440), 'satisa_acik'),
(2, 4, 1, CURRENT_DATE + 1 + 8/24, CURRENT_DATE + 1 + 15/24, 'satisa_acik'),
(1, 3, 2, CURRENT_DATE + 18/24, CURRENT_DATE + (20/24) + (30/1440), 'satisa_acik'),
(3, 2, 5, CURRENT_DATE + 2 + 7/24, CURRENT_DATE + 2 + 10/24, 'satisa_acik'),
(4, 5, 2, CURRENT_DATE + 3 + 6/24, CURRENT_DATE + 3 + 11/24, 'planli'),
(5, 7, 8, CURRENT_DATE + 1 + 14/24, CURRENT_DATE + 1 + 19/24, 'satisa_acik'),
(6, 9, 4, CURRENT_DATE + 4 + 8/24, CURRENT_DATE + 4 + 12/24, 'planli'),
(7, 1, 10, CURRENT_DATE + 2 + 15/24, CURRENT_DATE + 3 + 1/24, 'satisa_acik'),
(8, 6, 3, CURRENT_DATE + 5 + 7/24, CURRENT_DATE + 5 + 13/24, 'planli'),
(9, 2, 9, CURRENT_DATE + 1 + 5/24, CURRENT_DATE + 1 + 9/24, 'satisa_acik'),
(10, 11, 12, CURRENT_DATE + 2 + 8/24, CURRENT_DATE + 2 + 12/24, 'satisa_acik'),
(11, 12, 3, CURRENT_DATE + 3 + 9/24, CURRENT_DATE + 3 + 13/24, 'satisa_acik'),
(12, 8, 6, CURRENT_DATE + 1 + 6/24, CURRENT_DATE + 1 + 11/24, 'satisa_acik'),
(3, 4, 7, CURRENT_DATE + 4 + 10/24, CURRENT_DATE + 4 + 14/24, 'planli'),
(5, 10, 11, CURRENT_DATE + 2 + 16/24, CURRENT_DATE + 3 + 2/24, 'satisa_acik');

-- Yolcular (12 yolcu)
INSERT INTO Yolcu (ad_soyad, eposta, telefon) VALUES
('Ahmet Yılmaz', 'ahmet.yilmaz@email.com', '05551234567'),
('Ayşe Kaya', 'ayse.kaya@email.com', '05559876543'),
('Mehmet Demir', 'mehmet.demir@email.com', '05555555555'),
('Elif Yıldız', 'elif.yildiz@email.com', '05556667777'),
('Caner Toprak', 'caner.toprak@email.com', '05557778888'),
('Derya Çelik', 'derya.celik@email.com', '05558889999'),
('Cem Koç', 'cem.koc@email.com', '05550003344'),
('Sude Acar', 'sude.acar@email.com', '05550005566'),
('Hasan Yüce', 'hasan.yuce@email.com', '05550007788'),
('Pınar Uslu', 'pinar.uslu@email.com', '05550009911'),
('Kerem Şimşek', 'kerem.simsek@email.com', '05550001122'),
('Nazlı Er', 'nazli.er@email.com', '05550002233');

-- Rezervasyonlar (12 adet, farklı durumlar)
INSERT INTO Rezervasyon (pnr, durum, kullanici_id) VALUES
('ABC123XYZ', 'odendi', 2),
('DEF456UVW', 'odendi', 3),
('GHI789RST', 'olusturuldu', 4),
('JKL012MNO', 'odendi', 5),
('PQR345ABC', 'odendi', 6),
('STU678DEF', 'olusturuldu', 7),
('VWX901GHI', 'odendi', 8),
('YZA234JKL', 'iptal', 9),
('MNO567PQR', 'odendi', 10),
('BCD890TUV', 'olusturuldu', 1),
('EFG112HJK', 'odendi', 11),
('LMN334OPQ', 'odendi', 12);

-- Biletler (çeşitli sefer ve yolcular; koltuk numaraları tren kapasitesine uygun)
INSERT INTO Bilet (rezervasyon_id, sefer_id, yolcu_id, koltuk_no, fiyat, durum) VALUES
(1, 1, 1, 10, 250.00, 'kesildi'),
(1, 1, 2, 11, 250.00, 'kesildi'),
(2, 2, 3, 20, 300.00, 'rezerve'),
(2, 2, 2, 21, 300.00, 'iade'),
(3, 3, 4, 5, 220.00, 'rezerve'),
(4, 4, 5, 12, 180.00, 'kesildi'),
(5, 5, 6, 6, 320.00, 'kesildi'),
(5, 5, 7, 7, 320.00, 'kesildi'),
(6, 6, 8, 18, 280.00, 'rezerve'),
(7, 7, 9, 7, 260.00, 'kesildi'),
(8, 8, 10, 30, 290.00, 'rezerve'),
(9, 9, 4, 9, 210.00, 'kesildi'),
(9, 9, 5, 10, 210.00, 'kesildi'),
(10, 10, 6, 22, 240.00, 'rezerve'),
(11, 11, 7, 15, 200.00, 'kesildi'),
(12, 12, 8, 8, 230.00, 'kesildi'),
(3, 13, 9, 12, 245.00, 'rezerve'),
(4, 14, 10, 25, 260.00, 'kesildi'),
(5, 15, 11, 40, 275.00, 'kesildi'),
(6, 13, 12, 14, 245.00, 'rezerve'),
(7, 14, 3, 26, 260.00, 'kesildi'),
(8, 15, 2, 41, 275.00, 'iade'),
(10, 11, 1, 16, 200.00, 'kesildi');

-- Ödemeler (odendi veya iade senaryoları)
INSERT INTO Odeme (rezervasyon_id, yontem, tutar, durum) VALUES
(1, 'kart', 500.00, 'basarili'),
(2, 'kart', 600.00, 'basarili'),
(3, 'kart', 220.00, 'basarisiz'),
(4, 'kart', 180.00, 'basarili'),
(5, 'kart', 640.00, 'basarili'),
(6, 'nakit', 280.00, 'basarisiz'),
(7, 'kart', 260.00, 'basarili'),
(8, 'kart', 290.00, 'iade'),
(9, 'nakit', 420.00, 'basarili'),
(10, 'kart', 240.00, 'basarili'),
(11, 'kart', 200.00, 'basarili'),
(12, 'kart', 230.00, 'basarili');


-- Özet kontroller
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
