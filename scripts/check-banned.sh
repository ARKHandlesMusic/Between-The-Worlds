#!/usr/bin/env bash
set -e
PATTERN='setTimeout|setInterval|requestAnimationFrame|Math\.random|Date\.now|new Date\(|transition:|animation:|@keyframes|useState|useEffect|localStorage|fetch\(|<img|<Img|<Video|<OffthreadVideo|framer-motion|gsap|react-spring|lottie'
if grep -rnE "$PATTERN" src --include=*.ts --include=*.tsx --include=*.css 2>/dev/null | grep -v 'allowed:'; then
  echo "Banned API found"; exit 1
fi
echo "banned check passed"
