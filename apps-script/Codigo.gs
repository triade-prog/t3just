/**
 * T3 Just — recebe as respostas da prévia e grava na planilha.
 *
 * Como usar: na planilha "T3 Just – Respostas da prévia", abra
 * Extensões → Apps Script, cole este arquivo e implante como "App da Web"
 * (passo a passo em apps-script/LEIA-ME.md).
 *
 * Cada pessoa que responde ganha um id. Enquanto ela responde, a prévia
 * envia as respostas de novo e a mesma linha é atualizada, sem duplicar.
 */

const ABA = 'Respostas';
const FIXAS = ['id', 'primeiro_envio', 'ultima_atualizacao', 'nome', 'respostas_preenchidas', 'texto_completo'];
const LIMITE_CELULA = 49000; // o Google Sheets aceita até 50.000 caracteres por célula

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try {
    const dados = JSON.parse(e.postData.contents);
    if (!dados || typeof dados.id !== 'string' || !/^[a-z0-9-]{8,64}$/i.test(dados.id)) {
      return resposta({ ok: false, erro: 'id inválido' });
    }
    const aba = obterAba();
    const respostas = dados.respostas || {};

    // garante uma coluna para cada pergunta recebida
    let cabecalho = aba.getRange(1, 1, 1, aba.getLastColumn()).getValues()[0];
    const novas = Object.keys(respostas).filter(k => /^[a-z0-9_]{1,40}$/i.test(k) && cabecalho.indexOf(k) === -1);
    if (novas.length) {
      aba.getRange(1, cabecalho.length + 1, 1, novas.length).setValues([novas]);
      cabecalho = cabecalho.concat(novas);
    }

    // procura a linha desta pessoa pelo id
    const ultima = aba.getLastRow();
    let linha = -1;
    if (ultima > 1) {
      const ids = aba.getRange(2, 1, ultima - 1, 1).getValues();
      for (let i = 0; i < ids.length; i++) if (ids[i][0] === dados.id) { linha = i + 2; break; }
    }
    const agora = new Date();
    let primeiro = agora;
    if (linha > 0) primeiro = aba.getRange(linha, 2).getValue() || agora;
    else linha = ultima + 1;

    const valores = cabecalho.map(col => {
      switch (col) {
        case 'id': return dados.id;
        case 'primeiro_envio': return primeiro;
        case 'ultima_atualizacao': return agora;
        case 'nome': return limpar(dados.nome);
        case 'respostas_preenchidas': return Number(dados.preenchidas) || 0;
        case 'texto_completo': return limpar(dados.texto);
        default: {
          const v = respostas[col];
          return limpar(Array.isArray(v) ? v.join(', ') : v);
        }
      }
    });
    aba.getRange(linha, 1, 1, valores.length).setValues([valores]);
    return resposta({ ok: true, linha: linha });
  } catch (err) {
    return resposta({ ok: false, erro: String(err) });
  } finally {
    lock.releaseLock();
  }
}

function doGet() {
  return resposta({ ok: true, servico: 'T3 Just — respostas da prévia' });
}

function obterAba() {
  const planilha = SpreadsheetApp.getActiveSpreadsheet();
  let aba = planilha.getSheetByName(ABA);
  if (!aba) {
    aba = planilha.getSheets()[0];
    aba.setName(ABA);
  }
  if (aba.getLastColumn() === 0 || aba.getRange(1, 1).getValue() !== 'id') {
    aba.getRange(1, 1, 1, FIXAS.length).setValues([FIXAS]);
  }
  aba.setFrozenRows(1);
  return aba;
}

// evita que um texto seja lido como fórmula pela planilha
function limpar(v) {
  if (v === undefined || v === null) return '';
  let s = String(v).slice(0, LIMITE_CELULA);
  if (/^[=+\-@]/.test(s)) s = "'" + s;
  return s;
}

function resposta(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
