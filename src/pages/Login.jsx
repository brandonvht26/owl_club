import {Link} from 'react-router'

const Login = () => {
    return (
        <>
            <h1>Pagina de inicio de Sesión</h1>
            <button>
                <Link to="/">Regresar a la pagina principal</Link>
            </button>
        </>

    )
}

export default Login