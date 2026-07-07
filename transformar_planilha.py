import pandas as pd
import re
import os

print("=" * 60)
print("🚀 INICIANDO TRANSFORMAÇÃO DA PLANILHA")
print("=" * 60)

# Verificar arquivos
print("\n📂 Verificando arquivos na pasta...")
arquivos = os.listdir('.')
excel_files = [f for f in arquivos if f.endswith('.xlsx') or f.endswith('.xls')]
print(f"📄 Arquivos Excel encontrados: {excel_files}")

if not excel_files:
    print("❌ Nenhum arquivo Excel encontrado!")
    print("⚠️  Verifique se o arquivo 'Ações DAE 2026.xlsx' está nesta pasta.")
    exit()

# Carregar planilha
nome_arquivo = 'Ações DAE 2026.xlsx'
if nome_arquivo not in excel_files:
    print(f"❌ Arquivo '{nome_arquivo}' não encontrado!")
    print(f"📄 Arquivos disponíveis: {excel_files}")
    nome_arquivo = excel_files[0]
    print(f"📌 Usando: {nome_arquivo}")

print(f"\n📂 Lendo a planilha: {nome_arquivo}")

try:
    df = pd.read_excel(nome_arquivo, header=0)
    print(f"✅ {len(df)} ações carregadas!")
    print(f"\n📋 Colunas encontradas: {list(df.columns)[:5]}...")
except Exception as e:
    print(f"❌ Erro ao ler a planilha: {e}")
    exit()

# Renomear colunas
print("\n🔄 Renomeando colunas...")
colunas_reais = list(df.columns)
novos_nomes = {}
for i, col in enumerate(colunas_reais):
    if i == 0: novos_nomes[col] = 'Período'
    elif i == 1: novos_nomes[col] = 'Status'
    elif i == 2: novos_nomes[col] = 'Eixo'
    elif i == 3: novos_nomes[col] = 'Ação'
    elif i == 4: novos_nomes[col] = 'Responsável'
    elif i == 5: novos_nomes[col] = 'Descrição'
    elif i == 6: novos_nomes[col] = 'Resultados'
    elif i == 7: novos_nomes[col] = 'Riscos'
    elif i == 8: novos_nomes[col] = 'Impacto'
df = df.rename(columns=novos_nomes)
print(f"✅ Colunas renomeadas!")

# Padronizar status
print("\n📌 Padronizando status...")
def padronizar_status(status):
    if not isinstance(status, str): return status
    status = status.lower().strip()
    if 'em andamento' in status or 'em andamemto' in status: return 'Em andamento'
    elif 'executada' in status or 'executado' in status: return 'Executada'
    elif 'planejada' in status: return 'Planejada'
    return status.title()
df['Status'] = df['Status'].apply(padronizar_status)
print(f"✅ Status padronizados!")

# Extrair cargo
print("\n👤 Extraindo cargos...")
def extrair_cargo(responsavel):
    if not isinstance(responsavel, str): return 'Não informado'
    r = responsavel.lower()
    if 'assistente social' in r: return 'Assistente Social'
    elif 'nutricionista' in r: return 'Nutricionista'
    elif 'psicólogo' in r or 'psicóloga' in r: return 'Psicólogo(a)'
    return 'Técnico(a)'
df['Cargo'] = df['Responsável'].apply(extrair_cargo)

# Extrair campus
print("\n🏫 Extraindo campi...")
def extrair_campi(descricao):
    if not isinstance(descricao, str): return 'Reitoria'
    campi = ['Centro-Serrano', 'Viana', 'Barra de São Francisco', 'Cariacica', 'Serra', 'Vitória', 'Piúma', 'Cachoeiro', 'Colatina', 'Montanha', 'Nova Venécia']
    encontrados = [c for c in campi if c.lower() in descricao.lower()]
    return '; '.join(encontrados) if encontrados else 'Reitoria'
df['Campus'] = df['Descrição'].apply(extrair_campi)

