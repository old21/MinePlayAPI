#!/bin/bash
# Переходим в рабочую директорию
cd ../

# Загружаем переменные из .env
source .env

LIGHTGREEN='\033[1;32m'
RED='\033[0;31m'
NC='\033[0m'
printf "${LIGHTGREEN}"
printf '
    __  ____            ____  __           
   /  |/  (_)___  ___  / __ \/ /___ ___  __
  / /|_/ / / __ \/ _ \/ /_/ / / __ `/ / / /
 / /  / / / / / /  __/ ____/ / /_/ / /_/ / 
/_/  /_/_/_/ /_/\___/_/   /_/\__,_/\__, /  
                                  /____/   
'
printf "${NC}"

printf "${RED}Flasing ${NC}current keystore...\n\n"
rm -rf keystore

mkdir keystore && cd keystore
mkdir jwt && cd jwt

keys=("api" "launcher")


for i in "${!keys[@]}"
do
    mkdir ${keys[$i]} && cd ${keys[$i]}
    # Генерируем приватный RSA ключ
    openssl genrsa -out private.key 4096
    # Генерируем публичный ключ
    openssl rsa -in private.key -pubout -out public.key
    # Проверям валидный ли приватный ключ
    openssl rsa -noout -check -in private.key

    printf "Keypair ${LIGHTGREEN}${keys[$i]}${NC} generated. \n\n"

    cd ../
done

printf "${LIGHTGREEN}Good day ;) \n\n"