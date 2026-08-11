import type { Extension } from '../../types/api';

type ExtensionsViewProps = {
  loading: boolean;
  extensions: Extension[];
  onInstallExtension: (extensionId: string) => Promise<void>;
};

export function ExtensionsView({ loading, extensions, onInstallExtension }: ExtensionsViewProps) {
  return (
    <div>
      <h1>Loja de Extensões</h1>
      <div className="list">
        {extensions.map((extension) => (
          <article key={extension.id} className="card">
            <h3>{extension.nome}</h3>
            <p>{extension.descricao}</p>
            <small>{extension.categoria}</small>
            <button
              type="button"
              onClick={() => onInstallExtension(extension.id)}
              disabled={loading || extension.instalada}
            >
              {extension.instalada ? 'Instalada' : 'Instalar'}
            </button>
          </article>
        ))}
      </div>
    </div>
  );
}
