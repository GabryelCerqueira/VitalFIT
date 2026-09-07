import { useState } from 'react';
import {
  CheckIcon,
  PlusIcon,
  SparklesIcon,
  TrashIcon,
} from '../../components/icons/Icons';
import type { Extension } from '../../types/api';

type ExtensionsViewProps = {
  loading: boolean;
  extensions: Extension[];
  onInstallExtension: (extensionId: string) => Promise<void>;
  onUninstallExtension?: (extensionId: string) => Promise<void>;
};

export function ExtensionsView({
  loading,
  extensions,
  onInstallExtension,
  onUninstallExtension,
}: ExtensionsViewProps) {
  const [selectedCategory, setSelectedCategory] = useState('Todas');

  const categories = ['Todas', ...Array.from(new Set(extensions.map((e) => e.categoria)))];

  const filteredExtensions = extensions.filter(
    (ext) => selectedCategory === 'Todas' || ext.categoria === selectedCategory,
  );

  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case 'saúde':
        return 'cat-health';
      case 'nutrição':
        return 'cat-nutrition';
      case 'hábitos':
        return 'cat-habits';
      case 'treino':
        return 'cat-workout';
      default:
        return 'cat-default';
    }
  };

  return (
    <div className="view-container">
      {/* Header */}
      <header className="view-header-row">
        <div>
          <div className="date-pill">
            <SparklesIcon size={14} />
            <span>VitalFIT Marketplace</span>
          </div>
          <h1 className="view-title">Loja de Extensões</h1>
          <p className="view-subtitle">
            Turbine sua plataforma ativando módulos inteligentes de hidratação, sono, nutrição e performance.
          </p>
        </div>
      </header>

      {/* Category Pills Filter */}
      <div className="filters-bar">
        <div className="filter-pills-scroll">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              className={`filter-chip ${selectedCategory === cat ? 'active' : ''}`}
              onClick={() => setSelectedCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Extensions Grid */}
      <section className="extensions-grid">
        {filteredExtensions.map((ext) => {
          const isInstalled = Boolean(ext.instalada);
          return (
            <article key={ext.id} className={`extension-card ${isInstalled ? 'is-active' : ''}`}>
              <div className="extension-card-header">
                <span className={`category-tag ${getCategoryColor(ext.categoria)}`}>
                  {ext.categoria}
                </span>
                {isInstalled ? (
                  <span className="installed-badge">
                    <CheckIcon size={13} />
                    <span>Ativa</span>
                  </span>
                ) : (
                  <span className="available-badge">Disponível</span>
                )}
              </div>

              <div className="extension-card-body">
                <h3 className="extension-name">{ext.nome}</h3>
                <p className="extension-desc">{ext.descricao}</p>
              </div>

              <div className="extension-card-footer">
                {isInstalled ? (
                  <div className="installed-actions">
                    <button
                      type="button"
                      className="btn-uninstall"
                      onClick={() => onUninstallExtension?.(ext.id)}
                      disabled={loading}
                      title="Desinstalar extensão"
                    >
                      <TrashIcon size={15} />
                      <span>Desinstalar</span>
                    </button>
                    <span className="status-installed-text">Módulo ativo</span>
                  </div>
                ) : (
                  <button
                    type="button"
                    className="btn-install"
                    onClick={() => onInstallExtension(ext.id)}
                    disabled={loading}
                  >
                    <PlusIcon size={16} />
                    <span>Instalar Extensão</span>
                  </button>
                )}
              </div>
            </article>
          );
        })}
      </section>
    </div>
  );
}
