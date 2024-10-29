# api_cliente.py
from fastapi import FastAPI
import httpx
from pydantic import BaseModel

app = FastAPI()

class Item(BaseModel):
    nombre: str
    descripcion: str

@app.post("/enviar-item")
async def enviar_item(item: Item):
    url = "http://127.0.0.1:8000/crear-item"  # URL de la API Servidor
    
    async with httpx.AsyncClient() as client:
        response = await client.post(url, json=item.dict())
    
    return response.json()

@app.post("/crearArticulo")