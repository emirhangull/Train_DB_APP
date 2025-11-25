import React, { useEffect, useMemo, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography
} from '@mui/material';
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';
import AirlineSeatReclineNormalIcon from '@mui/icons-material/AirlineSeatReclineNormal';
import EventSeatIcon from '@mui/icons-material/EventSeat';
import { getRezervasyonlar, getRezervasyonByPNR } from '../services/api';

const durumChipRengi = (durum) => {
  switch (durum) {
    case 'odendi':
      return 'success';
    case 'olusturuldu':
      return 'warning';
    case 'iptal':
      return 'error';
    default:
      return 'default';
  }
};

export default function Rezervasyonlar() {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [detailLoading, setDetailLoading] = useState(false);
  const [detailError, setDetailError] = useState('');
  const [detailData, setDetailData] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    const loadReservations = async () => {
      try {
        const response = await getRezervasyonlar();
        setReservations(response.data.data || []);
      } catch (err) {
        setError('Rezervasyonlar yüklenirken hata oluştu: ' + (err.response?.data?.error || err.message));
      } finally {
        setLoading(false);
      }
    };

    loadReservations();
  }, []);

  const toplamBilet = useMemo(() => reservations.reduce((acc, item) => acc + (item.bilet_sayisi || 0), 0), [
    reservations
  ]);

  const handleOpenDetail = async (pnr) => {
    setDetailError('');
    setDetailLoading(true);

    try {
      const response = await getRezervasyonByPNR(pnr);
      setDetailData(response.data.data);
      setDialogOpen(true);
    } catch (err) {
      setDetailError('Rezervasyon detayları alınamadı: ' + (err.response?.data?.error || err.message));
    } finally {
      setDetailLoading(false);
    }
  };

  const closeDialog = () => {
    setDialogOpen(false);
    setDetailData(null);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '40vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: '1200px', margin: '0 auto', py: 2 }}>
      <Typography variant="h4" sx={{ fontWeight: 600, mb: 2 }}>
        Rezervasyonlarım
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        Daha önce oluşturduğunuz tüm rezervasyonları bu ekrandan görüntüleyebilirsiniz. Her satırda PNR, toplam tutar,
        bilet sayısı ve ödeme durumu özetlenir; detay butonu ile koltuk bazında bilgilere ulaşabilirsiniz.
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={12} md={4}>
            <Paper elevation={2} sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
              <ConfirmationNumberIcon color="primary" />
              <Box>
                <Typography variant="subtitle2" color="text.secondary">
                  Toplam Rezervasyon
                </Typography>
                <Typography variant="h5">{reservations.length}</Typography>
              </Box>
            </Paper>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper elevation={2} sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
              <AirlineSeatReclineNormalIcon color="success" />
              <Box>
                <Typography variant="subtitle2" color="text.secondary">
                  Toplam Koltuk
                </Typography>
                <Typography variant="h5">{toplamBilet}</Typography>
              </Box>
            </Paper>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper elevation={2} sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
              <EventSeatIcon color="warning" />
              <Box>
                <Typography variant="subtitle2" color="text.secondary">
                  Ödeme Bekleyen
                </Typography>
                <Typography variant="h5">
                  {reservations.filter((item) => item.rezervasyon_durum === 'olusturuldu').length}
                </Typography>
              </Box>
            </Paper>
          </Grid>
      </Grid>

      {reservations.length === 0 ? (
        <Paper elevation={2} sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h6" gutterBottom>
            Henüz rezervasyon kaydınız bulunmuyor
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Sefer arayıp koltuk seçerek yeni rezervasyon oluşturabilirsiniz.
          </Typography>
        </Paper>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>PNR</TableCell>
                <TableCell>Oluşturulma</TableCell>
                <TableCell>Durum</TableCell>
                <TableCell>Bilet Sayısı</TableCell>
                <TableCell>Toplam Tutar</TableCell>
                <TableCell>Ödeme</TableCell>
                <TableCell align="right">Detay</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {reservations.map((rez) => (
                <TableRow key={rez.rezervasyon_id}>
                  <TableCell sx={{ fontWeight: 600 }}>{rez.pnr}</TableCell>
                  <TableCell>{rez.olusturulma_zamani}</TableCell>
                  <TableCell>
                    <Chip label={rez.rezervasyon_durum} color={durumChipRengi(rez.rezervasyon_durum)} size="small" />
                  </TableCell>
                  <TableCell>{rez.bilet_sayisi}</TableCell>
                  <TableCell>{Number(rez.toplam_tutar).toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' })}</TableCell>
                  <TableCell>
                    {rez.odeme_durum ? (
                      <Chip
                        label={rez.odeme_durum}
                        color={rez.odeme_durum === 'basarili' ? 'success' : rez.odeme_durum === 'basarisiz' ? 'error' : 'warning'}
                        size="small"
                      />
                    ) : (
                      <Typography variant="body2" color="text.secondary">
                        - 
                      </Typography>
                    )}
                  </TableCell>
                  <TableCell align="right">
                    <Button variant="outlined" size="small" onClick={() => handleOpenDetail(rez.pnr)}>
                      İncele
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <Dialog open={dialogOpen} onClose={closeDialog} fullWidth maxWidth="md">
        <DialogTitle>Rezervasyon Detayları</DialogTitle>
        <DialogContent dividers>
          {detailLoading && (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 3 }}>
              <CircularProgress />
            </Box>
          )}
          {detailError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {detailError}
            </Alert>
          )}
          {detailData && (
            <>
              <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                PNR: {detailData.rezervasyon.pnr}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Oluşturulma: {detailData.rezervasyon.olusturulma_zamani} · Durum: {detailData.rezervasyon.durum}
              </Typography>
              <Divider sx={{ mb: 2 }} />
              {detailData.biletler.map((bilet) => (
                <Paper key={bilet.bilet_id} sx={{ p: 2, mb: 2 }} elevation={1}>
                  <Grid container spacing={1}>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="subtitle2">
                        {bilet.kalkis_istasyon} → {bilet.varis_istasyon}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Tren: {bilet.tren_kodu} · Koltuk: {bilet.koltuk_no}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="body2">
                        Kalkış: {bilet.kalkis_zamani}
                      </Typography>
                      <Typography variant="body2">
                        Varış: {bilet.varis_zamani}
                      </Typography>
                    </Grid>
                    <Grid item xs={12}>
                      <Typography variant="body2" color="text.secondary">
                        Yolcu: {bilet.ad_soyad} ({bilet.eposta})
                      </Typography>
                    </Grid>
                  </Grid>
                </Paper>
              ))}
            </>
          )}
        </DialogContent>
      </Dialog>
    </Box>
  );
}
