import { GoogleSpreadsheet } from 'google-spreadsheet'
import moment from 'moment'
import { fromBase64 } from '../../utils/base64'

const doc = new GoogleSpreadsheet(process.env.SHEET_DOC_ID)


const genCupom = () => {
  const code = parseInt(moment().format('YYMMDDHHmmssSSS')).toString(16).toUpperCase() //teste
  return code.substr(0, 4) + '-' + code.substr(4, 4) + '-' + code.substr(8, 4) //altera par ao formato 1234-1234-1234
}

export default async (req, res) => {

  try {
    await doc.useServiceAccountAuth({
      client_email: process.env.SHEET_CLIENT_EMAIL,
      private_key: fromBase64(process.env.SHEET_PRIVATE_KEY)
    })//dado que eu tenho a planilha do doc, ele autentica com o creddentials importado no inicio desse arquivo js
    await doc.loadInfo()
    const sheet = doc.sheetsByIndex[1]
    const data = JSON.parse(req.body)

    const sheetConfig = doc.sheetsByIndex[2]//index em vetor começa do 0
    await sheetConfig.loadCells('A1:B2')//CARREGANDO UM INTERVALO DE CELULAS LIMITADO / RANGE

    const mostrarPromocaoCell = sheetConfig.getCell(1, 0) //pega linha 1 coluna 0
    const textoCell = sheetConfig.getCell(1, 1) //pega linha 1 coluna 1

    let Cupom = ''
    let Promo = ''

    if (mostrarPromocaoCell.value === 'VERDADEIRO') {
      Cupom = genCupom()
      Promo = textoCell.value
    }

    //Nome	Email	Whatsapp	Cupom	Promo
    await sheet.addRow({ //possivel usar como objeto
      Nome: data.Nome,
      Email: data.Email,
      Whatsapp: data.Whatsapp,
      Nota: parseInt(data.Nota),
      'Data Preenchimento': moment().format('DD/MM/YYYY HH:mm:ss'), //quando for o caso de haver um espaçamento é possível definir como string usando as pas e : fora das aspas
      Cupom,
      Promo
    })
    res.end(JSON.stringify({
      showCupom: Cupom !== '',
      Cupom,
      Promo
    }))
  } catch (err) {
    console.log(err)
    res.end('error')
  }
}