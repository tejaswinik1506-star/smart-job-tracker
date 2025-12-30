import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { TextArea } from '../components/ui/Input';
import { Icons } from '../components/ui/icons';
import { analyzeResume, extractTextFromFile } from '../services/resumeAnalyzer';
import type { ResumeAnalysis } from '../types';

export const ResumeAnalyzer: React.FC = () => {
  const [resumeText, setResumeText] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [analysis, setAnalysis] = useState<ResumeAnalysis | null>(null);
  const [loading, setLoading] = useState(false);
  const [fileName, setFileName] = useState('');

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    setLoading(true);

    try {
      const text = await extractTextFromFile(file);
      setResumeText(text);
    } catch (error) {
      alert('Failed to read file. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleAnalyze = () => {
    if (!resumeText.trim() || !jobDescription.trim()) {
      alert('Please provide both resume and job description');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      const result = analyzeResume(resumeText, jobDescription);
      setAnalysis(result);
      setLoading(false);
    }, 1000);
  };

  const handleReset = () => {
    setResumeText('');
    setJobDescription('');
    setAnalysis(null);
    setFileName('');
  };

  const getMatchColor = (percentage: number) => {
    if (percentage >= 70) return 'text-green-600 dark:text-green-400';
    if (percentage >= 50) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  const getMatchBgColor = (percentage: number) => {
    if (percentage >= 70) return 'from-green-500 to-green-600';
    if (percentage >= 50) return 'from-yellow-500 to-yellow-600';
    return 'from-red-500 to-red-600';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Resume Analyzer</h1>
        <p className="text-muted-foreground mt-1">
          Compare your resume against job descriptions
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Section */}
        <div className="space-y-6">
          {/* Resume Upload */}
          <Card>
            <CardHeader>
              <CardTitle>Your Resume</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Upload Resume (Text/PDF)
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="file"
                    accept=".txt,.pdf"
                    onChange={handleFileUpload}
                    className="hidden"
                    id="resume-upload"
                  />
                  <label
                    htmlFor="resume-upload"
                    className="flex-1 cursor-pointer px-4 py-2 border-2 border-dashed border-border rounded-lg text-center hover:border-primary transition-colors"
                  >
                    {fileName || 'Click to upload or drag and drop'}
                  </label>
                </div>
              </div>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border"></div>
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="px-2 bg-card text-muted-foreground">OR</span>
                </div>
              </div>

              <TextArea
                label="Paste Resume Text"
                placeholder="Paste your resume content here..."
                value={resumeText}
                onChange={(e) => setResumeText(e.target.value)}
                className="min-h-[200px]"
              />
            </CardContent>
          </Card>

          {/* Job Description */}
          <Card>
            <CardHeader>
              <CardTitle>Job Description</CardTitle>
            </CardHeader>
            <CardContent>
              <TextArea
                label="Paste Job Description"
                placeholder="Paste the job description here..."
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                className="min-h-[200px]"
              />
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button
              onClick={handleAnalyze}
              isLoading={loading}
              disabled={!resumeText || !jobDescription}
              className="flex-1"
            >
              Analyze Match
            </Button>
            <Button variant="secondary" onClick={handleReset}>
              Reset
            </Button>
          </div>
        </div>

        {/* Results Section */}
        <div className="space-y-6">
          {!analysis ? (
            <Card>
              <CardContent className="py-20 text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 200 }}
                  className="flex justify-center mb-4"
                >
                  <Icons.search className="w-20 h-20 text-gray-400" />
                </motion.div>
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  Ready to Analyze
                </h3>
                <p className="text-muted-foreground">
                  Upload your resume and paste a job description to see how well they match
                </p>
              </CardContent>
            </Card>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              {/* Match Score */}
              <Card>
                <div className={`h-2 bg-gradient-to-r ${getMatchBgColor(analysis.matchPercentage)}`} />
                <CardHeader>
                  <CardTitle>Match Score</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-center">
                    <div className="text-center">
                      <div
                        className={`text-6xl font-bold ${getMatchColor(
                          analysis.matchPercentage
                        )}`}
                      >
                        {analysis.matchPercentage}%
                      </div>
                      <p className="text-muted-foreground mt-2">
                        {analysis.matchPercentage >= 70
                          ? 'Excellent Match!'
                          : analysis.matchPercentage >= 50
                          ? 'Good Match'
                          : 'Needs Improvement'}
                      </p>
                    </div>
                  </div>
                  <div className="mt-6 w-full bg-secondary rounded-full h-4">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${analysis.matchPercentage}%` }}
                      transition={{ duration: 1, ease: 'easeOut' }}
                      className={`h-4 rounded-full bg-gradient-to-r ${getMatchBgColor(
                        analysis.matchPercentage
                      )}`}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Matched Keywords */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Icons.check className="w-5 h-5 text-green-500" />
                    Matched Keywords ({analysis.matchedKeywords.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {analysis.matchedKeywords.map((keyword, index) => (
                      <motion.span
                        key={index}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.05 }}
                        className="px-3 py-1 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 rounded-full text-sm font-medium"
                      >
                        {keyword}
                      </motion.span>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Missing Keywords */}
              {analysis.missingKeywords.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Icons.warning className="w-5 h-5 text-orange-500" />
                      Missing Keywords ({analysis.missingKeywords.length})
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {analysis.missingKeywords.map((keyword, index) => (
                        <motion.span
                          key={index}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: index * 0.05 }}
                          className="px-3 py-1 bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200 rounded-full text-sm font-medium"
                        >
                          {keyword}
                        </motion.span>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Suggestions */}
              <Card>
                <CardHeader>
                  <CardTitle>💡 Suggestions</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {analysis.suggestions.map((suggestion, index) => (
                      <motion.li
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-start gap-2 text-sm text-foreground"
                      >
                        <span className="text-primary mt-0.5">•</span>
                        <span>{suggestion}</span>
                      </motion.li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};
