const http = require('http')

const server = http.createServer((req, res) => {
  res.end('<h1>home page!!!</h1>')
})

const port = process.env.PORT || 3000

server.listen(port, ()=>console.log(`listening on port ${port}`))