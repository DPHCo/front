import React, { useState } from 'react'
import { Form, Button } from "react-bootstrap";
import './styles.css';
import axios from 'axios';
import Cookies from "universal-cookie";
const cookies = new Cookies();

export default function Login() {

  const [nombre, setNombre] = useState('');
  const [password, setPassword] = useState('');
  const [logueado, setLogueado] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post('http://localhost:8080/usuario/login', {
      nombre,
      password
    }).then(result => {
      setLogueado(true);
      cookies.set("TOKEN", result.data.token, {
        path: "/"
      });
      cookies.set('userId', result.data.idUsuario, {
        path: "/"
      });
      window.location.href = "/";
    })
      .catch(err => console.log(err));

  }

  return (

    <div className='container'>
      <h2>Iniciar Sesión</h2>
      <Form onSubmit={handleSubmit}>
        {/* nombre */}
        <Form.Group controlId="formBasicEmail2">
          <Form.Label>Nombre de usuario</Form.Label>
          <Form.Control type="text" name="nombre" value={nombre} placeholder="Introduzca su usuario" onChange={(e) => setNombre(e.target.value)} />
        </Form.Group>

        {/* password */}
        <Form.Group controlId="formBasicPassword2">
          <Form.Label>Password</Form.Label>
          <Form.Control type="password" name="password" value={password} placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
        </Form.Group>

        {/* submit button */}
        <Button variant="primary" type="submit">
          Loguearse
        </Button>
        <Button variant="success" onClick={ (e) => window.location.href = '/registro' }>
          Registrar
        </Button>
        {logueado ? (
          <p className="text-success">Usted se ha logueado</p>
        ) : (
          <p className="text-danger">Usted no se encuentra logueado</p>
        )}
      </Form>

    </div>
  )
}