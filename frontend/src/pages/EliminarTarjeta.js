import React, { useState, useEffect } from "react";
import { Container, Box, Button, Typography, FormControl, FormControlLabel, Checkbox } from "@mui/material";
import { useRouter } from "next/router";
import axios from "axios";
import NavBar from "../components/navbar/NavBar";
import Footer from "../components/footer/Footer"; // Importar Footer

const EliminarTarjeta = () => {
  const [tarjetas, setTarjetas] = useState([]); // Estado para almacenar las tarjetas del usuario
  const [selectedCards, setSelectedCards] = useState([]); // Estado para manejar las tarjetas seleccionadas
  const router = useRouter();

  // Obtener las tarjetas del usuario desde el backend
  const fetchTarjetas = async () => {
    try {
      const token = localStorage.getItem("token");
      const userId = localStorage.getItem("userId");

      if (!token || !userId) {
        alert("Por favor, inicia sesión para continuar.");
        return;
      }

      // Usa la variable de entorno para la URL de la API
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/cards`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Filtrar las tarjetas del usuario
      const userCards = response.data.filter((card) => card.user === userId);
      setTarjetas(userCards);
    } catch (error) {
      console.error("Error al obtener las tarjetas:", error);
    }
  };

  useEffect(() => {
    fetchTarjetas(); // Llama a la función para obtener las tarjetas al cargar el componente
  }, []);

  const handleCardSelection = (cardId) => {
    // Alternar selección de tarjetas
    setSelectedCards((prevSelectedCards) =>
      prevSelectedCards.includes(cardId)
        ? prevSelectedCards.filter((id) => id !== cardId)
        : [...prevSelectedCards, cardId]
    );
  };

  const handleDeleteCards = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        alert("Por favor, inicia sesión para continuar.");
        return;
      }

      // Iterar sobre las tarjetas seleccionadas y enviar una solicitud DELETE para cada una
      for (const cardId of selectedCards) {
        await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/cards/${cardId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      }

      alert("Tarjetas eliminadas exitosamente.");
      fetchTarjetas(); // Actualizar la lista de tarjetas después de eliminar
    } catch (error) {
      console.error("Error al eliminar las tarjetas:", error);
      alert("Hubo un error al eliminar las tarjetas.");
    }
  };

  return (
    <>
      {/* Incorporación del NavBar */}
      <NavBar
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
              Selecciona las tarjetas a eliminar
            </Typography>
            <FormControl>
              {tarjetas.map((card) => (
                <FormControlLabel
                  key={card._id}
                  control={
                    <Checkbox
                      checked={selectedCards.includes(card._id)}
                      onChange={() => handleCardSelection(card._id)}
                      sx={{
                        color: "rgba(0, 0, 0, 0.6)", // Color del cuadro por defecto
                        "&.Mui-checked": {
                          color: "blue", // Palomita azul cuando está seleccionado
                        },
                      }}
                    />
                  }
                  label={`**** **** **** ${card.numeroTarjeta.slice(-4)}`} // Mostrar los últimos 4 dígitos de la tarjeta
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
                onClick={() => router.push("/MetodosDePago")} // Redirige a la página principal o a otra página después de cancelar
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
                onClick={handleDeleteCards} // Llama a la función para eliminar las tarjetas seleccionadas
              >
                Eliminar
              </Button>
            </Box>
          </Box>
        </Container>
      </Box>
      {/* Incorporación del Footer */}
      <Footer />
    </>
  );
};

export default EliminarTarjeta;