import React, { useState } from 'react';
import { useApp } from '../../context/AppContext.tsx';
import {
  X,
  ShieldCheck,
  Lock,
  HeartHandshake,
  AlertOctagon,
  FileText,
  BadgeCheck,
} from 'lucide-react';

export const SafetyModal: React.FC = () => {
  const { isSafetyOpen, setIsSafetyOpen } = useApp();
  const [tab, setTab] = useState<'rules' | 'harassment' | 'privacy' | 'verification'>('rules');

  if (!isSafetyOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-violet-100 flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="p-4 border-b border-neutral-100 flex items-center justify-between bg-white">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-emerald-100 text-emerald-700 rounded-xl">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-bold text-neutral-900 text-sm">Centro de Seguridad y Normas</h2>
              <p className="text-[11px] text-neutral-500">Nexia Technologies — «Conexiones reales, en un espacio seguro»</p>
            </div>
          </div>
          <button
            onClick={() => setIsSafetyOpen(false)}
            aria-label="Cerrar centro de seguridad"
            className="p-1.5 text-neutral-400 hover:text-neutral-700 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-neutral-100 bg-neutral-50 p-2 gap-1 text-xs font-semibold overflow-x-auto">
          <button
            onClick={() => setTab('rules')}
            className={`px-3 py-1.5 rounded-xl transition-all whitespace-nowrap ${
              tab === 'rules' ? 'bg-white text-violet-700 shadow-xs font-bold' : 'text-neutral-600'
            }`}
          >
            Normas de la comunidad
          </button>
          <button
            onClick={() => setTab('harassment')}
            className={`px-3 py-1.5 rounded-xl transition-all whitespace-nowrap ${
              tab === 'harassment' ? 'bg-white text-violet-700 shadow-xs font-bold' : 'text-neutral-600'
            }`}
          >
            Contra el acoso
          </button>
          <button
            onClick={() => setTab('privacy')}
            className={`px-3 py-1.5 rounded-xl transition-all whitespace-nowrap ${
              tab === 'privacy' ? 'bg-white text-violet-700 shadow-xs font-bold' : 'text-neutral-600'
            }`}
          >
            Privacidad & Datos
          </button>
          <button
            onClick={() => setTab('verification')}
            className={`px-3 py-1.5 rounded-xl transition-all whitespace-nowrap ${
              tab === 'verification' ? 'bg-white text-violet-700 shadow-xs font-bold' : 'text-neutral-600'
            }`}
          >
            Verificación
          </button>
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto flex-1 space-y-4 text-xs text-neutral-700 leading-relaxed">
          {tab === 'rules' && (
            <div className="space-y-3">
              <div className="p-3 bg-violet-50 rounded-2xl border border-violet-100">
                <h3 className="font-bold text-violet-900 text-sm mb-1">
                  Nuestros Principios Fundamentales
                </h3>
                <p className="text-[11px] text-violet-800">
                  Nexia fue creada como una alternativa sana donde las personas puedan conectar a través de aficiones compartidas sin ser juzgadas ni atacadas.
                </p>
              </div>

              <div className="space-y-2.5">
                <div className="flex items-start gap-2">
                  <HeartHandshake className="w-4 h-4 text-violet-600 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-neutral-900">Respeto y cordialidad</h4>
                    <p className="text-neutral-600">Trata a los demás miembros como te gustaría ser tratado. Se aceptan discrepancias y debates, nunca descalificaciones personales ni ofensas.</p>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-neutral-900">Edad mínima obligatoria (18+)</h4>
                    <p className="text-neutral-600">Para garantizar un espacio seguro donde se establecen relaciones y amistades maduras, Nexia restringe el acceso estrictamente a personas de 18 años o más.</p>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <Lock className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-neutral-900">Cero perfiles falsos</h4>
                    <p className="text-neutral-600">No se permite la creación de perfiles falsos, cuentas bot para inflar métricas o usurpación de identidad de terceros.</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {tab === 'harassment' && (
            <div className="space-y-3">
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-2xl">
                <h3 className="font-bold text-rose-900 text-sm mb-1 flex items-center gap-1.5">
                  <AlertOctagon className="w-4 h-4 text-rose-600" />
                  <span>Tolerancia Cero al Acoso</span>
                </h3>
                <p className="text-[11px] text-rose-800">
                  En Nexia sancionamos de inmediato cualquier conducta que busque amedrentar, amenazar o discriminar a otros miembros.
                </p>
              </div>

              <ul className="list-disc pl-4 space-y-1.5 text-neutral-600">
                <li><strong className="text-neutral-900">Mensajes no deseados:</strong> Si un usuario te pide no contactarle, respeta su decisión. El envío reiterado tras el rechazo es considerado acoso.</li>
                <li><strong className="text-neutral-900">Inclusión y no discriminación:</strong> Respetamos a personas de todas las culturas, razas, nacionalidades, orientaciones sexuales e identidades de género (LGBTQ+). La transfobia, homofobia o racismo provocan la suspensión inmediata de la cuenta.</li>
                <li><strong className="text-neutral-900">Herramientas activas:</strong> Todo usuario cuenta con botones accesibles para bloquear y denunciar contenido directamente desde publicaciones, perfiles o chats.</li>
              </ul>
            </div>
          )}

          {tab === 'privacy' && (
            <div className="space-y-3">
              <div className="p-3 bg-neutral-100 rounded-2xl border border-neutral-200">
                <h3 className="font-bold text-neutral-900 text-sm mb-1 flex items-center gap-1.5">
                  <Lock className="w-4 h-4 text-violet-600" />
                  <span>Protección de tu Información Privada</span>
                </h3>
                <p className="text-[11px] text-neutral-600">
                  Tu privacidad es inviolable en Nexia Technologies.
                </p>
              </div>

              <div className="space-y-2 text-neutral-600">
                <p>
                  <strong className="text-neutral-900">Ubicación aproximada únicamente:</strong> Nexia nunca compartirá tus coordenadas GPS exactas ni tu dirección física. Solo se muestra tu país o ciudad general si tú decides configurarlo.
                </p>
                <p>
                  <strong className="text-neutral-900">Control de estado de conexión:</strong> Puedes encender o apagar tu indicador de "En línea" en cualquier momento desde tu perfil o configuración.
                </p>
                <p>
                  <strong className="text-neutral-900">Eliminación total de datos:</strong> Tienes derecho a la supresión completa de tus datos. Al eliminar tu cuenta se borran de inmediato tus publicaciones, fotos y mensajes.
                </p>
              </div>
            </div>
          )}

          {tab === 'verification' && (
            <div className="space-y-3">
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-2xl">
                <h3 className="font-bold text-amber-900 text-sm mb-1 flex items-center gap-1.5">
                  <BadgeCheck className="w-4 h-4 text-amber-600" />
                  <span>Niveles de Verificación de Perfil</span>
                </h3>
                <p className="text-[11px] text-amber-800">
                  Diferenciamos con honestidad los distintos grados de verificación:
                </p>
              </div>

              <div className="space-y-2.5">
                <div className="p-2.5 bg-neutral-50 rounded-xl border border-neutral-200">
                  <div className="flex items-center gap-1.5 font-bold text-neutral-900">
                    <span className="w-2.5 h-2.5 rounded-full bg-sky-500" />
                    <span>Correo electrónico confirmado</span>
                  </div>
                  <p className="text-[11px] text-neutral-500 mt-0.5">
                    Garantiza que la persona tiene acceso legítimo al email registrado.
                  </p>
                </div>

                <div className="p-2.5 bg-neutral-50 rounded-xl border border-neutral-200">
                  <div className="flex items-center gap-1.5 font-bold text-neutral-900">
                    <BadgeCheck className="w-4 h-4 text-amber-500" />
                    <span>Identidad Verificada Oficialmente</span>
                  </div>
                  <p className="text-[11px] text-neutral-500 mt-0.5">
                    Requiere validación biométrica y documento oficial de identidad (en colaboración con proveedores de verificación autorizados). Nexia nunca otorga esta insignia de forma automática ni engañosa.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-neutral-100 bg-neutral-50 flex justify-end">
          <button
            onClick={() => setIsSafetyOpen(false)}
            className="px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white rounded-xl text-xs font-bold transition-colors"
          >
            Entendido
          </button>
        </div>
      </div>
    </div>
  );
};
