/**
 * Register Page
 * Kullanıcı kayıt sayfası
 */
import React, { useState } from 'react';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  CircularProgress,
  Link
} from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Register() {
  const [formData, setFormData] = useState({
    kullanici_adi: '',
    eposta: '',
    sifre: '',
    sifre_tekrar: '',
    ad_soyad: '',
    telefon: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!formData.kullanici_adi || !formData.eposta || !formData.sifre || !formData.ad_soyad) {
      setError('Lütfen zorunlu alanları doldurun');
      return;
    }

    if (formData.sifre !== formData.sifre_tekrar) {
      setError('Şifreler eşleşmiyor');
      return;
    }

    if (formData.sifre.length < 6) {
      setError('Şifre en az 6 karakter olmalıdır');
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.eposta)) {
      setError('Geçerli bir e-posta adresi girin');
      return;
    }

    setLoading(true);
    const result = await register({
      kullanici_adi: formData.kullanici_adi,
      eposta: formData.eposta,
      sifre: formData.sifre,
      ad_soyad: formData.ad_soyad,
      telefon: formData.telefon
    });
    setLoading(false);

    if (result.success) {
      // Başarılı kayıt ve otomatik giriş, ana sayfaya yönlendir
      navigate('/');
    } else {
      setError(result.error || 'Kayıt olurken bir hata oluştu');
    }
  };

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Paper elevation={3} sx={{ padding: 4, width: '100%' }}>
          <Typography component="h1" variant="h4" align="center" gutterBottom>
            Tren Rezervasyon Sistemi
          </Typography>
          <Typography component="h2" variant="h6" align="center" color="text.secondary" gutterBottom>
            Kayıt Ol
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mt: 2, mb: 2 }}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="kullanici_adi"
              label="Kullanıcı Adı"
              name="kullanici_adi"
              autoComplete="username"
              autoFocus
              value={formData.kullanici_adi}
              onChange={handleChange}
              disabled={loading}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              id="eposta"
              label="E-posta"
              name="eposta"
              autoComplete="email"
              type="email"
              value={formData.eposta}
              onChange={handleChange}
              disabled={loading}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              id="ad_soyad"
              label="Ad Soyad"
              name="ad_soyad"
              autoComplete="name"
              value={formData.ad_soyad}
              onChange={handleChange}
              disabled={loading}
            />
            <TextField
              margin="normal"
              fullWidth
              id="telefon"
              label="Telefon (Opsiyonel)"
              name="telefon"
              autoComplete="tel"
              value={formData.telefon}
              onChange={handleChange}
              disabled={loading}
              placeholder="05XX XXX XX XX"
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="sifre"
              label="Şifre"
              type="password"
              id="sifre"
              autoComplete="new-password"
              value={formData.sifre}
              onChange={handleChange}
              disabled={loading}
              helperText="En az 6 karakter"
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="sifre_tekrar"
              label="Şifre Tekrar"
              type="password"
              id="sifre_tekrar"
              autoComplete="new-password"
              value={formData.sifre_tekrar}
              onChange={handleChange}
              disabled={loading}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : 'Kayıt Ol'}
            </Button>

            <Box sx={{ textAlign: 'center', mt: 2 }}>
              <Typography variant="body2">
                Zaten hesabınız var mı?{' '}
                <Link
                  component="button"
                  variant="body2"
                  onClick={() => navigate('/login')}
                  sx={{ cursor: 'pointer' }}
                >
                  Giriş Yap
                </Link>
              </Typography>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
}
