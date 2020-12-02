const fs = require('fs')
const { promisify } = require('util')
const MkdirAsync = path => promisify(fs.mkdir)(path)

const IsExistAsync = async path => {
    try {
        await promisify(fs.access)(path)
        return true
    }
    catch (e) {
        return false
    }
}

module.exports = async path => {
    if (!path || path.length === 0) throw new Error('invalid path')
    path = path.replace(/\\/gi, '/')

    const paths = path.split('/')
    let currentPath = ''
    
    for (let i=0; i<paths.length; i++) {
        currentPath += `${paths[i]}/`
        if (!(await IsExistAsync(currentPath))) await MkdirAsync(currentPath)
    }
}