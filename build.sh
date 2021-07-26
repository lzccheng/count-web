yarn
echo '===== install modules done ====='
yarn build
echo '===== build done ====='
cp -rf ./dist/* /var/www/html/
echo '===== copy finished ====='
