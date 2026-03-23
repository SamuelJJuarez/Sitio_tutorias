import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { maestrosService } from '../../services/maestrosService'; // Usa este servicio
import logo from '../../assets/itl_leon.png';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

const ResultadosAlumnoVista = () => {
  const { num_control } = useParams(); // Recibimos ID
  const navigate = useNavigate();
  const [resultados, setResultados] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await maestrosService.getResultadosAlumno(num_control);
        if(res.success) setResultados(res.data);
      } catch (err) { console.error(err); } finally { setLoading(false); }
    };
    fetch();
  }, [num_control]);

  if(loading) return <div className="text-white text-center mt-5">Cargando...</div>;

  return (
    <div className="bg-tec-full min-vh-100 py-5 px-3">
      <div className="container">
        <div className="card shadow-lg border-0 rounded-3 overflow-hidden">
            <div className="card-header bg-white border-bottom p-4 d-flex justify-content-between align-items-center">
                <div className="d-flex align-items-center">
                    <img src={logo} alt="ITL" style={{ height: '50px' }} />
                    <div className="ms-3">
                        <h4 className="mb-0 fw-bold text-tec">Informe del Alumno</h4>
                        <small className="text-muted">{num_control}</small>
                    </div>
                </div>
                <button className="btn btn-outline-secondary" onClick={() => navigate(-1)}>Regresar</button>
            </div>
            <div className="card-body p-5 bg-light">
                {resultados.length === 0 ? <div className="alert alert-warning">El alumno no ha completado el cuestionario.</div> : (
                    <div className="row g-4">
                        {resultados.map((seccion) => (
                            <div key={seccion.id_seccion} className="col-12 mb-5">
                                <h5 className="fw-bold text-dark border-start border-5 border-primary ps-3 mb-3">{seccion.nombre}</h5>
                                <div className="bg-white p-3 rounded border shadow-sm" style={{ height: 350 }}>
                                    <ResponsiveContainer>
                                        <BarChart data={seccion.datos} margin={{bottom: 50}}>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                            <XAxis dataKey="name" tick={{fontSize: 11}} angle={-15} textAnchor="end" interval={0} />
                                            <YAxis allowDecimals={false} />
                                            <Tooltip />
                                            <Bar dataKey="cantidad" name="Respuestas">
                                                {seccion.datos.map((e, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                                            </Bar>
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
      </div>
    </div>
  );
};

export default ResultadosAlumnoVista;