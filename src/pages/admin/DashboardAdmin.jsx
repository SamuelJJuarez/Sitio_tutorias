import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FaClipboardList, FaChartLine } from 'react-icons/fa';

const DashboardAdmin = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  return (
    <div className="bg-tec-full min-vh-100 p-4 d-flex flex-column align-items-center justify-content-start pt-5">
      
      {/* Texto de Bienvenida en Blanco para contraste con el fondo azul */}
      <h2 className="mb-5 text-white fw-bold text-center">
        ¡Bienvenido, {user?.nombre || 'Administrador'}!
      </h2>
      
      <div className="row g-5 justify-content-center w-100" style={{ maxWidth: '900px' }}>
        {/* Tarjeta Resumen General */}
        <div className="col-md-5">
          <div className="card shadow h-100 text-center p-4 card-custom cursor-pointer zoom-effect border-0" 
               onClick={() => navigate('/admin/resultados/generales')}>
            <div className="card-body">
              <FaClipboardList className="display-1 text-primary mb-3" size={80} />
              <h3 className="card-title fw-bold text-dark">Resumen General</h3>
              <p className="card-text text-muted">Consulta los resultados globales.</p>
              <button className="btn btn-primary mt-3 px-4">Aceptar</button>
            </div>
          </div>
        </div>

        {/* Tarjeta Resultados por Grupo */}
        <div className="col-md-5">
          <div className="card shadow h-100 text-center p-4 card-custom cursor-pointer zoom-effect border-0"
               onClick={() => navigate('/admin/resultados/grupos')}>
            <div className="card-body">
              <FaChartLine className="display-1 text-info mb-3" size={80} />
              <h3 className="card-title fw-bold text-dark">Resultados por Grupo</h3>
              <p className="card-text text-muted">Consulta el diagnóstico por grupos específicos.</p>
              <button className="btn btn-info mt-3 px-4 text-white">Aceptar</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardAdmin;
