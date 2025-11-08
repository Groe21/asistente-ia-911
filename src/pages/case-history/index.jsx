import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MainNavigation from '../../components/ui/MainNavigation';
import BreadcrumbTrail from '../../components/ui/BreadcrumbTrail';
import FilterControls from './components/FilterControls';
import CaseTimeline from './components/CaseTimeline';
import StatsSummary from './components/StatsSummary';
import ExportModal from './components/ExportModal';

import Button from '../../components/ui/Button';

const CaseHistory = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [showExportModal, setShowExportModal] = useState(false);
  const [filters, setFilters] = useState({
    busqueda: '',
    tipoEvento: 'todos',
    nivelUrgencia: 'todos',
    rangoFecha: 'mes',
    fechaInicio: '',
    fechaFin: ''
  });

  // Mock data for case history
  const mockStats = {
    totalCasos: 247,
    analisisCompletados: 189,
    casosCriticos: 23,
    intervencionesMedicas: 156
  };

  const mockTimelineEntries = [
    {
      id: 1,
      tipo: 'registro',
      titulo: 'Nuevo paciente registrado',
      descripcion: 'María González Fernández ha sido registrada en el sistema con síntomas de dolor torácico y dificultad respiratoria.',
      timestamp: '02/11/2024 14:45',
      usuario: 'Dr. Carlos Mendoza',
      nivelUrgencia: 'alto',
      detalles: {
        paciente_id: 'P-2024-0247',
        edad: '45 años',
        sintomas_principales: 'Dolor torácico, disnea',
        signos_vitales: 'PA: 140/90, FC: 95 bpm'
      },
      acciones: [
        { texto: 'Ver detalles', icono: 'Eye' },
        { texto: 'Añadir nota', icono: 'Plus' }
      ]
    },
    {
      id: 2,
      tipo: 'analisis_ia',
      titulo: 'Análisis IA completado',
      descripcion: 'El sistema de inteligencia artificial ha procesado los síntomas y determinado un nivel de urgencia alto con recomendación de evaluación cardiológica inmediata.',
      timestamp: '02/11/2024 14:47',
      usuario: 'Sistema IA-911',
      nivelUrgencia: 'alto',
      detalles: {
        confianza_analisis: '87%',
        tiempo_procesamiento: '2.3 segundos',
        recomendacion_principal: 'Evaluación cardiológica urgente',
        diagnosticos_posibles: 'Síndrome coronario agudo, embolia pulmonar'
      },
      acciones: [
        { texto: 'Ver análisis completo', icono: 'Brain' },
        { texto: 'Revisar algoritmo', icono: 'Settings' }
      ]
    },
    {
      id: 3,
      tipo: 'intervencion',
      titulo: 'Intervención médica realizada',
      descripcion: 'Se ha iniciado protocolo de atención para síndrome coronario agudo. Paciente trasladada a unidad de cuidados intensivos.',
      timestamp: '02/11/2024 15:12',
      usuario: 'Dra. Ana Ruiz',
      nivelUrgencia: 'crítico',
      detalles: {
        protocolo_aplicado: 'SCA - Síndrome Coronario Agudo',
        medicacion_administrada: 'Aspirina 300mg, Clopidogrel 600mg',
        destino: 'UCI - Unidad de Cuidados Intensivos',
        tiempo_respuesta: '25 minutos'
      },
      acciones: [
        { texto: 'Seguimiento', icono: 'Activity' },
        { texto: 'Actualizar estado', icono: 'RefreshCw' }
      ]
    },
    {
      id: 4,
      tipo: 'cambio_estado',
      titulo: 'Estado actualizado a estable',
      descripcion: 'El paciente ha respondido favorablemente al tratamiento. Signos vitales estabilizados y dolor torácico controlado.',
      timestamp: '02/11/2024 18:30',
      usuario: 'Dr. Luis Morales',
      nivelUrgencia: 'moderado',
      detalles: {
        estado_anterior: 'Crítico',
        estado_actual: 'Estable',
        signos_vitales: 'PA: 125/80, FC: 78 bpm, SatO2: 98%',
        observaciones: 'Dolor torácico resuelto, paciente consciente y orientada'
      },
      acciones: [
        { texto: 'Continuar monitoreo', icono: 'Monitor' }
      ]
    },
    {
      id: 5,
      tipo: 'nota',
      titulo: 'Nota educativa añadida',
      descripcion: 'Caso marcado para revisión en sesión de entrenamiento. Excelente ejemplo de aplicación correcta del protocolo SCA.',
      timestamp: '02/11/2024 19:15',
      usuario: 'Dr. Roberto Silva - Coordinador de Entrenamiento',
      detalles: {
        categoria_educativa: 'Cardiología de emergencia',
        puntos_clave: 'Reconocimiento temprano, aplicación de protocolo, trabajo en equipo',
        nivel_dificultad: 'Intermedio',
        tiempo_caso: '4 horas 45 minutos'
      },
      acciones: [
        { texto: 'Usar en entrenamiento', icono: 'GraduationCap' },
        { texto: 'Compartir caso', icono: 'Share' }
      ]
    },
    {
      id: 6,
      tipo: 'registro',
      titulo: 'Paciente pediátrico registrado',
      descripcion: 'Menor de 8 años con fiebre alta y convulsiones. Acompañado por madre, síntomas iniciaron hace 2 horas.',
      timestamp: '02/11/2024 12:20',
      usuario: 'Enfermera Patricia López',
      nivelUrgencia: 'crítico',
      detalles: {
        paciente_id: 'P-2024-0246',
        edad: '8 años',
        sintomas_principales: 'Fiebre 39.5°C, convulsiones tónico-clónicas',
        acompañante: 'Madre - Carmen Jiménez'
      },
      acciones: [
        { texto: 'Protocolo pediátrico', icono: 'Baby' },
        { texto: 'Contactar pediatra', icono: 'Phone' }
      ]
    }
  ];

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleClearFilters = () => {
    setFilters({
      busqueda: '',
      tipoEvento: 'todos',
      nivelUrgencia: 'todos',
      rangoFecha: 'mes',
      fechaInicio: '',
      fechaFin: ''
    });
  };

  const handleExport = (exportConfig) => {
    console.log('Exportando con configuración:', exportConfig);
    // Simulate export process
    alert(`Exportando historial en formato ${exportConfig?.formato?.toUpperCase()}...`);
  };

  const filteredEntries = mockTimelineEntries?.filter(entry => {
    // Apply search filter
    if (filters?.busqueda) {
      const searchTerm = filters?.busqueda?.toLowerCase();
      const matchesSearch = 
        entry?.titulo?.toLowerCase()?.includes(searchTerm) ||
        entry?.descripcion?.toLowerCase()?.includes(searchTerm) ||
        entry?.usuario?.toLowerCase()?.includes(searchTerm) ||
        (entry?.detalles && Object.values(entry?.detalles)?.some(value => 
          value?.toString()?.toLowerCase()?.includes(searchTerm)
        ));
      if (!matchesSearch) return false;
    }

    // Apply event type filter
    if (filters?.tipoEvento !== 'todos' && entry?.tipo !== filters?.tipoEvento) {
      return false;
    }

    // Apply urgency level filter
    if (filters?.nivelUrgencia !== 'todos' && entry?.nivelUrgencia !== filters?.nivelUrgencia) {
      return false;
    }

    return true;
  });

  return (
    <div className="min-h-screen bg-background">
      <MainNavigation onToggleCollapse={() => {}} />
      <main className="pt-16">
        <div className="container mx-auto px-4 py-8 max-w-7xl">
          {/* Header Section */}
          <div className="mb-8">
            <BreadcrumbTrail />
            
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold text-foreground mb-2">
                  Historial de Casos
                </h1>
                <p className="text-muted-foreground">
                  Revisión completa de registros médicos y eventos del sistema para análisis educativo
                </p>
              </div>
              
              <div className="flex items-center space-x-3">
                <Button
                  variant="outline"
                  onClick={() => navigate('/patient-dashboard')}
                  iconName="ArrowLeft"
                  iconPosition="left"
                >
                  Volver al Panel
                </Button>
                
                <Button
                  variant="default"
                  onClick={() => setShowExportModal(true)}
                  iconName="Download"
                  iconPosition="left"
                >
                  Exportar Datos
                </Button>
              </div>
            </div>
          </div>

          {/* Statistics Summary */}
          <StatsSummary stats={mockStats} />

          {/* Filter Controls */}
          <FilterControls
            filters={filters}
            onFilterChange={handleFilterChange}
            onClearFilters={handleClearFilters}
            onExport={() => setShowExportModal(true)}
          />

          {/* Results Summary */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <h2 className="text-xl font-semibold text-foreground">
                Cronología de Eventos
              </h2>
              <span className="inline-flex items-center px-3 py-1 bg-muted rounded-full text-sm text-muted-foreground">
                {filteredEntries?.length} resultado{filteredEntries?.length !== 1 ? 's' : ''}
              </span>
            </div>
            
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                iconName="RefreshCw"
                iconPosition="left"
                onClick={() => window.location?.reload()}
              >
                Actualizar
              </Button>
            </div>
          </div>

          {/* Case Timeline */}
          <CaseTimeline
            entries={filteredEntries}
            loading={loading}
            emptyMessage="No se encontraron casos que coincidan con los filtros aplicados"
          />

          {/* Quick Actions Footer */}
          <div className="mt-8 bg-card border border-border rounded-lg p-6 shadow-clinical-sm">
            <h3 className="text-lg font-semibold text-foreground mb-4">
              Acciones Rápidas
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button
                variant="outline"
                onClick={() => navigate('/patient-registration')}
                iconName="UserPlus"
                iconPosition="left"
                className="justify-start"
              >
                Registrar Nuevo Paciente
              </Button>
              
              <Button
                variant="outline"
                onClick={() => navigate('/ai-analysis-results')}
                iconName="Brain"
                iconPosition="left"
                className="justify-start"
              >
                Ver Análisis IA
              </Button>
              
              <Button
                variant="outline"
                onClick={() => setShowExportModal(true)}
                iconName="FileText"
                iconPosition="left"
                className="justify-start"
              >
                Generar Reporte
              </Button>
            </div>
          </div>
        </div>
      </main>
      {/* Export Modal */}
      <ExportModal
        isOpen={showExportModal}
        onClose={() => setShowExportModal(false)}
        onExport={handleExport}
      />
    </div>
  );
};

export default CaseHistory;