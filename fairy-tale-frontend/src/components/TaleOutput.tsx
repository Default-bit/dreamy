import {ScrollIcon, BookmarkIcon} from 'lucide-react';
import {AudioPlayer} from './audio/AudioPlayer';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';

import React, {useEffect, useState} from 'react';

type FormattedTextProps = {
  text: string;
  onTitleExtracted?: (title: string) => void;
};

export const cleanText = (input: string): {title: string; story: string} => {
  // Remove <think>...</think>
  const withoutThink = input.replace(/<think>[\s\S]*?<\/think>/gi, '').trim();

  // Truncate after "The End."
  const endIndex = withoutThink.indexOf('The End.');
  const truncated =
    endIndex !== -1
      ? withoutThink.substring(0, endIndex + 'The End.'.length)
      : withoutThink;

  // Extract all non-empty lines
  const lines = truncated
    .split('\n')
    .map(line => line.trim())
    .filter(Boolean);

  // Extract title from first line, stripping any markdown bold/italic
  const rawTitle = lines[0] || 'Your Magical Tale';
  const title = rawTitle.replace(/[*_`"]/g, '').trim();

  // Remove the title line from the rest of the story
  const storyWithoutTitle = lines.slice(1).join('\n');

  return {title, story: storyWithoutTitle};
};

const FormattedText: React.FC<FormattedTextProps> = ({
  text,
  onTitleExtracted,
}) => {
  const [cleaned, setCleaned] = useState({title: '', story: ''});

  useEffect(() => {
    const result = cleanText(text);
    setCleaned(result);
    if (onTitleExtracted) {
      onTitleExtracted(result.title);
    }
  }, [text, onTitleExtracted]);

  return (
    <ReactMarkdown
      children={cleaned.story}
      remarkPlugins={[remarkGfm]}
      rehypePlugins={[rehypeHighlight]}
      components={{
        strong: ({children}) => (
          <strong className="font-semibold text-purple-800">{children}</strong>
        ),
        em: ({children}) => (
          <em className="italic text-purple-600">{children}</em>
        ),
        blockquote: ({children}) => (
          <blockquote className="border-l-4 pl-4 italic text-gray-600">
            {children}
          </blockquote>
        ),
        a: ({href, children}) => (
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 underline">
            {children}
          </a>
        ),
        code: ({children}) => (
          <code className="bg-gray-100 text-sm px-1 py-0.5 rounded">
            {children}
          </code>
        ),
      }}
    />
  );
};

interface TaleOutputProps {
  tale: {
    text: string;
    audioUrl?: string;
  };
  withAudio?: boolean;
  onSave?: () => void;
  isSaved?: boolean;
}

export const TaleOutput = ({
  tale,
  withAudio,
  onSave,
  isSaved,
}: TaleOutputProps) => {
  const [title, setTitle] = useState('');
  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-3xl mx-auto border border-purple-200">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <ScrollIcon className="h-6 w-6 text-purple-600 mr-2" />
          <h2 className="text-2xl font-semibold text-purple-800">
            {title || 'Your Magical Tale'}
          </h2>
        </div>
        {onSave && (
          <button
            onClick={onSave}
            className={`flex items-center space-x-2 px-3 py-1 rounded-md ${
              isSaved
                ? 'text-purple-600 bg-purple-50'
                : 'text-gray-600 hover:text-purple-600'
            }`}>
            <BookmarkIcon className="h-5 w-5" />
            <span>{isSaved ? 'Saved' : 'Save Tale'}</span>
          </button>
        )}
      </div>
      {/* <div className="prose prose-purple max-w-none">
        {tale.text.split('\n').map((paragraph, index) => (
          <p key={index} className="mb-4 text-gray-700 leading-relaxed">
            {paragraph}
          </p>
        ))}
      </div> */}
      {/* <FormattedText text={tale.text} /> */}
      <FormattedText text={tale.text} onTitleExtracted={setTitle} />
      {withAudio && <AudioPlayer audioUrl={tale.audioUrl} />}
    </div>
  );
};

export default FormattedText;
