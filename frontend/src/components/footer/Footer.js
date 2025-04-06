import React from 'react';
import { Box, Typography } from '@mui/material';

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        p: 2,
        bgcolor: 'rgba(0, 0, 0, 0.8)',
        color: 'white',
        textAlign: 'center',
        mt: 'auto',
      }}
    >
      <Typography variant="body2">
        &copy; {new Date().getFullYear()} HikariTech - Todos los derechos reservados
      </Typography>
    </Box>
  );
};

export default Footer;