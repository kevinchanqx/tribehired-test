const express = require('express')
const bodyParser = require('body-parser')

// Functions
const { 
  getTopPosts,
  getFilteredComments
} = require('../function')

const server1 = async port => {
  const app = express()
  app.use(bodyParser.urlencoded({ extended: false }))
  app.use(bodyParser.json())
  
  /**
   * First API - Return a list of Top Posts ordered by their number of Comments.
   * Endpoint: /posts/top
   */
  app.get('/posts/top', async (req, res) => {
    console.log(process.pid)
    await getTopPosts(req, res)
  })

  /**
   * Second API - A search API that allows a user to filter the comments based on all the available fields.
   * Endpoint: /comments/search
   */
  app.get('/comments/search/', async (req, res) => {
    await getFilteredComments(req, res)
  })

  app.listen(port, () => {
    console.log(`Server listening on port ${port}`)
  })
}

module.exports = {
  server1
}