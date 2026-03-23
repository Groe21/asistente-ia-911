const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';
const AI_MODEL = 'llama-3.3-70b-versatile';

const SYSTEM_PROMPT = `Eres un sistema de inteligencia artificial médica de emergencias (IA-911). 
Tu función es analizar los síntomas de pacientes y generar evaluaciones médicas para entrenamiento.

IMPORTANTE: Este es un sistema de ENTRENAMIENTO y SIMULACIÓN. No reemplaza diagnósticos médicos reales.

Cuando recibas información de un paciente, debes responder ÚNICAMENTE con un JSON válido (sin markdown, sin \`\`\`json) con esta estructura exacta:

{
  "diagnosis": "Diagnóstico principal probable",
  "confidence": 85,
  "urgencyLevel": "CRITICO|ALTO|MODERADO|BAJO",
  "recommendedAction": "Acción inmediata recomendada",
  "reasoning": "Explicación del razonamiento clínico",
  "riskFactors": ["Factor 1", "Factor 2"],
  "symptoms": [
    {
      "name": "Nombre del síntoma",
      "severity": "Crítico|Alto|Moderado|Bajo",
      "confidence": 90,
      "category": "Cardiovascular|Neurológico|Respiratorio|Traumatológico|Gastrointestinal|Sistémico|Otro",
      "description": "Descripción breve del síntoma analizado"
    }
  ]
}

Reglas:
- confidence: número entre 0 y 100
- urgencyLevel: solo CRITICO, ALTO, MODERADO o BAJO
- symptoms: analiza cada síntoma mencionado individualmente
- Responde SOLO con el JSON, sin texto adicional ni formato markdown`;

