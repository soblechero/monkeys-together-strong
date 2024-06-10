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
Este módulo contiene las rutas de la API relacionadas con la autenticación de usuarios.
[FastAPI docs for Simple OAuth2 with Password and Bearer](https://fastapi.tiangolo.com/tutorial/security/simple-oauth2)

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
    Inicio de sesión con token compatible con OAuth2, se obtiene un token de acceso para futuras solicitudes
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
    Crea un nuevo usuario y devuelve un token de acceso para futuras solicitudes
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

# @router.post("/login/test-token", response_model=UserPublic)
# def test_token(current_user: CurrentUser) -> Any:
#     """
#     Test access token
#     """
#     return current_user
