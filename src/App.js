
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Login from './pages/login';
import 'bootstrap/dist/css/bootstrap.min.css';
import Dashboard from './pages/Dashboard';

const App = () => {
    return (
        <Router>
            {/* Estrutura Flexbox para rodapé fixo */}
            <div className="d-flex flex-column min-vh-100 bg-light">
                
                {/*<Header /> fixo no topo */}
          
                
                {/* Main: Ocupa o espaço restante da tela */}
                <main className="flex-grow-1">
                    <Routes>
                        <Route path="/" element={<Login />} />
                        <Route path="/dashboard" element={<Dashboard />} />
                    </Routes>
                </main>

                {/* Footer <Footer /> fixo na base */}
    
            </div>
        </Router>
    );
};

export default App;
