// ============================================================
// Mock data — realistic, West African / Senegalese context
// ============================================================

const COMPANIES = [
  'Sonatel', 'CBAO Sénégal', 'Patisen', 'SAGAM Industries',
  'Atlantique Telecom', 'SENELEC', 'SUNEOR', 'NSIA Assurances',
  'Total Énergies Sénégal', 'Eiffage Construction Dakar',
  'Sococim Industries', 'Air Sénégal', 'BICIS', 'Wari',
  'Nestlé Sénégal', 'BTP Africa', 'Dakar Logistics SA'
];

const USERS = [
  { name: 'Aïssatou Diop', email: 'a.diop@sonatel.sn', role: 'Admin', initials: 'AD' },
  { name: 'Moussa Ndiaye', email: 'm.ndiaye@sonatel.sn', role: 'Opérateur', initials: 'MN' },
  { name: 'Fatou Ba', email: 'f.ba@sonatel.sn', role: 'Opérateur', initials: 'FB' },
  { name: 'Cheikh Sarr', email: 'c.sarr@sonatel.sn', role: 'Opérateur', initials: 'CS' },
  { name: 'Mariama Fall', email: 'm.fall@sonatel.sn', role: 'Opérateur', initials: 'MF' },
  { name: 'Ibrahima Kane', email: 'i.kane@consultant.sn', role: 'Invité', initials: 'IK' },
];

const CONNECTORS = [
  { id: 'postgres', name: 'PostgreSQL', kind: 'db', color: '#336791', initials: 'Pg' },
  { id: 'mysql', name: 'MySQL', kind: 'db', color: '#00758f', initials: 'My' },
  { id: 'mariadb', name: 'MariaDB', kind: 'db', color: '#003545', initials: 'Ma' },
  { id: 'sqlserver', name: 'SQL Server', kind: 'db', color: '#a91d22', initials: 'SQ' },
  { id: 'mongodb', name: 'MongoDB', kind: 'db', color: '#13aa52', initials: 'Mo' },
  { id: 'csv', name: 'CSV / TSV', kind: 'file', color: '#2563eb', initials: 'cs' },
  { id: 'excel', name: 'Excel', kind: 'file', color: '#107c41', initials: 'Xl' },
  { id: 'zip', name: 'Archive ZIP', kind: 'file', color: '#7c3aed', initials: 'Zp' },
  { id: 'sql', name: 'Dump SQL', kind: 'file', color: '#dc2626', initials: 'Sq' },
];

const MIGRATIONS = [
  { id: 'MIG-2026-0412', name: 'Sage 50 → Odoo ERP', source: 'sage_dakar.sql', sourceConn: 'sql', dest: 'PostgreSQL prod-erp', destConn: 'postgres', status: 'running', progress: 67, rows: 184320, totalRows: 275000, errors: 12, credits: 1840, startedAt: new Date(Date.now() - 2400000), duration: 2400, owner: 'Aïssatou Diop', mode: 'AI' },
  { id: 'MIG-2026-0411', name: 'Migration clientèle CBAO', source: 'PostgreSQL legacy_crm', sourceConn: 'postgres', dest: 'crm_export.xlsx', destConn: 'excel', status: 'success', progress: 100, rows: 89432, totalRows: 89432, errors: 3, credits: 920, startedAt: new Date(Date.now() - 86400000*1), duration: 1820, owner: 'Moussa Ndiaye', mode: 'manual' },
  { id: 'MIG-2026-0410', name: 'BTP Africa — projets historiques', source: 'projets_2018_2024.zip', sourceConn: 'zip', dest: 'PostgreSQL prod-btp', destConn: 'postgres', status: 'success', progress: 100, rows: 234567, totalRows: 234567, errors: 0, credits: 2340, startedAt: new Date(Date.now() - 86400000*2), duration: 4200, owner: 'Fatou Ba', mode: 'AI' },
  { id: 'MIG-2026-0409', name: 'Patisen factures 2023', source: 'factures_2023.csv', sourceConn: 'csv', dest: 'MySQL erp-prod', destConn: 'mysql', status: 'failed', progress: 34, rows: 12300, totalRows: 36000, errors: 1842, credits: 360, startedAt: new Date(Date.now() - 86400000*3), duration: 540, owner: 'Cheikh Sarr', mode: 'manual' },
  { id: 'MIG-2026-0408', name: 'Sonatel CDR octobre', source: 'MariaDB billing-old', sourceConn: 'mariadb', dest: 'MongoDB analytics', destConn: 'mongodb', status: 'success', progress: 100, rows: 1240000, totalRows: 1240000, errors: 47, credits: 8430, startedAt: new Date(Date.now() - 86400000*4), duration: 11200, owner: 'Aïssatou Diop', mode: 'AI' },
  { id: 'MIG-2026-0407', name: 'NSIA — polices d\'assurance', source: 'polices.xlsx', sourceConn: 'excel', dest: 'SQL Server core-ins', destConn: 'sqlserver', status: 'success', progress: 100, rows: 47832, totalRows: 47832, errors: 8, credits: 540, startedAt: new Date(Date.now() - 86400000*5), duration: 980, owner: 'Mariama Fall', mode: 'manual' },
  { id: 'MIG-2026-0406', name: 'SENELEC — abonnés région Dakar', source: 'abonnes_dakar.csv', sourceConn: 'csv', dest: 'PostgreSQL crm', destConn: 'postgres', status: 'success', progress: 100, rows: 312540, totalRows: 312540, errors: 24, credits: 3120, startedAt: new Date(Date.now() - 86400000*6), duration: 5400, owner: 'Moussa Ndiaye', mode: 'AI' },
  { id: 'MIG-2026-0405', name: 'Test mapping fournisseurs', source: 'fournisseurs.csv', sourceConn: 'csv', dest: 'fournisseurs_clean.xlsx', destConn: 'excel', status: 'cancelled', progress: 0, rows: 0, totalRows: 8400, errors: 0, credits: 0, startedAt: new Date(Date.now() - 86400000*7), duration: 0, owner: 'Cheikh Sarr', mode: 'manual' },
  { id: 'MIG-2026-0404', name: 'Sococim production 2022-2023', source: 'PostgreSQL prod-old', sourceConn: 'postgres', dest: 'PostgreSQL prod-new', destConn: 'postgres', status: 'success', progress: 100, rows: 89234, totalRows: 89234, errors: 2, credits: 890, startedAt: new Date(Date.now() - 86400000*9), duration: 2100, owner: 'Fatou Ba', mode: 'manual' },
];

