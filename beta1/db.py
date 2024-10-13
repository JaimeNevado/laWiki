from pymongo import MongoClient
from datetime import datetime

# Conectar a MongoDB (localmente)
client = MongoClient('mongodb://localhost:27017/')

# Crear o conectar a la base de datos 'miBaseDeDatos'
db = client['miBaseDeDatos']

# Crear o conectar a la colección 'wiki'
wiki_collection = db['wiki']

# Crear o conectar a la colección 'entry'
entry_collection = db['entry']

# Insertar un documento en la colección 'wiki'
nueva_wikiList = [{
    'Date': datetime.now(),
    'Descripcion': 'Descripción del wiki de prueba',
    'Name': 'Wiki de ejemplo'
},
 {
    'Date': datetime.now(),
    'Descripcion': 'Descripción del wiki de prueba2',
    'Name': 'Wiki de ejemplo'
}
]
resultado_wiki = wiki_collection.insert_many(nueva_wikiList)
print(f'Wikis guardada con id: {resultado_wiki}')

# Insertar un documento en la colección 'entry'
nueva_entry = {
    'Date': datetime.now(),
    'name': 'Entrada ejemplo',
    'text': 'Texto para la entrada de ejemplo'
}

resultado_entry = entry_collection.insert_one(nueva_entry)
print(f'Entry guardada con ID: {resultado_entry.inserted_id}')

