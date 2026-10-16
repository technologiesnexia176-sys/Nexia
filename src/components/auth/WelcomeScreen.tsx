import React, { useState } from 'react';
import { useApp } from '../../context/AppContext.tsx';
import { NexiaLogo } from '../common/NexiaLogo.tsx';
import {
  ShieldCheck,
  Heart,
  Users,
  Sparkles,
  Lock,
  ArrowRight,
  CheckCircle2,
  Calendar,
  AlertCircle,
} from 'lucide-react';
import { isEligibleAdult, calculateAge } from '../../utils/safetyAndValidation.ts';

export const WelcomeScreen: React.FC = () => {
  const { login, register, setIsSafetyOpen } = useApp();

  const [mode, setMode] = useState<'welcome' | 'login' | 'register' | 'verify_email' | 'forgot_password'>('welcome');

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [birthDate, setBirthDate] = useState('2002-05-15');
  const [connectionType, setConnectionType] = useState<'Amistad' | 'Conversación' | 'Comunidad' | 'Relación romántica' | 'Intereses similares'>('Amistad');
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');

  // Validation & Error states
  const [errorMsg, setErrorMsg] = useState('');
  const [infoMsg, setInfoMsg] = useState('');

  const computedAge = birthDate ? calculateAge(birthDate) : 0;
  const isAdult = isEligibleAdult(birthDate);

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMsg('Por favor completa todos los campos.');
      return;
    }
    setErrorMsg('');
    login(email, password);
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!name.trim() || !username.trim() || !email.trim() || !password) {
      setErrorMsg('Todos los campos son obligatorios.');
      return;
    }

    if (!isAdult) {
      setErrorMsg('Debes tener al menos 18 años para registrarte en Nexia.');
      return;
    }

    if (!acceptTerms) {
      setErrorMsg('Debes aceptar las Condiciones de uso y la Política de privacidad.');
      return;
    }

    // Go to email verification step
    setInfoMsg(`Hemos enviado un código de verificación seguro a ${email}. Código de muestra: 749201`);
    setMode('verify_email');
  };

  const handleVerifyEmail = (e: React.FormEvent) => {
    e.preventDefault();
    if (!verificationCode || verificationCode.trim().length < 4) {
      setErrorMsg('Introduce el código de verificación.');
      return;
    }

    // Complete registration
    register({
      name,
      username: username.replace('@', ''),
      email,
      birthDate,
      age: computedAge,
      connectionType,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
      bio: '¡Hola! Me acabo de unir a Nexia para conocer gente nueva y compartir intereses.',
    });
  };

  const handleDemoLogin = () => {
    login('alex.morales@ejemplo.com', 'demo123');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-950 via-purple-900 to-indigo-950 text-white flex flex-col justify-between p-4 sm:p-6 relative overflow-hidden">
      {/* Decorative ambient background orbs */}
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-violet-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 -right-24 w-80 h-80 bg-fuchsia-600/15 rounded-full blur-3xl pointer-events-none" />

      {/* Top Header */}
      <header className="relative z-10 flex items-center justify-between max-w-4xl mx-auto w-full pt-2">
        <NexiaLogo size="lg" textColor="text-white" />
        <button
          onClick={() => setIsSafetyOpen(true)}
          className="flex items-center gap-1.5 text-xs font-semibold text-violet-200 bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-full border border-white/10 transition-colors"
        >
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Seguridad</span>
        </button>
      </header>

      {/* Center Card */}
      <main className="relative z-10 max-w-md mx-auto w-full my-auto py-6">
        {mode === 'welcome' && (
          <div className="text-center space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/20 border border-violet-400/30 text-violet-200 text-xs font-medium">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Red Social por Nexia Technologies</span>
            </div>

            <div className="space-y-3">
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
                Nexia
              </h1>
              <p className="text-lg font-medium text-violet-200">
                «Conexiones reales, en un espacio seguro»
              </p>
              <p className="text-sm text-neutral-300 leading-relaxed max-w-sm mx-auto">
                Diseñada para conocer nuevas personas, hacer amistades auténticas, compartir pasiones como anime, videojuegos, música y cine, en una comunidad inclusiva y libre de acoso.
              </p>
            </div>

            {/* Core Benefits */}
            <div className="grid grid-cols-2 gap-2.5 text-left pt-2">
              <div className="p-3 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-xs">
                <ShieldCheck className="w-5 h-5 text-emerald-400 mb-1" />
                <h2 className="text-xs font-bold text-white">100% Espacio Seguro</h2>
                <p className="text-[11px] text-neutral-300">Cero perfiles falsos, moderación activa y reporte inmediato.</p>
              </div>
              <div className="p-3 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-xs">
                <Heart className="w-5 h-5 text-rose-400 mb-1" />
                <h2 className="text-xs font-bold text-white">Afinidad Real</h2>
                <p className="text-[11px] text-neutral-300">Conecta por tus gustos en anime, música, juegos y proyectos.</p>
              </div>
              <div className="p-3 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-xs">
                <Lock className="w-5 h-5 text-violet-400 mb-1" />
                <h2 className="text-xs font-bold text-white">Privacidad Total</h2>
                <p className="text-[11px] text-neutral-300">Tú decides tu visibilidad. Ubicación exacta jamás expuesta.</p>
              </div>
              <div className="p-3 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-xs">
                <Users className="w-5 h-5 text-sky-400 mb-1" />
                <h2 className="text-xs font-bold text-white">Comunidades Vivas</h2>
                <p className="text-[11px] text-neutral-300">Grupos temáticos y salas de conversación de texto en vivo.</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3 pt-2">
              <button
                onClick={() => {
                  setErrorMsg('');
                  setMode('register');
                }}
                className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 text-white font-bold text-sm shadow-lg shadow-purple-900/40 flex items-center justify-center gap-2 transition-all transform active:scale-98"
              >
                <span>Crear cuenta gratis</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => {
                  setErrorMsg('');
                  setMode('login');
                }}
                className="w-full py-3.5 px-6 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-semibold text-sm border border-white/15 transition-all"
              >
                Iniciar sesión
              </button>

              {/* Google Button with realistic integration notice */}
              <button
                onClick={() => {
                  setInfoMsg('Para vincular Google Workspace OAuth se requiere habilitar el proveedor en consola de autenticación. Iniciando con perfil verificado de prueba.');
                  setTimeout(handleDemoLogin, 800);
                }}
                className="w-full py-3 px-6 rounded-2xl bg-white text-neutral-800 hover:bg-neutral-100 font-medium text-xs flex items-center justify-center gap-2 transition-all shadow-xs"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.16 0 9.97 0 12s.45 3.84 1.25 5.42l4.03-3.15z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                  />
                </svg>
                <span>Continuar con Google</span>
              </button>

              {/* Demo 1-click test button */}
              <div className="pt-2">
                <button
                  onClick={handleDemoLogin}
                  className="text-xs text-violet-300 hover:text-white underline underline-offset-4 font-medium transition-colors"
                >
                  ⚡ Explorar directamente como usuario demo
                </button>
              </div>
            </div>
          </div>
        )}

        {/* LOGIN FORM */}
        {mode === 'login' && (
          <div className="bg-white/10 backdrop-blur-md p-6 rounded-3xl border border-white/15 space-y-4">
            <div className="text-center space-y-1">
              <h2 className="text-xl font-bold text-white">Iniciar sesión en Nexia</h2>
              <p className="text-xs text-violet-200">Ingresa tus credenciales para acceder</p>
            </div>

            {errorMsg && (
              <div className="p-3 bg-rose-500/20 border border-rose-500/40 rounded-xl text-rose-200 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleLoginSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-neutral-200 mb-1">
                  Correo electrónico
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="tu@correo.com"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/10 border border-white/20 text-white placeholder-neutral-400 text-sm focus:outline-hidden focus:ring-2 focus:ring-violet-400"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-medium text-neutral-200">
                    Contraseña
                  </label>
                  <button
                    type="button"
                    onClick={() => setMode('forgot_password')}
                    className="text-[11px] text-violet-300 hover:underline"
                  >
                    ¿Olvidaste tu contraseña?
                  </button>
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/10 border border-white/20 text-white placeholder-neutral-400 text-sm focus:outline-hidden focus:ring-2 focus:ring-violet-400"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-bold text-sm shadow-md transition-colors mt-2"
              >
                Entrar a Nexia
              </button>
            </form>

            <div className="text-center pt-2 space-y-2">
              <button
                type="button"
                onClick={handleDemoLogin}
                className="text-xs text-emerald-300 hover:underline font-medium block mx-auto"
              >
                O entrar con cuenta de demostración rápida
              </button>

              <button
                type="button"
                onClick={() => setMode('welcome')}
                className="text-xs text-neutral-300 hover:text-white"
              >
                ← Volver al inicio
              </button>
            </div>
          </div>
        )}

        {/* REGISTER FORM */}
        {mode === 'register' && (
          <div className="bg-white/10 backdrop-blur-md p-6 rounded-3xl border border-white/15 space-y-4">
            <div className="text-center space-y-1">
              <h2 className="text-xl font-bold text-white">Crear cuenta en Nexia</h2>
              <p className="text-xs text-violet-200">Requerido: Mayor de 18 años para un entorno seguro</p>
            </div>

            {errorMsg && (
              <div className="p-3 bg-rose-500/20 border border-rose-500/40 rounded-xl text-rose-200 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleRegisterSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-neutral-200 mb-1">
                  Nombre completo visible
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ej. Sofía Herrera"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/10 border border-white/20 text-white placeholder-neutral-400 text-sm focus:ring-2 focus:ring-violet-400 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-200 mb-1">
                  Nombre de usuario (@)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-neutral-400 text-sm">@</span>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value.replace(/[^a-zA-Z0-9_]/g, '').toLowerCase())}
                    placeholder="sofia_h"
                    className="w-full pl-8 pr-3 py-2.5 rounded-xl bg-white/10 border border-white/20 text-white placeholder-neutral-400 text-sm focus:ring-2 focus:ring-violet-400 focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-200 mb-1">
                  Correo electrónico
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="tu@correo.com"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/10 border border-white/20 text-white placeholder-neutral-400 text-sm focus:ring-2 focus:ring-violet-400 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-200 mb-1">
                  Contraseña
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Al menos 6 caracteres"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/10 border border-white/20 text-white placeholder-neutral-400 text-sm focus:ring-2 focus:ring-violet-400 focus:outline-hidden"
                />
              </div>

              {/* Age & Birthdate (>= 18 check) */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-medium text-neutral-200 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Fecha de nacimiento</span>
                  </label>
                  <span className={`text-[11px] font-semibold ${isAdult ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {computedAge} años ({isAdult ? 'Apto (+18)' : 'Mínimo 18 años'})
                  </span>
                </div>
                <input
                  type="date"
                  value={birthDate}
                  onChange={(e) => setBirthDate(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-white/10 border border-white/20 text-white text-sm focus:ring-2 focus:ring-violet-400 focus:outline-hidden"
                />
              </div>

              {/* Connection Type */}
              <div>
                <label className="block text-xs font-medium text-neutral-200 mb-1">
                  ¿Qué tipo de conexión buscas principalmente?
                </label>
                <select
                  value={connectionType}
                  onChange={(e) => setConnectionType(e.target.value as any)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-900 border border-white/20 text-white text-sm focus:ring-2 focus:ring-violet-400 focus:outline-hidden"
                >
                  <option value="Amistad">Amistad</option>
                  <option value="Conversación">Conversación</option>
                  <option value="Comunidad">Comunidad</option>
                  <option value="Relación romántica">Relación romántica</option>
                  <option value="Intereses similares">Conocer personas con intereses similares</option>
                </select>
              </div>

              {/* Terms Checkbox */}
              <div className="pt-2">
                <label className="flex items-start gap-2.5 cursor-pointer text-xs text-neutral-300">
                  <input
                    type="checkbox"
                    checked={acceptTerms}
                    onChange={(e) => setAcceptTerms(e.target.checked)}
                    className="mt-0.5 rounded border-neutral-400 text-violet-600 focus:ring-violet-400 w-4 h-4"
                  />
                  <span>
                    Confirmo que tengo más de 18 años y acepto obligatoriamente las{' '}
                    <button
                      type="button"
                      onClick={() => setIsSafetyOpen(true)}
                      className="text-violet-300 underline font-medium"
                    >
                      Condiciones de uso
                    </button>{' '}
                    y la{' '}
                    <button
                      type="button"
                      onClick={() => setIsSafetyOpen(true)}
                      className="text-violet-300 underline font-medium"
                    >
                      Política de privacidad
                    </button>
                    .
                  </span>
                </label>
              </div>

              <button
                type="submit"
                disabled={!isAdult || !acceptTerms}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-sm shadow-md transition-all mt-3"
              >
                Continuar al registro
              </button>
            </form>

            <div className="text-center pt-1">
              <button
                type="button"
                onClick={() => setMode('welcome')}
                className="text-xs text-neutral-300 hover:text-white"
              >
                ← Volver al inicio
              </button>
            </div>
          </div>
        )}

        {/* EMAIL VERIFICATION STEP */}
        {mode === 'verify_email' && (
          <div className="bg-white/10 backdrop-blur-md p-6 rounded-3xl border border-white/15 space-y-4">
            <div className="text-center space-y-1">
              <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
              <h2 className="text-xl font-bold text-white">Verifica tu correo</h2>
              <p className="text-xs text-violet-200">
                Paso de seguridad obligatorio para evitar cuentas falsas y spam.
              </p>
            </div>

            {infoMsg && (
              <div className="p-3 bg-violet-600/30 border border-violet-400/40 rounded-xl text-violet-100 text-xs">
                {infoMsg}
              </div>
            )}

            {errorMsg && (
              <div className="p-3 bg-rose-500/20 border border-rose-500/40 rounded-xl text-rose-200 text-xs">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleVerifyEmail} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-neutral-200 mb-1 text-center">
                  Código de 6 dígitos
                </label>
                <input
                  type="text"
                  maxLength={6}
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                  placeholder="749201"
                  className="w-full py-3 text-center tracking-widest text-2xl font-mono rounded-xl bg-white/10 border border-white/20 text-white placeholder-neutral-500 focus:ring-2 focus:ring-violet-400 focus:outline-hidden"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md transition-colors"
              >
                Verificar y Entrar a Nexia
              </button>
            </form>

            <div className="text-center pt-2">
              <button
                type="button"
                onClick={() => setMode('register')}
                className="text-xs text-neutral-300 hover:text-white"
              >
                ← Volver a editar datos
              </button>
            </div>
          </div>
        )}

        {/* FORGOT PASSWORD */}
        {mode === 'forgot_password' && (
          <div className="bg-white/10 backdrop-blur-md p-6 rounded-3xl border border-white/15 space-y-4">
            <div className="text-center space-y-1">
              <h2 className="text-xl font-bold text-white">Recuperar contraseña</h2>
              <p className="text-xs text-violet-200">
                Te enviaremos un enlace seguro para restablecerla.
              </p>
            </div>

            {infoMsg ? (
              <div className="p-3 bg-emerald-500/20 border border-emerald-500/40 rounded-xl text-emerald-200 text-xs text-center">
                {infoMsg}
              </div>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setInfoMsg('Hemos enviado un enlace de recuperación a tu correo electrónico.');
                }}
                className="space-y-3"
              >
                <div>
                  <label className="block text-xs font-medium text-neutral-200 mb-1">
                    Correo electrónico registrado
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="tu@correo.com"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/10 border border-white/20 text-white text-sm focus:ring-2 focus:ring-violet-400 focus:outline-hidden"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-bold text-sm shadow-md transition-colors"
                >
                  Enviar enlace de recuperación
                </button>
              </form>
            )}

            <div className="text-center pt-2">
              <button
                type="button"
                onClick={() => {
                  setInfoMsg('');
                  setMode('login');
                }}
                className="text-xs text-neutral-300 hover:text-white"
              >
                ← Volver al inicio de sesión
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Footer Legal links */}
      <footer className="relative z-10 max-w-xl mx-auto w-full text-center text-xs text-neutral-400 pt-4 pb-2">
        <div className="flex items-center justify-center gap-4 flex-wrap mb-2">
          <button
            onClick={() => setIsSafetyOpen(true)}
            className="hover:text-white transition-colors"
          >
            Condiciones de uso
          </button>
          <span>•</span>
          <button
            onClick={() => setIsSafetyOpen(true)}
            className="hover:text-white transition-colors"
          >
            Política de privacidad
          </button>
          <span>•</span>
          <button
            onClick={() => setIsSafetyOpen(true)}
            className="hover:text-white transition-colors"
          >
            Normas de la comunidad
          </button>
        </div>
        <p className="text-[11px] text-neutral-400">
          Nexia Technologies © {new Date().getFullYear()} — «Conexiones reales, en un espacio seguro». Versión 1.0 Android ready.
        </p>
      </footer>
    </div>
  );
};
