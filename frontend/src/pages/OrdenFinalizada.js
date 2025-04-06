import React from "react";
import { Box, Typography, Button } from "@mui/material";
import NavBar from "../components/navbar/NavBar"; // Ajusta esta ruta según sea necesario
import { useRouter } from "next/router"; // Importa el hook para la navegación
import Footer from "../components/footer/Footer";

// Definición del componente principal
const OrdenFinalizada = () => {
  const router = useRouter(); // Hook para redirigir al usuario

  return (
    <>
      {/* NavBar con las propiedades deseadas */}
      <NavBar
         // Ruta de la imagen del logo
        tittle="ORDEN FINALIZADA"
        showSearch={false} // Oculta la barra de búsqueda si no es necesaria
        showIcons={true} // Muestra los íconos (carrito, cuenta)
      />
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative", // Necesario para posicionar el botón en relación a este contenedor
          backgroundImage: "url('Fondo_HikariTech.jpg')",
          backgroundSize: "cover",
        }}
      >
        {/* Caja de texto central */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            bottom: "500px", // Distancia desde la parte inferior
            justifyContent: "center",
            backgroundColor: "rgba(255, 255, 255, 0.36)", // Fondo blanco con transparencia
            padding: "40px",
            borderRadius: "12px",
            boxShadow: "0px 4px 15px rgba(0, 0, 0, 0.34)", // Sombra
            width: "400px", // Ancho de la caja
            height: "300px", // Altura de la caja
            textAlign: "center",
          }}
        >
          <Typography
            variant="h5"
            component="h1"
            sx={{ fontWeight: "bold", color: "#333" }}
          >
            TU ORDEN HA SIDO FINALIZADA CON ÉXITO
          </Typography>
        </Box>

        {/* Botón Regresar */}
        <Button
          variant="contained"
          color="primary"
          onClick={() => router.push("/")} // Redirige al home
          sx={{
            position: "absolute", // Permite posicionar el botón en la esquina
            bottom: "100px", // Distancia desde la parte inferior
            right: "20px", // Distancia desde la parte derecha
            padding: "10px 20px", // Tamaño del botón
            fontSize: "1rem", // Tamaño del texto
            backgroundColor: "rgb(131, 6, 6)", // Color de fondo del botón (puedes personalizarlo)
            color: "white", // Color del texto
            borderRadius: "8px", // Bordes redondeados
            boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.3)", // Sombra del botón
            "&:hover": {
              backgroundColor: "rgb(71, 4, 4)", // Color al pasar el cursor
            },
          }}
        >
          Regresar
        </Button>
      </Box>
      {/* Footer de la aplicación */}
      <Footer/>
    </>
  );
};

export default OrdenFinalizada;
