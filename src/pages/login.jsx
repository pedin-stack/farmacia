import React, { useState } from 'react'; 
import { useNavigate } from 'react-router-dom';
import AuthService from '../api/AuthService'; 
import { message } from 'antd'; 
import { Input, Button, Form} from 'antd';
const Login = () => {
  const brandColor = '#7F56D9';
  const navigate = useNavigate();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {

      await AuthService.login(email, password);

      message.success('Login realizado com sucesso!');
      navigate('/dashboard');

    } catch (error) {
      console.error(error);
      message.error('Email ou senha incorretos.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="d-flex align-items-center justify-content-center min-vh-100 bg-light">
      <div className="card border-0 shadow-sm p-4" style={{ maxWidth: '450px', width: '100%', borderRadius: '12px' }}>
        <div className="card-body px-4">

          <div className="text-center mb-4">
            <div
              className="d-inline-flex align-items-center justify-content-center rounded-circle mb-3"
              style={{ width: '64px', height: '64px', backgroundColor: '#f4ebff' }}
            >


              <svg
                width="40"
                height="40"
                viewBox="0 0 64 64"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g transform="rotate(45 32 32)">
                  <rect
                    x="5" y="21"
                    width="54" height="22"
                    rx="11"
                    fill="white"
                    stroke={brandColor}
                    strokeWidth="3"
                  />

                  <path
                    d="M 32 21 L 48 21 C 54.075 21 59 25.925 59 32 C 59 38.075 54.075 43 48 43 L 32 43 Z"
                    fill={brandColor}
                  />

                  <line x1="32" y1="21" x2="32" y2="43" stroke={brandColor} strokeWidth="2" />

                  <ellipse
                    cx="44" cy="28"
                    rx="8" ry="2.5"
                    fill="white"
                    fillOpacity="0.4"
                    transform="rotate(-10 44 28)"
                  />
                </g>
              </svg>

            </div>

            <h2 className="fw-bold mb-2 text-dark">Bem-vindo de volta</h2>
            <p className="text-muted mb-4">Insira suas credenciais para acessar o estoque.</p>
          </div>


          <form onSubmit={handleLogin}>
  <div className="mb-3">
    <label htmlFor="email" className="form-label fw-bold text-secondary small">Email</label>
    {/* REFATORADO: Trocamos o <input> nativo pelo <Input> do Ant Design.
       Usamos size="large" para ficar alto e bonito.
    */}
    <Input
      size="large"
      type="email"
      id="email"
      placeholder="nome@exemplo.com"
      value={email}
      onChange={(e) => setEmail(e.target.value)}
    />
  </div>

  <div className="mb-3">
    <label htmlFor="password" className="form-label fw-bold text-secondary small">Senha</label>
   
    <Input.Password
      size="large"
      id="password"
      placeholder="Digite sua senha"
      value={password}
      onChange={(e) => setPassword(e.target.value)}
     
    />
  </div>

  <button
    type="submit"
    disabled={loading}
    className="btn w-100 text-white fw-bold py-2 mb-3 shadow-sm"
    style={{ backgroundColor: brandColor, borderColor: brandColor }}
  >
    {loading ? 'Entrando...' : 'Entrar'}
  </button>
</form>
        </div>
      </div>
    </div>
  );
};

export default Login;