export interface GeneratedPersona {
  systemInstruction: string;
  botFatherDescription: string;
  botFatherAbout: string;
  welcomeMessage: string;
  botCommands: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

export interface PersonaFormData {
  name: string;
  vibe: string;
  purpose: string;
}