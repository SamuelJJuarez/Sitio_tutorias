import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { administrativosService } from '../../services/administrativosService';
import SuccessModal from '../../components/modals/SuccessModal';

const RegisterAdminPage = () => {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    identificador_admin: '', // En el PDF dice "Número de control", pero en BD es identificador_admin
    nombre: '',
    apellidoP: '',
    apellidoM: '',
    correo: '',
    contrasena: ''
  });

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await administrativosService.register(formData);
      if (res.success) {
        setShowModal(true);
        setTimeout(() => {
          navigate('/');
        }, 2000);
      } else {
        alert('Error: ' + res.message);
      }
    } catch (error) {
      alert('Error de conexión');
    }
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card shadow border-0">
            <div className="card-body p-5">
              <h2 className="text-center mb-4 text-tec fw-bold">Registrar Administrativo</h2>
              <form onSubmit={handleSubmit} className="row g-3">
                <div className="col-12">
                  <label>Número de control / ID</label>
                  <input type="text" name="identificador_admin" className="form-control" onChange={handleChange} required />
                </div>
                <div className="col-12">
                  <label>Nombre</label>
                  <input type="text" name="nombre" className="form-control" onChange={handleChange} required />
                </div>
                <div className="col-md-6">
                  <label>Apellido Paterno</label>
                  <input type="text" name="apellidoP" className="form-control" onChange={handleChange} required />
                </div>
                <div className="col-md-6">
                  <label>Apellido Materno</label>
                  <input type="text" name="apellidoM" className="form-control" onChange={handleChange} required />
                </div>
                <div className="col-12">
                  <label>Correo Institucional</label>
                  <input type="email" name="correo" className="form-control" onChange={handleChange} required />
                </div>
                <div className="col-12">
                  <label>Contraseña</label>
                  <input type="password" name="contrasena" className="form-control" onChange={handleChange} required />
                </div>
                <div className="d-grid gap-2 mt-4">
                  <button type="submit" className="btn btn-tec btn-lg">Aceptar</button>
                  <button type="button" className="btn btn-outline-secondary" onClick={() => navigate('/')}>Cancelar</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      <SuccessModal isOpen={showModal} message="Usuario registrado correctamente" />
    </div>
  );
};

export default RegisterAdminPage;