import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Truck, Lock, AlertCircle, CheckCircle, Eye, EyeOff } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card } from '../components/ui/Card';

export const ResetPassword: React.FC = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [validatingToken, setValidatingToken] = useState(true);
  const [tokenValid, setTokenValid] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if we have a valid session from the magic link
    const checkSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();

        if (error) {
          console.error('Session error:', error);
          setTokenValid(false);
          setError('Ссылка недействительна или истекла');
        } else if (session) {
          setTokenValid(true);
        } else {
          // Try to exchange the token from URL hash
          const hashParams = new URLSearchParams(window.location.hash.substring(1));
          const accessToken = hashParams.get('access_token');
          const refreshToken = hashParams.get('refresh_token');

          if (accessToken && refreshToken) {
            const { error: setSessionError } = await supabase.auth.setSession({
              access_token: accessToken,
              refresh_token: refreshToken,
            });

            if (setSessionError) {
              setError('Ошибка авторизации. Попробуйте запросить новую ссылку.');
              setTokenValid(false);
            } else {
              setTokenValid(true);
            }
          } else {
            setError('Ссылка недействительна. Запросите новое приглашение.');
            setTokenValid(false);
          }
        }
      } catch (err) {
        console.error('Error checking session:', err);
        setError('Произошла ошибка при проверке ссылки');
        setTokenValid(false);
      } finally {
        setValidatingToken(false);
      }
    };

    checkSession();
  }, []);

  const validatePassword = (pwd: string): string | null => {
    if (pwd.length < 8) {
      return 'Пароль должен содержать минимум 8 символов';
    }
    if (!/[A-Za-z]/.test(pwd)) {
      return 'Пароль должен содержать хотя бы одну букву';
    }
    if (!/[0-9]/.test(pwd)) {
      return 'Пароль должен содержать хотя бы одну цифру';
    }
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Validate password
    const passwordError = validatePassword(password);
    if (passwordError) {
      setError(passwordError);
      setLoading(false);
      return;
    }

    // Check passwords match
    if (password !== confirmPassword) {
      setError('Пароли не совпадают');
      setLoading(false);
      return;
    }

    try {
      const { error } = await supabase.auth.updateUser({
        password: password,
      });

      if (error) throw error;

      // Update profile to mark email as verified
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await supabase
          .from('profiles')
          .update({ email_verified: true })
          .eq('id', user.id);
      }

      setSuccess(true);

      // Redirect to login after 3 seconds
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (err: any) {
      console.error('Password update error:', err);
      setError(err.message || 'Ошибка при установке пароля');
    } finally {
      setLoading(false);
    }
  };

  if (validatingToken) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-600 via-primary-700 to-primary-900 flex items-center justify-center p-4">
        <Card className="w-full max-w-md text-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-secondary-600 dark:text-secondary-400">
            Проверка ссылки...
          </p>
        </Card>
      </div>
    );
  }

  if (!tokenValid) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-600 via-primary-700 to-primary-900 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-error-100 dark:bg-error-900/30 rounded-full mb-4">
              <AlertCircle className="h-8 w-8 text-error-600 dark:text-error-400" />
            </div>
            <h1 className="text-2xl font-bold text-secondary-900 dark:text-secondary-100 mb-2">
              Ссылка недействительна
            </h1>
            <p className="text-secondary-600 dark:text-secondary-400">
              {error || 'Срок действия ссылки истёк или она уже была использована'}
            </p>
          </div>
          <Button
            onClick={() => navigate('/login')}
            variant="primary"
            className="w-full"
          >
            Перейти к входу
          </Button>
        </Card>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-600 via-primary-700 to-primary-900 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-success-100 dark:bg-success-900/30 rounded-full mb-4">
              <CheckCircle className="h-8 w-8 text-success-600 dark:text-success-400" />
            </div>
            <h1 className="text-2xl font-bold text-secondary-900 dark:text-secondary-100 mb-2">
              Пароль установлен!
            </h1>
            <p className="text-secondary-600 dark:text-secondary-400">
              Теперь вы можете войти в систему с новым паролем.
              Перенаправление через 3 секунды...
            </p>
          </div>
          <Button
            onClick={() => navigate('/login')}
            variant="primary"
            className="w-full"
          >
            Войти сейчас
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-600 via-primary-700 to-primary-900 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary-600 to-primary-800 rounded-2xl mb-4">
            <Truck className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-secondary-900 dark:text-secondary-100 mb-2">
            TruckTrack
          </h1>
          <p className="text-secondary-600 dark:text-secondary-400">
            Установите пароль для вашего аккаунта
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-error-50 dark:bg-error-900/20 border border-error-200 dark:border-error-800 rounded-lg flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-error-600 dark:text-error-400 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-error-700 dark:text-error-400">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-1">
              Новый пароль
            </label>
            <div className="relative">
              <Input
                type={showPassword ? 'text' : 'password'}
                placeholder="Минимум 8 символов"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                icon={<Lock size={18} />}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-secondary-500 hover:text-secondary-700 dark:hover:text-secondary-300"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            <p className="mt-1 text-xs text-secondary-500 dark:text-secondary-400">
              Минимум 8 символов, должен содержать буквы и цифры
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-1">
              Подтверждение пароля
            </label>
            <Input
              type={showPassword ? 'text' : 'password'}
              placeholder="Повторите пароль"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              icon={<Lock size={18} />}
              required
            />
          </div>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="w-full"
            isLoading={loading}
          >
            Установить пароль
          </Button>
        </form>
      </Card>
    </div>
  );
};
