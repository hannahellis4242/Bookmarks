check_or_create_dir (){
if [ -d $1 ]
then
    echo "$1 exists"
else
    mkdir $1
    echo "$1 created"
fi
}

check_or_create_dir "mongodb"
check_or_create_dir "mongodb/data"
check_or_create_dir "mongodb/logs"