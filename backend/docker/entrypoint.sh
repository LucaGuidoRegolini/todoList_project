#!/bin/sh
yarn
echo "Building..."
yarn build
echo "Building done"

npx prisma generate
npx prisma migrate deploy
echo "Migration done"

yarn start:prod