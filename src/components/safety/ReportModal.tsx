import React, { useState } from 'react';
import { useApp } from '../../context/AppContext.tsx';
import { X, Flag, AlertTriangle, CheckCircle2 } from 'lucide-react';
import type { ReportItem } from '../../types/index.ts';

export const ReportModal: React.FC = () => {
  const { reportingTarget, setReportingTarget, submitReport } = useApp();

  const [reason, setReason] = useState<ReportItem['reason']>('Acoso o intimidación');
  const [details, setDetails] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!reportingTarget) return null;

  const reasons: Array<ReportItem['reason']> = [
    'Acoso o intimidación',
    'Contenido inapropiado o explícito',
    'Spam o estafa',
    'Suplantación de identidad',
    'Amenazas o incitación al odio',
    'Otro',
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitReport(reason, details.trim());
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setDetails('');
      setReportingTarget(null);
    }, 1800);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl border border-violet-100 flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="p-4 border-b border-neutral-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-rose-100 text-rose-700 rounded-xl">
              <Flag className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-bold text-neutral-900 text-sm">Denunciar contenido</h2>
              <p className="text-[11px] text-neutral-500">
                Tu reporte será revisado por el equipo de moderación
              </p>
            </div>
          </div>
          <button
            onClick={() => setReportingTarget(null)}
            aria-label="Cerrar denuncia"
            className="p-1.5 text-neutral-400 hover:text-neutral-700 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 overflow-y-auto flex-1 space-y-4 text-xs">
          {submitted ? (
            <div className="py-8 text-center space-y-2">
              <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
              <h3 className="font-bold text-sm text-neutral-900">Gracias por tu reporte</h3>
              <p className="text-xs text-neutral-500 max-w-xs mx-auto">
                Hemos recibido tu denuncia. Nuestro equipo administrativo revisará el elemento y tomará las acciones necesarias para mantener a salvo la comunidad de Nexia.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Target info preview */}
              <div className="p-3 bg-neutral-50 rounded-2xl border border-neutral-200">
                <span className="text-[10px] uppercase font-bold text-neutral-400 block mb-0.5">
                  Elemento a denunciar ({reportingTarget.type})
                </span>
                <p className="font-bold text-neutral-800">{reportingTarget.authorName}</p>
                <p className="text-[11px] text-neutral-600 truncate mt-0.5">
                  "{reportingTarget.preview}"
                </p>
              </div>

              {/* Reasons */}
              <div>
                <label className="block font-bold text-neutral-700 mb-1.5">
                  Motivo de la denuncia:
                </label>
                <div className="space-y-1.5">
                  {reasons.map((r) => (
                    <label
                      key={r}
                      className={`flex items-center gap-2.5 p-2.5 rounded-xl border cursor-pointer transition-colors ${
                        reason === r
                          ? 'border-violet-500 bg-violet-50 text-violet-950 font-semibold'
                          : 'border-neutral-200 hover:bg-neutral-50 text-neutral-700'
                      }`}
                    >
                      <input
                        type="radio"
                        name="reportReason"
                        checked={reason === r}
                        onChange={() => setReason(r)}
                        className="text-violet-600 focus:ring-violet-400"
                      />
                      <span>{r}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Details text area */}
              <div>
                <label className="block font-bold text-neutral-700 mb-1">
                  Detalles adicionales (opcional):
                </label>
                <textarea
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                  placeholder="Explica qué ocurrió o proporciona contexto para el moderador..."
                  rows={3}
                  className="w-full p-2.5 rounded-xl border border-neutral-200 bg-neutral-50 text-xs focus:ring-2 focus:ring-violet-400 focus:outline-hidden resize-none"
                />
              </div>

              <div className="p-3 bg-neutral-100 rounded-xl text-[11px] text-neutral-500 flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                <span>Las denuncias falsas reiteradas pueden acarrear advertencias o sanciones a la cuenta denunciante.</span>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setReportingTarget(null)}
                  className="flex-1 py-2.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 font-semibold rounded-xl transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl shadow-xs transition-colors"
                >
                  Enviar denuncia
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
