import React, { useState, useEffect } from "react";
import { Box, Typography, Button, Select, MenuItem } from "@mui/material";
import NavBar from "../components/navbar/NavBar";
import { useRouter } from "next/router";
import axios from "axios";
import Footer from "../components/footer/Footer";

const OrdenDeCompra = () => {
  const router = useRouter();
  const [carrito, setCarrito] = useState([]);
  const [direccion, setDireccion] = useState("");
  const [tarjeta, setTarjeta] = useState("");
  const [precioTotal, setPrecioTotal] = useState(0);
  const [direcciones, setDirecciones] = useState([]); // Lista de direcciones
  const [tarjetas, setTarjetas] = useState([]); // Lista de tarjetas
  const [carritoId, setCarritoId] = useState(""); // Nuevo estado para almacenar el ID del carrito
  
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const userId = localStorage.getItem("userId");
  
        if (!token || !userId) {
          alert("Por favor, inicia sesión para continuar.");
          router.push("/auth/login");
          return;
        }
  
        // Obtener el carrito del usuario
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/carritos`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
  
        const carritoUsuario = response.data.find((carrito) => carrito.user._id === userId);
  
        if (!carritoUsuario) {
          alert("No se encontró un carrito para este usuario.");
          router.push("/MiCarrito");
          return;
        }
  
        setCarrito(carritoUsuario.listaProductos);
        setCarritoId(carritoUsuario._id); // Guardar el ID del carrito
        setPrecioTotal(
          carritoUsuario.listaProductos.reduce((total, item) => {
            const precioProducto = item.producto?.precioProducto || 0;
            return total + precioProducto * item.cantidad;
          }, 0)
        );
  
        // Obtener todas las direcciones
        const direccionResponse = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/directions`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
  
        const direccionesUsuario = direccionResponse.data.filter((dir) => dir.usuario === userId);
        setDirecciones(direccionesUsuario);
  
        const direccionPredeterminada = direccionesUsuario.find((dir) => dir.isDefault);
        setDireccion(direccionPredeterminada || direccionesUsuario[0] || "");
  
        // Obtener todas las tarjetas
        const tarjetaResponse = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/cards`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
  
        const tarjetasUsuario = tarjetaResponse.data.filter((card) => card.user === userId);
        setTarjetas(tarjetasUsuario);
  
        const tarjetaPredeterminada = tarjetasUsuario.find((card) => card.isDefault);
        setTarjeta(tarjetaPredeterminada || tarjetasUsuario[0] || "");
      } catch (error) {
        console.error("Error al obtener los datos:", error.response?.data || error.message);
        alert("Hubo un problema al cargar los datos.");
      }
    };
  
    fetchData();
  }, [router]);
  
  const handleFinalizarPedido = async () => {
    try {
      const token = localStorage.getItem("token");
      const userId = localStorage.getItem("userId");
  
      if (!token || !userId) {
        alert("Por favor, inicia sesión para continuar.");
        router.push("/auth/login");
        return;
      }
  
      // Crear la orden de compra en el backend
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/orders`,
        {
          Usuario: userId,
          card: tarjeta._id,
          Direccion: direccion._id,
          items: carrito.map((item) => ({
            Producto: item.producto._id,
            Cantidad: item.cantidad,
            Precio: item.producto.precioProducto,
          })),
          total: precioTotal,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      alert("¡Pedido finalizado con éxito!");
      router.push("/OrdenFinalizada");
  
      // Vaciar el carrito después de finalizar el pedido
      if (carritoId) {
        await axios.put(
          `${process.env.NEXT_PUBLIC_API_URL}/carritos/${carritoId}`,
          { listaProductos: [] },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      } else {
        console.error("No se encontró el ID del carrito.");
      }
    } catch (error) {
      // Manejo de errores
      if (error.response && error.response.status === 400) {
        // Error relacionado con el stock insuficiente
        alert(error.response.data.message || "Hubo un problema con el stock de los productos.");
      } else if (error.response && error.response.status === 404) {
        // Error relacionado con productos no encontrados
        alert(error.response.data.message || "Uno o más productos no se encontraron.");
      } else {
        // Otros errores
        console.error("Error al finalizar el pedido:", error.response?.data || error.message);
        alert("Hubo un problema al finalizar el pedido. Inténtalo nuevamente.");
      }
    }
  };

  return (
    <>
      <NavBar
        tittle="ORDEN DE COMPRA"
        showSearch={false}
        showIcons={true}
      />
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundImage: "url('Fondo_HikariTech.jpg')",
          backgroundSize: "cover",
          padding: "20px",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 2,
            backgroundColor: "rgba(255, 255, 255, 0.36)",
            padding: "40px",
            borderRadius: "12px",
            boxShadow: "0px 4px 15px rgba(0, 0, 0, 0.34)",
            width: "100%",
            justifyContent: "flex-start",
            maxWidth: "700px",
            textAlign: "center",
          }}
        >
          {/* Selección de dirección */}
          <Box
            sx={{
              width: "100%",
              maxWidth: "700px",
              height: "auto",
              backgroundColor: "rgba(255, 255, 255, 0.6)",
              borderRadius: "12px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              boxShadow: "0px 4px 15px rgba(0, 0, 0, 0.3)",
              padding: "15px",
              marginBottom: "20px",
            }}
          >
            <Typography variant="h6" sx={{ marginRight: "10px", fontWeight: "bold" }}>
              Dirección:
            </Typography>
            {direcciones.length > 0 ? (
              <Select
                value={direccion._id || ""}
                onChange={(e) => setDireccion(direcciones.find((dir) => dir._id === e.target.value))}
                sx={{
                  width: "100%",
                  maxWidth: "500px",
                  backgroundColor: "white",
                  borderRadius: "8px",
                  padding: "5px",
                }}
              >
                {direcciones.map((dir) => (
                  <MenuItem key={dir._id} value={dir._id}>
                    {dir.calle}, {dir.colonia}, {dir.estado}, CP: {dir.codigopostal}
                  </MenuItem>
                ))}
              </Select>
            ) : (
              <Typography variant="body2" sx={{ marginLeft: "10px" }}>
                No hay direcciones disponibles.
              </Typography>
            )}
          </Box>

          {/* Selección de tarjeta */}
        {/* Selección de tarjeta */}
