const API_URL = 'http://localhost:3000/api/cuestionario';

// Helper para obtener el token del almacenamiento local
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}` // <--- Cabecera clave
  };
};

export const cuestionarioService = {
  // Ya no necesitamos recibir el numControl como argumento, la API sabe quién eres por el token
  getEstatus: async () => {
    const response = await fetch(`${API_URL}/estatus`, {
      method: 'GET',
      headers: getAuthHeaders()
    });
    return await response.json();
  },

  getSeccion: async (idSeccion) => {
    const response = await fetch(`${API_URL}/seccion/${idSeccion}`, {
      method: 'GET',
      headers: getAuthHeaders()
    });
    return await response.json();
  },

  saveSeccion: async (data) => {
    // data ya no necesita llevar num_control_alum, solo id_seccion y respuestas
    const response = await fetch(`${API_URL}/guardar`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(data)
    });
    return await response.json();
  },

  getResultados: async () => {
    const response = await fetch(`${API_URL}/resultados`, {
      method: 'GET',
      headers: getAuthHeaders()
    });
    return await response.json();
  }
};