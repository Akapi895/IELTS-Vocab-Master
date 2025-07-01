from sqlalchemy.orm import Session
from app.models.user import User
from app.utils.hashing import verify_password, hash_password
from app.models.user_goal import UserGoal

def get_user_by_email(db: Session, email: str):
    return db.query(User).filter(User.email == email).first()

def update_user_info(db: Session, email: str, name: str, dob):
    user = get_user_by_email(db, email)
    if not user:
        return None
    user.name = name
    user.dob = dob
    db.commit()
    db.refresh(user)
    return user

def change_user_password(db: Session, email: str, old_password: str, new_password: str):
    user = get_user_by_email(db, email)
    if not user:
        return False
    if not verify_password(old_password, user.password_hash):
        return False
    user.password_hash = hash_password(new_password)
    db.commit()
    db.refresh(user)
    return True

def update_user_goal(db: Session, user_id: int, goal_data):
    goal = db.query(UserGoal).filter(UserGoal.user_id == user_id, UserGoal.is_active == True).first()
    if not goal:
        return None
    if goal_data.target_band is not None:
        goal.target_band = goal_data.target_band
    if goal_data.deadline is not None:
        goal.deadline = goal_data.deadline
    if goal_data.current_score is not None:
        goal.current_score = goal_data.current_score
    if goal_data.is_active is not None:
        goal.is_active = goal_data.is_active
    db.commit()
    db.refresh(goal)
    return goal

def create_user_goal(db: Session, user_id: int, goal_data):
    from app.models.user_goal import UserGoal
    goal = UserGoal(
        user_id=user_id,
        target_band=goal_data.target_band,
        deadline=goal_data.deadline,
        current_score=goal_data.current_score,
        is_active=goal_data.is_active if goal_data.is_active is not None else True
    )
    db.add(goal)
    db.commit()
    db.refresh(goal)
    return goal