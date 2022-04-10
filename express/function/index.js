// API
const {
  getAllComments,
  getAllPosts
} = require('../api')

exports.getTopPosts = async (req, res) => {
  const [comments, posts] = await Promise.all([
    getAllComments(),
    getAllPosts()
  ])

  /** Normalize posts by postId */
  const postByPostId = {}
  posts.forEach(post => {
    postByPostId[`post#${post.id}`] = post
  })

  const numberOfCommentsByPostId = {}

  comments.forEach(comment => {
    if (!numberOfCommentsByPostId.hasOwnProperty(`post#${comment.postId}`)) numberOfCommentsByPostId[`post#${comment.postId}`] = 0

    numberOfCommentsByPostId[`post#${comment.postId}`] ++
  })
  
  // Sort post starting from having the most comments
  const sortedPostsByPostId = Object.fromEntries(
    Object.entries(numberOfCommentsByPostId).sort(([, a], [, b]) => b-a)
  )
  
  const topPosts = Object.keys(sortedPostsByPostId).map(postId => {
    const matchNumberOfComments = numberOfCommentsByPostId[postId]
    const matchPost = postByPostId[postId]

    /**
     * Post Object has following fields
     * id,
     * title,
     * body
     * userId
     */
    const {
      id,
      title,
      body
    } = matchPost

    return {
      post_id: id,
      post_title: title,
      post_body: body,
      total_number_of_comments: matchNumberOfComments
    }
  })

  res.write(JSON.stringify(topPosts, null, 2))
  res.end()
}

exports.getFilteredComments = async (req, res) => {

  try {
    /**
     * EXAMPLE: /comments/search/?name=abc&postId=2
     */
    const queryParams = req.query

    const comments = await getAllComments()
    let filteredResults = []

    const search = (key, value) => value.toString().toLowerCase().includes(queryParams[key].toString().toLowerCase())

    const searchByPostId = array => array.filter(a => a.postId === parseInt(queryParams.postId))
    const filtration = (array, key) => array.filter(a => search(key, a[key])) 

    Object.keys(queryParams).forEach(param => {
      if (param === 'postId') {
        if (filteredResults.length) {
          filteredResults = searchByPostId(filteredResults)
        } else {
          filteredResults = searchByPostId(comments)
        }
      } else {
        if (filteredResults.length) {
          filteredResults = filtration(filteredResults, param)
        } else {
          filteredResults = filtration(comments, param)
        }
      }
    })

    res.write(JSON.stringify({
      comments: filteredResults
    }, null, 2))
    res.end()

  } catch (err) {
    res.write(JSON.stringify({
      message: err
    }, null, 2))
    res.end()
  }
}