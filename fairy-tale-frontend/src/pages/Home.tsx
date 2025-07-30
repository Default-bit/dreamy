import {useState, useEffect} from 'react';
import {useNavigate, useParams, useLocation} from 'react-router-dom';
import {Header} from '@/components/Header';
import {FairyTaleForm} from '@/components/FairyTaleForm';
import {TaleOutput} from '@/components/TaleOutput';
import {AuthModal} from '@/components/auth/AuthModal';
import API from '@/lib/api';
import {SavedTales} from '@/components/tales/SavedTales';
import {v4 as uuidv4} from 'uuid';
import type {
  FairyTaleFormData,
  User,
  AuthResponse,
  GenerateResponse,
  SaveStoryResponse,
  BackendTale,
} from '@/lib/types';

export default function Home() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedTale, setGeneratedTale] = useState<Tale | null>(null);
  const [isFormCollapsed, setIsFormCollapsed] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  interface Tale {
    id: string;
    text: string;
    date: Date;
    audioUrl?: string;
  }
  const [savedTales, setSavedTales] = useState<Tale[]>([]);
  const [showSavedTales, setShowSavedTales] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();
  const params = new URLSearchParams(location.search);
  const taleIdFromUrl = params.get('tale');

  useEffect(() => {
    if (taleIdFromUrl && savedTales.length > 0) {
      const tale = savedTales.find(t => t.id === taleIdFromUrl);
      if (tale) {
        setGeneratedTale(tale);
        setIsFormCollapsed(true);
        setShowSavedTales(false);
      }
    }
  }, [taleIdFromUrl, savedTales]);

  const handleViewSavedTales = () => {
    setShowSavedTales(true);
  };

  const handleDeleteTale = async (taleToDelete: Tale) => {
    try {
      await API.post('/stories/save', {
        id: taleToDelete.id,
        content: taleToDelete.text,
        audio_url: taleToDelete.audioUrl,
        created_at: taleToDelete.date.toISOString(),
      });

      setSavedTales(prev => prev.filter(t => t.id !== taleToDelete.id));
    } catch (err) {
      console.error('Failed to unsave tale:', err);
    }
  };

  const handleGenerateTale = async (formData: FairyTaleFormData) => {
    setIsGenerating(true);
    try {
      const payload = {
        age: formData.age,
        topic: formData.topic,
        moral: formData.moral,
        length: formData.length,
        language: formData.language,
        culture:
          formData.cultural_fit === 'universal' ? null : formData.cultural_fit,
        scientific_note: formData.scientific_note
          ? formData.scientific_topic === 'custom'
            ? formData.custom_scientific_note?.trim() || null
            : formData.scientific_topic
          : null,
        with_audio: formData.with_audio,
      };

      const response = await API.post<GenerateResponse>('/generate', payload);

      const newTale: Tale = {
        id: uuidv4(),
        text: response.data.story,
        date: new Date(),
        audioUrl: response.data.audio_url,
      };

      setGeneratedTale(newTale);
      setIsFormCollapsed(true);
    } catch (err) {
      console.error(err);
      alert('Failed to generate story. Are you logged in?');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleShowForm = () => {
    setIsFormCollapsed(false);
  };

  const handleAuth = async (
    data: {
      name?: string;
      email: string;
      password: string;
    },
    isLogin: boolean, // this now comes from AuthModal
  ) => {
    try {
      const endpoint = isLogin ? '/token' : '/register';
      const response = await API.post<AuthResponse>(endpoint, {
        email: data.email,
        password: data.password,
        name: data.name,
      });

      const token = response.data.access_token;
      localStorage.setItem('access_token', token);
      setUser({name: data.name || 'User', email: data.email});
      setIsAuthModalOpen(false);
    } catch (err) {
      console.error('Auth error:', err);
      alert('Authentication failed.');
    }
  };

  useEffect(() => {
    const fetchSavedTales = async () => {
      if (user) {
        try {
          const response = await API.get<BackendTale[]>('/stories');
          const tales = response.data.map((story: any) => ({
            id: story.id,
            text: story.content,
            date: new Date(story.created_at),
            audioUrl: story.audio_url,
          }));
          setSavedTales(tales);
        } catch (err) {
          console.error('Failed to fetch saved tales:', err);
        }
      }
    };
    fetchSavedTales();
  }, [user]);

  const handleLogout = () => {
    setUser(null);
  };

  const handleReadMore = (tale: Tale) => {
    setGeneratedTale(tale);
    setIsFormCollapsed(true);
    setShowSavedTales(false);
    navigate(`/?tale=${tale.id}`, {replace: false});
  };

  const isSaved = !!savedTales.find(t => t.id === generatedTale?.id);
  const handleToggleSaveTale = async (tale: Tale) => {
    if (!user) {
      setIsAuthModalOpen(true);
      return;
    }

    try {
      const response = await API.post<SaveStoryResponse>('/stories/save', {
        id: tale.id,
        content: tale.text,
        audio_url: tale.audioUrl,
        created_at: tale.date.toISOString(),
      });

      if (response.data.status === 'unsaved') {
        setSavedTales(prev => prev.filter(t => t.id !== tale.id));
      } else {
        setSavedTales(prev => [...prev, tale]);
      }
    } catch (err) {
      console.error('Failed to sync with backend:', err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-blue-100 w-full">
      <div className="container mx-auto px-4 py-8">
        <Header
          user={user}
          onLogin={() => setIsAuthModalOpen(true)}
          onLogout={handleLogout}
          onViewSavedTales={handleViewSavedTales}
        />
        <main className="mt-8 space-y-6">
          {generatedTale && !isFormCollapsed && (
            <div className="transition-all duration-500">
              <TaleOutput
                tale={generatedTale}
                withAudio={generatedTale.audioUrl ? true : false}
                onSave={() =>
                  generatedTale && handleToggleSaveTale(generatedTale)
                }
                isSaved={isSaved}
              />
            </div>
          )}
          {!taleIdFromUrl && (
            <div
              className={`transition-all duration-500 ${
                isFormCollapsed ? 'max-h-16' : 'max-h-[2000px]'
              }`}>
              <FairyTaleForm
                onSubmit={handleGenerateTale}
                isGenerating={isGenerating}
                isCollapsed={isFormCollapsed}
                onExpand={handleShowForm}
              />
            </div>
          )}
          {generatedTale && isFormCollapsed && (
            <div className="transition-all duration-500">
              <TaleOutput
                tale={generatedTale}
                withAudio={generatedTale.audioUrl ? true : false}
                onSave={() =>
                  generatedTale && handleToggleSaveTale(generatedTale)
                }
                isSaved={isSaved}
              />
            </div>
          )}
          {taleIdFromUrl && (
            <div className="text-center mt-4">
              <button
                className="text-purple-600 underline"
                onClick={() => {
                  navigate('/');
                  setGeneratedTale(null);
                  setIsFormCollapsed(false);
                  setShowSavedTales(true); // 👈 optional: reopen modal
                }}>
                ← Back to Saved Tales
              </button>
            </div>
          )}
        </main>
      </div>
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onSubmit={handleAuth}
      />
      {showSavedTales && (
        <SavedTales
          tales={savedTales}
          onClose={() => setShowSavedTales(false)}
          onDelete={handleDeleteTale}
          onReadMore={handleReadMore}
        />
      )}
    </div>
  );
}
