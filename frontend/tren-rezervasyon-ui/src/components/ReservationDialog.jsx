import React, { useEffect, useMemo, useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Grid,
  Typography,
  TextField,
  Chip,
  Alert,
  CircularProgress
} from '@mui/material';
import TrainIcon from '@mui/icons-material/Train';
import AirlineSeatReclineNormalIcon from '@mui/icons-material/AirlineSeatReclineNormal';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import {
  getKoltuklar,
  createRezervasyon,
  createOdeme
} from '../services/api';

const pricePerSeat = 250; 
const sanitizePhone = (value) => value.replace(/[^\d\s]/g, '');
const sanitizeName = (value) => value.replace(/[^A-Za-zÇĞİÖŞÜçğıöşü\s]/g, '');

export default function ReservationDialog({ open, onClose, sefer, onSuccess }) {
  const [koltuklar, setKoltuklar] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [passengers, setPassengers] = useState([]);
  const [result, setResult] = useState(null);

  const capacity = useMemo(() => {
    return koltuklar?.length || sefer?.koltuk_sayisi || 0;
  }, [koltuklar, sefer]);

  useEffect(() => {
    let isMounted = true;
    const load = async () => {
      if (!open || !sefer) return;
      setLoading(true);
      setError('');
      setSelectedSeats([]);
      setPassengers([]);
      setResult(null);
      try {
        const { data } = await getKoltuklar(sefer.sefer_id);
        if (!isMounted) return;
        setKoltuklar(data.koltuklar || []);
      } catch (err) {
        if (isMounted) setError('Koltuklar yüklenirken hata oluştu: ' + err.message);
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    load();
    return () => {
      isMounted = false;
    };
  }, [open, sefer]);

  useEffect(() => {
    setPassengers((prev) => {
      const copy = [...prev];
      if (selectedSeats.length > copy.length) {
        while (copy.length < selectedSeats.length) {
          copy.push({ ad_soyad: '', eposta: '', telefon: '' });
        }
      } else if (selectedSeats.length < copy.length) {
        copy.length = selectedSeats.length;
      }
      return copy;
    });
  }, [selectedSeats.length]);

  const toggleSeat = (no, durum) => {
    if (durum === 'dolu') return; 
    setSelectedSeats((prev) =>
      prev.includes(no) ? prev.filter((x) => x !== no) : [...prev, no]
    );
  };

  const handlePassengerChange = (index, field, value) => {
    let nextValue = value;
    if (field === 'telefon') {
      nextValue = sanitizePhone(value);
    } else if (field === 'ad_soyad') {
      nextValue = sanitizeName(value);
    }
    setPassengers((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: nextValue };
      return copy;
    });
  };

  const totalPrice = useMemo(() => selectedSeats.length * pricePerSeat, [selectedSeats.length]);

  const handleSubmit = async () => {
    try {
      setSubmitting(true);
      setError('');

      if (selectedSeats.length === 0) {
        setError('Lütfen en az bir koltuk seçin.');
        setSubmitting(false);
        return;
      }
      for (let i = 0; i < passengers.length; i++) {
        const p = passengers[i];
        if (!p.ad_soyad || !p.eposta) {
          setError('Lütfen yolcu bilgilerinde ad soyad ve e-posta girin.');
          setSubmitting(false);
          return;
        }
        if (p.telefon && !/^[0-9 ]+$/.test(p.telefon)) {
          setError('Telefon numarası sadece rakam ve boşluk içerebilir.');
          setSubmitting(false);
          return;
        }
      }

      const sanitizedPassengers = passengers.map((p) => ({
        ad_soyad: sanitizeName(p.ad_soyad.trim()),
        eposta: p.eposta.trim(),
        telefon: sanitizePhone(p.telefon.trim())
      }));
      const biletler = selectedSeats.map((seatNo, idx) => ({
        sefer_id: sefer.sefer_id,
        yolcu_index: idx,
        koltuk_no: seatNo,
        fiyat: pricePerSeat
      }));
      const payload = {
        yolcular: sanitizedPassengers,
        biletler
      };

      const res = await createRezervasyon(payload);
      const rez = res?.data?.data;

      const odemeRes = await createOdeme({
        rezervasyon_id: rez.rezervasyon_id,
        yontem: 'kart',
        tutar: rez.toplam_tutar
      });

      const payloadResult = {
        pnr: rez.pnr,
        toplam_tutar: rez.toplam_tutar,
        odeme_durumu: odemeRes?.data?.data?.durum || 'basarili'
      };
      setResult(payloadResult);
      onSuccess?.(payloadResult);
    } catch (err) {
      const conflicts = err?.response?.data?.conflicts;
      if (conflicts?.length) {
        setError('Seçili koltuklardan bazıları dolu: ' + conflicts.map((c) => c.koltuk_no).join(', '));
      } else {
        setError('İşlem sırasında hata oluştu: ' + (err?.response?.data?.error || err.message));
      }
    } finally {
      setSubmitting(false);
    }
  };

  const SeatItem = ({ item }) => {
    const selected = selectedSeats.includes(item.koltuk_no);
    const isBusy = item.durum === 'dolu';
    return (
      <Chip
        icon={<AirlineSeatReclineNormalIcon />}
        label={item.koltuk_no}
        color={selected ? 'primary' : isBusy ? 'error' : 'default'}
        variant={selected ? 'filled' : 'outlined'}
        onClick={() => toggleSeat(item.koltuk_no, item.durum)}
        sx={{ m: 0.5, cursor: isBusy ? 'not-allowed' : 'pointer' }}
      />
    );
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>
        <Box display="flex" gap={1} alignItems="center">
          <TrainIcon />
          {sefer ? `${sefer.kalkis_istasyon} → ${sefer.varis_istasyon}` : 'Rezervasyon'}
        </Box>
      </DialogTitle>
      <DialogContent dividers>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
            {error}
          </Alert>
        )}

        {result ? (
          <Box>
            <Alert severity="success" sx={{ mb: 2 }}>
              Rezervasyon ve ödeme başarılı.
            </Alert>
            <Typography variant="h6">PNR: <strong>{result.pnr}</strong></Typography>
            <Typography>Toplam Tutar: <strong>{Number(result.toplam_tutar).toFixed(2)} ₺</strong></Typography>
            <Typography>Ödeme Durumu: <strong>{result.odeme_durumu}</strong></Typography>
          </Box>
        ) : (
          <>
            <Typography variant="subtitle1" gutterBottom>
              Koltuk Seçimi
            </Typography>
            {loading ? (
              <Box display="flex" justifyContent="center" my={2}>
                <CircularProgress />
              </Box>
            ) : (
              <Box>
                <Grid container>
                  {koltuklar.map((k) => (
                    <Grid item key={k.koltuk_no} xs={3} sm={2} md={1.5} lg={1}>
                      <SeatItem item={k} />
                    </Grid>
                  ))}
                </Grid>
                <Typography variant="body2" sx={{ mt: 1, color: 'text.secondary' }}>
                  Kapasite: {capacity} · Seçilen: {selectedSeats.length}
                </Typography>
              </Box>
            )}

            {selectedSeats.length > 0 && (
              <Box sx={{ mt: 3 }}>
                <Typography variant="subtitle1" gutterBottom>
                  Yolcu Bilgileri
                </Typography>
                <Grid container spacing={2}>
                  {passengers.map((p, idx) => (
                    <React.Fragment key={idx}>
                      <Grid item xs={12} md={4}>
                        <TextField
                          fullWidth
                          label={`Yolcu ${idx + 1} Ad Soyad`}
                          value={p.ad_soyad}
                          onChange={(e) => handlePassengerChange(idx, 'ad_soyad', e.target.value)}
                          required
                        />
                      </Grid>
                      <Grid item xs={12} md={4}>
                        <TextField
                          fullWidth
                          type="email"
                          label="E-posta"
                          value={p.eposta}
                          onChange={(e) => handlePassengerChange(idx, 'eposta', e.target.value)}
                          required
                        />
                      </Grid>
                      <Grid item xs={12} md={4}>
                        <TextField
                          fullWidth
                          label="Telefon"
                          value={p.telefon}
                          onChange={(e) => handlePassengerChange(idx, 'telefon', e.target.value)}
                        />
                      </Grid>
                    </React.Fragment>
                  ))}
                </Grid>
                <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ mt: 2 }}>
                  <Typography>
                    Seçili Koltuklar: {selectedSeats.sort((a,b)=>a-b).join(', ')}
                  </Typography>
                  <Typography variant="h6">Toplam: {totalPrice} ₺</Typography>
                </Box>
              </Box>
            )}
          </>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} startIcon={<CloseIcon />}>Kapat</Button>
        {!result && (
          <Button
            onClick={handleSubmit}
            variant="contained"
            startIcon={<CheckIcon />}
            disabled={submitting || selectedSeats.length === 0}
          >
            {submitting ? 'Gönderiliyor…' : 'Rezervasyon + Ödeme'}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
}
