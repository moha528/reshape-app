import React from 'react';
import { Icon } from './icons.jsx';

export function AuthScreen({ onLogin }) {
  const [mode, setMode] = React.useState('login');
  const [email, setEmail] = React.useState('a.diop@sonatel.sn');
  const [password, setPassword] = React.useState('••••••••••');
  const [loading, setLoading] = React.useState(false);
  const [emailError, setEmailError] = React.useState('');

  const submit = (e) => {
    e?.preventDefault();
    if (mode === 'forgot') { setMode('forgot-sent'); return; }
    if (!email.includes('@')) { setEmailError('Email invalide'); return; }
    setLoading(true);
    setTimeout(() => { setLoading(false); onLogin(); }, 900);
  };

  return (
    <div className="auth-screen">
      <aside className="auth-aside">
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, position: 'relative', zIndex: 1 }}>
          <div style={{ width: 44, height: 44, borderRadius: 12, background: 'rgba(255,255,255,0.16)', backdropFilter: 'blur(8px)', display: 'grid', placeItems: 'center', border: '1px solid rgba(255,255,255,0.3)' }}>
            <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 22, color: '#fff' }}>R</span>
          </div>
          <div>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 22, letterSpacing: '-0.02em' }}>Reshape</div>
            <div style={{ fontSize: 12, opacity: 0.85 }}>Plateforme SaaS de migration de données</div>
          </div>
        </div>

        <div style={{ marginTop: 'auto', position: 'relative', zIndex: 1 }}>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 38, fontWeight: 600, lineHeight: 1.1, letterSpacing: '-0.025em', margin: 0 }}>
            Remodeler, reformater,<br/>transformer vos données.
          </h1>
          <p style={{ fontSize: 15, opacity: 0.92, lineHeight: 1.6, marginTop: 18, maxWidth: 460 }}>
            Migrations inter-applicatives guidées, de PostgreSQL à Excel. Mapping assisté par IA, exécution asynchrone, suivi temps réel.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14, marginTop: 32, maxWidth: 460 }}>
            {[
              { v: '12 M+', l: 'lignes migrées' },
              { v: '99,7 %', l: 'taux de succès' },
              { v: '< 5 min', l: 'configuration' }
            ].map((s, i) => (
              <div key={i} style={{ borderTop: '1px solid rgba(255,255,255,0.25)', paddingTop: 12 }}>
                <div style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 22 }}>{s.v}</div>
                <div style={{ fontSize: 11.5, opacity: 0.85 }}>{s.l}</div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ marginTop: 32, fontSize: 11.5, opacity: 0.7, position: 'relative', zIndex: 1 }}>
          ©2026 Reshape · Hébergé en UE · RGPD · AES-256
        </div>
      </aside>

      <div className="auth-form-wrap">
        <div className="auth-form">
          {mode === 'login' && (
            <>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 26, fontWeight: 600, margin: 0, letterSpacing: '-0.02em' }}>Connexion</h2>
              <p style={{ color: 'var(--text-tertiary)', fontSize: 13.5, marginTop: 4 }}>
                Pas encore de compte ? <a onClick={() => setMode('signup')} style={{ color: 'var(--brand-indigo)', cursor: 'pointer', fontWeight: 550 }}>Créer un compte</a>
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 24 }}>
                <button className="btn btn-secondary" style={{ justifyContent: 'flex-start' }}>
                  <Icon name="google" /> Continuer avec Google
                </button>
                <button className="btn btn-secondary" style={{ justifyContent: 'flex-start' }}>
                  <Icon name="github" /> Continuer avec GitHub
                </button>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '20px 0', color: 'var(--text-quaternary)', fontSize: 11 }}>
                <div style={{ flex: 1, height: 1, background: 'var(--border)' }}></div>
                <span>OU</span>
                <div style={{ flex: 1, height: 1, background: 'var(--border)' }}></div>
              </div>

              <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div className="field">
                  <label className="field-label">Email professionnel</label>
                  <div className="input-with-icon">
                    <Icon name="mail" />
                    <input className={`input ${emailError ? 'invalid' : ''}`} type="email" value={email} onChange={(e) => { setEmail(e.target.value); setEmailError(''); }} />
                  </div>
                  {emailError && <div className="field-error"><Icon name="alertCircle" size={12} /> {emailError}</div>}
                </div>
                <div className="field">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <label className="field-label">Mot de passe</label>
                    <a onClick={() => setMode('forgot')} style={{ fontSize: 12, color: 'var(--brand-indigo)', cursor: 'pointer' }}>Oublié ?</a>
                  </div>
                  <div className="input-with-icon">
                    <Icon name="lock" />
                    <input className="input" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                  </div>
                </div>
                <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12.5, color: 'var(--text-secondary)', marginTop: 4 }}>
                  <input type="checkbox" defaultChecked style={{ accentColor: 'var(--brand-indigo)' }} />
                  Rester connecté pendant 30 jours
                </label>
                <button type="submit" className="btn btn-primary btn-lg" disabled={loading} style={{ marginTop: 6 }}>
                  {loading ? <><Icon name="refresh" /> Connexion…</> : <>Se connecter <Icon name="arrowRight" /></>}
                </button>
              </form>
            </>
          )}

          {mode === 'signup' && (
            <>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 26, fontWeight: 600, margin: 0, letterSpacing: '-0.02em' }}>Créer un compte</h2>
              <p style={{ color: 'var(--text-tertiary)', fontSize: 13.5, marginTop: 4 }}>
                250 crédits offerts pour démarrer. <a onClick={() => setMode('login')} style={{ color: 'var(--brand-indigo)', cursor: 'pointer', fontWeight: 550 }}>J'ai déjà un compte</a>
              </p>
              <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 14, marginTop: 24 }}>
                <div className="grid grid-cols-2" style={{ gap: 12 }}>
                  <div className="field"><label className="field-label">Prénom</label><input className="input" defaultValue="Aïssatou" /></div>
                  <div className="field"><label className="field-label">Nom</label><input className="input" defaultValue="Diop" /></div>
                </div>
                <div className="field"><label className="field-label">Email professionnel</label><input className="input" defaultValue="a.diop@sonatel.sn" /></div>
                <div className="field"><label className="field-label">Organisation <span style={{ fontSize: 11, color: 'var(--text-tertiary)', marginLeft: 4, fontWeight: 400 }}>(optionnel)</span></label><input className="input" defaultValue="Sonatel" /></div>
                <div className="field"><label className="field-label">Mot de passe <span className="req">*</span></label><input className="input" type="password" defaultValue="••••••••••" /><div className="field-help">Min. 12 caractères, avec majuscule, chiffre et caractère spécial.</div></div>
                <label style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: 12, color: 'var(--text-secondary)' }}>
                  <input type="checkbox" defaultChecked style={{ accentColor: 'var(--brand-indigo)', marginTop: 2 }} />
                  <span>J'accepte les <a style={{ color: 'var(--brand-indigo)' }}>conditions générales</a> et la <a style={{ color: 'var(--brand-indigo)' }}>politique de confidentialité</a> RGPD.</span>
                </label>
                <button type="submit" className="btn btn-primary btn-lg" style={{ marginTop: 6 }}>
                  Créer mon compte <Icon name="arrowRight" />
                </button>
              </form>
            </>
          )}

          {mode === 'forgot' && (
            <>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 26, fontWeight: 600, margin: 0, letterSpacing: '-0.02em' }}>Mot de passe oublié</h2>
              <p style={{ color: 'var(--text-tertiary)', fontSize: 13.5, marginTop: 4 }}>Saisissez votre email, nous vous enverrons un lien de réinitialisation.</p>
              <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 14, marginTop: 24 }}>
                <div className="field"><label className="field-label">Email</label><input className="input" defaultValue="a.diop@sonatel.sn" /></div>
                <button type="submit" className="btn btn-primary btn-lg" style={{ marginTop: 6 }}>Envoyer le lien <Icon name="send" size={14} /></button>
                <a onClick={() => setMode('login')} style={{ fontSize: 12.5, color: 'var(--brand-indigo)', textAlign: 'center', cursor: 'pointer', marginTop: 4 }}>← Retour à la connexion</a>
              </form>
            </>
          )}

          {mode === 'forgot-sent' && (
            <>
              <div style={{ width: 56, height: 56, borderRadius: 14, background: 'var(--success-bg)', color: 'var(--success)', display: 'grid', placeItems: 'center', marginBottom: 16 }}>
                <Icon name="checkCircle" size={28} />
              </div>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 24, fontWeight: 600, margin: 0 }}>Email envoyé</h2>
              <p style={{ color: 'var(--text-tertiary)', fontSize: 13.5, marginTop: 6, lineHeight: 1.6 }}>
                Si un compte existe pour <strong style={{ color: 'var(--text-primary)' }}>a.diop@sonatel.sn</strong>, un lien de réinitialisation a été envoyé. Le lien expire dans 30 minutes.
              </p>
              <button className="btn btn-secondary btn-lg" style={{ marginTop: 24, width: '100%' }} onClick={() => setMode('login')}>
                Retour à la connexion
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
