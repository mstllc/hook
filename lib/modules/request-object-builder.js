module.exports = function(req) {
  let ro = {}
  ro.hostname = req.hostname
  ro.path = req.path
  ro.query = req.query
  ro.protocol = req.protocol
  ro.method = req.method
  ro.body = req.body
  ro.headers = req.headers

  if (ro.query._responseCode) delete ro.query._responseCode
  if (ro.query._responseText) delete ro.query._responseText

  return ro
}
