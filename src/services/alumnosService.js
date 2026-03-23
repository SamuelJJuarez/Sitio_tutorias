const API_URL = 'http://localhost:3000/api/alumnos'; // Ajusta si tu puerto cambia

export const alumnosService = {
  register: async (alumnoData) => {
    const response = await fetch(`${API_URL}/register`, { // Asumiendo que tu ruta es /register
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(alumnoData),
    });
    return await response.json();
  }
};