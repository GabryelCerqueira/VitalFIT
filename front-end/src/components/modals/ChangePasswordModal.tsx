import { useState } from 'react';
import { KeyIcon, CheckIcon } from '../icons/Icons';

type ChangePasswordModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (senhaAtual: string, novaSenha: string) => Promise<void>;
};

export function ChangePasswordModal({ isOpen, onClose, onSubmit }: ChangePasswordModalProps) {
  const [senhaAtual, setSenhaAtual] = useState('');
  const [novaSenha, setNovaSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!senhaAtual) {
      setError('Informe sua senha atual.');
      return;
    }

    if (!novaSenha || novaSenha.length < 6) {
      setError('A nova senha deve ter no mínimo 6 caracteres.');
      return;
    }

    if (novaSenha !== confirmarSenha) {
      setError('A confirmação da nova senha não confere.');
      return;
    }

    try {
      setLoading(true);
      await onSubmit(senhaAtual, novaSenha);
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        setSenhaAtual('');
        setNovaSenha('');
        setConfirmarSenha('');
        onClose();
      }, 1500);
    } catch (err: any) {
      setError(err?.message || 'Erro ao alterar senha. Verifique sua senha atual.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content password-modal glass-panel" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title-with-icon">
            <div className="modal-icon-badge">
              <KeyIcon size={20} />
            </div>
            <div>
              <h2>Alterar Senha</h2>
              <p>Atualize sua credencial de acesso com segurança.</p>
            </div>
          </div>
          <button type="button" className="modal-close-btn" onClick={onClose}>
            ✕
          </button>
        </div>

        {success ? (
          <div className="password-success-state">
            <div className="success-icon-circle">
              <CheckIcon size={28} />
            </div>
            <h3>Senha alterada com sucesso!</h3>
            <p>Suas próximas conexões devem utilizar sua nova senha.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="password-form">
            {error && <div className="form-error-alert">{error}</div>}

            <div className="form-group">
              <label className="form-label">Senha Atual</label>
              <input
                type="password"
                required
                placeholder="Digite sua senha atual"
                value={senhaAtual}
                onChange={(e) => setSenhaAtual(e.target.value)}
                className="form-input"
                autoComplete="current-password"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Nova Senha</label>
              <input
                type="password"
                required
                placeholder="Mínimo de 6 caracteres"
                value={novaSenha}
                onChange={(e) => setNovaSenha(e.target.value)}
                className="form-input"
                autoComplete="new-password"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Confirmar Nova Senha</label>
              <input
                type="password"
                required
                placeholder="Repita a nova senha"
                value={confirmarSenha}
                onChange={(e) => setConfirmarSenha(e.target.value)}
                className="form-input"
                autoComplete="new-password"
              />
            </div>

            <div className="modal-actions">
              <button type="button" className="btn-ghost" onClick={onClose} disabled={loading}>
                Cancelar
              </button>
              <button type="submit" className="btn-primary" disabled={loading}>
                {loading ? (
                  <span>Salvando...</span>
                ) : (
                  <>
                    <KeyIcon size={16} />
                    <span>Salvar Nova Senha</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
