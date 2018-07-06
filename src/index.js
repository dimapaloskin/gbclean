const simpleGit = require('simple-git/promise')
const inquirer = require('inquirer')

const clean = async (cwd) => {
  try {
    const git = simpleGit(cwd)
    const isRepo = await git.checkIsRepo()

    if (!isRepo) {
      throw new Error('not a git repository')
    }

    const { all: branches } = await git.branch(['-v'])

    const prompt = inquirer.createPromptModule()

    const question = {
      type: 'checkbox',
      name: 'branchesToDelete',
      message: 'Which branches you want to delete?',
      choices: branches
    }

    const { branchesToDelete } = await prompt(question)

    if (!branchesToDelete.length) {
      return
    }

    for (const branch of branchesToDelete) {
      console.log(branch)
      await git.branch(['-D', branch])
    }

  } catch (err) {
    console.error(err)
  }
}

module.exports = clean
