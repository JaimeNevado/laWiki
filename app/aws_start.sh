#!/bin/sh

run_app() {
    # Activate the virtual environment
    VENV_PATH="/home/ubuntu/venv"
    if [ ! -d "$VENV_PATH" ]; then
        echo "Virtual environment not found at $VENV_PATH"
        return 1
    fi

    rm -rf ./back_end/__pycache__
    
    #export PATH=$PATH:/home/ubuntu/.nvm/versions/node/v22.11.0/bin/npm:/usr/local/bin
    
    # Front end
    nohup bash -c "cd $(pwd)/front_end/ && npm install && npm run clean && npm run build && npm run start" > front_end.log 2>&1 &

    # Wiki controller
    nohup bash -c "source $VENV_PATH/bin/activate && cd $(pwd)/back_end/wiki/ && pip install -r requirements.txt && rm -rf __pycache__ && uvicorn wiki_controller:api --host 0.0.0.0 --port 13000" > wiki.log 2>&1 &

    # Article controller
    nohup bash -c "source $VENV_PATH/bin/activate && cd $(pwd)/back_end/articles/ && pip install -r requirements.txt && rm -rf __pycache__ && uvicorn article_controller:router --host 0.0.0.0 --port 13001" > article.log 2>&1 &

    # Comment controller
    nohup bash -c "source $VENV_PATH/bin/activate && cd $(pwd)/back_end/comments/ && pip install -r requirements.txt && rm -rf __pycache__ && uvicorn comment_controller:api --host 0.0.0.0 --port 13002" > comment.log 2>&1 &

    # Notifications controller
    nohup bash -c "source $VENV_PATH/bin/activate && cd $(pwd)/back_end/notifications/ && pip install -r requirements.txt && rm -rf __pycache__ && uvicorn notifications_controller:api --host 0.0.0.0 --port 13003" > notifications.log 2>&1 &

    # User controller
    nohup bash -c "source $VENV_PATH/bin/activate && cd $(pwd)/back_end/users/ && pip install -r requirements.txt && rm -rf __pycache__ && uvicorn user_controller:app --host 0.0.0.0 --port 13004" > users.log 2>&1 &

}

run_app "$@"
