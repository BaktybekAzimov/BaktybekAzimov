import React, { useState, useEffect } from 'react';
import { MainLayout } from '../components/layout/MainLayout';
import { Header } from '../components/layout/Header';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { Modal } from '../components/ui/Modal';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { Badge } from '../components/ui/Badge';
import {
  Users as UsersIcon,
  Plus,
  Edit,
  Trash2,
  Shield,
  Mail,
  Phone,
  Calendar,
  Send,
  CheckCircle,
  AlertTriangle,
  RefreshCw
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { formatDate } from '../lib/utils';

interface User {
  id: string;
  email: string;
  role: 'admin' | 'dispatcher' | 'driver';
  full_name: string | null;
  phone: string | null;
  created_at: string;
  last_sign_in_at: string | null;
  email_verified: boolean;
  invite_sent_at: string | null;
}

export const Users: React.FC = () => {
  const { isAdmin } = useAuth();
  const { t } = useLanguage();
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [formData, setFormData] = useState({
    email: '',
    role: 'driver' as 'admin' | 'dispatcher' | 'driver',
    full_name: '',
    phone: '',
  });

  // Email invite state
  const [inviteStep, setInviteStep] = useState<'form' | 'sending' | 'success' | 'error'>('form');
  const [inviteError, setInviteError] = useState<string | null>(null);
  const [tempPassword, setTempPassword] = useState('');

  useEffect(() => {
    if (isAdmin) {
      loadUsers();
    }
  }, [isAdmin]);

  useEffect(() => {
    filterUsers();
  }, [users, searchTerm, roleFilter]);

  const loadUsers = async () => {
    try {
      setLoading(true);

      // Получаем пользователей из auth.users через RPC или прямой запрос
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      setUsers(data || []);
    } catch (error) {
      console.error('Error loading users:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterUsers = () => {
    let filtered = users;

    // Поиск
    if (searchTerm) {
      filtered = filtered.filter(user =>
        user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.phone?.includes(searchTerm)
      );
    }

    // Фильтр по роли
    if (roleFilter !== 'all') {
      filtered = filtered.filter(user => user.role === roleFilter);
    }

    setFilteredUsers(filtered);
  };

  const handleAddUser = () => {
    setEditingUser(null);
    setFormData({
      email: '',
      role: 'driver',
      full_name: '',
      phone: '',
    });
    setInviteStep('form');
    setInviteError(null);
    setTempPassword('');
    setIsModalOpen(true);
  };

  // Generate secure temporary password
  const generateTempPassword = (): string => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789!@#$%';
    let password = '';
    for (let i = 0; i < 12; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
  };

  const handleEditUser = (user: User) => {
    setEditingUser(user);
    setFormData({
      email: user.email,
      role: user.role,
      full_name: user.full_name || '',
      phone: user.phone || '',
    });
    setIsModalOpen(true);
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm(t('users.confirm_delete'))) return;

    try {
      const { error } = await supabase
        .from('profiles')
        .delete()
        .eq('id', userId);

      if (error) throw error;

      loadUsers();
    } catch (error) {
      console.error('Error deleting user:', error);
      alert(t('users.delete_error'));
    }
  };

  // Валидация email - все домены СНГ
  const validateEmail = (email: string): string | null => {
    // Проверка формата
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return t('users.invalid_email_format') || 'Неверный формат email';
    }

    // Полный список доменов СНГ и международных
    const allowedDomains = [
      // Международные
      'gmail.com', 'outlook.com', 'hotmail.com', 'yahoo.com', 'icloud.com', 'protonmail.com',
      // Россия
      'mail.ru', 'yandex.ru', 'ya.ru', 'rambler.ru', 'bk.ru', 'inbox.ru', 'list.ru', 'internet.ru',
      // Казахстан
      'mail.kz', 'inbox.kz', 'nur.kz',
      // Кыргызстан
      'mail.kg', 'kg.ru',
      // Узбекистан
      'mail.uz', 'inbox.uz',
      // Украина
      'ukr.net', 'i.ua', 'meta.ua', 'email.ua', 'bigmir.net',
      // Беларусь
      'tut.by', 'mail.by', 'yandex.by',
      // Таджикистан
      'mail.tj',
      // Азербайджан
      'mail.az', 'box.az',
      // Армения
      'mail.am',
      // Грузия
      'mail.ge', 'posta.ge',
      // Молдова
      'mail.md',
      // Туркменистан
      'online.tm',
    ];

    const domain = email.split('@')[1]?.toLowerCase();

    if (!allowedDomains.includes(domain)) {
      return `Домен @${domain} не разрешён. Используйте популярные почтовые сервисы (gmail, mail.ru, yandex и др.)`;
    }

    return null; // OK
  };

  // Handle form submit - create user with Supabase Auth and send invite
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (editingUser) {
      // Update existing user
      try {
        const { error } = await supabase
          .from('profiles')
          .update({
            role: formData.role,
            full_name: formData.full_name,
            phone: formData.phone,
          })
          .eq('id', editingUser.id);

        if (error) throw error;
        setIsModalOpen(false);
        loadUsers();
      } catch (error: any) {
        console.error('Error updating user:', error);
        alert(error.message || t('users.save_error'));
      }
      return;
    }

    // New user - validate and send invite
    const emailError = validateEmail(formData.email);
    if (emailError) {
      alert(emailError);
      return;
    }

    setInviteStep('sending');
    setInviteError(null);

    try {
      // Check for existing user
      const { data: existingUser } = await supabase
        .from('profiles')
        .select('id')
        .eq('email', formData.email)
        .single();

      if (existingUser) {
        setInviteError(t('users.email_exists'));
        setInviteStep('error');
        return;
      }

      // Generate temporary password
      const password = generateTempPassword();
      setTempPassword(password);

      // Create user in Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: password,
        options: {
          data: {
            role: formData.role,
            full_name: formData.full_name,
            phone: formData.phone,
          },
          emailRedirectTo: `${window.location.origin}/login`,
        },
      });

      if (authError) {
        // Check if user already exists in Auth
        if (authError.message.includes('already registered')) {
          setInviteError('Этот email уже зарегистрирован в системе');
          setInviteStep('error');
          return;
        }
        throw authError;
      }

      if (!authData.user) {
        throw new Error('Не удалось создать пользователя');
      }

      // Create profile in profiles table
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: authData.user.id,
          email: formData.email,
          role: formData.role,
          full_name: formData.full_name,
          phone: formData.phone,
          email_verified: false,
          invite_sent_at: new Date().toISOString(),
        });

      if (profileError) {
        console.error('Profile creation error:', profileError);
        // Profile might be created by trigger, ignore the error
      }

      // Send password reset email so user can set their own password
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(formData.email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (resetError) {
        console.error('Password reset email error:', resetError);
        // Not critical, user can still use temp password
      }

      setInviteStep('success');
      loadUsers();
    } catch (error: any) {
      console.error('Error creating user:', error);
      setInviteError(error.message || 'Ошибка при создании пользователя');
      setInviteStep('error');
    }
  };

  // Resend invite email
  const resendInvite = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) throw error;

      // Update invite_sent_at
      await supabase
        .from('profiles')
        .update({ invite_sent_at: new Date().toISOString() })
        .eq('email', email);

      alert('Приглашение отправлено повторно на ' + email);
    } catch (error: any) {
      console.error('Error resending invite:', error);
      alert('Ошибка: ' + error.message);
    }
  };

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case 'admin':
        return 'error';
      case 'dispatcher':
        return 'warning';
      case 'driver':
        return 'success';
      default:
        return 'default';
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'admin':
        return t('role.admin');
      case 'dispatcher':
        return t('role.dispatcher');
      case 'driver':
        return t('role.driver');
      default:
        return role;
    }
  };

  if (!isAdmin) {
    return (
      <MainLayout>
        <Header title={t('users.title')} icon={UsersIcon} />
        <div className="p-8">
          <Card className="bg-error-50 dark:bg-error-900/20 border border-error-200 dark:border-error-800">
            <p className="text-error-700 dark:text-error-400">{t('users.no_access')}</p>
          </Card>
        </div>
      </MainLayout>
    );
  }

  if (loading) {
    return (
      <MainLayout>
        <Header title={t('users.title')} icon={UsersIcon} />
        <div className="flex items-center justify-center h-96">
          <LoadingSpinner size="lg" />
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <Header
        title={t('users.title')}
        subtitle={t('users.subtitle')}
        icon={UsersIcon}
        actions={
          <Button onClick={handleAddUser} className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            {t('users.add')}
          </Button>
        }
      />

      <div className="p-3 sm:p-4 md:p-6 lg:p-8 space-y-4 md:space-y-6">
        {/* Фильтры */}
        <Card>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <Input
                type="text"
                placeholder={t('users.search_placeholder')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="w-full sm:w-48">
              <Select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                options={[
                  { value: 'all', label: t('users.all_roles') },
                  { value: 'admin', label: t('users.admins') },
                  { value: 'dispatcher', label: t('users.dispatchers') },
                  { value: 'driver', label: t('users.drivers_role') },
                ]}
              />
            </div>
          </div>
        </Card>

        {/* Статистика */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-gradient-to-br from-primary-50 to-primary-100 dark:from-primary-900/30 dark:to-primary-800/30 border-primary-200 dark:border-primary-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-primary-700 dark:text-primary-400">{t('users.total')}</p>
                <p className="text-2xl font-bold text-primary-900 dark:text-primary-100">{users.length}</p>
              </div>
              <UsersIcon className="w-8 h-8 text-primary-600 dark:text-primary-400 opacity-50" />
            </div>
          </Card>
          <Card className="bg-gradient-to-br from-error-50 to-error-100 dark:from-error-900/30 dark:to-error-800/30 border-error-200 dark:border-error-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-error-700 dark:text-error-400">{t('users.admins')}</p>
                <p className="text-2xl font-bold text-error-900 dark:text-error-100">
                  {users.filter(u => u.role === 'admin').length}
                </p>
              </div>
              <Shield className="w-8 h-8 text-error-600 dark:text-error-400 opacity-50" />
            </div>
          </Card>
          <Card className="bg-gradient-to-br from-warning-50 to-warning-100 dark:from-warning-900/30 dark:to-warning-800/30 border-warning-200 dark:border-warning-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-warning-700 dark:text-warning-400">{t('users.dispatchers')}</p>
                <p className="text-2xl font-bold text-warning-900 dark:text-warning-100">
                  {users.filter(u => u.role === 'dispatcher').length}
                </p>
              </div>
              <UsersIcon className="w-8 h-8 text-warning-600 dark:text-warning-400 opacity-50" />
            </div>
          </Card>
          <Card className="bg-gradient-to-br from-success-50 to-success-100 dark:from-success-900/30 dark:to-success-800/30 border-success-200 dark:border-success-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-success-700 dark:text-success-400">{t('users.drivers_role')}</p>
                <p className="text-2xl font-bold text-success-900 dark:text-success-100">
                  {users.filter(u => u.role === 'driver').length}
                </p>
              </div>
              <UsersIcon className="w-8 h-8 text-success-600 dark:text-success-400 opacity-50" />
            </div>
          </Card>
        </div>

        {/* Таблица пользователей */}
        <Card>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-secondary-200 dark:divide-secondary-700">
              <thead className="bg-secondary-50 dark:bg-secondary-800">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 dark:text-secondary-400 uppercase tracking-wider">
                    {t('users.user')}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 dark:text-secondary-400 uppercase tracking-wider">
                    {t('users.role')}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 dark:text-secondary-400 uppercase tracking-wider">
                    {t('users.contacts')}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 dark:text-secondary-400 uppercase tracking-wider">
                    {t('users.created')}
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-secondary-500 dark:text-secondary-400 uppercase tracking-wider">
                    {t('trips.actions')}
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-secondary-900 divide-y divide-secondary-200 dark:divide-secondary-700">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-secondary-50 dark:hover:bg-secondary-800 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center">
                          <span className="text-primary-700 dark:text-primary-300 font-semibold text-sm">
                            {user.full_name?.charAt(0) || user.email.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-secondary-900 dark:text-secondary-100">
                            {user.full_name || t('users.no_name')}
                          </div>
                          <div className="text-sm text-secondary-500 dark:text-secondary-400 flex items-center gap-1">
                            <Mail className="w-3 h-3" />
                            {user.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge variant={getRoleBadgeVariant(user.role)}>
                        {getRoleLabel(user.role)}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {user.phone ? (
                        <div className="flex items-center gap-1 text-sm text-secondary-600 dark:text-secondary-400">
                          <Phone className="w-3 h-3" />
                          {user.phone}
                        </div>
                      ) : (
                        <span className="text-sm text-secondary-400">—</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-1 text-sm text-secondary-600 dark:text-secondary-400">
                        <Calendar className="w-3 h-3" />
                        {formatDate(user.created_at)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end gap-2">
                        {!user.email_verified && (
                          <button
                            onClick={() => resendInvite(user.email)}
                            className="text-warning-600 hover:text-warning-900 dark:text-warning-400 dark:hover:text-warning-300"
                            title="Отправить приглашение повторно"
                          >
                            <RefreshCw className="w-4 h-4" />
                          </button>
                        )}
                        <button
                          onClick={() => handleEditUser(user)}
                          className="text-primary-600 hover:text-primary-900 dark:text-primary-400 dark:hover:text-primary-300"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteUser(user.id)}
                          className="text-error-600 hover:text-error-900 dark:text-error-400 dark:hover:text-error-300"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {filteredUsers.length === 0 && (
              <div className="text-center py-12">
                <UsersIcon className="mx-auto h-12 w-12 text-secondary-400" />
                <h3 className="mt-2 text-sm font-medium text-secondary-900 dark:text-secondary-100">
                  {t('users.not_found')}
                </h3>
                <p className="mt-1 text-sm text-secondary-500 dark:text-secondary-400">
                  {t('users.try_search')}
                </p>
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* Модальное окно для добавления/редактирования */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => { setIsModalOpen(false); setInviteStep('form'); }}
        title={
          editingUser
            ? t('modal.edit_user')
            : inviteStep === 'success'
              ? 'Приглашение отправлено'
              : inviteStep === 'error'
                ? 'Ошибка'
                : t('users.add')
        }
      >
        {inviteStep === 'form' && (
          <form onSubmit={handleFormSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-1">
                {t('auth.email')}
              </label>
              <Input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                disabled={!!editingUser}
                required
                placeholder="user@example.com"
              />
              <p className="mt-1 text-xs text-secondary-500 dark:text-secondary-400">
                На этот email будет отправлено приглашение
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-1">
                {t('users.role')}
              </label>
              <Select
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value as any })}
                options={[
                  { value: 'admin', label: t('role.admin') },
                  { value: 'dispatcher', label: t('role.dispatcher') },
                  { value: 'driver', label: t('role.driver') },
                ]}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-1">
                {t('users.full_name')}
              </label>
              <Input
                type="text"
                value={formData.full_name}
                onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                placeholder="Иван Иванов"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-1">
                {t('drivers.phone')}
              </label>
              <Input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+996 XXX XXX XXX"
              />
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)}>
                {t('button.cancel')}
              </Button>
              <Button type="submit" icon={editingUser ? undefined : <Send className="w-4 h-4" />}>
                {editingUser ? t('button.save') : 'Отправить приглашение'}
              </Button>
            </div>
          </form>
        )}

        {inviteStep === 'sending' && (
          <div className="py-8 text-center">
            <LoadingSpinner size="lg" />
            <p className="mt-4 text-secondary-600 dark:text-secondary-400">
              Создаём аккаунт и отправляем приглашение...
            </p>
          </div>
        )}

        {inviteStep === 'success' && (
          <div className="space-y-6">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-success-100 dark:bg-success-900/30 rounded-full mb-4">
                <CheckCircle className="w-8 h-8 text-success-600 dark:text-success-400" />
              </div>
              <h3 className="text-lg font-semibold text-secondary-900 dark:text-secondary-100 mb-2">
                Пользователь создан!
              </h3>
              <p className="text-sm text-secondary-600 dark:text-secondary-400">
                На email <strong>{formData.email}</strong> отправлено приглашение
              </p>
            </div>

            {/* Temporary password info */}
            <div className="bg-warning-50 dark:bg-warning-900/20 border border-warning-200 dark:border-warning-700 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-warning-600 dark:text-warning-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-warning-800 dark:text-warning-200 mb-2">
                    Временный пароль (сохраните!):
                  </p>
                  <div className="bg-white dark:bg-secondary-800 rounded px-3 py-2 font-mono text-lg">
                    {tempPassword}
                  </div>
                  <p className="text-xs text-warning-700 dark:text-warning-300 mt-2">
                    Пользователь сможет войти с этим паролем или использовать ссылку из email для установки своего пароля
                  </p>
                </div>
              </div>
            </div>

            {/* User details */}
            <div className="bg-secondary-50 dark:bg-secondary-800 rounded-lg p-4 space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-secondary-600 dark:text-secondary-400">Email:</span>
                <span className="text-sm font-medium text-secondary-900 dark:text-secondary-100">{formData.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-secondary-600 dark:text-secondary-400">Роль:</span>
                <Badge variant={getRoleBadgeVariant(formData.role)}>{getRoleLabel(formData.role)}</Badge>
              </div>
              {formData.full_name && (
                <div className="flex justify-between">
                  <span className="text-sm text-secondary-600 dark:text-secondary-400">Имя:</span>
                  <span className="text-sm font-medium text-secondary-900 dark:text-secondary-100">{formData.full_name}</span>
                </div>
              )}
            </div>

            <div className="flex justify-end pt-4">
              <Button onClick={() => { setIsModalOpen(false); setInviteStep('form'); }}>
                Готово
              </Button>
            </div>
          </div>
        )}

        {inviteStep === 'error' && (
          <div className="space-y-6">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-error-100 dark:bg-error-900/30 rounded-full mb-4">
                <AlertTriangle className="w-8 h-8 text-error-600 dark:text-error-400" />
              </div>
              <h3 className="text-lg font-semibold text-secondary-900 dark:text-secondary-100 mb-2">
                Ошибка создания
              </h3>
              <p className="text-sm text-error-600 dark:text-error-400">
                {inviteError}
              </p>
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button variant="ghost" onClick={() => { setIsModalOpen(false); setInviteStep('form'); }}>
                Закрыть
              </Button>
              <Button onClick={() => setInviteStep('form')}>
                Попробовать снова
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </MainLayout>
  );
};
