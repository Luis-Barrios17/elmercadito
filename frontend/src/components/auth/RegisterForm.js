import { useState } from "react";
import { Box, Container, TextField, Button, Typography, InputAdornment, Avatar, CircularProgress } from "@mui/material";
import { useRouter } from "next/router";
import PersonIcon from "@mui/icons-material/Person";
import LockIcon from "@mui/icons-material/Lock";
import Image from "next/image"; // Importa el componente Image de Next.js

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [generalError, setGeneralError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.toLowerCase());

  const handleRegister = async (e) => {
    e.preventDefault();
    let validationErrors = {};

    if (!name) validationErrors.name = "El nombre es requerido";
    if (!email) {
      validationErrors.email = "El correo es requerido";
    } else if (!validateEmail(email)) {
      validationErrors.email = "El correo no es válido";
    }
    if (!password) {
      validationErrors.password = "La contraseña es requerida";
    }

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      setLoading(true);
      setGeneralError(""); // Limpiar cualquier error previo

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          password,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setGeneralError(
          errorData.message ||
            "Error al registrar el usuario. Por favor, intente de nuevo."
        );
        return;
      }

      router.push("/auth/login"); // Redirigir al login si el registro es exitoso
    } catch (error) {
      console.error("Error al registrar el usuario:", error.message);
      setGeneralError("Error al registrar el usuario. Por favor, intente de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "center",
        backgroundImage: "url('/Fondo_HikariTech.jpg')",
        pt: 10,
      }}
    >
      <Container maxWidth="xs">
        {/* Imagen centrada en la parte superior */}
        <Image
          src="/hikariTechnegracortada.png"
          alt="HikariTech Store Logo"
          width={600} // Define el ancho de la imagen
          height={200} // Define la altura de la imagen
          style={{
            display: "block",
            margin: "0 auto",
            marginLeft: "-95px",
            marginTop: "-80px",
            marginBottom: "10px",
            borderRadius: "16px",
            backgroundColor: "rgba(169, 169, 169, 0.5)",
          }}
        />
        <Box
          sx={{
            backgroundColor: "rgba(169, 169, 169, 0.5)",
            padding: 4,
            borderRadius: 3,
            boxShadow: 3,
            margin: 3,
            position: "relative",
          }}
        >
          <Avatar
            alt="Profile Logo"
            src="/Imagen logoPERFIL.png"
            sx={{
              width: 120,
              height: 110,
              position: "absolute",
              top: -40,
              left: "50%",
              transform: "translateX(-50%)",
              boxShadow: 3,
              backgroundColor: "white",
            }}
          />
          <Typography
            variant="h4"
            gutterBottom
            textAlign="center"
            fontWeight="bold"
            color="primary"
            sx={{ mt: 5 }}
          >
            REGISTRO
          </Typography>

          {generalError && (
            <Typography color="error" textAlign="center" sx={{ mb: 2 }}>
              {generalError}
            </Typography>
          )}

          <form onSubmit={handleRegister}>
            <TextField
              fullWidth
              placeholder="Nombre"
              type="text"
              margin="dense"
              variant="outlined"
              value={name}
              onChange={(e) => setName(e.target.value)}
              error={!!errors.name}
              helperText={errors.name}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PersonIcon sx={{ color: "rgba(0, 0, 0, 0.7)" }} />
                  </InputAdornment>
                ),
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "10px",
                  backgroundColor: "rgba(255, 255, 255, 0.5)",
                  height: "40px",
                  gap: 0.5,
                },
                "& .MuiOutlinedInput-input": {
                  padding: "8px",
                },
              }}
            />
            <TextField
              fullWidth
              placeholder="Correo Electrónico"
              type="email"
              margin="normal"
              variant="outlined"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={!!errors.email}
              helperText={errors.email}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockIcon sx={{ color: "rgba(0, 0, 0, 0.7)" }} />
                  </InputAdornment>
                ),
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "10px",
                  backgroundColor: "rgba(255, 255, 255, 0.5)",
                  height: "40px",
                  gap: 0.5,
                },
                "& .MuiOutlinedInput-input": {
                  padding: "8px",
                },
              }}
            />
            <TextField
              fullWidth
              placeholder="Contraseña"
              type="password"
              margin="dense"
              variant="outlined"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={!!errors.password}
              helperText={errors.password}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockIcon sx={{ color: "rgba(0, 0, 0, 0.7)" }} />
                  </InputAdornment>
                ),
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "10px",
                  backgroundColor: "rgba(255, 255, 255, 0.5)",
                  height: "40px",
                  gap: 0.5,
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
                justifyContent: "space-between",
                gap: 2,
                mt: 2,
              }}
            >
              <Button
                type="button"
                variant="contained"
                color="secondary"
                sx={{
                  borderRadius: "8px",
                  padding: "10px 0",
                  fontSize: "0.8rem",
                  maxWidth: "150px",
                  width: "100%",
                }}
                onClick={() => router.push("/auth/login")}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                variant="contained"
                color="secondary"
                disabled={loading}
                sx={{
                  borderRadius: "8px",
                  padding: "10px 0",
                  fontSize: "0.8rem",
                  maxWidth: "150px",
                  width: "100%",
                }}
              >
                {loading ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  "Registrarse"
                )}
              </Button>
            </Box>
          </form>
        </Box>
      </Container>
    </Box>
  );
};

export default Register;