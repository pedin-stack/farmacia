import React from 'react';
import { useNavigate } from 'react-router-dom'; // 1. Importação necessária

const Login = () => {
  const brandColor = '#7F56D9';
  const navigate = useNavigate(); 

  // 3. Função que lida com o login
  const handleLogin = (e) => {
    e.preventDefault(); // Evita que a página recarregue
    
    // Aqui você colocaria a lógica de validação de senha no futuro
    
    navigate('/dashboard'); // Redireciona para a rota /dashboard
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
              className="d-inline-flex align-items-center justify-content-center rounded-3 mb-3" 
              style={{ width: '50px', height: '50px', backgroundColor: '#f4ebff' }}
            >
              <div 
                className="rounded-circle" 
                style={{ width: '24px', height: '24px', backgroundColor: brandColor, filter: 'blur(4px)' }} 
              ></div>
              <div 
                className="position-absolute rounded-circle" 
                style={{ width: '12px', height: '12px', backgroundColor: brandColor }} 
              ></div>
            </div>
            
            <h2 className="fw-bold mb-2 text-dark">Insira login e senha para entrar</h2>
          </div>

          {/* Formulário com evento onSubmit */}
          <form onSubmit={handleLogin}>
            {/* Campo Email */}
            <div className="mb-3">
              <label htmlFor="email" className="form-label fw-medium text-secondary small">Email</label>
              <input 
                type="email" 
                className="form-control py-2" 
                id="email" 
                required // Adicionei 'required' para validação básica
                placeholder="Insira seu email" 
              />
            </div>

            {/* Campo Password */}
            <div className="mb-3">
              <label htmlFor="password" className="form-label fw-medium text-secondary small">Senha</label>
              <input 
                type="password" 
                className="form-control py-2" 
                id="password" 
                required 
                placeholder="••••••••" 
              />
            </div>
            <button 
              type="submit" // Mudei para submit para funcionar com o Enter
              className="btn w-100 text-white fw-bold py-2 mb-3" 
              style={{ backgroundColor: brandColor, borderColor: brandColor }}
            >
              Logar
            </button>
          
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;