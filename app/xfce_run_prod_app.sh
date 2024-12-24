#!/bin/sh

run_app() {
    if [ -z "$1" ]; then
        echo "Usage: $0 <path_to_virtual_environment>"
        echo "Example: $0 /path/to/virtual/environment"
        return 1
    fi

    VIRTUALENV_PATH="$1"

    # Front end
    xfce4-terminal --tab --title="Front" --command "bash -c 'cd $(pwd)/front_end/ && npm run clean && npm run build && npm run start'" --hold

    # Wiki controller
    xfce4-terminal --tab --title="Wiki" --command "bash -c 'source $VIRTUALENV_PATH/bin/activate && cd $(pwd)/back_end/wiki/ && rm -rf __pycache__ && uvicorn wiki_controller:api --reload --port 13000'" --hold

    # Article controller
    xfce4-terminal --tab --title="Article" --command "bash -c 'source $VIRTUALENV_PATH/bin/activate && cd $(pwd)/back_end/articles/ && rm -rf __pycache__ && uvicorn article_controller:router --reload --port 13001'" --hold

    # Comment controller
    xfce4-terminal --tab --title="Comment" --command "bash -c 'source $VIRTUALENV_PATH/bin/activate && cd $(pwd)/back_end/comments/ && rm -rf __pycache__ && uvicorn comment_controller:api --reload --port 13002'" --hold
    
    # Notifications controller
    xfce4-terminal --tab --title="Notifications" --command "bash -c 'source $VIRTUALENV_PATH/bin/activate && cd $(pwd)/back_end/notifications/ && rm -rf __pycache__ && uvicorn notifications_controller:api --reload --port 13003'" --hold


}

run_app "$@"
