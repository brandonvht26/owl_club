import React from 'react'
import {Link} from 'react-router'

const Login = () => {
    return (
        <>
            <h1>Pagina de inicio de Sesión</h1>
            <button>
                <Link to="/home">Ingresar</Link>
            </button>
        </>

    )
}

export default Login