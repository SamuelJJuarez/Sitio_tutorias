import React from 'react';
import { Modal } from 'react-bootstrap';

const ConfirmModal = ({ show, onHide, onConfirm, titulo, mensaje }) => {
  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton className="bg-danger text-white">
        <Modal.Title>{titulo}</Modal.Title>
      </Modal.Header>
      <Modal.Body className="py-4">
        <h5 className="mb-0 text-center">{mensaje}</h5>
      </Modal.Body>
      <Modal.Footer>
        <button className="btn btn-secondary" onClick={onHide}>Cancelar</button>
        <button className="btn btn-danger" onClick={onConfirm}>Eliminar</button>
      </Modal.Footer>
    </Modal>
  );
};

export default ConfirmModal;
