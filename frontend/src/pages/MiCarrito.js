import React, { useEffect, useState } from "react";
import { Container, Box, Typography, TextField, Button } from "@mui/material";
import NavBar from "../components/navbar/NavBar";
import { useRouter } from "next/router";
import axios from "axios";
import Footer from "../components/footer/Footer";

const MiCarrito = () => {
  const router = useRouter();
  const [productos, setProductos] = useState([]); // Estado para almacenar los productos del carrito
  const [carritoId, setCarritoId] = useState(null); // Estado para almacenar el ID del carrito
  const [loading, setLoading] = useState(true); // Estado para manejar la carga
  const [error, setError] = useState(""); // Estado para manejar errores

  // Calcular el precio total
  const totalPrice = productos.reduce((acumulador, producto) => {
    if (producto.producto && producto.producto.precioProducto) {
      return acumulador + producto.producto.precioProducto * producto.cantidad;
    }
    return acumulador; // Si no es válido, no suma nada
  }, 0);

  // Obtener el carrito del usuario autenticado desde el backend
  const fetchCarrito = async () => {
    setLoading(true); // Activa el estado de carga
    setError(""); // Reinicia el estado de error

    try {
      const token = localStorage.getItem("token"); // Recupera el token del localStorage
      const userId = localStorage.getItem("userId"); // Recupera el userId del localStorage
      console.log("Token111:", token);
      if (!token || !userId) {
        setError("No se encontró un token o userId. Por favor, inicia sesión para continuar.");
        setLoading(false); // Finaliza la carga
        return;
      }

      // Solicitar todos los carritos al backend
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/carritos`, {
        headers: {
          Authorization: `Bearer ${token}`, // Enviar el token del usuario
        },
      });

      // Filtrar los datos del carrito por el userId
      const carritoUsuario = response.data.filter((carrito) => carrito.user._id === userId);

      if (carritoUsuario.length > 0) {
        setCarritoId(carritoUsuario[0]._id); // Guardar el ID del carrito en el estado
        setProductos(carritoUsuario[0].listaProductos || []); // Guardar los productos del carrito en el estado
      } else {
        setCarritoId(null); // Si no hay carrito, establecer el ID como null
        setProductos([]); // Si no hay carrito para el usuario, establecer productos como vacío
      }
    } catch (error) {
      console.error("Error al obtener el carrito:", error);
      setError("Hubo un error al obtener el carrito. Inténtalo nuevamente.");
    } finally {
      setLoading(false); // Finaliza la carga
    }
  };

  useEffect(() => {
    fetchCarrito(); // Llama a la función para obtener el carrito al cargar el componente
  }, []);

  // Función para editar la cantidad de un producto
  const handleEditCantidad = async (productoId, nuevaCantidad) => {
    if (nuevaCantidad < 1) {
      alert("La cantidad no puede ser menor a 1.");
      return;
    }
  
    const producto = productos.find((p) => p.producto._id === productoId);
    if (nuevaCantidad > producto.producto.stockProducto) {
      alert(`La cantidad no puede exceder el stock disponible (${producto.producto.stockProducto}).`);
      return;
    }
  
    try {
      const token = localStorage.getItem("token");
  
      // Actualizar la cantidad en el estado local
      const carritoActualizado = productos.map((p) =>
        p.producto._id === productoId
          ? { ...p, cantidad: nuevaCantidad } // Mantener toda la información del producto y actualizar solo la cantidad
          : p
      );
  
      // Preparar los datos para enviar al backend
      const listaProductos = carritoActualizado.map((p) => ({
        producto: p.producto._id, // Solo el ID del producto
        cantidad: p.cantidad, // Cantidad del producto
      }));
  
      console.log("Datos enviados al backend:", {
        listaProductos,
      });
  
      // Actualizar el carrito en el backend
      await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/carritos/${carritoId}`,
        { listaProductos },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      setProductos(carritoActualizado); // Actualizar el estado local
      alert("Cantidad actualizada correctamente.");
    } catch (error) {
      console.error("Error al actualizar la cantidad:", error.response?.data || error.message);
      alert(`Error al actualizar la cantidad: ${error.response?.data?.message || error.message}`);
    }
  };

  // Función para eliminar un producto del carrito
  const handleEliminarProducto = async (productoId) => {
    try {
      const token = localStorage.getItem("token");
  
      // Filtrar el producto eliminado y mantener toda la información de los productos restantes
      const carritoActualizado = productos.filter((p) => p.producto._id !== productoId);
  
      // Preparar los datos para enviar al backend
      const listaProductos = carritoActualizado.map((p) => ({
        producto: p.producto._id, // Solo el ID del producto
        cantidad: p.cantidad, // Cantidad del producto
      }));
  
      console.log("Datos enviados al backend (eliminar):", {
        listaProductos,
      });
  
      // Actualizar el carrito en el backend
      await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/carritos/${carritoId}`,
        { listaProductos },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      setProductos(carritoActualizado); // Actualizar el estado local con los productos restantes
      alert("Producto eliminado correctamente.");
    } catch (error) {
      console.error("Error al eliminar el producto:", error.response?.data || error.message);
      alert(`Error al eliminar el producto: ${error.response?.data?.message || error.message}`);
    }
  };
  
  if (loading) {
    return <Typography variant="h4" sx={{ textAlign: "center", mt: 4 }}>Cargando carrito...</Typography>;
  }

  return (
    <>
      <NavBar
        
        tittle="Mi Carrito"
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
        <Container
          maxWidth="sm"
          sx={{
            backgroundColor: "rgba(255, 255, 255, 0.16)",
            padding: 3,
            borderRadius: 3,
            width: "100%",
          }}
        >
          {error ? (
            <Typography variant="h6" sx={{ textAlign: "center", color: "red", mb: 2 }}>
              {error}
            </Typography>
          ) : productos.length > 0 ? (
            productos.map((producto) => (
              producto.producto && (
                <Box
                  key={producto.producto._id}
                  sx={{
                    mb: 2,
                    padding: 2,
                    backgroundColor: "rgba(255, 255, 255, 0.9)",
                    borderRadius: 2,
                    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
                    display: "flex",
                    alignItems: "center",
                    gap: 2,
                  }}
                >
                  <img
                    src={
                      producto.producto.imagenProducto &&
                      producto.producto.imagenProducto.length > 0
                        ? producto.producto.imagenProducto[0]
                        : "ruta/imagen_por_defecto.jpg"
                    }
                    alt={producto.producto.nombreProducto || "Producto sin nombre"}
                    style={{
                      width: "80px",
                      height: "80px",
                      objectFit: "contain",
                      borderRadius: "8px",
                      boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
                    }}
                  />

                  <Box sx={{ flex: 1 }}>
                    <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                      {producto.producto.nombreProducto}
                    </Typography>
                    <Typography variant="body1">
                      Precio: ${producto.producto.precioProducto}
                    </Typography>
                    <Typography variant="body2">
                      Cantidad: {producto.cantidad}
                    </Typography>
                  </Box>

                  {/* Botón para editar la cantidad */}
                  <TextField
                    type="number"
                    value={producto.cantidad}
                    onChange={(e) => handleEditCantidad(producto.producto._id, parseInt(e.target.value))}
                    inputProps={{
                      min: 1,
                      max: producto.producto.stockProducto, // Limitar al stock disponible
                    }}
                    sx={{
                      width: "80px",
                      marginRight: "10px",
                    }}
                  />

                  {/* Botón para eliminar el producto */}
                  <Button
                    variant="contained"
                    color="error"
                    onClick={() => handleEliminarProducto(producto.producto._id)}
                    sx={{
                      padding: "5px 10px",
                      fontSize: "0.8rem",
                      backgroundColor: "rgb(131, 6, 6)",
                      "&:hover": {
                        backgroundColor: "rgb(71, 4, 4)",
                      },
                    }}
                  >
                    Eliminar
                  </Button>
                </Box>
              )
            ))
          ) : (
            <Typography variant="h6" sx={{ textAlign: "center", mt: 4 }}>
              El carrito está vacío.
            </Typography>
          )}
        </Container>

        {/* Contenedor para el título "Total" y el botón "Pagar Productos" */}
        <Box
          sx={{
            position: "absolute", // Mantener el posicionamiento absoluto
            bottom: "60px", // Alinear con el borde inferior
            right: "60px", // Mantener en la esquina inferior derecha
            display: "flex",
            flexDirection: "column", // Alinear los elementos verticalmente
            alignItems: "flex-end", // Alinear los elementos al final (derecha)
            gap: "15px", // Espaciado entre los elementos
          }}
        >
          {/* Título "Total" */}
          <Typography
            variant="h6"
            sx={{
              fontWeight: "bold",
              color: "black",
            }}
          >
            Total
          </Typography>

          {/* Campo de total */}
          <TextField
            value={productos.length > 0 ? `$${totalPrice.toFixed(2)}` : "TOTAL"}
            InputProps={{
              readOnly: true,
            }}
            variant="outlined"
            fullWidth={false}
            sx={{
              backgroundColor: "rgba(255, 255, 255, 0.9)",
              borderRadius: "8px",
              width: "150px",
              textAlign: "center",
            }}
          />

          {/* Botón "Pagar Productos" */}
          <Button
            variant="contained"
            color="primary"
            onClick={() => router.push("/OrdenDeCompra")}
            sx={{
              padding: "10px 30px",
              fontSize: "1rem",
              backgroundColor: "rgb(3, 46, 63)",
              color: "white",
              borderRadius: "8px",
              boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.3)",
              "&:hover": {
                backgroundColor: "rgb(3, 35, 48)",
              },
            }}
          >
            Pagar Productos
          </Button>
        </Box>

        {/* Botón "Regresar" */}
        <Button
          variant="contained"
          color="secondary"
          onClick={() => router.push("/")}
          sx={{
            position: "absolute",
            bottom: "60px",
            left: "60px", // Mantener en la esquina inferior izquierda
            padding: "10px 40px",
            fontSize: "1rem",
            backgroundColor: "rgb(131, 6, 6)",
            color: "white",
            borderRadius: "8px",
            boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.3)",
            "&:hover": {
              backgroundColor: "rgb(71, 4, 4)",
            },
          }}
        >
          Regresar
        </Button>
      </Box>
      <Footer />
    </>
  );
};

export default MiCarrito;