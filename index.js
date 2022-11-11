'use strict'
import compression from 'compression'
import cors from 'cors'
import express from 'express'
import fs from 'fs'
import path from 'path'
import { listen } from 'soap'
import ReportsDao from './dao/ReportsDao'
import GroupsDao from './dao/GroupsDao'
import StoresDao from './dao/StoresDao'
import ProductsDao from './dao/ProductsDao'
import DatabaseHelper from './helpers/DatabaseHelper'
import ReportsService from './services/ReportsService'
import GroupsService from './services/GroupsService'
import StoresService from './services/StoresService'
import ProductsService from './services/ProductsService'

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

const databaseHelper = new DatabaseHelper()

let vidadoService = {
    ReportService: {
        ReportService_0: {
            get_lojas: function (args) {
                return new Promise((resolve, reject) => {
                    new StoresService(new StoresDao(databaseHelper))
                        .getLojas(args.ids)
                        .then(result => {
                            resolve({
                                resultado: JSON.stringify(result)
                            })
                        }).catch(e => {
                            reject({
                                Fault: {
                                    Code: {
                                        Value: e.code,
                                        Subcode: { value: e.message }
                                    },
                                    Reason: { Text: e.message },
                                    statusCode: e.code
                                }
                            })
                        })
                })
            },
            get_grupos: function (args) {
                return new Promise((resolve, reject) => {
                    new GroupsService(new GroupsDao(databaseHelper))
                        .getGrupos(args.ids)
                        .then(result => {
                            resolve({
                                resultado: JSON.stringify(result)
                            })
                        }).catch(e => {
                            reject({
                                Fault: {
                                    Code: {
                                        Value: e.code,
                                        Subcode: { value: e.message }
                                    },
                                    Reason: { Text: e.message },
                                    statusCode: e.code
                                }
                            })
                        })
                })
            },
            get_produtos: function(args) {
                return new Promise((resolve, reject) => {
                    new ProductsService(new ProductsDao(databaseHelper))
                        .getAll(args.ids)
                        .then(result => {
                            resolve({
                                resultado: JSON.stringify(result)
                            })
                        }).catch(e => {
                            reject({
                                Fault: {
                                    Code: {
                                        Value: e.code,
                                        Subcode: { value: e.message }
                                    },
                                    Reason: { Text: e.message },
                                    statusCode: e.code
                                }
                            })
                        })
                })
            },
            get_produtos_por_termo: function(args) {
                return new Promise((resolve, reject) => {
                    new ProductsService(new ProductsDao(databaseHelper))
                        .getByName(args.termo)
                        .then(result => {
                            resolve({
                                resultado: JSON.stringify(result)
                            })
                        }).catch(e => {
                            reject({
                                Fault: {
                                    Code: {
                                        Value: e.code,
                                        Subcode: { value: e.message }
                                    },
                                    Reason: { Text: e.message },
                                    statusCode: e.code
                                }
                            })
                        })
                })
            },
            get_faturamento_por_dia: function (args) {
                return new Promise((resolve, reject) => {
                    new ReportsService(new ReportsDao(databaseHelper))
                        .getFaturamentoPorDia(
                            args.data_inicial,
                            args.data_final,
                            args.lojas
                        )
                        .then(result => {
                            resolve({
                                resultado: JSON.stringify(result)
                            })
                        })
                        .catch(e => reject({
                            Fault: {
                                Code: {
                                    Value: e.code,
                                    Subcode: { value: e.message }
                                },
                                Reason: { Text: e.message },
                                statusCode: e.code
                            }
                        }))
                });
            },
            get_faturamento_por_mes: function (args) {
                return new Promise((resolve, reject) => {
                    new ReportsService(new ReportsDao(databaseHelper))
                        .getFaturamentoPorMes(
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
                                statusCode: e.code
                            }
                        }))
                });
            },
            get_vendas_por_horario: function (args) {
                return new Promise((resolve, reject) => {
                    new ReportsService(new ReportsDao(databaseHelper))
                        .getVendasPorHorario(
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
                                statusCode: e.code
                            }
                        }))
                });
            },
            get_mais_vendidos_por_grupo: function (args) {
                return new Promise((resolve, reject) => {
                    new ReportsService(new ReportsDao(databaseHelper))
                        .getMaisVendidosPorGrupo(
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
                                statusCode: e.code
                            }
                        }))
                });
            },
            get_produto_mais_vendido: function (args) {
                return new Promise((resolve, reject) => {
                    new ReportsService(new ReportsDao(databaseHelper))
                        .getProdutoMaisVendido(
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
                                statusCode: e.code
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
    listen(app, '/wsdl', vidadoService, xml, function () {
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
