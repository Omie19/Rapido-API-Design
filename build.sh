show_usage()
{
    echo "Invalid build arguments ..."
    echo "Usage ./build.sh <project-name>|all [push]"
    echo "Examples :"
    echo "1) ./build.sh rapido-instance"
    echo "2) ./build.sh rapido-instance push"
    echo "3) ./build.sh all"
    echo "1) ./build.sh all push"
    echo ""
}

echo ""
echo "********************************"
echo "Running build script for rapido"
echo "********************************"
echo ""


if [[ $# -eq 2 ]]; then

    if [[ ($1 = "rapido-db" || $1 = "rapido-instance") && $2 = "push" ]] ; then
        echo ""
        echo "--------------------------------"
        echo "Building $1 ..."
        echo "--------------------------------"
        echo ""
        docker build -t "isl-dsdc.ca.com:5000/apim-solutions/$1" $1
        echo ""
        echo "--------------------------------"
        echo "Pushing the $1 contaier to repo ..."
        echo "--------------------------------"
        echo ""
        docker push isl-dsdc.ca.com:5000/apim-solutions/$1
    elif [[ $1 = "all"  && $2 = "push" ]]; then
        echo ""
        echo "--------------------------------"
        echo "Building all rapido projects ..."
        echo "--------------------------------"
        echo ""
        docker build -t "isl-dsdc.ca.com:5000/apim-solutions/rapido-db" rapido-db
        docker build -t "isl-dsdc.ca.com:5000/apim-solutions/rapido-instance" rapido-instance

        echo ""
        echo "--------------------------------"
        echo "Pushing all containers to repo ..."
        echo "--------------------------------"
        echo ""
        docker push isl-dsdc.ca.com:5000/apim-solutions/rapido-db
        docker push isl-dsdc.ca.com:5000/apim-solutions/rapido-instance
    else
        show_usage
    fi
elif [[ $# -eq 1 ]]; then
    if [[ $1 = "rapido-db" || $1 = "rapido-instance" ]] ; then
        echo ""
        echo "--------------------------------"
        echo "Building $1 ..."
        echo "--------------------------------"
        echo ""
        docker build -t "isl-dsdc.ca.com:5000/apim-solutions/$1" $1
    elif [[ $1 = "all" ]] ; then
        echo ""
        echo "--------------------------------"
        echo "Building all rapido projects ..."
        echo "--------------------------------"
        echo ""
        docker build -t "isl-dsdc.ca.com:5000/apim-solutions/rapido-db" rapido-db
        docker build -t "isl-dsdc.ca.com:5000/apim-solutions/rapido-instance" rapido-instance
    else
        show_usage
    fi
else
    show_usage
fi
