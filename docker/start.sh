#!/bin/sh

ROOT_DIR=/var/www/public/admin
set -e

for file in $ROOT_DIR/js/app-config.*.js
do
sed -i -e '
/VUE_TITLE/c VUE_TITLE:'${TITLE}',
/VUE_API_URL/c VUE_API_URL: '${API_URL}',
/VUE_WECHAT_APP_ID/c VUE_WECHAT_APP_ID: '${WECHAT_APP_ID}',
/VUE_GIT_CLIENT_ID/c VUE_GIT_CLIENT_ID: '${GIT_CLIENT_ID}',
/RSA_PUB_KEY/c RSA_PUB_KEY: '${RSA_PUB_KEY}',
/VUE_APP_URL/c VUE_APP_URL: '${DOMAIN}',' $file
done

# 替换高德key
key="${GMAP_KEY%\"}"
key="${key#\"}"
sed  -i 's/key=[[:alnum:]]*\&plugin/key='${key}'\&plugin/g' $ROOT_DIR/index.html

echo "Staring nginx"

exec nginx -g 'daemon off;'
