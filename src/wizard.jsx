import React from 'react';
import { Icon, fmt } from './icons.jsx';
import { MOCK } from './data.js';
import { ConnectorBadge } from './dashboard.jsx';

const WIZARD_STEPS = [
  { id: 'source', label: 'Source', icon: 'database' },
  { id: 'analyze', label: 'Analyse', icon: 'cpu' },
  { id: 'target', label: 'Cible', icon: 'package' },
  { id: 'mapping', label: 'Mapping', icon: 'swap' },
  { id: 'transform', label: 'Transformations', icon: 'wand' },
  { id: 'preview', label: 'Aperçu', icon: 'eye' },
  { id: 'confirm', label: 'Confirmation', icon: 'rocket' },
];

export function MigrationWizard({ navigate }) {
  const [step, setStep] = React.useState(0);
  const [sourceType, setSourceType] = React.useState('postgres');
  const [aiMode, setAiMode] = React.useState(true);
  const [errMode, setErrMode] = React.useState('skip');
  const [delivery, setDelivery] = React.useState({ download: true, push: true });

  const next = () => setStep(s => Math.min(s + 1, WIZARD_STEPS.length - 1));
  const prev = () => setStep(s => Math.max(s - 1, 0));

  return (
    <div className="page-enter">
      <div className="page-header">
        <div>
          <h1 className="page-title">Nouvelle migration</h1>
          <p className="page-subtitle">Configurez votre migration en 7 étapes guidées · MIG-2026-0413 (brouillon)</p>
        </div>
        <div className="page-header-actions">
          <button className="btn btn-ghost" onClick={() => navigate('dashboard')}><Icon name="x" /> Abandonner</button>
          <button className="btn btn-secondary"><Icon name="bookmark" /> Sauver brouillon</button>
        </div>
      </div>

      <div className="card" style={{ marginBottom: 16 }}>
        <div className="stepper" style={{ padding: '14px 24px', margin: 0 }}>
          {WIZARD_STEPS.map((s, i) => (
            <div key={s.id} className={`step-item ${i < step ? 'done' : ''} ${i === step ? 'current' : ''}`} onClick={() => i <= step && setStep(i)}>
              <div className="step-num">{i < step ? <Icon name="check" size={13} /> : i + 1}</div>
              <div className="step-label">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="card" style={{ marginBottom: 16 }}>
        <div className="card-body" style={{ padding: 28 }}>
          {step === 0 && <StepSource sourceType={sourceType} setSourceType={setSourceType} />}
          {step === 1 && <StepAnalyze />}
          {step === 2 && <StepTarget />}
          {step === 3 && <StepMapping aiMode={aiMode} setAiMode={setAiMode} />}
          {step === 4 && <StepTransform errMode={errMode} setErrMode={setErrMode} />}
          {step === 5 && <StepPreview />}
          {step === 6 && <StepConfirm delivery={delivery} setDelivery={setDelivery} aiMode={aiMode} navigate={navigate} />}
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <button className="btn btn-secondary" onClick={prev} disabled={step === 0}>
          <Icon name="arrowLeft" /> Précédent
        </button>
        <div style={{ fontSize: 12, color: 'var(--text-tertiary)' }}>Étape {step + 1} sur {WIZARD_STEPS.length}</div>
        {step < WIZARD_STEPS.length - 1 ? (
          <button className="btn btn-primary" onClick={next}>Suivant <Icon name="arrowRight" /></button>
        ) : (
          <button className="btn btn-primary" onClick={() => navigate('migrations/run')}>
            <Icon name="rocket" /> Lancer la migration
          </button>
        )}
      </div>
    </div>
  );
}

function StepSource({ sourceType, setSourceType }) {
  const [tab, setTab] = React.useState('db');
  return (
    <div>
      <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 600, margin: 0, letterSpacing: '-0.015em' }}>Source des données</h2>
      <p style={{ color: 'var(--text-tertiary)', fontSize: 13.5, marginTop: 4, marginBottom: 24 }}>D'où viennent les données à migrer ? Connexion directe ou import de fichier.</p>

      <div className="tabs">
        <div className={`tab ${tab === 'db' ? 'active' : ''}`} onClick={() => setTab('db')}><Icon name="database" size={14} /> Base de données</div>
        <div className={`tab ${tab === 'file' ? 'active' : ''}`} onClick={() => setTab('file')}><Icon name="upload" size={14} /> Fichier</div>
        <div className={`tab ${tab === 'saved' ? 'active' : ''}`} onClick={() => setTab('saved')}><Icon name="bookmark" size={14} /> Connexions sauvées <span className="badge">4</span></div>
      </div>

      {tab === 'db' && (
        <>
          <div className="grid grid-cols-3" style={{ gap: 12, marginBottom: 24 }}>
            {MOCK.CONNECTORS.filter(c => c.kind === 'db').map(c => (
              <div key={c.id} className={`connector-card ${sourceType === c.id ? 'selected' : ''}`} onClick={() => setSourceType(c.id)}>
                <div className="connector-icon" style={{ background: c.color }}>{c.initials}</div>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 13.5 }}>{c.name}</div>
                  <div style={{ fontSize: 11.5, color: 'var(--text-tertiary)', marginTop: 2 }}>
                    Port {c.id === 'postgres' ? '5432' : c.id === 'mysql' ? '3306' : c.id === 'mariadb' ? '3306' : c.id === 'sqlserver' ? '1433' : '27017'}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="card" style={{ background: 'var(--bg-surface-2)' }}>
            <div className="card-body">
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                <Icon name="lock" size={14} style={{ color: 'var(--success)' }} />
                <strong style={{ fontSize: 13 }}>Paramètres de connexion</strong>
                <span className="badge badge-success dot">Chiffrée AES-256</span>
              </div>
              <div className="grid grid-cols-2" style={{ gap: 14 }}>
                <div className="field"><label className="field-label">Hôte <span className="req">*</span></label><input className="input mono" defaultValue="db.legacy.sonatel.sn" /></div>
                <div className="field"><label className="field-label">Port</label><input className="input mono" defaultValue="5432" /></div>
                <div className="field"><label className="field-label">Base <span className="req">*</span></label><input className="input mono" defaultValue="crm_legacy" /></div>
                <div className="field"><label className="field-label">Schéma</label><input className="input mono" defaultValue="public" /></div>
                <div className="field"><label className="field-label">Utilisateur <span className="req">*</span></label><input className="input mono" defaultValue="reshape_reader" /></div>
                <div className="field"><label className="field-label">Mot de passe <span className="req">*</span></label><input className="input mono" type="password" defaultValue="•••••••••••••" /></div>
              </div>
              <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12.5, color: 'var(--text-secondary)', marginTop: 16 }}>
                <input type="checkbox" defaultChecked style={{ accentColor: 'var(--brand-indigo)' }} />
                Tunnel SSL/TLS obligatoire (recommandé)
              </label>
              <div style={{ display: 'flex', gap: 8, marginTop: 18 }}>
                <button className="btn btn-secondary"><Icon name="zap" /> Tester la connexion</button>
                <span className="badge badge-success" style={{ alignSelf: 'center' }}><Icon name="check" size={12} /> Connexion établie · 142ms</span>
              </div>
            </div>
          </div>
        </>
      )}

      {tab === 'file' && (
        <>
          <div className="grid grid-cols-4" style={{ gap: 12, marginBottom: 24 }}>
            {MOCK.CONNECTORS.filter(c => c.kind === 'file').map(c => (
              <div key={c.id} className={`connector-card ${sourceType === c.id ? 'selected' : ''}`} onClick={() => setSourceType(c.id)}>
                <div className="connector-icon" style={{ background: c.color }}>{c.initials}</div>
                <div style={{ fontWeight: 600, fontSize: 13.5 }}>{c.name}</div>
              </div>
            ))}
          </div>
          <div style={{ border: '2px dashed var(--border-strong)', borderRadius: 12, padding: 40, textAlign: 'center', background: 'var(--bg-surface-2)' }}>
            <div style={{ width: 48, height: 48, margin: '0 auto 12px', borderRadius: 12, background: 'var(--gradient-brand-soft)', display: 'grid', placeItems: 'center', color: 'var(--brand-indigo)' }}>
              <Icon name="upload" size={22} />
            </div>
            <div style={{ fontSize: 14, fontWeight: 600 }}>Déposez votre fichier ici</div>
            <div style={{ fontSize: 12, color: 'var(--text-tertiary)', marginTop: 4 }}>ou cliquez pour parcourir · CSV, Excel, ZIP, SQL · jusqu'à 50 GB</div>
            <button className="btn btn-secondary" style={{ marginTop: 14 }}><Icon name="upload" /> Parcourir</button>
          </div>
        </>
      )}

      {tab === 'saved' && (
        <div className="table-wrap">
          <table className="table">
            <thead><tr><th>Nom</th><th>Type</th><th>Hôte</th><th>Dernière utilisation</th><th></th></tr></thead>
            <tbody>
              {[
                { name: 'CRM Legacy Sonatel', type: 'postgres', host: 'db.legacy.sonatel.sn:5432', last: "Aujourd'hui" },
                { name: 'Billing MariaDB', type: 'mariadb', host: 'mdb-billing.internal:3306', last: 'Il y a 3 jours' },
                { name: 'Analytics Mongo', type: 'mongodb', host: 'mongo-analytics.sn:27017', last: 'Il y a 1 semaine' },
                { name: 'ERP SQL Server', type: 'sqlserver', host: '10.0.4.21:1433', last: 'Il y a 2 semaines' },
              ].map((s, i) => (
                <tr key={i} className="clickable">
                  <td style={{ fontWeight: 550 }}>{s.name}</td>
                  <td><ConnectorBadge id={s.type} /></td>
                  <td className="mono" style={{ color: 'var(--text-tertiary)' }}>{s.host}</td>
                  <td>{s.last}</td>
                  <td><button className="btn btn-secondary btn-sm">Sélectionner</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function StepAnalyze() {
  const [showFK, setShowFK] = React.useState(true);
  return (
    <div>
      <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 600, margin: 0, letterSpacing: '-0.015em' }}>Analyse du schéma</h2>
      <p style={{ color: 'var(--text-tertiary)', fontSize: 13.5, marginTop: 4, marginBottom: 20 }}>
        Schéma détecté automatiquement. Vérifiez les relations et corrigez si besoin.
      </p>

      <div className="alert alert-success" style={{ marginBottom: 20 }}>
        <Icon name="checkCircle" />
        <div className="alert-body">
          <div className="alert-title">Analyse terminée</div>
          <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>3 tables détectées · 18 colonnes · 2 clés étrangères suggérées · 328 819 lignes au total</div>
        </div>
      </div>

      <div className="grid" style={{ gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>
        <div className="card">
          <div className="card-header" style={{ paddingBottom: 12 }}>
            <div><h3 className="card-title">Tables détectées</h3><div className="card-subtitle">3 tables · cliquez pour explorer</div></div>
          </div>
          <div>
            {MOCK.SOURCE_SCHEMA.map((t, i) => (
              <div key={i} style={{ padding: '12px 20px', borderBottom: i < 2 ? '1px solid var(--border-subtle)' : 'none', display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer' }} className="hover-row">
                <div style={{ width: 32, height: 32, borderRadius: 8, background: 'var(--gradient-brand-soft)', color: 'var(--brand-indigo)', display: 'grid', placeItems: 'center' }}>
                  <Icon name="database" size={14} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: 13 }} className="mono">{t.table}</div>
                  <div style={{ fontSize: 11.5, color: 'var(--text-tertiary)' }}>{t.cols.length} colonnes · {fmt(t.rows)} lignes</div>
                </div>
                <Icon name="chevronRight" />
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <div className="card-header"><div><h3 className="card-title">Graphe des relations FK</h3><div className="card-subtitle">2 relations détectées</div></div>
            <button className="btn btn-ghost btn-sm" onClick={() => setShowFK(!showFK)}><Icon name="eye" size={12} /> {showFK ? 'Masquer' : 'Afficher'}</button>
          </div>
          {showFK && (
            <div className="card-body" style={{ background: 'var(--bg-surface-2)', padding: 20 }}>
              <svg viewBox="0 0 360 200" width="100%" style={{ display: 'block' }}>
                <defs>
                  <marker id="arr" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto">
                    <path d="M 0 0 L 10 5 L 0 10 z" fill="#6366f1"/>
                  </marker>
                </defs>
                <g>
                  <rect x="20" y="60" width="100" height="80" rx="8" fill="var(--bg-surface)" stroke="#9f67ff" strokeWidth="1.5"/>
                  <text x="70" y="78" textAnchor="middle" fontSize="11" fontWeight="600" fill="var(--text-primary)">clients_old</text>
                  <line x1="30" y1="86" x2="110" y2="86" stroke="var(--border)"/>
                  <text x="30" y="100" fontSize="9.5" fill="var(--text-secondary)" fontFamily="var(--font-mono)">🔑 id_client</text>
                  <text x="30" y="114" fontSize="9.5" fill="var(--text-secondary)" fontFamily="var(--font-mono)">nom_complet</text>
                </g>
                <g>
                  <rect x="160" y="20" width="120" height="100" rx="8" fill="var(--bg-surface)" stroke="#33dbfd" strokeWidth="1.5"/>
                  <text x="220" y="38" textAnchor="middle" fontSize="11" fontWeight="600" fill="var(--text-primary)">commandes_old</text>
                  <line x1="170" y1="46" x2="270" y2="46" stroke="var(--border)"/>
                  <text x="170" y="60" fontSize="9.5" fill="var(--text-secondary)" fontFamily="var(--font-mono)">🔑 id_cmd</text>
                  <text x="170" y="74" fontSize="9.5" fill="#6366f1" fontFamily="var(--font-mono)">↪ fk_client</text>
                </g>
                <g>
                  <rect x="160" y="140" width="120" height="50" rx="8" fill="var(--bg-surface)" stroke="#5b3df0" strokeWidth="1.5"/>
                  <text x="220" y="158" textAnchor="middle" fontSize="11" fontWeight="600" fill="var(--text-primary)">produits_old</text>
                  <line x1="170" y1="166" x2="270" y2="166" stroke="var(--border)"/>
                  <text x="170" y="180" fontSize="9.5" fill="var(--text-secondary)" fontFamily="var(--font-mono)">🔑 sku</text>
                </g>
                <path d="M 160 74 C 130 74 130 100 120 100" fill="none" stroke="#6366f1" strokeWidth="1.5" markerEnd="url(#arr)"/>
              </svg>
            </div>
          )}
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <div><h3 className="card-title mono">clients_old</h3><div className="card-subtitle">8 colonnes · 89 432 lignes</div></div>
        </div>
        <div className="table-wrap" style={{ borderRadius: 0, border: 'none' }}>
          <table className="table">
            <thead><tr><th>Colonne</th><th>Type</th><th>Contraintes</th><th>Échantillon</th><th style={{ width: 120 }}>Couverture</th></tr></thead>
            <tbody>
              {MOCK.SOURCE_SCHEMA[0].cols.map((c, i) => (
                <tr key={i}>
                  <td className="mono" style={{ fontWeight: 600 }}>{c.pk && '🔑 '}{c.name}</td>
                  <td><span className="badge badge-neutral mono">{c.type}</span></td>
                  <td>
                    {c.pk && <span className="badge badge-brand">PRIMARY</span>}
                    {!c.pk && <span style={{ fontSize: 11.5, color: 'var(--text-tertiary)' }}>NULLABLE</span>}
                  </td>
                  <td className="mono" style={{ color: 'var(--text-secondary)', fontSize: 11.5 }}>{c.sample}</td>
                  <td>
                    <div className="progress" style={{ height: 4 }}><div className="bar" style={{ width: (88 + i * 1.4) + '%' }}></div></div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function StepTarget() {
  return (
    <div>
      <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 600, margin: 0, letterSpacing: '-0.015em' }}>Définition de la cible</h2>
      <p style={{ color: 'var(--text-tertiary)', fontSize: 13.5, marginTop: 4, marginBottom: 20 }}>Où injecter les données transformées ?</p>

      <div className="grid grid-cols-3" style={{ gap: 12, marginBottom: 24 }}>
        {[
          { id: 'db', label: 'Connexion BDD cible', desc: 'Push direct dans une base existante', icon: 'database', selected: true },
          { id: 'file', label: 'Fichier exportable', desc: 'CSV, Excel ou dump SQL téléchargeable', icon: 'download' },
          { id: 'manual', label: 'Schéma manuel', desc: 'Définissez vos tables et colonnes', icon: 'edit' },
        ].map(opt => (
          <div key={opt.id} className={`connector-card ${opt.selected ? 'selected' : ''}`}>
            <div className="connector-icon" style={{ background: opt.selected ? 'var(--gradient-brand)' : 'var(--bg-surface-3)', color: opt.selected ? '#fff' : 'var(--text-secondary)' }}>
              <Icon name={opt.icon} size={16} />
            </div>
            <div>
              <div style={{ fontWeight: 600, fontSize: 13.5 }}>{opt.label}</div>
              <div style={{ fontSize: 11.5, color: 'var(--text-tertiary)', marginTop: 2 }}>{opt.desc}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="card" style={{ background: 'var(--bg-surface-2)', marginBottom: 16 }}>
        <div className="card-body">
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
            <ConnectorBadge id="postgres" /> <span style={{ color: 'var(--text-tertiary)' }}>Connexion cible Odoo ERP</span>
            <span className="badge badge-success dot" style={{ marginLeft: 'auto' }}>Schéma chargé</span>
          </div>
          <div className="grid grid-cols-2" style={{ gap: 14 }}>
            <div className="field"><label className="field-label">Hôte <span className="req">*</span></label><input className="input mono" defaultValue="erp-prod.sonatel.sn" /></div>
            <div className="field"><label className="field-label">Base <span className="req">*</span></label><input className="input mono" defaultValue="odoo_prod" /></div>
            <div className="field"><label className="field-label">Utilisateur <span className="req">*</span></label><input className="input mono" defaultValue="odoo_writer" /></div>
            <div className="field"><label className="field-label">Mot de passe <span className="req">*</span></label><input className="input mono" type="password" defaultValue="••••••••••••" /></div>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-header"><div><h3 className="card-title">Tables cibles disponibles</h3></div></div>
        <div className="table-wrap" style={{ borderRadius: 0, border: 'none' }}>
          <table className="table">
            <thead><tr><th style={{ width: 30 }}></th><th>Table cible</th><th>Colonnes</th><th>Lignes existantes</th><th>Stratégie</th></tr></thead>
            <tbody>
              {MOCK.TARGET_SCHEMA.map((t, i) => (
                <tr key={i}>
                  <td><input type="checkbox" defaultChecked style={{ accentColor: 'var(--brand-indigo)' }} /></td>
                  <td className="mono" style={{ fontWeight: 600 }}>{t.table}</td>
                  <td><span className="badge badge-neutral">{t.cols.length} colonnes</span></td>
                  <td className="num">{fmt([4280, 12450, 320][i] || 0)}</td>
                  <td>
                    <select className="select" style={{ padding: '5px 10px', fontSize: 12 }}>
                      <option>UPSERT (par clé)</option><option>INSERT</option><option>REPLACE (truncate)</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function StepMapping({ aiMode, setAiMode }) {
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
        <div>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 600, margin: 0, letterSpacing: '-0.015em' }}>Mapping des champs</h2>
          <p style={{ color: 'var(--text-tertiary)', fontSize: 13.5, marginTop: 4 }}>Correspondance source → cible · <span className="mono">clients_old</span> → <span className="mono">res_partner</span></p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="btn btn-secondary btn-sm"><Icon name="bookmark" size={12} /> Charger template</button>
          <button className="btn btn-secondary btn-sm"><Icon name="download" size={12} /> Exporter mapping</button>
        </div>
      </div>

      <div className="card" style={{ background: aiMode ? 'linear-gradient(135deg, rgba(159,103,255,0.08), rgba(51,219,253,0.06))' : 'var(--bg-surface)', borderColor: aiMode ? 'rgba(124,77,255,0.3)' : 'var(--border)', marginBottom: 16 }}>
        <div className="card-body" style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{ width: 40, height: 40, borderRadius: 10, background: 'var(--gradient-brand)', color: '#fff', display: 'grid', placeItems: 'center' }}>
            <Icon name="sparkles" size={18} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 600, fontSize: 14, display: 'flex', alignItems: 'center', gap: 8 }}>
              Mapping assisté par IA
              <span className="badge badge-brand">×1.2 crédits</span>
            </div>
            <div style={{ fontSize: 12.5, color: 'var(--text-secondary)', marginTop: 2 }}>
              {aiMode ? "L'IA a analysé vos schémas et suggéré 8 correspondances." : "Le mode manuel n'applique aucun surcoût."}
            </div>
          </div>
          <div className={`toggle ${aiMode ? 'on' : ''}`} onClick={() => setAiMode(!aiMode)}></div>
        </div>
      </div>

      {aiMode && (
        <div className="alert alert-info" style={{ marginBottom: 16 }}>
          <Icon name="info" />
          <div className="alert-body">
            <div className="alert-title" style={{ color: 'var(--info)' }}>8 correspondances suggérées · confiance moyenne 87 %</div>
          </div>
          <button className="btn btn-secondary btn-sm" style={{ marginLeft: 'auto', alignSelf: 'center' }}>Tout valider</button>
        </div>
      )}

      <div className="card">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 28px 1fr 1fr 28px', gap: 10, padding: '10px 14px', background: 'var(--bg-surface-2)', borderBottom: '1px solid var(--border)', fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-tertiary)' }}>
          <div>Source · clients_old</div><div></div><div>Cible · res_partner</div><div>Transformation</div><div></div>
        </div>
        {MOCK.MAPPING.map((m, i) => (
          <div key={i} className={`map-row confidence-${m.confidence}`}>
            <div className="map-field">
              <div className="map-field-name">{m.src.split('.')[1]}</div>
              <div className="map-field-type">{m.srcType}</div>
            </div>
            <div style={{ color: 'var(--text-quaternary)', display: 'grid', placeItems: 'center' }}><Icon name="arrowRight" size={14} /></div>
            <div className="map-field">
              <div className="map-field-name">{m.tgt.split('.')[1]}</div>
              <div className="map-field-type">{m.tgtType}</div>
            </div>
            <div>
              <span className="chip brand mono">{m.xform}</span>
              {m.confidence === 'low' && <div style={{ fontSize: 10.5, color: 'var(--danger)', marginTop: 3 }}>Confiance 42 % · à vérifier</div>}
              {m.confidence === 'mid' && <div style={{ fontSize: 10.5, color: 'var(--warning)', marginTop: 3 }}>Confiance 68 %</div>}
            </div>
            <button className="icon-btn" style={{ width: 24, height: 24 }}><Icon name="more" size={13} /></button>
          </div>
        ))}
      </div>
    </div>
  );
}

function StepTransform({ errMode, setErrMode }) {
  return (
    <div>
      <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 600, margin: 0, letterSpacing: '-0.015em' }}>Transformations & règles</h2>
      <p style={{ color: 'var(--text-tertiary)', fontSize: 13.5, marginTop: 4, marginBottom: 20 }}>Ajustez les conversions, formules custom et politiques d'erreur.</p>

      <div className="card" style={{ marginBottom: 16 }}>
        <div className="card-header"><div><h3 className="card-title">Transformations par champ</h3></div></div>
        <div>
          {[
            { field: 'date_creation → create_date', xform: 'Date dd/MM/yyyy → ISO 8601', sample: '12/03/2018 → 2018-03-12T14:32:00Z', icon: 'calendar', cat: 'Conversion type' },
            { field: 'nom_complet → name', xform: 'Trim + Title Case', sample: 'NDIAYE AMINATA → Ndiaye Aminata', icon: 'edit', cat: 'Nettoyage' },
            { field: 'flag_actif → active', xform: 'Mapping de valeurs', sample: 'O→true, N→false, NULL→false', icon: 'swap', cat: 'Conversion type' },
            { field: 'segment → category_id', xform: 'Lookup table (with fallback)', sample: 'PRO → 4, PART → 2, * → 1', icon: 'package', cat: 'Lookup' },
            { field: 'montant_ht + tva → amount_total', xform: 'Formule custom', sample: 'montant_ht * (1 + tva/100)', icon: 'flask', cat: 'Formule' },
          ].map((r, i) => (
            <div key={i} style={{ padding: '14px 20px', borderBottom: i < 4 ? '1px solid var(--border-subtle)' : 'none', display: 'grid', gridTemplateColumns: '36px 1fr 1fr 100px 28px', gap: 14, alignItems: 'center' }}>
              <div style={{ width: 36, height: 36, borderRadius: 8, background: 'var(--gradient-brand-soft)', color: 'var(--brand-indigo)', display: 'grid', placeItems: 'center' }}>
                <Icon name={r.icon} size={15} />
              </div>
              <div>
                <div className="mono" style={{ fontWeight: 600, fontSize: 12.5 }}>{r.field}</div>
                <div style={{ fontSize: 11.5, color: 'var(--text-tertiary)' }}>{r.xform}</div>
              </div>
              <div className="mono" style={{ fontSize: 11, color: 'var(--text-secondary)', background: 'var(--bg-surface-2)', padding: '6px 10px', borderRadius: 6 }}>{r.sample}</div>
              <span className="badge badge-neutral">{r.cat}</span>
              <button className="icon-btn"><Icon name="edit" size={13} /></button>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2" style={{ gap: 16 }}>
        <div className="card">
          <div className="card-header"><div><h3 className="card-title">Politique d'erreur</h3></div></div>
          <div className="card-body">
            <label style={{ display: 'flex', gap: 12, padding: 12, borderRadius: 10, border: `1.5px solid ${errMode === 'stop' ? 'var(--brand-indigo)' : 'var(--border)'}`, marginBottom: 10, cursor: 'pointer', background: errMode === 'stop' ? 'rgba(99,102,241,0.04)' : 'transparent' }}>
              <input type="radio" checked={errMode === 'stop'} onChange={() => setErrMode('stop')} style={{ marginTop: 2, accentColor: 'var(--brand-indigo)' }} />
              <div>
                <div style={{ fontWeight: 600, fontSize: 13 }}>Stopper à la première erreur</div>
                <div style={{ fontSize: 12, color: 'var(--text-tertiary)', marginTop: 2 }}>Migration annulée + rollback complet.</div>
              </div>
            </label>
            <label style={{ display: 'flex', gap: 12, padding: 12, borderRadius: 10, border: `1.5px solid ${errMode === 'skip' ? 'var(--brand-indigo)' : 'var(--border)'}`, cursor: 'pointer', background: errMode === 'skip' ? 'rgba(99,102,241,0.04)' : 'transparent' }}>
              <input type="radio" checked={errMode === 'skip'} onChange={() => setErrMode('skip')} style={{ marginTop: 2, accentColor: 'var(--brand-indigo)' }} />
              <div>
                <div style={{ fontWeight: 600, fontSize: 13 }}>Ignorer & reporter <span className="badge badge-brand" style={{ marginLeft: 6 }}>recommandé</span></div>
                <div style={{ fontSize: 12, color: 'var(--text-tertiary)', marginTop: 2 }}>Lignes en erreur exportées dans <span className="mono">errors.csv</span>.</div>
              </div>
            </label>
          </div>
        </div>
        <div className="card">
          <div className="card-header"><div><h3 className="card-title">Préservation des relations</h3></div></div>
          <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {[
              ['Réindexer les clés primaires', true],
              ['Maintenir les FK source → cible', true],
              ['Vérifier l\'intégrité avant push', true],
              ['Doublons : fusionner par email', false],
            ].map(([label, on], i) => (
              <label key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 13 }}>
                <span>{label}</span>
                <div className={`toggle ${on ? 'on' : ''}`}></div>
              </label>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function StepPreview() {
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
        <div>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 600, margin: 0, letterSpacing: '-0.015em' }}>Aperçu (dry-run)</h2>
          <p style={{ color: 'var(--text-tertiary)', fontSize: 13.5, marginTop: 4 }}>Échantillon de 25 lignes transformées.</p>
        </div>
        <span className="badge badge-success"><Icon name="check" size={11} /> Aperçu 1/3 · gratuit</span>
      </div>

      <div className="grid grid-cols-4" style={{ marginBottom: 16, gap: 12 }}>
        <div className="stat-card"><div className="stat-label"><Icon name="check" /> Lignes valides</div><div className="stat-value" style={{ fontSize: 22 }}>89 410</div><div style={{ fontSize: 11, color: 'var(--success)' }}>99,98 %</div></div>
        <div className="stat-card"><div className="stat-label"><Icon name="alertTriangle" /> Avertissements</div><div className="stat-value" style={{ fontSize: 22, color: 'var(--warning)' }}>12</div><div style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>Valeurs imputées</div></div>
        <div className="stat-card"><div className="stat-label"><Icon name="xCircle" /> Erreurs</div><div className="stat-value" style={{ fontSize: 22, color: 'var(--danger)' }}>10</div><div style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>Email invalide</div></div>
        <div className="stat-card"><div className="stat-label"><Icon name="clock" /> Durée estimée</div><div className="stat-value" style={{ fontSize: 22 }}>~28 min</div><div style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>3,2k lignes/sec</div></div>
      </div>

      <div className="card" style={{ marginBottom: 16 }}>
        <div className="card-header"><div><h3 className="card-title mono">res_partner — aperçu</h3></div></div>
        <div className="table-wrap" style={{ borderRadius: 0, border: 'none' }}>
          <table className="table">
            <thead><tr><th>id</th><th>name</th><th>phone</th><th>email</th><th>create_date</th><th>city</th><th>active</th></tr></thead>
            <tbody>
              {[
                { id: 10042, name: 'Ndiaye Aminata', phone: '+221 77 432 18 90', email: 'a.ndiaye@example.sn', date: '2018-03-12T14:32:00Z', city: 'Dakar', active: true },
                { id: 10043, name: 'Sarr Mamadou', phone: '+221 78 901 22 14', email: 'm.sarr@example.sn', date: '2018-04-22T09:11:00Z', city: 'Thiès', active: true },
                { id: 10044, name: 'Diop Ousmane', phone: '+221 76 543 21 09', email: 'o.diop@example.sn', date: '2019-01-08T16:45:00Z', city: 'Saint-Louis', active: true },
                { id: 10045, name: 'Ba Awa', phone: '+221 77 112 89 03', email: 'a.ba@example.sn', date: '2019-06-14T11:20:00Z', city: 'Kaolack', active: false },
                { id: 10046, name: 'Fall Cheikh', phone: '+221 70 332 14 87', email: '⚠ invalid_format', date: '2020-02-03T08:15:00Z', city: 'Ziguinchor', active: true, err: true },
              ].map((r, i) => (
                <tr key={i} style={{ background: r.err ? 'var(--danger-bg)' : 'transparent' }}>
                  <td className="num">{r.id}</td><td>{r.name}</td><td className="mono" style={{ fontSize: 11.5 }}>{r.phone}</td>
                  <td className="mono" style={{ fontSize: 11.5, color: r.err ? 'var(--danger)' : 'inherit' }}>{r.email}</td>
                  <td className="mono" style={{ fontSize: 11.5, color: 'var(--text-tertiary)' }}>{r.date}</td>
                  <td>{r.city}</td>
                  <td>{r.active ? <span className="badge badge-success">true</span> : <span className="badge badge-neutral">false</span>}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function StepConfirm({ delivery, setDelivery, aiMode, navigate }) {
  const baseCredits = 1842;
  const total = aiMode ? Math.round(baseCredits * 1.2) : baseCredits;
  return (
    <div>
      <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 600, margin: 0, letterSpacing: '-0.015em' }}>Confirmation & lancement</h2>
      <p style={{ color: 'var(--text-tertiary)', fontSize: 13.5, marginTop: 4, marginBottom: 24 }}>Récapitulatif final, livraison et estimation des crédits.</p>

      <div className="grid" style={{ gridTemplateColumns: '1fr 320px', gap: 20 }}>
        <div className="col gap-4">
          <div className="card">
            <div className="card-header"><div><h3 className="card-title">Récapitulatif</h3></div></div>
            <div style={{ padding: '4px 20px 16px' }}>
              {[
                { l: 'Source', v: <><ConnectorBadge id="postgres" /> <span className="mono" style={{ marginLeft: 6, fontSize: 11.5 }}>db.legacy.sonatel.sn / crm_legacy</span></> },
                { l: 'Cible', v: <><ConnectorBadge id="postgres" /> <span className="mono" style={{ marginLeft: 6, fontSize: 11.5 }}>erp-prod.sonatel.sn / odoo_prod</span></> },
                { l: 'Tables', v: '3 tables · clients_old, commandes_old, produits_old' },
                { l: 'Lignes à migrer', v: <><strong>328 819 lignes</strong> · 18 colonnes mappées</> },
                { l: 'Mode mapping', v: aiMode ? <span className="badge badge-brand"><Icon name="sparkles" size={11} /> IA assistée</span> : <span className="badge badge-neutral">Manuel</span> },
                { l: "Politique d'erreur", v: 'Ignorer & reporter dans errors.csv' },
                { l: 'Volume estimé', v: '142 MB · durée ~28 min' },
              ].map((r, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: i < 6 ? '1px solid var(--border-subtle)' : 'none', fontSize: 13 }}>
                  <span style={{ color: 'var(--text-tertiary)' }}>{r.l}</span>
                  <span style={{ textAlign: 'right' }}>{r.v}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="card">
            <div className="card-header"><div><h3 className="card-title">Mode de livraison</h3></div></div>
            <div style={{ padding: '8px 20px 20px' }}>
              {[
                { key: 'push', icon: 'database', label: 'Push direct dans la base cible', desc: <span>Injection dans <span className="mono">odoo_prod</span>.</span> },
                { key: 'download', icon: 'download', label: 'Fichier(s) téléchargeable(s)', desc: 'Export de contrôle · conservé 30 jours.' },
              ].map((opt, i) => (
                <label key={opt.key} style={{ display: 'flex', gap: 12, padding: 14, borderRadius: 10, border: `1.5px solid ${delivery[opt.key] ? 'var(--brand-indigo)' : 'var(--border)'}`, marginBottom: i === 0 ? 10 : 0, cursor: 'pointer', background: delivery[opt.key] ? 'rgba(99,102,241,0.04)' : 'transparent' }}>
                  <input type="checkbox" checked={delivery[opt.key]} onChange={(e) => setDelivery({ ...delivery, [opt.key]: e.target.checked })} style={{ marginTop: 2, accentColor: 'var(--brand-indigo)' }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, fontSize: 13.5, display: 'flex', alignItems: 'center', gap: 8 }}>
                      <Icon name={opt.icon} size={14} /> {opt.label}
                    </div>
                    <div style={{ fontSize: 12, color: 'var(--text-tertiary)', marginTop: 4 }}>{opt.desc}</div>
                  </div>
                </label>
              ))}
            </div>
          </div>
        </div>

        <div className="card" style={{ height: 'fit-content', position: 'sticky', top: 80, background: 'linear-gradient(135deg, rgba(159,103,255,0.06), rgba(51,219,253,0.04))', borderColor: 'rgba(124,77,255,0.3)' }}>
          <div className="card-header"><div><h3 className="card-title">Estimation</h3><div className="card-subtitle">Coût en crédits</div></div><Icon name="coins" /></div>
          <div className="card-body">
            {[
              ['Lignes (328 819 × 0,005)', 1644],
              ['Volume (142 MB × 1,2)', 170],
              ['Complexité transfo (×1,1)', 28],
            ].map(([l, v], i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, padding: '6px 0' }}>
                <span style={{ color: 'var(--text-tertiary)' }}>{l}</span><span className="num">{v}</span>
              </div>
            ))}
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, padding: '6px 0', borderTop: '1px solid var(--border-subtle)', marginTop: 6 }}>
              <span style={{ color: 'var(--text-tertiary)' }}>Sous-total</span><span className="num">{fmt(baseCredits)}</span>
            </div>
            {aiMode && <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, padding: '6px 0', color: 'var(--brand-indigo)' }}><span>Multiplicateur IA (×1,2)</span><span className="num">+{fmt(total - baseCredits)}</span></div>}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', padding: '14px 0 6px', borderTop: '1.5px solid var(--border)', marginTop: 8 }}>
              <span style={{ fontWeight: 600, fontSize: 14 }}>Total estimé</span>
              <span style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 600, letterSpacing: '-0.02em' }}>{fmt(total)}</span>
            </div>
            <div style={{ fontSize: 11.5, color: 'var(--text-tertiary)', marginBottom: 12 }}>
              Solde après migration : <strong style={{ color: 'var(--text-primary)' }}>{fmt(34280 - total)}</strong> crédits
            </div>
            <button className="btn btn-primary btn-lg" style={{ width: '100%' }} onClick={() => navigate('migrations/run')}>
              <Icon name="rocket" /> Confirmer & lancer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
