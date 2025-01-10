# Crear una nueva consola y ejecutar el front-end
Start-Process powershell -ArgumentList "cd .\front_end; npm run dev"

# Crear una nueva consola y ejecutar el backend - wiki
Start-Process powershell -ArgumentList "cd .\back_end\wiki; uvicorn wiki_controller:api --reload --port 13000"

# Crear una nueva consola y ejecutar el backend - artículos
Start-Process powershell -ArgumentList "cd .\back_end\articles; uvicorn article_controller:router --reload --port 13001"

# Crear una nueva consola y ejecutar el backend - comentarios
Start-Process powershell -ArgumentList "cd .\back_end\comments; uvicorn comment_controller:api --reload --port 13002"

# Crear una nueva consola y ejecutar el backend - notificaciones
Start-Process powershell -ArgumentList "cd .\back_end\notifications; uvicorn notifications_controller:api --reload --port 13003"

#Crear una nueva consola y ejecutar el backend -usuarios
Start-Process powershell -ArgumentList "cd .\back_end\users; uvicorn user_controller:app --reload --port 13004"