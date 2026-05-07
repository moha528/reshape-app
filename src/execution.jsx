import React from 'react';
import { Icon, fmt } from './icons.jsx';

export function initialLogs() {
  const now = Date.now();
  const lines = [
    { o: -2400, l: 'INFO',  m: 'Migration MIG-2026-0412 reçue · queue=migrations.exec' },
    { o: -2398, l: 'INFO',  m: 'Worker rabbitmq-w-03 a pris la tâche' },
    { o: -2392, l: 'INFO',  m: 'Lecture source PostgreSQL db.legacy.sonatel.sn:5432/crm_legacy' },
    { o: -2380, l: 'OK',    m: 'Connexion établie · TLS 1.3 · 142ms' },
    { o: -2360, l: 'INFO',  m: 'Stream tables: clients_old (89 432), commandes_old (234 567), produits_old (4 820)' },
    { o: -2218, l: 'OK',    m: 'Lecture source terminée en 142s · 328 819 lignes en mémoire' },
    { o: -2210, l: 'INFO',  m: 'Validation schéma vs. profil détecté' },
    { o: -2182, l: 'OK',    m: 'Schéma validé · 18/18 colonnes mappées' },
    { o: -2178, l: 'INFO',  m: 'Application transformations IA-suggérées' },
    { o: -2084, l: 'OK',    m: 'Mapping IA terminé · confiance moyenne 87%' },
    { o: -2080, l: 'INFO',  m: '[transform] clients_old · trim+titlecase sur nom_complet' },
    { o: -1980, l: 'INFO',  m: '[transform] clients_old · date_dmy_to_iso sur date_creation' },
    { o: -1840, l: 'WARN',  m: 'Ligne 142 098 · date "01/01/0001" hors plage → null appliqué' },
    { o: -1620, l: 'INFO',  m: '[transform] commandes_old · ré-indexation FK fk_client' },
    { o: -1240, l: 'ERROR', m: 'Ligne 89 421 · email "contact@@sonatel.sn" rejeté (RFC 5322)' },
    { o: -1100, l: 'WARN',  m: 'Ligne 142 099 · doublon (id_client=10042) → fusion par email' },
    { o: -940,  l: 'INFO',  m: 'Push batch 1/27 → odoo_prod.res_partner · 10 000 rows' },
    { o: -880,  l: 'OK',    m: 'Batch 1/27 commit · 10 000 rows · 56 ms' },
    { o: -820,  l: 'INFO',  m: 'Push batch 2/27 → odoo_prod.res_partner · 10 000 rows' },
    { o: -760,  l: 'OK',    m: 'Batch 2/27 commit · 10 000 rows · 61 ms' },
  ];
  return lines.map(({ o, l, m }) => ({ time: new Date(now + o * 1000).toLocaleTimeString('fr-FR'), level: l, msg: m }));
}

function logEntry(level, msg) {
  return { time: new Date().toLocaleTimeString('fr-FR'), level, msg };
}

function randomLog() {
  const r = Math.random();
  if (r < 0.05) return logEntry('ERROR', `Ligne ${Math.floor(Math.random() * 200000)} · email rejeté (format invalide)`);
  if (r < 0.10) return logEntry('WARN', `Ligne ${Math.floor(Math.random() * 200000)} · valeur null imputée sur create_date`);
  if (r < 0.40) return logEntry('OK', `Batch ${Math.floor(Math.random() * 27) + 1}/27 commit · 10 000 rows · ${Math.floor(40 + Math.random() * 80)} ms`);
  return logEntry('INFO', `Push batch ${Math.floor(Math.random() * 27) + 1}/27 → odoo_prod.res_partner · 10 000 rows`);
}

