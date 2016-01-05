const save = require('../modules/save/router.js')

module.exports = function(app) {

  app.use('/save', save)

}
