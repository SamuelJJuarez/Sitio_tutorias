import { useState, useEffect } from 'react'; // <--- Importa useEffect
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import logo from '../assets/itl_leon.png'; 

const LoginPage = () => {
  const [formData, setFormData] = useState({ 
    correo: '', 
    contraseña: '', 
    rol: 'alumno' 
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  // Extraemos también la función logout
  const { login, logout, isAuthenticated } = useAuth(); 
  const navigate = useNavigate();

  // --- NUEVO CÓDIGO: Limpieza al entrar ---
  useEffect(() => {
    // Si el usuario entra al login (incluso con la flecha atrás),
    // cerramos cualquier sesión activa para evitar conflictos.
    logout(); 
  }, []); // El array vacío hace que solo se ejecute una vez al montar el componente
  // ----------------------------------------

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if(error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    const result = await login(formData.correo, formData.contraseña, formData.rol);

    if (result.success) {
      if (formData.rol === 'alumno') navigate('/alumno/perfil');
      if (formData.rol === 'maestro') navigate('/maestro/grupos');
      if (formData.rol === 'admin') navigate('/admin/dashboard');
    } else {
      setError(result.message || 'Datos incorrectos, vuelva a intentarlo');
    }
    setLoading(false);
  };

  return (
    <div className="bg-tec-full"> 
      {/* ... El resto de tu JSX se queda igual ... */}
      <div className="card card-custom p-4 bg-white" style={{ width: '100%', maxWidth: '400px' }}>
        <div className="text-center mb-4">
          <h4 className="fw-bold text-tec">SISTEMA DE TUTORÍAS</h4>
          <p className="text-muted small">Tecnológico Nacional de México</p>
        </div>

        <form onSubmit={handleSubmit}>
           {/* ... Tus inputs ... */}
           
           <div className="mb-3">
            <label className="form-label fw-bold text-secondary">Tipo de Usuario:</label>
            <select 
              name="rol" 
              className="form-select" 
              value={formData.rol} 
              onChange={handleChange}
            >
              <option value="alumno">Alumno</option>
              <option value="maestro">Maestro</option>
              <option value="admin">Administrativo</option>
            </select>
          </div>

          <div className="mb-3">
            <label className="form-label fw-bold text-secondary">Correo:</label>
            <input
              type="email"
              name="correo"
              className="form-control"
              placeholder="Ingrese su correo"
              value={formData.correo}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-4">
            <label className="form-label fw-bold text-secondary">Contraseña:</label>
            <div className="input-group">
              <input
                type={showPassword ? "text" : "password"}
                name="contraseña"
                className="form-control"
                placeholder="********"
                value={formData.contraseña}
                onChange={handleChange}
                required
              />
              <button 
                className="btn btn-outline-secondary" 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? 'Ocultar' : 'Ver'}
              </button>
            </div>
          </div>

          {error && (
            <div className="alert alert-danger text-center p-2 mb-3 small" role="alert">
              {error}
            </div>
          )}

          <button 
            type="submit" 
            className="btn btn-tec w-100 p-2 fw-bold"
            disabled={loading}
          >
            {loading ? 'Entrando...' : 'Iniciar Sesión'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;