from pydantic import BaseModel, EmailStr, condecimal
from fastapi import FastAPI, HTTPException
from typing import List
from User import User
from database_connection import MongoDBAtlas
from la_wiki_utils import serialize_document
app = FastAPI()
path = "/api/v1/"
# Database connection
db = MongoDBAtlas()
db.connect()
collection = db.get_collection("Users")


# Crear un nuevo User
@app.post(path + "users/")
def crear_User(user: User):
    userDict = dict(user)
    print("User post: ", userDict )
    # Verificar si el User ya existe en la base de datos (por googleID)
    if collection.find_one({"googleID":user.googleID}) is None:
        collection.insert_one(userDict)
        return {"message": "the user singUp succesfully"}
    else:
        return {"message": "the user signIn succesfully"}
    #Si no está hacer post

    



# Leer un User por googleID
@app.get(path +"users/{googleID}", response_model=User)
def leer_User(googleID: str):
    
        usuario = collection.find_one({"googleID": googleID})
        
        # Si no se encuentra el usuario, lanza una excepción HTTP 404
        if not usuario:
            raise HTTPException(status_code=404, detail="User no encontrado")
        
        # Devuelve el usuario encontrado (conversión a dict si es necesario)
        return usuario

@app.get(path +"users/")
def leer_Users():
    
        usuarios = collection.find()
        
        # Si no se encuentra el usuario, lanza una excepción HTTP 404
        if not usuarios:
            raise HTTPException(status_code=404, detail="User no encontrado")
        
        # Devuelve el usuario encontrado (conversión a dict si es necesario)
        serialized_usarios = [serialize_document(usuario) for usuario in usuarios]
        return serialized_usarios
@app.put(path + "users/{googleID}")
def actualizar_rating(googleID: str,nuevoRating: float):
    # Buscar el usuario por googleID
    usuario = collection.find_one({"googleID": googleID})

    if not usuario:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Obtener el rating actual y el número de comentarios
    ratingActual = usuario.get('rating', 0.0)
    nComentarios = usuario.get('nComentarios', 0)

    # Calcular el nuevo rating ponderado
    nuevoRatingCalculado = ((ratingActual * nComentarios) + nuevoRating) / (nComentarios + 1)

    # Actualizar el rating y el número de comentarios
    collection.find_one_and_update(
        {"googleID": googleID},
        {
            "$set": {
                "rating": nuevoRatingCalculado,
                "nComentarios": nComentarios + 1
            }
        }
    )

    return {"message": "Rating updated successfully"}


@app.delete(path + "users/{googleID}")
def eliminar_usario(googleID: str):
    deleted = collection.find_one_and_delete({"googleID": googleID})
    if not deleted:
        raise HTTPException(status_code=404, detail="Article not found")
    return {"message": "User was deleted successfully"}