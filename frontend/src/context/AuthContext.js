import React, { createContext, useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import jwt from 'jsonwebtoken';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true); // Estado para manejar la carga inicial

  useEffect(() => {
    const token = Cookies.get('token');
    console.log("Token encontrado:", token);
    localStorage.setItem('token', token);
     // Verifica si el token existe y si es válido
    if (token) {
      try {
        const decodedToken = jwt.decode(token);
        console.log("Token decodificado:", decodedToken);
        localStorage.setItem('userId', decodedToken.userId); // Verifica el contenido del token

        // Verifica si el token ha expirado
        const currentTime = Math.floor(Date.now() / 1000); // Tiempo actual en segundos
        if (decodedToken.exp && decodedToken.exp < currentTime) {
          console.error("El token ha expirado.");
          Cookies.remove('token'); // Elimina el token expirado
          setIsAuthenticated(false);
          setIsLoading(false);
          return;
        }

        // Si el token es válido, establece el usuario y el estado de autenticación
        setUser({
          id: decodedToken.userId,
          role: decodedToken.role,
          name: decodedToken.name,
          email: decodedToken.email,
        });
        setIsAuthenticated(true);
      } catch (error) {
        console.error("Error al decodificar el token:", error);
      }
    }
    setIsLoading(false); // Finaliza el estado de carga
  }, []);

  const login = (token) => {
    Cookies.set('token', token);
    const decodedToken = jwt.decode(token);
    console.log("Token decodificado en login:", decodedToken); // Verifica el contenido del token
    setUser({
      id: decodedToken.userId,
      role: decodedToken.role,
      name: decodedToken.name,
      email: decodedToken.email,
    });
    setIsAuthenticated(true);
  };

  const logout = () => {
    Cookies.remove('token');
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};