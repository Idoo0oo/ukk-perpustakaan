import { useState, useEffect } from 'react';
import axios from 'axios';

/**
 * Hook ringan untuk mengambil foto profil peminjam.
 * Return: { fotoUrl } — null jika tidak ada foto.
 */
const useProfilePhoto = () => {
    const [fotoUrl, setFotoUrl] = useState(null);
    const token = localStorage.getItem('token');

    useEffect(() => {
        if (!token) return;
        axios.get('http://localhost:5000/api/profile', {
            headers: { Authorization: `Bearer ${token}` }
        }).then(res => {
            if (res.data?.FotoProfil) {
                setFotoUrl(`http://localhost:5000/uploads/${res.data.FotoProfil}`);
            }
        }).catch(() => {});
    }, [token]);

    return { fotoUrl };
};

export default useProfilePhoto;
