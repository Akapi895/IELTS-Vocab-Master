from fastapi import APIRouter

router = APIRouter()

@router.get("/ping")
def ping_exam():
    return {"message": "User API up"}