# Extrair quantitativo
print("\n🔢 Extraindo quantitativos...")
def extrair_quantitativo(descricao):
    if not isinstance(descricao, str): return 0
    numeros = re.findall(r'\b\d{2,4}\b', descricao)
    if numeros:
        numeros_int = [int(n) for n in numeros if int(n) > 20]
        if numeros_int: return sum(numeros_int)
    return 0
df['Quantitativo'] = df['Descrição'].apply(extrair_quantitativo)

# Adicionar ID
print("\n🆔 Gerando IDs...")
df['ID'] = ['DAE-2026-' + str(i+1).zfill(3) for i in range(len(df))]

# Adicionar datas e prioridade
print("\n📅 Adicionando datas e prioridades...")
def definir_data_inicio(periodo):
    if not isinstance(periodo, str): return '01/02/2026'
    if '1º' in periodo or 'primeiro' in periodo.lower(): return '01/02/2026'
    return '01/08/2026'
df['Data_Início'] = df['Período'].apply(definir_data_inicio)

def definir_data_fim(periodo):
    if not isinstance(periodo, str): return '30/06/2026'
    if '1º' in periodo or 'primeiro' in periodo.lower(): return '30/06/2026'
    return '31/12/2026'
df['Data_Fim'] = df['Período'].apply(definir_data_fim)

def definir_prioridade(eixo):
    if not isinstance(eixo, str): return 'Média'
    if 'Assistência Estudantil' in eixo or 'Alimentação' in eixo: return 'Alta'
    return 'Média'
df['Prioridade'] = df['Eixo'].apply(definir_prioridade)

# Palavras-chave
print("\n🔑 Gerando palavras-chave...")
def gerar_palavras_chave(acao, descricao):
    if not isinstance(acao, str): acao = ''
    if not isinstance(descricao, str): descricao = ''
    texto = (acao + ' ' + descricao).lower()
    palavras = ['edital', 'programa', 'bolsa', 'auxílio', 'permanência', 'alimentação', 'nutrição', 'saúde', 'social', 'acompanhamento', 'avaliação', 'relatório', 'dados', 'sistema', 'validação', 'formação', 'assessoria', 'gestão', 'monitoramento']
    encontradas = [p for p in palavras if p in texto]
    return '; '.join(encontradas[:5]) if encontradas else 'geral'
df['Palavras_Chave'] = df.apply(lambda row: gerar_palavras_chave(row['Ação'], row['Descrição']), axis=1)

# Organizar e salvar
print("\n📊 Organizando colunas...")
colunas_ordenadas = ['ID', 'Período', 'Status', 'Eixo', 'Ação', 'Responsável', 'Cargo', 'Data_Início', 'Data_Fim', 'Prioridade', 'Descrição', 'Quantitativo', 'Resultados', 'Riscos', 'Impacto', 'Campus', 'Palavras_Chave']
colunas_existentes = [c for c in colunas_ordenadas if c in df.columns]
df = df[colunas_existentes]

print(f"\n💾 Salvando planilha melhorada...")
nome_saida = 'Ações_DAE_2026_Melhorada.xlsx'
df.to_excel(nome_saida, index=False)
print(f"✅ Excel salvo: {nome_saida}")

nome_csv = 'Ações_DAE_2026_Melhorada.csv'
df.to_csv(nome_csv, index=False, encoding='utf-8-sig')
print(f"✅ CSV salvo: {nome_csv}")

# Estatísticas
print("\n" + "=" * 60)
print("📊 ESTATÍSTICAS DA PLANILHA")
print("=" * 60)
total = len(df)
executadas = len(df[df['Status'] == 'Executada'])
andamento = len(df[df['Status'] == 'Em andamento'])
prioridade_alta = len(df[df['Prioridade'] == 'Alta'])
print(f"\n📋 Total de ações: {total}")
print(f"✅ Executadas: {executadas} ({executadas/total*100:.1f}%)")
print(f"⏳ Em andamento: {andamento} ({andamento/total*100:.1f}%)")
print(f"⭐ Prioridade Alta: {prioridade_alta} ({prioridade_alta/total*100:.1f}%)")
print("\n" + "=" * 60)
print("🎉 TRANSFORMAÇÃO CONCLUÍDA COM SUCESSO!")
print("=" * 60)