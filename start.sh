#!/usr/bin/env bash

# Directories
TOP=`git rev-parse --show-toplevel`
BACK="$TOP/backend"
FRONT="$TOP/frontend"
QDIR="$BACK/q"
OUT="$TOP/out"

function main {
  if [ "$1" == "clean" ]; then
    clean
  else 
    echo "run needs refinement"
  fi
}

# Kill servers and delete out/ directory
function clean {
  echo "Cleaning..."
  if [ -d "out/" ]; then 
    while IFS= read -r pid
    do
      kill -9 $pid
    done < "$OUT/pids.out"
    rm -rf $OUT
  fi
  echo "Cleaning completed."
}

# Shortcut to compile frontend and backend
function compile {
  cd $BACK
  pipenv run compile
  cd $FRONT
  yarn compile
  cd $TOP
}

# Shortcut to lint frontend and backend
function lint {
  cd $BACK
  pipenv run lint
  cd $FRONT
  yarn lint
  cd $TOP
}

# Shortcut to format frontend and backend
function format {
  cd $BACK
  pipenv run format
  cd $FRONT
  yarn format
  cd $TOP
}

# Opens python virtual envrionment if not already within it
function setVirtual {
  pyversion=`pip -V`
  if [[ $pyversion != *virtualenvs* ]]; then
    cd $BACK
    pipenv shell
    cd -
  fi
}

function run {
  # Create out directory 
  mkdir out
  echo "Created out directory"

  # Run Python Server
  python3 $BACK/manage.py runserver &>> $OUT/runserver.out &
  echo $! &>> $OUT/pids.out
  echo "Python server started."

  # Run Q 5010
  cd $QDIR
  q tick.q tables . -p 5010 &>> $OUT/tick.out &
  echo $! &>> $OUT/pids.out
  echo "q tick started."

  # Run Q 5011
  cd $QDIR/tick
  q tick/r.q -p 5011 &>> $OUT/r.out &
  echo $! &>> $OUT/pids.out
  cd $TOP
  echo "q r started."

  # Run Feed Handler
  python3 $BACK/qsync/feed_handler.py &>> $OUT/feed_handler.out &
  echo $! &>> $OUT/pids.out
  echo "Python feed handler started."

  # Run Subscriber
  python3 $BACK/qsync/subscriber.py &>> $OUT/subscriber.out &
  echo $! &>> $OUT/pids.out
  echo "Python subscriber started."

  # Run Frontend
  cd $FRONT
  yarn start &>> $OUT/yarn.out &
  echo $! &>> $OUT/pids.out
  cd $TOP
  echo "frontend server started."

  echo "All Servers Started."
}

main $1