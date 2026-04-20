const API_URL = 'http://localhost:3000/api/alumnos';

export const alumnosService = {
  register: async (alumnoData) => {
    const response = await fetch(`${API_URL}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(alumnoData),
    });
    return await response.json();
  }
};