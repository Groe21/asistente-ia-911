import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MainNavigation from '../../components/ui/MainNavigation';
import BreadcrumbTrail from '../../components/ui/BreadcrumbTrail';
import DashboardMetrics from './components/DashboardMetrics';
import PatientTable from './components/PatientTable';
import QuickActions from './components/QuickActions';
import UrgencyDistribution from './components/UrgencyDistribution';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';

const PatientDashboard = () => {
  const [patients, setPatients] = useState([]);
  const [metrics, setMetrics] = useState({});
  const [lastUpdate, setLastUpdate] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isNavCollapsed, setIsNavCollapsed] = useState(false);
  const navigate = useNavigate();

  // Mock patient data for training simulation
  const mockPatients = [
    {
      id: "EMG-001",
      name: "María González Rodríguez",
      age: 34,
      symptoms: "Dolor torácico intenso, dificultad respiratoria, sudoración excesiva",
      urgencyLevel: "crítico",
      status: "en evaluación",
      timestamp: new Date(Date.now() - 1800000), // 30 minutes ago
      aiAnalysis: "Posible infarto agudo de miocardio",
      recommendedAction: "Traslado inmediato a UCI"
    },
    {
      id: "EMG-002", 
      name: "Carlos Martín López",
      age: 67,
      symptoms: "Confusión mental, debilidad en lado derecho, dificultad para hablar",
      urgencyLevel: "crítico",
      status: "en tratamiento",
      timestamp: new Date(Date.now() - 2700000), // 45 minutes ago
      aiAnalysis: "Probable accidente cerebrovascular",
      recommendedAction: "Protocolo de ictus activado"
    },
    {
      id: "EMG-003",
      name: "Ana Fernández Castro",
      age: 28,
      symptoms: "Fractura abierta en antebrazo derecho, sangrado moderado",
      urgencyLevel: "alto",
      status: "en tratamiento",
      timestamp: new Date(Date.now() - 3600000), // 1 hour ago
      aiAnalysis: "Fractura de radio y cúbito",
      recommendedAction: "Cirugía ortopédica urgente"
    },
    {
      id: "EMG-004",
      name: "José Antonio Ruiz",
      age: 45,
      symptoms: "Dolor abdominal severo, náuseas, vómitos, fiebre alta",
      urgencyLevel: "alto",
      status: "en evaluación",
      timestamp: new Date(Date.now() - 4500000), // 1.25 hours ago
      aiAnalysis: "Posible apendicitis aguda",
      recommendedAction: "Evaluación quirúrgica inmediata"
    },
    {
      id: "EMG-005",
      name: "Laura Sánchez Moreno",
      age: 52,
      symptoms: "Cefalea intensa, visión borrosa, tensión arterial elevada",
      urgencyLevel: "moderado",
      status: "estable",
      timestamp: new Date(Date.now() - 5400000), // 1.5 hours ago
      aiAnalysis: "Crisis hipertensiva",
      recommendedAction: "Monitorización y medicación antihipertensiva"
    },
    {
      id: "EMG-006",
      name: "Miguel Ángel Torres",
      age: 39,
      symptoms: "Dolor lumbar moderado, limitación de movimiento",
      urgencyLevel: "moderado",
      status: "en evaluación",
      timestamp: new Date(Date.now() - 6300000), // 1.75 hours ago
      aiAnalysis: "Lumbalgia mecánica",
      recommendedAction: "Analgesia y fisioterapia"
    },
    {
      id: "EMG-007",
      name: "Carmen Jiménez Vega",
      age: 31,
      symptoms: "Corte superficial en mano izquierda, sangrado leve",
      urgencyLevel: "bajo",
      status: "dado de alta",
      timestamp: new Date(Date.now() - 7200000), // 2 hours ago
      aiAnalysis: "Herida superficial",
      recommendedAction: "Limpieza y sutura menor"
    },
    {
      id: "EMG-008",
      name: "Francisco Herrera Díaz",
      age: 26,
      symptoms: "Esguince de tobillo, dolor moderado, inflamación",
      urgencyLevel: "bajo",
      status: "estable",
      timestamp: new Date(Date.now() - 8100000), // 2.25 hours ago
      aiAnalysis: "Esguince grado II",
      recommendedAction: "Inmovilización y antiinflamatorios"
    },
    {
      id: "EMG-009",
      name: "Isabel Morales Ruiz",
      age: 58,
      symptoms: "Mareos ocasionales, fatiga leve",
      urgencyLevel: "bajo",
      status: "en evaluación",
      timestamp: new Date(Date.now() - 9000000), // 2.5 hours ago
      aiAnalysis: "Posible hipotensión ortostática",
      recommendedAction: "Observación y hidratación"
    },
    {
      id: "EMG-010",
      name: "Roberto García Mendoza",
      age: 42,
      symptoms: "Resfriado común, congestión nasal, tos leve",
      urgencyLevel: "bajo",
      status: "dado de alta",
      timestamp: new Date(Date.now() - 10800000), // 3 hours ago
      aiAnalysis: "Infección respiratoria viral",
      recommendedAction: "Tratamiento sintomático domiciliario"
    }
  ];

  // Calculate metrics from patient data
  const calculateMetrics = (patientData) => {
    const totalCases = patientData?.length;
    const criticalCases = patientData?.filter(p => p?.urgencyLevel === 'crítico')?.length;
    const highCases = patientData?.filter(p => p?.urgencyLevel === 'alto')?.length;
    const moderateCases = patientData?.filter(p => p?.urgencyLevel === 'moderado')?.length;
    const lowCases = patientData?.filter(p => p?.urgencyLevel === 'bajo')?.length;

    return {
      totalCases,
      criticalCases,
      highCases,
      moderateCases,
      lowCases
    };
  };

  // Load initial data
  useEffect(() => {
    const loadDashboardData = async () => {
      setIsLoading(true);
      
      // Simulate API loading delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setPatients(mockPatients);
      setMetrics(calculateMetrics(mockPatients));
      setLastUpdate(new Date());
      setIsLoading(false);
    };

    loadDashboardData();
  }, []);

  const handleRefresh = async () => {
    setIsLoading(true);
    
    // Simulate refresh delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // In a real app, this would fetch fresh data from API
    setMetrics(calculateMetrics(patients));
    setLastUpdate(new Date());
    setIsLoading(false);
  };

  const handleStatusUpdate = (patientId) => {
    // Navigate to patient details for status update
    const patient = patients?.find(p => p?.id === patientId);
    if (patient) {
      navigate('/patient-details', { state: { patientData: patient } });
    }
  };

  const handleBulkAction = (action, selectedPatientIds) => {
    switch (action) {
      case 'update-status':
        // In a real app, this would open a bulk status update modal
        console.log('Bulk status update for:', selectedPatientIds);
        break;
      case 'export':
        // In a real app, this would export selected patient data
        console.log('Export patients:', selectedPatientIds);
        break;
      default:
        break;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <MainNavigation onToggleCollapse={() => setIsNavCollapsed(!isNavCollapsed)} />
        <div className="pt-16">
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <Icon name="Loader2" size={48} className="mx-auto text-primary animate-spin mb-4" />
              <p className="text-muted-foreground">Cargando panel de control...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <MainNavigation onToggleCollapse={() => setIsNavCollapsed(!isNavCollapsed)} />
      
      <div className="pt-16">
        <div className="container mx-auto px-4 py-6 max-w-7xl">
          {/* Header Section */}
          <div className="mb-6">
            <BreadcrumbTrail />
            
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold text-foreground mb-2">
                  Panel de Control - IA-911 Assist
                </h1>
                <p className="text-muted-foreground">
                  Sistema de entrenamiento médico para respuesta de emergencias
                </p>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <Icon name="Clock" size={16} />
                  <span>Tiempo real</span>
                  <div className="w-2 h-2 bg-success rounded-full animate-pulse" />
                </div>
                
                <Button
                  variant="outline"
                  onClick={handleRefresh}
                  iconName="RefreshCw"
                  iconPosition="left"
                  disabled={isLoading}
                >
                  Actualizar
                </Button>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <QuickActions 
            onRefresh={handleRefresh}
            lastUpdate={lastUpdate}
          />

          {/* Dashboard Metrics */}
          <DashboardMetrics metrics={metrics} />

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-6">
            {/* Patient Table - Takes 2/3 width on xl screens */}
            <div className="xl:col-span-2">
              <PatientTable 
                patients={patients}
                onStatusUpdate={handleStatusUpdate}
                onBulkAction={handleBulkAction}
              />
            </div>

            {/* Urgency Distribution Chart - Takes 1/3 width on xl screens */}
            <div className="xl:col-span-1">
              <UrgencyDistribution data={metrics} />
            </div>
          </div>

          {/* Emergency Protocol Notice */}
          <div className="bg-warning/10 border border-warning rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <Icon name="AlertTriangle" size={20} className="text-warning mt-0.5" />
              <div>
                <h4 className="font-medium text-foreground mb-1">
                  Protocolo de Entrenamiento Activo
                </h4>
                <p className="text-sm text-muted-foreground">
                  Este es un sistema de simulación para entrenamiento médico. 
                  Los casos mostrados son ficticios y están diseñados para práctica educativa.
                  En una emergencia real, contacte inmediatamente al 112.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientDashboard;