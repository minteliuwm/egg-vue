#! /bin/bash

set -e

# 指定分支，默认为 QA 分支
branch=$1
if [ -z $branch ]
then
  branch=qa
fi

# 合并代码到 master 分支
git checkout master
git merge $branch

# 指定上线版本
echo "输入当前上线的版本号: "
read VERSION

read -p "当前版本 $VERSION - are you sure? (y/n)" -n 1 -r
echo    

if [[ $REPLY =~ ^[Yy]$ ]]
then
  # 修改版本号
  npm version $VERSION --no-git-tag-version --allow-same-version

  # 打 tag && 生成变更日志
  git tag v$VERSION
  npm run changelog
  git commit -am "release: $VERSION"

  # 提交代码
  git push origin master
  git push origin refs/tags/v$VERSION

  # 合并代码到 develop 分支
  git checkout develop
  git rebase master
  git push origin develop
fi
