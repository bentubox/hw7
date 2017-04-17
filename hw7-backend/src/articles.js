const isLoggedIn = require('./auth').isLoggedIn
const Article = require('./model.js').Article

var articleID = 2
const articleBank = {
        articles: [
            { id: 0, author: "Ben", text: 'lol here is some text', comments: [] },
            { id: 1, author: "Ben", text: 'another article', comments: [] },
            { id: 2, author: "Ben", text: 'what am i doing', comments: [] } 
        ]
    }

const getArticles = (req, res) => {
    console.log('Payload received:', req.body)
    console.log('Parameters received:', req.params)
    if (!req.params.id){
        // No id specified. Send all articles.
        res.send(articleBank)
    } else {
        const ids = req.params.id.split(',')
        const articles = []
        // Populate article list with articles that match on ids.
        ids.forEach(function(element) {
            const addArticle = articleBank.articles.find(({ id }) => {
                return id == element
            })
            if(addArticle){
                articles.push(addArticle)
            }
        }, this);

        res.send({ articles: articles })
    }
}

const updateArticles = (req, res) => {
    console.log('Payload received:', req.body)
    console.log('Parameters received:', req.params)
    if (!req.user) {
        req.user = 'Dummy'
    }
    const article = articleBank.articles.find(({ id }) => {
        return id == req.params.id
    })
    if (!article) {
        res.sendStatus(404)
        return
    }

    if (req.body.hasOwnProperty("commentId")){
        // Update or post comment.
        if (req.body.commentId >= 0) {
            if (article.comments && article.comments.length > 0) {
                const comment = article.comments.find(({ commentId }) => {
                    return commentId == req.body.commentId
                })
                console.log(comment)
                if (comment){
                    comment.text = req.body.text
                } else{
                    res.sendStatus(404)
                    return
                }
            } else{
                res.sendStatus(404)
                return
            }
        } else{
            article.comments.push({ commentId: article.comments.length, author: req.user, text: req.body.text })
        }
    } else {
        // Update article.
        article.text = req.body.text
    }
    res.send({ article })
}

const postArticle = (req, res) => {
    console.log('Payload received:', req.body)
    console.log('Parameters received:', req.params)
    if (!req.user) {
        req.user = 'Dummy'
    }
    // TODO: Image upload?
    const newArticle = { id: ++articleID, author: req.user, text: req.body.text, comments: [], cid: 0}
    articleBank.articles.push(newArticle)
    res.send(newArticle)
}


module.exports = (app) => {
    app.get('/articles/:id*?', isLoggedIn, getArticles)
    app.put('/articles/:id', isLoggedIn, updateArticles)
    app.post('/article', isLoggedIn, postArticle)
}