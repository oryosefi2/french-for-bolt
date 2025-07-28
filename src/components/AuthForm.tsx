import React, { useState, useEffect } from 'react';
import { Mail, Lock, User, BookOpen, Eye, EyeOff, CheckCircle, AlertCircle } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import toast from 'react-hot-toast';

const AuthForm: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [formErrors, setFormErrors] = useState<{[key: string]: string}>({});
  const { signIn, signUp, loading, user } = useAuth();

  // אם המשתמש כבר מחובר, לא צריך להציג את הטופס
  useEffect(() => {
    if (user) {
      console.log('AuthForm: User already logged in, redirecting to dashboard');
    }
  }, [user]);

  const validateForm = () => {
    const errors: {[key: string]: string} = {};

    // Email validation
    if (!formData.email) {
      errors.email = 'אימייל נדרש';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'אימייל לא תקין';
    }

    // Password validation
    if (!formData.password) {
      errors.password = 'סיסמה נדרשת';
    } else if (formData.password.length < 6) {
      errors.password = 'סיסמה חייבת להכיל לפחות 6 תווים';
    }

    // Name validation for signup
    if (!isLogin && !formData.name.trim()) {
      errors.name = 'שם נדרש';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('אנא תקן את השגיאות בטופס');
      return;
    }
    
    try {
      if (isLogin) {
        await signIn(formData.email, formData.password);
      } else {
        await signUp(formData.email, formData.password, formData.name);
      }
    } catch (error) {
      // Error is handled in the auth hook
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const getInputClassName = (fieldName: string) => {
    const baseClass = "w-full pr-10 pl-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-colors text-right";
    if (formErrors[fieldName]) {
      return `${baseClass} border-red-300 focus:ring-red-500 focus:border-red-500 bg-red-50`;
    }
    return `${baseClass} border-gray-300 focus:ring-purple-500 focus:border-transparent`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 flex items-center justify-center px-4" dir="rtl">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-3 rounded-xl shadow-lg">
              <BookOpen className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">
            French<span className="text-purple-600">AI</span>
          </h1>
          <p className="text-gray-600 mt-2">
            {isLogin ? 'ברוך השב! התחבר לחשבון שלך' : 'הצטרף אלינו ותתחיל ללמוד צרפתית'}
          </p>
        </div>

        {/* Form */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
          <div className="mb-6">
            <div className="text-center">
              <h2 className="text-2xl font-semibold text-gray-900">
                {isLogin ? 'התחברות' : 'הרשמה'}
              </h2>
              <p className="text-gray-600 mt-2">
                {isLogin ? 'הזן את פרטי ההתחברות שלך' : 'צור חשבון חדש בחינם'}
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name field for signup */}
            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 text-right">
                  שם מלא *
                </label>
                <div className="relative">
                  <User className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className={getInputClassName('name')}
                    placeholder="השם המלא שלך"
                    dir="rtl"
                  />
                  {formErrors.name && (
                    <div className="flex items-center mt-1 text-red-600 text-sm justify-end">
                      <span className="mr-1">{formErrors.name}</span>
                      <AlertCircle className="w-4 h-4" />
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Email field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 text-right">
                כתובת אימייל *
              </label>
              <div className="relative">
                <Mail className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={getInputClassName('email')}
                  placeholder="your@email.com"
                  dir="ltr"
                />
                {formErrors.email && (
                  <div className="flex items-center mt-1 text-red-600 text-sm justify-end">
                    <span className="mr-1">{formErrors.email}</span>
                    <AlertCircle className="w-4 h-4" />
                  </div>
                )}
              </div>
            </div>

            {/* Password field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 text-right">
                סיסמה *
              </label>
              <div className="relative">
                <Lock className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className={getInputClassName('password')}
                  placeholder="••••••••"
                  dir="ltr"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
                {formErrors.password && (
                  <div className="flex items-center mt-1 text-red-600 text-sm justify-end">
                    <span className="mr-1">{formErrors.password}</span>
                    <AlertCircle className="w-4 h-4" />
                  </div>
                )}
              </div>
              {!isLogin && (
                <div className="mt-2 text-xs text-gray-500 text-right">
                  <div className="flex items-center space-x-reverse space-x-2 justify-end">
                    <span>לפחות 6 תווים</span>
                    <CheckCircle className={`w-3 h-3 ${formData.password.length >= 6 ? 'text-green-500' : 'text-gray-300'}`} />
                  </div>
                </div>
              )}
            </div>

            {/* Submit button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 px-4 rounded-lg hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-medium shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
            >
              {loading ? (
                <div className="flex items-center justify-center space-x-reverse space-x-2">
                  <span>{isLogin ? 'מתחבר...' : 'יוצר חשבון...'}</span>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                </div>
              ) : (
                isLogin ? 'התחבר' : 'צור חשבון'
              )}
            </button>
          </form>

          {/* Toggle between login/signup */}
          <div className="mt-6 text-center">
            <button
              onClick={() => {
                setIsLogin(!isLogin);
                setFormErrors({});
                setFormData({ email: '', password: '', name: '' });
              }}
              className="text-purple-600 hover:text-purple-700 font-medium transition-colors"
            >
              {isLogin 
                ? 'אין לך חשבון? הירשם כאן'
                : 'יש לך חשבון? התחבר כאן'
              }
            </button>
          </div>
        </div>

        {/* Features */}
        <div className="mt-8 text-center">
          <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg p-4 mb-4">
            <p className="text-sm font-medium text-green-900 mb-2">🔐 מערכת אימות מאובטחת</p>
            <div className="text-xs text-green-700 space-y-1">
              <p>✅ הצפנה מתקדמת</p>
              <p>✅ שמירת נתונים מאובטחת</p>
              <p>✅ סנכרון בין מכשירים</p>
            </div>
          </div>
          
          <p className="text-sm text-gray-600 mb-4 text-center">למה לבחור ב-FrenchAI?</p>
          <div className="grid grid-cols-3 gap-4 text-xs text-gray-500">
            <div className="flex flex-col items-center space-y-1">
              <span className="text-lg">🤖</span>
              <span className="text-center">בינה מלאכותית</span>
            </div>
            <div className="flex flex-col items-center space-y-1">
              <span className="text-lg">📊</span>
              <span className="text-center">מעקב התקדמות</span>
            </div>
            <div className="flex flex-col items-center space-y-1">
              <span className="text-lg">🎯</span>
              <span className="text-center">רמות A1-C2</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthForm;