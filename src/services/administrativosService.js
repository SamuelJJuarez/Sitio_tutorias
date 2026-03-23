const API_URL = 'http://localhost:3000/api/administrativos'; // Verifica si la ruta en tu API es 'administrativo' o 'administrativos'

export const administrativosService = {
  register: async (adminData) => {
    const response = await fetch(`${API_URL}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(adminData),
    });
    return await response.json();
  }
};