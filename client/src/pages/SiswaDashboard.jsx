import React, { useEffect, useState } from 'react';
import { Container, Card, Button, Navbar, Nav, Row, Col, Form, InputGroup } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const SiswaDashboard = () => {
  const [books, setBooks] = useState([]);
  const [search, setSearch] = useState('');
  const namaSiswa = localStorage.getItem('nama');
  const navigate = useNavigate();

  useEffect(() => {
    fetchBooks();
  }, [search]);

  const fetchBooks = async () => {
    const res = await axios.get(`http://localhost:5000/api/books?search=${search}`);
    setBooks(res.data);
  };

  const handleBorrow = async (bookId) => {
    const userId = localStorage.getItem('userId');
    const tgl = new Date().toISOString().split('T')[0];
    try {
      await axios.post('http://localhost:5000/api/transactions/borrow', {
        user_id: userId, book_id: bookId, tgl_pinjam: tgl
      });
      alert('Berhasil meminjam buku!');
      fetchBooks();
    } catch (err) {
      alert(err.response?.data?.message || 'Gagal meminjam');
    }
  };

  return (
    <>
      <Navbar bg="primary" variant="dark" className="mb-4 shadow">
        <Container>
          <Navbar.Brand className="fw-bold">PerpusDigital Siswa</Navbar.Brand>
          <Navbar.Text className="text-white">Halo, <strong>{namaSiswa}</strong></Navbar.Text>
          <Nav className="ms-auto">
            <Button variant="light" size="sm" onClick={() => {localStorage.clear(); navigate('/login')}}>Logout</Button>
          </Nav>
        </Container>
      </Navbar>

      <Container>
        <InputGroup className="mb-4 shadow-sm">
          <Form.Control placeholder="Cari judul buku..." onChange={(e) => setSearch(e.target.value)} />
          <Button variant="primary">Cari</Button>
        </InputGroup>

        <h4 className="mb-3 fw-bold">Daftar Buku Tersedia</h4>
        <Row>
          {books.map(b => (
            <Col md={3} key={b.id} className="mb-4">
              <Card className="h-100 shadow-sm border-0">
                <Card.Body>
                  <Card.Title className="fw-bold">{b.judul}</Card.Title>
                  <Card.Text className="text-muted mb-1 small">{b.penulis}</Card.Text>
                  <Card.Text className="badge bg-info text-dark">Stok: {b.stok}</Card.Text>
                </Card.Body>
                <Card.Footer className="bg-white border-0">
                  <Button variant="outline-primary" className="w-100" 
                    disabled={b.stok === 0} onClick={() => handleBorrow(b.id)}>
                    {b.stok > 0 ? 'Pinjam Buku' : 'Stok Habis'}
                  </Button>
                </Card.Footer>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
    </>
  );
};

export default SiswaDashboard;