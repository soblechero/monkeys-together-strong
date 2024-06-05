from datetime import timedelta
from typing import Any, Annotated

from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import OAuth2PasswordRequestForm
from fastapi import status

from app.api.deps import CurrentUser, SessionDep
from app.core import security
from app.core.config import settings
from app.models.auth import Token
from app.models.user import UserPublic, UserCreate
from app.persistence import user_crud

"""
This file contains the routes for authentication. It includes the following routes:

1. Login - Get a token for future requests
2. Signup - Create a new user and return a token for future requests
3. Test token - Test the access token

Each route is responsible for handling the request and response. 
It uses the user_crud service to interact with the database.
The routes are protected by the dependency injection of the current user and the session.

"""

router = APIRouter()


@router.post(
    "/login", response_model=Token
)
def login(
        session: SessionDep,
        form_data: Annotated[OAuth2PasswordRequestForm, Depends()]
) -> Token:
    """
    OAuth2 compatible token login, get an access token for future requests
    """
    user = user_crud.authenticate(
        session=session, email=form_data.username, password=form_data.password
    )
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Incorrect email or password")
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    return Token(
        access_token=security.create_access_token(
            user.id, expires_delta=access_token_expires
        )
    )


@router.post(
    "/signup", response_model=Token
)
def signup(*, session: SessionDep, user_data: UserCreate) -> Token:
    """
    Create new user and return access token for future requests
    """
    user = user_crud.get_user_by_email(session=session, email=user_data.email)
    if user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="The user with this email already exists in the system.",
        )
    user = user_crud.create_user(session=session, user_data=user_data)
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    return Token(
        access_token=security.create_access_token(
            user.id, expires_delta=access_token_expires
        )
    )


@router.post("/login/test-token", response_model=UserPublic)
def test_token(current_user: CurrentUser) -> Any:
    """
    Test access token
    """
    return current_user
