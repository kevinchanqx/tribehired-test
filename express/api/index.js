const nodefetch = require('node-fetch')

const {
  API_HEADER,
  ALL_COMMENTS_API,
  ALL_POSTS_API,
  SINGLE_POST_API
} = require('./constant')

exports.getAllComments = async () => (
  await nodefetch(ALL_COMMENTS_API, {
    method: 'GET',
    header: API_HEADER
  })
  .then(res => res.json())
  .catch(err => err)
)

exports.getAllPosts = async () => (
  await nodefetch(ALL_POSTS_API, {
    method: 'GET',
    header: API_HEADER
  })
  .then(res => res.json())
  .catch(err => err)
)