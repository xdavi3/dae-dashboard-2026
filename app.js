/**
 * app.js
 * Funções e constantes compartilhadas — DAE Dashboard 2026
 * Usado por: dashboard.html e formulario.html
 * ATENÇÃO: Carregar APÓS firebase-config.js
 */

/* ============================================
   CONSTANTES COMPARTILHADAS
   ============================================ */

/** Lista única de eixos de atuação (fonte da verdade) */
const EIXOS = [
    'Assistência Estudantil',
    'Alimentação e Nutrição',
    'Gênero e Sexualidades',
    'Educação Especial',
    'ERER',
    'Comissão Qualidade de Vida do Trabalhador',
    'Representante Proen',
    'NEPGENS'
];

/** Mapas de labels amigáveis */
const EIXOS_LABELS = {
    'Comissão Qualidade de Vida do Trabalhador': 'Qualidade de Vida',
    'Representante Proen': 'Representante PROEN'
};

const STATUS_OPTIONS = ['Em andamento', 'Executada', 'Planejada'];
const PRIORIDADE_OPTIONS = ['Alta', 'Média', 'Baixa'];
const PERIODO_OPTIONS = ['1º semestre', '2º semestre'];

/** Chave do localStorage */
const STORAGE_KEY = 'acoes_dae_2026';

/* ============================================
   FIREBASE — FUNÇÕES COMPARTILHADAS
   ============================================ */

/**
 * Salva a lista de ações no Firebase Firestore.
 * @param {Array} acoes - Lista de ações a salvar
 * @returns {Promise<boolean>}
 */
async function salvarDadosFirebase(acoes) {
    try {
        await db.collection('acoes').doc('lista').set({ dados: acoes });
        console.log(`✅ ${acoes.length} ações salvas no Firebase.`);
        return true;
    } catch (error) {
        console.error('❌ Erro ao salvar no Firebase:', error);
        return false;
    }
}

/**
 * Carrega a lista de ações do Firebase Firestore.
 * @returns {Promise<Array|null>} Lista de ações ou null se falhar/vazio
 */
async function carregarDadosFirebase() {
    try {
        const doc = await db.collection('acoes').doc('lista').get();
        if (doc.exists) {
            const data = doc.data();
            if (data && Array.isArray(data.dados)) {
                console.log(`✅ ${data.dados.length} ações carregadas do Firebase.`);
                return data.dados;
            }
        }
        console.log('📭 Nenhum dado encontrado no Firebase.');
        return null;
    } catch (error) {
        console.error('❌ Erro ao carregar do Firebase:', error);
        return null;
    }
}

/* ============================================
   LOCALSTORAGE — FUNÇÕES COMPARTILHADAS
   ============================================ */

/**
 * Salva a lista de ações no localStorage.
 * @param {Array} acoes
 */
function salvarDadosLocal(acoes) {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(acoes));
    } catch (e) {
        console.error('❌ Erro ao salvar localmente:', e);
    }
}

/**
 * Carrega a lista de ações do localStorage.
 * @returns {Array|null}
 */
function carregarDadosLocal() {
    try {
        const dados = localStorage.getItem(STORAGE_KEY);
        if (dados) {
            const parsed = JSON.parse(dados);
            if (Array.isArray(parsed)) {
                console.log(`📦 ${parsed.length} ações carregadas do localStorage.`);
                return parsed;
            }
        }
    } catch (e) {
        console.error('❌ Erro ao carregar do localStorage:', e);
    }
    return null;
}

/**
 * Salva nos dois storages simultaneamente.
 * @param {Array} acoes
 */
function salvarDados(acoes) {
    salvarDadosLocal(acoes);
    salvarDadosFirebase(acoes); // async, não precisa await para não bloquear UI
}

/* ============================================
   TOAST
   ============================================ */

/**
 * Exibe uma notificação toast temporária.
 * @param {string} mensagem
 * @param {'success'|'error'|'info'} tipo
 * @param {number} duracao - ms até sumir (padrão: 3000)
 */
function mostrarToast(mensagem, tipo = 'info', duracao = 3000) {
    let toast = document.getElementById('toast');
    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'toast';
        toast.className = 'toast';
        document.body.appendChild(toast);
    }
    toast.textContent = mensagem;
    toast.className = `toast show ${tipo}`;
    clearTimeout(toast._timeout);
    toast._timeout = setTimeout(() => toast.classList.remove('show'), duracao);
}

/* ============================================
   TEMA
   ============================================ */