<Box
  sx={{
    width: "100%",
    maxWidth: "700px",
    height: "auto",
    backgroundColor: "rgba(255, 255, 255, 0.6)",
    borderRadius: "12px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    boxShadow: "0px 4px 15px rgba(0, 0, 0, 0.3)",
    padding: "15px",
    marginBottom: "20px",
  }}
>
  <Typography variant="h6" sx={{ marginRight: "10px", fontWeight: "bold" }}>
    Tarjeta:
  </Typography>
  {tarjetas.length > 0 ? (
    <Select
      value={tarjeta._id || ""}
      onChange={(e) => setTarjeta(tarjetas.find((card) => card._id === e.target.value))}
      sx={{
        width: "100%",
        maxWidth: "500px",
        backgroundColor: "white",
        borderRadius: "8px",
        padding: "5px",
      }}
    >
      {tarjetas.map((card) => (
        <MenuItem key={card._id} value={card._id}>
          **** **** **** {card.numeroTarjeta.slice(-4)}
        </MenuItem>
      ))}
    </Select>
  ) : (
    <Typography variant="body2" sx={{ marginLeft: "10px" }}>
      No hay tarjetas disponibles.
    </Typography>
  )}
</Box>

          {/* Total */}
          <Box
            sx={{
              width: "100%",
              maxWidth: "700px",
              height: "auto",
              backgroundColor: "rgba(255, 255, 255, 0.6)",
              borderRadius: "12px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              boxShadow: "0px 4px 15px rgba(0, 0, 0, 0.3)",
              padding: "15px",
              marginBottom: "20px",
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: "bold" }}>
              Total: ${precioTotal.toFixed(2)}
            </Typography>
          </Box>

          {/* Productos en el pedido */}
          <Box
            sx={{
              width: "100%",
              maxWidth: "700px",
              backgroundColor: "rgba(255, 255, 255, 0.6)",
              borderRadius: "12px",
              padding: "20px",
              boxShadow: "0px 4px 15px rgba(0, 0, 0, 0.3)",
              marginBottom: "20px",
            }}
          >
            <Typography variant="h6" sx={{ marginBottom: "10px", fontWeight: "bold" }}>
              Productos en tu pedido:
            </Typography>
            {carrito.length > 0 ? (
              carrito.map((item, index) => (
                <Box
                  key={index}
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "10px",
                    borderBottom: "1px solid rgba(0, 0, 0, 0.1)",
                  }}
                >
                  <Typography variant="body1">{item.producto?.nombreProducto || "Producto no disponible"}</Typography>
                  <Typography variant="body2">
                    {item.cantidad} x ${item.producto?.precioProducto?.toFixed(2) || "0.00"}
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                    ${(item.cantidad * (item.producto?.precioProducto || 0)).toFixed(2)}
                  </Typography>
                </Box>
              ))
            ) : (
              <Typography variant="body2" sx={{ textAlign: "center", marginTop: "10px" }}>
                No hay productos en el carrito.
              </Typography>
            )}
          </Box>

          {/* Botones */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              gap: 2,
              marginTop: "20px",
            }}
          >
            <Button
              variant="contained"
              color="secondary"
              onClick={() => router.push("/MiCarrito")}
              sx={{
                padding: "10px 30px",
                fontSize: "1rem",
                backgroundColor: "rgb(3, 46, 63)",
                color: "white",
                borderRadius: "8px",
                "&:hover": {
                  backgroundColor: "rgb(3, 35, 48)",
                },
              }}
            >
              Regresar a Mi Carrito
            </Button>

            <Button
              variant="contained"
              color="primary"
              onClick={handleFinalizarPedido}
              sx={{
                padding: "10px 30px",
                fontSize: "1rem",
                backgroundColor: "rgb(3, 46, 63)",
                color: "white",
                borderRadius: "8px",
                "&:hover": {
                  backgroundColor: "rgb(3, 35, 48)",
                },
              }}
            >
              Finalizar Pedido
            </Button>
          </Box>
        </Box>
      </Box>
      <Footer />
    </>
  );
};

export default OrdenDeCompra;