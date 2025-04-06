import React, { useState, useEffect, useContext } from "react";
import {
  Typography,
  Container,
  Box,
  Grid,
  Drawer,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import NavBar from "../components/navbar/NavBar";
import { AuthContext } from "../context/AuthContext";
import Footer from "../components/footer/Footer";
import axios from "axios";

const categories = ["Audio", "Accesorios", "Periféricos", "Laptop", "PC Gamer"];

const HomePage = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null); // Categoría seleccionada
  const [currentPage, setCurrentPage] = useState(1); // Página actual para la paginación
  const [products, setProducts] = useState([]); // Todos los productos
  const [dialogOpen, setDialogOpen] = useState(false); // Estado para controlar el diálogo
  const productsPerPage = 6; // Número de productos por página
  const { user } = useContext(AuthContext); // Obtén el usuario del contexto

  // Obtener productos desde el backend
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          console.error("No se encontró un token. Por favor, inicia sesión.");
          return;
        }

        const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/productos`;
        console.log("URL de la API:", apiUrl); // Verifica la URL generada

        const response = await axios.get(apiUrl, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        console.log("Productos obtenidos:", response.data); // Verifica los productos en la consola
        setProducts(response.data); // Guarda los productos en el estado
      } catch (error) {
        if (error.response) {
          console.error(
            `Error ${error.response.status}: ${error.response.data.message || "Error desconocido"}`
          );
        } else {
          console.error("Error al obtener los productos:", error.message);
        }
      }
    };

    fetchProducts();
  }, []);

  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };

  const handleCategoryClick = (category) => {
    setSelectedCategory(category); // Filtra por categoría
    setDrawerOpen(false); // Cierra el Drawer
    setCurrentPage(1); // Reinicia la paginación
  };

  const handleShowAllCategories = () => {
    setSelectedCategory(null); // Restablece la categoría seleccionada
    setDrawerOpen(false); // Cierra el Drawer
    setCurrentPage(1); // Reinicia la paginación
  };

  const handleProductClick = (productId) => {
    if (!productId) {
      console.error("El ID del producto no es válido.");
      return;
    }

    if (user) {
      // Si el usuario está autenticado, redirigir al producto
      window.location.href = `/Producto?id=${productId}`;
    } else {
      // Si no está autenticado, mostrar el diálogo
      setDialogOpen(true);
    }
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
  };

  // Filtrar productos por categoría
  const filteredProducts = selectedCategory
    ? products.filter((product) => product.categoriaProducto === selectedCategory)
    : products; // Si no hay categoría seleccionada, muestra todos los productos

  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
  const startIndex = (currentPage - 1) * productsPerPage;
  const visibleProducts = filteredProducts.slice(startIndex, startIndex + productsPerPage);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  return (
    <>
      <NavBar />
      <Box sx={{ position: "absolute", top: 140, left: 16 }}>
        <IconButton
          onClick={toggleDrawer}
          sx={{
            color: "white",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            "&:hover": { backgroundColor: "rgba(0, 0, 0, 0.7)" },
          }}
        >
          <MenuIcon />
        </IconButton>
      </Box>
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          backgroundImage: "url('Fondo_HikariTech.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          pt: 10,
        }}
      >
        {/* Menú lateral */}
        {drawerOpen && (
          <Drawer
            variant="temporary"
            open={drawerOpen}
            onClose={toggleDrawer}
            sx={{
              width: 240,
              flexShrink: 0,
              [`& .MuiDrawer-paper`]: {
                width: 240,
                boxSizing: "border-box",
                backgroundColor: "rgba(0, 0, 0, 0.8)",
                color: "white",
              },
            }}
          >
            <Box sx={{ overflow: "auto", padding: "10px" }}>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: "bold",
                  textAlign: "center",
                  marginBottom: "20px",
                  color: "yellow",
                }}
              >
                Categorías
              </Typography>
              <List>
                {/* Opción para mostrar todas las categorías */}
                <ListItem
                  button
                  onClick={handleShowAllCategories}
                  sx={{
                    marginBottom: "10px",
                    borderRadius: "8px",
                    backgroundColor: selectedCategory === null ? "rgba(255, 255, 255, 0.2)" : "inherit",
                    "&:hover": {
                      backgroundColor: "rgba(255, 255, 255, 0.2)",
                    },
                  }}
                >
                  <ListItemText
                    primary="Todas las categorías"
                    primaryTypographyProps={{
                      fontSize: "1rem",
                      fontWeight: "bold",
                      textAlign: "center",
                    }}
                  />
                </ListItem>

                {/* Lista de categorías */}
                {categories.map((text, index) => (
                  <ListItem
                    button
                    key={index}
                    onClick={() => handleCategoryClick(text)}
                    sx={{
                      marginBottom: "10px",
                      borderRadius: "8px",
                      backgroundColor: selectedCategory === text ? "rgba(255, 255, 255, 0.2)" : "inherit",
                      "&:hover": {
                        backgroundColor: "rgba(255, 255, 255, 0.2)",
                      },
                    }}
                  >
                    <ListItemText
                      primary={text}
                      primaryTypographyProps={{
                        fontSize: "1rem",
                        fontWeight: "bold",
                        textAlign: "center",
                      }}
                    />
                  </ListItem>
                ))}
              </List>
            </Box>
          </Drawer>
        )}

        {/* Contenido principal */}
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: 3,
            ml: drawerOpen ? 30 : 0,
            transition: "margin-left 0.3s",
          }}
        >
          <Container>
            {/* Mensaje de bienvenida */}
            {user ? (
              <Typography
                variant="h4"
                sx={{
                  color: "Black",
                  fontWeight: "bold",
                  mb: 4,
                  fontSize: "5rem",
                  textAlign: "center",
                }}
              >
                Bienvenid@, {user.name || "Usuario"}
              </Typography>
            ) : (
              <Typography
                variant="h4"
                sx={{
                  color: "Black",
                  fontWeight: "bold",
                  mb: 4,
                  fontSize: "5rem",
                  textAlign: "center",
                }}
              >
                Bienvenid@ a nuestra tienda
              </Typography>
            )}

            {/* Mostrar productos */}
            <Grid container spacing={2}>
              {visibleProducts.map((product, index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <Box
                    sx={{
                      border: "1px solid #ccc",
                      borderRadius: "8px",
                      overflow: "hidden",
                      textAlign: "center",
                      backgroundColor: "#fff",
                      cursor: "pointer",
                    }}
                    onClick={() => handleProductClick(product._id)}
                  >
                    {product.imagenProducto.map((url, imgIndex) => (
                      <img
                        key={imgIndex}
                        src={url}
                        alt={product.nombreProducto}
                        style={{ width: "100%", height: "150px", objectFit: "cover" }}
                      />
                    ))}
                    <Box sx={{ p: 2 }}>
                      <Typography variant="h6">{product.nombreProducto}</Typography>
                      <Typography variant="body2" sx={{ color: "#555", mt: 1 }}>
                        {product.descripcionProducto}
                      </Typography>
                      <Typography variant="body1" sx={{ mt: 1, fontWeight: "bold" }}>
                        ${product.precioProducto}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
              ))}
            </Grid>

            {/* Controles de paginación */}
            <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
              <IconButton
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                Anterior
              </IconButton>
              {[...Array(totalPages)].map((_, index) => (
                <IconButton
                  key={index}
                  onClick={() => handlePageChange(index + 1)}
                  sx={{
                    fontWeight: currentPage === index + 1 ? "bold" : "normal",
                  }}
                >
                  {index + 1}
                </IconButton>
              ))}
              <IconButton
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                Siguiente
              </IconButton>
            </Box>
          </Container>
        </Box>
      </Box>
      <Footer />

      {/* Diálogo para usuarios no autenticados */}
      <Dialog open={dialogOpen} onClose={handleCloseDialog}>
        <DialogTitle>Acceso restringido</DialogTitle>
        <DialogContent>
          <Typography>
            Por favor, regístrate o inicia sesión para ver los detalles del producto.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => window.location.href = "/login"} color="primary">
            Iniciar sesión
          </Button>
          <Button onClick={handleCloseDialog} color="secondary">
            Cerrar
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default HomePage;