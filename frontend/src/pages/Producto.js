import React, { useEffect, useState, useContext } from 'react';
import { Typography, Box, Button, TextField, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import NavBar from '../components/navbar/NavBar';
import { useRouter } from 'next/router';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import Footer from "../components/footer/Footer";


const Producto = () => {
  const router = useRouter();
  const { id } = router.query;
  const { user } = useContext(AuthContext);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [comentario, setComentario] = useState('');
  const [comentarios, setComentarios] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [cantidad, setCantidad] = useState(1);
  const [errorCantidad, setErrorCantidad] = useState('');

  // Obtener el producto desde el backend
// Obtener el producto desde el backend
useEffect(() => {
  const fetchProduct = async () => {
    if (!id) {
      // Si el ID no está disponible, no intentes hacer la solicitud
      console.error("El ID del producto no está disponible.");
      return;
    }

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        console.error("No se encontró un token. Por favor, inicia sesión.");
        setLoading(false);
        return;
      }

      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/productos/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setProduct(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error al obtener el producto:", error.response?.data || error.message);
      setLoading(false);
    }
  };

  // Solo ejecuta la función si el ID está disponible
  if (id) {
    fetchProduct();
  }
}, [id]); // Asegúrate de que el efecto se ejecute cuando `id` esté disponible Asegúrate de que el efecto se ejecute cuando `id` esté disponible

  if (loading) {
    return <Typography variant="h4" sx={{ textAlign: "center", mt: 4 }}>Cargando producto...</Typography>;
  }

  if (!product) {
    return <Typography variant="h4" sx={{ textAlign: "center", mt: 4 }}>Producto no encontrado</Typography>;
  }

  // Manejar el envío del comentario
  const handleAddComentario = () => {
    if (comentario.trim() !== '') {
      setComentarios([...comentarios, { texto: comentario, usuario: user.name }]);
      setComentario('');
    }
  };

  // Manejar la eliminación de un comentario
  const handleDeleteComentario = (index) => {
    const nuevosComentarios = comentarios.filter((_, i) => i !== index);
    setComentarios(nuevosComentarios);
  };

  // Manejar la edición de un comentario
  const handleEditComentario = (index) => {
    const comentarioAEditar = comentarios[index];
    setComentario(comentarioAEditar.texto);
    handleDeleteComentario(index);
  };

  // Manejar la acción de añadir al carrito
const handleAddToCart = async () => {
  if (cantidad > product.stockProducto) {
    setErrorCantidad(`La cantidad no puede exceder el stock disponible (${product.stockProducto}).`);
    return;
  }

  try {
    const token = localStorage.getItem("token");
    const userId = user.id;

    if (!token || !userId) {
      alert("No se encontró un token o userId. Por favor, inicia sesión.");
      return;
    }

    // Obtener el carrito del usuario
    let carritoResponse = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/carritos`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    let carritoUsuario = carritoResponse.data.find((carrito) => carrito.user._id === userId);

    // Si no se encuentra un carrito, crearlo
    if (!carritoUsuario) {
      const nuevoCarritoResponse = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/carritos`,
        { user: userId, listaProductos: [] },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      carritoUsuario = nuevoCarritoResponse.data;
    }

    // Verificar si el producto ya está en el carrito
    const productoExistente = carritoUsuario.listaProductos.find(
      (item) => item.producto === product._id
    );

    if (productoExistente) {
      productoExistente.cantidad += cantidad;
    } else {
      carritoUsuario.listaProductos.push({
        producto: product._id,
        cantidad,
      });
    }

    const listaProductosLimpia = carritoUsuario.listaProductos.map((item) => ({
      producto: typeof item.producto === "object" ? item.producto._id : item.producto,
      cantidad: item.cantidad,
    }));

    await axios.put(
      `${process.env.NEXT_PUBLIC_API_URL}/carritos/${carritoUsuario._id}`,
      {
        listaProductos: listaProductosLimpia,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    setDialogOpen(true);
  } catch (error) {
    console.error("Error al añadir el producto al carrito:", error.response?.data || error.message);
    alert("Hubo un problema al añadir el producto al carrito.");
  }
};

  // Manejar el cierre del diálogo
  const handleCloseDialog = () => {
    setDialogOpen(false);
    router.push('/MiCarrito');
  };

  return (
    <>
      <NavBar 
      showSearch={false}
    />
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "flex-start",
          backgroundImage: "url('Fondo_HikariTech.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          pt: 10,
          position: "relative",
        }}
      >
        {/* Botón de regresar */}
        <Button
          variant="contained"
          onClick={() => router.back()}
          sx={{
            position: "absolute",
            top: 20,
            right: 20,
            backgroundColor: "#900",
            color: "#fff",
            "&:hover": { backgroundColor: "#700" },
          }}
        >
          Regresar
        </Button>

        <Box
          sx={{
            width: "100%",
            maxWidth: "1000px",
            backgroundColor: "#f8d7da",
            borderRadius: "10px",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
            overflow: "hidden",
            display: "flex",
            flexDirection: "row",
            p: 4,
          }}
        >
          {/* Imagen del producto */}
          <Box sx={{ flex: 1, textAlign: "center" }}>
            <img
              src={product.imagenProducto[0]}
              alt={product.nombreProducto}
              style={{
                width: "100%",
                height: "auto",
                objectFit: "contain",
                borderRadius: "10px",
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
              }}
            />
            <TextField
              label="Comentarios"
              multiline
              rows={3}
              variant="outlined"
              fullWidth
              value={comentario}
              onChange={(e) => setComentario(e.target.value)}
              sx={{
                mt: 2,
                "& .MuiOutlinedInput-root": {
                  borderRadius: "10px",
                },
              }}
            />
            <Button
              variant="contained"
              onClick={handleAddComentario}
              sx={{
                mt: 2,
                backgroundColor: "#900",
                color: "#fff",
                "&:hover": { backgroundColor: "#700" },
              }}
            >
              Agregar Comentario
            </Button>
            {/* Mostrar comentarios */}
            <Box
              sx={{
                mt: 4,
                p: 2,
                backgroundColor: "#fff",
                border: "1px solid #ccc",
                borderRadius: "10px",
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
              }}
            >
              <Typography
                variant="h6"
                sx={{
                  mb: 2,
                  fontWeight: "bold",
                  color: "#333",
                }}
              >
                Comentarios
              </Typography>
              {comentarios.length > 0 ? (
                comentarios.map((coment, index) => (
                  <Box key={index} sx={{ mb: 2 }}>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      <strong>{coment.usuario}:</strong> {coment.texto}
                    </Typography>
                    {coment.usuario === user.name && (
                      <Box sx={{ display: "flex", gap: 1 }}>
                        <Button
                          variant="text"
                          color="tertiary"
                          onClick={() => handleEditComentario(index)}
                        >
                          Editar
                        </Button>
                        <Button
                          variant="text"
                          color="error"
                          onClick={() => handleDeleteComentario(index)}
                        >
                          Eliminar
                        </Button>
                      </Box>
                    )}
                  </Box>
                ))
              ) : (
                <Typography variant="body2" sx={{ color: "#666" }}>
                  No hay comentarios aún. ¡Sé el primero en comentar!
                </Typography>
              )}
            </Box>
          </Box>

          {/* Información del producto */}
          <Box
            sx={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              pl: 3,
            }}
          >
            <Typography
              variant="h6"
              sx={{
                color: "#000",
                fontWeight: "bold",
                textAlign: "center",
                mb: 2,
              }}
            >
              {product.nombreProducto}
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: "#555",
                fontWeight: "bold",
                textAlign: "center",
                mb: 2,
              }}
            >
              Marca: {product.marcaProducto || "Sin marca"}
            </Typography>
            <Typography
              variant="h5"
              sx={{
                color: "#900",
                fontWeight: "bold",
                textAlign: "center",
                mb: 2,
              }}
            >
              Precio: ${product.precioProducto}
            </Typography>
            <Box
              sx={{
                backgroundColor: "#fff",
                border: "1px solid #ccc",
                borderRadius: "10px",
                padding: "16px",
                mb: 4,
              }}
            >
              <Typography
                variant="body1"
                sx={{
                  textAlign: "justify",
                  lineHeight: 1.6,
                }}
              >
                Descripción: {product.descripcionProducto}
              </Typography>
            </Box>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                mb: 4,
              }}
            >
              <Typography
                variant="body2"
                sx={{
                  mr: 2,
                  fontWeight: "bold",
                  color: "#333",
                }}
              >
                Cantidad que deseas añadir al carrito:
              </Typography>
              <TextField
                type="number"
                variant="outlined"
                size="small"
                sx={{
                  width: "80px",
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "10px",
                  },
                  "& input": {
                    color: "black",
                  },
                }}
                value={cantidad}
                onChange={(e) => setCantidad(Number(e.target.value))}
                inputProps={{ min: 1, max: product.stockProducto }}
              />
            </Box>
            <Typography
              variant="body2"
              sx={{
                textAlign: "center",
                color: "#555",
                mb: 2,
              }}
            >
              Cantidad del producto disponible: <strong>{product.stockProducto}</strong>
            </Typography>
            <Button
              variant="contained"
              onClick={handleAddToCart}
              sx={{
                backgroundColor: "#900",
                color: "#fff",
                fontWeight: "bold",
                borderRadius: "10px",
                mt: 2,
                "&:hover": { backgroundColor: "#700" },
              }}
            >
              Añadir al carrito
            </Button>
          </Box>
        </Box>
      </Box>

      {/* Diálogo de confirmación */}
      <Dialog open={dialogOpen} onClose={handleCloseDialog}>
        <DialogTitle>Producto añadido</DialogTitle>
        <DialogContent>
          <Typography>
            Se han añadido <strong>{cantidad}</strong> unidad(es) de <strong>{product.nombreProducto}</strong> al carrito correctamente.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="red ">
            Cerrar
          </Button>
        </DialogActions>
      </Dialog>
      <Footer />
    </>
  );
};

export default Producto;