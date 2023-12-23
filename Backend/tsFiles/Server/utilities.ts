export function generateRandomString(n) {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < n; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}

export function substitute(
  nome: string,
  cognome: string,
  text: string,
  link: string,
  linkSito: string
) {
  return `<!DOCTYPE html>
  <html lang="it">
  <head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    <title>Email Transazionale</title>
    <style media="all" type="text/css">
      /* Stili globali */
      body {
        font-family: Arial, sans-serif;
        font-size: 16px;
        line-height: 1.6;
        background-color: #f4f5f6;
        margin: 0;
        padding: 0;
      }
  
      /* ... (rimuovi gli altri stili globali per la semplicità) ... */
  
      /* Stili per dispositivi mobili */
      @media only screen and (max-width: 640px) {
        /* ... (rimuovi i tuoi stili per dispositivi mobili per la semplicità) ... */
      }
  
      /* Preserva questi stili nell'header */
      @media all {
        .ExternalClass {
          width: 100%;
        }
        .ExternalClass,
        .ExternalClass p,
        .ExternalClass span,
        .ExternalClass font,
        .ExternalClass td,
        .ExternalClass div {
          line-height: 100%;
        }
        .apple-link a {
          color: inherit !important;
          font-family: inherit !important;
          font-size: inherit !important;
          font-weight: inherit !important;
          line-height: inherit !important;
          text-decoration: none !important;
        }
        #MessageViewBody a {
          color: inherit;
          text-decoration: none;
          font-size: inherit;
          font-family: inherit;
          font-weight: inherit;
          line-height: inherit;
        }
      }
    </style>
  </head>
  <body>
    <table role="presentation" border="0" cellpadding="0" cellspacing="0" class="body">
      <tr>
        <td>&nbsp;</td>
        <td class="container">
          <div class="content">
            <!-- INIZIO CONTENITORE BIANCO CENTRATO -->
            <table role="presentation" border="0" cellpadding="0" cellspacing="0" class="main">
              <!-- INIZIO AREA CONTENUTO PRINCIPALE -->
              <tr>
                <td class="wrapper">
                  <h2>Salve ${nome} ${cognome},</h2>
                  <p>${text}</p>
                  <table role="presentation" border="0" cellpadding="0" cellspacing="0" class="btn btn-primary">
                    <tbody>
                      <tr>
                        <td align="left">
                          <table role="presentation" border="0" cellpadding="0" cellspacing="0">
                            <tbody>
                              <tr>
                                <td> <a href="${link}" target="_blank">Vai!</a> </td>
                              </tr>
                            </tbody>
                          </table>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                  <p>La tua opinione è fondamentale per noi e non vediamo l'ora di ricevere i tuoi commenti!</p>
                  <p>Questa e-mail è stata generata automaticamente da Weeklylist. Se hai domande o hai bisogno di ulteriori informazioni, non esitare a contattarci.</p>
                </td>
              </tr>
              <!-- FINE AREA CONTENUTO PRINCIPALE -->
            </table>
            <!-- INIZIO PIE' DI PAGINA -->
            <div class="footer">
              <table role="presentation" border="0" cellpadding="0" cellspacing="0">
                <tr>
                  <td class="content-block">
                    <span class="apple-link">WeeklyList, Pagano Matteo Inc.</span>
                    <br>
                    Nota Bene: Se preferisci non ricevere ulteriori comunicazioni da Weeklylist, puoi modificare le tue preferenze di iscrizione accedendo alle impostazioni del tuo account sul nostro sito web.
                  </td>
                </tr>
                <tr>
                  <td class="content-block powered-by">
                  Cordiali saluti, Il Team di Weeklylist
                  </td>
                </tr>
              </table>
              <br>
            </div>
            <!-- FINE PIE' DI PAGINA -->
            <!-- FINE CONTENITORE BIANCO CENTRATO -->
          </div>
        </td>
        <td>&nbsp;</td>
      </tr>
    </table>
  </body>
  </html>
  
`;
}
