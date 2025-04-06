import { useState, useContext } from 'react';
import { Box, Container, TextField, Button, Typography, InputAdornment, Avatar, Alert } from '@mui/material';
import { useRouter } from 'next/router';
import PersonIcon from '@mui/icons-material/Person';
import LockIcon from '@mui/icons-material/Lock';
import { AuthContext } from '../../context/AuthContext';
import Image from 'next/image'; // Importa el componente Image de Next.js

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null); // Estado para manejar errores
  const [loading, setLoading] = useState(false); // Para manejar el estado de carga
  const router = useRouter();
  const { login } = useContext(AuthContext);

  const validateEmail = (email) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.toLowerCase());

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null); // Limpiar errores anteriores
    setLoading(true);

    // Validación del formulario
    if (!email || !password) {
      setError('El correo electrónico y la contraseña son obligatorios');
      setLoading(false);
      return;
    } else if (!validateEmail(email)) {
      setError('El correo electrónico no es válido');
      setLoading(false);
      return;
    }

    try {
      // Solicitud al backend para autenticar al usuario
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      if (!response.ok) {
        throw new Error('Correo electrónico o contraseña inválidos');
      }

      const data = await response.json();

      // Guardamos el token y refreshToken en las cookies
      document.cookie = `token=${data.token}; path=/`;
      document.cookie = `refreshToken=${data.refreshToken}; path=/`;

      // Llamamos a la función login del contexto para guardar el token
      login(data.token);

      // Redirigimos al usuario a la página principal
      router.push('/');
    } catch (error) {
      setError(error.message || 'Ocurrió un error. Por favor, intente de nuevo');
      console.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center',
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
            display: 'block',
            margin: '0 auto',
            marginLeft: '-95px',
            marginTop: '-80px',
            marginBottom: '10px',
            borderRadius: '16px',
            backgroundColor: 'rgba(169, 169, 169, 0.5)',
          }}
        />

        <Box
          sx={{
            backgroundColor: 'rgba(169, 169, 169, 0.5)',
            padding: 4,
            borderRadius: 3,
            boxShadow: 3,
            margin: 3,
            position: 'relative',
          }}
        >
          <Avatar
            alt="Profile Logo"
            src="/Imagen logoPERFIL.png"
            sx={{
              width: 120,
              height: 110,
              position: 'absolute',
              top: -40,
              left: '50%',
              transform: 'translateX(-50%)',
              boxShadow: 3,
              backgroundColor: 'white',
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
            Iniciar Sesión
          </Typography>

          {/* Mostrar mensaje de error si existe */}
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <form onSubmit={handleLogin}>
            <TextField
              fullWidth
              placeholder="Correo Electrónico"
              type="email"
              margin="normal"
              variant="outlined"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PersonIcon sx={{ color: 'rgba(0, 0, 0, 0.7)' }} />
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '10px',
                  backgroundColor: 'rgba(255, 255, 255, 0.5)',
                  height: '40px',
                  gap: 0.5,
                },
                '& .MuiOutlinedInput-input': {
                  padding: '8px',
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
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockIcon sx={{ color: 'rgba(0, 0, 0, 0.7)' }} />
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '10px',
                  backgroundColor: 'rgba(255, 255, 255, 0.5)',
                  height: '40px',
                },
                '& .MuiOutlinedInput-input': {
                  padding: '8px',
                },
              }}
            />
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 1,
                mt: 2,
              }}
            >
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="secondary"
                sx={{
                  borderRadius: '8px',
                  padding: '5px 0',
                  fontSize: '0.8rem',
                  maxWidth: '200px',
                  width: '100%',
                }}
              >
                Iniciar Sesión
              </Button>
              <Button
                fullWidth
                variant="contained"
                color="secondary"
                sx={{
                  borderRadius: '8px',
                  padding: '5px 0',
                  fontSize: '0.8rem',
                  maxWidth: '200px',
                  width: '100%',
                }}
                onClick={() => router.push('/auth/register')}
              >
                Crear Cuenta
              </Button>
              {/* Botón para ir al Home */}
              <Button
                fullWidth
                variant="contained"
                color="primary"
                sx={{
                  borderRadius: '8px',
                  padding: '5px 0',
                  fontSize: '0.8rem',
                  maxWidth: '200px',
                  width: '100%',
                }}
                onClick={() => router.push('/')}
              >
                Ir al Home
              </Button>
            </Box>
          </form>
        </Box>
      </Container>
    </Box>
  );
};

export default LoginForm;