import React from 'react';
import { Container, Typography, Box } from '@mui/material';
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';
import PNRLookup from '../components/PNRLookup';

export default function Seferler() {
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
    </Container>
  );
}
