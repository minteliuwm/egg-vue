#! /bin/bash

cd webapp
npm run build

rm -rf ../app/public/*
touch ../app/public/.gitkeep

rm -rf ../app/view/*
touch ../app/view/.gitkeep

mv dist/index.html ../app/view
mv dist/* ../app/public

rm -rf dist