/**
 * Login Page
 * Kullanıcı giriş sayfası
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

export default function Login() {
  const [kullaniciAdi, setKullaniciAdi] = useState('');
  const [sifre, setSifre] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!kullaniciAdi || !sifre) {
      setError('Lütfen tüm alanları doldurun');
      return;
    }

    setLoading(true);
    const result = await login(kullaniciAdi, sifre);
    setLoading(false);

    if (result.success) {
      // Başarılı giriş, ana sayfaya yönlendir
      navigate('/');
    } else {
      setError(result.error || 'Giriş yapılırken bir hata oluştu');
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
            Giriş Yap
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
              value={kullaniciAdi}
              onChange={(e) => setKullaniciAdi(e.target.value)}
              disabled={loading}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="sifre"
              label="Şifre"
              type="password"
              id="sifre"
              autoComplete="current-password"
              value={sifre}
              onChange={(e) => setSifre(e.target.value)}
              disabled={loading}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : 'Giriş Yap'}
            </Button>

            <Box sx={{ textAlign: 'center', mt: 2 }}>
              <Typography variant="body2">
                Hesabınız yok mu?{' '}
                <Link
                  component="button"
                  variant="body2"
                  onClick={() => navigate('/register')}
                  sx={{ cursor: 'pointer' }}
                >
                  Kayıt Ol
                </Link>
              </Typography>
            </Box>

            <Box sx={{ mt: 3, p: 2, bgcolor: 'grey.100', borderRadius: 1 }}>
              <Typography variant="caption" display="block" gutterBottom>
                <strong>Test Kullanıcıları:</strong>
              </Typography>
              <Typography variant="caption" display="block">
                • Admin: admin / 123456
              </Typography>
              <Typography variant="caption" display="block">
                • Kullanıcı: ahmet123 / 123456
              </Typography>
              <Typography variant="caption" display="block">
                • Kullanıcı: ayse456 / 123456
              </Typography>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
}
