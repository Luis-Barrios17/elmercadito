import React, { useState } from "react";
import { Container, Box, TextField, Button, Typography, Checkbox, FormControlLabel, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";
import { useRouter } from "next/router";
import axios from "axios";
import NavBar from "../components/navbar/NavBar";
import Footer from "../components/footer/Footer"; // Importar Footer  

const Address = () => {
  const [calle, setCalle] = useState("");
  const [colonia, setColonia] = useState(""); // Nuevo estado para la colonia
  const [ciudad, setCiudad] = useState("");
  const [estado, setEstado] = useState("");
  const [codigopostal, setCodigoPostal] = useState("");
  const [Numext, setExtNumber] = useState("");
  const [Numint, setIntNumber] = useState("");
  const [isDefault, setIsDefault] = useState(false); // Estado para manejar si la dirección es predeterminada
  const [errors, setErrors] = useState({});
  const [dialogOpen, setDialogOpen] = useState(false); // Estado para manejar el diálogo
  const router = useRouter();

  const validateFields = () => {
    const newErrors = {};

    if (!calle.trim()) newErrors.calle = "La calle es obligatoria.";
    if (!colonia.trim()) newErrors.colonia = "La colonia es obligatoria."; // Validación para colonia
    if (!ciudad.trim()) newErrors.ciudad = "La ciudad es obligatoria.";
    if (!estado.trim()) newErrors.estado = "El estado es obligatorio.";
    if (!codigopostal.trim() || isNaN(codigopostal) || codigopostal.length !== 5) {
      newErrors.codigopostal = "El código postal debe ser un número de 5 dígitos.";
    }
    if (!Numext.trim()) newErrors.Numext = "El número exterior es obligatorio.";
    if (Numint && isNaN(Numint)) newErrors.Numint = "El número interior debe ser un número.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // Retorna true si no hay errores
  };

  const handleAddAddress = async (e) => {
    e.preventDefault();

    if (!validateFields()) {
      return; // Si hay errores, no continúa
    }

    try {
      const token = localStorage.getItem("token");
      const usuario = localStorage.getItem("userId");

      if (!token || !usuario) {
        console.error("No hay un token o usuario disponible.");
        alert("Por favor, inicia sesión para continuar.");
        return;
      }

      // Verificar si ya existe una dirección predeterminada
      if (isDefault) {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/directions`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        // Filtrar direcciones del usuario y verificar si hay una predeterminada
        const defaultAddress = response.data.find(
          (address) => address.isDefault === true && address.usuario.toString() === usuario
        );

        if (defaultAddress) {
          setDialogOpen(true); // Mostrar el diálogo si ya existe una dirección predeterminada
          return; // Detener el flujo si ya hay una dirección predeterminada
        }
      }

      // Enviar la solicitud al backend para agregar la dirección
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/directions`,
        {
          usuario,
          calle,
          colonia, // Enviar el nuevo campo colonia
          ciudad,
          estado,
          codigopostal,
          Numext,
          Numint,
          isDefault,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      alert("Dirección agregada con éxito.");
      router.push("/Direcciones");
    } catch (error) {
      console.error("Error al agregar la dirección:", error.response?.data || error.message);
      alert("Error al agregar la dirección. Inténtalo nuevamente.");
    }
  };

  // Función para cerrar el diálogo
  const handleCloseDialog = () => {
    setDialogOpen(false); // Cerrar el diálogo
  };

  return (
    <>
      <NavBar
        tittle="Agregar Dirección"
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
              margin: 3,
              marginTop: 5,
            }}
          >
            <form onSubmit={handleAddAddress}>
              <TextField
                fullWidth
                label="Calle"
                type="text"
                margin="normal"
                variant="outlined"
                value={calle}
                onChange={(e) => setCalle(e.target.value)}
                error={!!errors.calle}
                helperText={errors.calle}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "10px",
                    backgroundColor: "rgba(255, 255, 255, 0.4)",
                  },
                }}
              />
              <TextField
                fullWidth
                label="Colonia"
                type="text"
                margin="normal"
                variant="outlined"
                value={colonia}
                onChange={(e) => setColonia(e.target.value)}
                error={!!errors.colonia}
                helperText={errors.colonia}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "10px",
                    backgroundColor: "rgba(255, 255, 255, 0.4)",
                  },
                }}
              />
              <TextField
                fullWidth
                label="Ciudad"
                type="text"
                margin="normal"
                variant="outlined"
                value={ciudad}
                onChange={(e) => setCiudad(e.target.value)}
                error={!!errors.ciudad}
                helperText={errors.ciudad}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "10px",
                    backgroundColor: "rgba(255, 255, 255, 0.4)",
                  },
                }}
              />
              <TextField
                fullWidth
                label="Estado"
                type="text"
                margin="normal"
                variant="outlined"
                value={estado}
                onChange={(e) => setEstado(e.target.value)}
                error={!!errors.estado}
                helperText={errors.estado}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "10px",
                    backgroundColor: "rgba(255, 255, 255, 0.4)",
                  },
                }}
              />
              <TextField
                fullWidth
                label="Código Postal"
                type="text"
                margin="normal"
                variant="outlined"
                value={codigopostal}
                onChange={(e) => setCodigoPostal(e.target.value)}
                error={!!errors.codigopostal}
                helperText={errors.codigopostal}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "10px",
                    backgroundColor: "rgba(255, 255, 255, 0.4)",
                  },
                }}
              />
              <TextField
                fullWidth
                label="No. Ext"
                type="text"
                margin="normal"
                variant="outlined"
                value={Numext}
                onChange={(e) => setExtNumber(e.target.value)}
                error={!!errors.Numext}
                helperText={errors.Numext}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "10px",
                    backgroundColor: "rgba(255, 255, 255, 0.4)",
                  },
                }}
              />
              <TextField
                fullWidth
                label="No. Int"
                type="text"
                margin="normal"
                variant="outlined"
                value={Numint}
                onChange={(e) => setIntNumber(e.target.value)}
                error={!!errors.Numint}
                helperText={errors.Numint}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "10px",
                    backgroundColor: "rgba(255, 255, 255, 0.4)",
                  },
                }}
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={isDefault}
                    onChange={(e) => setIsDefault(e.target.checked)}
                    color="primary"
                  />
                }
                label="Marcar como dirección predeterminada"
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="secondary"
                sx={{
                  borderRadius: "10px",
                  padding: "10px 0",
                  backgroundColor: "rgb(3, 46, 63)",
                  marginTop: 2,
                }}
              >
                Confirmar
              </Button>
              <Button
                variant="contained"
                color="secondary"
                sx={{
                  borderRadius: "10px",
                  padding: "10px 0",
                  mt: 2,
                  backgroundColor: "rgb(131, 6, 6)",
                  maxWidth: "200px",
                  width: "100%",
                  display: "block",
                  marginLeft: "400px",
                  marginRight: 0,
                }}
                onClick={() => router.push("/Direcciones")}
              >
                Regresar
              </Button>
            </form>
          </Box>
        </Container>
      </Box>

      {/* Diálogo para informar al usuario */}
      <Dialog open={dialogOpen} onClose={handleCloseDialog}>
        <DialogTitle>Dirección predeterminada existente</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Ya existe una dirección marcada como predeterminada. Por favor, desmarque la dirección actual antes de agregar una nueva como predeterminada.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="red">
            Cerrar
          </Button>
        </DialogActions>
      </Dialog>
      <Footer /> {/* Agregar el Footer aquí */}
    </>
  );
};

export default Address;