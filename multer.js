const Mkdirp = require('./mkdirp')
const multer = require('multer')

const diskStorage = GetPath => multer.diskStorage({
    destination: async function (req, file, cb) {
        try {
            const savePath = await GetPath(req)
            req.body.folderPath = savePath
            
            await Mkdirp(savePath)
            cb(null, savePath)
        }
        catch (e) {
            console.log(e)
            cb(e)
        }
    },
    filename: function (req, file, cb) {
        req.body.originalname = file.originalname
        cb(null, file.originalname)
    }
})
const upload = GetPath => multer({ storage: diskStorage(GetPath) }).array('source')

module.exports = GetPath => (req, res, next) => {
    upload(GetPath)(req, res, err => {
        if (err) next(err)
        else next()
    })
}