#!/usr/bin/env bash

set -Eeuo pipefail

readonly APEX_DOMAIN="yaliaisol.com"
readonly WWW_DOMAIN="www.yaliaisol.com"
readonly RELEASE_TAG="yaliaisol-20260825-1248"
readonly ARCHIVE_NAME="yaliaisol-site-20260825-1248.zip"
readonly ARCHIVE_SHA256="5cec3962151f2a01aba95889f7abfd0463d25c885ff4d1b4d50986568e8a2f4d"
readonly ARCHIVE_PAGES_URL="https://leoai1988.github.io/xiangge-site/deploy/${ARCHIVE_NAME}"
readonly ARCHIVE_JSDELIVR_URL="https://cdn.jsdelivr.net/gh/LeoAI1988/xiangge-site@gh-pages/deploy/${ARCHIVE_NAME}"
readonly ARCHIVE_RELEASE_URL="https://github.com/LeoAI1988/xiangge-site/releases/download/${RELEASE_TAG}/${ARCHIVE_NAME}"
readonly -a ARCHIVE_URLS=(
  "${ARCHIVE_PAGES_URL}"
  "${ARCHIVE_JSDELIVR_URL}"
  "${ARCHIVE_RELEASE_URL}"
)
readonly DEPLOY_ROOT="/var/www/yaliaisol"
readonly CURRENT_LINK="${DEPLOY_ROOT}/current"
readonly NGINX_CONF="/etc/nginx/sites-available/yaliaisol"
readonly NGINX_LINK="/etc/nginx/sites-enabled/yaliaisol"

if [[ "${EUID}" -ne 0 ]]; then
  echo "ERROR: 请使用 root 或 sudo 执行。" >&2
  exit 1
fi

for command_name in curl sha256sum unzip nginx certbot systemctl openssl; do
  command -v "${command_name}" >/dev/null 2>&1 || {
    echo "ERROR: 服务器缺少命令 ${command_name}。" >&2
    exit 1
  }
done

work_dir="$(mktemp -d /var/tmp/yaliaisol-deploy.XXXXXX)"
archive_path="${work_dir}/${ARCHIVE_NAME}"
unpack_dir="${work_dir}/site"
release_id="${RELEASE_TAG}-$(date +%Y%m%d%H%M%S)"
release_dir="${DEPLOY_ROOT}/releases/${release_id}"
backup_dir="/var/backups/yaliaisol/${release_id}"
old_current_target=""
old_nginx_link_target=""
had_nginx_conf=0
had_nginx_link=0

cleanup() {
  rm -rf -- "${work_dir}"
}
trap cleanup EXIT

echo "[1/7] 下载并校验发布包..."
download_succeeded=0
for archive_url in "${ARCHIVE_URLS[@]}"; do
  echo "尝试下载：${archive_url}"
  rm -f -- "${archive_path}"
  if curl -fsSL --connect-timeout 15 --max-time 600 --retry 2 --retry-all-errors \
    "${archive_url}" -o "${archive_path}"; then
    download_succeeded=1
    break
  fi
done
if [[ "${download_succeeded}" -ne 1 ]]; then
  echo "ERROR: 所有发布包下载地址均不可用。" >&2
  exit 1
fi
echo "${ARCHIVE_SHA256}  ${archive_path}" | sha256sum -c -

mkdir -p "${unpack_dir}"
unzip -q "${archive_path}" -d "${unpack_dir}"
test -f "${unpack_dir}/index.html"
test -d "${unpack_dir}/assets"
grep -RFl -- "粤ICP备2026089185号-2" "${unpack_dir}/assets" >/dev/null
grep -RFl -- "粤公网安备44030002015092号" "${unpack_dir}/assets" >/dev/null
grep -RFl -- "添加微信获取资料" "${unpack_dir}/assets" >/dev/null
grep -Fq -- "<title>亚里士多翔的 AI 世界｜有用的AI课</title>" "${unpack_dir}/index.html"
if grep -RFl -- "虎子的时间星河" "${unpack_dir}" >/dev/null; then
  echo "ERROR: 发布包中仍包含旧网站内容。" >&2
  exit 1
fi

echo "[2/7] 建立可回滚的静态站发布目录..."
install -d -m 0755 "${DEPLOY_ROOT}/releases" "${backup_dir}"
install -d -m 0755 "${release_dir}"
cp -a "${unpack_dir}/." "${release_dir}/"
find "${release_dir}" -type d -exec chmod 0755 {} +
find "${release_dir}" -type f -exec chmod 0644 {} +

if [[ -L "${CURRENT_LINK}" ]]; then
  old_current_target="$(readlink -f "${CURRENT_LINK}")"
fi
if [[ -f "${NGINX_CONF}" ]]; then
  had_nginx_conf=1
  cp -a "${NGINX_CONF}" "${backup_dir}/nginx-yaliaisol.conf"
