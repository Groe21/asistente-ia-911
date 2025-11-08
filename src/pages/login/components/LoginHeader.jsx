import React from 'react';
import Icon from '../../../components/AppIcon';

const LoginHeader = () => {
  return (
    <div className="text-center mb-8">
      {/* Logo Section */}
      <div className="flex items-center justify-center mb-6">
        <div className="flex items-center justify-center w-16 h-16 bg-primary rounded-xl shadow-clinical">
          <Icon name="Cross" size={32} color="white" />
        </div>
      </div>

      {/* Application Title */}
      <h1 className="text-3xl font-semibold text-foreground mb-2">
        IA-911 Assist
      </h1>
      
      {/* Subtitle */}
      <p className="text-lg text-muted-foreground mb-4">
        Sistema de Entrenamiento Médico
      </p>

      {/* Welcome Message */}
      <div className="bg-card border border-border rounded-lg p-4 shadow-clinical-sm">
        <h2 className="text-xl font-medium text-foreground mb-2">
          Bienvenido al Sistema
        </h2>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Acceda a la plataforma de simulación de respuesta médica de emergencia 
          diseñada para estudiantes y profesionales de la salud.
        </p>
      </div>

      {/* Features List */}
      <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
        <div className="flex items-center justify-center space-x-2 text-muted-foreground">
          <Icon name="Users" size={16} className="text-accent" />
          <span>Registro de Pacientes</span>
        </div>
        <div className="flex items-center justify-center space-x-2 text-muted-foreground">
          <Icon name="Brain" size={16} className="text-accent" />
          <span>Análisis IA</span>
        </div>
        <div className="flex items-center justify-center space-x-2 text-muted-foreground">
          <Icon name="Activity" size={16} className="text-accent" />
          <span>Monitoreo en Tiempo Real</span>
        </div>
      </div>
    </div>
  );
};

export default LoginHeader;