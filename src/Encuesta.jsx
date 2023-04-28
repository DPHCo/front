import axios from 'axios';
import React, { useState } from 'react'
import { Form, Button } from "react-bootstrap";
import Cookies from 'universal-cookie';
const cookies = new Cookies();

const Encuesta = () => {

    const [campos, setCampos] = useState([{
        type: 'text',
        nombre: '',
        opciones: []
    }]);
    const [titulo, setTitulo] = useState('');

    const handleAgregarCampo = () => {
        setCampos([...campos, {
            type: 'text',
            nombre: '',
            opciones: []
        }]);
    };

    const handleEliminar = (index) => {
        setCampos(campos.filter( (_, i) => i !== index ));
    };

    const handleEliminarOpcion = (idxCampo, idxOpcion) => {
        const newCampos = [...campos];
        newCampos[idxCampo].opciones.splice(idxOpcion, 1);
        setCampos(newCampos);
    }

    const handleAgregarOpcion = (idxCampo) => {
        const newCampos = [...campos];
        newCampos[idxCampo].opciones.push('');
        setCampos(newCampos);
    };

    const handleChangeOpcion = (idxCampo, idxOpcion, e) => {
        const newCampos = [...campos];
        newCampos[idxCampo].opciones[idxOpcion] = e.target.value;
        setCampos(newCampos);
    }

    const handleChange = (index, e) => {
        const nuevosCampos = [...campos];
        nuevosCampos[index][e.target.name] = e.target.value;
        setCampos(nuevosCampos);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const encuestaDatos = {campos};
        encuestaDatos.titulo = titulo;
        encuestaDatos.idCreador = cookies.get('userId');
        try {
            await axios.post('http://localhost:8080/encuesta/agregar', encuestaDatos)
            .then( result => {
                alert('Encuesta agregada');
                window.location.href = '/lista-encuestas'
            } )
            .catch( err => console.log(err) );
        } catch (error) {
            console.log(error);
        }
        console.log(encuestaDatos);
    }

  return (
    <div className='container'>
    <Form onSubmit={ handleSubmit }>
        {
            campos.map( (campo, index) => (
                <div key={ index }>
                    <Form.Group className='mb-3'>
                    <Form.Label> Titulo de la encuesta </Form.Label>
                        <Form.Control type="text" name="titulo" value={titulo} onChange={ (e) => setTitulo(e.target.value) } />
                    </Form.Group>
                    <Form.Group className='mb-3'>
                    <Form.Label> Nombre del campo </Form.Label>
                        <Form.Control type="text" name="nombre" value={campo.nombre} onChange={ (e) => handleChange(index, e) } />
                    </Form.Group>
                    <Form.Group className='mb-3'>
                        <Form.Label> Tipo de campo </Form.Label>
                            <Form.Control as="select" name="type" value={ campo.type } onChange={ (e) => handleChange(index, e) }>
                                <option value="text">Texto</option>
                                <option value="textarea">Textarea</option>
                                <option value="select">Seleccion</option>
                            </Form.Control>
                    </Form.Group>
                    {
                        campo.type === 'select' && (
                            <>
                                <Button variant='primary' onClick={ () => handleAgregarOpcion(index) }>Agregar Opcion </Button>
                                {
                                    campo.opciones.map( (opcion, idxOpcion) => (
                                        <div key={ idxOpcion }>
                                            <Form.Group className='mb-3'>
                                                <Form.Label> Opcion </Form.Label>
                                                <Form.Control type="text" value={opcion} onChange={ (e) => handleChangeOpcion(index, idxOpcion, e) }/>
                                            </Form.Group>
                                            <Button variant='danger' onClick={ () => handleEliminarOpcion(index, idxOpcion) }>Eliminar Opcion</Button>
                                        </div>
                                    ))
                                }
                            </>
                        )
                    }
                    <Button variant='danger' onClick={ () => handleEliminar(index) }>Eliminar campo</Button>
                </div>
            ))
        }
        <br />
        <Button variant='primary' onClick={ handleAgregarCampo }>Agregar Campo</Button>
        <br />
        <Button variant='success' type='submit'>Enviar</Button>
    </Form>
    </div>
  )
}

export default Encuesta;