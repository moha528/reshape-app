// ============================================================
// Remaining pages: History, Detail, Templates, Connectors,
// Credits, Organization, Audit, Webhooks, Settings
// ============================================================

// ---------- History ----------
function History({ navigate }) {
  const [filter, setFilter] = React.useState('all');
  const [search, setSearch] = React.useState('');
  const [sort, setSort] = React.useState({ key: 'startedAt', dir: 'desc' });

  let rows = window.MOCK.MIGRATIONS.filter(m => filter === 'all' || m.status === filter);
  if (search) rows = rows.filter(m => (m.name + m.id + m.owner).toLowerCase().includes(search.toLowerCase()));
  rows.sort((a, b) => {
    const va = a[sort.key], vb = b[sort.key];
    return (sort.dir === 'asc' ? 1 : -1) * (va > vb ? 1 : va < vb ? -1 : 0);
  });

  const setSortKey = (k) => setSort(s => ({ key: k, dir: s.key === k && s.dir === 'desc' ? 'asc' : 'desc' }));

  return (
    <div className="page-enter">
      <div className="page-header">
        <div>
          <h1 className="page-title">Historique des migrations</h1>
          <p className="page-subtitle">Toutes les migrations de votre organisation, avec filtres et export.</p>
        </div>
        <div className="page-header-actions">
          <button className="btn btn-secondary"><Icon name="download" /> Exporter (CSV)</button>
          <button className="btn btn-primary" onClick={() => navigate('migrations')}><Icon name="plus" /> Nouvelle migration</button>
        </div>
      </div>

      <div className="card" style={{ marginBottom: 16 }}>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center', padding: '14px 16px' }}>
          <div className="input-with-icon" style={{ flex: 1, maxWidth: 320 }}>
            <Icon name="search" />
            <input className="input" placeholder="Rechercher migration, ID, propriétaire…" value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <div style={{ display: 'flex', gap: 4, background: 'var(--bg-surface-2)', borderRadius: 8, padding: 3, border: '1px solid var(--border)' }}>
            {[
              { id: 'all', l: 'Toutes' },
              { id: 'running', l: 'En cours' },
              { id: 'success', l: 'Réussies' },
              { id: 'failed', l: 'Échouées' },
              { id: 'cancelled', l: 'Annulées' },
            ].map(f => (
              <button key={f.id} onClick={() => setFilter(f.id)} style={{ padding: '5px 12px', fontSize: 12, fontWeight: 550, borderRadius: 6, background: filter === f.id ? 'var(--bg-surface)' : 'transparent', color: filter === f.id ? 'var(--text-primary)' : 'var(--text-tertiary)', boxShadow: filter === f.id ? 'var(--shadow-xs)' : 'none' }}>
                {f.l}
              </button>
            ))}
          </div>
          <div style={{ marginLeft: 'auto', display: 'flex', gap: 6 }}>
            <button className="btn btn-secondary btn-sm"><Icon name="calendar" size={12} /> 30 derniers jours</button>
            <button className="btn btn-secondary btn-sm"><Icon name="filter" size={12} /> Filtres</button>
          </div>
        </div>
      </div>

      <div className="table-wrap">
        <table className="table">
          <thead>
            <tr>
              <th className="sortable" onClick={() => setSortKey('id')}>Migration ↕</th>
              <th>Source → Cible</th>
              <th>Mode</th>
              <th className="sortable" onClick={() => setSortKey('rows')}>Lignes ↕</th>
              <th>Erreurs</th>
              <th>Durée</th>
              <th className="sortable" onClick={() => setSortKey('credits')}>Crédits ↕</th>
              <th>Statut</th>
              <th>Propriétaire</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {rows.map(m => (
              <tr key={m.id} className="clickable" onClick={() => navigate('history/detail')}>
                <td>
                  <div style={{ fontWeight: 550 }}>{m.name}</div>
                  <div className="mono" style={{ color: 'var(--text-tertiary)' }}>{m.id} · {relTime(m.startedAt)}</div>
                </td>
                <td><ConnectorBadge id={m.sourceConn} /> <span style={{ color: 'var(--text-quaternary)', margin: '0 4px' }}>→</span> <ConnectorBadge id={m.destConn} /></td>
                <td>{m.mode === 'AI' ? <span className="badge badge-brand"><Icon name="sparkles" size={10} /> IA</span> : <span className="badge badge-neutral">Manuel</span>}</td>
                <td className="num">{fmt(m.rows)}</td>
                <td>{m.errors > 0 ? <span style={{ color: 'var(--danger)', fontWeight: 600 }}>{m.errors}</span> : <span style={{ color: 'var(--text-tertiary)' }}>0</span>}</td>
                <td className="mono">{fmtDur(m.duration)}</td>
                <td className="num">{fmt(m.credits)}</td>
                <td><StatusBadge status={m.status} /></td>
                <td><span style={{ fontSize: 12 }}>{m.owner}</span></td>
                <td><button className="icon-btn" onClick={(e) => e.stopPropagation()}><Icon name="more" size={14} /></button></td>
              </tr>
            ))}
          </tbody>
        </table>
        <div style={{ padding: '12px 16px', borderTop: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 12, color: 'var(--text-tertiary)' }}>
          <span>{rows.length} migrations · {fmt(rows.reduce((s, r) => s + r.rows, 0))} lignes au total</span>
          <div style={{ display: 'flex', gap: 4 }}>
            <button className="btn btn-ghost btn-sm" disabled><Icon name="chevronLeft" size={12} /></button>
            <button className="btn btn-ghost btn-sm">1 / 4</button>
            <button className="btn btn-ghost btn-sm"><Icon name="chevronRight" size={12} /></button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ---------- Migration detail ----------
function MigrationDetail({ navigate }) {
  const m = window.MOCK.MIGRATIONS[1]; // success one
  const [tab, setTab] = React.useState('overview');
  return (
    <div className="page-enter">
      <div className="page-header">
        <div>
          <a onClick={() => navigate('history')} style={{ fontSize: 12, color: 'var(--brand-indigo)', cursor: 'pointer', marginBottom: 6, display: 'inline-block' }}>← Retour à l'historique</a>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <h1 className="page-title">{m.name}</h1>
            <StatusBadge status={m.status} />
          </div>
          <p className="page-subtitle"><span className="mono">{m.id}</span> · terminée {relTime(m.startedAt)} · par {m.owner}</p>
        </div>
        <div className="page-header-actions">
          <button className="btn btn-secondary"><Icon name="download" /> Télécharger résultat</button>
          <button className="btn btn-secondary"><Icon name="copy" /> Dupliquer</button>
          <button className="btn btn-secondary"><Icon name="bookmark" /> En faire un template</button>
        </div>
      </div>

      <div className="grid grid-cols-4" style={{ marginBottom: 20 }}>
        <div className="stat-card"><div className="stat-label"><Icon name="check" /> Lignes migrées</div><div className="stat-value">{fmt(m.rows)}</div><div className="stat-trend up"><Icon name="checkCircle" size={11} /> 100% complété</div></div>
        <div className="stat-card"><div className="stat-label"><Icon name="alertCircle" /> Erreurs</div><div className="stat-value" style={{ color: 'var(--warning)' }}>{m.errors}</div><div className="stat-trend flat">0,003% · errors.csv</div></div>
        <div className="stat-card"><div className="stat-label"><Icon name="clock" /> Durée</div><div className="stat-value">{fmtDur(m.duration)}</div><div className="stat-trend flat">Vitesse: 49,1k/min</div></div>
        <div className="stat-card"><div className="stat-label"><Icon name="coins" /> Crédits consommés</div><div className="stat-value">{fmt(m.credits)}</div><div className="stat-trend flat">Estimé: {fmt(m.credits + 30)} (−3%)</div></div>
      </div>

      <div className="tabs">
        {[
          { id: 'overview', l: 'Vue d\'ensemble' },
          { id: 'mapping', l: 'Mapping appliqué' },
          { id: 'errors', l: 'Erreurs', n: m.errors },
          { id: 'logs', l: 'Logs' },
          { id: 'files', l: 'Fichiers' },
        ].map(t => (
          <div key={t.id} className={`tab ${tab === t.id ? 'active' : ''}`} onClick={() => setTab(t.id)}>
            {t.l} {t.n > 0 && <span className="badge">{t.n}</span>}
          </div>
        ))}
      </div>

      {tab === 'overview' && (
        <div className="grid" style={{ gridTemplateColumns: '2fr 1fr', gap: 20 }}>
          <div className="col gap-4">
            <div className="card">
              <div className="card-header"><div><h3 className="card-title">Configuration</h3></div></div>
              <div style={{ padding: '8px 20px 18px' }}>
                {[
                  { l: 'Source', v: <><ConnectorBadge id={m.sourceConn} /> <span className="mono" style={{ marginLeft: 8, fontSize: 11.5, color: 'var(--text-tertiary)' }}>{m.source}</span></> },
                  { l: 'Cible', v: <><ConnectorBadge id={m.destConn} /> <span className="mono" style={{ marginLeft: 8, fontSize: 11.5, color: 'var(--text-tertiary)' }}>{m.dest}</span></> },
                  { l: 'Tables', v: '3 (clients_old, commandes_old, produits_old)' },
                  { l: 'Mapping', v: m.mode === 'AI' ? <span className="badge badge-brand"><Icon name="sparkles" size={11} /> IA assistée · ×1.2</span> : <span className="badge badge-neutral">Manuel</span> },
                  { l: 'Politique d\'erreur', v: 'Ignorer & reporter' },
                  { l: 'Mode de livraison', v: 'Push direct + Excel téléchargeable' },
                ].map((r, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: i < 5 ? '1px solid var(--border-subtle)' : 'none', fontSize: 13 }}>
                    <span style={{ color: 'var(--text-tertiary)' }}>{r.l}</span><span>{r.v}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="card">
              <div className="card-header"><div><h3 className="card-title">Distribution des lignes</h3><div className="card-subtitle">Par table cible</div></div></div>
              <div className="card-body">
                {[
                  { t: 'res_partner', n: 89432, c: '#9f67ff' },
                  { t: 'sale_order', n: 234567, c: '#6366f1' },
                  { t: 'product_template', n: 4820, c: '#33dbfd' },
                ].map((r, i) => {
                  const pct = (r.n / 328819) * 100;
                  return (
                    <div key={i} style={{ marginBottom: 14 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12.5, marginBottom: 5 }}>
                        <span className="mono" style={{ fontWeight: 600 }}>{r.t}</span>
                        <span><strong className="num">{fmt(r.n)}</strong> <span style={{ color: 'var(--text-tertiary)' }}>· {pct.toFixed(1)}%</span></span>
                      </div>
                      <div className="progress"><div className="bar" style={{ width: pct + '%', background: r.c }}></div></div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
          <div className="col gap-4">
            <div className="card">
              <div className="card-header"><div><h3 className="card-title">Rapport téléchargeable</h3></div></div>
              <div className="card-body">
                {[
                  { n: 'rapport-migration.pdf', s: '2,3 MB', i: 'fileText' },
                  { n: 'res_partner.xlsx', s: '12,4 MB', i: 'fileSpreadsheet' },
                  { n: 'errors.csv', s: '8 KB', i: 'fileText' },
                  { n: 'mapping.json', s: '14 KB', i: 'fileText' },
                ].map((f, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0', borderBottom: i < 3 ? '1px solid var(--border-subtle)' : 'none' }}>
                    <Icon name={f.i} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div className="mono" style={{ fontSize: 12, fontWeight: 550 }} >{f.n}</div>
                      <div style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>{f.s}</div>
                    </div>
                    <button className="icon-btn"><Icon name="download" size={13} /></button>
                  </div>
                ))}
                <div style={{ fontSize: 11.5, color: 'var(--text-tertiary)', marginTop: 12, padding: 10, background: 'var(--warning-bg)', borderRadius: 8, border: '1px solid var(--warning-border)', color: 'var(--warning)' }}>
                  <Icon name="clock" size={11} /> Suppression automatique dans <strong>27 jours</strong> (rétention 30j)
                </div>
              </div>
            </div>
            <div className="card">
              <div className="card-header"><div><h3 className="card-title">Notifications envoyées</h3></div></div>
              <div className="card-body">
                {[
                  { i: 'mail', t: 'Email · a.diop@sonatel.sn', s: 'Délivré' },
                  { i: 'bell', t: 'In-app · 3 destinataires', s: 'Lu (2/3)' },
                  { i: 'webhook', t: 'Webhook · ops-bot.sonatel.sn', s: 'HTTP 200' },
                ].map((n, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0', borderBottom: i < 2 ? '1px solid var(--border-subtle)' : 'none', fontSize: 12.5 }}>
                    <Icon name={n.i} size={14} />
                    <span style={{ flex: 1 }}>{n.t}</span>
                    <span className="badge badge-success">{n.s}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {tab === 'errors' && (
        <div className="card">
          <div className="card-header"><div><h3 className="card-title">3 lignes en erreur</h3><div className="card-subtitle">Exportées dans errors.csv</div></div>
            <button className="btn btn-secondary btn-sm"><Icon name="download" size={12} /> Télécharger errors.csv</button>
          </div>
          <div className="table-wrap" style={{ borderRadius: 0, border: 'none' }}>
            <table className="table">
              <thead><tr><th>Ligne</th><th>Table</th><th>Champ</th><th>Valeur source</th><th>Erreur</th></tr></thead>
              <tbody>
                {[
                  { n: 89421, t: 'clients_old', f: 'email_addr', v: 'contact@@sonatel.sn', e: 'Format email invalide (RFC 5322)' },
                  { n: 142098, t: 'commandes_old', f: 'date_cmd', v: '01/01/0001', e: 'Date hors plage (< 1900)' },
                  { n: 142099, t: 'commandes_old', f: 'fk_client', v: '99999', e: 'Référence FK introuvable' },
                ].map((e, i) => (
                  <tr key={i}>
                    <td className="num">{fmt(e.n)}</td>
                    <td className="mono">{e.t}</td>
                    <td className="mono">{e.f}</td>
                    <td className="mono" style={{ color: 'var(--danger)' }}>{e.v}</td>
                    <td>{e.e}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tab === 'mapping' && (
        <div className="card">
          <div className="card-header"><div><h3 className="card-title">Mapping appliqué</h3></div></div>
          {window.MOCK.MAPPING.map((m, i) => (
            <div key={i} className={`map-row confidence-${m.confidence}`}>
              <div className="map-field"><div className="map-field-name">{m.src.split('.')[1]}</div><div className="map-field-type">{m.srcType}</div></div>
              <div style={{ color: 'var(--text-quaternary)', display: 'grid', placeItems: 'center' }}><Icon name="arrowRight" size={14} /></div>
              <div className="map-field"><div className="map-field-name">{m.tgt.split('.')[1]}</div><div className="map-field-type">{m.tgtType}</div></div>
              <div><span className="chip brand mono">{m.xform}</span></div>
              <span className="badge badge-success" style={{ alignSelf: 'center' }}>OK</span>
            </div>
          ))}
        </div>
      )}

      {tab === 'logs' && (
        <div className="card"><div className="card-body" style={{ padding: 16 }}>
          <div className="log-stream" style={{ height: 480 }}>
            {initialLogs().map((l, i) => (
              <div key={i} className="log-line"><span className="log-time">{l.time}</span><span className={`log-level ${l.level}`}>{l.level}</span><span className="log-msg">{l.msg}</span></div>
            ))}
            <div className="log-line"><span className="log-time">{new Date().toLocaleTimeString('fr-FR')}</span><span className="log-level OK">OK</span><span className="log-msg">Migration terminée · 89 432 lignes commitées · 1 820s</span></div>
          </div>
        </div></div>
      )}

      {tab === 'files' && (
        <div className="card"><div className="card-body">
          <div style={{ color: 'var(--text-tertiary)', fontSize: 13 }}>Voir l'onglet « Vue d'ensemble » → bloc Rapport téléchargeable.</div>
        </div></div>
      )}
    </div>
  );
}

// ---------- Templates ----------
function Templates({ navigate }) {
  return (
    <div className="page-enter">
      <div className="page-header">
        <div>
          <h1 className="page-title">Templates de mapping</h1>
          <p className="page-subtitle">Sauvegardez vos mappings validés et réutilisez-les en un clic.</p>
        </div>
        <div className="page-header-actions">
          <button className="btn btn-primary"><Icon name="plus" /> Nouveau template</button>
        </div>
      </div>
      <div className="grid grid-cols-3" style={{ gap: 16 }}>
        {window.MOCK.TEMPLATES.map(t => (
          <div key={t.id} className="card" style={{ padding: 18, cursor: 'pointer' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
              <div style={{ width: 40, height: 40, borderRadius: 10, background: 'var(--gradient-brand)', color: '#fff', display: 'grid', placeItems: 'center' }}>
                <Icon name="bookmark" size={18} />
              </div>
              <button className="icon-btn"><Icon name="more" size={14} /></button>
            </div>
            <div style={{ fontWeight: 600, fontSize: 14, letterSpacing: '-0.01em', marginBottom: 4 }}>{t.name}</div>
            <div style={{ fontSize: 12, color: 'var(--text-tertiary)', minHeight: 36, marginBottom: 14 }}>{t.description}</div>
            <div style={{ display: 'flex', gap: 8, marginBottom: 14, flexWrap: 'wrap' }}>
              <span className="badge badge-neutral">{t.fields} champs</span>
              <span className="badge badge-brand">Utilisé {t.uses}×</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 11.5, color: 'var(--text-tertiary)', borderTop: '1px solid var(--border-subtle)', paddingTop: 10 }}>
              <span>{t.owner}</span>
              <span>{relTime(t.updatedAt)}</span>
            </div>
          </div>
        ))}
        <div className="card" style={{ padding: 18, border: '2px dashed var(--border)', background: 'transparent', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 200 }}>
          <div style={{ width: 40, height: 40, borderRadius: 10, background: 'var(--bg-surface-3)', color: 'var(--text-tertiary)', display: 'grid', placeItems: 'center', marginBottom: 12 }}>
            <Icon name="plus" size={20} />
          </div>
          <div style={{ fontWeight: 600, fontSize: 13 }}>Créer un template</div>
          <div style={{ fontSize: 12, color: 'var(--text-tertiary)', marginTop: 4 }}>Depuis une migration validée</div>
        </div>
      </div>
    </div>
  );
}

// ---------- Connectors ----------
function Connectors() {
  return (
    <div className="page-enter">
      <div className="page-header">
        <div>
          <h1 className="page-title">Connecteurs</h1>
          <p className="page-subtitle">Connexions BDD sauvegardées et formats de fichiers supportés.</p>
        </div>
        <div className="page-header-actions">
          <button className="btn btn-primary"><Icon name="plus" /> Nouvelle connexion</button>
        </div>
      </div>

      <div className="card" style={{ marginBottom: 20 }}>
        <div className="card-header"><div><h3 className="card-title">Connexions BDD sauvegardées</h3><div className="card-subtitle">4 connexions · credentials chiffrés AES-256</div></div></div>
        <div className="table-wrap" style={{ borderRadius: 0, border: 'none' }}>
          <table className="table">
            <thead><tr><th>Nom</th><th>Type</th><th>Hôte</th><th>Statut</th><th>Dernière utilisation</th><th>Actions</th></tr></thead>
            <tbody>
              {[
                { name: 'CRM Legacy Sonatel', type: 'postgres', host: 'db.legacy.sonatel.sn:5432/crm_legacy', last: 'Aujourd\'hui · 14h32', status: 'ok' },
                { name: 'Billing MariaDB', type: 'mariadb', host: 'mdb-billing.internal:3306/billing', last: 'Il y a 3 jours', status: 'ok' },
                { name: 'Analytics Mongo', type: 'mongodb', host: 'mongo-analytics.sn:27017/cdr', last: 'Il y a 1 semaine', status: 'ok' },
                { name: 'ERP SQL Server', type: 'sqlserver', host: '10.0.4.21:1433/erp_dakar', last: 'Il y a 2 semaines', status: 'warn' },
              ].map((s, i) => (
                <tr key={i}>
                  <td style={{ fontWeight: 600 }}>{s.name}</td>
                  <td><ConnectorBadge id={s.type} /></td>
                  <td className="mono" style={{ color: 'var(--text-tertiary)', fontSize: 11.5 }}>{s.host}</td>
                  <td>{s.status === 'ok' ? <span className="badge badge-success dot">Active</span> : <span className="badge badge-warning dot">Latence élevée</span>}</td>
                  <td>{s.last}</td>
                  <td><div style={{ display: 'flex', gap: 4 }}>
                    <button className="icon-btn" title="Tester"><Icon name="zap" size={13} /></button>
                    <button className="icon-btn" title="Éditer"><Icon name="edit" size={13} /></button>
                    <button className="icon-btn" title="Supprimer"><Icon name="trash" size={13} /></button>
                  </div></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid" style={{ gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <div className="card">
          <div className="card-header"><div><h3 className="card-title">Bases de données supportées</h3></div></div>
          <div className="card-body">
            <div className="grid grid-cols-2" style={{ gap: 10 }}>
              {window.MOCK.CONNECTORS.filter(c => c.kind === 'db').map(c => (
                <div key={c.id} className="connector-card">
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div className="connector-icon" style={{ background: c.color, width: 32, height: 32 }}>{c.initials}</div>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: 13 }}>{c.name}</div>
                      <div style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>Source · Destination</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="card">
          <div className="card-header"><div><h3 className="card-title">Formats de fichiers</h3></div></div>
          <div className="card-body">
            <div className="grid grid-cols-2" style={{ gap: 10 }}>
              {window.MOCK.CONNECTORS.filter(c => c.kind === 'file').map(c => (
                <div key={c.id} className="connector-card">
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div className="connector-icon" style={{ background: c.color, width: 32, height: 32 }}>{c.initials}</div>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: 13 }}>{c.name}</div>
                      <div style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>Source · Destination</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ---------- Credits & Billing ----------
function Credits() {
  const [showBuy, setShowBuy] = React.useState(false);
  return (
    <div className="page-enter">
      <div className="page-header">
        <div>
          <h1 className="page-title">Crédits & facturation</h1>
          <p className="page-subtitle">Solde, consommation et historique d'achats via Paddle.</p>
        </div>
        <div className="page-header-actions">
          <button className="btn btn-secondary"><Icon name="fileText" /> Factures</button>
          <button className="btn btn-primary" onClick={() => setShowBuy(true)}><Icon name="plus" /> Acheter des crédits</button>
        </div>
      </div>

      <div className="grid" style={{ gridTemplateColumns: '2fr 1fr', gap: 20, marginBottom: 20 }}>
        <div className="card" style={{ background: 'var(--gradient-brand-strong)', color: '#fff', border: 'none', overflow: 'hidden', position: 'relative' }}>
          <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at 80% 0%, rgba(255,255,255,0.15), transparent 60%)' }}></div>
          <div className="card-body" style={{ position: 'relative', padding: 28 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <div style={{ fontSize: 12, opacity: 0.85, textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600 }}>Solde actuel</div>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: 56, fontWeight: 600, letterSpacing: '-0.025em', lineHeight: 1, marginTop: 8 }}>{fmt(34280)}</div>
                <div style={{ fontSize: 13, opacity: 0.85, marginTop: 6 }}>crédits disponibles · ~6,3 millions de lignes</div>
              </div>
              <Icon name="coins" size={32} style={{ opacity: 0.8 }} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 18, marginTop: 28, paddingTop: 18, borderTop: '1px solid rgba(255,255,255,0.2)' }}>
              {[
                { l: 'Consommé ce mois', v: fmt(13420) },
                { l: 'Achetés ce mois', v: fmt(20000) },
                { l: 'Essai gratuit', v: '0 / 250' },
              ].map((s, i) => (
                <div key={i}>
                  <div style={{ fontSize: 11, opacity: 0.8 }}>{s.l}</div>
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 600, marginTop: 2 }}>{s.v}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-header"><div><h3 className="card-title">Estimation budgétaire</h3></div></div>
          <div className="card-body">
            <div style={{ fontSize: 12, color: 'var(--text-tertiary)', marginBottom: 8 }}>Au rythme actuel, votre solde durera</div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 30, fontWeight: 600, letterSpacing: '-0.02em' }}>~ 11 semaines</div>
            <div style={{ fontSize: 12, color: 'var(--text-tertiary)', marginTop: 4 }}>Soit ~3 100 crédits / semaine</div>
            <div className="progress" style={{ marginTop: 14, marginBottom: 6 }}><div className="bar" style={{ width: '34%' }}></div></div>
            <div style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>Recommandation : recharger d'ici 8 semaines</div>
          </div>
        </div>
      </div>

      <div className="card" style={{ marginBottom: 20 }}>
        <div className="card-header"><div><h3 className="card-title">Consommation des 30 derniers jours</h3></div>
          <div style={{ display: 'flex', gap: 6 }}>
            <span className="chip">● Consommés</span>
            <span className="chip brand">● Achetés</span>
          </div>
        </div>
        <div className="card-body"><CreditsChart /></div>
      </div>

      <div className="card">
        <div className="card-header"><div><h3 className="card-title">Historique des transactions</h3></div></div>
        <div className="table-wrap" style={{ borderRadius: 0, border: 'none' }}>
          <table className="table">
            <thead><tr><th>Date</th><th>Type</th><th>Description</th><th>Montant</th><th>Crédits</th><th>Solde après</th><th>Reçu</th></tr></thead>
            <tbody>
              {[
                { d: '4 mai', t: 'consumed', l: 'MIG-2026-0412 Sage→Odoo', m: '—', c: -1840, b: 34280 },
                { d: '4 mai', t: 'consumed', l: 'MIG-2026-0411 CBAO clientèle', m: '—', c: -920, b: 36120 },
                { d: '3 mai', t: 'purchased', l: 'Pack Standard · Paddle #PD-9421', m: '249,00 €', c: 10000, b: 37040 },
                { d: '2 mai', t: 'consumed', l: 'MIG-2026-0410 BTP Africa', m: '—', c: -2340, b: 27040 },
                { d: '1 mai', t: 'consumed', l: 'MIG-2026-0408 Sonatel CDR', m: '—', c: -8430, b: 29380 },
                { d: '28 avr.', t: 'purchased', l: 'Pack Pro · Paddle #PD-9398', m: '599,00 €', c: 25000, b: 37810 },
                { d: '15 avr.', t: 'free', l: 'Essai gratuit · inscription', m: '—', c: 250, b: 12810 },
              ].map((r, i) => (
                <tr key={i}>
                  <td>{r.d}</td>
                  <td>{r.t === 'purchased' ? <span className="badge badge-success">Achat</span> : r.t === 'free' ? <span className="badge badge-brand">Offert</span> : <span className="badge badge-neutral">Consommé</span>}</td>
                  <td>{r.l}</td>
                  <td className="num">{r.m}</td>
                  <td className="num" style={{ color: r.c < 0 ? 'var(--danger)' : 'var(--success)', fontWeight: 600 }}>{r.c > 0 ? '+' : ''}{fmt(r.c)}</td>
                  <td className="num">{fmt(r.b)}</td>
                  <td>{r.t === 'purchased' && <button className="btn btn-ghost btn-sm"><Icon name="download" size={11} /></button>}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showBuy && <BuyCreditsModal onClose={() => setShowBuy(false)} />}
    </div>
  );
}

function CreditsChart() {
  const days = 30;
  const consumed = Array.from({ length: days }, (_, i) => 200 + Math.sin(i * 0.5) * 600 + Math.random() * 400);
  const W = 800, H = 180, pad = { l: 40, r: 10, t: 10, b: 20 };
  const cw = W - pad.l - pad.r, ch = H - pad.t - pad.b;
  const max = Math.max(...consumed, 2000);
  const x = i => pad.l + (i / (days - 1)) * cw;
  const y = v => pad.t + ch - (v / max) * ch;
  const purchases = [{ d: 4, v: 25000 }, { d: 18, v: 10000 }, { d: 25, v: 5000 }];
  return (
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ display: 'block' }}>
      <defs>
        <linearGradient id="cc-grad" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#6366f1" stopOpacity="0.2"/>
          <stop offset="1" stopColor="#6366f1" stopOpacity="0"/>
        </linearGradient>
      </defs>
      {[0, 0.5, 1].map((p, i) => <line key={i} x1={pad.l} x2={W - pad.r} y1={pad.t + ch * p} y2={pad.t + ch * p} stroke="var(--border-subtle)" strokeDasharray="2 3"/>)}
      {consumed.map((c, i) => (
        <rect key={i} x={x(i) - 4} y={y(c)} width="8" height={ch - (y(c) - pad.t)} fill="#6366f1" opacity="0.35" rx="2"/>
      ))}
      {purchases.map((p, i) => (
        <g key={i}>
          <line x1={x(p.d)} x2={x(p.d)} y1={pad.t} y2={pad.t + ch} stroke="#10b981" strokeDasharray="3 3" strokeWidth="1.5"/>
          <circle cx={x(p.d)} cy={pad.t + 8} r="6" fill="#10b981"/>
          <text x={x(p.d)} y={pad.t + 12} fontSize="9" fontWeight="700" textAnchor="middle" fill="#fff">+</text>
          <text x={x(p.d)} y={pad.t + 28} fontSize="10" textAnchor="middle" fill="#10b981" fontWeight="600">+{p.v / 1000}k</text>
        </g>
      ))}
    </svg>
  );
}

function BuyCreditsModal({ onClose }) {
  const packs = [
    { id: 'starter', name: 'Starter', credits: 5000, price: 149, popular: false },
    { id: 'standard', name: 'Standard', credits: 10000, price: 249, popular: true },
    { id: 'pro', name: 'Pro', credits: 25000, price: 599, popular: false },
    { id: 'enterprise', name: 'Enterprise', credits: 100000, price: 1990, popular: false },
  ];
  const [selected, setSelected] = React.useState('standard');
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" style={{ maxWidth: 720 }} onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3 className="modal-title">Acheter des crédits</h3>
          <p className="modal-subtitle">Les crédits achetés n'expirent jamais. Paiement sécurisé via Paddle.</p>
        </div>
        <div className="modal-body">
          <div className="grid grid-cols-4" style={{ gap: 10 }}>
            {packs.map(p => (
              <div key={p.id} onClick={() => setSelected(p.id)} className={`connector-card ${selected === p.id ? 'selected' : ''}`} style={{ position: 'relative', textAlign: 'center', padding: '18px 12px' }}>
                {p.popular && <span className="badge badge-brand" style={{ position: 'absolute', top: -8, right: 12 }}>Populaire</span>}
                <div style={{ fontWeight: 600, fontSize: 13.5 }}>{p.name}</div>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: 24, fontWeight: 600, marginTop: 8 }}>{fmt(p.credits)}</div>
                <div style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>crédits</div>
                <div style={{ marginTop: 12, fontSize: 18, fontWeight: 600 }}>{p.price} €</div>
                <div style={{ fontSize: 10.5, color: 'var(--text-tertiary)' }}>{(p.price / p.credits * 1000).toFixed(2)} € / 1k</div>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 20, padding: 14, borderRadius: 10, background: 'var(--bg-surface-2)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 10, fontSize: 12, color: 'var(--text-secondary)' }}>
            <Icon name="shield" size={14} /> Paiement TVA gérée par Paddle (Merchant of Record). CB, PayPal, virement.
          </div>
        </div>
        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose}>Annuler</button>
          <button className="btn btn-primary"><Icon name="external" size={12} /> Continuer vers Paddle</button>
        </div>
      </div>
    </div>
  );
}

// ---------- Organization ----------
function Organization() {
  const [tab, setTab] = React.useState('members');
  return (
    <div className="page-enter">
      <div className="page-header">
        <div>
          <h1 className="page-title">Organisation Sonatel</h1>
          <p className="page-subtitle">Gestion des membres, rôles et invitations · tenant isolé.</p>
        </div>
        <div className="page-header-actions">
          <button className="btn btn-secondary"><Icon name="building" /> Paramètres org.</button>
          <button className="btn btn-primary"><Icon name="plus" /> Inviter un membre</button>
        </div>
      </div>

      <div className="grid grid-cols-4" style={{ marginBottom: 20 }}>
        <div className="stat-card"><div className="stat-label"><Icon name="users" /> Membres</div><div className="stat-value">6</div><div className="stat-trend flat">2 admins · 3 opérateurs · 1 invité</div></div>
        <div className="stat-card"><div className="stat-label"><Icon name="bookmark" /> Templates</div><div className="stat-value">12</div><div className="stat-trend flat">Partagés dans l'org.</div></div>
        <div className="stat-card"><div className="stat-label"><Icon name="zap" /> Migrations / mois</div><div className="stat-value">47</div><div className="stat-trend up"><Icon name="trendUp" size={11} /> +12%</div></div>
        <div className="stat-card"><div className="stat-label"><Icon name="coins" /> Crédits partagés</div><div className="stat-value">{fmt(34280)}</div><div className="stat-trend flat">Pool d'organisation</div></div>
      </div>

      <div className="tabs">
        {[{ id: 'members', l: 'Membres', n: 6 }, { id: 'invites', l: 'Invitations', n: 2 }, { id: 'roles', l: 'Rôles & permissions' }].map(t => (
          <div key={t.id} className={`tab ${tab === t.id ? 'active' : ''}`} onClick={() => setTab(t.id)}>{t.l} {t.n && <span className="badge">{t.n}</span>}</div>
        ))}
      </div>

      {tab === 'members' && (
        <div className="card">
          <div className="table-wrap" style={{ borderRadius: 12, border: 'none' }}>
            <table className="table">
              <thead><tr><th>Membre</th><th>Email</th><th>Rôle</th><th>2FA</th><th>Migrations</th><th>Crédits utilisés</th><th>Dernière connexion</th><th></th></tr></thead>
              <tbody>
                {window.MOCK.USERS.map((u, i) => (
                  <tr key={i}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div className="avatar sm">{u.initials}</div>
                        <span style={{ fontWeight: 550 }}>{u.name}</span>
                      </div>
                    </td>
                    <td className="mono" style={{ fontSize: 11.5, color: 'var(--text-tertiary)' }}>{u.email}</td>
                    <td>
                      <select className="select" defaultValue={u.role} style={{ padding: '4px 8px', fontSize: 12, width: 130 }}>
                        <option>Admin</option><option>Opérateur</option><option>Invité</option>
                      </select>
                    </td>
                    <td>{i % 3 !== 2 ? <span className="badge badge-success"><Icon name="check" size={11} /> Actif</span> : <span className="badge badge-warning">Désactivé</span>}</td>
                    <td className="num">{[18, 12, 8, 5, 3, 1][i]}</td>
                    <td className="num">{fmt([12480, 8240, 5120, 3210, 1840, 420][i])}</td>
                    <td>{['à l\'instant', '14h32', '12h08', 'hier', 'il y a 2j', 'il y a 1 sem.'][i]}</td>
                    <td><button className="icon-btn"><Icon name="more" size={14} /></button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tab === 'invites' && (
        <div className="card">
          <div className="table-wrap" style={{ borderRadius: 12, border: 'none' }}>
            <table className="table">
              <thead><tr><th>Email</th><th>Rôle</th><th>Invité par</th><th>Expire</th><th></th></tr></thead>
              <tbody>
                <tr><td className="mono" style={{ fontSize: 12 }}>partner@cabinet-it-dakar.sn</td><td><span className="badge badge-neutral">Opérateur</span></td><td>Aïssatou Diop</td><td>dans 5 jours</td><td><div style={{ display: 'flex', gap: 4 }}><button className="btn btn-ghost btn-sm">Renvoyer</button><button className="btn btn-ghost btn-sm" style={{ color: 'var(--danger)' }}>Annuler</button></div></td></tr>
                <tr><td className="mono" style={{ fontSize: 12 }}>tech@bicis.sn</td><td><span className="badge badge-neutral">Invité</span></td><td>Moussa Ndiaye</td><td>dans 6 jours</td><td><div style={{ display: 'flex', gap: 4 }}><button className="btn btn-ghost btn-sm">Renvoyer</button><button className="btn btn-ghost btn-sm" style={{ color: 'var(--danger)' }}>Annuler</button></div></td></tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tab === 'roles' && (
        <div className="card">
          <div className="table-wrap" style={{ borderRadius: 12, border: 'none' }}>
            <table className="table">
              <thead><tr><th>Permission</th><th style={{ textAlign: 'center' }}>Admin</th><th style={{ textAlign: 'center' }}>Opérateur</th><th style={{ textAlign: 'center' }}>Invité</th></tr></thead>
              <tbody>
                {[
                  ['Lancer une migration', true, true, false],
                  ['Voir l\'historique', true, true, true],
                  ['Créer/modifier des templates', true, true, false],
                  ['Gérer les connexions BDD', true, true, false],
                  ['Inviter des membres', true, false, false],
                  ['Modifier les rôles', true, false, false],
                  ['Acheter des crédits', true, false, false],
                  ['Consulter l\'audit trail', true, false, false],
                  ['Configurer les webhooks', true, false, false],
                ].map((r, i) => (
                  <tr key={i}>
                    <td style={{ fontWeight: 500 }}>{r[0]}</td>
                    {r.slice(1).map((v, j) => <td key={j} style={{ textAlign: 'center' }}>{v ? <Icon name="check" size={14} style={{ color: 'var(--success)' }} /> : <Icon name="x" size={14} style={{ color: 'var(--text-quaternary)' }} />}</td>)}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

// ---------- Audit ----------
function Audit() {
  return (
    <div className="page-enter">
      <div className="page-header">
        <div>
          <h1 className="page-title">Journal d'audit</h1>
          <p className="page-subtitle">Toutes les actions significatives de votre organisation. Conservé indéfiniment.</p>
        </div>
        <div className="page-header-actions">
          <button className="btn btn-secondary"><Icon name="download" /> Exporter</button>
        </div>
      </div>
      <div className="card" style={{ marginBottom: 16 }}>
        <div style={{ display: 'flex', gap: 12, padding: 14 }}>
          <div className="input-with-icon" style={{ flex: 1, maxWidth: 320 }}>
            <Icon name="search" />
            <input className="input" placeholder="Rechercher utilisateur, action…" />
          </div>
          <select className="select" style={{ width: 180 }}><option>Tous les utilisateurs</option></select>
          <select className="select" style={{ width: 180 }}><option>Toutes les actions</option></select>
          <select className="select" style={{ width: 160 }}><option>30 derniers jours</option></select>
        </div>
      </div>
      <div className="card">
        <div style={{ padding: 0 }}>
          {[...window.MOCK.AUDIT, ...window.MOCK.AUDIT].map((a, i) => (
            <div key={i} style={{ display: 'grid', gridTemplateColumns: '160px 32px 1fr 200px', gap: 14, padding: '14px 20px', borderBottom: i < 13 ? '1px solid var(--border-subtle)' : 'none', alignItems: 'center' }}>
              <div className="mono" style={{ fontSize: 11.5, color: 'var(--text-tertiary)' }}>{new Date(a.at).toLocaleString('fr-FR')}</div>
              <div className="avatar sm">{a.user.split(' ').map(n => n[0]).slice(0,2).join('')}</div>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <div style={{ fontSize: 13 }}><strong>{a.user}</strong> <span style={{ color: 'var(--text-tertiary)' }}>· {a.action}</span> <span className="mono" style={{ fontSize: 11.5, color: 'var(--brand-indigo)' }}>{a.target}</span></div>
                <div style={{ fontSize: 11.5, color: 'var(--text-tertiary)' }}>{a.meta}</div>
              </div>
              <div style={{ fontSize: 11, color: 'var(--text-quaternary)', textAlign: 'right' }} className="mono">IP 196.207.{40 + i}.{120 + i}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ---------- Webhooks & API ----------
function Webhooks() {
  return (
    <div className="page-enter">
      <div className="page-header">
        <div>
          <h1 className="page-title">Webhooks & API</h1>
          <p className="page-subtitle">Intégrations machine-à-machine pour intégrateurs et ESN.</p>
        </div>
        <div className="page-header-actions">
          <button className="btn btn-primary"><Icon name="plus" /> Nouveau webhook</button>
        </div>
      </div>

      <div className="card" style={{ marginBottom: 20 }}>
        <div className="card-header"><div><h3 className="card-title">Webhooks configurés</h3><div className="card-subtitle">3 endpoints actifs</div></div></div>
        <div className="table-wrap" style={{ borderRadius: 0, border: 'none' }}>
          <table className="table">
            <thead><tr><th>URL</th><th>Événements</th><th>Statut</th><th>Dernière livraison</th><th>Réussite</th><th></th></tr></thead>
            <tbody>
              {[
                { url: 'https://ops-bot.sonatel.sn/reshape/hooks', events: ['migration.success', 'migration.failed'], status: 'ok', last: 'il y a 4 min · HTTP 200', rate: 99.8 },
                { url: 'https://api.cbao-it.sn/v1/reshape', events: ['migration.success'], status: 'ok', last: 'il y a 1 j · HTTP 200', rate: 100 },
                { url: 'https://hooks.btp-africa.sn/migrations', events: ['*'], status: 'warn', last: 'il y a 2 j · HTTP 503', rate: 87.4 },
              ].map((w, i) => (
                <tr key={i}>
                  <td className="mono" style={{ fontSize: 12, fontWeight: 550 }}>{w.url}</td>
                  <td><div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>{w.events.map(e => <span key={e} className="chip mono" style={{ fontSize: 10.5, padding: '2px 8px' }}>{e}</span>)}</div></td>
                  <td>{w.status === 'ok' ? <span className="badge badge-success dot">Actif</span> : <span className="badge badge-warning dot">Erreurs</span>}</td>
                  <td style={{ fontSize: 12 }}>{w.last}</td>
                  <td><div style={{ display: 'flex', alignItems: 'center', gap: 8 }}><div className="progress" style={{ width: 60, height: 4 }}><div className="bar" style={{ width: w.rate + '%', background: w.rate > 95 ? 'var(--success)' : 'var(--warning)' }}></div></div><span className="num" style={{ fontSize: 11.5 }}>{w.rate}%</span></div></td>
                  <td><button className="icon-btn"><Icon name="more" size={13} /></button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid" style={{ gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <div className="card">
          <div className="card-header"><div><h3 className="card-title">Payload exemple</h3><div className="card-subtitle">migration.success</div></div>
            <button className="btn btn-ghost btn-sm"><Icon name="copy" size={12} /> Copier</button>
          </div>
          <div style={{ padding: 16 }}>
            <pre style={{ background: '#0a0d18', color: '#c9d1ed', padding: 16, borderRadius: 10, fontFamily: 'var(--font-mono)', fontSize: 11.5, lineHeight: 1.7, margin: 0, overflowX: 'auto' }}>
{`{
  "event": "migration.success",
  "tenant_id": "ten_2H4KqL...",
  "migration": {
    "id": "MIG-2026-0411",
    "name": "CBAO clientèle",
    "status": "success",
    "started_at": "2026-05-03T14:30:00Z",
    "duration_s": 1820,
    "rows": 89432,
    "errors": 3,
    "credits_consumed": 920
  },
  "files": [
    "https://r.sh/d/abc...crm.xlsx",
    "https://r.sh/d/abc...errors.csv"
  ]
}`}
            </pre>
          </div>
        </div>

        <div className="card">
          <div className="card-header"><div><h3 className="card-title">Clés d'API</h3><div className="card-subtitle">Post-MVP · accès API REST</div></div>
            <button className="btn btn-secondary btn-sm"><Icon name="key" size={12} /> Générer</button>
          </div>
          <div className="card-body">
            <div style={{ padding: 12, background: 'var(--bg-surface-2)', borderRadius: 8, fontFamily: 'var(--font-mono)', fontSize: 12, display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
              <Icon name="key" size={14} />
              <span style={{ flex: 1 }}>rsh_live_••••••••••••••••a3f2</span>
              <button className="btn btn-ghost btn-sm"><Icon name="copy" size={12} /></button>
            </div>
            <div style={{ fontSize: 12, color: 'var(--text-tertiary)', lineHeight: 1.6 }}>
              Créée le 12 avril 2026 · dernier usage il y a 4 min · 12 480 appels ce mois.
            </div>
            <div className="alert alert-info" style={{ marginTop: 14 }}>
              <Icon name="info" />
              <div className="alert-body" style={{ fontSize: 12 }}>L'API REST publique est prévue post-MVP. Les clés actuelles permettent uniquement le test des webhooks.</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ---------- Settings ----------
function Settings() {
  const [tab, setTab] = React.useState('profile');
  return (
    <div className="page-enter">
      <div className="page-header">
        <div>
          <h1 className="page-title">Paramètres</h1>
          <p className="page-subtitle">Profil, sécurité, préférences et notifications.</p>
        </div>
      </div>

      <div className="grid" style={{ gridTemplateColumns: '220px 1fr', gap: 24 }}>
        <nav className="settings-nav">
          {[
            { id: 'profile', l: 'Profil', i: 'user' },
            { id: 'security', l: 'Sécurité', i: 'lock' },
            { id: 'preferences', l: 'Préférences', i: 'settings' },
            { id: 'notifications', l: 'Notifications', i: 'bell' },
            { id: 'danger', l: 'Zone dangereuse', i: 'alertTriangle', danger: true },
          ].map(t => (
            <button key={t.id} className={`settings-nav-item ${tab === t.id ? 'active' : ''} ${t.danger ? 'danger' : ''}`} onClick={() => setTab(t.id)}>
              <Icon name={t.i} size={15} /><span>{t.l}</span>
            </button>
          ))}
        </nav>

        <div className="card">
          {tab === 'profile' && (
            <div className="card-body" style={{ padding: 24 }}>
              <h3 style={{ margin: 0, fontSize: 16, fontWeight: 600, marginBottom: 16 }}>Informations personnelles</h3>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
                <div className="avatar lg" style={{ width: 64, height: 64, fontSize: 22 }}>AD</div>
                <div>
                  <button className="btn btn-secondary btn-sm">Changer la photo</button>
                  <div style={{ fontSize: 11, color: 'var(--text-tertiary)', marginTop: 6 }}>JPG/PNG · max 2 MB</div>
                </div>
              </div>
              <div className="grid grid-cols-2" style={{ gap: 14, marginBottom: 16 }}>
                <div className="field"><label className="field-label">Prénom</label><input className="input" defaultValue="Aïssatou" /></div>
                <div className="field"><label className="field-label">Nom</label><input className="input" defaultValue="Diop" /></div>
                <div className="field"><label className="field-label">Email</label><input className="input" defaultValue="a.diop@sonatel.sn" /></div>
                <div className="field"><label className="field-label">Téléphone</label><input className="input" defaultValue="+221 77 432 18 90" /></div>
                <div className="field"><label className="field-label">Fonction</label><input className="input" defaultValue="Lead Data Migration" /></div>
                <div className="field"><label className="field-label">Fuseau horaire</label><select className="select"><option>Africa/Dakar (UTC+0)</option><option>Europe/Paris</option></select></div>
              </div>
              <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                <button className="btn btn-secondary">Annuler</button>
                <button className="btn btn-primary">Enregistrer</button>
              </div>
            </div>
          )}
          {tab === 'security' && (
            <div className="card-body" style={{ padding: 24 }}>
              <h3 style={{ margin: 0, fontSize: 16, fontWeight: 600, marginBottom: 4 }}>Mot de passe</h3>
              <p style={{ fontSize: 12, color: 'var(--text-tertiary)', marginBottom: 16 }}>Min. 12 caractères · majuscule · chiffre · spécial.</p>
              <div className="grid grid-cols-2" style={{ gap: 14, marginBottom: 24 }}>
                <div className="field"><label className="field-label">Mot de passe actuel</label><input className="input" type="password" defaultValue="••••••••••" /></div>
                <div></div>
                <div className="field"><label className="field-label">Nouveau mot de passe</label><input className="input" type="password" /></div>
                <div className="field"><label className="field-label">Confirmer</label><input className="input" type="password" /></div>
              </div>
              <div style={{ borderTop: '1px solid var(--border)', paddingTop: 20 }}>
                <h3 style={{ margin: 0, fontSize: 16, fontWeight: 600, marginBottom: 4 }}>Authentification à deux facteurs</h3>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 16, background: 'var(--bg-surface-2)', borderRadius: 10, marginTop: 12 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{ width: 36, height: 36, borderRadius: 9, background: 'var(--success-bg)', color: 'var(--success)', display: 'grid', placeItems: 'center' }}><Icon name="shield" /></div>
                    <div><div style={{ fontWeight: 600, fontSize: 13 }}>Application TOTP</div><div style={{ fontSize: 12, color: 'var(--text-tertiary)' }}>Activée le 12 avril 2026 · Authy</div></div>
                  </div>
                  <span className="badge badge-success dot">Active</span>
                </div>
              </div>
              <div style={{ borderTop: '1px solid var(--border)', paddingTop: 20, marginTop: 24 }}>
                <h3 style={{ margin: 0, fontSize: 16, fontWeight: 600, marginBottom: 12 }}>Sessions actives</h3>
                {[
                  { d: 'MacBook Pro · Safari', loc: 'Dakar, SN', ip: '196.207.42.128', cur: true },
                  { d: 'iPhone 15 · Safari', loc: 'Dakar, SN', ip: '196.207.42.131', cur: false },
                ].map((s, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: i === 0 ? '1px solid var(--border-subtle)' : 'none' }}>
                    <div><div style={{ fontWeight: 550, fontSize: 13 }}>{s.d} {s.cur && <span className="badge badge-success" style={{ marginLeft: 6 }}>Actuelle</span>}</div><div style={{ fontSize: 11.5, color: 'var(--text-tertiary)' }} className="mono">{s.loc} · {s.ip}</div></div>
                    {!s.cur && <button className="btn btn-ghost btn-sm" style={{ color: 'var(--danger)' }}>Révoquer</button>}
                  </div>
                ))}
              </div>
            </div>
          )}
          {tab === 'preferences' && (
            <div className="card-body" style={{ padding: 24 }}>
              <h3 style={{ margin: 0, fontSize: 16, fontWeight: 600, marginBottom: 16 }}>Apparence & langue</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}><div><div style={{ fontWeight: 550 }}>Thème</div><div style={{ fontSize: 12, color: 'var(--text-tertiary)' }}>Clair, sombre ou auto.</div></div>
                  <div style={{ display: 'flex', gap: 4, background: 'var(--bg-surface-2)', borderRadius: 8, padding: 3, border: '1px solid var(--border)' }}>
                    {['Clair', 'Sombre', 'Auto'].map((t, i) => <button key={t} style={{ padding: '5px 12px', fontSize: 12, fontWeight: 550, borderRadius: 6, background: i === 0 ? 'var(--bg-surface)' : 'transparent', color: i === 0 ? 'var(--text-primary)' : 'var(--text-tertiary)' }}>{t}</button>)}
                  </div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}><div><div style={{ fontWeight: 550 }}>Langue de l'interface</div><div style={{ fontSize: 12, color: 'var(--text-tertiary)' }}>Français · English (early access)</div></div>
                  <select className="select" style={{ width: 140 }}><option>Français</option><option>English</option></select>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}><div><div style={{ fontWeight: 550 }}>Format de date</div><div style={{ fontSize: 12, color: 'var(--text-tertiary)' }}>Affichage des dates dans l'interface.</div></div>
                  <select className="select" style={{ width: 200 }}><option>JJ/MM/AAAA (français)</option><option>ISO 8601</option><option>MM/DD/YYYY (US)</option></select>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}><div><div style={{ fontWeight: 550 }}>Densité d'affichage</div><div style={{ fontSize: 12, color: 'var(--text-tertiary)' }}>Espace dans les tableaux.</div></div>
                  <select className="select" style={{ width: 140 }}><option>Confortable</option><option>Compacte</option></select>
                </div>
              </div>
            </div>
          )}
          {tab === 'notifications' && (
            <div className="card-body" style={{ padding: 24 }}>
              <h3 style={{ margin: 0, fontSize: 16, fontWeight: 600, marginBottom: 16 }}>Préférences de notification</h3>
              {[
                { l: 'Migration terminée (succès)', e: true, i: true, p: false },
                { l: 'Migration échouée', e: true, i: true, p: true },
                { l: 'Crédits faibles (< 5 000)', e: true, i: true, p: false },
                { l: 'Rétention de fichiers (7j avant suppression)', e: true, i: false, p: false },
                { l: 'Nouveau membre invité', e: false, i: true, p: false },
                { l: 'Mises à jour produit', e: true, i: false, p: false },
              ].map((r, i) => (
                <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 80px 80px 80px', gap: 16, padding: '14px 0', borderBottom: '1px solid var(--border-subtle)', alignItems: 'center' }}>
                  <div style={{ fontSize: 13, fontWeight: 500 }}>{r.l}</div>
                  <div style={{ display: 'flex', justifyContent: 'center' }}><div className={`toggle ${r.e ? 'on' : ''}`}></div></div>
                  <div style={{ display: 'flex', justifyContent: 'center' }}><div className={`toggle ${r.i ? 'on' : ''}`}></div></div>
                  <div style={{ display: 'flex', justifyContent: 'center' }}><div className={`toggle ${r.p ? 'on' : ''}`}></div></div>
                </div>
              ))}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 80px 80px 80px', gap: 16, paddingTop: 12, fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-tertiary)' }}>
                <div></div><div style={{ textAlign: 'center' }}>Email</div><div style={{ textAlign: 'center' }}>In-app</div><div style={{ textAlign: 'center' }}>Push</div>
              </div>
            </div>
          )}
          {tab === 'danger' && (
            <div className="card-body" style={{ padding: 24 }}>
              <h3 style={{ margin: 0, fontSize: 16, fontWeight: 600, marginBottom: 4, color: 'var(--danger)' }}>Zone dangereuse</h3>
              <p style={{ fontSize: 12, color: 'var(--text-tertiary)', marginBottom: 20 }}>Ces actions sont irréversibles.</p>
              <div style={{ border: '1px solid var(--danger-border)', borderRadius: 10, padding: 16, marginBottom: 12 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div><div style={{ fontWeight: 600, fontSize: 13 }}>Exporter toutes mes données</div><div style={{ fontSize: 12, color: 'var(--text-tertiary)' }}>Conformité RGPD · archive ZIP envoyée par email</div></div>
                  <button className="btn btn-secondary"><Icon name="download" /> Exporter</button>
                </div>
              </div>
              <div style={{ border: '1px solid var(--danger-border)', borderRadius: 10, padding: 16, background: 'var(--danger-bg)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div><div style={{ fontWeight: 600, fontSize: 13 }}>Supprimer mon compte</div><div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Suppression définitive sous 30 jours. Crédits non remboursés.</div></div>
                  <button className="btn btn-danger"><Icon name="trash" /> Supprimer</button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { History, MigrationDetail, Templates, Connectors, Credits, Organization, Audit, Webhooks, Settings });
