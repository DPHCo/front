import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { Form, Button, ListGroup, Alert } from "react-bootstrap";
import Cookies from 'universal-cookie';
const cookies = new Cookies();

const EncuestasList = () => {
    const [encuestas, setEncuestas] = useState([]);
    const [encuestaSelect, setEncuestaSelect] = useState(null);
    const [respuestas, setRespuestas] = useState({});
    const [totalRes, setTotalRes] = useState([]);

    useEffect( () => {
        const obtenerRespuestas = async () => {
            const datos = await axios.get('http://localhost:8080/encuesta/respuesta/all');
            console.log(datos);
            setTotalRes(datos.data);
        }
        obtenerRespuestas();
    }, [] );

    useEffect( () => {
        const obtenerEncuestas = async () => {
            const datos = await axios.get('http://localhost:8080/encuesta/obtain/all');
            console.log(datos);
            setEncuestas(datos.data);
        }
        obtenerEncuestas();
    }, [] )

    const handleClick = (encuesta, st = '') => {
        if(st == ''){
            setEncuestaSelect(encuesta);
        }
        else{
            encuesta.activo = st;
            encuesta.total = existRes(cookies.get('userId'), encuesta._id, 'obtain');
            setEncuestaSelect(encuesta);
        }
        
    };

    const existRes = (id, enc_id, st = '') => {
        if(st == ''){
            let flag = false;
            totalRes.map( ({ usuarioId, encuestaId }) => {
                    if(encuestaId === enc_id){
                        usuarioId.map( idx => {
                            if(idx === id) flag = true;
                        } );
                    }
            } );
            return flag;
        }
        else{
            let flag = 0;
            totalRes.map( ({ respuestas, encuestaId }) => {
                    if(encuestaId === enc_id){
                        flag = respuestas[0].resp.length;
                    }
            } );
            return flag;
        }
       
    }

    const handleRespuestaChange = (campoId, e) => {
        setRespuestas({...respuestas, [campoId]: e.target.value });
        
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const responseData = {
            encuestaId: encuestaSelect._id,
            usuarioId: cookies.get('userId'),
            respuestas: Object.entries(respuestas).map( ([campoId, respuesta]) => ({
                campoId,
                respuesta
            }) )
        };
        console.log(responseData);
        try {
            await axios.post('http://localhost:8080/encuesta/respuesta', responseData);
            setRespuestas({});
            window.location.href = '/lista-encuestas';
        } catch (error) {
            console.log(error);
        }
    }

  return (
    <div className='container'>
        <ListGroup>
            {
                encuestas.map( (enc, idx) => (
                    
                    ( encuestaSelect !== null && encuestaSelect._id === enc._id ) ? (
                        enc.idCreador === cookies.get('userId') ? (
                            <ListGroup.Item key={idx} onClick={ () => handleClick(enc) } active>
                                {enc.titulo+'*'}

                            </ListGroup.Item>
                        ) : (
                            <ListGroup.Item key={idx} onClick={ () => handleClick(enc) } active>
                                {enc.titulo}
                            </ListGroup.Item>
                        )
                    ) : (

                        enc.idCreador === cookies.get('userId') ? (
                            ( existRes(cookies.get('userId'), enc._id) == true ) ? (
                                <ListGroup.Item key={idx} style={{ backgroundColor: 'green' }} onClick={ () => handleClick(enc, 'ok') }>
                                {enc.titulo+'*'}
                            </ListGroup.Item>
                            ) : (
                                <ListGroup.Item key={idx} onClick={ () => handleClick(enc) }>
                                {enc.titulo+'*'}
                            </ListGroup.Item>
                            )
                            
                        ) : (
                            ( existRes(cookies.get('userId'), enc._id)) ? (
                                <ListGroup.Item key={idx} style={{ backgroundColor: 'green' }} onClick={ () => handleClick(enc, 'ok') }>
                                {enc.titulo}
                            </ListGroup.Item>
                            ) : (
                                <ListGroup.Item key={idx} onClick={ () => handleClick(enc) }>
                                {enc.titulo}
                            </ListGroup.Item>
                            )
                        )
                    )

                    
                ) )
            }
        </ListGroup>
        {
            encuestaSelect && (
                encuestaSelect.activo === undefined ? (
                    <>
                <Form.Group className='mb-3'>
                    <Form.Label>{ encuestaSelect.titulo }</Form.Label>
                </Form.Group>
                {
                    encuestaSelect.campos.map( ({_id, nombre, type, opciones}) => (

                        type === 'text' ? (
                            <Form.Group className='mb-3'>
                                <Form.Label>{ nombre }</Form.Label>
                                <Form.Control type="text" name="nombre" value={respuestas._id} onChange={ (e) => handleRespuestaChange(_id, e) } onClick={ (e) => console.log(respuestas) }/>
                            </Form.Group>
                        ) : (
                                <Form.Select aria-label={nombre} onChange={ (e) => handleRespuestaChange(_id, e) }>
                                    <option value="">Seleccione una opcion</option>
                                    {
                                        opciones.map( (opcion) => (
                                            <option value={ opcion }>{ opcion }</option>
                                        ))
                                    }
                                </Form.Select>

                            
                        )
                    ))
                }
                <Button variant="primary" type="submit" onClick={ handleSubmit }>
                    Enviar Respuesta
                </Button>
              </>  
                ) : (
                    <>
                <Alert key='info' variant='info'>
                    La encuesta {encuestaSelect.titulo} tiene {encuestaSelect.total} de votos
                </Alert>
                </>   
                )
              
            ) 
        }
    </div>
  )
}

export default EncuestasList;