import React, { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  Grid,
  TextField,
  MenuItem,
  Button,
  Alert,
  Divider,
  Stack
} from '@mui/material';
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import TrainIcon from '@mui/icons-material/Train';
import PNRLookup from '../components/PNRLookup';
import { useAuth } from '../contexts/AuthContext';
import { getIstasyonlar, getTrenler, createSefer, createTren } from '../services/api';

const initialFormState = {
  tren_id: '',
  kalkis_istasyon_id: '',
  varis_istasyon_id: '',
  kalkis_zamani: '',
  varis_zamani: ''
};

const initialTrainState = {
  kod: '',
  koltuk_sayisi: ''
};

const formatDateTimeForBackend = (value) => {
  if (!value) return '';
  const [date, time] = value.split('T');
  if (!date || !time) return value;
  const normalizedTime = time.length === 5 ? `${time}:00` : time;
  return `${date} ${normalizedTime}`;
};

export default function Seferler() {
  const { isAdmin } = useAuth();
  const [formData, setFormData] = useState(initialFormState);
  const [istasyonlar, setIstasyonlar] = useState([]);
  const [trenler, setTrenler] = useState([]);
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');
  const [loadingSecData, setLoadingSecData] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [trainFormData, setTrainFormData] = useState(initialTrainState);
  const [trainError, setTrainError] = useState('');
  const [trainSuccess, setTrainSuccess] = useState('');
  const [trainSubmitting, setTrainSubmitting] = useState(false);

  useEffect(() => {
    if (isAdmin) {
      fetchFormData();
    }
  }, [isAdmin]);

  const fetchFormData = async () => {
    try {
      setFormError('');
      setLoadingSecData(true);
      const [istasyonRes, trenRes] = await Promise.all([getIstasyonlar(), getTrenler()]);
      setIstasyonlar(istasyonRes.data.data || []);
      setTrenler(trenRes.data.data || []);
    } catch (error) {
      const message = error.response?.data?.error || 'Sefer oluşturma formu verileri alınamadı';
      setFormError(message);
    } finally {
      setLoadingSecData(false);
    }
  };

  const refreshTrenler = async () => {
    try {
      const trenRes = await getTrenler();
      setTrenler(trenRes.data.data || []);
    } catch (error) {
      const message = error.response?.data?.error || 'Tren listesi güncellenemedi.';
      setTrainError(message);
    }
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setFormError('');
    setFormSuccess('');

    if (!formData.tren_id || !formData.kalkis_istasyon_id || !formData.varis_istasyon_id) {
      setFormError('Tren ve istasyon seçimleri zorunludur.');
      return;
    }

    if (formData.kalkis_istasyon_id === formData.varis_istasyon_id) {
      setFormError('Kalkış ve varış istasyonu farklı olmalıdır.');
      return;
    }

    if (!formData.kalkis_zamani || !formData.varis_zamani) {
      setFormError('Kalkış ve varış zamanları zorunludur.');
      return;
    }

    const kalkisDate = new Date(formData.kalkis_zamani);
    const varisDate = new Date(formData.varis_zamani);

    if (Number.isNaN(kalkisDate.getTime()) || Number.isNaN(varisDate.getTime())) {
      setFormError('Tarih formatı geçersiz.');
      return;
    }

    if (varisDate <= kalkisDate) {
      setFormError('Varış zamanı kalkıştan sonra olmalıdır.');
      return;
    }

    const payload = {
      tren_id: parseInt(formData.tren_id, 10),
      kalkis_istasyon_id: parseInt(formData.kalkis_istasyon_id, 10),
      varis_istasyon_id: parseInt(formData.varis_istasyon_id, 10),
      kalkis_zamani: formatDateTimeForBackend(formData.kalkis_zamani),
      varis_zamani: formatDateTimeForBackend(formData.varis_zamani),
      durum: 'satisa_acik'
    };

    try {
      setSubmitting(true);
      await createSefer(payload);
      setFormSuccess('Sefer başarıyla oluşturuldu. Tüm kullanıcılar bu seferi artık görebilir.');
      setFormData(initialFormState);
    } catch (error) {
      const message = error.response?.data?.error || 'Sefer oluşturulurken bir hata oluştu.';
      setFormError(message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleTrainInputChange = (event) => {
    const { name, value } = event.target;
    setTrainFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleTrainSubmit = async (event) => {
    event.preventDefault();
    setTrainError('');
    setTrainSuccess('');

    if (!trainFormData.kod.trim()) {
      setTrainError('Tren kodu zorunludur.');
      return;
    }

    const koltukValue = parseInt(trainFormData.koltuk_sayisi, 10);
    if (Number.isNaN(koltukValue) || koltukValue <= 0) {
      setTrainError('Koltuk sayısı pozitif bir sayı olmalıdır.');
      return;
    }

    try {
      setTrainSubmitting(true);
      await createTren({
        kod: trainFormData.kod.trim(),
        koltuk_sayisi: koltukValue
      });
      setTrainSuccess('Tren başarıyla eklendi. Yeni sefer oluştururken kullanılabilir.');
      setTrainFormData(initialTrainState);
      // Tren listesini yenile ki form hemen yeni treni görebilsin
      await refreshTrenler();
    } catch (error) {
      const message = error.response?.data?.error || 'Tren oluşturulurken bir hata oluştu.';
      setTrainError(message);
    } finally {
      setTrainSubmitting(false);
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Box display="flex" alignItems="center" gap={1} sx={{ mb: 2 }}>
        <ConfirmationNumberIcon color="primary" />
        <Typography variant="h4" component="h1">
          PNR ile Bilet Sorgula
        </Typography>
      </Box>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        Rezervasyonunuzun PNR kodunu girerek bilet durumunu ve yolcu bilgilerini görüntüleyebilirsiniz.
      </Typography>
      <PNRLookup />

      {isAdmin && (
        <Box sx={{ mt: 6 }}>
          <Divider sx={{ mb: 3 }} />
          <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
            <AddCircleOutlineIcon color="primary" />
            <Typography variant="h5">Yeni Sefer Oluştur</Typography>
          </Stack>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Sadece yöneticiler yeni sefer ekleyebilir. Oluşturulan seferler tüm kullanıcılara açılır ve rezervasyon yapılabilir.
          </Typography>
          {formError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {formError}
            </Alert>
          )}
          {formSuccess && (
            <Alert severity="success" sx={{ mb: 2 }}>
              {formSuccess}
            </Alert>
          )}
          <Paper elevation={2}>
            <Box component="form" onSubmit={handleSubmit} sx={{ p: 3 }}>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <TextField
                    select
                    fullWidth
                    label="Tren"
                    name="tren_id"
                    value={formData.tren_id}
                    onChange={handleInputChange}
                    disabled={loadingSecData || submitting}
                    required
                  >
                    {trenler.map((tren) => (
                      <MenuItem key={tren.tren_id} value={tren.tren_id}>
                        {tren.kod} ({tren.koltuk_sayisi} koltuk)
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    select
                    fullWidth
                    label="Kalkış İstasyonu"
                    name="kalkis_istasyon_id"
                    value={formData.kalkis_istasyon_id}
                    onChange={handleInputChange}
                    disabled={loadingSecData || submitting}
                    required
                  >
                    {istasyonlar.map((istasyon) => (
                      <MenuItem key={istasyon.istasyon_id} value={istasyon.istasyon_id}>
                        {istasyon.ad} ({istasyon.sehir})
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    select
                    fullWidth
                    label="Varış İstasyonu"
                    name="varis_istasyon_id"
                    value={formData.varis_istasyon_id}
                    onChange={handleInputChange}
                    disabled={loadingSecData || submitting}
                    required
                  >
                    {istasyonlar.map((istasyon) => (
                      <MenuItem key={istasyon.istasyon_id} value={istasyon.istasyon_id}>
                        {istasyon.ad} ({istasyon.sehir})
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    type="datetime-local"
                    label="Kalkış Zamanı"
                    name="kalkis_zamani"
                    value={formData.kalkis_zamani}
                    onChange={handleInputChange}
                    InputLabelProps={{ shrink: true }}
                    disabled={submitting}
                    required
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    type="datetime-local"
                    label="Varış Zamanı"
                    name="varis_zamani"
                    value={formData.varis_zamani}
                    onChange={handleInputChange}
                    InputLabelProps={{ shrink: true }}
                    disabled={submitting}
                    required
                  />
                </Grid>
              </Grid>
              <Box display="flex" justifyContent="flex-end" sx={{ mt: 3 }}>
                <Button
                  type="submit"
                  variant="contained"
                  disabled={submitting || loadingSecData}
                >
                  {submitting ? 'Kaydediliyor...' : 'Sefer Oluştur'}
                </Button>
              </Box>
            </Box>
          </Paper>

          <Box sx={{ mt: 5 }}>
            <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
              <TrainIcon color="primary" />
              <Typography variant="h5">Yeni Tren Oluştur</Typography>
            </Stack>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Sisteme ekleyeceğiniz trenler hemen sefer oluşturma formunda listelenir ve tüm kullanıcılara açılır.
            </Typography>
            {trainError && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {trainError}
              </Alert>
            )}
            {trainSuccess && (
              <Alert severity="success" sx={{ mb: 2 }}>
                {trainSuccess}
              </Alert>
            )}
            <Paper elevation={2}>
              <Box component="form" onSubmit={handleTrainSubmit} sx={{ p: 3 }}>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Tren Kodu"
                      name="kod"
                      value={trainFormData.kod}
                      onChange={handleTrainInputChange}
                      disabled={trainSubmitting}
                      required
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      type="number"
                      label="Koltuk Sayısı"
                      name="koltuk_sayisi"
                      value={trainFormData.koltuk_sayisi}
                      onChange={handleTrainInputChange}
                      inputProps={{ min: 1 }}
                      disabled={trainSubmitting}
                      required
                    />
                  </Grid>
                </Grid>
                <Box display="flex" justifyContent="flex-end" sx={{ mt: 3 }}>
                  <Button type="submit" variant="outlined" disabled={trainSubmitting}>
                    {trainSubmitting ? 'Kaydediliyor...' : 'Tren Oluştur'}
                  </Button>
                </Box>
              </Box>
            </Paper>
          </Box>
        </Box>
      )}
    </Container>
  );
}
