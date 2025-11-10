import random
import string
from datetime import datetime, timedelta
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session

from ..auth import (
    get_password_hash,
    verify_password,
    create_access_token,
    get_current_active_user,
)
from ..db.database import get_db
from ..db.models import User, PasswordReset
from ..models.auth import (
    UserRegister,
    UserLogin,
    UserResponse,
    Token,
    ForgotPasswordRequest,
    VerifyOTPRequest,
    ResetPasswordRequest,
    UserUpdate,
)

router = APIRouter()


def generate_otp(length: int = 6) -> str:
    """Generate a random OTP"""
    return "".join(random.choices(string.digits, k=length))


@router.post("/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
async def register(user_data: UserRegister, db: Session = Depends(get_db)):
    """Register a new user"""
    # Check if user already exists
    existing_user = db.query(User).filter(
        (User.email == user_data.email) | 
        (User.phone == user_data.phone if user_data.phone else False)
    ).first()
    
    if existing_user:
        if existing_user.email == user_data.email:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email already registered"
            )
        if existing_user.phone == user_data.phone:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Phone number already registered"
            )
    
    # Create new user
    hashed_password = get_password_hash(user_data.password)
    
    new_user = User(
        email=user_data.email,
        phone=user_data.phone,
        hashed_password=hashed_password,
        name=user_data.name,
        country=user_data.country,
        state=user_data.state,
        district=user_data.district,
        gender=user_data.gender,
        date_of_birth=user_data.date_of_birth,
    )
    
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    
    return new_user


@router.post("/login", response_model=Token)
async def login(user_credentials: UserLogin, db: Session = Depends(get_db)):
    """Login with email/phone and password"""
    # Find user by email or phone
    user = db.query(User).filter(
        (User.email == user_credentials.email_or_phone) |
        (User.phone == user_credentials.email_or_phone)
    ).first()
    
    if not user or not verify_password(user_credentials.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email/phone or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Account is inactive"
        )
    
    # Create access token
    access_token = create_access_token(data={"sub": str(user.id)})
    
    return {"access_token": access_token, "token_type": "bearer"}


@router.post("/login/form", response_model=Token)
async def login_form(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db)
):
    """Login with form data (for OAuth2 compatibility)"""
    user = db.query(User).filter(
        (User.email == form_data.username) |
        (User.phone == form_data.username)
    ).first()
    
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email/phone or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token = create_access_token(data={"sub": str(user.id)})
    
    return {"access_token": access_token, "token_type": "bearer"}


@router.post("/forgot-password")
async def forgot_password(request: ForgotPasswordRequest, db: Session = Depends(get_db)):
    """Request OTP for password reset"""
    user = db.query(User).filter(
        (User.email == request.email_or_phone) |
        (User.phone == request.email_or_phone)
    ).first()
    
    if not user:
        # Don't reveal if user exists or not for security
        return {"message": "If the account exists, an OTP has been sent"}
    
    # Generate OTP
    otp = generate_otp()
    
    # Create password reset record
    expires_at = datetime.utcnow() + timedelta(minutes=15)
    
    password_reset = PasswordReset(
        user_id=user.id,
        email_or_phone=request.email_or_phone,
        otp=otp,
        expires_at=expires_at,
    )
    
    db.add(password_reset)
    db.commit()
    
    # TODO: Production - Send OTP via email/SMS service (e.g., SendGrid, Twilio)
    # SECURITY WARNING: Returning OTP in response is for testing only!
    # In production, remove the 'otp' field and implement email/SMS delivery
    return {
        "message": "OTP has been sent",
        "otp": otp,  # TESTING ONLY - Remove in production and use email/SMS!
        "expires_in_minutes": 15
    }


@router.post("/verify-otp")
async def verify_otp(request: VerifyOTPRequest, db: Session = Depends(get_db)):
    """Verify OTP for password reset"""
    password_reset = db.query(PasswordReset).filter(
        PasswordReset.email_or_phone == request.email_or_phone,
        PasswordReset.otp == request.otp,
        PasswordReset.is_used == False,
        PasswordReset.expires_at > datetime.utcnow()
    ).order_by(PasswordReset.created_at.desc()).first()
    
    if not password_reset:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid or expired OTP"
        )
    
    return {"message": "OTP verified successfully"}


@router.post("/reset-password")
async def reset_password(request: ResetPasswordRequest, db: Session = Depends(get_db)):
    """Reset password with OTP"""
    password_reset = db.query(PasswordReset).filter(
        PasswordReset.email_or_phone == request.email_or_phone,
        PasswordReset.otp == request.otp,
        PasswordReset.is_used == False,
        PasswordReset.expires_at > datetime.utcnow()
    ).order_by(PasswordReset.created_at.desc()).first()
    
    if not password_reset:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid or expired OTP"
        )
    
    # Get user
    user = db.query(User).filter(User.id == password_reset.user_id).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    # Update password
    user.hashed_password = get_password_hash(request.new_password)
    
    # Mark OTP as used
    password_reset.is_used = True
    
    db.commit()
    
    return {"message": "Password reset successfully"}


@router.get("/me", response_model=UserResponse)
async def get_current_user_profile(current_user: User = Depends(get_current_active_user)):
    """Get current user profile"""
    return current_user


@router.put("/me", response_model=UserResponse)
async def update_current_user_profile(
    user_update: UserUpdate,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Update current user profile"""
    # Update fields if provided
    if user_update.name is not None:
        current_user.name = user_update.name
    if user_update.phone is not None:
        # Check if phone is already taken
        existing = db.query(User).filter(
            User.phone == user_update.phone,
            User.id != current_user.id
        ).first()
        if existing:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Phone number already in use"
            )
        current_user.phone = user_update.phone
    if user_update.country is not None:
        current_user.country = user_update.country
    if user_update.state is not None:
        current_user.state = user_update.state
    if user_update.district is not None:
        current_user.district = user_update.district
    if user_update.gender is not None:
        current_user.gender = user_update.gender
    if user_update.date_of_birth is not None:
        current_user.date_of_birth = user_update.date_of_birth
    
    db.commit()
    db.refresh(current_user)
    
    return current_user
