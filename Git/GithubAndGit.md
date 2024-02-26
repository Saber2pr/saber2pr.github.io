1. Github, or remote repository, is a remote mirror of local repository.
two。 After the local git is submitted, the local repository is ahead of the remote repository and needs to perform git push to update the remote repository.
3. If it is multi-person development, the remote repository is likely to be ahead of the local branch, making it impossible to push local to remote. You need to execute git pull first, update the remote new content locally, and then push.
> if there is a conflict, you need to make a choice.
4. The contribution mode of github is generally fork-> clone-> commit-> test-> push-> open pull request.
> that's all for the general one.