import React, { useState } from 'react';
import { useApp } from '../../context/AppContext.tsx';
import {
  X,
  Sparkles,
  Check,
  ShieldCheck,
  Crown,
  ArrowRight,
  MessageSquare,
} from 'lucide-react';

export const NexiaPlusModal: React.FC = () => {
  const {
    isPlusModalOpen,
    setIsPlusModalOpen,
    currentUser,
    subscribeToTier,
    cancelSubscription,
    setIsPremiumPortalOpen,
  } = useApp();

  const [selectedTier, setSelectedTier] = useState<'pass_99' | 'plus_199'>('pass_99');
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [demoNotice, setDemoNotice] = useState(false);

  if (!isPlusModalOpen) return null;

  const currentTier = currentUser.subscriptionTier || (currentUser.isPlusSubscriber ? 'plus_199' : 'free');
  const isSubscribed = currentTier === 'pass_99' || currentTier === 'plus_199';

  const handleSubscribe = () => {
    if (!acceptedTerms && !isSubscribed) return;
    setDemoNotice(true);
    setTimeout(() => {
      subscribeToTier(selectedTier);
      setDemoNotice(false);
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-violet-100 flex flex-col max-h-[88vh]">
        {/* Header with vibrant brand gradient */}
        <div className="p-6 bg-gradient-to-br from-violet-700 via-purple-600 to-amber-500 text-white relative">
          <button
            onClick={() => setIsPlusModalOpen(false)}
            aria-label="Cerrar modal de suscripción"
            className="absolute top-4 right-4 p-1.5 bg-black/30 hover:bg-black/50 text-white rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 mb-2">
            <span className="p-2 bg-white/20 backdrop-blur-xs rounded-2xl">
              <Crown className="w-6 h-6 text-amber-300 fill-amber-300" />
            </span>
            <span className="text-xs uppercase font-extrabold tracking-wider bg-white/20 px-3 py-1 rounded-full">
              Suscripciones Nexia
            </span>
          </div>

          <h2 className="text-2xl font-black">Planes Premium Nexia</h2>
          <p className="text-xs text-violet-100 mt-1 max-w-sm">
            Elige entre el plan accesible de <strong className="text-amber-200">US$0.99/mes</strong> o la experiencia completa por <strong className="text-amber-200">US$1.99/mes</strong>.
          </p>

          <button
            onClick={() => {
              setIsPlusModalOpen(false);
              setIsPremiumPortalOpen(true);
            }}
            className="mt-3 inline-flex items-center gap-1.5 text-xs font-bold text-amber-200 hover:text-white bg-black/20 hover:bg-black/30 px-3 py-1.5 rounded-xl transition-colors border border-white/20"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Ver Sitio Premium & Lounge VIP</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Benefits list & transparent details */}
        <div className="p-5 overflow-y-auto flex-1 space-y-4 text-xs">
          {isSubscribed ? (
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-800 space-y-2">
              <div className="flex items-center gap-2 font-bold text-sm text-emerald-950">
                <Check className="w-5 h-5 text-emerald-600" />
                <span>
                  Tienes una suscripción activa a{' '}
                  {currentTier === 'pass_99' ? 'Nexia Pass (US$0.99/mes)' : 'Nexia Plus (US$1.99/mes)'}
                </span>
              </div>
              <p className="text-[11px] leading-relaxed">
                Tu plan se renueva automáticamente cada 30 días. Puedes cambiar de plan o cancelarlo en cualquier momento sin costo adicional.
              </p>
              <div className="flex gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => {
                    setIsPlusModalOpen(false);
                    setIsPremiumPortalOpen(true);
                  }}
                  className="px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white rounded-xl font-bold transition-colors"
                >
                  Ir al Sitio Premium
                </button>
                <button
                  type="button"
                  onClick={cancelSubscription}
                  className="px-4 py-2 bg-white border border-rose-200 text-rose-600 hover:bg-rose-50 rounded-xl font-bold transition-colors"
                >
                  Cancelar membresía
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* Plan Cards Selection */}
              <div className="grid grid-cols-2 gap-2.5">
                {/* 0.99$ Pass */}
                <div
                  onClick={() => setSelectedTier('pass_99')}
                  className={`p-3.5 rounded-2xl border-2 cursor-pointer transition-all ${
                    selectedTier === 'pass_99'
                      ? 'border-violet-600 bg-violet-50/50 shadow-xs ring-1 ring-violet-500'
                      : 'border-neutral-200 bg-white hover:border-violet-300'
                  }`}
                >
                  <span className="text-[10px] font-bold text-violet-700 bg-violet-100 px-2 py-0.5 rounded-full block w-fit mb-1">
                    0.99$ / mes
                  </span>
                  <h3 className="font-extrabold text-sm text-neutral-900">Nexia Pass</h3>
                  <p className="text-[10px] text-neutral-500 mt-0.5">El plan más accesible</p>
                  <div className="mt-2 text-[10px] text-neutral-600 space-y-1">
                    <p>✓ Sala VIP en vivo</p>
                    <p>✓ Insignia morada</p>
                    <p>✓ Hasta 5 fotos</p>
                    <p>✓ Temas de color</p>
                  </div>
                </div>

                {/* 1.99$ Plus */}
                <div
                  onClick={() => setSelectedTier('plus_199')}
                  className={`p-3.5 rounded-2xl border-2 cursor-pointer transition-all ${
                    selectedTier === 'plus_199'
                      ? 'border-amber-500 bg-amber-50/40 shadow-xs ring-1 ring-amber-400'
                      : 'border-neutral-200 bg-white hover:border-amber-300'
                  }`}
                >
                  <span className="text-[10px] font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full block w-fit mb-1">
                    1.99$ / mes
                  </span>
                  <h3 className="font-extrabold text-sm text-neutral-900">Nexia Plus</h3>
                  <p className="text-[10px] text-neutral-500 mt-0.5">Experiencia completa</p>
                  <div className="mt-2 text-[10px] text-neutral-600 space-y-1">
                    <p>✓ Todo lo de Pass</p>
                    <p>✓ Filtros ilimitados</p>
                    <p>✓ Insignia dorada</p>
                    <p>✓ Hasta 8 fotos</p>
                  </div>
                </div>
              </div>

              {/* Safety boundary note */}
              <div className="p-3 bg-neutral-100 rounded-2xl text-[11px] text-neutral-600 space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-neutral-900">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Compromiso ético de Nexia</span>
                </div>
                <p>
                  El plan gratuito de Nexia ya incluye todas las funciones de seguridad esenciales, chat y publicaciones sin costo. Ningún usuario de pago puede saltarse bloqueos ni contactar a quien no lo autorice.
                </p>
              </div>

              {/* Transparent conditions */}
              <div className="space-y-1.5 text-[11px] text-neutral-500">
                <p>• <strong>Renovación:</strong> Mensual recurrente por el precio elegido ({selectedTier === 'pass_99' ? 'US$0.99' : 'US$1.99'}).</p>
                <p>• <strong>Cancelación:</strong> En cualquier momento con 1 clic desde esta pantalla o Google Play sin penalizaciones.</p>
                <p>• <strong>Reembolso:</strong> Política de devolución de 48 horas si el servicio no cumple tus expectativas.</p>
              </div>

              {/* Agreement checkbox */}
              <label className="flex items-start gap-2 cursor-pointer pt-1">
                <input
                  type="checkbox"
                  checked={acceptedTerms}
                  onChange={(e) => setAcceptedTerms(e.target.checked)}
                  className="rounded text-violet-600 w-4 h-4 mt-0.5"
                />
                <span className="text-[11px] text-neutral-700">
                  Acepto el precio de {selectedTier === 'pass_99' ? 'US$0.99/mes' : 'US$1.99/mes'} y las condiciones de servicio.
                </span>
              </label>

              {demoNotice && (
                <div className="p-2.5 bg-violet-50 text-violet-800 rounded-xl text-center font-semibold">
                  Validando membresía con Nexia Technologies...
                </div>
              )}

              <button
                type="button"
                onClick={handleSubscribe}
                disabled={!acceptedTerms}
                className="w-full py-3 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 disabled:opacity-40 text-white font-bold rounded-2xl shadow-md transition-all text-xs"
              >
                Suscribirme por {selectedTier === 'pass_99' ? 'US$0.99 / mes' : 'US$1.99 / mes'}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
