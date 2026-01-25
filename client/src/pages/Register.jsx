import React, { useState } from 'react';
import { Form, Button, Container, Card, Alert } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const [formData, setFormData] = useState({ nama: '', username: '', password: '' });
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/register', formData);
      setMessage(res.data.message);
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setMessage(err.response?.data?.error || 'Gagal mendaftar');
    }
  };

  return (
    <Container className="d-flex align-items-center justify-content-center" style={{ minHeight: '100vh' }}>
      <Card style={{ width: '400px' }} className="shadow border-0">
        <Card.Body className="p-4">
          <h3 className="text-center mb-4 fw-bold text-primary">Daftar Anggota</h3>
          {message && <Alert variant="info">{message}</Alert>}
          <Form onSubmit={handleRegister}>
            <Form.Group className="mb-3">
              <Form.Label>Nama Lengkap</Form.Label>
              <Form.Control type="text" placeholder="Masukkan nama" required
                onChange={(e) => setFormData({...formData, nama: e.target.value})} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Username</Form.Label>
              <Form.Control type="text" placeholder="Buat username" required
                onChange={(e) => setFormData({...formData, username: e.target.value})} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Password</Form.Label>
              <Form.Control type="password" placeholder="Buat password" required
                onChange={(e) => setFormData({...formData, password: e.target.value})} />
            </Form.Group>
            <Button variant="primary" className="w-100 py-2" type="submit">Daftar Sekarang</Button>
          </Form>
          <div className="text-center mt-3">Sudah punya akun? <a href="/login" className="text-decoration-none">Login</a></div>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default Register;