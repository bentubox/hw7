const isLoggedIn = require('./auth').isLoggedIn
const Profile = require('./model.js').Profile

// Function that resets profiles to a set of default data.
const resetDefaultProfiles = () => {
    // Clear documents.
    Profile.remove({}, (err) => {})

    new Profile({ 
            username:"Dummy",
            headline: 'Default Headline',
            email: 'default@email.com',
            dob: new Date(1993, 2, 15),
            zipcode: 00000,
            avatar: 'https://upload.wikimedia.org/wikipedia/commons/4/46/Antonin_Hudecek_14.1.1872-11.8.1941_-_Leto_-_Paseka.jpg'
        }).save()
    new Profile({ 
            username: 'Jimmy',
            headline: 'Headline0',
            email: 'email@domain.com',
            dob: new Date(1992, 7, 5),
            zipcode: 12345,
            avatar: 'https://upload.wikimedia.org/wikipedia/commons/6/6b/Richmond_2015_UCI_%2821361289840%29.jpg'
        }).save()
    new Profile({ 
            username: 'Timmy',
            headline: 'Headline1',
            email: 'lol@wat.com',
            dob: new Date(1987, 11, 17),
            zipcode: 77777,
            avatar: 'https://upload.wikimedia.org/wikipedia/commons/c/c1/Sternotomis_amabilis_kolbei_%2810841645574%29.jpg'
        }).save()
    new Profile({ 
            username: 'Kimmy',
            headline: 'Headline2',
            email: 'kill@me.com',
            dob: new Date(1990, 10, 21),
            zipcode: 88888,
            avatar: 'https://upload.wikimedia.org/wikipedia/commons/b/be/One_of_the_many_decrepit_churches_out_here.jpg'
        }).save()
}

// resetDefaultProfiles()

// Functions that query users by username, then runs a callback function on the results.
const findByUsername = (username, callback) => {
    console.log('Find by username: ', username)
    Profile.find({ username: username }).exec((err, items) => {
		if (err){
            throw new Error("Error finding by username!")
        }
        callback(items)
	})
}

const findByUsernames = (usernames, callback) => {
    // Populate users array with user objects from memory.
    const users = []
    usernames.forEach((element) => {
        findByUsername(element, (items) => {
            items.forEach ((user) => {
                users.push(user)  
            })
            callback(users)
        })
    })
}

const findOneByUsername = (username, callback) => {
    console.log('Find one by username: ', username)
    Profile.findOne({ username: username }).exec((err, document) => {
		if (err){
            throw new Error("Error finding by username!")
        }
        callback(document)
	})
}

// Function that updates a document based on username.
const updateByUsername = (username, newField, callback) => {
    console.log('Update by username: ', username)
    Profile.findOneAndUpdate({ username: username }, newField, { new: true }, (err, doc) => {  
        if (err){
            throw new Error("Error updating Profile!")
        }
        callback(doc)
    })
}

const index = (req, res) => {
     res.send("Hi.")
}

const getHeadlines = (req, res) => {
    console.log('Payload received:', req.body)
    console.log('Parameters received:', req.params)
    
    // List of requested usernames.
    const users = req.params.users ? req.params.users.split(',') : [req.user]    
    findByUsernames(users, (results) => {
        const headlines = []
        results.forEach((result) => {
            headlines.push({ username : result.username, headline: result.headline })
        })
        res.send({ headlines: headlines })
    })
}
const updateHeadline = (req, res) => {
    console.log('Payload received:', req.body)
    updateByUsername(req.user, { headline: req.body.headline }, (document) => {
        res.send({ username: document.username, headline: document.headline })
    })
}

const getEmail = (req, res) => {
    console.log('Payload received:', req.body)
    console.log('Parameters received:', req.params)

    // Requested user.
    const requestedUser = req.params.user ? req.params.user : req.user

    findOneByUsername(requestedUser, (result) => {
        res.send({ username: result.username, email: result.email })
    })    
}
const updateEmail = (req, res) => {
    console.log('Payload received:', req.body)
    updateByUsername(req.user, { email: req.body.email }, (document) => {
        res.send({ username: document.username, email: document.email })
    })
}

const getDOB = (req, res) => {
    console.log('Payload received:', req.body)
    console.log('Parameters received:', req.params)
    
    // Requested user.
    const requestedUser = req.params.user ? req.params.user : req.user

    findOneByUsername(requestedUser, (result) => {
        res.send({ username: result.username, dob: result.dob })
    }) 
}

const getZipcode = (req, res) => {
    console.log('Payload received:', req.body)
    console.log('Parameters received:', req.params)
    
    // Requested user.
    const requestedUser = req.params.user ? req.params.user : req.user
    findOneByUsername(requestedUser, (result) => {
        res.send({ username: result.username, zipcode: result.zipcode })
    })
}
const updateZipcode = (req, res) => {
    console.log('Payload received:', req.body)
    updateByUsername(req.user, { zipcode: req.body.zipcode }, (document) => {
        res.send({ username: document.username, zipcode: document.zipcode })
    })
}

const getAvatars = (req, res) => {
    console.log('Payload received:', req.body)
    console.log('Parameters received:', req.params)
   
    // List of requested avatars.
    const users = req.params.users ? req.params.users.split(',') : [req.user]
    findByUsernames(users, (results) => {
        const avatars = []
        results.forEach((result) => {
            avatars.push({ username : result.username, avatar: result.avatar })
        })
        res.send({ avatars: avatars })
    })
}
const updateAvatar = (req, res) => {
    console.log('Payload received:', req.body)

     // Requested user.
    const requestedUser = req.params.user ? req.params.user : req.user
    // Stub functionality. Avatar not updated in database.
    findOneByUsername(requestedUser, (result) => {
        res.send({ username: result.username, avatar: result.avatar })
    }) 
}

module.exports = (app) => {
    app.get('', isLoggedIn, index)

    app.get('/headlines/:users*?', isLoggedIn, getHeadlines)
    app.put('/headline', isLoggedIn, updateHeadline)

    app.get('/email/:user?', isLoggedIn, getEmail)
    app.put('/email', isLoggedIn, updateEmail)

    app.get('/dob', isLoggedIn, getDOB)
    
    app.get('/zipcode/:user?', isLoggedIn, getZipcode)
    app.put('/zipcode', isLoggedIn, updateZipcode)

    app.get('/avatars/:users*?', isLoggedIn, getAvatars)
    app.put('/avatar', isLoggedIn, updateAvatar)
}