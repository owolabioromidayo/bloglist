const dummy = (blogs) => 1
const totalLikes = (blogs) => blogs.reduce((acc, curr) => acc + curr.likes, 0)

const favouriteBlog  = (blogs) => {
    if (blogs.length === 0) {return {} }
    const highestLikes = Math.max(...blogs.map(blog => blog.likes))
    return blogs.filter(blog => blog.likes === highestLikes)[0]

}


module.exports = {dummy, totalLikes, favouriteBlog}