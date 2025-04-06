import api from '../config/services';

// Obtener una lista de productos con paginación
export const getProductos = async (page = 1, limit = 10) => {
  try {
    const response = await api.get('/productos', { params: { page, limit } });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Obtener un producto por su ID
export const getProductoById = async (productId) => {
  try {
    const response = await api.get(`/productos/${productId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Crear un nuevo producto
export const createProduct = async (productData) => {
  try {
    const response = await api.post('/productos', productData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Actualizar un producto existente
export const updateProducto = async (productId, productData) => {
  try {
    const response = await api.put(`/productos/${productId}`, productData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Eliminar un producto por su ID
export const deleteProducto = async (productId) => {
  try {
    await api.delete(`/productos/${productId}`);
  } catch (error) {
    throw error;
  }
};