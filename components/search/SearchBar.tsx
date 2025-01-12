import React, { useRef, useEffect } from 'react';
import { Search, X, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useSearchStore } from '../../store/useSearchStore';
import { cn } from '../../lib/utils';

export function SearchBar() {
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);
  const {
    query,
    suggestions,
    isOpen,
    setQuery,
    clearQuery,
    toggleOpen,
  } = useSearchStore();

  // Handle clicks outside to close suggestions
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (inputRef.current && !inputRef.current.contains(e.target as Node)) {
        toggleOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [toggleOpen]);

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query)}`);
      toggleOpen(false);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setQuery(suggestion);
    navigate(`/search?q=${encodeURIComponent(suggestion)}`);
    toggleOpen(false);
  };

  // Group suggestions by type
  const correctionSuggestions = suggestions.filter(s => s.type === 'correction');
  const completionSuggestions = suggestions.filter(s => s.type === 'completion');
  const relatedSuggestions = suggestions.filter(s => s.type === 'related');

  return (
    <div className="relative flex-1 max-w-2xl mx-8" ref={inputRef}>
      <form onSubmit={handleSubmit}>
        <div className="relative">
          <input
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              toggleOpen(true);
            }}
            onFocus={() => toggleOpen(true)}
            placeholder="Search videos..."
            className="w-full bg-white px-6 py-2.5 pr-24 rounded-full border border-gold-200 focus:outline-none focus:ring-2 focus:ring-gold-300/50 focus:border-transparent placeholder-gray-400"
          />
          <div className="absolute right-3 top-2 flex items-center gap-2">
            {query && (
              <button
                type="button"
                onClick={() => {
                  clearQuery();
                  toggleOpen(false);
                }}
                className="text-gray-400 hover:text-gray-600 p-1"
              >
                <X className="h-5 w-5" />
              </button>
            )}
            <button
              type="submit"
              className="text-gold-400 hover:text-gold-500 p-1"
            >
              <Search className="h-5 w-5" />
            </button>
          </div>
        </div>
      </form>

      {/* Suggestions Dropdown */}
      {isOpen && suggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-lg border border-gray-100 overflow-hidden z-50">
          {/* Spelling Corrections */}
          {correctionSuggestions.length > 0 && (
            <div className="border-b border-gray-100">
              {correctionSuggestions.map((suggestion, index) => (
                <button
                  key={`correction-${index}`}
                  onClick={() => handleSuggestionClick(suggestion.text)}
                  className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center gap-3"
                >
                  <AlertCircle className="h-4 w-4 text-purple-500" />
                  <div>
                    <div className="text-sm text-purple-600 font-medium mb-0.5">
                      Did you mean:
                    </div>
                    <div className="font-medium">{suggestion.text}</div>
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* Completions */}
          {completionSuggestions.map((suggestion, index) => (
            <button
              key={`completion-${index}`}
              onClick={() => handleSuggestionClick(suggestion.text)}
              className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-3"
            >
              <Search className="h-4 w-4 text-gold-500" />
              <div className="font-medium">{suggestion.text}</div>
            </button>
          ))}

          {/* Related Results */}
          {relatedSuggestions.length > 0 && (
            <div className="border-t border-gray-100">
              {relatedSuggestions.map((suggestion, index) => (
                <button
                  key={`related-${index}`}
                  onClick={() => handleSuggestionClick(suggestion.text)}
                  className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-3"
                >
                  <Search className="h-4 w-4 text-blue-500" />
                  <div>
                    <div className="font-medium">{suggestion.text}</div>
                    <div className="text-xs text-gray-500">Related</div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}