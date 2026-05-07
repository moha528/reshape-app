// ============================================================
// Dashboard
// ============================================================

function Sparkline({ data, color = 'var(--brand-indigo)', w = 80, h = 32 }) {
  const max = Math.max(...data), min = Math.min(...data);
  const range = max - min || 1;
  const pts = data.map((v, i) => `${(i / (data.length - 1)) * w},${h - ((v - min) / range) * h}`).join(' ');
  return (
    <svg width={w} height={h} className="spark">
      <defs>
        <linearGradient id={`sp-${color.replace(/[^a-z0-9]/gi, '')}`} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor={color} stopOpacity="0.3"/>
          <stop offset="1" stopColor={color} stopOpacity="0"/>
        </linearGradient>
      </defs>
      <polyline fill="none" stroke={color} strokeWidth="1.5" points={pts}/>
      <polygon fill={`url(#sp-${color.replace(/[^a-z0-9]/gi, '')})`} points={`0,${h} ${pts} ${w},${h}`}/>
    </svg>
  );
}

function Dashboard({ navigate }) {
  const stats = [
    { label: 'Migrations ce mois', icon: 'zap', value: 47, unit: '', trend: '+12%', up: true, data: [12, 15, 14, 18, 22, 25, 28, 32, 35, 38, 42, 47] },
    { label: 'Lignes traitées', icon: 'database', value: '2,4', unit: 'M', trend: '+34%', up: true, data: [200, 320, 280, 410, 540, 620, 780, 920, 1100, 1450, 2000, 2400] },
    { label: 'Taux de succès', icon: 'checkCircle', value: '98,2', unit: '%', trend: '+0.4%', up: true, data: [95, 96, 97, 96, 97, 98, 97, 98, 98, 98, 98, 98] },
    { label: 'Crédits consommés', icon: 'coins', value: fmt(34280), unit: '', trend: '−8%', up: false, data: [4200, 3800, 3400, 3600, 3200, 2900, 3100, 2800, 2700, 2600, 2400, 2200] },
  ];

  const running = window.MOCK.MIGRATIONS.filter(m => m.status === 'running');
  const recent = window.MOCK.MIGRATIONS.slice(0, 5);

  return (
    <div className="page-enter">
      <div className="page-header">
        <div>
          <h1 className="page-title">Bienvenue, Aïssatou 👋</h1>
          <p className="page-subtitle">Voici un aperçu de l'activité de votre organisation Sonatel · Production.</p>
        </div>
        <div className="page-header-actions">
          <button className="btn btn-secondary"><Icon name="download" /> Exporter rapport</button>
          <button className="btn btn-primary" onClick={() => navigate('migrations')}><Icon name="plus" /> Nouvelle migration</button>
        </div>
      </div>

      <div className="grid grid-cols-4" style={{ marginBottom: 20 }}>
        {stats.map((s, i) => (
          <div className="stat-card" key={i}>
            <div className="stat-label"><Icon name={s.icon} /> {s.label}</div>
            <div className="stat-value">{s.value}{s.unit && <span className="unit">{s.unit}</span>}</div>
            <div className={`stat-trend ${s.up ? 'up' : 'down'}`}>
              <Icon name={s.up ? 'trendUp' : 'trendDown'} size={12} />
              <span>{s.trend}</span>
              <span style={{ color: 'var(--text-tertiary)', marginLeft: 4 }}>vs. mois dernier</span>
            </div>
            <div className="spark"><Sparkline data={s.data} color={s.up ? '#10b981' : '#ef4444'} /></div>
          </div>
        ))}
      </div>

      <div className="grid" style={{ gridTemplateColumns: '2fr 1fr', gap: 20, marginBottom: 20 }}>
        <div className="card">
          <div className="card-header">
            <div>
              <h3 className="card-title">Volume migré (30 derniers jours)</h3>
              <div className="card-subtitle">Lignes transformées par jour</div>
            </div>
            <div style={{ display: 'flex', gap: 6 }}>
              <span className="chip brand">● Lignes</span>
              <span className="chip">● Erreurs</span>
            </div>
          </div>
          <div className="card-body">
            <VolumeChart />
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <div><h3 className="card-title">Statuts des migrations</h3><div className="card-subtitle">7 derniers jours</div></div>
          </div>
          <div className="card-body">
            <DonutChart />
          </div>
        </div>
      </div>

      {running.length > 0 && (
        <div className="card" style={{ marginBottom: 20, borderColor: 'var(--info-border)' }}>
          <div className="card-header" style={{ background: 'var(--info-bg)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span className="pulse-dot" style={{ background: 'var(--info)' }}></span>
              <div>
                <h3 className="card-title">Migration en cours</h3>
                <div className="card-subtitle">{running.length} migration active</div>
              </div>
            </div>
            <button className="btn btn-secondary btn-sm" onClick={() => navigate('migrations/run')}>
              Voir le détail <Icon name="arrowRight" size={12} />
            </button>
          </div>
          {running.map(m => (
            <div key={m.id} style={{ padding: '14px 20px', display: 'grid', gridTemplateColumns: '1fr 1fr 220px 100px', gap: 20, alignItems: 'center' }}>
              <div>
                <div style={{ fontWeight: 600, fontSize: 13.5 }}>{m.name}</div>
                <div className="mono" style={{ color: 'var(--text-tertiary)' }}>{m.id}</div>
              </div>
              <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
                <ConnectorBadge id={m.sourceConn} /> <span style={{ margin: '0 6px', color: 'var(--text-quaternary)' }}>→</span> <ConnectorBadge id={m.destConn} />
              </div>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11.5, marginBottom: 4 }}>
                  <span>{fmt(m.rows)} / {fmt(m.totalRows)} lignes</span>
                  <span className="mono" style={{ fontWeight: 600 }}>{m.progress}%</span>
                </div>
                <div className="progress"><div className="bar animated" style={{ width: m.progress + '%' }}></div></div>
              </div>
              <div style={{ display: 'flex', gap: 4, justifyContent: 'flex-end' }}>
                <button className="icon-btn" title="Pause"><Icon name="pause" /></button>
                <button className="icon-btn" title="Logs"><Icon name="fileText" /></button>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="grid" style={{ gridTemplateColumns: '2fr 1fr', gap: 20 }}>
        <div className="card">
          <div className="card-header">
            <div><h3 className="card-title">Migrations récentes</h3><div className="card-subtitle">5 dernières activités</div></div>
            <button className="btn btn-ghost btn-sm" onClick={() => navigate('history')}>Tout voir <Icon name="arrowRight" size={12} /></button>
          </div>
          <div className="table-wrap" style={{ borderRadius: 0, border: 'none' }}>
            <table className="table">
              <thead><tr><th>Migration</th><th>Source → Cible</th><th>Lignes</th><th>Statut</th><th>Crédits</th></tr></thead>
              <tbody>
                {recent.map(m => (
                  <tr key={m.id} className="clickable" onClick={() => navigate('history/detail')}>
                    <td>
                      <div style={{ fontWeight: 550 }}>{m.name}</div>
                      <div className="mono" style={{ color: 'var(--text-tertiary)' }}>{m.id} · {relTime(m.startedAt)}</div>
                    </td>
                    <td><ConnectorBadge id={m.sourceConn} /> <span style={{ color: 'var(--text-quaternary)', margin: '0 4px' }}>→</span> <ConnectorBadge id={m.destConn} /></td>
                    <td className="num">{fmt(m.rows)}</td>
                    <td><StatusBadge status={m.status} /></td>
                    <td className="num">{fmt(m.credits)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <div><h3 className="card-title">Activité récente</h3></div>
          </div>
          <ul className="activity-feed">
            {window.MOCK.AUDIT.slice(0, 6).map((a, i) => (
              <li key={i} className="activity-item">
                <div className="avatar sm" style={{ background: 'var(--bg-surface-3)', color: 'var(--text-secondary)' }}>{a.user.split(' ').map(n => n[0]).slice(0,2).join('')}</div>
                <div className="activity-body">
                  <div className="activity-line">
                    <strong>{a.user}</strong> <span>{a.action}</span>
                  </div>
                  <div className="activity-target mono">{a.target}</div>
                </div>
                <div className="activity-time">{relTime(a.at)}</div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

function VolumeChart() {
  const days = 30;
  const data = Array.from({ length: days }, (_, i) => ({
    rows: 30 + Math.sin(i * 0.4) * 20 + Math.random() * 30 + i * 0.5,
    errors: Math.max(0, Math.sin(i * 0.6) * 4 + Math.random() * 3),
  }));
  const maxR = Math.max(...data.map(d => d.rows));
  const W = 700, H = 200, pad = { l: 40, r: 10, t: 10, b: 24 };
  const cw = W - pad.l - pad.r, ch = H - pad.t - pad.b;
  const x = i => pad.l + (i / (days - 1)) * cw;
  const yR = v => pad.t + ch - (v / maxR) * ch;
  const path = data.map((d, i) => `${i === 0 ? 'M' : 'L'} ${x(i)} ${yR(d.rows)}`).join(' ');
  const area = `${path} L ${x(days - 1)} ${pad.t + ch} L ${pad.l} ${pad.t + ch} Z`;

  return (
    <svg width="100%" viewBox={`0 0 ${W} ${H}`} style={{ display: 'block' }}>
      <defs>
        <linearGradient id="vc-grad" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#8b5cf6" stopOpacity="0.25"/>
          <stop offset="1" stopColor="#33dbfd" stopOpacity="0"/>
        </linearGradient>
        <linearGradient id="vc-line" x1="0" x2="1" y1="0" y2="0">
          <stop offset="0" stopColor="#9f67ff"/><stop offset="1" stopColor="#33dbfd"/>
        </linearGradient>
      </defs>
      {[0, 0.25, 0.5, 0.75, 1].map((p, i) => (
        <g key={i}>
          <line x1={pad.l} x2={W - pad.r} y1={pad.t + ch * p} y2={pad.t + ch * p} stroke="var(--border-subtle)" strokeDasharray="2 3"/>
          <text x={pad.l - 8} y={pad.t + ch * p + 3} fontSize="10" textAnchor="end" fill="var(--text-quaternary)">{Math.round(maxR * (1 - p))}k</text>
        </g>
      ))}
      <path d={area} fill="url(#vc-grad)"/>
      <path d={path} fill="none" stroke="url(#vc-line)" strokeWidth="2"/>
      {data.map((d, i) => i % 5 === 0 && (
        <circle key={i} cx={x(i)} cy={yR(d.rows)} r="3" fill="#fff" stroke="#6366f1" strokeWidth="1.5"/>
      ))}
      {data.map((d, i) => (
        <rect key={`e-${i}`} x={x(i) - 2} y={pad.t + ch - d.errors * 3} width="4" height={d.errors * 3} fill="#ef4444" opacity="0.5" rx="1"/>
      ))}
      {[0, 7, 14, 21, 28].map(i => (
        <text key={i} x={x(i)} y={H - 4} fontSize="10" textAnchor="middle" fill="var(--text-quaternary)">J-{29 - i}</text>
      ))}
    </svg>
  );
}

function DonutChart() {
  const segs = [
    { label: 'Réussies', value: 38, color: '#10b981' },
    { label: 'En cours', value: 3, color: '#6366f1' },
    { label: 'Échouées', value: 4, color: '#ef4444' },
    { label: 'Annulées', value: 2, color: '#94a3b8' },
  ];
  const total = segs.reduce((s, x) => s + x.value, 0);
  const r = 56, cx = 80, cy = 80, sw = 14;
  let acc = 0;
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
      <svg width="160" height="160" style={{ flexShrink: 0 }}>
        {segs.map((s, i) => {
          const frac = s.value / total;
          const sa = acc * 2 * Math.PI - Math.PI / 2;
          acc += frac;
          const ea = acc * 2 * Math.PI - Math.PI / 2;
          const x1 = cx + r * Math.cos(sa), y1 = cy + r * Math.sin(sa);
          const x2 = cx + r * Math.cos(ea), y2 = cy + r * Math.sin(ea);
          const large = frac > 0.5 ? 1 : 0;
          return <path key={i} d={`M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2} Z`} fill={s.color}/>;
        })}
        <circle cx={cx} cy={cy} r={r - sw} fill="var(--bg-surface)"/>
        <text x={cx} y={cy - 4} fontSize="22" fontWeight="600" textAnchor="middle" fill="var(--text-primary)" fontFamily="var(--font-display)">{total}</text>
        <text x={cx} y={cy + 14} fontSize="10" textAnchor="middle" fill="var(--text-tertiary)">migrations</text>
      </svg>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, flex: 1 }}>
        {segs.map((s, i) => (
          <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 12.5 }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
              <span style={{ width: 8, height: 8, borderRadius: 2, background: s.color }}></span>
              {s.label}
            </span>
            <span style={{ fontWeight: 600 }} className="num">{s.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function ConnectorBadge({ id }) {
  const c = window.MOCK.CONNECTORS.find(x => x.id === id);
  if (!c) return null;
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 12 }}>
      <span style={{ width: 18, height: 18, borderRadius: 4, background: c.color, color: '#fff', display: 'inline-grid', placeItems: 'center', fontSize: 9, fontWeight: 700, fontFamily: 'var(--font-mono)' }}>{c.initials}</span>
      <span>{c.name}</span>
    </span>
  );
}

function StatusBadge({ status }) {
  const map = {
    running: { cls: 'badge-info', label: 'En cours', dot: true },
    success: { cls: 'badge-success', label: 'Réussie', dot: true },
    failed: { cls: 'badge-danger', label: 'Échouée', dot: true },
    cancelled: { cls: 'badge-neutral', label: 'Annulée', dot: false },
    pending: { cls: 'badge-warning', label: 'En attente', dot: true },
  };
  const m = map[status] || map.pending;
  return <span className={`badge ${m.cls} ${m.dot ? 'dot' : ''}`}>{m.label}</span>;
}

window.Dashboard = Dashboard;
window.ConnectorBadge = ConnectorBadge;
window.StatusBadge = StatusBadge;
