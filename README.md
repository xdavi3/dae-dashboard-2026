# 📊 Sistema DAE 2026 - Dashboard de Ações

## Descrição
Sistema completo para gerenciamento de ações da Diretoria de Assuntos Estudantis (DAE) do Ifes, desenvolvido para funcionar diretamente no navegador.

## Funcionalidades
- ✅ **Dashboard interativo** com gráficos e filtros
- ✅ **Cadastro de ações** via formulário
- ✅ **Edição e exclusão** de ações
- ✅ **Filtros** por eixo, status, responsável e prioridade
- ✅ **Exportação** para CSV
- ✅ **Tema claro/escuro**
- ✅ **Armazenamento local** (localStorage)
- ✅ **Transformação automática** de planilhas Excel

## Arquivos
| Arquivo | Descrição |
|---------|-----------|
| `dashboard.html` | Dashboard principal com gráficos e tabela |
| `formulario.html` | Formulário para cadastro e edição |
| `transformar_planilha.py` | Script Python para transformar Excel |

## Como Usar

### 1. Abrir o Dashboard
- Abra `dashboard.html` no navegador

### 2. Cadastrar Ação
- Clique em **"+ Nova Ação"**
- Preencha o formulário
- Clique em **"Salvar Ação"**

### 3. Editar Ação
- Clique em **✏️** na tabela
- Altere os dados
- Clique em **"Salvar"**

### 4. Excluir Ação
- Clique em **🗑️** na tabela
- Confirme a exclusão

### 5. Filtrar Dados
- Use os filtros no topo do dashboard
- Clique nos cards para filtrar rapidamente

### 6. Exportar
- Clique em **"CSV"** no dashboard

### 7. Transformar Excel
- Coloque a planilha na mesma pasta
- Execute: `python transformar_planilha.py`

## Personalização
- **Cores**: Modifique as variáveis CSS no início do arquivo
- **Campos**: Adicione novos campos no formulário e na tabela

## Tecnologias
- HTML5 + CSS3 (vanilla)
- JavaScript (ES6)
- Chart.js (gráficos)
- localStorage (armazenamento)
- Python + Pandas (transformação)

## Autor
Desenvolvido para a Diretoria de Assuntos Estudantis (DAE) - Ifes