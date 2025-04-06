import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Box, Typography, List, ListItem, ListItemText, CircularProgress, Button, Card, CardMedia, CardContent } from '@mui/material';
import NavBar from '../components/navbar/NavBar';
import { useRouter } from 'next/router';
import Footer from "../components/footer/Footer";


const MisCompras = () => {
  const [compras, setCompras] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchCompras = async () => {
      try {
        const token = localStorage.getItem('token'); // Obtener el token del usuario autenticado
        const userId = localStorage.getItem('userId'); // Obtener el ID del usuario autenticado

        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/orders`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        // Filtrar las órdenes por el ID del usuario
        const ordenesUsuario = response.data.filter((orden) => orden.Usuario._id === userId);
        setCompras(ordenesUsuario);
      } catch (error) {
        console.error('Error al obtener las compras:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCompras();
  }, []);

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
          backgroundImage: "url('Fondo_HikariTech.jpg')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <>
      <NavBar
        alignItems="center"
        justifyContent="space-between"
        tittle="Historial de Compras"
        showSearch={false}
        showIcons={true}
      />
      <Box
        sx={{
          minHeight: '100vh',
          backgroundImage: "url('Fondo_HikariTech.jpg')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          padding: '20px',
        }}
      >
        <Typography
          variant="h4"
          sx={{
            fontWeight: 'bold',
            marginBottom: '20px',
            textAlign: 'center',
            color: 'white',
            textShadow: '2px 2px 4px rgba(0, 0, 0, 0.7)',
          }}
        >
          Mis Compras
        </Typography>
        {compras.length === 0 ? (
          <Typography
            variant="body1"
            sx={{
              textAlign: 'center',
              color: 'white',
              textShadow: '1px 1px 3px rgba(0, 0, 0, 0.7)',
            }}
          >
            No has realizado ninguna compra.
          </Typography>
        ) : (
          <List>
            {compras.map((compra) => (
              <ListItem
                key={compra._id}
                sx={{
                  marginBottom: '20px',
                  border: '1px solid #ccc',
                  borderRadius: '8px',
                  padding: '10px',
                  backgroundColor: 'rgba(255, 255, 255, 0.8)',
                  boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.2)',
                }}
              >
                <Card sx={{ display: 'flex', width: '100%' }}>
                  <CardMedia
                    component="img"
                    sx={{ width: 150 }}
                    image={compra.items[0].Producto.imagenProducto[0]} // Mostrar la primera imagen del producto
                    alt={compra.items[0].Producto.nombreProducto}
                  />
                  <CardContent>
                    <Typography variant="h6">{`Orden #${compra._id}`}</Typography>
                    <Typography variant="body2">Total: ${compra.total}</Typography>
                    <Typography variant="body2">
                      Estado: {compra.Estado === 'Pendiente' ? 'Finalizado' : compra.Estado}
                    </Typography>
                    <Typography variant="body2">Productos:</Typography>
                    <ul>
                      {compra.items.map((item) => (
                        <li key={item.Producto._id}>
                          {item.Producto.nombreProducto} - {item.Cantidad} x ${item.Precio}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </ListItem>
            ))}
          </List>
        )}
        {/* Botón para regresar a Mi Perfil */}
        <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => router.push('/MiPerfil')}
          >
            Regresar a Mi Perfil
          </Button>
        </Box>
      </Box>
      <Footer />
    </>
  );
};

export default MisCompras;