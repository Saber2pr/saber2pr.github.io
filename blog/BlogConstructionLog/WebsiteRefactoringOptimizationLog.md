### 2019.10.20
1. Optimize interface data and merge blog_menu and blog interfaces. Reduced the number of HTTP requests.
The native build script is refactored, abandoning the tree-lang format. (because interfaces merge)
two。 Using forceUpdate hook instead of location reload reduces unnecessary HTTP requests.
---
### 2019.11.2
1. Using NavLink in @ saber2pr/react-router instead of redux + link scheme reduces the number of event communications.
> the essence is to use React Context instead of Redux.
two。 In the interaction priority scenario, useLayoutEffect is used instead of useEffect to optimize the page interaction fluency.
> useLayoutEffect `Sync `triggers.
---
### 2019.11.3
1. Optimize the dom structure and semantics of header nav to make the structure clearer.
two。 Optimize the global css and fine-tune the component size to highlight the main content of the page.
---
### 2019.11.5
1. `dynamic 'page: reconstruct the CSS layout and add a summary of content.
2. `dynamic 'page: add a button to return to the top.
3. `Dynamic` pages: use redux for routing persistence.
---
### 2019.11.9
1. Components and functions are optimized by memo, which reduces a lot of repeated rendering and computation.
### 2019.12.12
1. Remove the Music media feature
two。 Remove the music player about the page
3. Remove the link page message function
---
### 2020.1.27
The following new features have been added:
1. The side bar of the notes interface can be hidden, the navigation bar can be hidden full screen, and the music player can be opened in full screen state.
two。 Add a new music player function, with 7 NetEYun popular song lists.
3. Version updates are divided into two types, dynamic versions are mainly updated when notes change, and static versions are updated when source code changes.
Optimize performance:
1. Webpack is configured with code split.
2. PWA cache strategy refactoring, using dynamic cache + static cache strategy.
3. Use external loading to display the loading interface more quickly and avoid unresponsive caused by loading large resources for a long time.
---
### 2020.6.6
1. The Loading component adds a timeout prompt to avoid waiting for a long time to access the Loading for the first time.
2. @ saber2pr/md2jsx: the code block adds copy to the clipboard.
3. Upgrade @ saber2pr/md2jsx in the blog to do a little css optimization for mobile.
---
### 2021.5.21
1. Optimize the cache update mechanism, do not pop up confirm, silently refresh the cache.