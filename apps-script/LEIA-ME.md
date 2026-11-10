# Envio automático das respostas para a planilha

A prévia publicada no GitHub Pages envia as respostas sozinha para a planilha **"T3 Just – Respostas da prévia"** no Google Drive da Carol. Não usa banco de dados: o script do Google recebe as respostas e escreve uma linha por pessoa.

- Cada pessoa que responde vira **uma linha**. Enquanto ela responde, a mesma linha é atualizada (cerca de 2 segundos depois de cada mudança).
- Cada pergunta tem a sua coluna. A coluna `texto_completo` traz tudo em texto corrido.
- As respostas também continuam salvas no navegador de quem responde.

## Ativar (uma vez, cerca de 5 minutos)

### 1. Colocar o script na planilha
1. Abra a planilha [T3 Just – Respostas da prévia](https://docs.google.com/spreadsheets/d/1Vrf3UX7dNDJl13Vk3oh_il_i7wmErq9SXe_uawgHBd4/edit).
2. Menu **Extensões → Apps Script**.
3. Apague o que estiver no editor e cole todo o conteúdo de [`Codigo.gs`](Codigo.gs).
4. Clique no ícone de disquete (**Salvar**).

### 2. Implantar como App da Web
1. Botão azul **Implantar → Nova implantação**.
2. Na engrenagem ao lado de "Selecione o tipo", escolha **App da Web**.
3. Preencha:
   - **Executar como:** Eu (sua conta)
   - **Quem pode acessar:** Qualquer pessoa
4. Clique em **Implantar** e autorize com a sua conta Google. Se aparecer "O Google não verificou este app", clique em **Avançado → Acessar (não seguro)**. O script é seu e só escreve nesta planilha.
5. Copie a **URL do app da Web** (termina em `/exec`).

### 3. Ligar a prévia ao script
Envie a URL para o Claude no projeto, ou edite `prototipo/index.html` e preencha a linha:

```js
const ENDPOINT = "";
```

com a URL entre as aspas.

### 4. Publicar a página no GitHub Pages
No GitHub: **Settings → Pages → Build and deployment → Source: Deploy from a branch → Branch: `main` / `(root)` → Save**.

Depois de 1 a 2 minutos a prévia fica em:
**https://triade-prog.github.io/t3just/prototipo/**

## Como saber se está funcionando
No topo da prévia aparece "Enviado para a Carol às hh:mm" depois que alguém responde. A linha correspondente aparece na planilha.

## Se mudar o script depois
Use **Implantar → Gerenciar implantações → editar (lápis) → Versão: Nova versão**. Assim a URL continua a mesma.

## Observações
- Quem tem o link do script consegue enviar dados para a planilha. Não publique a URL fora da prévia.
- O envio automático só funciona na versão do GitHub Pages. A versão publicada no Claude não consegue falar com o Google.
