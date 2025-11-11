import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import MainNavigation from '../../components/ui/MainNavigation';
import BreadcrumbTrail from '../../components/ui/BreadcrumbTrail';
import PatientInfoCard from './components/PatientInfoCard';
import UrgencyAssessment from './components/UrgencyAssessment';
import AIAnalysisPanel from './components/AIAnalysisPanel';
import CaseHistoryTimeline from './components/CaseHistoryTimeline';
import InteractiveActions from './components/InteractiveActions';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';

const PatientDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [isNavCollapsed, setIsNavCollapsed] = useState(false);

  // Mock patient data
  const mockPatient = {
    id: "EMG-001",
    name: "María González Rodríguez",
    age: 34,
    gender: "Femenino",
    bloodType: "O+",
    contactNumber: "+34 612 345 678",
    emergencyContact: "Juan González - Esposo - +34 698 765 432",
    allergies: "Penicilina, Polen",
    conditions: "Asma leve, Hipertensión controlada",
    symptoms: "Dolor torácico intenso, dificultad respiratoria, sudoración excesiva",
    urgencyLevel: "crítico",
    status: "en evaluación",
    arrivalTime: new Date(Date.now() - 1800000),
    aiAnalysis: {
      diagnosis: "Posible infarto agudo de miocardio",
      confidence: 92,
      recommendedAction: "Traslado inmediato a UCI",
      riskFactors: ["Antecedentes familiares de cardiopatía", "Estrés laboral elevado"],
      vitalSigns: {
        heartRate: "110 bpm",
        bloodPressure: "145/95 mmHg",
        temperature: "37.2°C",
        oxygenSaturation: "94%"
      }
    },
    timeline: [
      {
        time: "14:30",
        event: "Llegada al servicio de urgencias",
        type: "arrival"
      },
      {
        time: "14:32",
        event: "Registro inicial completado",
        type: "registration"
      },
      {
        time: "14:35",
        event: "Análisis de IA completado",
        type: "analysis"
      },
      {
        time: "14:40",
        event: "Evaluación médica iniciada",
        type: "evaluation"
      }
    ]
  };

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, [id]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Cargando detalles del paciente...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-background">
        <MainNavigation onToggleCollapse={(collapsed) => setIsNavCollapsed(collapsed)} />
        
        <main className="pt-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Header Section */}
            <div className="mb-6">
              <BreadcrumbTrail />
              
              <div className="flex items-center justify-between mt-4">
                <div className="flex items-center space-x-4">
                  <Button
                    variant="ghost"
                    onClick={() => navigate('/patient-dashboard')}
                    className="flex items-center space-x-2"
                  >
                    <Icon name="ArrowLeft" size={20} />
                    <span>Volver al Dashboard</span>
                  </Button>
                </div>
                
                <InteractiveActions patientId={mockPatient.id} />
              </div>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Column - Patient Info & Urgency */}
              <div className="lg:col-span-1 space-y-6">
                <PatientInfoCard patient={mockPatient} />
                <UrgencyAssessment 
                  urgencyLevel={mockPatient.urgencyLevel}
                  status={mockPatient.status}
                />
              </div>

              {/* Middle Column - AI Analysis */}
              <div className="lg:col-span-1">
                <AIAnalysisPanel analysis={mockPatient.aiAnalysis} />
              </div>

              {/* Right Column - Timeline */}
              <div className="lg:col-span-1">
                <CaseHistoryTimeline timeline={mockPatient.timeline} />
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default PatientDetails;