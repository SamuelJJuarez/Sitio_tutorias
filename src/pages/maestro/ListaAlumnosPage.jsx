import { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { Modal, Accordion } from 'react-bootstrap';
import { maestrosService } from '../../services/maestrosService';
import { FaSearch, FaChevronLeft, FaChevronRight, FaCalendarAlt, FaEdit } from 'react-icons/fa';

const ITEMS_POR_PAGINA = 10;

const ListaAlumnosPage = () => {
  const { indice_grupo } = useParams();
  const { state } = useLocation(); // Para traer el nombre del grupo del dashboard
  const navigate = useNavigate();
  
  const [alumnos, setAlumnos] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  const [paginaActual, setPaginaActual] = useState(1);
  const [loading, setLoading] = useState(true);

  // Estados para Modal Entrevista
  const [showModal, setShowModal] = useState(false);
  const [modoModal, setModoModal] = useState('crear'); // crear, editar_resumen, reprogramar
  const [alumnoSeleccionado, setAlumnoSeleccionado] = useState(null);
  const [entrevistaSeleccionada, setEntrevistaSeleccionada] = useState(null);
  
  // Datos del Formulario Modal
  const [formData, setFormData] = useState({ fecha: '', hora: '', lugar: '', resumen: '' });
  
  // Entrevistas cargadas del alumno actual (para el acordeón abierto)
  const [entrevistasAlumno, setEntrevistasAlumno] = useState([]); 

  useEffect(() => {
    cargarAlumnos();
  }, [indice_grupo]);

  const cargarAlumnos = async () => {
    try {
      const res = await maestrosService.getAlumnos(indice_grupo);
      if(res.success) setAlumnos(res.data);
    } catch (error) { console.error(error); } 
    finally { setLoading(false); }
  };

  // Filtrado y Paginación
  const alumnosFiltrados = alumnos.filter(a => 
    `${a.nombre} ${a.apellidoP} ${a.apellidoM} ${a.num_control_alum}`.toLowerCase().includes(busqueda.toLowerCase())
  );
  
  const totalPaginas = Math.ceil(alumnosFiltrados.length / ITEMS_POR_PAGINA);
  const alumnosPaginados = alumnosFiltrados.slice(
    (paginaActual - 1) * ITEMS_POR_PAGINA, 
    paginaActual * ITEMS_POR_PAGINA
  );

  // Manejo de Accordion (Cargar entrevistas al abrir)
  const handleAccordionSelect = async (eventKey) => {
    if (eventKey) { // Si se abre un item (eventKey es el num_control)
        const res = await maestrosService.getEntrevistas(eventKey);
        if(res.success) setEntrevistasAlumno(res.data);
    }
  };

  // Abrir Modal Crear
  const handleOpenCrear = (alumno) => {
    setAlumnoSeleccionado(alumno);
    setModoModal('crear');
    setFormData({ fecha: '', hora: '', lugar: '', resumen: '' });
    setShowModal(true);
  };

  // Abrir Modal Editar Resumen
  const handleOpenEditar = (entrevista) => {
    setEntrevistaSeleccionada(entrevista);
    setModoModal('editar_resumen');
    setFormData({ ...formData, resumen: entrevista.resumen || '' });
    setShowModal(true);
  };

  // Abrir Modal Reprogramar
  const handleOpenReprogramar = (entrevista, alumno) => {
    setEntrevistaSeleccionada(entrevista);
    setAlumnoSeleccionado(alumno); // Necesitamos datos del alumno para el correo
    setModoModal('reprogramar');
    // Cargar datos actuales
    // Convertir fecha ISO a YYYY-MM-DD para el input
    const fechaISO = new Date(entrevista.fecha).toISOString().split('T')[0];
    setFormData({ fecha: fechaISO, hora: entrevista.hora, lugar: entrevista.lugar, resumen: '' });
    setShowModal(true);
  };

  const handleSubmit = async () => {
    try {
        let res;
        if (modoModal === 'crear') {
            res = await maestrosService.createEntrevista({
                ...formData, num_control_alum: alumnoSeleccionado.num_control_alum
            });
        } else if (modoModal === 'editar_resumen') {
            res = await maestrosService.updateResumen({
                id_entrevista: entrevistaSeleccionada.id_entrevista, resumen: formData.resumen
            });
        } else if (modoModal === 'reprogramar') {
            res = await maestrosService.reprogramar({
                id_entrevista: entrevistaSeleccionada.id_entrevista,
                fecha: formData.fecha, hora: formData.hora, lugar: formData.lugar,
                num_control_alum: alumnoSeleccionado.num_control_alum
            });
        }

        if (res.success) {
            alert(res.message);
            setShowModal(false);
            // Recargar entrevistas del alumno actual
            const currentKey = alumnoSeleccionado ? alumnoSeleccionado.num_control_alum : entrevistaSeleccionada.num_control_alum;
            handleAccordionSelect(currentKey);
        }
    } catch (error) { alert('Error al procesar'); }
  };

  return (
    <div className="bg-tec-full min-vh-100 p-4 pt-5">
      <div className="container">
        {/* Header */}
        <div className="d-flex justify-content-between align-items-center mb-4 text-white">
            <div>
                <h2 className="fw-bold">{state?.grupo?.letra_grupo || 'Grupo'}</h2>
                <span className="badge bg-secondary fs-6">{state?.grupo?.periodo}</span>
            </div>
            <button className="btn btn-outline-light" onClick={() => navigate('/maestro/dashboard')}>Regresar</button>
        </div>

        {/* Buscador */}
        <div className="card shadow-sm mb-4 border-0">
            <div className="card-body p-3 d-flex align-items-center">
                <FaSearch className="text-muted me-3" />
                <input 
                    type="text" className="form-control border-0" 
                    placeholder="Buscar alumno por nombre o número de control..." 
                    value={busqueda}
                    onChange={(e) => { setBusqueda(e.target.value); setPaginaActual(1); }}
                />
            </div>
        </div>

        {/* Lista Accordion */}
        <div className="card border-0 shadow-lg rounded-3 overflow-hidden">
            <div className="card-body p-0">
                <Accordion onSelect={handleAccordionSelect}>
                    {alumnosPaginados.map((alum) => (
                        <Accordion.Item eventKey={alum.num_control_alum} key={alum.num_control_alum}>
                            <Accordion.Header>
                                <div className="d-flex w-100 justify-content-between pe-3">
                                    <span className="fw-bold text-primary">{alum.num_control_alum}</span>
                                    <span className="text-dark text-uppercase">{alum.nombre} {alum.apellidoP} {alum.apellidoM}</span>
                                </div>
                            </Accordion.Header>
                            <Accordion.Body className="bg-light">
                                <div className="d-flex gap-3 mb-4">
                                    <button className="btn btn-primary" onClick={() => navigate(`/maestro/resultados/${alum.num_control_alum}`)}>
                                        <FaSearch className="me-2" /> Ver Informe
                                    </button>
                                    <button className="btn btn-success" onClick={() => handleOpenCrear(alum)}>
                                        <FaCalendarAlt className="me-2" /> Programar Entrevista
                                    </button>
                                </div>
                                
                                <h6 className="fw-bold border-bottom pb-2 mb-3">Historial de Entrevistas</h6>
                                {entrevistasAlumno.length === 0 ? (
                                    <p className="text-muted small fst-italic">Sin entrevistas registradas.</p>
                                ) : (
                                    <div className="row g-3">
                                        {entrevistasAlumno.map(ent => (
                                            <div key={ent.id_entrevista} className="col-12">
                                                <div className="card border-start border-4 border-info shadow-sm">
                                                    <div className="card-body py-2 d-flex justify-content-between align-items-center flex-wrap gap-2">
                                                        <div>
                                                            <div className="fw-bold"><FaCalendarAlt /> {new Date(ent.fecha).toLocaleDateString()} - {ent.hora}</div>
                                                            <div className="small text-muted">Lugar: {ent.lugar}</div>
                                                            <div className="small mt-1 text-dark">Resumen: {ent.resumen || 'Sin resumen'}</div>
                                                        </div>
                                                        <div className="d-flex gap-2">
                                                            <button className="btn btn-sm btn-outline-secondary" onClick={() => handleOpenEditar(ent)}>
                                                                <FaEdit /> Editar Resumen
                                                            </button>
                                                            <button className="btn btn-sm btn-outline-warning" onClick={() => handleOpenReprogramar(ent, alum)}>
                                                                Reprogramar
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </Accordion.Body>
                        </Accordion.Item>
                    ))}
                </Accordion>
                {alumnosFiltrados.length === 0 && <div className="p-4 text-center">No hay alumnos.</div>}
            </div>
            
            {/* Paginación */}
            {totalPaginas > 1 && (
                <div className="card-footer bg-white d-flex justify-content-between align-items-center p-3">
                    <button className="btn btn-outline-primary btn-sm" disabled={paginaActual === 1} onClick={() => setPaginaActual(p => p - 1)}>
                        <FaChevronLeft /> Anterior
                    </button>
                    <span className="text-muted small">Página {paginaActual} de {totalPaginas}</span>
                    <button className="btn btn-outline-primary btn-sm" disabled={paginaActual === totalPaginas} onClick={() => setPaginaActual(p => p + 1)}>
                        Siguiente <FaChevronRight />
                    </button>
                </div>
            )}
        </div>

        {/* MODAL UNIVERSAL (Crear / Editar / Reprogramar) */}
        <Modal show={showModal} onHide={() => setShowModal(false)} centered>
            <Modal.Header closeButton className="bg-primary text-white">
                <Modal.Title>
                    {modoModal === 'crear' && 'Programar Entrevista'}
                    {modoModal === 'editar_resumen' && 'Editar Resumen'}
                    {modoModal === 'reprogramar' && 'Reprogramar Entrevista'}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {/* Campos para Crear y Reprogramar */}
                {(modoModal === 'crear' || modoModal === 'reprogramar') && (
                    <>
                        <div className="mb-3">
                            <label className="form-label fw-bold">Fecha</label>
                            <input type="date" className="form-control" value={formData.fecha} onChange={(e) => setFormData({...formData, fecha: e.target.value})} />
                        </div>
                        <div className="mb-3">
                            <label className="form-label fw-bold">Hora</label>
                            <input type="time" className="form-control" value={formData.hora} onChange={(e) => setFormData({...formData, hora: e.target.value})} />
                        </div>
                        <div className="mb-3">
                            <label className="form-label fw-bold">Lugar</label>
                            <input type="text" className="form-control" placeholder="Ej: Cubículo 4" value={formData.lugar} onChange={(e) => setFormData({...formData, lugar: e.target.value})} />
                        </div>
                    </>
                )}

                {/* Campo solo para Editar Resumen */}
                {modoModal === 'editar_resumen' && (
                    <div className="mb-3">
                        <label className="form-label fw-bold">Resumen / Notas</label>
                        <textarea className="form-control" rows="4" value={formData.resumen} onChange={(e) => setFormData({...formData, resumen: e.target.value})}></textarea>
                    </div>
                )}
            </Modal.Body>
            <Modal.Footer>
                <button className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancelar</button>
                <button className="btn btn-primary" onClick={handleSubmit}>Guardar</button>
            </Modal.Footer>
        </Modal>

      </div>
    </div>
  );
};

export default ListaAlumnosPage;