if [[ $# -eq 0 ]]; then
    echo "Pulling 1 rapido container (rapido-instance) ..."
    echo "--------------------------------"
    echo ""
    docker-compose -f docker-compose.yml pull
    echo "Running rapido using 1 container (rapido-instance) ..."
    echo "--------------------------------"
    echo ""
    docker-compose -f docker-compose.yml up
elif [[ $1 = "stage" ]]; then
    echo "Pulling 2 rapido containers (rapido-instance, rapido-db) ..."
    echo "--------------------------------"
    echo ""
    docker-compose -f docker-compose-local.yml pull
    echo "Running rapido using 2 containers (rapido-instance, rapido-db) ..."
    echo "--------------------------------"
    echo ""
    docker-compose -f docker-compose-local.yml up
elif [[ $1 = "local" ]]; then
    echo "Running rapido using 2 containers (rapido-instance, rapido-db) ..."
    echo "--------------------------------"
    echo ""
    docker-compose -f docker-compose-local.yml up
else
    echo ""
    echo "Invalid run.sh argument $1 ..."
    echo "Valid arguments are 'stage'|'local'"
    echo ""
fi
