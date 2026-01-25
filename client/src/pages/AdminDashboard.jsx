import React, { useEffect, useState } from 'react';
import { Container, Table, Button, Navbar, Nav, Row, Col, Card, Modal, Form } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const [books, setBooks] = useState([]);
  const [unvalidatedUsers, setUnvalidatedUsers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newBook, setNewBook] = useState({ judul: '', penulis: '', penerbit: '', tahun: '', stok: '' });
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const resBooks = await axios.get('http://localhost:5000/api/books');
      setBooks(resBooks.data);
      const resUsers = await axios.get('http://localhost:5000/api/users/unvalidated');
      setUnvalidatedUsers(resUsers.data);
    } catch (err) { console.error(err); }
  };

  const handleAddBook = async (e) => {
    e.preventDefault();
    await axios.post('http://localhost:5000/api/books', newBook);
    setShowModal(false);
    setNewBook({ judul: '', penulis: '', penerbit: '', tahun: '', stok: '' });
    fetchData();
  };

  const handleDelete = async (id) => {
    if(window.confirm("Hapus buku ini?")) {
      await axios.delete(`http://localhost:5000/api/books/${id}`);
      fetchData();
    }
  };

  const handleValidate = async (id) => {
    await axios.put(`http://localhost:5000/api/users/validate/${id}`);
    fetchData();
  };

  return (
    <>
      <Navbar bg="dark" variant="dark" expand="lg" className="mb-4 shadow">
        <Container>
          <Navbar.Brand className="fw-bold">Admin Perpustakaan Digital</Navbar.Brand>
          <Nav className="ms-auto">
            <Button variant="outline-light" size="sm" onClick={() => {localStorage.clear(); navigate('/login')}}>Logout</Button>
          </Nav>
        </Container>
      </Navbar>

      <Container>
        <Row>
          {/* Bagian CRUD Buku [cite: 60, 65] */}
          <Col md={8}>
            <Card className="mb-4 shadow-sm border-0">
              <Card.Header className="bg-primary text-white d-flex justify-content-between align-items-center">
                <h5 className="mb-0">Daftar Buku</h5>
                <Button variant="light" size="sm" onClick={() => setShowModal(true)}>+ Tambah Buku</Button>
              </Card.Header>
              <Card.Body>
                <Table responsive hover>
                  <thead>
                    <tr>
                      <th>Judul</th>
                      <th>Stok</th>
                      <th>Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {books.map(b => (
                      <tr key={b.id}>
                        <td><strong>{b.judul}</strong><br/><small className="text-muted">{b.penulis}</small></td>
                        <td>{b.stok}</td>
                        <td>
                          <Button variant="danger" size="sm" onClick={() => handleDelete(b.id)}>Hapus</Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </Card.Body>
            </Card>
          </Col>

          {/* Bagian Validasi Anggota [cite: 51, 62] */}
          <Col md={4}>
            <Card className="shadow-sm border-0">
              <Card.Header className="bg-success text-white fw-bold">Validasi Siswa Baru</Card.Header>
              <Card.Body>
                {unvalidatedUsers.length === 0 ? <p className="text-muted text-center">Tidak Ada Siswa Baru</p> : 
                  unvalidatedUsers.map(u => (
                    <div key={u.id} className="d-flex justify-content-between align-items-center mb-2 border-bottom pb-2">
                      <div><strong>{u.nama}</strong><br/><small>{u.username}</small></div>
                      <Button variant="success" size="sm" onClick={() => handleValidate(u.id)}>Terima</Button>
                    </div>
                  ))
                }
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>

      {/* Modal Tambah Buku */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton><Modal.Title>Tambah Buku Baru</Modal.Title></Modal.Header>
        <Form onSubmit={handleAddBook}>
          <Modal.Body>
            <Form.Group className="mb-2"><Form.Label>Judul</Form.Label><Form.Control type="text" required onChange={(e)=>setNewBook({...newBook, judul: e.target.value})}/></Form.Group>
            <Form.Group className="mb-2"><Form.Label>Penulis</Form.Label><Form.Control type="text" required onChange={(e)=>setNewBook({...newBook, penulis: e.target.value})}/></Form.Group>
            <Form.Group className="mb-2"><Form.Label>Penerbit</Form.Label><Form.Control type="text" required onChange={(e)=>setNewBook({...newBook, penerbit: e.target.value})}/></Form.Group>
            <Row>
              <Col><Form.Group className="mb-2"><Form.Label>Tahun</Form.Label><Form.Control type="number" required onChange={(e)=>setNewBook({...newBook, tahun: e.target.value})}/></Form.Group></Col>
              <Col><Form.Group className="mb-2"><Form.Label>Stok</Form.Label><Form.Control type="number" required onChange={(e)=>setNewBook({...newBook, stok: e.target.value})}/></Form.Group></Col>
            </Row>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>Batal</Button>
            <Button variant="primary" type="submit">Simpan Buku</Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </>
  );
};

export default AdminDashboard;