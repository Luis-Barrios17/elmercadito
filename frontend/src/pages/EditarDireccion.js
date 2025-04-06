import React, { useState, useEffect } from "react";
import { Container, Box, TextField, Button, Checkbox, FormControlLabel } from "@mui/material";
import { useRouter } from "next/router";
import axios from "axios";
import NavBar from "../components/navbar/NavBar";
import Footer from "../components/footer/Footer"; // Importar Footer

const EditarDireccion = () => {
  const [street, setStreet] = useState("");
  const [colonia, setColonia] = useState(""); // Nuevo estado para la colonia
  const [extNumber, setExtNumber] = useState("");
  const [intNumber, setIntNumber] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [zip, setZip] = useState("");
  const [isDefault, setIsDefault] = useState(false); // Estado para manejar si la dirección es predeterminada
  const [errors, setErrors] = useState({}); // Estado para manejar errores
  const router = useRouter();
  const { id } = router.query; // Obtener el ID de la dirección desde la URL

  useEffect(() => {
    if (id) {
      fetchDireccion(id); // Cargar los datos de la dirección al cargar la página
    }
  }, [id]);

  const fetchDireccion = async (direccionId) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Por favor, inicia sesión para continuar.");
        return;
      }

      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/directions/${direccionId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const direccion = response.data;
      setStreet(direccion.calle);
      setColonia(direccion.colonia); // Cargar el valor de colonia
      setExtNumber(direccion.Numext);
      setIntNumber(direccion.Numint);
      setCity(direccion.ciudad);
      setState(direccion.estado);
      setZip(direccion.codigopostal);
      setIsDefault(direccion.isDefault || false); // Cargar el estado de predeterminada
    } catch (error) {
      console.error("Error al cargar los datos de la dirección:", error);
      alert("Hubo un error al cargar los datos de la dirección.");
    }
  };

  const validateFields = () => {
    const newErrors = {};

    if (!street.trim()) newErrors.street = "La calle es obligatoria.";
    if (!colonia.trim()) newErrors.colonia = "La colonia es obligatoria."; // Validación para colonia
    if (!extNumber.trim()) newErrors.extNumber = "El número exterior es obligatorio.";
    if (intNumber && isNaN(intNumber)) newErrors.intNumber = "El número interior debe ser un número.";
    if (!city.trim()) newErrors.city = "La ciudad es obligatoria.";
    if (!state.trim()) newErrors.state = "El estado es obligatorio.";
    if (!zip.trim() || isNaN(zip) || zip.length !== 5) {
      newErrors.zip = "El código postal debe ser un número de 5 dígitos.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // Retorna true si no hay errores
  };

  const handleEditAddress = async (e) => {
    e.preventDefault();

    if (!validateFields()) {
      return; // Si hay errores, no continúa
    }

    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");

    if (!token || !userId) {
      alert("Por favor, inicia sesión para continuar.");
      return;
    }

    try {
      // Verificar si ya existe una dirección predeterminada
      if (isDefault) {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/directions`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        // Filtrar direcciones del usuario y verificar si hay una predeterminada diferente a la actual
        const defaultAddress = response.data.find(
          (address) => address.isDefault === true && address.usuario.toString() === userId && address._id !== id
        );

        if (defaultAddress) {
          alert("Ya existe una dirección marcada como predeterminada. Por favor, desmarque la dirección actual antes de continuar.");
          return; // Detener el flujo si ya hay una dirección predeterminada
        }
      }

      // Actualizar la dirección
      await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/directions/${id}`,
        {
          usuario: userId,
          calle: street,
          colonia, // Enviar el nuevo campo colonia
          ciudad: city,
          estado: state,
          codigopostal: zip,
          Numext: extNumber,
          Numint: intNumber,
          isDefault, // Enviar si la dirección es predeterminada
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      alert("Dirección actualizada exitosamente.");
      router.push("/Direcciones");
    } catch (error) {
      console.error("Error al actualizar la dirección:", error.response?.data || error.message);
      alert("Hubo un error al actualizar la dirección.");
    }
  };

  return (
    <>
      <NavBar
        tittle="Editar Dirección"
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
            <form onSubmit={handleEditAddress}>
              <TextField
                fullWidth
                label="Calle"
                type="text"
                margin="normal"
                variant="outlined"
                value={street}
                onChange={(e) => setStreet(e.target.value)}
                error={!!errors.street}
                helperText={errors.street}
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
                label="No. Ext"
                type="text"
                margin="normal"
                variant="outlined"
                value={extNumber}
                onChange={(e) => setExtNumber(e.target.value)}
                error={!!errors.extNumber}
                helperText={errors.extNumber}
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
                value={intNumber}
                onChange={(e) => setIntNumber(e.target.value)}
                error={!!errors.intNumber}
                helperText={errors.intNumber}
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
                value={city}
                onChange={(e) => setCity(e.target.value)}
                error={!!errors.city}
                helperText={errors.city}
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
                value={state}
                onChange={(e) => setState(e.target.value)}
                error={!!errors.state}
                helperText={errors.state}
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
                value={zip}
                onChange={(e) => setZip(e.target.value)}
                error={!!errors.zip}
                helperText={errors.zip}
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
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  mt: 3,
                }}
              >
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={() => router.push("/Direcciones")}
                  sx={{
                    borderRadius: "10px",
                    padding: "10px 0",
                  }}
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
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
      {/* Incorporación del Footer */}  
      <Footer />
    </>
  );
};

export default EditarDireccion;