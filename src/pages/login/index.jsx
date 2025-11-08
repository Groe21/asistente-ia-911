import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import LoginHeader from './components/LoginHeader';
import LoginForm from './components/LoginForm';
import LoginFooter from './components/LoginFooter';

const LoginPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is already logged in
    const storedUser = localStorage.getItem('ia911_user');
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        // Redirect to dashboard if valid session exists
        if (userData?.username) {
          navigate('/patient-dashboard');
        }
      } catch (error) {
        // Clear invalid session data
        localStorage.removeItem('ia911_user');
      }
    }

    // Set page title
    document.title = 'Iniciar Sesión - IA-911 Assist';
  }, [navigate]);

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
            <LoginHeader />

            {/* Form Section */}
            <LoginForm />

            {/* Footer Section */}
            <LoginFooter />
          </div>

          {/* Additional Information Card */}
          <div className="mt-6 bg-card/50 backdrop-blur-sm border border-border/50 rounded-lg p-4">
            <div className="text-center">
              <h3 className="text-sm font-medium text-foreground mb-2">
                ¿Nuevo en el sistema?
              </h3>
              <p className="text-xs text-muted-foreground mb-3">
                Contacte con su administrador para obtener credenciales de acceso 
                al sistema de entrenamiento médico.
              </p>
              <button className="text-sm text-primary hover:text-primary/80 transition-clinical font-medium">
                Solicitar Acceso
              </button>
            </div>
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