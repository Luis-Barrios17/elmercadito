import React, { useState } from "react";
import { Container, Box, Button, Typography, FormControl, FormControlLabel, Checkbox } from "@mui/material";
import { useRouter } from "next/router";
import axios from "axios";
import NavBar from "../components/navbar/NavBar"; // Importar NavBar

const EliminarDireccion = () => { // Cambiar el nombre del componente
  const [selectedAddresses, setSelectedAddresses] = useState([]); // Estado para manejar las direcciones seleccionadas
  const router = useRouter();

  const handleAddressSelection = (address) => {
    // Alternar selección de direcciones
    setSelectedAddresses((prevSelectedAddresses) =>
      prevSelectedAddresses.includes(address)
        ? prevSelectedAddresses.filter((item) => item !== address)
        : [...prevSelectedAddresses, address]
    );
  };

  const handleDeleteAddresses = async () => {
    try {
      for (const id of selectedAddresses) {
        await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/directions/${id}`); // Ruta del backend
      }
      console.log("Direcciones eliminadas exitosamente");
      router.push("/Direcciones");
    } catch (error) {
      console.error("Error al eliminar las direcciones:", error);
    }
  };

  return (
    <>
      {/* Incorporación del NavBar */}
      <NavBar
        tittle="Eliminar Dirección"
        showSearch={false}
        showIcons={true}
      />
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          backgroundImage: "url('Fondo_HikariTech.jpg')",
          backgroundSize: "cover",
          paddingTop: 4,
          paddingLeft: 4,
        }}
      >
        <Container maxWidth="xs">
          <Box
            maxWidth="sm"
            sx={{
              backgroundColor: "rgba(255, 255, 255, 0.37)",
              padding: 3,
              borderRadius: 3,
              width: "100%",
            }}
          >
            <Typography
              variant="h6"
              sx={{
                fontWeight: "bold",
                marginBottom: 2,
                textAlign: "center",
                color: "black",
              }}
            >
              Selecciona las direcciones a eliminar
            </Typography>
            <FormControl>
              {["Dirección 1", "Dirección 2", "Dirección 3", "Dirección 4"].map((address, index) => (
                <FormControlLabel
                  key={index}
                  control={
                    <Checkbox
                      checked={selectedAddresses.includes(address)}
                      onChange={() => handleAddressSelection(address)}
                      sx={{
                        color: "rgba(0, 0, 0, 0.6)", // Color del cuadro por defecto
                        "&.Mui-checked": {
                          color: "blue", // Palomita azul cuando está seleccionado
                        },
                      }}
                    />
                  }
                  label={address}
                />
              ))}
            </FormControl>

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
                onClick={() => router.push("/Direcciones")} // Redirige a la página principal o a otra página después de cancelar
              >
                Cancelar
              </Button>
              <Button
                fullWidth
                variant="contained"
                color="secondary"
                sx={{
                  borderRadius: "10px",
                  padding: "10px 0",
                }}
                onClick={handleDeleteAddresses} // Llama a la función para eliminar las direcciones seleccionadas
              >
                Eliminar
              </Button>
            </Box>
          </Box>
        </Container>
      </Box>
    </>
  );
};

export default EliminarDireccion; // Cambiar el nombre del componente exportado