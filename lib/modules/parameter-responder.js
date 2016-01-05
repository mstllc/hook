module.exports = function(req, res) {
  if (req.query._responseCode) res.status(req.query._responseCode)
  else res.status(200)

  if (req.query._responseText) return res.send(req.query._responseText)
  else return res.send('Message Received.')
}
