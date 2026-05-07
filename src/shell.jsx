import React from 'react';
import { Icon, LogoMark, relTime } from './icons.jsx';
import { MOCK } from './data.js';

const NAV_ITEMS = [
  { group: 'Pilotage', items: [
    { id: 'dashboard', label: 'Tableau de bord', icon: 'dashboard', kbd: 'D' },
    { id: 'migrations', label: 'Migrations', icon: 'zap', badge: '3', kbd: 'M' },
    { id: 'history', label: 'Historique', icon: 'history', kbd: 'H' },
    { id: 'templates', label: 'Templates', icon: 'bookmark', kbd: 'T' },
  ]},
  { group: 'Configuration', items: [
    { id: 'connectors', label: 'Connecteurs', icon: 'database' },
    { id: 'credits', label: 'Crédits', icon: 'coins' },
    { id: 'organization', label: 'Organisation', icon: 'users' },
  ]},
  { group: 'Système', items: [
    { id: 'audit', label: 'Audit', icon: 'shield' },
    { id: 'webhooks', label: 'Webhooks & API', icon: 'webhook' },
    { id: 'settings', label: 'Paramètres', icon: 'settings' },
  ]},
];

const flatNav = NAV_ITEMS.flatMap(g => g.items);

export function Sidebar({ current, navigate, credits, onAuthLogout }) {
  return (
    <aside className="sb">
      <div className="sb-brand" onClick={() => navigate('dashboard')}>
        <LogoMark size={24} />
        <div>
          <div className="sb-brand-name">Reshape</div>
          <div className="sb-brand-org">Sonatel · Production</div>
        </div>
        <Icon name="chevronDown" size={14} className="sb-brand-chev" />
      </div>

      <div className="sb-nav">
        {NAV_ITEMS.map(g => (
          <div key={g.group} className="sb-group">
            <div className="sb-section">{g.group}</div>
            {g.items.map(it => (
              <button key={it.id}
                className={`sb-item ${current === it.id ? 'active' : ''}`}
                onClick={() => navigate(it.id)}>
                <Icon name={it.icon} size={15} />
                <span>{it.label}</span>
                {it.badge && <span className="sb-badge">{it.badge}</span>}
              </button>
            ))}
          </div>
        ))}
      </div>

      <div className="sb-foot">
        <button className="sb-credits" onClick={() => navigate('credits')}>
          <div className="sb-credits-head">
            <span>Crédits</span>
            <span className="sb-credits-val">34 280</span>
          </div>
          <div className="sb-credits-bar"><div style={{ width: '34%' }}></div></div>
          <div className="sb-credits-cta">
            <Icon name="plus" size={11} /> Recharger
          </div>
        </button>
        <button className="sb-user" onClick={onAuthLogout}>
          <div className="avatar sm">AD</div>
          <div className="sb-user-meta">
            <div>Aïssatou Diop</div>
            <div>a.diop@sonatel.sn</div>
          </div>
          <Icon name="logout" size={13} />
        </button>
      </div>
    </aside>
  );
}

export function Topbar({ current, theme, setTheme, lang, setLang, onOpenPalette, onOpenNotifs, sbHidden, onToggleSb }) {
  return (
    <header className="tb">
      <button className="tb-icon" onClick={onToggleSb} aria-label={sbHidden ? 'Afficher le menu' : 'Masquer le menu'}>
        <Icon name={sbHidden ? 'panelLeft' : 'panelLeftClose'} size={16} />
      </button>
      <div className="tb-divider"></div>
      <button className="tb-search" onClick={onOpenPalette}>
        <Icon name="search" size={14} />
        <span>Rechercher…</span>
        <kbd>⌘K</kbd>
      </button>
      <div className="tb-actions">
        <button className="tb-icon" onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')} aria-label="Thème">
          <Icon name={theme === 'light' ? 'moon' : 'sun'} size={15} />
        </button>
        <button className="tb-icon" onClick={() => setLang(lang === 'fr' ? 'en' : 'fr')} aria-label="Langue">
          <span className="tb-lang">{lang.toUpperCase()}</span>
        </button>
        <button className="tb-icon" onClick={onOpenNotifs} aria-label="Notifications">
          <Icon name="bell" size={15} />
          <span className="tb-icon-dot"></span>
        </button>
      </div>
    </header>
  );
}

