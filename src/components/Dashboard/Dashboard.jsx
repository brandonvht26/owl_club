// src/components/Dashboard.js
import { authFirebase } from '../../firebase';
import { useForm } from "react-hook-form";
import { dbFirebase } from "../../firebase";
import { addDoc, collection } from "firebase/firestore";
import './Dashboard.css';
import { Link } from 'react-router';

const Dashboard = () => {

    const { register, handleSubmit, reset, formState: { errors } } = useForm()

    const handleLogout = async () => {
        try {
            await authFirebase.signOut()
            window.location.href = "/"
        } catch (error) {
            console.log(error);
        }
    }

    const handleCreateQuestion = async (data) => {
        try {
            await addDoc(collection(dbFirebase, "preguntas"), data)
            reset()
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <main>
            <section className="header_dashboard">
                <h2>Dashboard</h2>
                <div className="header-actions">
                    <button className="logout-btn" onClick={handleLogout}>Cerrar Sesión</button>
                    <button className="home-btn">
                        <Link to="/home">Volver al Inicio</Link>
                    </button>
                </div>
            </section>

            <section className="container_dashboard">

                <section className="form-section">
                    <h4>Crear pregunta</h4>
                    <p>¿Tienes una duda? Publícala aquí para que la comunidad te ayude.</p>

                    <form className="question-form" onSubmit={handleSubmit(handleCreateQuestion)}>

                        <label>Título:</label>
                        <input type="text" placeholder="Título de la pregunta"
                            {...register("titulo",{ required: true })}
                        />
                        {errors.titulo && <span className="errors">El título es requerido</span>}

                        <label>Materia:</label>
                        <select {...register("materia", { required: true })}>
                            <option value="">Selecciona una materia</option>
                            <option value="Lenguaje">Lenguaje</option>
                            <option value="Matemática">Matemática</option>
                            <option value="Física">Física</option>
                            <option value="Biología">Biología</option>
                            <option value="Artes">Artes</option>
                            <option value="Inglés">Inglés</option>
                        </select>
                        {errors.materia && <span className="errors">La materia es requerida</span>}

                        <label>Contenido:</label>
                        <textarea placeholder="Describe tu pregunta con detalle"
                            {...register("descripcion",{ required: true })}
                        />
                        {errors.descripcion && <span className="errors">La descripción es requerida</span>}

                        <input className="btn" type="submit" value="Publicar" />
                    </form>
                </section>

                <section className="list-section">
                    <h4>Preguntas recientes</h4>
                    <div className="no-questions">No existen preguntas registradas aún...</div>
                    <p>Las preguntas publicadas se mostrarán aquí para que otros estudiantes puedan responderlas.</p>
                </section>

            </section>

            <footer className="footer_dashboard">
                <p>"Conocimiento que nunca duerme" - Owl Club</p>
                <p>© 2024 Owl Club. Todos los derechos reservados.</p>
            </footer>
        </main>
    )
}

export default Dashboard;
