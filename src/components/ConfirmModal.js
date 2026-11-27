import React from 'react';
import { Modal, Button } from 'react-bootstrap';

const ConfirmModal = ({
  show,
  onHide,
  onConfirm,
  title = 'Confirm Action',
  message = 'Are you sure you want to proceed?',
  confirmText = 'Confirm',
  confirmVariant = 'danger',
  loading = false,
}) => {
  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title style={{ fontWeight: 700, color: 'var(--secondary)' }}>{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p style={{ color: 'var(--text-medium)', margin: 0, fontSize: '1rem' }}>{message}</p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="light" onClick={onHide} disabled={loading}>
          Cancel
        </Button>
        <Button
          variant={confirmVariant}
          onClick={onConfirm}
          disabled={loading}
          style={confirmVariant === 'primary' ? { background: 'var(--primary)', border: 'none' } : {}}
        >
          {loading ? (
            <>
              <span className="spinner-border spinner-border-sm me-2" /> Working...
            </>
          ) : (
            confirmText
          )}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ConfirmModal;
