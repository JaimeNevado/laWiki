#!/bin/bash

clean_processes(){
	pkill -f "next-server"
	pkill -f "uvicorn"
	rm -rf ./*.log
}

clean_processes
