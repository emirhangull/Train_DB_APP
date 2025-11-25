import React, { useEffect, useState } from 'react';
import {
  Alert,
  Box,
  Card,
  CardContent,
  CircularProgress,
  Grid,
  Typography
} from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';
import { useAuth } from '../contexts/AuthContext';
import { getRezervasyonlar } from '../services/api';

export default function Profil() {
  const { user } = useAuth();
  const [rezervasyonSayisi, setRezervasyonSayisi] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchReservationCount = async () => {
      try {
        const response = await getRezervasyonlar();
        const count = response.data?.count ?? (response.data?.data?.length ?? 0);
        setRezervasyonSayisi(count);
      } catch (err) {
        setError('Rezervasyon bilgileri alınamadı: ' + (err.response?.data?.error || err.message));
      } finally {
        setLoading(false);
      }
    };

    fetchReservationCount();
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '40vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 900, margin: '0 auto', py: 2 }}>
      <Typography variant="h4" sx={{ fontWeight: 600, mb: 3 }}>
        Profil
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card elevation={2}>
            <CardContent sx={{ display: 'flex', gap: 2 }}>
              <AccountCircleIcon sx={{ fontSize: 48, color: 'primary.main' }} />
              <Box>
                <Typography variant="overline" color="text.secondary">
                  Kullanıcı Bilgileri
                </Typography>
                <Typography variant="h6">{user?.ad_soyad}</Typography>
                <Typography variant="body2" color="text.secondary">
                  Kullanıcı Adı: {user?.kullanici_adi}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  E-posta: {user?.eposta}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card elevation={2}>
            <CardContent sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
              <ConfirmationNumberIcon sx={{ fontSize: 48, color: 'secondary.main' }} />
              <Box>
                <Typography variant="overline" color="text.secondary">
                  Rezervasyon Sayısı
                </Typography>
                <Typography variant="h4">{rezervasyonSayisi}</Typography>
                <Typography variant="body2" color="text.secondary">
                  Şu ana kadar oluşturulan toplam rezervasyon
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
