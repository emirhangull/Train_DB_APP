
DROP DATABASE IF EXISTS tren_rezervasyon_db;
CREATE DATABASE tren_rezervasyon_db CHARACTER SET utf8mb4 COLLATE utf8mb4_turkish_ci;
USE tren_rezervasyon_db;

CREATE TABLE Istasyon (
    istasyon_id INT AUTO_INCREMENT PRIMARY KEY,
    ad VARCHAR(100) NOT NULL,
    sehir VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_sehir (sehir)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_turkish_ci;

CREATE TABLE Tren (
    tren_id INT AUTO_INCREMENT PRIMARY KEY,
    kod VARCHAR(20) NOT NULL UNIQUE,
    koltuk_sayisi INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CHECK (koltuk_sayisi > 0)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_turkish_ci;

CREATE TABLE Sefer (
    sefer_id INT AUTO_INCREMENT PRIMARY KEY,
    tren_id INT NOT NULL,
    kalkis_istasyon_id INT NOT NULL,
    varis_istasyon_id INT NOT NULL,
    kalkis_zamani DATETIME NOT NULL,
    varis_zamani DATETIME NOT NULL,
    durum ENUM('planli', 'satisa_acik', 'iptal', 'tamamlandi') DEFAULT 'planli',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (tren_id) REFERENCES Tren(tren_id) ON DELETE CASCADE,
    FOREIGN KEY (kalkis_istasyon_id) REFERENCES Istasyon(istasyon_id) ON DELETE RESTRICT,
    FOREIGN KEY (varis_istasyon_id) REFERENCES Istasyon(istasyon_id) ON DELETE RESTRICT,
    CHECK (kalkis_zamani < varis_zamani),
    CHECK (kalkis_istasyon_id != varis_istasyon_id),
    INDEX idx_kalkis_zamani (kalkis_zamani),
    INDEX idx_durum (durum)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_turkish_ci;

CREATE TABLE Kullanici (
    kullanici_id INT AUTO_INCREMENT PRIMARY KEY,
    kullanici_adi VARCHAR(50) NOT NULL UNIQUE,
    eposta VARCHAR(150) NOT NULL UNIQUE,
    sifre_hash VARCHAR(255) NOT NULL,
    ad_soyad VARCHAR(150) NOT NULL,
    telefon VARCHAR(20),
    rol ENUM('admin', 'kullanici') DEFAULT 'kullanici',
    aktif BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP NULL,
    INDEX idx_kullanici_adi (kullanici_adi),
    INDEX idx_eposta (eposta),
    INDEX idx_rol (rol)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_turkish_ci;

CREATE TABLE Yolcu (
    yolcu_id INT AUTO_INCREMENT PRIMARY KEY,
    ad_soyad VARCHAR(150) NOT NULL,
    eposta VARCHAR(150) NOT NULL UNIQUE,
    telefon VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CHECK (ad_soyad REGEXP '^[A-Za-zÇĞİÖŞÜçğıöşü ]+$'),
    CHECK (telefon IS NULL OR telefon = '' OR telefon REGEXP '^[0-9 ]+$'),
    INDEX idx_eposta (eposta)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_turkish_ci;

CREATE TABLE Rezervasyon (
    rezervasyon_id INT AUTO_INCREMENT PRIMARY KEY,
    pnr VARCHAR(10) NOT NULL UNIQUE,
    kullanici_id INT NOT NULL,
    olusturulma_zamani TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    toplam_tutar DECIMAL(10, 2) NOT NULL DEFAULT 0,
    durum ENUM('olusturuldu', 'odendi', 'iptal') DEFAULT 'olusturuldu',
    CHECK (toplam_tutar >= 0),
    FOREIGN KEY (kullanici_id) REFERENCES Kullanici(kullanici_id) ON DELETE CASCADE,
    INDEX idx_pnr (pnr),
    INDEX idx_durum (durum),
    INDEX idx_rez_kullanici (kullanici_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_turkish_ci;

CREATE TABLE Bilet (
    bilet_id INT AUTO_INCREMENT PRIMARY KEY,
    rezervasyon_id INT NOT NULL,
    sefer_id INT NOT NULL,
    yolcu_id INT NOT NULL,
    koltuk_no INT NOT NULL,
    fiyat DECIMAL(10, 2) NOT NULL,
    durum ENUM('rezerve', 'kesildi', 'iade') DEFAULT 'rezerve',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (rezervasyon_id) REFERENCES Rezervasyon(rezervasyon_id) ON DELETE CASCADE,
    FOREIGN KEY (sefer_id) REFERENCES Sefer(sefer_id) ON DELETE RESTRICT,
    FOREIGN KEY (yolcu_id) REFERENCES Yolcu(yolcu_id) ON DELETE RESTRICT,
   
    CHECK (fiyat > 0),
    CHECK (koltuk_no > 0),
    INDEX idx_rezervasyon (rezervasyon_id),
    INDEX idx_sefer (sefer_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_turkish_ci;

CREATE TABLE Odeme (
    odeme_id INT AUTO_INCREMENT PRIMARY KEY,
    rezervasyon_id INT NOT NULL UNIQUE,
    yontem ENUM('kart', 'nakit') NOT NULL,
    tutar DECIMAL(10, 2) NOT NULL,
    durum ENUM('basarili', 'basarisiz', 'iade') DEFAULT 'basarili',
    odeme_zamani TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (rezervasyon_id) REFERENCES Rezervasyon(rezervasyon_id) ON DELETE CASCADE,
    CHECK (tutar > 0),
    INDEX idx_durum (durum)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_turkish_ci;

DELIMITER //
CREATE TRIGGER check_koltuk_no_before_insert
BEFORE INSERT ON Bilet
FOR EACH ROW
BEGIN
    DECLARE max_koltuk INT;
    SELECT t.koltuk_sayisi INTO max_koltuk
    FROM Sefer s
    JOIN Tren t ON s.tren_id = t.tren_id
    WHERE s.sefer_id = NEW.sefer_id;
    
    IF NEW.koltuk_no > max_koltuk THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Koltuk numarası tren kapasitesini aşıyor!';
    END IF;
END//

CREATE TRIGGER check_koltuk_no_before_update
BEFORE UPDATE ON Bilet
FOR EACH ROW
BEGIN
    DECLARE max_koltuk INT;
    SELECT t.koltuk_sayisi INTO max_koltuk
    FROM Sefer s
    JOIN Tren t ON s.tren_id = t.tren_id
    WHERE s.sefer_id = NEW.sefer_id;
    
    IF NEW.koltuk_no > max_koltuk THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Koltuk numarası tren kapasitesini aşıyor!';
    END IF;
END//

CREATE TRIGGER update_rezervasyon_tutar_after_insert
AFTER INSERT ON Bilet
FOR EACH ROW
BEGIN
    UPDATE Rezervasyon
    SET toplam_tutar = (
        SELECT COALESCE(SUM(fiyat), 0)
        FROM Bilet
        WHERE rezervasyon_id = NEW.rezervasyon_id
    )
    WHERE rezervasyon_id = NEW.rezervasyon_id;
END//

CREATE TRIGGER update_rezervasyon_tutar_after_update
AFTER UPDATE ON Bilet
FOR EACH ROW
BEGIN
    UPDATE Rezervasyon
    SET toplam_tutar = (
        SELECT COALESCE(SUM(fiyat), 0)
        FROM Bilet
        WHERE rezervasyon_id = NEW.rezervasyon_id
    )
    WHERE rezervasyon_id = NEW.rezervasyon_id;
END//

CREATE TRIGGER update_rezervasyon_tutar_after_delete
AFTER DELETE ON Bilet
FOR EACH ROW
BEGIN
    UPDATE Rezervasyon
    SET toplam_tutar = (
        SELECT COALESCE(SUM(fiyat), 0)
        FROM Bilet
        WHERE rezervasyon_id = OLD.rezervasyon_id
    )
    WHERE rezervasyon_id = OLD.rezervasyon_id;
END//

DELIMITER ;

CREATE VIEW vw_sefer_detay AS
SELECT 
    s.sefer_id,
    s.kalkis_zamani,
    s.varis_zamani,
    s.durum,
    ik.ad AS kalkis_istasyon,
    ik.sehir AS kalkis_sehir,
    iv.ad AS varis_istasyon,
    iv.sehir AS varis_sehir,
    t.kod AS tren_kodu,
    t.koltuk_sayisi,
    COUNT(b.bilet_id) AS dolu_koltuk_sayisi,
    (t.koltuk_sayisi - COUNT(b.bilet_id)) AS bos_koltuk_sayisi
FROM Sefer s
JOIN Istasyon ik ON s.kalkis_istasyon_id = ik.istasyon_id
JOIN Istasyon iv ON s.varis_istasyon_id = iv.istasyon_id
JOIN Tren t ON s.tren_id = t.tren_id
LEFT JOIN Bilet b ON s.sefer_id = b.sefer_id AND b.durum != 'iade'
GROUP BY s.sefer_id, s.kalkis_zamani, s.varis_zamani, s.durum,
         ik.ad, ik.sehir, iv.ad, iv.sehir, t.kod, t.koltuk_sayisi;

CREATE VIEW vw_rezervasyon_ozet AS
SELECT 
    r.rezervasyon_id,
    r.kullanici_id,
    r.pnr,
    r.olusturulma_zamani,
    r.toplam_tutar,
    r.durum AS rezervasyon_durum,
    COUNT(b.bilet_id) AS bilet_sayisi,
    o.durum AS odeme_durum,
    o.yontem AS odeme_yontem
FROM Rezervasyon r
LEFT JOIN Bilet b ON r.rezervasyon_id = b.rezervasyon_id
LEFT JOIN Odeme o ON r.rezervasyon_id = o.rezervasyon_id
GROUP BY r.rezervasyon_id;
