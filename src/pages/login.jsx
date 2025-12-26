import React from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const brandColor = '#7F56D9';
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    navigate('/dashboard');
  };

  return (
    <div className="d-flex align-items-center justify-content-center min-vh-100 bg-light">
      <div 
        className="card border-0 shadow-sm p-4" 
        style={{ maxWidth: '450px', width: '100%', borderRadius: '12px' }}
      >
        <div className="card-body px-4">
          
          {/* Logo / Ícone do Topo */}
          <div className="text-center mb-4">
            <div 
              className="d-inline-flex align-items-center justify-content-center rounded-circle mb-3" 
              style={{ width: '64px', height: '64px', backgroundColor: '#f4ebff' }}
            >
              
              {/* --- INÍCIO: SVG MAIS COMPRIDO (SLIM) --- */}
<svg 
  width="40" 
  height="40" 
  viewBox="0 0 64 64" 
  fill="none" 
  xmlns="http://www.w3.org/2000/svg"
>
  <g transform="rotate(45 32 32)">
    {/* Corpo da cápsula (Mais largo e um pouco mais fino) */}
    {/* x=5, y=21, largura=54 (antes era 40), altura=22 (antes era 28) */}
    <rect 
      x="5" y="21" 
      width="54" height="22" 
      rx="11" 
      fill="white" 
      stroke={brandColor} 
      strokeWidth="3" 
    />
    
    {/* Metade Preenchida (A tampa) */}
    {/* Ajustado matematicamente para coincidir com o novo corpo */}
    <path 
      d="M 32 21 L 48 21 C 54.075 21 59 25.925 59 32 C 59 38.075 54.075 43 48 43 L 32 43 Z" 
      fill={brandColor} 
    />
    
    {/* Linha divisória central */}
    <line x1="32" y1="21" x2="32" y2="43" stroke={brandColor} strokeWidth="2" />

    {/* Reflexo alongado para acompanhar o formato */}
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
              <input 
                type="email" 
                className="form-control py-2" 
                id="email" 
                required 
                placeholder="nome@exemplo.com" 
              />
            </div>

            <div className="mb-3">
              <label htmlFor="password" className="form-label fw-bold text-secondary small">Senha</label>
              <input 
                type="password" 
                className="form-control py-2" 
                id="password" 
                required 
                placeholder="••••••••" 
              />
            </div>
            
            <button 
              type="submit" 
              className="btn w-100 text-white fw-bold py-2 mb-3 shadow-sm" 
              style={{ backgroundColor: brandColor, borderColor: brandColor }}
            >
              Entrar
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;