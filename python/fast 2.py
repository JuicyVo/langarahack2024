from fastapi import FastAPI

# Creating the FastAPI instance
app = FastAPI()

# Defining a simple route
@app.get("/")
def read_root():
    return {"message": "Hello, World!"}