export function ExecutionMonitor({ navigate }) {
  const [progress, setProgress] = React.useState(67);
  const [paused, setPaused] = React.useState(false);
  const [logs, setLogs] = React.useState(initialLogs());
  const logRef = React.useRef();

  React.useEffect(() => {
    if (paused) return;
    const t = setInterval(() => {
      setProgress(p => Math.min(99, p + Math.random() * 0.6));
      setLogs(l => {
        const next = [...l, randomLog()];
        return next.slice(-80);
      });
    }, 1500);
    return () => clearInterval(t);
  }, [paused]);

  React.useEffect(() => {
    if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight;
  }, [logs]);

  return (
    <div className="page-enter">
      <div className="page-header">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <h1 className="page-title">Sage 50 → Odoo ERP</h1>
            <span className="badge badge-info dot"><span className="pulse-dot" style={{ background: 'var(--info)', marginRight: 4 }}></span>{paused ? 'Pause' : 'En cours'}</span>
          </div>
          <p className="page-subtitle"><span className="mono">MIG-2026-0412</span> · démarrée il y a 40 min · Aïssatou Diop</p>
        </div>
        <div className="page-header-actions">
          <button className="btn btn-secondary" onClick={() => setPaused(!paused)}>
            <Icon name={paused ? 'play' : 'pause'} /> {paused ? 'Reprendre' : 'Pause'}
          </button>
          <button className="btn btn-secondary"><Icon name="stop" /> Annuler</button>
          <button className="btn btn-secondary"><Icon name="external" /> Détails</button>
        </div>
      </div>

      <div className="card" style={{ marginBottom: 16, background: 'linear-gradient(135deg, rgba(159,103,255,0.05), rgba(51,219,253,0.04))', borderColor: 'rgba(124,77,255,0.25)' }}>
        <div className="card-body">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 12 }}>
            <div>
              <div style={{ fontSize: 12, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>Progression globale</div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 36, fontWeight: 600, letterSpacing: '-0.02em', marginTop: 4 }}>
                {progress.toFixed(1)}<span style={{ fontSize: 22, color: 'var(--text-tertiary)' }}>%</span>
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: 12, color: 'var(--text-tertiary)' }}>Temps restant estimé</div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 600 }}>~ 14 min</div>
            </div>
          </div>
          <div className="progress" style={{ height: 10, marginBottom: 12 }}>
            <div className={`bar ${!paused ? 'animated' : ''}`} style={{ width: progress + '%' }}></div>
          </div>
          <div className="grid-5-stats" style={{ fontSize: 12 }}>
            {[
              { l: 'Lignes traitées', v: fmt(Math.round(184320 * progress / 67)), s: 'sur 275 000' },
              { l: 'Vitesse', v: '3 240', s: 'lignes/sec' },
              { l: 'Erreurs', v: '12', s: '0,007 %', color: 'var(--warning)' },
              { l: 'Volume', v: '94,2 MB', s: 'sur 142 MB' },
              { l: 'Crédits utilisés', v: fmt(Math.round(1840 * progress / 67)), s: 'sur 2 210 estimés' },
            ].map((s, i) => (
              <div key={i} style={{ borderLeft: i ? '1px solid var(--border)' : 'none', paddingLeft: i ? 16 : 0 }}>
                <div style={{ color: 'var(--text-tertiary)', marginBottom: 2 }}>{s.l}</div>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 600, color: s.color || 'var(--text-primary)' }}>{s.v}</div>
                <div style={{ color: 'var(--text-tertiary)', fontSize: 11 }}>{s.s}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2" style={{ marginBottom: 16 }}>
        <div className="card">
          <div className="card-header"><div><h3 className="card-title">Étapes du pipeline</h3></div></div>
          <div style={{ padding: '12px 20px 18px' }}>
            {[
              { name: 'Lecture source', status: 'done', duration: '142 s', rows: '275 000' },
              { name: 'Validation schéma', status: 'done', duration: '28 s' },
              { name: 'Mapping IA', status: 'done', duration: '94 s' },
              { name: 'Transformation', status: 'running', duration: '24 min', sub: '67 %' },
              { name: 'Push base cible', status: 'pending' },
              { name: 'Vérification intégrité', status: 'pending' },
              { name: 'Export errors.csv', status: 'pending' },
            ].map((s, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '8px 0' }}>
                <div style={{ width: 22, height: 22, borderRadius: '50%', display: 'grid', placeItems: 'center',
                  background: s.status === 'done' ? 'var(--success)' : s.status === 'running' ? 'var(--bg-surface)' : 'var(--bg-surface-3)',
                  color: s.status === 'done' ? '#fff' : 'var(--text-tertiary)',
                  border: s.status === 'running' ? '2px solid var(--brand-indigo)' : 'none',
                }}>
                  {s.status === 'done' && <Icon name="check" size={12} />}
                  {s.status === 'running' && <span className="pulse-dot" style={{ width: 6, height: 6, background: 'var(--brand-indigo)' }}></span>}
                </div>
                <div style={{ flex: 1, fontSize: 13, fontWeight: s.status === 'running' ? 600 : 400, color: s.status === 'pending' ? 'var(--text-tertiary)' : 'var(--text-primary)' }}>
                  {s.name}
                  {s.sub && <span className="mono" style={{ marginLeft: 8, color: 'var(--brand-indigo)' }}>· {s.sub}</span>}
                </div>
                <div className="mono" style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>{s.duration || '—'}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <div className="card-header"><div><h3 className="card-title">Anomalies détectées</h3><div className="card-subtitle">12 erreurs sur 184 320 lignes</div></div>
            <button className="btn btn-ghost btn-sm">Tout voir</button>
          </div>
          <div style={{ padding: '8px 0' }}>
            {[
              { kind: 'danger', icon: 'xCircle', t: 'Email invalide · ligne 89 421', d: '"contact@@sonatel.sn" — RFC 5322', count: 8 },
              { kind: 'warning', icon: 'alertTriangle', t: 'Date hors plage · ligne 142 098', d: '"01/01/0001" → valeur null appliquée', count: 3 },
              { kind: 'warning', icon: 'alertTriangle', t: 'Doublon FK détecté · table commandes', d: 'fk_client=10042 réf. introuvable', count: 1 },
            ].map((a, i) => (
              <div key={i} style={{ display: 'flex', gap: 10, padding: '12px 20px', borderTop: i ? '1px solid var(--border-subtle)' : 'none' }}>
                <div style={{ width: 28, height: 28, borderRadius: 8, background: a.kind === 'danger' ? 'var(--danger-bg)' : 'var(--warning-bg)', color: a.kind === 'danger' ? 'var(--danger)' : 'var(--warning)', display: 'grid', placeItems: 'center', flexShrink: 0 }}>
                  <Icon name={a.icon} size={13} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 550 }}>{a.t}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-tertiary)' }} className="truncate">{a.d}</div>
                </div>
                <span className="badge badge-neutral" style={{ alignSelf: 'flex-start' }}>×{a.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span className="pulse-dot"></span>
            <div><h3 className="card-title">Logs en temps réel</h3><div className="card-subtitle">SSE stream · {logs.length} lignes</div></div>
          </div>
          <div style={{ display: 'flex', gap: 6 }}>
            <button className="btn btn-ghost btn-sm"><Icon name="filter" size={12} /> Niveau</button>
            <button className="btn btn-ghost btn-sm"><Icon name="download" size={12} /> Télécharger</button>
          </div>
        </div>
        <div className="card-body" style={{ padding: 16 }}>
          <div className="log-stream" ref={logRef}>
            {logs.map((l, i) => (
              <div key={i} className="log-line">
                <span className="log-time">{l.time}</span>
                <span className={`log-level ${l.level}`}>{l.level}</span>
                <span className="log-msg">{l.msg}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
