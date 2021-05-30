;(function () {
  const getImg = img => decodeURIComponent(/src=([\w\W]*?)&/.exec(img)[1])
  const node = document.getElementById('currentImg')
  if (node) {
    node.src = getImg(node.src)
  }
})()
