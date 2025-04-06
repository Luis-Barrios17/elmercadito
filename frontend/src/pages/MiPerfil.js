import React, { useContext, useEffect } from "react";
import { Container, Box, Typography, Avatar, Button } from "@mui/material";
import { useRouter } from "next/router";
import NavBar from "../components/navbar/NavBar";
import { AuthContext } from "../context/AuthContext";
import Footer from "../components/footer/Footer";


const MiPerfil = () => {
  const { user} = useContext(AuthContext);
  const router = useRouter();

 
  return (
    <>
      {/* Incorporación del NavBar */}
      <NavBar
        tittle="Mi Perfil"
        showSearch={false}
        showIcons={true}
      />

      {/* Contenido principal */}
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "flex-start",
          backgroundImage: "url('Fondo_HikariTech.jpg')",
          flexDirection: "column",
          paddingTop: 4,
          paddingLeft: 4,
        }}
      >
        <Container
          maxWidth="sm"
          sx={{
            backgroundColor: "rgba(255, 255, 255, 0.34)",
            padding: 3,
            borderRadius: 3,
            width: "500px",
            height: "300px",
            marginLeft: 20,
            marginTop: 19,
          }}
        >
          <Box display="flex" justifyContent="center" mb={2}>
            <Avatar
              alt="Imagen de perfil"
              src={user?.avatar || "/Imagen logoPERFIL.png"} // Usa el avatar del usuario si está disponible
              sx={{ width: 160, height: 160, marginTop: -13 }}
            />
          </Box>
          <Box display="flex" flexDirection="column" alignItems="flex-start">
            {/* Información del perfil */}
            <Box
              sx={{
                mb: 1,
                padding: 2,
                backgroundColor: "rgba(255, 255, 255, 0.42)",
                borderRadius: 2,
                width: "100%",
              }}
            >
              <Typography variant="h6">Nombre: {user?.name || "Sin nombre registrado"}</Typography>
            </Box>
            <Box
              sx={{
                mb: 1,
                padding: 2,
                backgroundColor: "rgba(255, 255, 255, 0.42)",
                borderRadius: 2,
                width: "100%",
              }}
            >
              <Typography variant="h6">Correo electrónico: {user?.email || "Sin correo registrado"}</Typography>
            </Box>
          </Box>
        </Container>

        {/* Contenedor independiente para botones */}
        <Container
          maxWidth="sm"
          sx={{
            backgroundColor: "rgba(255, 255, 255, 0)",
            padding: 3,
            paddingTop: 0,
            borderRadius: 3,
            width: "250px",
            height: "300px",
            marginRight: 40,
            marginTop: -45,
          }}
        >
          <Box display="flex" flexDirection="column" alignItems="flex-start">
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="secondary"
              sx={{
                marginTop: 38,
                borderRadius: "8px",
                padding: "12px 0",
                fontSize: "0.9rem",
                maxWidth: "200px",
                width: "130%",
              }}
              onClick={() => router.push("/historialCompras")}
            >
              Historial de compras
            </Button>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="secondary"
              sx={{
                marginTop: -15,
                borderRadius: "8px",
                padding: "12px 0",
                fontSize: "0.9rem",
                maxWidth: "200px",
                width: "130%",
              }}
              onClick={() => router.push("/Direcciones")}
            >
              Direcciones
            </Button>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="secondary"
              sx={{
                marginTop: -15,
                borderRadius: "8px",
                padding: "12px 0",
                fontSize: "0.9rem",
                maxWidth: "200px",
                width: "130%",
              }}
              onClick={() => router.push("/MetodosDePago")}
            >
              Métodos de pago
            </Button>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="secondary"
              sx={{
                marginTop: -15,
                borderRadius: "8px",
                padding: "12px 0",
                fontSize: "0.9rem",
                maxWidth: "200px",
                width: "130%",
              }}
              onClick={() => router.push("/EditarPerfil")}
            >
              Editar perfil
            </Button>
          </Box>
        </Container>
      </Box>
      <Footer />
    </>
  );
};

export default MiPerfil;