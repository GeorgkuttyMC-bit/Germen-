import React from 'react';
import { OrganSystemId, ORGAN_SYSTEMS, UILanguage } from '../data/medicalLexicon';
import { t } from '../data/bilingualTranslations';

interface AnatomicalStageProps {
  selectedSystem: OrganSystemId | 'all';
  onSelectSystem: (system: OrganSystemId | 'all') => void;
  termCountsBySystem: Record<OrganSystemId, number>;
  activeTermOrgan?: OrganSystemId;
  uiLang: UILanguage;
}

export const AnatomicalStage: React.FC<AnatomicalStageProps> = ({
  selectedSystem,
  onSelectSystem,
  termCountsBySystem,
  activeTermOrgan,
  uiLang,
}) => {
  const highlightedOrgan = activeTermOrgan || (selectedSystem !== 'all' ? selectedSystem : null);
  const activeOrganObj = ORGAN_SYSTEMS.find((o) => o.id === highlightedOrgan);

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 flex flex-col justify-between">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3.5 mb-4">
        <div>
          <h2 className="font-display text-lg font-semibold text-slate-900">
            {t(
              uiLang,
              '01. Topographischer Organ-Atlas',
              '01. Topographical Organ Atlas',
              '01. Topographical Organ Atlas · Organ-Atlas'
            )}
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            {t(
              uiLang,
              'Organsystem auf der Silhouette oder Liste auswählen · Klinische FSP-Gliederung',
              'Select an organ system on the body silhouette or list · Clinical FSP taxonomy',
              'Select organ system on silhouette or list · Klinische FSP-Gliederung'
            )}
          </p>
        </div>
        {selectedSystem !== 'all' && (
          <button
            type="button"
            onClick={() => onSelectSystem('all')}
            className="px-3 py-1.5 text-xs font-medium text-[#0284C7] hover:bg-sky-50 rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            {t(uiLang, 'Alle Systeme zeigen', 'Show All Systems', 'Show All · Alle zeigen')}
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
        {/* Interactive Anatomical SVG Stage */}
        <div className="md:col-span-5 relative bg-[#F8FAFC] border border-slate-200/80 rounded-lg p-3 flex flex-col items-center justify-center min-h-[340px]">
          <div className="w-full flex items-center justify-between text-[11px] font-mono-tabular text-slate-500 mb-1 px-1">
            <span>{t(uiLang, 'ANSICHT: VENTRAL', 'VIEW: ANTERIOR', 'ANTERIOR · VENTRAL')}</span>
            <span>
              {activeOrganObj
                ? `● ${
                    uiLang === 'en'
                      ? activeOrganObj.nameEn.split(' ')[0].toUpperCase()
                      : activeOrganObj.nameDe.split(' ')[0].toUpperCase()
                  }`
                : t(uiLang, '● GESAMTANSICHT', '● FULL BODY', '● FULL · GESAMT')}
            </span>
          </div>

          <svg
            viewBox="0 0 220 380"
            className="w-full max-w-[210px] h-auto select-none"
            role="img"
            aria-label="Interactive anatomical overview of organ systems"
          >
            <defs>
              <linearGradient id="bodySilhouette" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#E2E8F0" stopOpacity="0.65" />
                <stop offset="100%" stopColor="#CBD5E1" stopOpacity="0.35" />
              </linearGradient>
            </defs>

            <line x1="110" y1="10" x2="110" y2="370" stroke="#CBD5E1" strokeWidth="0.75" strokeDasharray="3 3" />
            <line x1="20" y1="120" x2="200" y2="120" stroke="#E2E8F0" strokeWidth="0.75" />
            <line x1="20" y1="185" x2="200" y2="185" stroke="#E2E8F0" strokeWidth="0.75" />
            <line x1="20" y1="245" x2="200" y2="245" stroke="#E2E8F0" strokeWidth="0.75" />

            <path
              d="M110,18 C124,18 134,29 134,44 C134,57 126,67 121,72 L122,82 L156,90 C168,93 175,103 177,118 L184,195 C185,203 179,208 173,207 L166,198 L158,128 L148,128 L146,205 L152,338 C152,347 144,353 136,353 C129,353 124,347 123,338 L115,235 L105,235 L97,338 C96,347 91,353 84,353 C76,353 68,347 68,338 L74,205 L72,128 L62,128 L54,198 L47,207 C41,208 35,203 36,195 L43,118 C45,103 52,93 64,90 L98,82 L99,72 C94,67 86,57 86,44 C86,29 96,18 110,18 Z"
              fill="url(#bodySilhouette)"
              stroke="#94A3B8"
              strokeWidth="1.25"
            />

            {/* 1. Head & Brain */}
            <g
              onClick={() => onSelectSystem(selectedSystem === 'head_neuro' ? 'all' : 'head_neuro')}
              className="cursor-pointer transition-opacity"
            >
              <ellipse
                cx="110"
                cy="40"
                rx="17"
                ry="19"
                fill={highlightedOrgan === 'head_neuro' ? '#0284C7' : '#94A3B8'}
                fillOpacity={highlightedOrgan === 'head_neuro' ? '0.28' : '0.2'}
                stroke={highlightedOrgan === 'head_neuro' ? '#0284C7' : '#64748B'}
                strokeWidth={highlightedOrgan === 'head_neuro' ? '2' : '1.2'}
              />
              <circle
                cx="110"
                cy="40"
                r="5"
                fill={highlightedOrgan === 'head_neuro' ? '#0284C7' : '#475569'}
              />
            </g>

            {/* 2. Thorax, Heart & Lungs */}
            <g
              onClick={() => onSelectSystem(selectedSystem === 'thorax_cardio' ? 'all' : 'thorax_cardio')}
              className="cursor-pointer"
            >
              <path
                d="M104,96 C90,96 81,108 80,128 C79,140 89,144 103,142 Z"
                fill={highlightedOrgan === 'thorax_cardio' ? '#0284C7' : '#94A3B8'}
                fillOpacity={highlightedOrgan === 'thorax_cardio' ? '0.3' : '0.22'}
                stroke={highlightedOrgan === 'thorax_cardio' ? '#0284C7' : '#64748B'}
                strokeWidth={highlightedOrgan === 'thorax_cardio' ? '1.8' : '1.1'}
              />
              <path
                d="M116,96 C130,96 139,108 140,128 C141,140 131,144 117,142 Z"
                fill={highlightedOrgan === 'thorax_cardio' ? '#0284C7' : '#94A3B8'}
                fillOpacity={highlightedOrgan === 'thorax_cardio' ? '0.3' : '0.22'}
                stroke={highlightedOrgan === 'thorax_cardio' ? '#0284C7' : '#64748B'}
                strokeWidth={highlightedOrgan === 'thorax_cardio' ? '1.8' : '1.1'}
              />
              <circle
                cx="115"
                cy="124"
                r="8"
                fill={highlightedOrgan === 'thorax_cardio' ? '#DC2626' : '#64748B'}
                fillOpacity={highlightedOrgan === 'thorax_cardio' ? '0.85' : '0.45'}
              />
            </g>

            {/* 3. Abdomen & GI */}
            <g
              onClick={() => onSelectSystem(selectedSystem === 'abdomen_gi' ? 'all' : 'abdomen_gi')}
              className="cursor-pointer"
            >
              <rect
                x="84"
                y="150"
                width="52"
                height="44"
                rx="12"
                fill={highlightedOrgan === 'abdomen_gi' ? '#059669' : '#94A3B8'}
                fillOpacity={highlightedOrgan === 'abdomen_gi' ? '0.26' : '0.2'}
                stroke={highlightedOrgan === 'abdomen_gi' ? '#059669' : '#64748B'}
                strokeWidth={highlightedOrgan === 'abdomen_gi' ? '2' : '1.1'}
              />
              <circle
                cx="110"
                cy="172"
                r="5"
                fill={highlightedOrgan === 'abdomen_gi' ? '#059669' : '#475569'}
              />
            </g>

            {/* 4. Urology & Renal */}
            <g
              onClick={() => onSelectSystem(selectedSystem === 'urology_renal' ? 'all' : 'urology_renal')}
              className="cursor-pointer"
            >
              <ellipse
                cx="95"
                cy="206"
                rx="7"
                ry="11"
                fill={highlightedOrgan === 'urology_renal' ? '#D97706' : '#94A3B8'}
                fillOpacity={highlightedOrgan === 'urology_renal' ? '0.4' : '0.25'}
                stroke={highlightedOrgan === 'urology_renal' ? '#D97706' : '#64748B'}
                strokeWidth={highlightedOrgan === 'urology_renal' ? '1.8' : '1.1'}
              />
              <ellipse
                cx="125"
                cy="206"
                rx="7"
                ry="11"
                fill={highlightedOrgan === 'urology_renal' ? '#D97706' : '#94A3B8'}
                fillOpacity={highlightedOrgan === 'urology_renal' ? '0.4' : '0.25'}
                stroke={highlightedOrgan === 'urology_renal' ? '#D97706' : '#64748B'}
                strokeWidth={highlightedOrgan === 'urology_renal' ? '1.8' : '1.1'}
              />
            </g>

            {/* 5. Musculoskeletal */}
            <g
              onClick={() => onSelectSystem(selectedSystem === 'musculoskeletal' ? 'all' : 'musculoskeletal')}
              className="cursor-pointer"
            >
              <circle
                cx="47"
                cy="192"
                r="9"
                fill={highlightedOrgan === 'musculoskeletal' ? '#0284C7' : '#94A3B8'}
                fillOpacity={highlightedOrgan === 'musculoskeletal' ? '0.35' : '0.25'}
                stroke={highlightedOrgan === 'musculoskeletal' ? '#0284C7' : '#64748B'}
                strokeWidth={highlightedOrgan === 'musculoskeletal' ? '2' : '1.2'}
              />
              <circle
                cx="88"
                cy="275"
                r="10"
                fill={highlightedOrgan === 'musculoskeletal' ? '#0284C7' : '#94A3B8'}
                fillOpacity={highlightedOrgan === 'musculoskeletal' ? '0.35' : '0.25'}
                stroke={highlightedOrgan === 'musculoskeletal' ? '#0284C7' : '#64748B'}
                strokeWidth={highlightedOrgan === 'musculoskeletal' ? '2' : '1.2'}
              />
            </g>

            {/* 6. Vascular */}
            <g
              onClick={() => onSelectSystem(selectedSystem === 'derma_vascular' ? 'all' : 'derma_vascular')}
              className="cursor-pointer"
            >
              <path
                d="M132,240 L138,325"
                stroke={highlightedOrgan === 'derma_vascular' ? '#DC2626' : '#64748B'}
                strokeWidth={highlightedOrgan === 'derma_vascular' ? '4' : '2'}
                strokeLinecap="round"
              />
              <circle
                cx="136"
                cy="295"
                r="8"
                fill={highlightedOrgan === 'derma_vascular' ? '#DC2626' : '#94A3B8'}
                fillOpacity={highlightedOrgan === 'derma_vascular' ? '0.35' : '0.25'}
                stroke={highlightedOrgan === 'derma_vascular' ? '#DC2626' : '#64748B'}
                strokeWidth="1.5"
              />
            </g>

            {/* 7. General Systemic */}
            <g
              onClick={() => onSelectSystem(selectedSystem === 'general_surgery' ? 'all' : 'general_surgery')}
              className="cursor-pointer"
            >
              <circle
                cx="56"
                cy="115"
                r="8"
                fill={highlightedOrgan === 'general_surgery' ? '#059669' : '#94A3B8'}
                fillOpacity={highlightedOrgan === 'general_surgery' ? '0.35' : '0.25'}
                stroke={highlightedOrgan === 'general_surgery' ? '#059669' : '#64748B'}
                strokeWidth="1.5"
              />
            </g>
          </svg>

          <p className="text-[11px] text-slate-500 text-center mt-2">
            {t(
              uiLang,
              'Klicken Sie auf eine Körperregion zum Filtern der Fachbegriffe',
              'Click any anatomical region to filter clinical terms',
              'Click any region to filter · Körperregion anklicken'
            )}
          </p>
        </div>

        {/* Organ System Selector List */}
        <div className="md:col-span-7 flex flex-col gap-1.5">
          <button
            type="button"
            onClick={() => onSelectSystem('all')}
            className={`w-full text-left px-3.5 py-2.5 rounded-lg border transition-colors flex items-center justify-between cursor-pointer ${
              selectedSystem === 'all'
                ? 'bg-slate-900 text-white border-slate-900'
                : 'bg-[#F8FAFC] text-slate-700 border-slate-200/80 hover:border-slate-300 hover:bg-slate-100/70'
            }`}
          >
            <div>
              <div className="text-xs font-semibold">
                {t(
                  uiLang,
                  'Alle klinischen Fachgebiete',
                  'All Clinical Specialties',
                  'All Clinical Specialties · Alle Fachgebiete'
                )}
              </div>
              <div
                className={`text-[11px] ${
                  selectedSystem === 'all' ? 'text-slate-300' : 'text-slate-500'
                }`}
              >
                {t(
                  uiLang,
                  'Gesamtverzeichnis aus 6 deutschen Standard-Lehrbüchern',
                  'Complete index from 6 standard German medical textbooks',
                  'Complete index from 6 German textbooks · 6 Lehrbücher'
                )}
              </div>
            </div>
            <span className="font-mono-tabular text-xs font-medium shrink-0 ml-2">
              {Object.values(termCountsBySystem).reduce((a, b) => a + b, 0)}{' '}
              {t(uiLang, 'Begriffe', 'Terms', 'Terms')}
            </span>
          </button>

          {ORGAN_SYSTEMS.map((system) => {
            const isSelected = selectedSystem === system.id;
            const isTermHighlighted = activeTermOrgan === system.id && !isSelected;
            const count = termCountsBySystem[system.id] || 0;

            return (
              <button
                key={system.id}
                type="button"
                onClick={() => onSelectSystem(isSelected ? 'all' : system.id)}
                className={`w-full text-left px-3.5 py-2.5 rounded-lg border transition-colors flex items-center justify-between cursor-pointer ${
                  isSelected
                    ? 'bg-[#0284C7] text-white border-[#0284C7]'
                    : isTermHighlighted
                    ? 'bg-sky-50/80 text-slate-900 border-[#0284C7]/50'
                    : 'bg-white text-slate-800 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                <div className="min-w-0 pr-2">
                  <div className="text-xs font-semibold truncate">
                    {uiLang === 'en'
                      ? `${system.nameEn} (${system.nameDe})`
                      : uiLang === 'de'
                      ? system.nameDe
                      : `${system.nameEn} · ${system.nameDe}`}
                  </div>
                  <div
                    className={`text-[11px] truncate ${
                      isSelected ? 'text-sky-100' : 'text-slate-500'
                    }`}
                  >
                    {system.nameFach}
                  </div>
                </div>
                <span
                  className={`font-mono-tabular text-xs font-medium shrink-0 ${
                    isSelected ? 'text-white' : 'text-slate-600'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
