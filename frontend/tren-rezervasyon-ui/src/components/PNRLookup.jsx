import React, { useState } from 'react';
import { Box, Button, Card, CardContent, Grid, TextField, Typography, Alert } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';
import { getRezervasyonByPNR } from '../services/api';

export default function PNRLookup() {
  const [pnr, setPnr] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [data, setData] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setData(null);
    if (!pnr) {
      setError('Lütfen PNR girin.');
      return;
    }
    setLoading(true);
    try {
      const res = await getRezervasyonByPNR(pnr);
      setData(res.data.data);
    } catch (err) {
      setError('Rezervasyon bulunamadı veya hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card sx={{ mb: 4 }}>
      <CardContent>
        <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <ConfirmationNumberIcon /> PNR ile Bilet Sorgula
        </Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={8}>
              <TextField
                fullWidth
                label="PNR"
                value={pnr}
                onChange={(e) => setPnr(e.target.value.toUpperCase())}
                inputProps={{ maxLength: 10 }}
                required
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <Button
                type="submit"
                variant="contained"
                fullWidth
                startIcon={<SearchIcon />}
                disabled={loading}
              >
                {loading ? 'Aranıyor…' : 'Sorgula'}
              </Button>
            </Grid>
          </Grid>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mt: 2 }} onClose={() => setError('')}>
            {error}
          </Alert>
        )}

        {data && (
          <Box sx={{ mt: 3 }}>
            <Typography variant="subtitle1">PNR: <strong>{data.rezervasyon.pnr}</strong></Typography>
            <Typography>Durum: <strong>{data.rezervasyon.durum}</strong></Typography>
            <Typography>Toplam Tutar: <strong>{Number(data.rezervasyon.toplam_tutar).toFixed(2)} ₺</strong></Typography>
            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle1">Biletler</Typography>
              {data.biletler.map((b) => (
                <Box key={b.bilet_id} sx={{ p: 1, borderBottom: '1px solid #eee' }}>
                  <Typography>
                    {b.kalkis_istasyon} → {b.varis_istasyon} | Tren: {b.tren_kodu} | Koltuk: {b.koltuk_no}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Yolcu: {b.ad_soyad} ({b.eposta}) | Fiyat: {Number(b.fiyat).toFixed(2)} ₺
                  </Typography>
                </Box>
              ))}
            </Box>
          </Box>
        )}
      </CardContent>
    </Card>
  );
}
