'use strict'

const fs = require('fs')

const PORT = process.env.PORT || 3000

module.exports = module.exports.default = pugServer

function pugServer(viewsPath) {
  const http = require('http')
  const path = require('path')
  const pug = require('pug')
  const nodeStatic = require('node-static')
  const filePath = path.join(viewsPath || '.')
  const fileServer = new nodeStatic.Server(filePath)

  let server = http.createServer(function (req, res) {
    if (req.url.match(/\.pug$/ig) || req.url === '/') {
      const file = (req.url === '/') ? '/index.pug' : req.url
      const dataFile = `${file}.json`
      console.log('File', filePath + file)
      console.log('Data', dataFile)
      const dataStr = fs.readFileSync(dataFile)
      const dataObj = JSON.parse(dataStr)
      try {
        res.writeHead(200, {'Content-Type': 'text/html'})
        const data = Object.assign({}, {
            pretty: true
        }, dataObj)
        res.end(
          pug.renderFile(filePath + file, data)
        )
      }
      catch (e) {
        res.writeHead(400, {'Content-Type': 'text/html'})
        res.end(e.toString())
      }
    }
    else {
      req.addListener('end', function () { fileServer.serve(req, res) }).resume()
    }
  })

  server.listen({host: 'localhost', port: PORT}, function(err) {
    if (err) throw err
    console.log('Server started on: http://' + server.address().address + ':' + PORT)
  })

  return server
}
