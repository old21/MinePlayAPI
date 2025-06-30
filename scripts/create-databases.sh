#!/bin/bash

set -eu

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

function create_database() {
  local database=$1
  printf "Creating database ${LIGHTGREEN}$database${NC}...\n\n"
  psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" <<-EOSQL
    CREATE DATABASE $database;
    GRANT ALL PRIVILEGES ON DATABASE $database TO $POSTGRES_USER;
EOSQL
}

#UPD use array, for list DBs to create
DBs=($POSTGRES_DB2)

for i in "${!DBs[@]}"
do
    create_database ${DBs[$i]}
    printf "${LIGHTGREEN}Database ${DBs[$i]} created successfully! \n\n"
done
#create_database $POSTGRES_DB3