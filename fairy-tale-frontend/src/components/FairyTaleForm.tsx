import React, {useState, Children} from 'react';
import type {ChangeEvent, FormEvent} from 'react';
import {
  BookOpenIcon,
  LoaderIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  BeakerIcon,
} from 'lucide-react';
import type {FairyTaleFormData} from '@/lib/types';

interface FairyTaleFormProps {
  onSubmit: (data: FairyTaleFormData) => void;
  isGenerating: boolean;
  isCollapsed?: boolean;
  onExpand?: () => void;
}

export const FairyTaleForm: React.FC<FairyTaleFormProps> = ({
  onSubmit,
  isGenerating,
  isCollapsed,
  onExpand,
}) => {
  const [formData, setFormData] = useState<FairyTaleFormData>({
    age: 'Young Children (5-8 years)',
    topic: '',
    moral: '',
    length: 'Medium (3-5 min read)',
    language: 'English',
    scientific_note: false,
    scientific_topic: '',
    custom_scientific_note: '',
    cultural_fit: 'western',
    with_audio: false,
  });

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) => {
    const {name, value, type} = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-3xl mx-auto border border-purple-200 overflow-hidden">
      {!isCollapsed ? (
        <>
          <h2 className="text-2xl font-semibold text-purple-800 mb-4">
            Customize Your Fairy Tale
          </h2>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Age Group */}
              <div>
                <label
                  htmlFor="age"
                  className="block text-sm font-medium text-gray-700 mb-1">
                  Age Group
                </label>
                <select
                  id="age"
                  name="age"
                  value={formData.age}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required>
                  <option value="Toddlers (3-4 years)">
                    Toddlers (3-4 years)
                  </option>
                  <option value="Young Children (5-8 years)">
                    Young Children (5-8 years)
                  </option>
                  <option value="Older Children (9-12 years)">
                    Older Children (9-12 years)
                  </option>
                  <option value="Teenagers (13+)">Teenagers (13+)</option>
                  <option value="Adults">Adults</option>
                </select>
              </div>
              {/* Topic */}
              <div>
                <label
                  htmlFor="topic"
                  className="block text-sm font-medium text-gray-700 mb-1">
                  Topic
                </label>
                <input
                  type="text"
                  id="topic"
                  name="topic"
                  value={formData.topic}
                  onChange={handleChange}
                  placeholder="e.g. Dragons, Friendship, Adventure"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              {/* Moral */}
              <div>
                <label
                  htmlFor="moral"
                  className="block text-sm font-medium text-gray-700 mb-1">
                  Moral of the Story
                </label>
                <input
                  type="text"
                  id="moral"
                  name="moral"
                  value={formData.moral}
                  onChange={handleChange}
                  placeholder="e.g. Kindness pays off, Honesty is important"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              {/* Length */}
              <div>
                <label
                  htmlFor="length"
                  className="block text-sm font-medium text-gray-700 mb-1">
                  Story Length
                </label>
                <select
                  id="length"
                  name="length"
                  value={formData.length}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500">
                  <option value="short">Short (1-2 min read)</option>
                  <option value="medium">Medium (3-5 min read)</option>
                  <option value="long">Long (6-10 min read)</option>
                </select>
              </div>
              {/* Language */}
              <div>
                <label
                  htmlFor="language"
                  className="block text-sm font-medium text-gray-700 mb-1">
                  Language
                </label>
                <select
                  id="language"
                  name="language"
                  value={formData.language}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500">
                  <option value="English">English</option>
                  <option value="English">Kazakh</option>
                  <option value="Russian">Russian</option>
                  <option value="Japanese">Japanese</option>
                  <option value="German">German</option>
                </select>
              </div>
              {/* Cultural Fit */}
              <div>
                <label
                  htmlFor="cultural_fit"
                  className="block text-sm font-medium text-gray-700 mb-1">
                  Cultural Background
                </label>
                <select
                  id="cultural_fit"
                  name="cultural_fit"
                  value={formData.cultural_fit}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500">
                  <option value="western">Western</option>
                  <option value="eastern">Eastern</option>
                  <option value="african">African</option>
                  <option value="latinamerican">Latin American</option>
                  <option value="middleeastern">Middle Eastern</option>
                  <option value="nordic">Nordic</option>
                  <option value="universal">Universal</option>
                </select>
              </div>
              {/* Replace the Scientific Note checkbox with this new section */}
              <div className="md:col-span-2 border rounded-lg p-4 bg-purple-50">
                <div
                  className="flex items-center justify-between cursor-pointer"
                  onClick={() =>
                    setFormData(prev => ({
                      ...prev,
                      scientific_note: !prev.scientific_note,
                    }))
                  }>
                  <div className="flex items-center">
                    <BeakerIcon className="h-5 w-5 text-purple-600 mr-2" />
                    <label className="text-sm font-medium text-gray-700">
                      Scientific Knowledge Enhancement
                    </label>
                  </div>
                  <button
                    type="button"
                    className="text-purple-600 hover:text-purple-700"
                    aria-label={
                      formData.scientific_note
                        ? 'Collapse scientific options'
                        : 'Expand scientific options'
                    }>
                    {formData.scientific_note ? (
                      <ChevronUpIcon className="h-5 w-5" />
                    ) : (
                      <ChevronDownIcon className="h-5 w-5" />
                    )}
                  </button>
                </div>
                {formData.scientific_note && (
                  <div className="mt-4 space-y-4">
                    <div>
                      <label
                        htmlFor="scientific_topic"
                        className="block text-sm font-medium text-gray-700 mb-1">
                        Choose Scientific Topic
                      </label>
                      <select
                        id="scientific_topic"
                        name="scientific_topic"
                        value={formData.scientific_topic}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500">
                        <option value="">Select a topic...</option>
                        <option value="astronomy">
                          Astronomy (Stars, Planets, Space)
                        </option>
                        <option value="biology">
                          Biology (Plants, Animals, Ecosystems)
                        </option>
                        <option value="chemistry">
                          Chemistry (Matter, Reactions)
                        </option>
                        <option value="physics">
                          Physics (Forces, Energy)
                        </option>
                        <option value="weather">Weather & Climate</option>
                        <option value="human_body">Human Body</option>
                        <option value="geology">
                          Geology (Rocks, Minerals, Earth)
                        </option>
                        <option value="custom">Custom Scientific Topic</option>
                      </select>
                    </div>
                    {formData.scientific_topic === 'custom' && (
                      <div>
                        <label
                          htmlFor="custom_scientific_note"
                          className="block text-sm font-medium text-gray-700 mb-1">
                          Custom Scientific Knowledge
                        </label>
                        <textarea
                          id="custom_scientific_note"
                          name="custom_scientific_note"
                          value={formData.custom_scientific_note}
                          onChange={handleChange}
                          placeholder="Describe the scientific concept you'd like to include..."
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 min-h-[100px]"
                        />
                      </div>
                    )}
                  </div>
                )}
              </div>
              {/* With Audio */}
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="with_audio"
                  name="with_audio"
                  checked={formData.with_audio}
                  onChange={handleChange}
                  className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                />
                <label
                  htmlFor="with_audio"
                  className="ml-2 block text-sm text-gray-700">
                  Generate Audio Narration
                </label>
              </div>
            </div>
            {/* Submit Button */}
            <div className="mt-8">
              <button
                type="submit"
                disabled={isGenerating}
                className="w-full bg-gradient-to-r from-purple-600 to-blue-500 text-white py-3 px-6 rounded-md shadow-md hover:from-purple-700 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50 disabled:opacity-70 transition-all duration-200 flex items-center justify-center">
                {isGenerating ? (
                  <>
                    <LoaderIcon className="animate-spin h-5 w-5 mr-2" />
                    Creating Your Magical Tale...
                  </>
                ) : (
                  <>
                    <BookOpenIcon className="h-5 w-5 mr-2" />
                    Generate Fairy Tale
                  </>
                )}
              </button>
            </div>
          </form>
        </>
      ) : (
        <button
          onClick={onExpand}
          className="w-full bg-gradient-to-r from-purple-600 to-blue-500 text-white py-3 px-6 rounded-md shadow-md hover:from-purple-700 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50 disabled:opacity-70 transition-all duration-200 flex items-center justify-center">
          <BookOpenIcon className="h-5 w-5 mr-2" />
          Create Another Tale
        </button>
      )}
    </div>
  );
};
