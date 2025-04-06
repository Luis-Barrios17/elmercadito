import React, { useState, useEffect } from "react";
import { Container, Box, TextField, Button, Typography, Avatar } from "@mui/material";
import { useRouter } from "next/router";
import axios from "axios";
import NavBar from "../components/navbar/NavBar";
import Footer from "../components/footer/Footer"; // Importar Footer

const EditarPerfil = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();


  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const userId = localStorage.getItem("userId"); // Recupera el userId del localStorage
        if (!userId) {
          throw new Error("No se encontró el ID del usuario en el localStorage.");
        }
  
        const token = localStorage.getItem("token"); // Recupera el token del localStorage
        if (!token) {
          throw new Error("No se encontró el token en el localStorage.");
        }
  
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/users/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`, 
          },
        });
  
        const { name, email } = response.data; // Extrae los datos del perfil
        setName(name);
        setEmail(email);
      } catch (error) {
        console.error("Failed to fetch profile data:", error);
        alert("Hubo un error al cargar los datos del perfil.");
      }
    };
  
    fetchProfile();
  }, []);


  const handleSaveProfile = async (e) => {
    e.preventDefault();
    try {
      const userId = localStorage.getItem("userId"); // Recupera el userId del localStorage
      if (!userId) {
        throw new Error("No se encontró el ID del usuario en el localStorage.");
      }
  
      const token = localStorage.getItem("token"); // Recupera el token del localStorage
      if (!token) {
        throw new Error("No se encontró el token en el localStorage.");
      }
  
      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/users/${userId}`,
        {
          name,
          email, // Solo envía los campos necesarios
        },
        {
          headers: {
            Authorization: `Bearer ${token}`, // Agrega el token en los headers
          },
        }
      );
  
      console.log("Profile saved successfully");
      router.push("/MiPerfil");
    } catch (error) {
      console.log("Failed to update profile", error);
      setError("Hubo un problema al actualizar el perfil. Inténtalo de nuevo.");
    }
  };

  return (
    <>
      <NavBar
        tittle="Editar Perfil"
        showSearch={false}
        showIcons={true}
      />
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "center",
          backgroundImage: "url('Fondo_HikariTech.jpg')",
          pt: 10,
        }}
      >
        <Container maxWidth="xs">
          <Box
            sx={{
              backgroundColor: "rgba(169, 169, 169, 0.5)",
              padding: 6,
              borderRadius: 3,
              boxShadow: 3,
              margin: 3,
              position: "relative",
              width: "100%",
              maxWidth: "500px",
              height: "auto",
              maxHeight: "600px",
            }}
          >
            <Avatar
              alt="Profile Logo"
              src="/Imagen logoPERFIL.png"
              sx={{
                width: 120,
                height: 110,
                position: "absolute",
                top: -75,
                left: "50%",
                transform: "translateX(-50%)",
                boxShadow: 3,
                backgroundColor: "white",
              }}
            />
            <form onSubmit={handleSaveProfile}>
              {error && (
                <Typography variant="body2" color="error" sx={{ mb: 2 }}>
                  {error}
                </Typography>
              )}
              <TextField
                fullWidth
                label="Nombre"
                type="text"
                margin="dense"
                variant="outlined"
                value={name}
                onChange={(e) => setName(e.target.value)}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "10px",
                    backgroundColor: "rgba(255, 255, 255, 0.5)",
                    height: "40px",
                  },
                  "& .MuiOutlinedInput-input": {
                    padding: "8px",
                  },
                }}
              />
              <TextField
                fullWidth
                label="Correo Electrónico"
                type="email"
                margin="dense"
                variant="outlined"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "10px",
                    backgroundColor: "rgba(255, 255, 255, 0.5)",
                    height: "40px",
                  },
                  "& .MuiOutlinedInput-input": {
                    padding: "8px",
                  },
                }}
              />
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "center",
                  gap: 1,
                  mt: 2,
                }}
              >
                <Button
                  type="button"
                  variant="contained"
                  color="secondary"
                  sx={{
                    borderRadius: "8px",
                    padding: "5px 0",
                    fontSize: "0.8rem",
                    maxWidth: "150px",
                    width: "100%",
                  }}
                  onClick={() => router.push("/MiPerfil")}
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  color="secondary"
                  sx={{
                    borderRadius: "8px",
                    padding: "5px 0",
                    fontSize: "0.8rem",
                    maxWidth: "150px",
                    width: "100%",
                  }}
                >
                  Guardar
                </Button>
              </Box>
            </form>
          </Box>
        </Container>
      </Box>
      <Footer /> {/* Agregar el Footer aquí */}
    </>
  );
};

export default EditarPerfil;