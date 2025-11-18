/**
 * API Service - Backend ile iletişim
 */
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5002';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Session için cookie gönderilmesi gerekiyor
});

// Hata yönetimi için interceptor ekle
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Sunucu yanıt verdi ama hata durumu var
      console.error('API Hatası:', error.response.data);
    } else if (error.request) {
      // İstek yapıldı ama yanıt alınamadı
      console.error('Bağlantı Hatası: Backend\'e ulaşılamıyor. Backend çalışıyor mu?');
    } else {
      // İstek hazırlanırken bir hata oluştu
      console.error('Hata:', error.message);
    }
    return Promise.reject(error);
  }
);

// İstasyonlar
export const getIstasyonlar = () => api.get('/api/istasyonlar');

// Seferler
export const getSeferler = () => api.get('/api/seferler');
export const araSefer = (kalkisSehir, varisSehir, tarih) => 
  api.get('/api/seferler/ara', {
    params: { kalkis_sehir: kalkisSehir, varis_sehir: varisSehir, tarih }
  });
export const getKoltuklar = (seferId) => api.get(`/api/seferler/${seferId}/koltuklar`);

// Rezervasyonlar
export const getRezervasyonlar = () => api.get('/api/rezervasyonlar');
export const getRezervasyonByPNR = (pnr) => api.get(`/api/rezervasyonlar/${pnr}`);
export const createRezervasyon = (data) => api.post('/api/rezervasyonlar', data);
export const iptalRezervasyon = (rezervasyonId) => 
  api.post(`/api/rezervasyonlar/${rezervasyonId}/iptal`);

// Ödeme
export const createOdeme = (data) => api.post('/api/odemeler', data);

// Raporlar
export const getSeferDoluluk = () => api.get('/api/raporlar/sefer-doluluk');
export const getGelirOzeti = (baslangicTarih, bitisTarih) => 
  api.get('/api/raporlar/gelir-ozeti', {
    params: { baslangic_tarih: baslangicTarih, bitis_tarih: bitisTarih }
  });
export const getBiletIstatistik = () => api.get('/api/raporlar/bilet-istatistik');

// Yönetici - İstasyon
export const createIstasyon = (data) => api.post('/api/istasyonlar', data);
export const updateIstasyon = (id, data) => api.put(`/api/istasyonlar/${id}`, data);
export const deleteIstasyon = (id) => api.delete(`/api/istasyonlar/${id}`);

// Yönetici - Tren
export const getTrenler = () => api.get('/api/trenler');
export const createTren = (data) => api.post('/api/trenler', data);
export const updateTren = (id, data) => api.put(`/api/trenler/${id}`, data);
export const deleteTren = (id) => api.delete(`/api/trenler/${id}`);

// Yönetici - Sefer
export const createSefer = (data) => api.post('/api/seferler', data);
export const deleteSefer = (id) => api.delete(`/api/seferler/${id}`);

// Authentication
export const register = (data) => api.post('/api/auth/register', data);
export const login = (data) => api.post('/api/auth/login', data);
export const logout = () => api.post('/api/auth/logout');
export const getCurrentUser = () => api.get('/api/auth/me');

export default api;
