import React, { useContext, useState } from 'react';
import { AppBar, Toolbar, InputBase, IconButton, Menu, MenuItem, Typography, Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';
import { Search as SearchIcon, ShoppingCart as ShoppingCartIcon, AccountCircle as AccountCircleIcon } from '@mui/icons-material';
import { makeStyles } from '@mui/styles';
import Badge from '@mui/material/Badge';
import { AuthContext } from '../../context/AuthContext';
import Image from 'next/image';

const useStyles = makeStyles((theme) => ({
  toolbar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    minHeight: '100px',
  },
  search: {
    display: 'flex',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: '25px',
    padding: '0 10px',
    marginLeft: theme.spacing(2),
    marginRight: theme.spacing(2),
    width: '70%',
    height: '52px',
  },
  searchIcon: {
    marginRight: theme.spacing(1),
  },
  inputInput: {
    flex: 1,
    color: '#000000',
  },
  icons: {
    display: 'flex',
    alignItems: 'center',
  },
  iconButton: {
    marginLeft: theme.spacing(2),
    color: 'white',
  },
}));

const NavBar = ({ imageSrc = '', tittle = '', showSearch = true, showIcons = true }) => {
  const classes = useStyles();
  const { user, logout } = useContext(AuthContext); // Obtén el usuario y la función de logout del contexto
  const [anchorEl, setAnchorEl] = useState(null); // Estado para controlar el menú desplegable
  const [openContactDialog, setOpenContactDialog] = useState(false); // Estado para controlar el diálogo de contacto

  const handleProfileClick = (event) => {
    setAnchorEl(event.currentTarget); // Establece el elemento anclado al menú
  };

  const handleProfileClose = () => {
    setAnchorEl(null); // Cierra el menú
  };

  const handleGoToProfile = () => {
    window.location.href = '/MiPerfil';
    handleProfileClose(); // Cierra el menú después de redirigir
  };

  const handleLogout = () => {
    logout(); // Llama a la función de logout del contexto
    window.location.href = '/';
    handleProfileClose(); // Cierra el menú después de cerrar sesión
  };

  const handleLogin = () => {
    window.location.href = '/auth/login'; // Redirige a la página de inicio de sesión
    handleProfileClose(); // Cierra el menú después de redirigir
  };

  const handleRegister = () => {
    window.location.href = '/auth/register'; // Redirige a la página de registro
    handleProfileClose(); // Cierra el menú después de redirigir
  };

  const handleAddToCart = () => {
    window.location.href = '/MiCarrito';
  };

  const handleOpenContactDialog = () => {
    setOpenContactDialog(true); // Abre el diálogo de contacto
    handleProfileClose(); // Cierra el menú
  };

  const handleCloseContactDialog = () => {
    setOpenContactDialog(false); // Cierra el diálogo de contacto
  };

  return (
    <>
      <AppBar position="static" style={{ backgroundColor: '#b31e23' }}>
        <Toolbar className={classes.toolbar}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '350px' }}>
            <Image
              src={imageSrc || '/hikariTechblanco.png'} // Asegúrate de usar rutas relativas desde la carpeta public
              alt="Logo"
              width={150} // Define el ancho de la imagen
              height={120} // Define la altura de la imagen
              style={{
                cursor: 'pointer',
              }}
              onClick={() => (window.location.href = '/')}
            />
            <Typography
              variant="h6"
              color="inherit"
              sx={{
                flexGrow: 1,
                color: 'white',
                fontFamily: 'Arial',
                fontWeight: 'bold',
                letterSpacing: 1,
                fontSize: '3rem',
              }}
            >
              {tittle || ''}
            </Typography>
          </div>
          {showSearch && (
            <div className={classes.search} style={{ color: 'black' }}>
              <SearchIcon className={classes.searchIcon} />
              <InputBase
                placeholder="Buscar"
                classes={{
                  input: classes.inputInput,
                }}
              />
            </div>
          )}
          {showIcons && (
            <div className={classes.icons} style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center' }}>
              {user && ( // Solo muestra el ícono del carrito si el usuario está autenticado
                <IconButton className={classes.iconButton} style={{ color: 'white' }} onClick={handleAddToCart}>
                  <Badge badgeContent={0} color="secondary">
                    <ShoppingCartIcon />
                  </Badge>
                </IconButton>
              )}
              <IconButton
                className={classes.iconButton}
                style={{ color: 'white' }}
                onClick={handleProfileClick} // Abre el menú al hacer clic
              >
                <AccountCircleIcon />
              </IconButton>
              <Menu
                anchorEl={anchorEl} // Controla el menú con el estado anchorEl
                open={Boolean(anchorEl)} // Abre el menú si anchorEl no es null
                onClose={handleProfileClose} // Cierra el menú
              >
                {user ? (
                  <>
                    <MenuItem onClick={handleGoToProfile}>Ver mi perfil</MenuItem>
                    <MenuItem onClick={handleLogout}>Cerrar sesión</MenuItem>
                    <MenuItem onClick={handleOpenContactDialog}>Contacto</MenuItem>
                  </>
                ) : (
                  <>
                    <MenuItem onClick={handleLogin}>Iniciar sesión</MenuItem>
                    <MenuItem onClick={handleRegister}>Registrarse</MenuItem>
                    <MenuItem onClick={handleOpenContactDialog}>Contacto</MenuItem>
                  </>
                )}
              </Menu>
            </div>
          )}
        </Toolbar>
      </AppBar>
  
      {/* Diálogo de contacto */}
      <Dialog open={openContactDialog} onClose={handleCloseContactDialog}>
        <DialogTitle>Contacto</DialogTitle>
        <DialogContent>
          <Typography variant="body1">Correo: contacto@hikaritech.com</Typography>
          <Typography variant="body1">Teléfono: +52 123 456 7890</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseContactDialog} color="primary">
            Cerrar
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default NavBar;