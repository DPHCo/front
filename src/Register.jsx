import React, { useState } from 'react'
import { Form, Button } from "react-bootstrap";
import './styles.css';
import axios from "axios";

export default function Register() {

	const [nombre, setNombre] = useState('');
	const [password, setPassword] = useState('');
  const [registrado, setRegistrado] = useState(false);

	const handleSubmit = (e) => {
		e.preventDefault();
		
		axios.post('http://localhost:8080/usuario/registro', {
			nombre,
			password
		}).then( result =>  window.location.href = "/" )
			.catch( err => console.log(err) );

	}

    return (
        <div className='container'>
            <h2>Registro</h2>
      <Form onSubmit={ handleSubmit } >
        {/* nombre */}
        <Form.Group controlId="formBasicEmail">
          <Form.Label>Nombre de usuario</Form.Label>
          <Form.Control type="text" name="nombre" value={nombre} placeholder="Introduzca su usuario" onChange={ (e) => setNombre(e.target.value) }/>
        </Form.Group>

        {/* password */}
        <Form.Group controlId="formBasicPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control type="password" name="password" value={password} placeholder="Password" onChange= { (e) => setPassword(e.target.value) } />
        </Form.Group>

        {/* submit button */}
        <Button variant="primary" type="submit">
          Registrar
        </Button>

      </Form>

        </div>
    )
}