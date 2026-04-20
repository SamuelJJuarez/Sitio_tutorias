const API_URL = 'http://localhost:3000/api/grupos';

export const gruposService = {
  getByCarrera: async (carrera) => {
    const response = await fetch(`${API_URL}/recientes?carrera=${encodeURIComponent(carrera)}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
    return await response.json();
  }
};