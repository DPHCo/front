import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { Form, Stack, Button, ListGroup, Alert } from "react-bootstrap";
import './styles.css';
import Cookies from 'universal-cookie';
const cookies = new Cookies();

const UI = () => {

    const [encuestas, setEncuestas] = useState([]);

    useEffect(() => {
        const obtenerRespuestas = async () => {
            const datos = await axios.get('http://localhost:8080/encuesta/' + cookies.get('userId'));
            console.log(datos);
            setEncuestas(datos.data);
        }
        obtenerRespuestas();
    }, [])

    const handleClick = async (encuesta) => {
        const datos = await axios.delete('http://localhost:8080/encuesta/del', {
           params: encuesta
        });
        if (datos.data.message === 'ok') {
            const newEncuestas = encuestas.filter(enc => enc._id !== encuesta._id);
            console.log(newEncuestas);
            setEncuestas(newEncuestas);
        } else{
            console.log(datos);
        }
        
    };

    return (
        <div className='container'>
            <Stack gap={2} className='col-md-5 mx-auto'>
                {
                    encuestas.map((enc, idx) => (
                        <Button variant='secondary' onClick={() => handleClick(enc)}> {enc.titulo} </Button>
                    ))
                }
            </Stack>
        </div>
    )
}

export default UI;