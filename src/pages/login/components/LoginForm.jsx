import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const LoginForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Mock credentials for different user types
  const mockCredentials = [
    { username: 'admin@ia911.es', password: 'Admin123!', role: 'Administrador' },
    { username: 'medico@ia911.es', password: 'Medico123!', role: 'Médico' },
    { username: 'estudiante@ia911.es', password: 'Estudiante123!', role: 'Estudiante' },
    { username: 'instructor@ia911.es', password: 'Instructor123!', role: 'Instructor' }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e?.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors?.[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData?.username?.trim()) {
      newErrors.username = 'El nombre de usuario es obligatorio';
    } else if (!formData?.username?.includes('@')) {
      newErrors.username = 'Ingrese un email válido';
    }

    if (!formData?.password?.trim()) {
      newErrors.password = 'La contraseña es obligatoria';
    } else if (formData?.password?.length < 6) {
      newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
    }

    setErrors(newErrors);
    return Object.keys(newErrors)?.length === 0;
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Check credentials
      const validCredential = mockCredentials?.find(
        cred => cred?.username === formData?.username && cred?.password === formData?.password
      );

      if (validCredential) {
        // Store user session
        localStorage.setItem('ia911_user', JSON.stringify({
          username: validCredential?.username,
          role: validCredential?.role,
          loginTime: new Date()?.toISOString()
        }));

        // Navigate to dashboard
        navigate('/patient-dashboard');
      } else {
        setErrors({
          general: 'Credenciales incorrectas. Verifique su usuario y contraseña.'
        });
      }
    } catch (error) {
      setErrors({
        general: 'Error de conexión. Intente nuevamente.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = () => {
    alert('Funcionalidad de recuperación de contraseña en desarrollo.\n\nCredenciales de prueba:\n• admin@ia911.es / Admin123!\n• medico@ia911.es / Medico123!\n• estudiante@ia911.es / Estudiante123!');
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* General Error Message */}
        {errors?.general && (
          <div className="p-4 bg-error/10 border border-error/20 rounded-lg">
            <div className="flex items-center space-x-2">
              <Icon name="AlertCircle" size={16} className="text-error" />
              <span className="text-sm text-error font-medium">{errors?.general}</span>
            </div>
          </div>
        )}

        {/* Username Field */}
        <Input
          label="Correo Electrónico"
          type="email"
          name="username"
          value={formData?.username}
          onChange={handleInputChange}
          placeholder="usuario@ia911.es"
          error={errors?.username}
          required
          disabled={isLoading}
          className="w-full"
        />

        {/* Password Field */}
        <div className="relative">
          <Input
            label="Contraseña"
            type={showPassword ? "text" : "password"}
            name="password"
            value={formData?.password}
            onChange={handleInputChange}
            placeholder="Ingrese su contraseña"
            error={errors?.password}
            required
            disabled={isLoading}
            className="w-full pr-12"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-9 text-muted-foreground hover:text-foreground transition-clinical"
            disabled={isLoading}
          >
            <Icon name={showPassword ? "EyeOff" : "Eye"} size={20} />
          </button>
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          variant="default"
          loading={isLoading}
          disabled={isLoading}
          className="w-full"
          iconName="LogIn"
          iconPosition="left"
        >
          {isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
        </Button>

        {/* Forgot Password Link */}
        <div className="text-center">
          <button
            type="button"
            onClick={handleForgotPassword}
            className="text-sm text-primary hover:text-primary/80 transition-clinical"
            disabled={isLoading}
          >
            ¿Olvidó su contraseña?
          </button>
        </div>

        {/* Demo Credentials Info */}
        <div className="mt-6 p-4 bg-muted rounded-lg">
          <h4 className="text-sm font-medium text-foreground mb-2 flex items-center">
            <Icon name="Info" size={16} className="mr-2 text-accent" />
            Credenciales de Demostración
          </h4>
          <div className="space-y-1 text-xs text-muted-foreground font-medical-data">
            <div>• admin@ia911.es / Admin123!</div>
            <div>• medico@ia911.es / Medico123!</div>
            <div>• estudiante@ia911.es / Estudiante123!</div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default LoginForm;