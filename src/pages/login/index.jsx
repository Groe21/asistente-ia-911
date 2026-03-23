import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LoginHeader from './components/LoginHeader';
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';
import LoginFooter from './components/LoginFooter';

const LoginPage = () => {
  const navigate = useNavigate();
  const [showRegister, setShowRegister] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem('ia911_user');
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        if (userData?.cedula) {
          navigate('/patient-dashboard');
        }
      } catch (error) {
        localStorage.removeItem('ia911_user');
        localStorage.removeItem('ia911_token');
      }
    }

    document.title = showRegister ? 'Crear Cuenta - IA-911 Assist' : 'Iniciar Sesión - IA-911 Assist';
  }, [navigate, showRegister]);

  return (
    <div className="min-h-screen bg-background">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-accent/5"></div>
      
      {/* Medical Cross Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-10 left-10 w-8 h-8 border-2 border-primary rotate-45"></div>
        <div className="absolute top-32 right-20 w-6 h-6 border-2 border-accent rotate-12"></div>
        <div className="absolute bottom-20 left-32 w-10 h-10 border-2 border-success rotate-45"></div>
        <div className="absolute bottom-40 right-10 w-4 h-4 border-2 border-warning rotate-12"></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
        <div className="w-full max-w-lg">
          {/* Login Card */}
          <div className="bg-card border border-border rounded-xl shadow-clinical-lg p-8">
            {/* Header Section */}
            {!showRegister && <LoginHeader />}

            {/* Form Section — Login o Registro */}
            {showRegister ? (
              <RegisterForm onShowLogin={() => setShowRegister(false)} />
            ) : (
              <LoginForm onShowRegister={() => setShowRegister(true)} />
            )}

            {/* Footer Section */}
            {!showRegister && <LoginFooter />}
          </div>
        </div>
      </div>

      {/* Emergency Contact Banner */}
      <div className="fixed bottom-0 left-0 right-0 bg-error/10 border-t border-error/20 p-3 z-20">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-sm text-error font-medium">
            ⚠️ IMPORTANTE: Este es un sistema de entrenamiento. En caso de emergencia real, llame al 112
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;