export interface Tale {
  id: string;
  text: string;
  date: Date;
  audioUrl?: string;
}

export interface FairyTaleFormData {
  age: string;
  topic: string;
  moral: string;
  length: string;
  language: string;
  scientific_note: boolean;
  scientific_topic: string;
  custom_scientific_note: string;
  cultural_fit: string;
  with_audio: boolean;
}

export interface FairyTaleFormProps {
  onSubmit: (data: FairyTaleFormData) => void;
  isGenerating: boolean;
  isCollapsed?: boolean;
  onExpand?: () => void;
}

export interface User {
  name: string;
  email: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
}

export interface GenerateResponse {
  id: string;
  story: string;
  audio_url?: string;
  created_at: string;
}

export interface SaveStoryResponse {
  status: 'saved' | 'unsaved';
}

export interface BackendTale {
  id: string;
  content: string;
  audio_url?: string;
  created_at: string;
}
