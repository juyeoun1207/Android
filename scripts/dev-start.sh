#!/bin/bash
unset npm_config_prefix
# 1. nvm이 shell에 로드되어 있는지 확인 (Mac에서는 이 설정이 중요)
export NVM_DIR="$HOME/.nvm"
# nvm.sh 불러오기
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

# 2. 원하는 Node 버전 사용
nvm use 24.3.0

# 3. Metro 서버 실행
npx react-native start --reset-cache
