#!/bin/bash

MOD_NAME="${namespace}"
TAR="$MOD_NAME.tar.gz"

# add path
export PATH=/home/fis/npm/bin:$PATH
#show fis-plus version
fis3 --version --no-color

for f in $(egrep  "('|\")m?common(:|/)" -rl ./);do
    sed -i -f replace.sed $f
done

#通过 fis3 命令进行构建，构建的 media 为 prod ，这个可以根据用户具体配置修改
fis3 release prod -d output
#进入output目录
cd output
#删除产出的test目录
rm -rf test

#整理目录结构
mkdir -p ./webroot/static ./data/smarty ./php/phplib/ext/smarty/baiduplugins
cp -r ./static ./webroot
mv ./config ./data/smarty

rm -rf ./static
rm -rf ./plugin
rm -rf ./server-conf

#将output目录进行打包
tar zcf $TAR ./*
mv $TAR ../

cd ..
rm -rf output

mkdir output

mv $TAR output/

echo "build end"