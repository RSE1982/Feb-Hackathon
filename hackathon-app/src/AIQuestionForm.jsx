import React, { useState } from 'react';

const AIQuestionForm = ({ data }) => {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!question.trim()) return;

    setLoading(true);
    setError('');
    setAnswer('');

    try {
      // Prepare data context for the AI
      const dataContext = data.map(row => ({
        year: row.year,
        quarter: row.quarter,
        region: row.region,
        life_satisfaction: row.life_satisfaction,
        worthwhile: row.worthwhile,
        happiness: row.happiness,
        anxiety: row.anxiety,
        wellbeing_index: row.wellbeing_index,
        loneliness_often_pct: row.lonely_often_or_sometimes_pct,
        loneliness_at_least_occasionally_pct: row.lonely_at_least_occasionally_pct
      }));

      const prompt = `You are an AI assistant specialized in analyzing UK wellbeing and loneliness data. 
      
Here is the dataset containing regional personal wellbeing and loneliness statistics for 2025:

${JSON.stringify(dataContext, null, 2)}

The data includes:
- year: Year of data collection
- quarter: Quarter (1, 2, 3, 4)
- region: UK region name
- life_satisfaction: Life satisfaction score (0-10 scale)
- worthwhile: Feeling that activities are worthwhile (0-10 scale)
- happiness: Happiness rating (0-10 scale)
- anxiety: Anxiety level (0-10 scale, higher means more anxious)
- wellbeing_index: Overall wellbeing index
- loneliness_often_pct: Percentage of people feeling lonely often or sometimes
- loneliness_at_least_occasionally_pct: Percentage of people feeling lonely at least occasionally

IMPORTANT GUARDRAILS:
1. ONLY answer questions about this specific dataset
2. If the question is outside the scope of this data, respond with: "I can only answer questions about the UK wellbeing and loneliness data provided."
3. Do not make up information or use external knowledge
4. Be helpful and specific with your answers
5. Use the actual data values to support your answers

User question: ${question}`;

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent?key=${import.meta.env.VITE_GEMINI_API_KEY}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contents: [{
              parts: [{
                text: prompt
              }]
            }]
          })
        }
      );

      if (!response.ok) {
        throw new Error('Failed to get response from AI');
      }

      const result = await response.json();
      const aiResponse = result.candidates?.[0]?.content?.parts?.[0]?.text || 'No response received';
      
      setAnswer(aiResponse);
    } catch (err) {
      setError('Failed to get answer. Please try again.');
      console.error('AI API Error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white/80 backdrop-blur rounded-lg shadow p-6">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Ask About Your Data</h2>
      <p className="text-sm text-gray-600 mb-4">
        Ask questions about the UK wellbeing and loneliness data. The AI will only answer questions related to this dataset.
      </p>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="question" className="block text-sm font-medium text-gray-700 mb-2">
            Your Question
          </label>
          <textarea
            id="question"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="e.g., Which region has the highest life satisfaction score? or What is the average loneliness rate in London?"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
            rows="3"
            disabled={loading}
          />
        </div>
        
        <button
          type="submit"
          disabled={loading || !question.trim()}
          className="px-4 py-2 bg-pink-600 text-white rounded-md hover:bg-pink-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? 'Getting Answer...' : 'Ask Question'}
        </button>
      </form>

      {error && (
        <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-md">
          {error}
        </div>
      )}

      {answer && (
        <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-md">
          <h3 className="font-semibold text-blue-800 mb-2">Answer:</h3>
          <p className="text-gray-700 whitespace-pre-wrap">{answer}</p>
        </div>
      )}
    </div>
  );
};

export default AIQuestionForm;