const TEMPLATES = [
  { id: 'TPL-001', name: 'Sage 50 → Odoo ERP', description: 'Mapping standard Sage vers Odoo, comptes & tiers', uses: 12, fields: 47, owner: 'Aïssatou Diop', updatedAt: new Date(Date.now() - 86400000*3) },
  { id: 'TPL-002', name: 'Excel CRM → PostgreSQL', description: 'Import contacts depuis Excel multi-feuilles', uses: 8, fields: 24, owner: 'Moussa Ndiaye', updatedAt: new Date(Date.now() - 86400000*7) },
  { id: 'TPL-003', name: 'MySQL legacy → MongoDB', description: 'Dénormalisation pour analytics', uses: 5, fields: 32, owner: 'Aïssatou Diop', updatedAt: new Date(Date.now() - 86400000*14) },
  { id: 'TPL-004', name: 'CDR Sonatel — billing', description: 'Migration CDR avec ré-indexation FK', uses: 3, fields: 18, owner: 'Cheikh Sarr', updatedAt: new Date(Date.now() - 86400000*22) },
];

// Mock schema (source: legacy CRM)
const SOURCE_SCHEMA = [
  { table: 'clients_old', rows: 89432, cols: [
    { name: 'id_client', type: 'INT', pk: true, sample: '10042' },
    { name: 'nom_complet', type: 'VARCHAR(255)', sample: 'NDIAYE AMINATA' },
    { name: 'tel_mobile', type: 'VARCHAR(20)', sample: '+221 77 432 18 90' },
    { name: 'email_addr', type: 'VARCHAR(120)', sample: 'a.ndiaye@example.sn' },
    { name: 'date_creation', type: 'DATETIME', sample: '12/03/2018 14:32' },
    { name: 'ville', type: 'VARCHAR(80)', sample: 'DAKAR  ' },
    { name: 'segment', type: 'VARCHAR(40)', sample: 'PRO' },
    { name: 'flag_actif', type: 'CHAR(1)', sample: 'O' },
  ]},
  { table: 'commandes_old', rows: 234567, cols: [
    { name: 'id_cmd', type: 'INT', pk: true, sample: 'CMD-00012345' },
    { name: 'fk_client', type: 'INT', fk: 'clients_old.id_client', sample: '10042' },
    { name: 'date_cmd', type: 'DATETIME', sample: '04/05/2026 09:15' },
    { name: 'montant_ht', type: 'DECIMAL(10,2)', sample: '125000.00' },
    { name: 'tva', type: 'DECIMAL(4,2)', sample: '18.00' },
    { name: 'statut', type: 'VARCHAR(20)', sample: 'LIVREE' },
  ]},
  { table: 'produits_old', rows: 4820, cols: [
    { name: 'sku', type: 'VARCHAR(40)', pk: true, sample: 'SKU-DKR-0042' },
    { name: 'libelle', type: 'VARCHAR(200)', sample: 'Ciment Sococim CEM II 50kg' },
    { name: 'prix', type: 'DECIMAL(10,2)', sample: '4500.00' },
    { name: 'categorie', type: 'VARCHAR(60)', sample: 'BTP/Matériaux' },
  ]},
];

