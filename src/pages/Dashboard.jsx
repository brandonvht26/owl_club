import {Link} from 'react-router-dom'

const Dashboard = () => {
    return (
        <>
            <h1>Dashboard</h1>
            <button>
                <Link to="/home">Regresar a la pagina principal</Link>
            </button>
            
        </>
    )
}

export default Dashboard