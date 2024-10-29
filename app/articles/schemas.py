def individual_serial(article) -> dict:
    return {
        "id" : str(article["_id"]),
        "name" : article["name"],
        "text" : article["text"],
        "attachedFiles" : article["attachedFiles"],
        "author" : article["author"],
        "images" : article["images"],
        "googleMaps" : article["googleMaps"],
        "date" : article["date"]    
    }

def list_serial(articles) -> list:
    return[individual_serial(article) for article in articles]