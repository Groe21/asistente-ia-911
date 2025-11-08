import React from 'react';
import Icon from '../../../components/AppIcon';

const LoginFooter = () => {
  const currentYear = new Date()?.getFullYear();

  return (
    <div className="mt-8 space-y-6">
      {/* Support Information */}
      <div className="bg-muted/50 rounded-lg p-4">
        <h3 className="text-sm font-medium text-foreground mb-3 flex items-center">
          <Icon name="HelpCircle" size={16} className="mr-2 text-accent" />
          Soporte Técnico
        </h3>
        <div className="space-y-2 text-xs text-muted-foreground">
          <div className="flex items-center space-x-2">
            <Icon name="Mail" size={14} />
            <span>soporte@ia911assist.es</span>
          </div>
          <div className="flex items-center space-x-2">
            <Icon name="Phone" size={14} />
            <span>+34 900 123 456</span>
          </div>
          <div className="flex items-center space-x-2">
            <Icon name="Clock" size={14} />
            <span>Lunes a Viernes: 8:00 - 18:00 CET</span>
          </div>
        </div>
      </div>

      {/* Security Notice */}
      <div className="bg-success/10 border border-success/20 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <Icon name="Shield" size={16} className="text-success mt-0.5" />
          <div>
            <h4 className="text-sm font-medium text-success mb-1">
              Conexión Segura
            </h4>
            <p className="text-xs text-success/80">
              Sus datos están protegidos con cifrado SSL de 256 bits y 
              cumplimos con las normativas GDPR europeas.
            </p>
          </div>
        </div>
      </div>

      {/* Links Section */}
      <div className="flex flex-wrap justify-center gap-4 text-xs text-muted-foreground">
        <button className="hover:text-foreground transition-clinical">
          Política de Privacidad
        </button>
        <span>•</span>
        <button className="hover:text-foreground transition-clinical">
          Términos de Uso
        </button>
        <span>•</span>
        <button className="hover:text-foreground transition-clinical">
          Guía de Usuario
        </button>
      </div>

      {/* Copyright */}
      <div className="text-center pt-4 border-t border-border">
        <p className="text-xs text-muted-foreground">
          © {currentYear} IA-911 Assist. Todos los derechos reservados.
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          Desarrollado para fines educativos y de entrenamiento médico.
        </p>
      </div>

      {/* Version Info */}
      <div className="text-center">
        <span className="inline-flex items-center px-2 py-1 bg-muted rounded text-xs text-muted-foreground font-medical-data">
          <Icon name="Code" size={12} className="mr-1" />
          v2.1.0 - Build 2024.11.02
        </span>
      </div>
    </div>
  );
};

export default LoginFooter;