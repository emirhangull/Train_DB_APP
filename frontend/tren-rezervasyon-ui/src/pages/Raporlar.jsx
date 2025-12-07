import React, { useEffect, useMemo, useState } from 'react';
import {
  Alert,
  Box,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Grid,
  LinearProgress,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography
} from '@mui/material';
import InsightsIcon from '@mui/icons-material/Insights';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import { getSeferDoluluk } from '../services/api';

const formatDateTime = (value) => {
  try {
    return new Date(value).toLocaleString('tr-TR');
  } catch (err) {
    return '-';
  }
};

export default function Raporlar() {
  const [dolulukVerisi, setDolulukVerisi] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let isMounted = true;

    const fetchDoluluk = async () => {
      try {
        const response = await getSeferDoluluk();
        console.log('API Response:', response);
        console.log('API Data:', response.data);
        console.log('Sefer Data:', response.data.data);
        if (!isMounted) return;
        setDolulukVerisi(response.data.data || []);
      } catch (err) {
        console.error('Fetch error:', err);
        if (isMounted) {
          setError('Sefer doluluk raporu çekilirken hata oluştu: ' + err.message);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchDoluluk();
    return () => {
      isMounted = false;
    };
  }, []);

  const raporOzeti = useMemo(() => {
    if (!dolulukVerisi.length) {
      return {
        toplamSefer: 0,
        toplamKoltuk: 0,
        satilanKoltuk: 0,
        ortalamaDoluluk: 0,
        kritikSefer: 0,
        enYogunSefer: null
      };
    }

    const toplamSefer = dolulukVerisi.length;
    const toplamKoltuk = dolulukVerisi.reduce((acc, item) => acc + (item.koltuk_sayisi || 0), 0);
    const satilanKoltuk = dolulukVerisi.reduce((acc, item) => acc + (item.dolu_koltuk_sayisi || 0), 0);
    const ortalamaDoluluk = toplamKoltuk ? Math.round((satilanKoltuk / toplamKoltuk) * 100) : 0;
    const kritikSefer = dolulukVerisi.filter((item) => item.doluluk_orani >= 80).length;
    const enYogunSefer = [...dolulukVerisi].sort((a, b) => b.doluluk_orani - a.doluluk_orani)[0];

    return {
      toplamSefer,
      toplamKoltuk,
      satilanKoltuk,
      ortalamaDoluluk,
      kritikSefer,
      enYogunSefer
    };
  }, [dolulukVerisi]);

  const siraliDoluluk = useMemo(() => {
    return [...dolulukVerisi].sort((a, b) => b.doluluk_orani - a.doluluk_orani);
  }, [dolulukVerisi]);

  const durumChipRengi = (oran) => {
    if (oran >= 90) return 'error';
    if (oran >= 70) return 'warning';
    return 'success';
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '40vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: '1200px', margin: '0 auto', py: 2 }}>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 600 }}>
        Yönetici Raporları
      </Typography>
      <Typography variant="body1" sx={{ mb: 4, color: 'text.secondary' }}>
        Bu sayfada yalnızca yöneticilerin görebildiği detaylı sefer doluluk raporu yer alır. Ana sayfadaki
        özet veriler buraya tablo ve metrik kartları olarak aktarılmıştır.
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={3}>
          <Card elevation={2}>
            <CardContent>
              <Typography variant="overline" color="text.secondary">
                Toplam Sefer
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                <InsightsIcon color="primary" />
                <Typography variant="h4">{raporOzeti.toplamSefer}</Typography>
              </Box>
              <Typography variant="body2" color="text.secondary">
                Raporlanan dönem için toplam sefer
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card elevation={2}>
            <CardContent>
              <Typography variant="overline" color="text.secondary">
                Satılan Koltuk
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                <PeopleAltIcon color="primary" />
                <Typography variant="h4">{raporOzeti.satilanKoltuk}</Typography>
              </Box>
              <Typography variant="body2" color="text.secondary">
                {raporOzeti.toplamKoltuk} kapasite içinde
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card elevation={2}>
            <CardContent>
              <Typography variant="overline" color="text.secondary">
                Ortalama Doluluk
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                <TrendingUpIcon color="primary" />
                <Typography variant="h4">%{raporOzeti.ortalamaDoluluk}</Typography>
              </Box>
              <LinearProgress
                variant="determinate"
                value={raporOzeti.ortalamaDoluluk}
                sx={{ mt: 2, height: 8, borderRadius: 4 }}
              />
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card elevation={2}>
            <CardContent>
              <Typography variant="overline" color="text.secondary">
                Kritik Doluluk
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                <WarningAmberIcon color="warning" />
                <Typography variant="h4">{raporOzeti.kritikSefer}</Typography>
              </Box>
              <Typography variant="body2" color="text.secondary">
                %80 ve üzeri doluluk oranına sahip seferler
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {raporOzeti.enYogunSefer && (
        <Card elevation={3} sx={{ mb: 4, borderLeft: '6px solid #1976d2' }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              En Yoğun Sefer
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle1">
                  {raporOzeti.enYogunSefer.kalkis_istasyon} → {raporOzeti.enYogunSefer.varis_istasyon}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Tren: {raporOzeti.enYogunSefer.tren_kodu}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Kalkış: {formatDateTime(raporOzeti.enYogunSefer.kalkis_zamani)}
                </Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="body2">Kapasite: {raporOzeti.enYogunSefer.koltuk_sayisi}</Typography>
                <Typography variant="body2">Satılan Koltuk: {raporOzeti.enYogunSefer.dolu_koltuk_sayisi}</Typography>
                <Chip
                  label={`%${raporOzeti.enYogunSefer.doluluk_orani} doluluk`}
                  color={durumChipRengi(raporOzeti.enYogunSefer.doluluk_orani)}
                  sx={{ mt: 1 }}
                />
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      )}

      <Paper elevation={3}>
        <Box sx={{ px: 3, pt: 3 }}>
          <Typography variant="h6" gutterBottom>
            Sefer Doluluk Detayları
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Ana sayfadaki sefer doluluk tablosunun genişletilmiş hali. Her rota için kapasite, satılan koltuk ve
            doluluk yüzdesi listelenmiştir.
          </Typography>
        </Box>

        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Güzergâh</TableCell>
                <TableCell>Tren</TableCell>
                <TableCell>Kalkış</TableCell>
                <TableCell>Kapasite</TableCell>
                <TableCell>Satılan Koltuk</TableCell>
                <TableCell>Doluluk</TableCell>
                <TableCell>Durum</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {siraliDoluluk.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    Henüz raporlanacak sefer bulunmuyor.
                  </TableCell>
                </TableRow>
              )}
              {siraliDoluluk.map((sefer, index) => (
                <TableRow key={`${sefer.tren_kodu}-${index}`}>
                  <TableCell>
                    <Box sx={{ fontWeight: 500 }}>
                      {sefer.kalkis_istasyon} → {sefer.varis_istasyon}
                    </Box>
                    <Typography variant="caption" color="text.secondary">
                      #{sefer.sefer_id || '-'}
                    </Typography>
                  </TableCell>
                  <TableCell>{sefer.tren_kodu}</TableCell>
                  <TableCell>{formatDateTime(sefer.kalkis_zamani)}</TableCell>
                  <TableCell>{sefer.koltuk_sayisi}</TableCell>
                  <TableCell>{sefer.dolu_koltuk_sayisi}</TableCell>
                  <TableCell width="20%">
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <LinearProgress
                        variant="determinate"
                        value={sefer.doluluk_orani}
                        sx={{ flex: 1, height: 8, borderRadius: 4 }}
                        color={sefer.doluluk_orani >= 80 ? 'error' : sefer.doluluk_orani >= 60 ? 'warning' : 'success'}
                      />
                      <Typography variant="body2" sx={{ minWidth: 46 }}>
                        %{sefer.doluluk_orani}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={sefer.doluluk_orani >= 85 ? 'Kritik' : 'Normal'}
                      color={durumChipRengi(sefer.doluluk_orani)}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
}
