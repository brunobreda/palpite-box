import { GoogleSpreadsheet } from 'google-spreadsheet'

const doc = new GoogleSpreadsheet(process.env.SHEET_DOC_ID)

const fromBase64 = value => {
  const buff = Buffer.from(value, 'base64');
  return buff.toString('ascii')
}

export default async (req, res) => {
  try {
    //await doc.useServiceAccountAuth(credentials)//dado que eu tenho a planilha do doc, ele autentica com o creddentials importado no inicio desse arquivo js
    await doc.useServiceAccountAuth({
      client_email: process.env.SHEET_CLIENT_EMAIL,
      private_key: fromBase64(process.env.SHEET_PRIVATE_KEY)
    })
    await doc.loadInfo()

    const sheet = doc.sheetsByIndex[2]//index em vetor começa do 0
    await sheet.loadCells('A1:B2')//CARREGANDO UM INTERVALO DE CELULAS LIMITADO / RANGE

    const mostrarPromocaoCell = sheet.getCell(1, 0) //pega linha 1 coluna 0
    const textoCell = sheet.getCell(1, 1) //pega linha 1 coluna 1


    res.end(JSON.stringify({ //objeto
      showCoupon: mostrarPromocaoCell.value === 'VERDADEIRO',
      message: textoCell.value
    }))
  } catch (err) {
    res.end(JSON.stringify({ //objeto
      showCoupon: mostrarPromocaoCell.value === 'FALSE',
      message: ''
    }))
  }
}