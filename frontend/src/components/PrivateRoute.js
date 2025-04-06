import { useContext } from "react";
import { AuthContext } from "../context/AuthContext"; // Asegúrate de que la ruta al contexto es correcta
import { useRouter } from "next/router";

const PrivateRoute = ({ children }) => {
const { user } = useContext(AuthContext); // Obtiene el estado de autenticación desde el contexto
const router = useRouter();

  // Si el usuario no está autenticado, redirige al login
if (!user) {
    router.push("/login");
    return null; // No renderiza nada mientras redirige
}

  // Si el usuario está autenticado, renderiza el contenido
return children;
};

export default PrivateRoute;