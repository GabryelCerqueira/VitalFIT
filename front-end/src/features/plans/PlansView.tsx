import { CheckIcon, CreditCardIcon, SparklesIcon } from '../../components/icons/Icons';
import type { SubscriptionPlan, UserPlan } from '../../types/api';

type PlansViewProps = {
  plans: SubscriptionPlan[];
  currentPlan?: UserPlan;
  loading: boolean;
  onSubscribePlan: (planId: UserPlan) => Promise<void>;
};

export function PlansView({
  plans,
  currentPlan = 'free',
  loading,
  onSubscribePlan,
}: PlansViewProps) {
  const getPlanBadge = (planId: UserPlan) => {
    switch (planId) {
      case 'elite':
        return <span className="plan-badge elite">👑 ELITE VIP</span>;
      case 'pro':
        return <span className="plan-badge pro">⚡ MAIS ESCOLHIDO</span>;
      case 'free':
      default:
        return <span className="plan-badge free">INICIAL</span>;
    }
  };

  return (
    <div className="view-container">
      {/* Header */}
      <header className="view-header-row">
        <div>
          <div className="date-pill">
            <CreditCardIcon size={14} />
            <span>Assinaturas & Benefícios</span>
          </div>
          <h1 className="view-title">Planos VitalFIT</h1>
          <p className="view-subtitle">
            Escolha o nível de poder ideal para atingir sua melhor versão física e mental. Sem contratos de fidelidade.
          </p>
        </div>
      </header>

      {/* Plans Pricing Grid */}
      <section className="plans-grid">
        {plans.map((plan) => {
          const isCurrent = currentPlan === plan.id;
          const isPro = plan.id === 'pro';
          const isElite = plan.id === 'elite';

          return (
            <article
              key={plan.id}
              className={`plan-card ${isCurrent ? 'is-current' : ''} ${isPro ? 'is-pro' : ''} ${
                isElite ? 'is-elite' : ''
              }`}
            >
              {isPro ? (
                <div className="plan-ribbon">Recomendado</div>
              ) : isElite ? (
                <div className="plan-ribbon elite-ribbon">Exclusivo</div>
              ) : null}

              <div className="plan-header">
                {getPlanBadge(plan.id)}
                <h3 className="plan-name">{plan.nome}</h3>
                <p className="plan-desc">{plan.descricao}</p>

                <div className="plan-pricing">
                  <span className="currency">R$</span>
                  <span className="amount">
                    {plan.precoMensal === 0 ? '0' : plan.precoMensal.toFixed(2).replace('.', ',')}
                  </span>
                  <span className="period">/mês</span>
                </div>
              </div>

              {/* Action Button */}
              <div className="plan-action">
                {isCurrent ? (
                  <button type="button" className="btn-plan current" disabled>
                    <CheckIcon size={16} />
                    <span>Seu Plano Atual</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    className={`btn-plan ${isElite ? 'elite-btn' : isPro ? 'pro-btn' : 'free-btn'}`}
                    disabled={loading}
                    onClick={() => onSubscribePlan(plan.id)}
                  >
                    <SparklesIcon size={16} />
                    <span>
                      {plan.precoMensal > 0 ? `Assinar ${plan.nome}` : 'Mudar para Free'}
                    </span>
                  </button>
                )}
              </div>

              {/* Features List */}
              <div className="plan-features">
                <span className="features-title">Recursos incluídos:</span>
                <ul>
                  {plan.recursos.map((feature, idx) => (
                    <li key={idx} className="feature-item">
                      <div className="feature-check">
                        <CheckIcon size={14} />
                      </div>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </article>
          );
        })}
      </section>

      {/* Guarantee & FAQ Banner */}
      <section className="plans-benefits-footer">
        <div className="benefit-item">
          <span className="benefit-icon">🛡️</span>
          <div>
            <strong>Sem fidelidade</strong>
            <p>Cancele ou altere seu plano quando quiser sem taxas ocultas.</p>
          </div>
        </div>

        <div className="benefit-item">
          <span className="benefit-icon">⚡</span>
          <div>
            <strong>Ativação Imediata</strong>
            <p>Seus novos recursos e extensões são desbloqueados na hora.</p>
          </div>
        </div>

        <div className="benefit-item">
          <span className="benefit-icon">🤝</span>
          <div>
            <strong>Comunidade Integrada</strong>
            <p>Treine junto, compartilhe treinos e evolua com outros atletas.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
