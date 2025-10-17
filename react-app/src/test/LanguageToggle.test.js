import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { LanguageProvider, useLanguage } from '../contexts/LanguageContext';
import { translations } from '../translations/translations';

// Test component to verify language context
const TestComponent = () => {
  const { language, toggleLanguage } = useLanguage();
  const t = translations[language];
  
  return (
    <div>
      <h1>{t.heroTitle}</h1>
      <button onClick={toggleLanguage} data-testid="toggle-btn">
        {language === 'en' ? 'नेपाली' : 'English'}
      </button>
    </div>
  );
};

describe('Language Toggle Functionality', () => {
  test('should start with English by default', () => {
    render(
      <LanguageProvider>
        <TestComponent />
      </LanguageProvider>
    );
    
    expect(screen.getByText(translations.en.heroTitle)).toBeInTheDocument();
    expect(screen.getByText('नेपाली')).toBeInTheDocument();
  });

  test('should toggle to Nepali when button is clicked', () => {
    render(
      <LanguageProvider>
        <TestComponent />
      </LanguageProvider>
    );
    
    const toggleButton = screen.getByTestId('toggle-btn');
    fireEvent.click(toggleButton);
    
    expect(screen.getByText(translations.ne.heroTitle)).toBeInTheDocument();
    expect(screen.getByText('English')).toBeInTheDocument();
  });

  test('should toggle back to English when clicked again', () => {
    render(
      <LanguageProvider>
        <TestComponent />
      </LanguageProvider>
    );
    
    const toggleButton = screen.getByTestId('toggle-btn');
    
    // First click - switch to Nepali
    fireEvent.click(toggleButton);
    expect(screen.getByText(translations.ne.heroTitle)).toBeInTheDocument();
    
    // Second click - switch back to English
    fireEvent.click(toggleButton);
    expect(screen.getByText(translations.en.heroTitle)).toBeInTheDocument();
  });
});

