import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import logoItl from '../../assets/itl_leon.png'; // Asegúrate de tener este logo en assets

const Header = () => {
  const { user, logout, role } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white border-bottom shadow-sm py-3">
      <div className="container">
        {/* LOGO E IDENTIDAD */}
        <div className="d-flex align-items-center">
            <img src={logoItl} alt="Logo ITL" style={{ height: '50px', marginRight: '15px' }} />
            <div className="d-flex flex-column">
                <span className="fw-bold text-primary" style={{ lineHeight: '1.2' }}>INSTITUTO TECNOLÓGICO DE LEÓN</span>
                <small className="text-muted">Sistema de Tutorías</small>
            </div>
        </div>

        {/* INFO USUARIO Y BOTÓN SALIR */}
        {user && (
          <div className="d-flex align-items-center gap-3">
            <div className="text-end d-none d-md-block">
                <div className="fw-bold">{user.nombre}</div>
                <div className="badge bg-secondary text-uppercase" style={{ fontSize: '0.7rem' }}>
                    {role}
                </div>
            </div>
            <button 
                onClick={handleLogout} 
                className="btn btn-outline-danger btn-sm"
            >
                Cerrar Sesión
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Header;