import React, { useState } from 'react';
import { Form, Button, Container, Card, Alert } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/login', { username, password });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('role', res.data.role);
      localStorage.setItem('nama', res.data.nama);
      localStorage.setItem('userId', res.data.id);

      // Arahkan dashboard sesuai role [cite: 38, 40]
      if (res.data.role === 'admin') navigate('/admin');
      else navigate('/siswa');
    } catch (err) {
      setError(err.response?.data?.error || 'Login Gagal');
    }
  };

  return (
    <Container className="d-flex align-items-center justify-content-center" style={{ minHeight: '100vh' }}>
      <Card style={{ width: '400px' }} className="shadow">
        <Card.Body>
          <h2 className="text-center mb-4">Login Perpustakaan</h2>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form onSubmit={handleLogin}>
            <Form.Group className="mb-3">
              <Form.Label>Username</Form.Label>
              <Form.Control type="text" onChange={(e) => setUsername(e.target.value)} required />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Password</Form.Label>
              <Form.Control type="password" onChange={(e) => setPassword(e.target.value)} required />
            </Form.Group>
            <Button className="w-100" type="submit">Login</Button>
          </Form>
          <div className="text-center mt-3">
            Belum punya akun? <a href="/register">Daftar Anggota</a>
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default Login;