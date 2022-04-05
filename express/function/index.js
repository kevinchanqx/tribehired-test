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
    if (!postByPostId.hasOwnProperty(`post#${post.id}`)) postByPostId[`post#${post.id}`] = post
  })

  const numberOfCommentsByPostId = {}

  comments.forEach(comment => {
    if (!numberOfCommentsByPostId.hasOwnProperty(`post#${comment.postId}`)) numberOfCommentsByPostId[`post#${comment.postId}`] = 0

    numberOfCommentsByPostId[`post#${comment.postId}`] ++
  })
  
  // Sort post starting from having the most comments
  const sortedPosts = Object.fromEntries(
    Object.entries(numberOfCommentsByPostId).sort(([, a], [, b]) => b-a)
  )
  
  const topPosts = Object.keys(sortedPosts).map(postId => {
    const matchNumberOfComments = numberOfCommentsByPostId[postId]
    const matchPost = postByPostId[postId]

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
    sanityCheck(req.body)
    const {
      filterType,
      filterString
    } = req.body

    const comments = await getAllComments()
    const filteredResults = []

    switch (filterType) {
      case 1:
        if (typeof filterString !== 'number') throw `filterString must be a number for filterType 1!`

        comments.forEach(comment => {
          if (comment.postId === filterString) {
            filteredResults.push(comment)
          }
        })
        break;
      case 2:
        if (typeof filterString !== 'string') throw `filterString must be a string for filterType 2!`

        comments.forEach(comment => {
          if (comment.name.toLowerCase().includes(filterString.toLowerCase())) {
            filteredResults.push(comment)
          }
        })
        break;
      case 3:
        if (typeof filterString !== 'string') throw `filterString must be a string for filterType 3!`

        comments.forEach(comment => {
          if (comment.email.toLowerCase().includes(filterString.toLowerCase())) {
            filteredResults.push(comment)
          }
        })
        break;
      case 4:
        if (typeof filterString !== 'string') throw `filterString must be a string for filterType 4!`

        comments.forEach(comment => {
          if (comment.body.toLowerCase().includes(filterString.toLowerCase())) {
            filteredResults.push(comment)
          }
        })
        break;
      default:
        return
    }

    res.write(JSON.stringify({
      comments: filteredResults
    }, null, 2))
    res.end()

  } catch (err) {
    res.write(JSON.stringify({
      message: err
    }, null, 2))
    res.end()
    console.log(`EndPoint: ${req.url}. Error ${err}`)
  }
}

const sanityCheck = obj => {
  const requiredFields = [
    'filterType',
    'filterString'
  ]

  const requiredType = {
    filterType: 'number'
  }
  
  try {
    requiredFields.forEach(rf => {
      if (!obj.hasOwnProperty(rf)) throw `Missing required field ${rf}.`
    })

    Object.keys(requiredType).forEach(rt => {
      if (typeof obj[rt] !== requiredType[rt]) throw `Invalid data type. Expected ${rt} type: ${requiredType[rt]}. Passed ${rt} type: ${typeof obj[rt]}.`
    })
  } catch (err) {
    throw err
  }
}