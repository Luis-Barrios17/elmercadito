/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
      domains: [
        'tienditasistemas1-app-e9752b9ed618.herokuapp.com', // Dominio del backend para cargar imágenes
        // Agrega aquí otros dominios si necesitas cargar imágenes de servicios externos
      ],
    },
  };
  
  export default nextConfig;