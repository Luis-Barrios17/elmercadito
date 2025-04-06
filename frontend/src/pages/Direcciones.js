import React, { useEffect, useState } from "react";
import { Container, Box, Typography, Button, Paper } from "@mui/material";
import { useRouter } from "next/router";
import axios from "axios";
import NavBar from "../components/navbar/NavBar";
import Footer from "../components/footer/Footer"; // Importar Footer

const Direcciones = () => {
  const [addresses, setAddresses] = useState([]);
  
  const router = useRouter();

  const fetchAddresses = async () => {
    try {
      const token = localStorage.getItem("token");
      const userId = localStorage.getItem("userId");

      if (!token || !userId) {
        console.error("No hay un token o userId disponible.");
        alert("Por favor, inicia sesión para continuar.");
        return;
      }

      // Obtener direcciones del usuario desde el backend
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/directions`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const userAddresses = response.data.filter((address) => address.usuario === userId);
      setAddresses(userAddresses);
    } catch (error) {
      console.error("Error al obtener las direcciones:", error);
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, []);

  const handleAddClick = () => {
    router.push("/agregarDireccion");
  };

  const handleEditClick = (id) => {
    router.push(`/EditarDireccion?id=${id}`); // Redirige a la página de edición con el ID de la dirección
  };

  const handleDeleteClick = async (id) => {
    const confirmDelete = window.confirm("¿Estás seguro de que deseas eliminar esta dirección?");
    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        console.error("No hay un token disponible.");
        alert("Por favor, inicia sesión para continuar.");
        return;
      }

      // Eliminar dirección desde el backend
      await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/directions/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      alert("Dirección eliminada con éxito.");
      fetchAddresses(); // Actualiza la lista de direcciones después de eliminar
    } catch (error) {
      console.error("Error al eliminar la dirección:", error);
      alert("Error al eliminar la dirección. Inténtalo nuevamente.");
    }
  };

  const handleBackClick = () => {
    router.push("/MiPerfil");
  };

  return (
    <>
      <NavBar
        title="Direcciones"
        showSearch={false}
        showIcons={true}
        color="white"
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
        <Container maxWidth="md">
          <Box
            sx={{
              backgroundColor: "rgba(245, 245, 245, 0.21)",
              padding: 4,
              borderRadius: 3,
              boxShadow: 3,
              maxWidth: "600px",
              margin: "0 auto",
            }}
          >
            <Typography
              variant="h4"
              gutterBottom
              textAlign="center"
              fontWeight="bold"
              color="secondary"
            >
              DIRECCIONES
            </Typography>

            {addresses.length > 0 ? (
              addresses.map((address, index) => (
                <Paper
                  key={index}
                  sx={{
                    padding: 2,
                    marginBottom: 2,
                    borderRadius: 2,
                    boxShadow: 2,
                    backgroundColor: address.isDefault ? "rgba(144, 238, 144, 0.5)" : "white", // Verde más claro para predeterminadas
                    border: address.isDefault ? "2px solid green" : "1px solid rgba(0, 0, 0, 0.12)", // Cambia el borde si es predeterminada
                  }}
                >
                  <Typography variant="body1">
                    {address.calle}, {address.colonia}, {address.Numext}{" "}
                    {address.Numint ? `Int. ${address.Numint}, ` : ""}
                    {address.ciudad}, {address.estado}, {address.codigopostal}
                  </Typography>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      gap: 2,
                      mt: 2,
                    }}
                  >
                    <Button
                      variant="contained"
                      color="secondary"
                      sx={{
                        borderRadius: "10px",
                        padding: "5px 5px",
                        fontSize: "0.8rem",
                        height: "35px",
                        backgroundColor: "rgb(3, 46, 63)",
                      }}
                      onClick={() => handleEditClick(address._id)} // Llama a la función de editar
                    >
                      Editar
                    </Button>
                    <Button
                      variant="contained"
                      color="secondary"
                      sx={{
                        borderRadius: "10px",
                        padding: "5px 5px",
                        fontSize: "0.8rem",
                        height: "35px",
                        backgroundColor: "rgb(131, 6, 6)",
                      }}
                      onClick={() => handleDeleteClick(address._id)} // Llama a la función de eliminar
                    >
                      Eliminar
                    </Button>
                  </Box>
                </Paper>
              ))
            ) : (
              <Typography>No hay direcciones disponibles.</Typography>
            )}

            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                gap: 2,
                mt: 2,
              }}
            >
              <Button
                fullWidth
                variant="contained"
                color="secondary"
                sx={{
                  borderRadius: "10px",
                  padding: "5px 5px",
                  fontSize: "0.8rem",
                  height: "45px",
                  backgroundColor: "rgb(3, 46, 63)",
                }}
                onClick={handleAddClick}
              >
                Agregar
              </Button>
            </Box>
          </Box>
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
              marginLeft: "800px",
              marginRight: 0,
            }}
            onClick={handleBackClick}
          >
            Regresar
          </Button>
        </Container>
      </Box>
      <Footer /> {/* Agregar el Footer aquí */}
    </>
  );
};

export default Direcciones;