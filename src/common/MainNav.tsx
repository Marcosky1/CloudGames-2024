import { Link } from "react-router-dom"

function MainNav() {
    return (
        <nav className="navbar navbar-expand-lg bg-body-tertiary sticky-top bg-dark navbar-dark">
            <div className="container">
                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                        <li className="nav-item">
                            <Link className="nav-link" to="/">Home</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/game">Game</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/Memory">Memory</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/Shoter">Shoter</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/Contact">Contacto</Link>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    )
}

export default MainNav