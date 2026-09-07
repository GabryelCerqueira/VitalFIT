import { useState, useMemo } from 'react';
import type { Alimento, CategoriaAlimento, Dieta24h, Refeicao, AuthUser } from '../../types/api';
import {
  UtensilsIcon,
  AppleIcon,
  DropletIcon,
  CopyIcon,
  FireIcon,
  ActivityIcon,
  PlusIcon,
  CheckIcon,
  TrashIcon,
} from '../../components/icons/Icons';

type NutritionViewProps = {
  user: AuthUser;
  alimentos: Alimento[];
  dietas: Dieta24h[];
  loading?: boolean;
  onCloneDieta: (id: string) => Promise<void>;
  onCreateDieta: (payload: Partial<Dieta24h>) => Promise<void>;
  onDeleteDieta?: (id: string) => Promise<void>;
};

const CATEGORIAS_ALIMENTO: Array<'Todas' | CategoriaAlimento> = [
  'Todas',
  'Proteínas',
  'Carboidratos',
  'Gorduras Boas',
  'Frutas & Fibras',
  'Snacks & Suplementos',
];

const OBJETIVOS_DIETA: Array<'Todos' | Dieta24h['objetivo']> = [
  'Todos',
  'Definição / Cutting',
  'Hipertrofia',
  'Manutenção',
  'Saúde & Longevidade',
];

