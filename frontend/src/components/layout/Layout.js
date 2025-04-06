import React from 'react';
import NavBar from '../navbar/NavBar';
import Footer from '../footer/Footer';
import { Container } from '@mui/material';

const Layout = ({ children }) => {
return (
    <>
    <NavBar></NavBar>
    <Container component='main' sx={{ mt: 4, mb: 4 }}>
        {children}
    </Container>
    <Footer></Footer>
    </>
);
};

export default Layout;