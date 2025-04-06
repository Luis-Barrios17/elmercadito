import React, { useState, useEffect } from "react";
import { Container, Box, TextField, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";
import { useRouter } from "next/router";
import axios from "axios";
import NavBar from "../components/navbar/NavBar";
import Footer from "../components/footer/Footer"; // Importar Footer

const EditarTarjeta = () => {
  const [numeroTarjeta, setNumeroTarjeta] = useState('');
  const [Propietario, setPropietario] = useState('');
  const [FechaExpiracion, setFechaExpiracion] = useState(''); // Campo combinado de mes/año
  const [cvv, setCvv] = useState('');
  const [isDefault, setIsDefault] = useState(false); // Estado para tarjeta predeterminada
  const [tarjetas, setTarjetas] = useState([]); // Estado para almacenar las tarjetas existentes
  const [openDialog, setOpenDialog] = useState(false); // Estado para el diálogo
  const router = useRouter();

  useEffect(() => {
    const { id: cardId } = router.query; // Obtén el ID de la tarjeta desde la URL
    if (cardId) {
      fetchCardData(cardId); // Cargar los datos de la tarjeta al cargar la página
    }
    fetchAllCards(); // Cargar todas las tarjetas del usuario
  }, [router.query]);
  const fetchCardData = async (cardId) => {
    try {
      const token = localStorage.getItem("token");
  
      if (!token) {
        alert("Por favor, inicia sesión para continuar.");
        return;
      }
  
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/cards/${cardId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      const card = response.data;
      setNumeroTarjeta(card.numeroTarjeta);
      setPropietario(card.Propietario);
      setFechaExpiracion(card.FechaExpiracion);
      setCvv(card.cvv);
      setIsDefault(card.isDefault);
    } catch (error) {
      console.error("Error al cargar los datos de la tarjeta:", error);
      alert("Hubo un error al cargar los datos de la tarjeta.");
    }
  };
  
  const fetchAllCards = async () => {
    try {
      const token = localStorage.getItem("token");
      const userId = localStorage.getItem("userId");
  
      if (!token || !userId) {
        console.error("No hay un token o userId disponible.");
        return;
      }
  
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/cards`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      const userCards = response.data.filter((card) => card.user === userId);
      setTarjetas(userCards); // Guardar las tarjetas del usuario
    } catch (error) {
      console.error("Error al cargar las tarjetas:", error);
    }
  };
  
  const handleSaveTarjeta = async (e) => {
    e.preventDefault();
  
    try {
      const token = localStorage.getItem("token");
  
      if (!token) {
        alert("Por favor, inicia sesión para continuar.");
        return;
      }
  
      const { id: cardId } = router.query; // Obtén el ID de la tarjeta desde la URL
  
      if (!cardId) {
        alert("No se encontró el ID de la tarjeta.");
        return;
      }
  
      console.log("Datos enviados al backend:", {
        numeroTarjeta,
        Propietario,
        FechaExpiracion,
        cvv,
        isDefault,
      });
  
      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/cards/${cardId}`,
        {
          numeroTarjeta,
          Propietario,
          FechaExpiracion,
          cvv,
          isDefault,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
  
      console.log("Tarjeta actualizada exitosamente:", response.data);
      alert("Tarjeta actualizada exitosamente.");
      router.push("/MetodosDePago");
    } catch (error) {
      console.error("Error al actualizar la tarjeta:", error);
  
      if (error.response) {
        console.log("Respuesta del backend:", error.response.data);
        console.log("Código de estado:", error.response.status);
        alert(`Error: ${error.response.data.message || "No se pudo actualizar la tarjeta."}`);
      } else if (error.request) {
        console.log("No se recibió respuesta del backend:", error.request);
        alert("No se recibió respuesta del servidor.");
      } else {
        console.log("Error al configurar la solicitud:", error.message);
        alert("Hubo un error al configurar la solicitud.");
      }
    }
  };

  const toggleDefault = () => {
    // Verificar si ya existe una tarjeta predeterminada
    if (!isDefault && tarjetas.some((tarjeta) => tarjeta.isDefault && tarjeta._id !== router.query.id)) {
      setOpenDialog(true); // Mostrar el diálogo si ya existe una tarjeta predeterminada
      return;
    }
    setIsDefault(!isDefault); // Alterna el estado de isDefault
  };

  return (
    <>
      {/* Incorporación del NavBar */}
      <NavBar
        tittle="Editar Tarjeta"
        showSearch={false}
        showIcons={true}
      />
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          backgroundImage: "url('Fondo_HikariTech.jpg')",
        }}
      >
        <Container maxWidth="xs">
          <Box
            sx={{
              backgroundColor: "rgba(169, 169, 169, 0.5)",
              padding: 4,
              borderRadius: 3,
              boxShadow: 3,
            }}
          >
            <form onSubmit={handleSaveTarjeta}>
              <TextField
                fullWidth
                label="Número de Tarjeta"
                type="text"
                margin="normal"
                variant="outlined"
                value={numeroTarjeta}
                onChange={(e) => setNumeroTarjeta(e.target.value)}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "10px",
                    backgroundColor: "rgba(255, 255, 255, 0.4)",
                  },
                }}
              />
              <TextField
                fullWidth
                label="Propietario"
                type="text"
                margin="normal"
                variant="outlined"
                value={Propietario}
                onChange={(e) => setPropietario(e.target.value)}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "10px",
                    backgroundColor: "rgba(255, 255, 255, 0.4)",
                  },
                }}
              />
              <TextField
                fullWidth
                label="Fecha de Expiración (MM/AAAA)"
                type="text"
                margin="normal"
                variant="outlined"
                value={FechaExpiracion}
                onChange={(e) => setFechaExpiracion(e.target.value)}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "10px",
                    backgroundColor: "rgba(255, 255, 255, 0.4)",
                  },
                }}
              />
              <TextField
                fullWidth
                label="CVV"
                type="text"
                margin="normal"
                variant="outlined"
                value={cvv}
                onChange={(e) => setCvv(e.target.value)}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "10px",
                    backgroundColor: "rgba(255, 255, 255, 0.4)",
                  },
                }}
              />
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  mt: 2,
                }}
              >
                <Button
                  variant="outlined"
                  color={isDefault ? "primary" : "secondary"}
                  onClick={toggleDefault}
                  sx={{
                    borderRadius: "10px",
                    padding: "10px 20px",
                  }}
                >
                  {isDefault ? "Tarjeta Predeterminada" : "Marcar como Predeterminada"}
                </Button>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  gap: 2,
                  mt: 2,
                }}
              >
                <Button
                  type="button"
                  fullWidth
                  variant="contained"
                  color="secondary"
                  sx={{
                    borderRadius: "10px",
                    padding: "10px 0",
                  }}
                  onClick={() => router.push('/MetodosDePago')} // Redirige a la página principal o a otra página después de cancelar
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  color="secondary"
                  sx={{
                    borderRadius: "10px",
                    padding: "10px 0",
                  }}
                >
                  Confirmar
                </Button>
              </Box>
            </form>
          </Box>
        </Container>
      </Box>

      {/* Diálogo para advertencia */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Advertencia</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Ya existe una tarjeta predeterminada. Por favor, desmarca la opción de predeterminada en la otra tarjeta antes de continuar.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)} color="primary">
            Aceptar
          </Button>
        </DialogActions>
      </Dialog>
        
        {/* Incorporación del Footer */}
      <Footer />
    </>
  );
};

export default EditarTarjeta;