export function CommandPalette({ open, onClose, navigate, setTheme, theme }) {
  const [q, setQ] = React.useState('');
  const inputRef = React.useRef(null);
  React.useEffect(() => { if (open) { setQ(''); setTimeout(() => inputRef.current?.focus(), 50); } }, [open]);
  React.useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    if (open) window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);
  if (!open) return null;
  const sections = [
    { title: 'Aller à', items: flatNav.map(n => ({ ...n, kind: 'nav' })) },
    { title: 'Actions', items: [
      { id: 'new-mig', label: 'Nouvelle migration', icon: 'plus', onRun: () => navigate('migrations') },
      { id: 'invite', label: 'Inviter un membre', icon: 'userPlus', onRun: () => navigate('organization') },
      { id: 'buy', label: 'Acheter des crédits', icon: 'coins', onRun: () => navigate('credits') },
      { id: 'theme', label: `Basculer thème ${theme === 'light' ? 'sombre' : 'clair'}`, icon: theme === 'light' ? 'moon' : 'sun', onRun: () => setTheme(theme === 'light' ? 'dark' : 'light') },
    ]},
  ].map(s => ({ ...s, items: s.items.filter(it => !q || it.label.toLowerCase().includes(q.toLowerCase())) })).filter(s => s.items.length > 0);
  const run = (it) => { if (it.kind === 'nav') navigate(it.id); else if (it.onRun) it.onRun(); onClose(); };
  return (
    <div className="palette-backdrop" onClick={onClose}>
      <div className="palette" onClick={e => e.stopPropagation()}>
        <div className="palette-input">
          <Icon name="search" size={16} />
          <input ref={inputRef} value={q} onChange={e => setQ(e.target.value)} placeholder="Tapez pour chercher ou exécuter…" />
          <kbd>esc</kbd>
        </div>
        <div className="palette-results">
          {sections.length === 0 && <div style={{ padding: '32px', textAlign: 'center', color: 'var(--text-tertiary)', fontSize: 13 }}>Aucun résultat</div>}
          {sections.map(s => (
            <div key={s.title} className="palette-section">
              <div className="palette-section-title">{s.title}</div>
              {s.items.map(it => (
                <button key={it.id} className="palette-item" onClick={() => run(it)}>
                  <Icon name={it.icon} size={14} />
                  <span>{it.label}</span>
                </button>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function NotifPanel({ open, onClose }) {
  if (!open) return null;
  const iconFor = (k) => ({ running: 'play', success: 'checkCircle', failed: 'xCircle', warning: 'alertTriangle', info: 'info' })[k] || 'info';
  const colorFor = (k) => ({ running: 'var(--info)', success: 'var(--success)', failed: 'var(--danger)', warning: 'var(--warning)', info: 'var(--text-tertiary)' })[k];
  return (
    <>
      <div onClick={onClose} style={{ position: 'fixed', inset: 0, zIndex: 90 }}></div>
      <div className="notif-panel">
        <div className="notif-head">
          <div><div style={{ fontWeight: 600, fontSize: 13.5 }}>Notifications</div><div style={{ fontSize: 11.5, color: 'var(--text-tertiary)' }}>3 non lues</div></div>
          <button className="btn btn-ghost btn-sm">Tout marquer lu</button>
        </div>
        <div style={{ maxHeight: 420, overflowY: 'auto' }}>
          {MOCK.NOTIFICATIONS.map(n => (
            <div key={n.id} className={`notif-item ${n.unread ? 'unread' : ''}`}>
              <div className="notif-icon" style={{ color: colorFor(n.kind) }}><Icon name={iconFor(n.kind)} size={14} /></div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 550 }}>{n.title}</div>
                <div style={{ fontSize: 12, color: 'var(--text-tertiary)' }}>{n.body}</div>
                <div style={{ fontSize: 11, color: 'var(--text-quaternary)', marginTop: 4 }}>{relTime(n.at)}</div>
              </div>
              {n.unread && <div className="notif-dot"></div>}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
