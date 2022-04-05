/** API Header */
exports.API_HEADER = {
  Accept: '/',
  'Content-type': 'application/json'
}

/** API Endpoint */
exports.ALL_COMMENTS_API = 'https://jsonplaceholder.typicode.com/comments'
exports.ALL_POSTS_API = 'https://jsonplaceholder.typicode.com/posts'
exports.SINGLE_POST_API = id => `https://jsonplaceholder.typicode.com/${id}`

