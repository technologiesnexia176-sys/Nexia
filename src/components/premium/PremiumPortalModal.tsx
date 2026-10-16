import React, { useState } from 'react';
import { useApp } from '../../context/AppContext.tsx';
import {
  X,
  Sparkles,
  Crown,
  Check,
  ShieldCheck,
  MessageSquare,
  Palette,
  Calendar,
  Zap,
  ArrowRight,
  BadgeCheck,
} from 'lucide-react';

export const PremiumPortalModal: React.FC = () => {
  const {
    isPremiumPortalOpen,
    setIsPremiumPortalOpen,
    currentUser,
    subscribeToTier,
    cancelSubscription,
    setActiveTab,
    setActiveRoomId,
    premiumTheme,
    setPremiumTheme,
  } = useApp();

  const [selectedPlan, setSelectedPlan] = useState<'pass_99' | 'plus_199'>('pass_99');
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [activatingNotice, setActivatingNotice] = useState(false);

  if (!isPremiumPortalOpen) return null;

  const currentTier = currentUser.subscriptionTier || (currentUser.isPlusSubscriber ? 'plus_199' : 'free');
  const hasActiveSub = currentTier === 'pass_99' || currentTier === 'plus_199';

  const handleSubscribe = () => {
    if (!acceptedTerms && !hasActiveSub) return;
    setActivatingNotice(true);
    setTimeout(() => {
      subscribeToTier(selectedPlan);
      setActivatingNotice(false);
    }, 1000);
  };

  const handleEnterVipRoom = () => {
    setIsPremiumPortalOpen(false);
    setActiveTab('communities');
    setActiveRoomId('room_vip_premium');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-xl w-full overflow-hidden shadow-2xl border border-violet-100 flex flex-col max-h-[90vh] animate-fade-in">
        {/* Hero Header */}
        <div className="p-6 bg-gradient-to-br from-violet-950 via-purple-900 to-indigo-900 text-white relative">
          <button
            onClick={() => setIsPremiumPortalOpen(false)}
            aria-label="Cerrar Sitio Premium"
            className="absolute top-4 right-4 p-1.5 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 mb-2">
            <span className="p-2 bg-gradient-to-tr from-amber-400 to-violet-500 rounded-2xl text-white shadow-md">
              <Crown className="w-6 h-6" />
            </span>
            <span className="text-xs uppercase font-extrabold tracking-wider bg-white/15 px-3 py-1 rounded-full border border-white/20">
              Sitio Premium Nexia
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
            Club & Espacio Premium
          </h2>
          <p className="text-xs text-violet-200 mt-1 max-w-md leading-relaxed">
            Disfruta del club exclusivo de Nexia Technologies con planes desde solo <strong className="text-amber-300">US$0.99 al mes</strong>.
          </p>

          {/* Current Status Pill */}
          <div className="mt-4 inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/20 text-xs">
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>
              Tu estado actual:{' '}
              <strong className="text-white">
                {currentTier === 'plus_199'
                  ? 'Nexia Plus (US$1.99/mes)'
                  : currentTier === 'pass_99'
                  ? 'Nexia Pass (US$0.99/mes)'
                  : 'Miembro Estándar Gratuito'}
              </strong>
            </span>
          </div>
        </div>

        {/* Body content */}
        <div className="p-5 overflow-y-auto flex-1 space-y-5 text-xs">
          {/* VIP LOUNGE ACCESS SECTION */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-violet-50 via-purple-50 to-indigo-50 border border-violet-100 flex items-center justify-between gap-3 flex-wrap">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-violet-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                <MessageSquare className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-neutral-900">Sala VIP Premium Lounge</h3>
                <p className="text-[11px] text-neutral-500">
                  Charla en vivo exclusiva para miembros suscriptores de Nexia.
                </p>
              </div>
            </div>

            {hasActiveSub ? (
              <button
                type="button"
                onClick={handleEnterVipRoom}
                className="px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white rounded-xl font-bold text-xs shadow-xs transition-colors flex items-center gap-1.5 shrink-0"
              >
                <span>Entrar a la Sala VIP</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <span className="text-[11px] font-semibold text-violet-700 bg-violet-100 px-2.5 py-1 rounded-lg">
                Desbloquéala desde $0.99/mes
              </span>
            )}
          </div>

          {/* TIER SELECTOR & PRICING PLANS */}
          <div>
            <h3 className="font-bold text-neutral-800 uppercase tracking-wider text-[11px] mb-3">
              Elige tu nivel de membresía
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {/* PLAN 1: 0.99$ PASS */}
              <div
                onClick={() => setSelectedPlan('pass_99')}
                className={`p-4 rounded-3xl border-2 transition-all cursor-pointer flex flex-col justify-between relative ${
                  selectedPlan === 'pass_99'
                    ? 'border-violet-600 bg-violet-50/50 shadow-md ring-1 ring-violet-500'
                    : 'border-neutral-200 bg-white hover:border-violet-300'
                }`}
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-extrabold uppercase tracking-wide bg-violet-100 text-violet-800 px-2.5 py-0.5 rounded-full">
                      El más accesible
                    </span>
                    {currentTier === 'pass_99' && (
                      <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                        Plan Actual
                      </span>
                    )}
                  </div>

                  <div>
                    <h4 className="text-base font-extrabold text-neutral-900">Nexia Pass</h4>
                    <div className="flex items-baseline gap-1 mt-0.5">
                      <span className="text-2xl font-black text-violet-700">US$0.99</span>
                      <span className="text-[11px] text-neutral-500">/ mes</span>
                    </div>
                  </div>

                  <ul className="space-y-1.5 pt-2 text-[11px] text-neutral-700">
                    <li className="flex items-start gap-2">
                      <Check className="w-3.5 h-3.5 text-violet-600 shrink-0 mt-0.5" />
                      <span>Acceso total a la <strong>Sala VIP Premium</strong></span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="w-3.5 h-3.5 text-violet-600 shrink-0 mt-0.5" />
                      <span>Insignia distintiva morada en tu perfil</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="w-3.5 h-3.5 text-violet-600 shrink-0 mt-0.5" />
                      <span>Hasta <strong>5 fotografías</strong> en tu perfil</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="w-3.5 h-3.5 text-violet-600 shrink-0 mt-0.5" />
                      <span>Desbloqueo de temas visuales de color</span>
                    </li>
                  </ul>
                </div>

                <div className="mt-4 pt-2 border-t border-neutral-100">
                  <span className={`w-full py-1.5 text-center text-xs font-bold rounded-xl block ${
                    selectedPlan === 'pass_99' ? 'bg-violet-600 text-white' : 'bg-neutral-100 text-neutral-700'
                  }`}>
                    {selectedPlan === 'pass_99' ? 'Seleccionado (0.99$)' : 'Elegir por 0.99$/mes'}
                  </span>
                </div>
              </div>

              {/* PLAN 2: 1.99$ PLUS */}
              <div
                onClick={() => setSelectedPlan('plus_199')}
                className={`p-4 rounded-3xl border-2 transition-all cursor-pointer flex flex-col justify-between relative ${
                  selectedPlan === 'plus_199'
                    ? 'border-amber-500 bg-amber-50/40 shadow-md ring-1 ring-amber-400'
                    : 'border-neutral-200 bg-white hover:border-amber-300'
                }`}
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-extrabold uppercase tracking-wide bg-gradient-to-r from-amber-400 to-amber-600 text-white px-2.5 py-0.5 rounded-full shadow-2xs">
                      Experiencia Completa
                    </span>
                    {currentTier === 'plus_199' && (
                      <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                        Plan Actual
                      </span>
                    )}
                  </div>

                  <div>
                    <h4 className="text-base font-extrabold text-neutral-900">Nexia Plus</h4>
                    <div className="flex items-baseline gap-1 mt-0.5">
                      <span className="text-2xl font-black text-amber-600">US$1.99</span>
                      <span className="text-[11px] text-neutral-500">/ mes</span>
                    </div>
                  </div>

                  <ul className="space-y-1.5 pt-2 text-[11px] text-neutral-700">
                    <li className="flex items-start gap-2">
                      <Check className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                      <span>Todo lo incluido en Nexia Pass (0.99$)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                      <span><strong>Filtros ilimitados</strong> en Descubrir personas</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                      <span>Insignia dorada VIP oficial</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                      <span>Hasta <strong>8 fotografías</strong> y soporte prioritario</span>
                    </li>
                  </ul>
                </div>

                <div className="mt-4 pt-2 border-t border-neutral-100">
                  <span className={`w-full py-1.5 text-center text-xs font-bold rounded-xl block ${
                    selectedPlan === 'plus_199' ? 'bg-amber-600 text-white' : 'bg-neutral-100 text-neutral-700'
                  }`}>
                    {selectedPlan === 'plus_199' ? 'Seleccionado (1.99$)' : 'Elegir por 1.99$/mes'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* VISUAL THEMES SELECTOR */}
          <div className="p-4 bg-neutral-50 rounded-2xl border border-neutral-200/80 space-y-2.5">
            <div className="flex items-center gap-2">
              <Palette className="w-4 h-4 text-violet-600" />
              <h4 className="font-bold text-neutral-900 text-xs">Temas visuales de personalización</h4>
            </div>
            <p className="text-[11px] text-neutral-500">
              Personaliza el estilo de Nexia según tus preferencias estéticas:
            </p>

            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setPremiumTheme('default')}
                className={`p-2 rounded-xl border text-center transition-all ${
                  premiumTheme === 'default'
                    ? 'border-violet-600 bg-white shadow-2xs font-bold text-violet-700'
                    : 'border-neutral-200 text-neutral-600 hover:bg-white'
                }`}
              >
                <div className="w-4 h-4 rounded-full bg-violet-600 mx-auto mb-1" />
                <span>Nexia Morado</span>
              </button>

              <button
                type="button"
                onClick={() => setPremiumTheme('amethyst')}
                className={`p-2 rounded-xl border text-center transition-all ${
                  premiumTheme === 'amethyst'
                    ? 'border-purple-600 bg-white shadow-2xs font-bold text-purple-700'
                    : 'border-neutral-200 text-neutral-600 hover:bg-white'
                }`}
              >
                <div className="w-4 h-4 rounded-full bg-fuchsia-600 mx-auto mb-1" />
                <span>Amatista</span>
              </button>

              <button
                type="button"
                onClick={() => setPremiumTheme('midnight')}
                className={`p-2 rounded-xl border text-center transition-all ${
                  premiumTheme === 'midnight'
                    ? 'border-neutral-800 bg-white shadow-2xs font-bold text-neutral-900'
                    : 'border-neutral-200 text-neutral-600 hover:bg-white'
                }`}
              >
                <div className="w-4 h-4 rounded-full bg-neutral-900 mx-auto mb-1" />
                <span>Medianoche</span>
              </button>
            </div>
          </div>

          {/* EXCLUSIVE COMMUNITY EVENTS SCHEDULE */}
          <div className="p-4 bg-neutral-50 rounded-2xl border border-neutral-200/80 space-y-2">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-violet-600" />
              <h4 className="font-bold text-neutral-900 text-xs">Eventos comunitarios de esta semana</h4>
            </div>
            <div className="space-y-1.5 text-[11px] text-neutral-600">
              <div className="p-2 bg-white rounded-xl border border-neutral-100 flex items-center justify-between">
                <span>🎮 Torneo comunitario de Mario Kart & Smash</span>
                <span className="font-bold text-violet-700">Viernes 20:00</span>
              </div>
              <div className="p-2 bg-white rounded-xl border border-neutral-100 flex items-center justify-between">
                <span>🎧 Sesión Lo-Fi & Escucha comunitaria</span>
                <span className="font-bold text-violet-700">Sábado 18:00</span>
              </div>
            </div>
          </div>

          {/* SAFETY AND TRANSPARENCY NOTICE */}
          <div className="p-3 bg-neutral-100 rounded-2xl text-[11px] text-neutral-600 space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-neutral-900">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Compromiso de seguridad transparente</span>
            </div>
            <p>
              En Nexia no vendemos privilegios de acoso: los suscriptores premium siguen sujetos a las mismas normas de respeto mutuo, no pueden contactar a usuarios que los hayan bloqueado ni saltarse preferencias de privacidad.
            </p>
          </div>

          {/* SUBSCRIPTION ACTION */}
          {hasActiveSub ? (
            <div className="space-y-2 pt-1 border-t border-neutral-100">
              <p className="text-[11px] text-emerald-700 font-semibold text-center">
                ✓ Tu suscripción a {currentTier === 'pass_99' ? 'Nexia Pass ($0.99/mes)' : 'Nexia Plus ($1.99/mes)'} está activa.
              </p>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={handleEnterVipRoom}
                  className="flex-1 py-2.5 bg-violet-600 hover:bg-violet-700 text-white font-bold rounded-xl transition-colors"
                >
                  Ir al Lounge VIP
                </button>
                <button
                  type="button"
                  onClick={cancelSubscription}
                  className="px-4 py-2.5 bg-white border border-rose-200 text-rose-600 hover:bg-rose-50 font-bold rounded-xl transition-colors"
                >
                  Cancelar membresía
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-3 pt-1 border-t border-neutral-100">
              <label className="flex items-start gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={acceptedTerms}
                  onChange={(e) => setAcceptedTerms(e.target.checked)}
                  className="rounded text-violet-600 w-4 h-4 mt-0.5"
                />
                <span className="text-[11px] text-neutral-700">
                  Acepto el cobro recurrente mensual de{' '}
                  <strong>{selectedPlan === 'pass_99' ? 'US$0.99' : 'US$1.99'}</strong> y confirmo que puedo cancelar en cualquier momento con 1 clic.
                </span>
              </label>

              {activatingNotice && (
                <div className="p-2.5 bg-violet-50 text-violet-800 rounded-xl text-center font-semibold text-xs">
                  Procesando membresía con Nexia Technologies...
                </div>
              )}

              <button
                type="button"
                onClick={handleSubscribe}
                disabled={!acceptedTerms}
                className="w-full py-3 bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 disabled:opacity-40 text-white font-bold rounded-2xl shadow-md transition-all text-xs"
              >
                Suscribirme a {selectedPlan === 'pass_99' ? 'Nexia Pass (US$0.99/mes)' : 'Nexia Plus (US$1.99/mes)'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
