const API_URL = 'http://localhost:3000/api/grupos'; 

export const gruposService = {
  // Ahora pide grupos filtrados por carrera y periodo reciente
  getByCarrera: async (carrera) => {
    // encodeURIComponent es vital porque las carreras tienen espacios
    const response = await fetch(`${API_URL}/recientes?carrera=${encodeURIComponent(carrera)}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
    return await response.json();
  }
};