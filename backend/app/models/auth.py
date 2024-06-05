from sqlmodel import SQLModel


class Token(SQLModel):
    access_token: str
    token_type: str = "bearer"


# Contenido codificado en un token JWT (id del usuario, subject)
class TokenPayload(SQLModel):
    sub: int | None = None