/**
 * Alterna entre tema claro e escuro.
 */
function toggleTheme() {
    const current = document.documentElement.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    aplicarTema(next);
    mostrarToast(`${next === 'dark' ? '🌙 Tema escuro' : '☀️ Tema claro'} ativado!`, 'info');
}

/**
 * Aplica um tema e persiste no localStorage.
 * @param {'dark'|'light'} tema
 */
function aplicarTema(tema) {
    document.documentElement.setAttribute('data-theme', tema);
    localStorage.setItem('theme', tema);
}

/**
 * Lê e aplica o tema salvo (chamar no carregamento da página).
 */
function inicializarTema() {
    const saved = localStorage.getItem('theme');
    if (saved) aplicarTema(saved);
}

/* ============================================
   GERAÇÃO DE ID
   ============================================ */

/**
 * Gera um novo ID único sequencial para uma ação.
 * @param {Array} acoes - Lista atual de ações
 * @returns {string} Ex: "DAE-2026-042"
 */
function gerarID(acoes) {
    const nums = acoes.map(a => parseInt(a.id?.replace('DAE-2026-', '')) || 0);
    const max = nums.length > 0 ? Math.max(...nums) : 0;
    return 'DAE-2026-' + String(max + 1).padStart(3, '0');
}

/* ============================================
   DETECÇÃO AUTOMÁTICA
   ============================================ */

/**
 * Tenta detectar o cargo a partir do nome do responsável.
 * @param {string} nome
 * @returns {string}
 */
function detectarCargo(nome) {
    const n = nome.toLowerCase();
    if (n.includes('nutricionista')) return 'Nutricionista';
    if (n.includes('psicólogo') || n.includes('psicóloga')) return 'Psicólogo(a)';
    if (n.includes('pedagogo') || n.includes('pedagoga')) return 'Pedagogo(a)';
    if (n.includes('assistente social') || n.includes('assistente')) return 'Assistente Social';
    return '';
}

/**
 * Tenta detectar campi mencionados em um texto.
 * @param {string} texto
 * @returns {string} Campi separados por "; "
 */
function detectarCampus(texto) {
    const campi = [
        'Centro-Serrano', 'Viana', 'Barra de São Francisco', 'Cariacica',
        'Serra', 'Vitória', 'Piúma', 'Cachoeiro', 'Colatina', 'Montanha', 'Nova Venécia'
    ];
    const encontrados = campi.filter(c => texto.toLowerCase().includes(c.toLowerCase()));
    return encontrados.join('; ');
}

/* ============================================
   EXPORTAÇÃO CSV
   ============================================ */

/**
 * Exporta uma lista de ações para CSV.
 * @param {Array} dados - Lista filtrada de ações
 */
function exportarCSV(dados) {
    if (!dados || dados.length === 0) {
        mostrarToast('⚠️ Nenhum dado para exportar!', 'error');
        return;
    }
    const headers = ['ID', 'Período', 'Status', 'Eixo', 'Ação', 'Responsável', 'Cargo', 'Prioridade', 'Descrição', 'Campus'];
    const rows = dados.map(a => [
        a.id || '', a.periodo || '', a.status || '', a.eixo || '',
        `"${(a.acao || '').replace(/"/g, '""')}"`,
        a.responsavel || '', a.cargo || '', a.prioridade || '',
        `"${(a.descricao || '').replace(/"/g, '""')}"`,
        a.campus || ''
    ]);
    const csv = [headers.join(';'), ...rows.map(r => r.join(';'))].join('\n');
    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `acoes_dae_${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(link.href);
    mostrarToast('✅ CSV exportado com sucesso!', 'success');
}

/* ============================================
   PREENCHER SELECT DE EIXOS
   ============================================ */

/**
 * Popula um elemento <select> com os eixos disponíveis.
 * @param {HTMLSelectElement} selectEl
 * @param {string|null} firstOption - Texto e value da primeira opção (ex: "Todos")
 */
function preencherSelectEixos(selectEl, firstOption = null) {
    selectEl.innerHTML = '';
    if (firstOption) {
        const opt = document.createElement('option');
        opt.value = firstOption.toLowerCase();
        opt.textContent = firstOption;
        selectEl.appendChild(opt);
    }
    EIXOS.forEach(eixo => {
        const opt = document.createElement('option');
        opt.value = eixo;
        opt.textContent = EIXOS_LABELS[eixo] || eixo;
        selectEl.appendChild(opt);
    });
}

console.log('📦 app.js carregado!');
