import React, { useState, useContext, useEffect } from "react";
import { Container, Box, TextField, Button, Typography, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";
import { useRouter } from "next/router";
import axios from "axios";
import NavBar from "../components/navbar/NavBar";
import { AuthContext } from "../context/AuthContext";
import Footer from "../components/footer/Footer"; // Importar Footer

const AgregarTarjeta = () => {
  const { user } = useContext(AuthContext);
  const [numeroTarjeta, setNumeroTarjeta] = useState("");
  const [Propietario, setPropietario] = useState("");
  const [FechaExpiracion, setFechaExpiracion] = useState("");
  const [cvv, setCvv] = useState("");
  const [isDefault, setIsDefault] = useState(false);
  const [message, setMessage] = useState("");
  const [openDialog, setOpenDialog] = useState(false); // Estado para el diálogo
  const [tarjetas, setTarjetas] = useState([]); // Estado para almacenar las tarjetas existentes
  const router = useRouter();

  // Cargar las tarjetas existentes al cargar la página
  useEffect(() => {
    const fetchTarjetas = async () => {
      try {
        const token = localStorage.getItem("token");
        const userId = localStorage.getItem("userId");

        if (!token || !userId) {
          console.error("No hay un token o userId disponible.");
          return;
        }

        // Usa la variable de entorno para la URL de la API
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

    fetchTarjetas();
  }, []);

  const validateFields = () => {
    if (!numeroTarjeta || numeroTarjeta.length !== 16 || isNaN(numeroTarjeta)) {
      setMessage("El número de tarjeta debe tener 16 dígitos y solo contener números.");
      return false;
    }
    if (!Propietario || Propietario.trim().length === 0) {
      setMessage("El nombre del propietario es obligatorio.");
      return false;
    }
    if (!FechaExpiracion || !/^\d{2}\/\d{4}$/.test(FechaExpiracion)) {
      setMessage("La fecha de expiración debe estar en formato MM/AAAA.");
      return false;
    }
    if (!cvv || cvv.length !== 3 || isNaN(cvv)) {
      setMessage("El CVV debe tener 3 dígitos y solo contener números.");
      return false;
    }
    return true;
  };

  const handleSaveTarjeta = async (e) => {
    e.preventDefault();

    // Validar campos antes de enviar la solicitud
    if (!validateFields()) {
      setOpenDialog(true); // Mostrar el diálogo con el mensaje de error
      return;
    }

    // Verificar si ya existe una tarjeta predeterminada
    if (isDefault && tarjetas.some((tarjeta) => tarjeta.isDefault)) {
      setMessage("Ya existe una tarjeta predeterminada. Por favor, desmarca la opción de predeterminada o cambia la tarjeta predeterminada existente.");
      setOpenDialog(true);
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const userId = localStorage.getItem("userId");

      if (!token || !userId) {
        console.error("No hay un token o userId disponible.");
        alert("Por favor, inicia sesión para continuar.");
        return;
      }

      // Enviar la solicitud al backend para agregar la tarjeta
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/cards`,
        {
          user: userId,
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

      console.log("Tarjeta guardada:", response.data);
      alert("Tarjeta agregada con éxito.");
      router.push("/MetodosDePago");
    } catch (error) {
      if (error.response && error.response.status === 400) {
        // Mostrar mensaje de error si la tarjeta ya existe
        setMessage(error.response.data.message);
        setOpenDialog(true); // Abrir el diálogo para mostrar el mensaje
      } else {
        console.error("Error al guardar la tarjeta:", error);
        setMessage("Error al guardar la tarjeta. Inténtalo nuevamente.");
        setOpenDialog(true);
      }
    }
  };

  return (
    <>
      <NavBar  
      title="Agregar Tarjeta" 
      showSearch={false} 
      showIcons={true} />
      <Box sx={{ minHeight: "100vh", display: "flex", justifyContent: "center", alignItems: "center", backgroundImage: "url('Fondo_HikariTech.jpg')" }}>
        <Container maxWidth="xs">
          <Box sx={{ backgroundColor: "rgba(169, 169, 169, 0.5)", padding: 4, borderRadius: 3, boxShadow: 3 }}>
            <form onSubmit={handleSaveTarjeta}>
              {message && <Typography variant="body2" color="error" sx={{ mb: 2 }}>{message}</Typography>}
              <TextField 
                fullWidth 
                label="Número de Tarjeta" 
                type="text" 
                value={numeroTarjeta} 
                onChange={(e) => setNumeroTarjeta(e.target.value)} 
                margin="none" 
                variant="outlined" 
                sx={{ mb: 2 }} 
              />
              <TextField 
                fullWidth 
                label="Propietario" 
                type="text" 
                value={Propietario} 
                onChange={(e) => setPropietario(e.target.value)} 
                margin="normal" 
                variant="outlined" 
                sx={{ mb: 2 }} 
              />
              <TextField 
                fullWidth 
                label="Fecha de Expiración (MM/AAAA)" 
                type="text" 
                value={FechaExpiracion} 
                onChange={(e) => setFechaExpiracion(e.target.value)} 
                margin="normal" 
                variant="outlined" 
                sx={{ mb: 2 }} 
              />
              <TextField 
                fullWidth 
                label="CVV" 
                type="password" 
                value={cvv} 
                onChange={(e) => setCvv(e.target.value)} 
                margin="normal" 
                variant="outlined" 
                sx={{ mb: 2 }} 
              />
              <Box sx={{ display: "flex", justifyContent: "space-between", gap: 2, mt: 2 }}>
                <Button 
                  fullWidth 
                  variant="contained" 
                  color="secondary" 
                  onClick={() => router.push("/MetodosDePago")} 
                  sx={{ borderRadius: "10px", backgroundColor: "rgb(3, 46, 63)", padding: "10px 0" }}
                >
                  Cancelar
                </Button>
                <Button 
                  type="submit" 
                  fullWidth 
                  variant="contained" 
                  color="secondary" 
                  sx={{ borderRadius: "10px", backgroundColor: "rgb(3, 46, 63)", padding: "10px 0" }}
                >
                  Confirmar
                </Button>
              </Box>
              <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
                <Button 
                  type="button" 
                  variant="outlined" 
                  color={isDefault ? "primary" : "secondary"}
                  onClick={() => setIsDefault(!isDefault)} 
                  sx={{ borderRadius: "10px", padding: "10px 20px" }}
                >
                  {isDefault ? "Tarjeta Predeterminada" : "Marcar como Predeterminada"}
                </Button>
              </Box>
            </form>
          </Box>
        </Container>
      </Box>
      {/* Diálogo para mostrar el mensaje de error */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Error</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {message}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)} color="primary">Aceptar</Button>
        </DialogActions>
      </Dialog>
      <Footer /> {/* Agregar el Footer aquí */}
    </>
  );
};

export default AgregarTarjeta;