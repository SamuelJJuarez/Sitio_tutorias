import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom'; // <--- Importamos Link
import { useAuth } from '../context/AuthContext';
import logo from '../assets/itl_leon.png'; 

const LoginPage = () => {
  const [formData, setFormData] = useState({ 
    correo: '', 
    contraseña: '', 
    rol: 'alumno' // Eliminé esto porque tu API de login generalmente infiere el rol o usa endpoints distintos, 
                     // pero si tu lógica lo requiere, déjalo. En el visual no se selecciona rol para login.
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [tipoUsuario, setTipoUsuario] = useState('alumno'); // Estado para los Radio Buttons del PDF
  
  const { login, logout } = useAuth(); 
  const navigate = useNavigate();

  useEffect(() => {
    logout(); 
  }, []); 

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if(error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Pasamos el tipoUsuario seleccionado (alumno, maestro, admin) al contexto
    const result = await login(formData.correo, formData.contraseña, tipoUsuario);
    
    if (result.success) {
        // Redirección basada en el rol
        if(tipoUsuario === 'alumno') navigate('/alumno/dashboard');
        else if(tipoUsuario === 'maestro') navigate('/maestro/dashboard');
        else navigate('/admin/dashboard');
    } else {
      setError(result.message);
      setLoading(false);
    }
  };

  return (
    <div className="bg-tec-full"> {/* Usando la clase que definimos en index.css */}
      <div className="card card-custom shadow-lg p-4" style={{ width: '400px' }}>
        <div className="text-center mb-4">
          <img src={logo} alt="Logo ITL" style={{ width: '80px', marginBottom: '10px' }} />
          <h4 className="fw-bold text-tec">INSTITUTO TECNOLÓGICO DE LEÓN</h4>
          <small className="text-secondary fw-bold">CIENCIA, TECNOLOGÍA Y LIBERTAD</small>
          <div className="mt-2 text-muted" style={{ fontSize: '0.8rem' }}>EDUCACIÓN SUPERIOR</div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label fw-bold text-secondary">Usuario:</label>
            <input
              type="email"
              name="correo"
              className="form-control"
              placeholder="Ingrese su usuario"
              value={formData.correo}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label fw-bold text-secondary">Contraseña:</label>
            <div className="input-group">
              <input
                type={showPassword ? "text" : "password"}
                name="contraseña"
                className="form-control"
                placeholder="Ingrese su contraseña"
                value={formData.contraseña}
                onChange={handleChange}
                required
              />
              <button 
                className="btn btn-outline-secondary" 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
              >
                <i className={`bi ${showPassword ? 'bi-eye-slash' : 'bi-eye'}`}></i> {/* Si usas iconos bootstrap */}
                {!showPassword ? 'Ver' : 'Ocultar'}
              </button>
            </div>
          </div>

          {/* Selector de Rol (Como en el PDF Pag 1) */}
          <div className="mb-4 d-flex justify-content-around">
            <div className="form-check">
                <input className="form-check-input" type="radio" name="rol" 
                    checked={tipoUsuario === 'alumno'} onChange={() => setTipoUsuario('alumno')} />
                <label className="form-check-label">Alumno</label>
            </div>
            <div className="form-check">
                <input className="form-check-input" type="radio" name="rol" 
                    checked={tipoUsuario === 'maestro'} onChange={() => setTipoUsuario('maestro')} />
                <label className="form-check-label">Profesor</label>
            </div>
            <div className="form-check">
                <input className="form-check-input" type="radio" name="rol" 
                    checked={tipoUsuario === 'admin'} onChange={() => setTipoUsuario('admin')} />
                <label className="form-check-label">Admin</label>
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
            {loading ? 'Iniciando...' : 'Iniciar sesión'}
          </button>
        </form>

        <hr className="my-4" />

        {/* --- SECCIÓN DE REGISTRO --- */}
        <div className="text-center">
            <p className="small text-muted mb-2">¿No tienes cuenta? Regístrate:</p>
            <div className="d-flex justify-content-center gap-2">
                <Link to="/registro-alumno" className="btn btn-sm btn-outline-primary">Alumno</Link>
                <Link to="/registro-maestro" className="btn btn-sm btn-outline-secondary">Profesor</Link>
                {/* Opcional: El registro admin suele ser privado, pero si lo quieres público: */}
                {/* <Link to="/registro-admin" className="btn btn-sm btn-outline-dark">Admin</Link> */}
            </div>
        </div>

      </div>
    </div>
  );
};

export default LoginPage;