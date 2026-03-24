import React from 'react';
import { Modal } from 'react-bootstrap';

const EntrevistaModal = ({ 
  show, 
  onHide, 
  modo, 
  formData, 
  setFormData, 
  onSave 
}) => {
  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton className="bg-primary text-white">
        <Modal.Title>
          {modo === 'crear' && 'Programar Entrevista'}
          {modo === 'editar_resumen' && 'Editar Resumen'}
          {modo === 'reprogramar' && 'Reprogramar Entrevista'}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {/* Campos para Crear y Reprogramar */}
        {(modo === 'crear' || modo === 'reprogramar') && (
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
        {modo === 'editar_resumen' && (
          <div className="mb-3">
            <label className="form-label fw-bold">Resumen / Notas</label>
            <textarea className="form-control" rows="4" value={formData.resumen} onChange={(e) => setFormData({...formData, resumen: e.target.value})}></textarea>
          </div>
        )}
      </Modal.Body>
      <Modal.Footer>
        <button className="btn btn-secondary" onClick={onHide}>Cancelar</button>
        <button className="btn btn-primary" onClick={onSave}>Guardar</button>
      </Modal.Footer>
    </Modal>
  );
};

export default EntrevistaModal;
