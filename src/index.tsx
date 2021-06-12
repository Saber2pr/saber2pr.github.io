import 'normalize.css'
import 'animate.css/source/flippers/flipInX.css'
import './style/animation.less'
import './style/shadow.less'
import './style/components.less'

import React from 'react'
import ReactDOM from 'react-dom'

// /
import Pages from './app'
import { checkUpdate, ErrorBoundary, Loading } from './components'
import { origin } from './config/origin'
import { request, requestContent } from './request'
import {
  collect,
  PWAInstaller,
  requestLongListTask,
  welcome,
  whenInDEV,
} from './utils'

const { DATA_LOADED } = origin.constants

const App = React.lazy(async () => {
  welcome()
  const homeInfo = await request('home')
  const aboutInfo = await request('about')
  const blogTree = await request('blog')

  if (!localStorage.getItem(DATA_LOADED)) {
    // for cache backend
    requestLongListTask(
      collect(blogTree),
      item => requestContent(item.path + '.md'),
      item => !item.children,
      5
    ).then(() => localStorage.setItem(DATA_LOADED, 'true'))
  }

  return {
    default: () => (
      <Pages homeInfo={homeInfo} aboutInfo={aboutInfo} blogTree={blogTree} />
    ),
  }
})

ReactDOM.render(
  <ErrorBoundary>
    <React.Suspense fallback={<Loading />}>
      <App />
    </React.Suspense>
  </ErrorBoundary>,
  document.getElementById('root')
)

window.addEventListener('load', async () => {
  if (whenInDEV()) {
    LOADING.destroy()
    return
  }

  if ('serviceWorker' in navigator) {
    await PWAInstaller()
    checkUpdate(null, true, true)
  }

  LOADING.destroy()
})
