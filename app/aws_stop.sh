#!/bin/bash

clean_processes(){
	# Define the file containing the PIDs
	# PIDS_FILE="pids.txt"

	# # Check if the file exists
	# if [[ ! -f "$PIDS_FILE" ]]; then
	#     echo "Error: PID file '$PIDS_FILE' does not exist."
	#     return 1
	# fi

	# # Read the file line by line
	# while IFS= read -r pid; do
	#     # Ensure the PID is a valid number
	#     if [[ "$pid" =~ ^[0-9]+$ ]]; then
	# 	echo "Sending SIGKILL to PID: $pid"
	# 	kill -9 "$pid" 2>/dev/null
	# 	if [[ $? -eq 0 ]]; then
	# 	    echo "Successfully killed PID $pid"
	# 	else
	# 	    echo "Failed to kill PID $pid or process does not exist"
	# 	fi
	#     else
	# 	echo "Invalid PID: $pid"
	#     fi
	# done < "$PIDS_FILE"

	pkill -f "next-server"
	pkill -f "uvicorn"
	rm -rf ./*.log
	# Optionally, clear the PIDs file after processing
	# > "$PIDS_FILE"

	echo "All processes from '$PIDS_FILE' have been processed."
}

clean_processes