export function NutritionView({
  user,
  alimentos,
  dietas,
  loading = false,
  onCloneDieta,
  onCreateDieta,
  onDeleteDieta,
}: NutritionViewProps) {
  const [activeTab, setActiveTab] = useState<'dietas' | 'alimentos' | 'calculadora'>('dietas');

  // Diet filter & creation state
  const [filtroObjetivo, setFiltroObjetivo] = useState<'Todos' | Dieta24h['objetivo']>('Todos');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [savingDiet, setSavingDiet] = useState(false);
  const [cloningId, setCloningId] = useState<string | null>(null);

  // New diet form state
  const [novaDietaTitulo, setNovaDietaTitulo] = useState('');
  const [novaDietaDescricao, setNovaDietaDescricao] = useState('');
  const [novaDietaObjetivo, setNovaDietaObjetivo] = useState<Dieta24h['objetivo']>('Hipertrofia');
  const [refeicoesForm, setRefeicoesForm] = useState<Refeicao[]>([
    {
      nome: 'Café da Manhã',
      horario: '07:30',
      itens: '3 ovos mexidos, 2 fatias de pão integral e 1 banana com aveia',
      caloriasAprox: 480,
    },
    {
      nome: 'Almoço Principal',
      horario: '12:30',
      itens: '180g de peito de frango grelhado, 150g de arroz e salada de folhas à vontade',
      caloriasAprox: 620,
    },
    {
      nome: 'Pré-Treino',
      horario: '16:00',
      itens: '1 scoop de Whey Protein com 40g de aveia e morangos',
      caloriasAprox: 320,
    },
    {
      nome: 'Jantar',
      horario: '20:00',
      itens: '150g de salmão ou patinho moído, 120g de batata doce e legumes',
      caloriasAprox: 540,
    },
  ]);

  // Food filter state
  const [categoriaAlimento, setCategoriaAlimento] = useState<'Todas' | CategoriaAlimento>('Todas');
  const [buscaAlimento, setBuscaAlimento] = useState('');

  // Hydration calculator state
  const [calcPeso, setCalcPeso] = useState(user.perfil?.peso || 75);
  const [calcNivelAtividade, setCalcNivelAtividade] = useState<'moderado' | 'intenso' | 'atleta'>('intenso');

  // Filtered lists
  const dietasFiltradas = useMemo(() => {
    if (filtroObjetivo === 'Todos') return dietas;
    return dietas.filter((d) => d.objetivo === filtroObjetivo);
  }, [dietas, filtroObjetivo]);

  const alimentosFiltrados = useMemo(() => {
    return alimentos.filter((item) => {
      const matchCat = categoriaAlimento === 'Todas' || item.categoria === categoriaAlimento;
      const matchBusca =
        !buscaAlimento.trim() ||
        item.nome.toLowerCase().includes(buscaAlimento.toLowerCase()) ||
        item.beneficio.toLowerCase().includes(buscaAlimento.toLowerCase());
      return matchCat && matchBusca;
    });
  }, [alimentos, categoriaAlimento, buscaAlimento]);

  // Calculations for hydration
  const metaAguaMl = useMemo(() => {
    const mlPorKg = calcNivelAtividade === 'moderado' ? 35 : calcNivelAtividade === 'intenso' ? 42 : 50;
    return Math.round(calcPeso * mlPorKg);
  }, [calcPeso, calcNivelAtividade]);

  const copos250ml = useMemo(() => Math.round(metaAguaMl / 250), [metaAguaMl]);

  // Handler for adding a meal in the new diet form
  const handleAddRefeicao = () => {
    setRefeicoesForm([
      ...refeicoesForm,
      {
        nome: `Refeição ${refeicoesForm.length + 1}`,
        horario: '16:00',
        itens: '',
        caloriasAprox: 300,
      },
    ]);
  };

  const handleRemoveRefeicao = (index: number) => {
    if (refeicoesForm.length <= 1) return;
    setRefeicoesForm(refeicoesForm.filter((_, i) => i !== index));
  };

  const handleUpdateRefeicao = (index: number, field: keyof Refeicao, value: any) => {
    const updated = [...refeicoesForm];
    updated[index] = { ...updated[index], [field]: value };
    setRefeicoesForm(updated);
  };

  const handleSalvarDieta = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!novaDietaTitulo.trim()) return;

    const totalCal = refeicoesForm.reduce((acc, r) => acc + (Number(r.caloriasAprox) || 0), 0);
    // Approximate macros based on calories
    const totalProt = Math.round((totalCal * 0.3) / 4);
    const totalCarb = Math.round((totalCal * 0.45) / 4);
    const totalGord = Math.round((totalCal * 0.25) / 9);

    try {
      setSavingDiet(true);
      await onCreateDieta({
        titulo: novaDietaTitulo.trim(),
        descricao: novaDietaDescricao.trim() || undefined,
        objetivo: novaDietaObjetivo,
        caloriasTotais: totalCal,
        proteinasTotais: totalProt,
        carboidratosTotais: totalCarb,
        gordurasTotais: totalGord,
        refeicoes: refeicoesForm,
        publica: true,
      });
      setShowCreateModal(false);
      setNovaDietaTitulo('');
      setNovaDietaDescricao('');
    } finally {
      setSavingDiet(false);
    }
  };

  const handleClonar = async (id: string) => {
    try {
      setCloningId(id);
      await onCloneDieta(id);
    } finally {
      setCloningId(null);
    }
  };

  return (
    <div className="features-view">
      {/* Header */}
      <header className="page-header">
        <div>
          <div className="header-badge">
            <UtensilsIcon size={14} />
            <span>Alimentação Inteligente & Performance</span>
          </div>
          <h1 className="page-title">Nutrição & Dietas 24 Horas</h1>
          <p className="page-subtitle">
            Explore planos alimentares completos criados por profissionais e pela comunidade, consulte a tabela de
            alimentos recomendados e atinja sua meta diária de macros e hidratação.
          </p>
        </div>

        <button className="btn-primary" onClick={() => setShowCreateModal(true)}>
          <PlusIcon size={18} />
          <span>Criar Minha Dieta 24h</span>
        </button>
      </header>

      {/* Tabs Navigation */}
      <div className="nutrition-tabs-container">
        <div className="custom-segmented-control">
          <button
            type="button"
            className={`segment-btn ${activeTab === 'dietas' ? 'active' : ''}`}
            onClick={() => setActiveTab('dietas')}
          >
            <FireIcon size={18} />
            <span>Dietas 24 Horas ({dietas.length})</span>
          </button>
          <button
            type="button"
            className={`segment-btn ${activeTab === 'alimentos' ? 'active' : ''}`}
            onClick={() => setActiveTab('alimentos')}
          >
            <AppleIcon size={18} />
            <span>Alimentos Recomendados ({alimentos.length})</span>
          </button>
          <button
            type="button"
            className={`segment-btn ${activeTab === 'calculadora' ? 'active' : ''}`}
            onClick={() => setActiveTab('calculadora')}
          >
            <DropletIcon size={18} />
            <span>Calculadora de Água & Metas</span>
          </button>
        </div>
      </div>

      {/* TAB 1: DIETAS 24 HORAS */}
      {activeTab === 'dietas' && (
        <div className="nutrition-section">
          {/* Filter Pills */}
          <div className="filters-bar">
            <span className="filters-label">Filtrar por objetivo:</span>
            <div className="pills-scroll">
              {OBJETIVOS_DIETA.map((obj) => (
                <button
                  key={obj}
                  type="button"
                  className={`filter-pill ${filtroObjetivo === obj ? 'active' : ''}`}
                  onClick={() => setFiltroObjetivo(obj)}
                >
                  {obj}
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            <div className="loading-state">
              <div className="spinner" />
              <p>Carregando dietas da comunidade...</p>
            </div>
          ) : dietasFiltradas.length === 0 ? (
            <div className="empty-state-card glass-panel">
              <UtensilsIcon size={44} className="empty-icon" />
              <h3>Nenhuma dieta encontrada para este filtro</h3>
              <p>Seja o primeiro a compartilhar seu plano alimentar de 24 horas!</p>
              <button className="btn-primary" onClick={() => setShowCreateModal(true)}>
                <PlusIcon size={16} />
                <span>Montar Minha Dieta 24h</span>
              </button>
            </div>
          ) : (
            <div className="diets-grid">
              {dietasFiltradas.map((dieta) => {
                const isOwner = dieta.userId === user.id;
                const isAdmin = user.role === 'admin';

                return (
                  <div key={dieta.id} className="diet-card glass-panel">
                    <div className="diet-card-header">
                      <div className="diet-author-row">
                        <span className="diet-author-badge">
                          Por <strong>{dieta.autorNome}</strong>
                        </span>
                        <span className="diet-goal-badge">{dieta.objetivo}</span>
                      </div>
                      <h3 className="diet-card-title">{dieta.titulo}</h3>
                      {dieta.descricao && <p className="diet-card-desc">{dieta.descricao}</p>}
                    </div>

                    {/* Macros Ribbon */}
                    <div className="diet-macros-ribbon">
                      <div className="macro-chip">
                        <span className="macro-num">{dieta.caloriasTotais}</span>
                        <span className="macro-lbl">kcal</span>
                      </div>
                      <div className="macro-chip protein">
                        <span className="macro-num">{dieta.proteinasTotais}g</span>
                        <span className="macro-lbl">proteína</span>
                      </div>
                      {dieta.carboidratosTotais !== undefined && dieta.carboidratosTotais > 0 && (
                        <div className="macro-chip carbs">
                          <span className="macro-num">{dieta.carboidratosTotais}g</span>
                          <span className="macro-lbl">carboidrato</span>
                        </div>
                      )}
                      {dieta.gordurasTotais !== undefined && dieta.gordurasTotais > 0 && (
                        <div className="macro-chip fats">
                          <span className="macro-num">{dieta.gordurasTotais}g</span>
                          <span className="macro-lbl">gordura</span>
                        </div>
                      )}
                    </div>

                    {/* Meals Timeline */}
                    <div className="diet-meals-timeline">
                      <h4 className="meals-timeline-title">Cardápio 24 Horas ({dieta.refeicoes.length} refeições)</h4>
                      <div className="meals-list">
                        {dieta.refeicoes.map((ref, idx) => (
                          <div key={idx} className="meal-item">
                            <div className="meal-time-badge">{ref.horario}</div>
                            <div className="meal-content">
                              <div className="meal-header-row">
                                <span className="meal-name">{ref.nome}</span>
                                <span className="meal-calories">~{ref.caloriasAprox} kcal</span>
                              </div>
                              <p className="meal-items-text">{ref.itens}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Footer Actions */}
                    <div className="diet-card-footer">
                      <span className="diet-copies-count">
                        <CopyIcon size={14} />
                        <span>{dieta.copias || 0} já adotaram</span>
                      </span>

                      <div className="diet-actions">
                        {onDeleteDieta && (isOwner || isAdmin) && (
                          <button
                            type="button"
                            className="btn-danger-ghost"
                            title="Excluir Dieta"
                            onClick={() => onDeleteDieta(dieta.id)}
                          >
                            <TrashIcon size={15} />
                          </button>
                        )}
                        <button
                          type="button"
                          className="btn-primary-sm"
                          disabled={cloningId === dieta.id}
                          onClick={() => handleClonar(dieta.id)}
                        >
                          {cloningId === dieta.id ? (
                            <span>Adotando...</span>
                          ) : (
                            <>
                              <CopyIcon size={14} />
                              <span>Adotar Plano 24h</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: GUIA DE ALIMENTOS RECOMENDADOS */}
      {activeTab === 'alimentos' && (
        <div className="nutrition-section">
          {/* Controls Bar */}
          <div className="food-controls-bar glass-panel">
            <div className="search-input-wrapper">
              <input
                type="text"
                placeholder="Buscar por alimento ou benefício (ex: frango, ômega-3, potássio)..."
                value={buscaAlimento}
                onChange={(e) => setBuscaAlimento(e.target.value)}
                className="input-search"
              />
            </div>
            <div className="pills-scroll">
              {CATEGORIAS_ALIMENTO.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  className={`filter-pill ${categoriaAlimento === cat ? 'active' : ''}`}
                  onClick={() => setCategoriaAlimento(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="foods-grid">
            {alimentosFiltrados.map((alimento) => (
              <div key={alimento.id} className="food-card glass-panel">
                <div className="food-card-top">
                  <span className={`category-tag tag-${alimento.categoria.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}>
                    {alimento.categoria}
                  </span>
                  <span className="food-per-amount">Porção: 100g</span>
                </div>

                <h3 className="food-name">{alimento.nome}</h3>

                {/* Macro Mini Grid */}
                <div className="food-macros-grid">
                  <div className="food-macro-item calories">
                    <span className="macro-val">{alimento.calorias}</span>
                    <span className="macro-key">kcal</span>
                  </div>
                  <div className="food-macro-item protein">
                    <span className="macro-val">{alimento.proteinas}g</span>
                    <span className="macro-key">Proteína</span>
                  </div>
                  <div className="food-macro-item carbs">
                    <span className="macro-val">{alimento.carboidratos}g</span>
                    <span className="macro-key">Carbo</span>
                  </div>
                  <div className="food-macro-item fats">
                    <span className="macro-val">{alimento.gorduras}g</span>
                    <span className="macro-key">Gordura</span>
                  </div>
                </div>

                {/* Benefit Box */}
                <div className="food-benefit-box">
                  <span className="benefit-label">
                    <ActivityIcon size={13} />
                    <span>Benefício para o Treino</span>
                  </span>
                  <p className="benefit-desc">{alimento.beneficio}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: CALCULADORA DE HIDRATAÇÃO & METAS */}
      {activeTab === 'calculadora' && (
        <div className="nutrition-section">
          <div className="calculator-layout-grid">
            {/* Water Tracker Card */}
            <div className="calc-card glass-panel highlight-border">
              <div className="calc-card-header">
                <div className="calc-badge water">
                  <DropletIcon size={20} />
                  <span>Hidratação Diária Essencial</span>
                </div>
                <h2>Calculadora de Água</h2>
                <p>
                  A hidratação otimiza a síntese proteica, o transporte de nutrientes e previne a fadiga precoce nos treinos.
                </p>
              </div>

              <div className="calc-form">
                <div className="form-group">
                  <label className="form-label">Seu Peso Atual (kg)</label>
                  <div className="input-with-addon">
                    <input
                      type="number"
                      min={40}
                      max={220}
                      value={calcPeso}
                      onChange={(e) => setCalcPeso(Number(e.target.value) || 0)}
                      className="form-input"
                    />
                    <span className="input-addon">kg</span>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Nível de Atividade Física</label>
                  <div className="segmented-options">
                    <button
                      type="button"
                      className={`seg-opt-btn ${calcNivelAtividade === 'moderado' ? 'active' : ''}`}
                      onClick={() => setCalcNivelAtividade('moderado')}
                    >
                      Moderado (35 ml/kg)
                    </button>
                    <button
                      type="button"
                      className={`seg-opt-btn ${calcNivelAtividade === 'intenso' ? 'active' : ''}`}
                      onClick={() => setCalcNivelAtividade('intenso')}
                    >
                      Intenso (42 ml/kg)
                    </button>
                    <button
                      type="button"
                      className={`seg-opt-btn ${calcNivelAtividade === 'atleta' ? 'active' : ''}`}
                      onClick={() => setCalcNivelAtividade('atleta')}
                    >
                      Atleta (50 ml/kg)
                    </button>
                  </div>
                </div>

                <div className="calc-result-banner water-result">
                  <div className="water-metric">
                    <span className="water-label">Meta Recomendada para Hoje</span>
                    <strong className="water-value">
                      {(metaAguaMl / 1000).toFixed(2).replace('.', ',')} Litros
                    </strong>
                    <span className="water-sub">Aprox. {copos250ml} copos de 250ml ao longo do dia</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Smart Nutrition Targets Card */}
            <div className="calc-card glass-panel">
              <div className="calc-card-header">
                <div className="calc-badge nutrition">
                  <FireIcon size={20} />
                  <span>Distribuição de Macronutrientes</span>
                </div>
                <h2>Regra de Ouro dos Macros</h2>
                <p>
                  Recomendações baseadas em evidências científicas para praticantes de musculação e condicionamento.
                </p>
              </div>

              <div className="macro-guidance-list">
                <div className="guidance-item">
                  <div className="guidance-dot protein" />
                  <div>
                    <h4>Proteínas: 1.6g a 2.2g / kg</h4>
                    <p>
                      Para seu peso de <strong>{calcPeso} kg</strong>: consuma entre{' '}
                      <strong>{Math.round(calcPeso * 1.6)}g e {Math.round(calcPeso * 2.2)}g</strong> de proteína pura por dia.
                    </p>
                  </div>
                </div>

                <div className="guidance-item">
                  <div className="guidance-dot carbs" />
                  <div>
                    <h4>Carboidratos: 3g a 5g / kg</h4>
                    <p>
                      Para seu peso de <strong>{calcPeso} kg</strong>: consuma entre{' '}
                      <strong>{Math.round(calcPeso * 3)}g e {Math.round(calcPeso * 5)}g</strong> para manter glicogênio e energia máxima.
                    </p>
                  </div>
                </div>

                <div className="guidance-item">
                  <div className="guidance-dot fats" />
                  <div>
                    <h4>Gorduras Boas: 0.8g a 1.0g / kg</h4>
                    <p>
                      Para seu peso de <strong>{calcPeso} kg</strong>: consuma entre{' '}
                      <strong>{Math.round(calcPeso * 0.8)}g e {Math.round(calcPeso * 1)}g</strong> para saúde hormonal e absorção de vitaminas lipossolúveis.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CREATE DIET MODAL */}
      {showCreateModal && (
        <div className="modal-backdrop" onClick={() => setShowCreateModal(false)}>
          <div className="modal-content diet-modal glass-panel" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title-with-icon">
                <UtensilsIcon size={22} className="modal-header-icon" />
                <div>
                  <h2>Montar Novo Plano Alimentar 24 Horas</h2>
                  <p>Organize suas refeições, calorias e compartilhe com a comunidade VitalFIT.</p>
                </div>
              </div>
              <button
                type="button"
                className="modal-close-btn"
                onClick={() => setShowCreateModal(false)}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSalvarDieta} className="diet-form">
              <div className="form-row-2">
                <div className="form-group">
                  <label className="form-label">Título do Plano Alimentar *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Minha Dieta Hipertrofia 2.800 kcal"
                    value={novaDietaTitulo}
                    onChange={(e) => setNovaDietaTitulo(e.target.value)}
                    className="form-input"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Objetivo *</label>
                  <select
                    value={novaDietaObjetivo}
                    onChange={(e) => setNovaDietaObjetivo(e.target.value as any)}
                    className="form-input"
                  >
                    <option value="Hipertrofia">Hipertrofia</option>
                    <option value="Definição / Cutting">Definição / Cutting</option>
                    <option value="Manutenção">Manutenção</option>
                    <option value="Saúde & Longevidade">Saúde & Longevidade</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Descrição ou Estratégia</label>
                <textarea
                  rows={2}
                  placeholder="Ex: Foco em refeições limpas a cada 3h e carbo concentrado no pré/pós treino."
                  value={novaDietaDescricao}
                  onChange={(e) => setNovaDietaDescricao(e.target.value)}
                  className="form-input form-textarea"
                />
              </div>

              {/* Meals builder */}
              <div className="meals-builder-section">
                <div className="builder-header">
                  <h3>Refeições do Dia ({refeicoesForm.length})</h3>
                  <button type="button" className="btn-secondary-sm" onClick={handleAddRefeicao}>
                    <PlusIcon size={14} />
                    <span>Adicionar Refeição</span>
                  </button>
                </div>

                <div className="meals-builder-list">
                  {refeicoesForm.map((ref, idx) => (
                    <div key={idx} className="builder-meal-row">
                      <div className="meal-row-time">
                        <label className="sub-label">Horário</label>
                        <input
                          type="time"
                          value={ref.horario}
                          onChange={(e) => handleUpdateRefeicao(idx, 'horario', e.target.value)}
                          className="form-input time-input"
                        />
                      </div>
                      <div className="meal-row-name">
                        <label className="sub-label">Nome da Refeição</label>
                        <input
                          type="text"
                          value={ref.nome}
                          onChange={(e) => handleUpdateRefeicao(idx, 'nome', e.target.value)}
                          placeholder="Ex: Café da Manhã"
                          className="form-input"
                        />
                      </div>
                      <div className="meal-row-items">
                        <label className="sub-label">Alimentos & Quantidades</label>
                        <input
                          type="text"
                          value={ref.itens}
                          onChange={(e) => handleUpdateRefeicao(idx, 'itens', e.target.value)}
                          placeholder="Ex: 3 ovos, 2 fatias pão, 1 banana"
                          className="form-input"
                        />
                      </div>
                      <div className="meal-row-cals">
                        <label className="sub-label">Kcal</label>
                        <input
                          type="number"
                          value={ref.caloriasAprox}
                          onChange={(e) =>
                            handleUpdateRefeicao(idx, 'caloriasAprox', Number(e.target.value) || 0)
                          }
                          className="form-input cal-input"
                        />
                      </div>
                      <div className="meal-row-delete">
                        <button
                          type="button"
                          className="btn-danger-ghost"
                          disabled={refeicoesForm.length <= 1}
                          onClick={() => handleRemoveRefeicao(idx)}
                          title="Remover refeição"
                        >
                          <TrashIcon size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Total calories preview */}
              <div className="diet-preview-banner">
                <span>Total Estimado:</span>
                <strong>{refeicoesForm.reduce((a, b) => a + (Number(b.caloriasAprox) || 0), 0)} kcal</strong>
              </div>

              <div className="modal-actions">
                <button
                  type="button"
                  className="btn-ghost"
                  onClick={() => setShowCreateModal(false)}
                >
                  Cancelar
                </button>
                <button type="submit" className="btn-primary" disabled={savingDiet}>
                  {savingDiet ? (
                    <span>Salvando...</span>
                  ) : (
                    <>
                      <CheckIcon size={18} />
                      <span>Publicar Dieta 24h</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
