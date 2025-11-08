import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import MainNavigation from '../../components/ui/MainNavigation';
import BreadcrumbTrail from '../../components/ui/BreadcrumbTrail';
import AnalysisHeader from './components/AnalysisHeader';
import SymptomAnalysis from './components/SymptomAnalysis';
import UrgencyDetermination from './components/UrgencyDetermination';
import RecommendedActions from './components/RecommendedActions';
import AnalysisBreakdown from './components/AnalysisBreakdown';
import InteractiveControls from './components/InteractiveControls';

const AIAnalysisResults = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [isNavCollapsed, setIsNavCollapsed] = useState(false);

  // Mock data for AI analysis results
  const mockPatientData = {
    id: "PAC-2024-001",
    name: "María González Rodríguez",
    age: 45,
    gender: "Femenino"
  };

  const mockAnalysisData = {
    urgencyLevel: "Alto",
    confidence: 87,
    processedAt: "02/11/2024 15:30:45",
    symptomsProcessed: 8,
    riskFactors: 3,
    confidenceScore: 87
  };

  const mockSymptomsData = {
    originalInput: `Paciente refiere dolor torácico intenso de inicio súbito hace 2 horas, irradiado al brazo izquierdo y mandíbula. Acompañado de sudoración profusa, náuseas y sensación de muerte inminente. Antecedentes de hipertensión arterial y diabetes mellitus tipo 2. Fumador de 20 cigarrillos/día durante 25 años.`,
    processedSymptoms: [
      {
        name: "Dolor Torácico Agudo",
        severity: "Crítico",
        confidence: 95,
        category: "Cardiovascular",
        description: "Dolor torácico de características anginosas con irradiación típica",
        keywords: ["dolor torácico", "intenso", "súbito", "irradiado"],
        relatedConditions: ["Infarto Agudo de Miocardio", "Angina Inestable", "Disección Aórtica"]
      },
      {
        name: "Síntomas Neurovegetativos",
        severity: "Alto",
        confidence: 88,
        category: "Sistémico",
        description: "Manifestaciones del sistema nervioso autónomo asociadas",
        keywords: ["sudoración", "náuseas", "sensación de muerte"],
        relatedConditions: ["Síndrome Coronario Agudo", "Crisis Hipertensiva"]
      },
      {
        name: "Factores de Riesgo Cardiovascular",
        severity: "Alto",
        confidence: 92,
        category: "Antecedentes",
        description: "Múltiples factores de riesgo cardiovascular presentes",
        keywords: ["hipertensión", "diabetes", "fumador"],
        relatedConditions: ["Enfermedad Coronaria", "Aterosclerosis"]
      }
    ],
    processingNotes: "El análisis IA ha identificado un patrón clásico de síndrome coronario agudo con alta probabilidad. La combinación de síntomas, factores de riesgo y presentación clínica sugiere la necesidad de evaluación cardiológica inmediata."
  };

  const mockUrgencyData = {
    level: "Alto",
    confidence: 87,
    escalatingFactors: [
      "Dolor torácico de características anginosas",
      "Irradiación a brazo izquierdo y mandíbula",
      "Múltiples factores de riesgo cardiovascular",
      "Síntomas neurovegetativos asociados"
    ],
    mitigatingFactors: [
      "Paciente consciente y orientada",
      "Signos vitales estables al momento del registro",
      "No antecedentes de cardiopatía isquémica conocida"
    ],
    reasoning: "La presentación clínica es altamente sugestiva de síndrome coronario agudo. La combinación de dolor torácico típico, irradiación característica, factores de riesgo significativos y síntomas asociados justifica una clasificación de urgencia alta. Se requiere evaluación cardiológica inmediata con ECG y biomarcadores cardíacos.",
    alternatives: [
      "Considerar disección aórtica en diagnóstico diferencial",
      "Evaluar posible crisis hipertensiva secundaria",
      "Descartar embolismo pulmonar si hay factores de riesgo adicionales"
    ]
  };

  const mockActionsData = {
    protocol: "Protocolo de Síndrome Coronario Agudo",
    protocolDescription: "Protocolo estandarizado para manejo inicial de pacientes con sospecha de síndrome coronario agudo en servicios de emergencia.",
    actions: [
      {
        id: "action-001",
        title: "Monitorización Cardíaca Continua",
        priority: "Inmediata",
        estimatedTime: "2-3 minutos",
        category: "Monitorización",
        description: "Establecer monitorización cardíaca continua y control de signos vitales cada 5 minutos",
        steps: [
          {
            instruction: "Conectar monitor cardíaco de 12 derivaciones",
            note: "Verificar calidad de la señal y alarmas activadas"
          },
          {
            instruction: "Tomar signos vitales completos cada 5 minutos",
            note: "Incluir presión arterial, frecuencia cardíaca, saturación de oxígeno"
          },
          {
            instruction: "Registrar ECG de 12 derivaciones inmediatamente",
            note: "Repetir cada 15-30 minutos o si hay cambios clínicos"
          }
        ],
        resources: ["Monitor cardíaco", "Electrodos", "Esfigmomanómetro", "Pulsioxímetro"]
      },
      {
        id: "action-002",
        title: "Administración de Oxígeno",
        priority: "Inmediata",
        estimatedTime: "1-2 minutos",
        category: "Soporte Respiratorio",
        description: "Administrar oxígeno suplementario para mantener saturación &gt; 94%",
        steps: [
          {
            instruction: "Evaluar saturación de oxígeno basal",
            note: "Si SatO2 < 94% iniciar oxigenoterapia"
          },
          {
            instruction: "Administrar oxígeno por cánula nasal 2-4 L/min",
            note: "Ajustar flujo según saturación objetivo"
          },
          {
            instruction: "Monitorizar saturación continuamente",
            note: "Mantener SatO2 entre 94-98%"
          }
        ],
        resources: ["Cánula nasal", "Fuente de oxígeno", "Pulsioxímetro"]
      },
      {
        id: "action-003",
        title: "Acceso Vascular y Medicación",
        priority: "Urgente",
        estimatedTime: "5-10 minutos",
        category: "Tratamiento",
        description: "Establecer acceso vascular y administrar medicación según protocolo",
        steps: [
          {
            instruction: "Canalizar vía venosa periférica calibre 18G",
            note: "Preferiblemente en brazo no dominante"
          },
          {
            instruction: "Administrar AAS 300mg vía oral (si no hay contraindicaciones)",
            note: "Verificar alergias y contraindicaciones previas"
          },
          {
            instruction: "Considerar nitroglicerina sublingual si PA sistólica > 90 mmHg",
            note: "No administrar si uso reciente de sildenafilo"
          }
        ],
        resources: ["Catéter venoso 18G", "AAS 300mg", "Nitroglicerina sublingual"]
      },
      {
        id: "action-004",
        title: "Pruebas Diagnósticas Urgentes",
        priority: "Urgente",
        estimatedTime: "15-20 minutos",
        category: "Diagnóstico",
        description: "Solicitar y realizar pruebas diagnósticas esenciales",
        steps: [
          {
            instruction: "Extraer muestra para biomarcadores cardíacos",
            note: "Troponina, CK-MB, mioglobina"
          },
          {
            instruction: "Solicitar analítica completa urgente",
            note: "Hemograma, bioquímica, coagulación"
          },
          {
            instruction: "Realizar radiografía de tórax",
            note: "Descartar complicaciones y diagnósticos diferenciales"
          }
        ],
        resources: ["Tubos de extracción", "Equipo de radiografía", "Laboratorio urgente"]
      }
    ]
  };

  const mockBreakdownData = {
    categorization: [
      {
        name: "Síntomas Cardiovasculares",
        symptoms: [
          { name: "Dolor torácico", severity: "Crítico", weight: 35 },
          { name: "Irradiación a brazo izquierdo", severity: "Alto", weight: 25 },
          { name: "Irradiación a mandíbula", severity: "Alto", weight: 20 }
        ]
      },
      {
        name: "Síntomas Sistémicos",
        symptoms: [
          { name: "Sudoración profusa", severity: "Alto", weight: 15 },
          { name: "Náuseas", severity: "Moderado", weight: 10 },
          { name: "Sensación de muerte inminente", severity: "Alto", weight: 20 }
        ]
      },
      {
        name: "Factores de Riesgo",
        symptoms: [
          { name: "Hipertensión arterial", severity: "Alto", weight: 25 },
          { name: "Diabetes mellitus", severity: "Alto", weight: 25 },
          { name: "Tabaquismo", severity: "Alto", weight: 30 }
        ]
      }
    ],
    categorizationSummary: "La categorización muestra predominio de síntomas cardiovasculares con alta especificidad para síndrome coronario agudo, complementados por síntomas sistémicos típicos y múltiples factores de riesgo significativos.",
    riskFactors: [
      {
        name: "Tabaquismo Crónico",
        level: "Alto",
        description: "Fumador de 20 cigarrillos/día durante 25 años representa un factor de riesgo cardiovascular mayor",
        impact: "Aumenta el riesgo de enfermedad coronaria en 2-4 veces",
        mitigation: "Cesación tabáquica inmediata y seguimiento especializado"
      },
      {
        name: "Diabetes Mellitus Tipo 2",
        level: "Alto",
        description: "Enfermedad metabólica que acelera la aterosclerosis y aumenta el riesgo cardiovascular",
        impact: "Equivalente de riesgo a enfermedad coronaria establecida",
        mitigation: "Control glucémico estricto y manejo multifactorial"
      },
      {
        name: "Hipertensión Arterial",
        level: "Medio",
        description: "Factor de riesgo cardiovascular modificable que contribuye al daño vascular",
        impact: "Aumenta progresivamente el riesgo con valores elevados",
        mitigation: "Control tensional óptimo < 130/80 mmHg"
      }
    ],
    complications: [
      {
        name: "Infarto Agudo de Miocardio",
        probability: 75,
        timeframe: "0-6 horas",
        description: "Necrosis miocárdica por oclusión coronaria aguda",
        warningSigns: ["Elevación del ST", "Troponina positiva", "Dolor persistente", "Arritmias"]
      },
      {
        name: "Arritmias Ventriculares",
        probability: 45,
        timeframe: "0-24 horas",
        description: "Trastornos del ritmo potencialmente letales",
        warningSign: ["Taquicardia ventricular", "Fibrilación ventricular", "Extrasístoles frecuentes"]
      },
      {
        name: "Insuficiencia Cardíaca Aguda",
        probability: 30,
        timeframe: "6-48 horas",
        description: "Deterioro agudo de la función ventricular",
        warningSign: ["Disnea", "Edema pulmonar", "Hipotensión", "Oliguria"]
      }
    ],
    differentialDiagnosis: [
      {
        condition: "Infarto Agudo de Miocardio",
        probability: 75,
        priority: "Alta",
        reasoning: "Presentación clínica típica con factores de riesgo significativos",
        supportingSymptoms: ["Dolor torácico típico", "Irradiación característica", "Síntomas neurovegetativos"],
        suggestedTests: ["ECG seriado", "Troponina", "Ecocardiograma"]
      },
      {
        condition: "Angina Inestable",
        probability: 60,
        priority: "Alta",
        reasoning: "Dolor torácico de nueva aparición con características anginosas",
        supportingSymptoms: ["Dolor en reposo", "Factores de riesgo", "Duración prolongada"],
        suggestedTests: ["ECG", "Troponina", "Prueba de esfuerzo diferida"]
      },
      {
        condition: "Disección Aórtica",
        probability: 15,
        priority: "Media",
        reasoning: "Dolor torácico súbito en paciente hipertenso",
        supportingSymptoms: ["Dolor súbito", "Hipertensión", "Irradiación"],
        suggestedTests: ["TC torácica", "Ecocardiograma transesofágico", "Radiografía de tórax"]
      }
    ]
  };

  useEffect(() => {
    // Simulate loading time for analysis processing
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  const handleToggleCollapse = () => {
    setIsNavCollapsed(!isNavCollapsed);
  };

  const handleStatusUpdate = (patientId, statusData) => {
    console.log('Updating patient status:', patientId, statusData);
    // In a real app, this would update the patient's status in the backend
  };

  const handleAddNote = (patientId, noteData) => {
    console.log('Adding note for patient:', patientId, noteData);
    // In a real app, this would save the note to the backend
  };

  const handleActionSelect = (selectedActionIds) => {
    console.log('Selected actions:', selectedActionIds);
    // In a real app, this would process the selected actions
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <MainNavigation onToggleCollapse={handleToggleCollapse} />
        <div className="pt-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex items-center justify-center min-h-[400px]">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                <h2 className="text-xl font-semibold text-foreground mb-2">
                  Procesando Análisis IA
                </h2>
                <p className="text-muted-foreground">
                  Analizando síntomas y generando recomendaciones...
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <MainNavigation onToggleCollapse={handleToggleCollapse} />
      <div className="pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <BreadcrumbTrail />
          
          <div className="space-y-8">
            {/* Analysis Header */}
            <AnalysisHeader 
              patientData={mockPatientData}
              analysisData={mockAnalysisData}
            />

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
              {/* Left Column - Analysis Details */}
              <div className="xl:col-span-2 space-y-8">
                <SymptomAnalysis symptomsData={mockSymptomsData} />
                <UrgencyDetermination urgencyData={mockUrgencyData} />
                <RecommendedActions 
                  actionsData={mockActionsData}
                  onActionSelect={handleActionSelect}
                />
                <AnalysisBreakdown breakdownData={mockBreakdownData} />
              </div>

              {/* Right Column - Interactive Controls */}
              <div className="xl:col-span-1">
                <div className="sticky top-24">
                  <InteractiveControls
                    patientId={mockPatientData?.id}
                    analysisData={mockAnalysisData}
                    onUpdateStatus={handleStatusUpdate}
                    onAddNote={handleAddNote}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIAnalysisResults;