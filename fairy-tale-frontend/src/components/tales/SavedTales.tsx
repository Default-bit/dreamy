import {ScrollIcon, TrashIcon, BookOpenIcon, XIcon} from 'lucide-react';
import {cleanText} from '../TaleOutput';
import type {Tale} from '@/lib/types';

interface SavedTalesProps {
  tales: Tale[];
  onClose: () => void;
  onDelete: (tale: Tale) => void;
  onReadMore: (tale: Tale) => void;
}
export const SavedTales = ({
  tales,
  onClose,
  onDelete,
  onReadMore,
}: SavedTalesProps) => {
  return (
    <div className="fixed inset-0 bg-transparent bg-opacity-50 backdrop-blur-2xl z-50 overflow-y-auto">
      <div className="min-h-screen px-4 text-center">
        <div className="inline-block w-full max-w-4xl my-8 text-left align-middle">
          <div className="bg-white rounded-lg shadow-xl">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div className="flex items-center">
                <BookOpenIcon className="h-6 w-6 text-purple-600 mr-2" />
                <h2 className="text-2xl font-semibold text-purple-800">
                  Your Magical Collection
                </h2>
              </div>
              <button
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700"
                aria-label="Close saved tales">
                <XIcon className="h-6 w-6" />
              </button>
            </div>
            <div className="p-6">
              {tales.length === 0 ? (
                <div className="text-center py-12">
                  <ScrollIcon className="h-12 w-12 text-purple-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No Tales Saved Yet
                  </h3>
                  <p className="text-gray-500">
                    Your magical tales will appear here once you save them
                  </p>
                </div>
              ) : (
                <div className="space-y-6">
                  {[...tales]
                    .sort((a, b) => b.date.getTime() - a.date.getTime())
                    .map((tale, index) => {
                      const {title, story} = cleanText(tale.text);

                      return (
                        <div
                          key={index}
                          className="bg-white border border-purple-100 rounded-lg p-4 hover:shadow-md transition-shadow">
                          <div className="flex justify-between items-start mb-2">
                            <div className="flex items-center">
                              <ScrollIcon className="h-5 w-5 text-purple-600 mr-2" />
                              <span className="text-sm text-gray-500">
                                {new Date(tale.date).toLocaleDateString(
                                  'en-US',
                                  {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric',
                                  },
                                )}
                              </span>
                            </div>
                            <button
                              onClick={() => onDelete(tale)}
                              className="text-gray-400 hover:text-red-500 transition-colors"
                              aria-label="Delete tale">
                              <TrashIcon className="h-5 w-5" />
                            </button>
                          </div>
                          <h3 className="text-xl font-semibold text-purple-800 mb-2">
                            {title}
                          </h3>
                          <div className="prose prose-purple max-w-none mb-4">
                            {story
                              .split('\n')
                              .slice(0, 2)
                              .map((paragraph, i) => (
                                <p
                                  key={i}
                                  className="text-gray-700 leading-relaxed">
                                  {paragraph}
                                </p>
                              ))}
                            {story.split('\n').length > 2 && (
                              <p className="text-purple-600 text-sm">
                                <button onClick={() => onReadMore(tale)}>
                                  Read More
                                </button>
                              </p>
                            )}
                          </div>
                        </div>
                      );
                    })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
