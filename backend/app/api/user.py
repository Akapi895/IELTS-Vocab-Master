from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.models.user import User
from app.models.user_goal import UserGoal
from app.schemas.user_sche import UserUpdate, UserChangePassword, UserInfo, UserGoalInfo, UserGoalUpdate
from app.crud.user_crud import update_user_info, change_user_password, update_user_goal, create_user_goal
from app.dependencies.auth import get_current_user

router = APIRouter()

@router.get("/count")
def count_users(db: Session = Depends(get_db)):
    total = db.query(User).count()
    return {"total_users": total}

@router.get("/all", response_model=List[UserInfo])
def get_all_users(db: Session = Depends(get_db)):
    users = db.query(User).all()
    return users

@router.get("/me", response_model=UserInfo)
def get_me(current_user: User = Depends(get_current_user)):
    # Không trả về password_hash
    return current_user

@router.put("/change-password")
def change_password(
    data: UserChangePassword,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Đổi mật khẩu cho user hiện tại
    success = change_user_password(db, current_user.email, data.old_password, data.new_password)
    
    if not success:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Old password is incorrect")
    return {"msg": "Password changed successfully"}

@router.put("/update-info", response_model=UserInfo)
def update_me(
    user_update: UserUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Đổi thông tin name, dob cho user hiện tại
    user = update_user_info(db, current_user.email, user_update.name, user_update.dob)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

### Goal 
@router.put("/update-goal", response_model=UserGoalInfo)
def update_goal(
    goal_data: UserGoalUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    goal = update_user_goal(db, current_user.id, goal_data)
    if not goal:
        raise HTTPException(status_code=404, detail="Goal not found")
    return goal

@router.get("/goal", response_model=UserGoalInfo)
def get_goal(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    goal = db.query(UserGoal).filter(
        UserGoal.user_id == current_user.id,
        UserGoal.is_active == True
    ).first()
    if not goal:
        raise HTTPException(status_code=404, detail="Goal not found")
    return goal

@router.post("/create-goal", response_model=UserGoalInfo)
def create_goal(
    goal_data: UserGoalUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    goal = create_user_goal(db, current_user.id, goal_data)
    if not goal:
        raise HTTPException(status_code=400, detail="Cannot create goal")
    return goal