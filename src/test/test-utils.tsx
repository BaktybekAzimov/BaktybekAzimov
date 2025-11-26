import type { ReactElement } from 'react';
import { render, type RenderOptions } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../contexts/AuthContext';
import { SidebarProvider } from '../contexts/SidebarContext';
import { LanguageProvider } from '../contexts/LanguageContext';
import { ThemeProvider } from '../contexts/ThemeContext';
import { FontSizeProvider } from '../contexts/FontSizeContext';

const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <FontSizeProvider>
          <LanguageProvider>
            <AuthProvider>
              <SidebarProvider>
                {children}
              </SidebarProvider>
            </AuthProvider>
          </LanguageProvider>
        </FontSizeProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
};

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>,
) => render(ui, { wrapper: AllTheProviders, ...options });

export * from '@testing-library/react';
export { customRender as render };
