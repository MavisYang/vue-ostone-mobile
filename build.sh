cd /c/Users/mishi01/Desktop/projects/dongdian
git pull
cd /c/Users/mishi01/Desktop/projects/vux_env/projects/ostone-mobile
echo "build"
npm run build
echo "copy"
cp -r dist/static /c/Users/mishi01/Desktop/projects/dongdian/public
cd /c/Users/mishi01/Desktop/projects/dongdian
echo "push"
git add -A .
git commit -m "static"
git push
