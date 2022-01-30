rm -rf ./keys
mkdir ./keys
ssh-keygen -b 2048 -t rsa -f ./keys/priv.key -q -N ''
mv -f ./keys/priv.key.pub ./keys/pub.key
npm run build