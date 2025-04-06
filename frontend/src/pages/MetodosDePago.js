import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import {
  Box,
  Button,
  Container,
  Typography,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import NavBar from "../components/navbar/NavBar";
import Footer from "../components/footer/Footer";


const MetodosDePago = () => {
  const router = useRouter();
  const [tarjetas, setTarjetas] = useState([]); // Estado para almacenar las tarjetas
  const [loading, setLoading] = useState(false); // Estado para mostrar el mensaje de carga
  const [error, setError] = useState(""); // Estado para manejar errores o advertencias
  const [openModal, setOpenModal] = useState(false); // Estado para controlar el modal
  const [selectedCard, setSelectedCard] = useState(null); // Tarjeta seleccionada para mostrar detalles

  const fetchMetodosDePago = async () => {
    setLoading(true); // Activa el estado de carga
    setError(""); // Reinicia el estado de error
    try {
      const token = localStorage.getItem("token");
      const userId = localStorage.getItem("userId"); // Recupera el userId del localStorage

      if (!token || !userId) {
        setError("No se encontró un token o userId. Por favor, inicia sesión para continuar.");
        setLoading(false); // Finaliza la carga
        return;
      }

      // Usa la variable de entorno para la URL de la API
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/cards`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("Tarjetas obtenidas del backend:", response.data);
      const userCards = response.data.filter((card) => card.user === userId);

      if (userCards.length === 0) {
        setError("No tienes tarjetas guardadas. Por favor, agrega una tarjeta.");
      }

      setTarjetas(userCards); // Actualiza el estado con las tarjetas filtradas
    } catch (error) {
      console.error("Error al obtener las tarjetas:", error);
      setError("Hubo un error al obtener las tarjetas. Inténtalo nuevamente.");
    } finally {
      setLoading(false); // Finaliza la carga
    }
  };

  useEffect(() => {
    fetchMetodosDePago(); // Llama a la función para obtener las tarjetas al cargar el componente
  }, []);

  const handleEditCard = (cardId) => {
    // Redirige correctamente a la página EditarTarjeta
    router.push(`/EditarTarjeta?id=${cardId}`);
  };

  const handleViewCardDetails = (card) => {
    setSelectedCard(card); // Establece la tarjeta seleccionada
    setOpenModal(true); // Abre el modal
  };

  const handleCloseModal = () => {
    setOpenModal(false); // Cierra el modal
    setSelectedCard(null); // Limpia la tarjeta seleccionada
  };

  return (
    <>
      <NavBar
        tittle="Metodos de pago"
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
        <Container maxWidth="xs">
          <form>
            {loading ? (
              <Typography variant="h6" textAlign="center" sx={{ color: "black" }}>
                Cargando...
              </Typography>
            ) : error ? (
              <Alert severity="warning" sx={{ mb: 2 }}>
                {error}
              </Alert>
            ) : tarjetas.length === 0 ? (
              <Typography variant="h6" textAlign="center" sx={{ color: "black" }}>
                No tienes tarjetas guardadas.
              </Typography>
            ) : (
              tarjetas.map((tarjeta, index) => (
                <Box
                  key={index}
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    backgroundColor: tarjeta.isDefault
                      ? "rgba(0, 255, 0, 0.3)" // Resalta la tarjeta predeterminada
                      : "rgba(255, 255, 255, 0.5)",
                    padding: 2,
                    borderRadius: 2,
                    marginBottom: 2,
                  }}
                >
                  <Typography variant="body1">
                    Tarjeta {index + 1}: **** **** **** {tarjeta.numeroTarjeta ? tarjeta.numeroTarjeta.slice(-4) : "N/A"}
                  </Typography>
                  <Box>
                    <Button
                      variant="outlined"
                      sx={{ backgroundColor: "rgb(3, 46, 63)", color: "white", marginRight: 1 }}
                      onClick={() => handleViewCardDetails(tarjeta)} // Abre el modal con los detalles
                    >
                      Ver Detalles
                    </Button>
                    <Button
                      variant="outlined"
                      sx={{ backgroundColor: "rgb(3, 46, 63)", color: "white" }}
                      onClick={() => handleEditCard(tarjeta._id)} // Redirige al editar tarjeta
                    >
                      Editar
                    </Button>
                  </Box>
                </Box>
              ))
            )}
            {/* Botones de acción */}
            <Box sx={{ display: "flex", justifyContent: "center", gap: 1, mt: 2 }}>
              <Button
                variant="contained"
                sx={{
                  borderRadius: "8px",
                  backgroundColor: "rgb(3, 46, 63)",
                  width: "100%",
                  color: "white",
                }}
                onClick={() => router.push("/AgregarTarjeta")}
              >
                Agregar
              </Button>
              <Button
                variant="contained"
                sx={{
                  borderRadius: "8px",
                  backgroundColor: "rgb(3, 46, 63)",
                  width: "100%",
                  color: "white",
                }}
                onClick={() => router.push("/EliminarTarjeta")}
              >
                Eliminar
              </Button>
            </Box>

            <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
              <Button
                variant="contained"
                sx={{
                  borderRadius: "8px",
                  backgroundColor: "rgb(3, 46, 63)",
                  width: "100%",
                  color: "white",
                }}
                onClick={() => router.push("/MiPerfil")}
              >
                Regresar
              </Button>
            </Box>
          </form>
        </Container>
      </Box>

      {/* Modal para mostrar los detalles de la tarjeta */}
      <Dialog open={openModal} onClose={handleCloseModal}>
        <DialogTitle>Detalles de la Tarjeta</DialogTitle>
        <DialogContent>
          {selectedCard && (
            <>
              <Typography variant="body1">
                Número de Tarjeta: **** **** **** {selectedCard.numeroTarjeta.slice(-4)}
              </Typography>
              <Typography variant="body1">Propietario: {selectedCard.Propietario}</Typography>
              <Typography variant="body1">Fecha de Expiración: {selectedCard.FechaExpiracion}</Typography>
              <Typography variant="body1">Predeterminada: {selectedCard.isDefault ? "Sí" : "No"}</Typography>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal} sx={{ color: "rgb(3, 46, 63)" }}>
            Cerrar
          </Button>
        </DialogActions>
      </Dialog>
      <Footer/>
    </>
    
  );
};

export default MetodosDePago;