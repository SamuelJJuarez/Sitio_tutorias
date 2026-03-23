import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { alumnosService } from '../../services/alumnosService';
import { gruposService } from '../../services/gruposService';

const RegisterAlumnoPage = () => {
  const navigate = useNavigate();
  const [grupos, setGrupos] = useState([]);
  
  // Estado para el formulario
  const [formData, setFormData] = useState({
    num_control_alum: '',
    nombre: '',
    apellidoP: '',
    apellidoM: '',
    semestre: '',
    correo: '',
    contrasena: '',
    estado_civil: 'Soltero', // Valor por defecto
    carrera: '',
    indice_grupo: ''
  });

  // Cargar grupos al iniciar
  useEffect(() => {
    const cargarGrupos = async () => {
      // Solo buscamos si ya seleccionó una carrera
      if (formData.carrera) {
        try {
          const res = await gruposService.getByCarrera(formData.carrera);
          if (res.success) {
            setGrupos(res.data);
          } else {
            setGrupos([]); // Limpiar si no hay éxito
          }
        } catch (error) {
          console.error("Error cargando grupos");
        }
      } else {
        setGrupos([]); // Si quita la carrera, limpiamos los grupos
      }
    };
    cargarGrupos();
  }, [formData.carrera]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await alumnosService.register(formData);
      if (res.success) {
        alert('Alumno registrado correctamente');
        navigate('/'); // Redirigir al login
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
        <div className="col-md-8">
          <div className="card shadow-lg border-0">
            <div className="card-body p-5">
              <h2 className="text-center mb-4 text-tec fw-bold">Registrar Alumno</h2>
              
              <form onSubmit={handleSubmit}>
                <div className="row g-3">
                  {/* Fila 1 */}
                  <div className="col-md-6">
                    <label className="form-label">Número de control</label>
                    <input type="text" name="num_control_alum" className="form-control" onChange={handleChange} required />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Estado Civil</label>
                    <select name="estado_civil" className="form-select" onChange={handleChange}>
                      <option value="Soltero">Soltero/a</option>
                      <option value="Casado">Casado/a</option>
                    </select>
                  </div>

                  {/* Fila 2 */}
                  <div className="col-md-6">
                    <label className="form-label">Nombre</label>
                    <input type="text" name="nombre" className="form-control" onChange={handleChange} required />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Carrera</label>
                    <select name="carrera" className="form-select" onChange={handleChange} required>
                        <option value="">Seleccione...</option>
                        <option value="Ingeniería en Sistemas Computacionales">Ing. Sistemas Computacionales</option>
                        <option value="Ingeniería Industrial">Ing. Industrial</option>
                        <option value="Ingeniería en Gestión Empresarial">Ing. Gestión Empresarial</option>
                        {/* Agrega las carreras de tu escuela aquí */}
                    </select>
                  </div>

                  {/* Fila 3 */}
                  <div className="col-md-6">
                    <label className="form-label">Apellido Paterno</label>
                    <input type="text" name="apellidoP" className="form-control" onChange={handleChange} required />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Apellido Materno</label>
                    <input type="text" name="apellidoM" className="form-control" onChange={handleChange} required />
                  </div>

                  {/* Fila 4 */}
                  <div className="col-md-6">
                    <label className="form-label">Semestre</label>
                    <input type="number" name="semestre" className="form-control" onChange={handleChange} required />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Grupo</label>
                    <select name="indice_grupo" className="form-select" onChange={handleChange} required>
                      <option value="">Seleccione...</option>
                      {grupos.map((g) => (
                        // Asumiendo que tu API devuelve indice_grupo y letra_grupo
                        <option key={g.indice_grupo} value={g.indice_grupo}>
                          {g.indice_grupo} - {g.letra_grupo} ({g.periodo})
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Fila 5 */}
                  <div className="col-md-6">
                    <label className="form-label">Correo Institucional</label>
                    <input type="email" name="correo" className="form-control" onChange={handleChange} required />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Contraseña</label>
                    <input type="password" name="contrasena" className="form-control" onChange={handleChange} required />
                  </div>
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
    </div>
  );
};

export default RegisterAlumnoPage;