fi
if [[ -L "${NGINX_LINK}" ]]; then
  had_nginx_link=1
  old_nginx_link_target="$(readlink "${NGINX_LINK}")"
fi

rollback() {
  exit_code=$?
  trap - ERR
  set +e
  echo "ERROR: 部署失败，正在恢复上一版..." >&2
  if [[ -n "${old_current_target}" ]]; then
    ln -sfn "${old_current_target}" "${CURRENT_LINK}.rollback"
    mv -Tf "${CURRENT_LINK}.rollback" "${CURRENT_LINK}"
  elif [[ -L "${CURRENT_LINK}" ]]; then
    rm -f -- "${CURRENT_LINK}"
  fi
  if [[ "${had_nginx_conf}" -eq 1 ]]; then
    cp -a "${backup_dir}/nginx-yaliaisol.conf" "${NGINX_CONF}"
  else
    rm -f -- "${NGINX_CONF}"
  fi
  if [[ "${had_nginx_link}" -eq 1 ]]; then
    ln -sfn "${old_nginx_link_target}" "${NGINX_LINK}"
  else
    rm -f -- "${NGINX_LINK}"
  fi
  nginx -t >/dev/null 2>&1 && systemctl reload nginx
  exit "${exit_code}"
}
trap rollback ERR

ln -sfn "${release_dir}" "${CURRENT_LINK}.new"
mv -Tf "${CURRENT_LINK}.new" "${CURRENT_LINK}"

echo "[3/7] 为 yaliaisol.com 建立独立 Nginx 站点..."
cat > "${NGINX_CONF}" <<EOF
server {
    listen 80;
    listen [::]:80;
    server_name ${APEX_DOMAIN} ${WWW_DOMAIN};

    root ${CURRENT_LINK};
    index index.html;
    charset utf-8;

    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;

    location = /index.html {
        add_header Cache-Control "no-cache";
    }

    location ~* \\.(?:css|js|png|jpg|jpeg|svg|webp|ico|zip|json)$ {
        try_files \$uri =404;
        expires 7d;
        add_header Cache-Control "public, max-age=604800, immutable";
    }

    location / {
        try_files \$uri \$uri/ /index.html;
    }
}
EOF

ln -sfn "${NGINX_CONF}" "${NGINX_LINK}"
nginx -t
systemctl reload nginx

echo "[4/7] 申请并绑定 yaliaisol.com 与 www 的 HTTPS 证书..."
certbot --nginx \
  --cert-name "${APEX_DOMAIN}" \
  -d "${APEX_DOMAIN}" \
  -d "${WWW_DOMAIN}" \
  --non-interactive \
  --agree-tos \
  --register-unsafely-without-email \
  --redirect \
  --keep-until-expiring

nginx -t
systemctl reload nginx

echo "[5/7] 检查 HTTPS、证书域名和首页状态..."
for domain_name in "${APEX_DOMAIN}" "${WWW_DOMAIN}"; do
  status_code="$(curl -fsS -o /dev/null -w '%{http_code}' --retry 5 --retry-all-errors "https://${domain_name}/")"
  [[ "${status_code}" == "200" ]]
done

certificate_names="$(
  echo | openssl s_client -connect "${WWW_DOMAIN}:443" -servername "${WWW_DOMAIN}" 2>/dev/null \
    | openssl x509 -noout -ext subjectAltName
)"
grep -Fq -- "DNS:${APEX_DOMAIN}" <<<"${certificate_names}"
grep -Fq -- "DNS:${WWW_DOMAIN}" <<<"${certificate_names}"

echo "[6/7] 核对线上品牌、微信二维码与两条备案信息..."
index_html="$(curl -fsS "https://${WWW_DOMAIN}/")"
grep -Fq -- "<title>亚里士多翔的 AI 世界｜有用的AI课</title>" <<<"${index_html}" || {
  echo "ERROR: 线上首页仍不是亚里士多翔网站。" >&2
  exit 1
}
asset_path="$(grep -oE 'src="/[^"]+\\.js"' <<<"${index_html}" | head -n 1 | cut -d '"' -f 2)"
[[ -n "${asset_path}" ]] || {
  echo "ERROR: 线上首页没有找到 JavaScript 资源。" >&2
  exit 1
}
for public_path in "${asset_path}" "/wechat-qr.jpg" "/xiangge-profile.jpg"; do
  public_status="$(curl -sS -o /dev/null -w '%{http_code}' "https://${WWW_DOMAIN}${public_path}" || true)"
  [[ "${public_status}" == "200" ]] || {
    echo "ERROR: 线上资源 ${public_path} 返回 HTTP ${public_status}。" >&2
    exit 1
  }
done

echo "[7/7] 完成。"
trap - ERR
echo "DEPLOY_SUCCESS"
echo "RELEASE=${release_id}"
echo "URL=https://${WWW_DOMAIN}/"
echo "NGINX=$(systemctl is-active nginx)"
