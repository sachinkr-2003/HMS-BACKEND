const { GoogleGenerativeAI } = require("@google/generative-ai");

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "AI_SIMULATION_KEY");
const model = genAI.getGenerativeModel({ model: "gemini-pro" });

// Helper to check if AI is live
const isAILive = () => process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'your_gemini_api_key';

// 1. AI-Based Diagnosis Support
exports.analyzeSymptoms = async (req, res) => {
    try {
        const { symptoms } = req.body;
        if (!symptoms) return res.status(400).json({ message: "Please provide symptoms" });

        if (!isAILive()) {
            return res.status(200).json({ 
                analysis: `[INSTITUTIONAL SIMULATION] Symptoms: ${symptoms}. \nPotential Indications: Seasonal Viral Syndrome or Acute Pharyngitis. \nRecommended Specialist: General Physician / ENT. \nUrgency: Medium. \nNote: Configure GEMINI_API_KEY for live clinical intelligence.` 
            });
        }

        const prompt = `As a medical assistant AI (HealthRekha), analyze these symptoms: ${symptoms}. 
        Provide: 1. Possible conditions (with a strong disclaimer that this is NOT a professional diagnosis), 
        2. Recommended specialist doctor, 3. Urgency level (Low/Medium/High). 
        Keep it professional and concise.`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        res.status(200).json({ analysis: response.text() });
    } catch (error) {
        res.status(500).json({ message: "Clinical AI Engine Synchronizing..." });
    }
};

// 2. Voice-Enabled EMR (Structure Doctor Notes)
exports.structureDoctorNotes = async (req, res) => {
    try {
        const { rawNotes } = req.body;
        if (!rawNotes) return res.status(400).json({ message: "Please provide raw notes" });

        if (!isAILive()) {
            return res.status(200).json({ 
                structuredNotes: `[SOAP DRAFT SIMULATED]\nSubjective: Patient reports ${rawNotes}.\nObjective: Vitals normal, mild congestion noted.\nAssessment: Improving clinical pathway.\nPlan: Maintain current medication, follow up in 7 days.` 
            });
        }

        const prompt = `Convert these raw/voice-transcribed doctor notes into a structured EMR format: ${rawNotes}. 
        Include sections for Subjective, Objective, Assessment, and Plan (SOAP format). 
        Return it in a clean readable layout.`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        res.status(200).json({ structuredNotes: response.text() });
    } catch (error) {
        res.status(500).json({ message: "SOAP Engine Processing..." });
    }
};

// 3. Predictive Analytics (Bed Demand/Disease Trends)
exports.predictTrends = async (req, res) => {
    try {
        const { hospitalStats } = req.body;
        if (!isAILive()) {
            return res.status(200).json({ 
                predictions: `[TREND ANALYSIS SIMULATED]\n1. Bed Demand: Stable (Surge expected in 72hrs).\n2. Outbreak Alert: Low risk for Influenza.\n3. Resource Allocation: Optimized.` 
            });
        }

        const prompt = `Analyze this hospital occupancy/patient data: ${hospitalStats}. 
        Predict: 1. Bed demand for next week, 2. Potential disease outbreaks based on recent cases, 3. Resource optimization suggestions.`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        res.status(200).json({ predictions: response.text() });
    } catch (error) {
        res.status(500).json({ message: "Predictive Module Initializing..." });
    }
};

// 4. AI Call Agent / Follow-up Generator
exports.generateFollowUp = async (req, res) => {
    try {
        const { patientName, condition, lastVisit } = req.body;
        if (!isAILive()) {
            return res.status(200).json({ 
                script: `Dear ${patientName}, we are checking on your recovery for ${condition} following your visit on ${lastVisit}. Please confirm if you require a follow-up consultation. - HealthRekha Institutional Team.` 
            });
        }

        const prompt = `Generate a personalized, empathetic follow-up message/script for a patient named ${patientName} who visited for ${condition} on ${lastVisit}. 
        Ask about their recovery and remind them of any pending tests or next appointments.`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        res.status(200).json({ script: response.text() });
    } catch (error) {
        res.status(500).json({ message: "Communication Proxy Active..." });
    }
};

// 5. Chatbots for Patient Support
exports.chatbotResponse = async (req, res) => {
    try {
        const { query } = req.body;
        if (!query) return res.status(400).json({ message: "Please provide a query" });

        if (!isAILive()) {
            return res.status(200).json({ reply: "Greetings. I am HealthRekha's Institutional Assistant. My live intelligence module is currently in standby mode. Please configure the system-wide GEMINI_API_KEY for dynamic clinical support. How else can I assist with hospital information?" });
        }

        const prompt = `You are HealthRekha AI, a helpful hospital support assistant. Answer this query: ${query}. 
        Be helpful, concise, and professional. Do not prescribe medicines.`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        res.status(200).json({ reply: response.text() });
    } catch (error) {
        res.status(500).json({ message: "Support Terminal Connecting..." });
    }
};

// 6. Smart Revenue Optimization
exports.optimizeRevenue = async (req, res) => {
    try {
        if (!isAILive()) {
            return res.status(200).json({ 
                insights: `[FISCAL INSIGHTS SIMULATED]\n1. Optimize pharmacy stock rotation.\n2. Reduce billing throughput time in Diagnostics.\n3. Enhance patient volume via digital follow-ups.` 
            });
        }

        const { billingSummary } = req.body;
        const prompt = `Analyze this hospital revenue summary: ${billingSummary}. 
        Provide 3 actionable insights to reduce billing leakages and optimize revenue cycle management.`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        res.status(200).json({ insights: response.text() });
    } catch (error) {
        res.status(500).json({ message: "Fiscal Intelligence Active..." });
    }
};
