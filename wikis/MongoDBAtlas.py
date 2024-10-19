from pymongo import MongoClient
from datetime import datetime


uri = "mongodb+srv://wikiAdmin:_P5JP53hT8@cluster0.w2vxl.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
#mongodb+srv://<db_username>:<db_password>@cluster0.w2vxl.mongodb.net/ for compass
# Conectar a MongoDB (localmente)
client = MongoClient(uri)

# Crear o conectar a la base de datos 'miBaseDeDatos'
db = client['laWIki']