async function analyzePatient(patientData) {
  const apiKey = process.env.GROQ_API_KEY;
  
  if (!apiKey) {
    console.warn('⚠️ GROQ_API_KEY no configurada, usando análisis de respaldo');
    return generateFallbackAnalysis(patientData);
  }

  try {
    const prompt = `Analiza al siguiente paciente de emergencia:

Nombre: ${patientData.name}
Edad: ${patientData.age} años
Género: ${patientData.gender}
Síntomas reportados: ${patientData.symptoms}
${patientData.allergies ? `Alergias: ${patientData.allergies}` : ''}
${patientData.conditions ? `Condiciones previas: ${patientData.conditions}` : ''}
${patientData.bloodType ? `Tipo de sangre: ${patientData.bloodType}` : ''}

Genera el análisis médico de emergencia en formato JSON.`;

    const response = await fetch(GROQ_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: AI_MODEL,
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: prompt }
        ],
        temperature: 0.3,
        max_tokens: 2048
      })
    });

    if (!response.ok) {
      const errBody = await response.text();
      throw new Error(`Groq API error ${response.status}: ${errBody}`);
    }

    const data = await response.json();
    const responseText = data.choices[0].message.content.trim();
    
    // Limpiar posible markdown wrapping
    const cleanJson = responseText
      .replace(/^```json\s*/i, '')
      .replace(/^```\s*/i, '')
      .replace(/\s*```$/i, '')
      .trim();

    const analysis = JSON.parse(cleanJson);

    // Validar estructura mínima
    if (!analysis.diagnosis || !analysis.confidence || !analysis.urgencyLevel) {
      throw new Error('Respuesta de IA incompleta');
    }

    return {
      diagnosis: analysis.diagnosis,
      confidence: Math.min(100, Math.max(0, analysis.confidence)),
      urgencyLevel: ['CRITICO', 'ALTO', 'MODERADO', 'BAJO'].includes(analysis.urgencyLevel) 
        ? analysis.urgencyLevel : 'MODERADO',
      recommendedAction: analysis.recommendedAction || 'Evaluación médica requerida',
      reasoning: analysis.reasoning || '',
      riskFactors: analysis.riskFactors || [],
      symptoms: (analysis.symptoms || []).map(s => ({
        name: s.name,
        severity: s.severity || 'Moderado',
        confidence: Math.min(100, Math.max(0, s.confidence || 50)),
        category: s.category || 'Otro',
        description: s.description || ''
      })),
      modelVersion: `groq-${AI_MODEL}`
    };
  } catch (error) {
    console.error('Error en análisis de IA:', error.message);
    return generateFallbackAnalysis(patientData);
  }
}

// Análisis básico de respaldo cuando Gemini no está disponible
function generateFallbackAnalysis(patientData) {
  const symptoms = patientData.symptoms.toLowerCase();
  
  let urgencyLevel = 'MODERADO';
  let diagnosis = 'Evaluación médica requerida';
  let confidence = 45;
  let recommendedAction = 'Evaluación clínica completa';

  // Reglas básicas de urgencia por palabras clave
  const critical = ['infarto', 'paro', 'inconsciente', 'no respira', 'hemorragia', 'convulsión', 'shock'];
  const high = ['fractura', 'sangrado', 'dolor torácico', 'dificultad respiratoria', 'quemadura grave'];
  const moderate = ['fiebre alta', 'dolor severo', 'vómitos', 'mareo', 'cefalea intensa'];

  if (critical.some(k => symptoms.includes(k))) {
    urgencyLevel = 'CRITICO';
    diagnosis = 'Emergencia médica - Requiere atención inmediata';
    confidence = 70;
    recommendedAction = 'Activar protocolo de emergencia inmediato';
  } else if (high.some(k => symptoms.includes(k))) {
    urgencyLevel = 'ALTO';
    diagnosis = 'Condición urgente que requiere evaluación prioritaria';
    confidence = 60;
    recommendedAction = 'Evaluación médica urgente';
  } else if (moderate.some(k => symptoms.includes(k))) {
    urgencyLevel = 'MODERADO';
    diagnosis = 'Condición que requiere evaluación médica';
    confidence = 55;
    recommendedAction = 'Evaluación médica programada';
  } else {
    urgencyLevel = 'BAJO';
    diagnosis = 'Síntomas leves - observación recomendada';
    confidence = 50;
    recommendedAction = 'Observación y seguimiento';
  }

  return {
    diagnosis,
    confidence,
    urgencyLevel,
    recommendedAction,
    reasoning: 'Análisis generado por reglas básicas (modelo de IA no disponible). Configure GEMINI_API_KEY para análisis avanzado.',
    riskFactors: ['Análisis limitado sin modelo de IA'],
    symptoms: [{
      name: 'Síntomas reportados',
      severity: urgencyLevel === 'CRITICO' ? 'Crítico' : urgencyLevel === 'ALTO' ? 'Alto' : 'Moderado',
      confidence,
      category: 'Otro',
      description: patientData.symptoms
    }],
    modelVersion: 'fallback-v1.0'
  };
}

async function chatAboutPatient(patientData, message, conversationHistory = []) {
  const apiKey = process.env.GROQ_API_KEY;

  if (!apiKey) {
    return { reply: 'El servicio de IA no está disponible. Configure GROQ_API_KEY.' };
  }

  const systemMessage = `Eres un asistente clínico de IA integrado al sistema de emergencias 911.
Tu audiencia son MÉDICOS ESPECIALISTAS y personal de salud capacitado que ya tienen formación clínica.

CONTEXTO DEL PACIENTE ACTIVO:
- Nombre: ${patientData.name}
- Edad: ${patientData.age} años
- Género: ${patientData.gender}
- Síntomas: ${patientData.symptoms}
- Alergias: ${patientData.allergies || 'Ninguna conocida'}
- Condiciones previas: ${patientData.conditions || 'Ninguna conocida'}
- Tipo de sangre: ${patientData.bloodType || 'No registrado'}

INSTRUCCIONES ESTRICTAS DE COMPORTAMIENTO:
1. Responde como un colega médico especialista. Sé DIRECTO y CONCISO. Ve al grano.
2. NUNCA agregues disclaimers genéricos como "consulte a un equipo médico", "un profesional debe evaluar", "es importante que un médico revise", etc. El usuario YA ES el médico.
3. NUNCA digas frases como "estos riesgos pueden variar dependiendo de la condición individual". El médico ya lo sabe.
4. Usa terminología médica apropiada sin simplificar innecesariamente — tu audiencia tiene formación clínica.
5. Cuando pregunten sobre medicamentos, da información directa: dosis sugeridas, interacciones con las alergias/condiciones del paciente, contraindicaciones.
6. Si no tienes suficiente información clínica para dar una respuesta precisa, indica qué datos adicionales necesitas (ej: "Necesito conocer la creatinina sérica para ajustar la dosis").
7. Estructura tus respuestas de forma práctica: diagnóstico diferencial, plan de acción, medicación, monitoreo.
8. No inventes datos clínicos que no estén proporcionados.
9. Responde siempre en español.
10. Sé útil y accionable. Cada respuesta debe aportar valor clínico inmediato.`;

  try {
    const messages = [
      { role: 'system', content: systemMessage },
      ...conversationHistory.slice(-10).map(m => ({
        role: m.role,
        content: m.content
      })),
      { role: 'user', content: message }
    ];

    const response = await fetch(GROQ_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: AI_MODEL,
        messages,
        temperature: 0.3,
        max_tokens: 1536
      })
    });

    if (!response.ok) {
      const errBody = await response.text();
      throw new Error(`Groq API error ${response.status}: ${errBody}`);
    }

    const data = await response.json();
    const reply = data.choices[0].message.content.trim();

    return { reply };
  } catch (error) {
    console.error('Error en chat IA:', error.message);
    return { reply: 'Lo siento, hubo un error al procesar tu consulta. Intenta de nuevo.' };
  }
}

async function generalChat(message, conversationHistory = [], patientsContext = '') {
  const apiKey = process.env.GROQ_API_KEY;

  if (!apiKey) {
    return { reply: 'El servicio de IA no está disponible. Configure GROQ_API_KEY.' };
  }

  const systemMessage = `Eres el asistente clínico principal del sistema de emergencias IA-911.
Tu audiencia son MÉDICOS ESPECIALISTAS y personal de salud capacitado.

DATOS ACTUALES DEL SISTEMA:
${patientsContext}

INSTRUCCIONES:
1. Eres el asistente general del sistema. Tienes acceso a TODOS los pacientes registrados.
2. Puedes dar resúmenes generales, estadísticas, listar pacientes por urgencia, comparar casos, etc.
3. Si preguntan por un paciente específico (por nombre o código), busca en los datos y responde con toda la información disponible.
4. Sé DIRECTO y CONCISO. Tu audiencia son médicos, no hagas disclaimers genéricos.
5. NUNCA digas "consulte a un equipo médico" ni "es importante que un profesional evalúe". El usuario YA ES el médico.
6. Usa terminología médica apropiada.
7. Cuando pregunten "cuántos pacientes hay", da el número exacto con desglose por urgencia.
8. Si piden un resumen, estructura la respuesta: críticos primero, luego altos, moderados, bajos.
9. Responde siempre en español.
10. Sé útil, práctico y accionable en cada respuesta.`;

  try {
    const messages = [
      { role: 'system', content: systemMessage },
      ...conversationHistory.slice(-10).map(m => ({
        role: m.role,
        content: m.content
      })),
      { role: 'user', content: message }
    ];

    const response = await fetch(GROQ_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: AI_MODEL,
        messages,
        temperature: 0.3,
        max_tokens: 2048
      })
    });

    if (!response.ok) {
      const errBody = await response.text();
      throw new Error(`Groq API error ${response.status}: ${errBody}`);
    }

    const data = await response.json();
    const reply = data.choices[0].message.content.trim();

    return { reply };
  } catch (error) {
    console.error('Error en chat general IA:', error.message);
    return { reply: 'Lo siento, hubo un error al procesar tu consulta. Intenta de nuevo.' };
  }
}

module.exports = { analyzePatient, chatAboutPatient, generalChat };
