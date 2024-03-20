const fs = require('fs')
const toMs = require('ms')

/**
 * Add seller user.
 * @param {String} userId 
 * @param {String} expired 
 * @param {Object} _dir 
 */
const addsellerUser = (userId, expired, _dir) => {
    if (expired === undefined) {
        expired = 'PERMANENT'
    } else {
        expired = expired
    }
    
    let expired_at = 'PERMANENT'
    
    if (expired === 'PERMANENT') {
        expired_at = 'PERMANENT'
    } else {
        expired_at = Date.now() + toMs(expired)
    }

    const obj = { id: userId, expired: expired_at }
    _dir.push(obj)
    fs.writeFileSync('./lib/database/seller.json', JSON.stringify(_dir, null, 2))
}

/**
 * Get seller user position.
 * @param {String} userId 
 * @param {Object} _dir 
 * @returns {Number}
 */
const getsellerPosition = (userId, _dir) => {
    let position = null
    Object.keys(_dir).forEach((i) => {
        if (_dir[i].id === userId) {
            position = i
        }
    })
    if (position !== null) {
        return position
    }
}

/**
 * Get seller user expire.
 * @param {String} userId 
 * @param {Object} _dir 
 * @returns {Number}
 */
const getsellerExpired = (userId, _dir) => {
    let position = null
    Object.keys(_dir).forEach((i) => {
        if (_dir[i].id === userId) {
            position = i
        }
    })
    if (position !== null) {
        return _dir[position].expired
    }
}

/**
 * Check user is seller.
 * @param {String} userId 
 * @param {Object} _dir 
 * @returns {Boolean}
 */
const checksellerUser = (userId, _dir) => {
    let status = false
    Object.keys(_dir).forEach((i) => {
        if (_dir[i].id === userId) {
            status = true
        }
    })
    return status
}

/**
 * Constantly checking seller.
 * @param {Object} _dir 
 */
const expiredCheck = (conn, _dir) => {
    setInterval(() => {
        let position = null
        Object.keys(_dir).forEach((i) => {
            if (Date.now() >= _dir[i].expired) {
                position = i
            }
        })
        if (position !== null) {
            console.log(`seller expired: ${_dir[position].id}`)
            let txt = `seller Expired, Terimakasih Sudah Berlangganan Di conn Botz`
            conn.sendMessage(_dir[position].id, { text: txt })
            _dir.splice(position, 1)
            fs.writeFileSync('./lib/database/seller.json', JSON.stringify(_dir, null, 2))
        }
    }, 1000)
}

/**
 * Get all seller user ID.
 * @param {Object} _dir 
 * @returns {String[]}
 */
const getAllsellerUser = (_dir) => {
    const array = []
    Object.keys(_dir).forEach((i) => {
        array.push(_dir[i].id)
    })
    return array
}

module.exports = {
    addsellerUser,
    getsellerExpired,
    getsellerPosition,
    expiredCheck,
    checksellerUser,
    getAllsellerUser
}
