import React, { useEffect, useMemo, useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Grid,
  Button,
  TextField,
  MenuItem,
  Alert,
  CircularProgress,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from '@mui/material';
import TrainIcon from '@mui/icons-material/Train';
import SearchIcon from '@mui/icons-material/Search';
import { getIstasyonlar, araSefer, getSeferDoluluk } from './services/api';

const formatDateTime = (value) => {
  try {
    return new Date(value).toLocaleString('tr-TR');
  } catch (err) {
    return '-';
  }
};

function App() {
  const [istasyonlar, setIstasyonlar] = useState([]);
  const [seferler, setSeferler] = useState([]);
  const [dolulukRaporu, setDolulukRaporu] = useState([]);
  const [kalkisSehir, setKalkisSehir] = useState('');
  const [varisSehir, setVarisSehir] = useState('');
  const [tarih, setTarih] = useState(new Date().toISOString().split('T')[0]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    let isMounted = true;

    const loadInitialData = async () => {
      try {
        const [istasyonResponse, dolulukResponse] = await Promise.all([
          getIstasyonlar(),
          getSeferDoluluk()
        ]);

        if (!isMounted) return;

        setIstasyonlar(istasyonResponse.data.data || []);
        setDolulukRaporu(dolulukResponse.data.data || []);
      } catch (err) {
        if (isMounted) {
          setError('Başlangıç verileri yüklenirken hata oluştu: ' + err.message);
        }
      }
    };

    loadInitialData();

    return () => {
      isMounted = false;
    };
  }, []);

  const sehirler = useMemo(() => {
    return [...new Set(istasyonlar.map((item) => item.sehir))].sort();
  }, [istasyonlar]);

  const handleSearch = async (event) => {
    event.preventDefault();
    setError('');

    if (!kalkisSehir || !varisSehir || !tarih) {
      setError('Lütfen tüm alanları doldurun.');
      return;
    }

    setLoading(true);

    try {
      const response = await araSefer(kalkisSehir, varisSehir, tarih);
      const list = response.data.data || [];
      setSeferler(list);

      if (!response.data.count) {
        setError('Seçilen kriterlere uygun sefer bulunamadı.');
      }
    } catch (err) {
      setError('Sefer araması sırasında hata oluştu: ' + err.message);
      setSeferler([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ bgcolor: '#f5f5f5', minHeight: '100vh', py: 4 }}>
      <Container maxWidth="lg">
        <Paper elevation={3} sx={{ p: 3, mb: 4, bgcolor: '#1976d2', color: 'white' }}>
          <Box display="flex" alignItems="center" gap={2}>
            <TrainIcon sx={{ fontSize: 48 }} />
            <Box>
              <Typography variant="h3" component="h1" gutterBottom>
                Tren Rezervasyon Sistemi
              </Typography>
              <Typography variant="subtitle1">
                Bilgisayar Mühendisliği · Veritabanı Projesi
              </Typography>
            </Box>
          </Box>
        </Paper>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>
            {error}
          </Alert>
        )}

        <Card sx={{ mb: 4 }}>
          <CardContent>
            <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <SearchIcon /> Sefer Ara
            </Typography>
            <Box component="form" onSubmit={handleSearch} sx={{ mt: 2 }}>
              <Grid container spacing={2}>
                <Grid item xs={12} md={3}>
                  <TextField
                    select
                    fullWidth
                    label="Kalkış Şehri"
                    value={kalkisSehir}
                    onChange={(event) => setKalkisSehir(event.target.value)}
                    required
                  >
                    {sehirler.map((sehir) => (
                      <MenuItem key={sehir} value={sehir}>
                        {sehir}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>

                <Grid item xs={12} md={3}>
                  <TextField
                    select
                    fullWidth
                    label="Varış Şehri"
                    value={varisSehir}
                    onChange={(event) => setVarisSehir(event.target.value)}
                    required
                  >
                    {sehirler.map((sehir) => (
                      <MenuItem key={sehir} value={sehir}>
                        {sehir}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>

                <Grid item xs={12} md={3}>
                  <TextField
                    type="date"
                    fullWidth
                    label="Tarih"
                    value={tarih}
                    onChange={(event) => setTarih(event.target.value)}
                    InputLabelProps={{ shrink: true }}
                    required
                  />
                </Grid>

                <Grid item xs={12} md={3}>
                  <Button
                    type="submit"
                    variant="contained"
                    fullWidth
                    size="large"
                    disabled={loading}
                    startIcon={loading ? <CircularProgress size={20} /> : <SearchIcon />}
                  >
                    {loading ? 'Aranıyor…' : 'Sefer Ara'}
                  </Button>
                </Grid>
              </Grid>
            </Box>
          </CardContent>
        </Card>

        {seferler.length > 0 && (
          <Card sx={{ mb: 4 }}>
            <CardContent>
              <Typography variant="h5" gutterBottom>
                Bulunan Seferler ({seferler.length})
              </Typography>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell><strong>Tren</strong></TableCell>
                      <TableCell><strong>Kalkış</strong></TableCell>
                      <TableCell><strong>Varış</strong></TableCell>
                      <TableCell><strong>Kalkış Saati</strong></TableCell>
                      <TableCell><strong>Varış Saati</strong></TableCell>
                      <TableCell><strong>Boş Koltuk</strong></TableCell>
                      <TableCell><strong>İşlem</strong></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {seferler.map((sefer) => (
                      <TableRow key={sefer.sefer_id}>
                        <TableCell>{sefer.tren_kodu}</TableCell>
                        <TableCell>{sefer.kalkis_istasyon}</TableCell>
                        <TableCell>{sefer.varis_istasyon}</TableCell>
                        <TableCell>{formatDateTime(sefer.kalkis_zamani)}</TableCell>
                        <TableCell>{formatDateTime(sefer.varis_zamani)}</TableCell>
                        <TableCell>
                          <Box sx={{ color: sefer.bos_koltuk_sayisi > 0 ? 'green' : 'red', fontWeight: 'bold' }}>
                            {sefer.bos_koltuk_sayisi} / {sefer.koltuk_sayisi}
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="contained"
                            size="small"
                            disabled={sefer.bos_koltuk_sayisi === 0}
                          >
                            {sefer.bos_koltuk_sayisi > 0 ? 'Rezerve Et' : 'Dolu'}
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardContent>
            <Typography variant="h5" gutterBottom>
              Sefer Doluluk Raporu
            </Typography>
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell><strong>Güzergâh</strong></TableCell>
                    <TableCell><strong>Tren</strong></TableCell>
                    <TableCell><strong>Kalkış</strong></TableCell>
                    <TableCell><strong>Kapasite</strong></TableCell>
                    <TableCell><strong>Doluluk</strong></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {dolulukRaporu.map((sefer, index) => (
                    <TableRow key={index}>
                      <TableCell>{sefer.kalkis_istasyon} → {sefer.varis_istasyon}</TableCell>
                      <TableCell>{sefer.tren_kodu}</TableCell>
                      <TableCell>{formatDateTime(sefer.kalkis_zamani)}</TableCell>
                      <TableCell>{sefer.dolu_koltuk_sayisi} / {sefer.koltuk_sayisi}</TableCell>
                      <TableCell>
                        <Box
                          sx={{
                            color:
                              sefer.doluluk_orani > 80 ? 'red' : sefer.doluluk_orani > 50 ? 'orange' : 'green',
                            fontWeight: 'bold'
                          }}
                        >
                          %{sefer.doluluk_orani}
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>

        <Box sx={{ mt: 4, textAlign: 'center', color: 'text.secondary' }}>
          <Typography variant="body2">
            © 2025 Tren Rezervasyon Sistemi · Emirhan Gül, Onur Erçen, Nisa Eylül Çintiriz
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}

export default App;
