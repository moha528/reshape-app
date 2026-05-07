import React from 'react';
import { AuthScreen } from './auth.jsx';
import { Sidebar, Topbar, CommandPalette, NotifPanel } from './shell.jsx';
import { Dashboard } from './dashboard.jsx';
import { MigrationWizard } from './wizard.jsx';
import { ExecutionMonitor } from './execution.jsx';
import { History, MigrationDetail, Templates, Connectors, Credits, Organization, Audit, Webhooks, Settings } from './pages.jsx';
import { useTweaks, TweaksPanel, TweakSection, TweakRadio, TweakButton } from './tweaks-panel.jsx';

const TWEAKS_DEFAULTS = {
  theme: 'light',
  lang: 'en',
  accent: 'indigo',
  density: 'comfortable',
};

export function App() {
  const [authed, setAuthed] = React.useState(true);
  const [route, setRoute] = React.useState('dashboard');
  const [notifsOpen, setNotifsOpen] = React.useState(false);
  const [paletteOpen, setPaletteOpen] = React.useState(false);
  const [sbHidden, setSbHidden] = React.useState(false);
  const [t, setTweak] = useTweaks(TWEAKS_DEFAULTS);

  React.useEffect(() => {
    const check = () => { if (window.innerWidth < 1025) setSbHidden(true); };
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  React.useEffect(() => {
    document.documentElement.dataset.theme = t.theme;
    document.documentElement.dataset.accent = t.accent;
    document.documentElement.dataset.density = t.density;
  }, [t.theme, t.accent, t.density]);

  React.useEffect(() => {
    const h = (e) => setRoute(e.detail);
    window.addEventListener('reshape-nav', h);
    return () => window.removeEventListener('reshape-nav', h);
  }, []);

  React.useEffect(() => {
    const onKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setPaletteOpen(o => !o);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  if (!authed) {
    return <AuthScreen onLogin={() => setAuthed(true)} />;
  }

  let page;
  if (route === 'dashboard') page = <Dashboard navigate={setRoute} />;
  else if (route === 'migrations') page = <MigrationWizard navigate={setRoute} />;
  else if (route === 'migrations/run') page = <ExecutionMonitor navigate={setRoute} />;
  else if (route === 'history') page = <History navigate={setRoute} />;
  else if (route === 'history/detail') page = <MigrationDetail navigate={setRoute} />;
  else if (route === 'templates') page = <Templates navigate={setRoute} />;
  else if (route === 'connectors') page = <Connectors navigate={setRoute} />;
  else if (route === 'credits') page = <Credits navigate={setRoute} />;
  else if (route === 'organization') page = <Organization navigate={setRoute} />;
  else if (route === 'audit') page = <Audit navigate={setRoute} />;
  else if (route === 'webhooks') page = <Webhooks navigate={setRoute} />;
  else if (route === 'settings') page = <Settings navigate={setRoute} />;
  else page = <Dashboard navigate={setRoute} />;

  return (
    <div className={`app-root ${sbHidden ? 'sb-hidden' : ''}`}>
      <div className="sb-backdrop" onClick={() => setSbHidden(true)} />
      <Sidebar current={route} navigate={setRoute} credits={34280} onAuthLogout={() => setAuthed(false)} />
      <div className="app-main">
        <Topbar
          current={route}
          navigate={setRoute}
          theme={t.theme}
          setTheme={v => setTweak('theme', v)}
          lang={t.lang}
          setLang={v => setTweak('lang', v)}
          onOpenNotifs={() => setNotifsOpen(true)}
          onOpenPalette={() => setPaletteOpen(true)}
          sbHidden={sbHidden}
          onToggleSb={() => setSbHidden(v => !v)}
        />
        <NotifPanel open={notifsOpen} onClose={() => setNotifsOpen(false)} />
        <CommandPalette open={paletteOpen} onClose={() => setPaletteOpen(false)} navigate={setRoute} setTheme={v => setTweak('theme', v)} theme={t.theme} />
        <main className="app-content">{page}</main>
      </div>

      <TweaksPanel title="Tweaks">
        <TweakSection title="Apparence">
          <TweakRadio label="Thème" value={t.theme} onChange={v => setTweak('theme', v)} options={[{value:'light',label:'Clair'},{value:'dark',label:'Sombre'}]} />
          <TweakRadio label="Langue" value={t.lang} onChange={v => setTweak('lang', v)} options={[{value:'fr',label:'FR'},{value:'en',label:'EN'}]} />
          <TweakRadio label="Densité" value={t.density} onChange={v => setTweak('density', v)} options={[{value:'comfortable',label:'Confort'},{value:'compact',label:'Compact'}]} />
        </TweakSection>
        <TweakSection title="Navigation">
          <TweakButton label="Voir auth" onClick={() => setAuthed(false)} />
          <TweakButton label="Migration en cours" onClick={() => setRoute('migrations/run')} />
          <TweakButton label="Wizard" onClick={() => setRoute('migrations')} />
        </TweakSection>
      </TweaksPanel>
    </div>
  );
}
