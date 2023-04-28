import React from "react";
import { Route, Navigate } from "react-router-dom";
import Cookies from 'universal-cookie';

const cookies = new Cookies();

const RutaProtegida = ({ path, element: Component, ...rest }) => {
    const token = cookies.get("TOKEN");

    if (token) {
        return <Route path={path} element={<Component />} {...rest} />;
    }
    else {
        return <Route path={path} element={<Navigate to="/" replace />} {...rest} />;
    }
}

export default RutaProtegida;