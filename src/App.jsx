import { Col, Row } from "react-bootstrap";
import "./App.css";
import Register from "./Register";
import Login from "./Login";
import { Route, Routes } from "react-router-dom";
import UI from "./UI";
import EncuestasList from "./EncuestasList";
import Encuesta from "./Encuesta";
import Cookies from 'universal-cookie';
import { useEffect, useState } from "react";

const cookies = new Cookies();

function App() {

  const [token, setToken] = useState(null)

  useEffect( () => {
    if(cookies.get("TOKEN")){
      setToken(cookies.get("TOKEN"));
    }
  }, [] )


  const handleClick = (e) => {
    e.preventDefault();

    cookies.remove("TOKEN");
    setToken(null);
  }

  

  if (token) {
    return (
      <>
        <Row>
          <Col className="text-center">
            <h1>Bienvenido a tu App-Encuestas</h1>

            <section id="navigation">
              <a href="/ui">Mis encuestas</a>
              <a href="/lista-encuestas">Lista de Encuestas</a>
              <a href="/nuevaEncuesta">Crear Encuesta</a>
              <a href="/nuevaEncuesta" onClick={ handleClick }>Cerrar Sesion</a>
            </section>
          </Col>
        </Row>
        <Routes>
          <Route path="/" element={<UI />} />
          <Route path="/ui" element={<UI />} />
          <Route path="/lista-encuestas" element={<EncuestasList />} />
          <Route path="/nuevaEncuesta" element={<Encuesta />} />
        </Routes>

      </>

    );
  }
  else {
    return (
      <>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/registro" element={<Register />} />
        </Routes>
      </>
    )
  }


}

export default App;