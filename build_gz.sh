cd /c/Users/mishi03/Desktop/codes/dongdian
git pull
cd /c/Users/mishi03/Desktop/codes/vux_env/projects/ostone-mobile
echo "build"
npm run build
echo "copy"
cp -r dist/static /c/Users/mishi03/Desktop/codes/dongdian/public
cd /c/Users/mishi03/Desktop/codes/dongdian
echo "push"
git add -A .
git commit -m "static"
git push
