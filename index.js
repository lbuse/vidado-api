'use strict'
import compression from 'compression'
import express from 'express'
import fs from 'fs'
import path from 'path'
import { listen } from 'soap'
import FaturamentoDao from './dao/FaturamentoDao'
import DatabaseHelper from './helpers/DatabaseHelper'
import FaturamentoService from './services/FaturamentoService'
import cors from 'cors'

const app = express()

/**
 * Get port from environment and store in Express.
 */
const port = normalizePort(process.env.PORT || '3000')

app.set('port', port)
// app.use(express.urlencoded({ extended: true }))
app.use(cors())
app.use(compression())
app.use(express.static(path.join(__dirname, 'public')));

let faturamentoService = new FaturamentoService(
    new FaturamentoDao(
        new DatabaseHelper()
    )
)

let myService = {
    ReportService: {
        ReportService_0: {
            get_faturamento_por_dia: function (args) {
                return new Promise((resolve, reject) => {
                    faturamentoService.getFaturamentoPorDia(
                        args.data_inicial,
                        args.data_final,
                        args.lojas
                    )
                        .then(result => resolve({
                            resultado: JSON.stringify(result)
                        }))
                        .catch(e => reject({
                            Fault: {
                                Code: {
                                    Value: e.code,
                                    Subcode: { value: e.message }
                                },
                                Reason: { Text: e.message },
                                statusCode: 500
                            }
                        }))
                });
            },
            get_faturamento_por_mes: function (args) {
                return new Promise((resolve, reject) => {
                    faturamentoService.getFaturamentoPorMes(
                        args.data_inicial,
                        args.data_final,
                        args.lojas
                    )
                        .then(result => resolve({
                            resultado: JSON.stringify(result)
                        }))
                        .catch(e => reject({
                            Fault: {
                                Code: {
                                    Value: e.code,
                                    Subcode: { value: e.message }
                                },
                                Reason: { Text: e.message },
                                statusCode: 500
                            }
                        }))
                });
            },
            get_vendas_por_horario: function (args) {
                return new Promise((resolve, reject) => {
                    faturamentoService.getVendasPorHorario(
                        args.data_inicial,
                        args.data_final,
                        args.lojas
                    )
                        .then(result => resolve({
                            resultado: JSON.stringify(result)
                        }))
                        .catch(e => reject({
                            Fault: {
                                Code: {
                                    Value: e.code,
                                    Subcode: { value: e.message }
                                },
                                Reason: { Text: e.message },
                                statusCode: 500
                            }
                        }))
                });
            },
            get_produto_mais_vendido: function (args) {
                return new Promise((resolve, reject) => {
                    faturamentoService.getProdutoMaisVendido(
                        args.data_inicial,
                        args.data_final,
                        args.lojas
                    )
                        .then(result => resolve({
                            resultado: JSON.stringify(result)
                        }))
                        .catch(e => reject({
                            Fault: {
                                Code: {
                                    Value: e.code,
                                    Subcode: { value: e.message }
                                },
                                Reason: { Text: e.message },
                                statusCode: 500
                            }
                        }))
                });
            },
            // // This is how to receive incoming headers
            // HeadersAwareFunction: function(args, cb, headers) {
            //     return {
            //         name: headers.Token
            //     };
            // },

            // // You can also inspect the original `req`
            // reallyDetailedFunction: function(args, cb, headers, req) {
            //     console.log('SOAP `reallyDetailedFunction` request from ' + req.connection.remoteAddress);
            //     return {
            //         name: headers.Token
            //     };
            // }
        }
    }
};

const xml = fs.readFileSync('public/vidado.wsdl', 'utf8');

app.listen(port, function () {
    //Note: /wsdl route will be handled by soap module
    //and all other routes & middleware will continue to work
    listen(app, '/wsdl', myService, xml, function () {
        console.log('server initialized');
    });
})

/**
 * Normalize a port into a number, string, or false.
 */
function normalizePort(val) {
    const port = parseInt(val, 10)

    if (isNaN(port)) {
        // named pipe
        return val
    }

    if (port >= 0) {
        // port number
        return port
    }

    return false
}

export default app