const TARGET_SCHEMA = [
  { table: 'res_partner', cols: ['id', 'name', 'phone', 'email', 'create_date', 'city', 'category_id', 'active'] },
  { table: 'sale_order', cols: ['id', 'partner_id', 'date_order', 'amount_untaxed', 'amount_tax', 'state'] },
  { table: 'product_template', cols: ['default_code', 'name', 'list_price', 'categ_id'] },
];

const MAPPING = [
  { src: 'clients_old.id_client', srcType: 'INT', tgt: 'res_partner.id', tgtType: 'integer', confidence: 'high', xform: 'identity' },
  { src: 'clients_old.nom_complet', srcType: 'VARCHAR', tgt: 'res_partner.name', tgtType: 'char', confidence: 'high', xform: 'titlecase' },
  { src: 'clients_old.tel_mobile', srcType: 'VARCHAR', tgt: 'res_partner.phone', tgtType: 'char', confidence: 'high', xform: 'trim' },
  { src: 'clients_old.email_addr', srcType: 'VARCHAR', tgt: 'res_partner.email', tgtType: 'char', confidence: 'high', xform: 'lowercase' },
  { src: 'clients_old.date_creation', srcType: 'DATETIME', tgt: 'res_partner.create_date', tgtType: 'datetime', confidence: 'mid', xform: 'date_dmy_to_iso' },
  { src: 'clients_old.ville', srcType: 'VARCHAR', tgt: 'res_partner.city', tgtType: 'char', confidence: 'high', xform: 'trim+titlecase' },
  { src: 'clients_old.segment', srcType: 'VARCHAR', tgt: 'res_partner.category_id', tgtType: 'many2one', confidence: 'mid', xform: 'lookup' },
  { src: 'clients_old.flag_actif', srcType: 'CHAR(1)', tgt: 'res_partner.active', tgtType: 'boolean', confidence: 'low', xform: 'O→true / N→false' },
];

// Audit trail entries
const AUDIT = [
  { at: new Date(Date.now() - 1200000), user: 'Aïssatou Diop', action: 'Migration lancée', target: 'MIG-2026-0412', meta: 'Sage 50 → Odoo ERP · 1840 crédits' },
  { at: new Date(Date.now() - 3600000), user: 'Moussa Ndiaye', action: 'Template modifié', target: 'TPL-001', meta: 'Ajout transformation date_dmy_to_iso' },
  { at: new Date(Date.now() - 7200000), user: 'Aïssatou Diop', action: 'Pack crédits acheté', target: 'PADDLE-9421', meta: '+10 000 crédits · 249 €' },
  { at: new Date(Date.now() - 86400000), user: 'Fatou Ba', action: 'Membre invité', target: 'i.kane@consultant.sn', meta: 'Rôle Opérateur' },
  { at: new Date(Date.now() - 86400000*2), user: 'Cheikh Sarr', action: 'Connexion DB sauvegardée', target: 'PostgreSQL prod-erp', meta: 'AES-256 chiffrée' },
  { at: new Date(Date.now() - 86400000*3), user: 'Aïssatou Diop', action: 'Rôle modifié', target: 'm.fall@sonatel.sn', meta: 'Opérateur → Admin' },
  { at: new Date(Date.now() - 86400000*4), user: 'Mariama Fall', action: 'Connexion réussie', target: 'OAuth Google', meta: 'IP 196.207.xx.xx' },
];

const NOTIFICATIONS = [
  { id: 1, kind: 'running', title: 'Migration en cours', body: 'Sage 50 → Odoo ERP · 67 % terminé', at: new Date(Date.now() - 600000), unread: true },
  { id: 2, kind: 'success', title: 'Migration terminée', body: 'CBAO clientèle · 89 432 lignes', at: new Date(Date.now() - 86400000), unread: true },
  { id: 3, kind: 'warning', title: 'Crédits faibles', body: 'Solde inférieur à 5 000 crédits', at: new Date(Date.now() - 7200000), unread: true },
  { id: 4, kind: 'failed', title: 'Migration échouée', body: 'Patisen factures · 1842 erreurs', at: new Date(Date.now() - 86400000*3), unread: false },
  { id: 5, kind: 'info', title: 'Rétention', body: '3 fichiers seront supprimés dans 7 jours', at: new Date(Date.now() - 86400000*5), unread: false },
];

window.MOCK = { COMPANIES, USERS, CONNECTORS, MIGRATIONS, TEMPLATES, SOURCE_SCHEMA, TARGET_SCHEMA, MAPPING, AUDIT, NOTIFICATIONS };
