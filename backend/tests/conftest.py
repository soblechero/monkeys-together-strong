from collections.abc import Generator

import pytest
from fastapi.testclient import TestClient
from sqlalchemy import Engine
from sqlmodel import SQLModel, create_engine, Session, select
from sqlmodel.pool import StaticPool

from app.core.config import settings
from app.main import app
from app.models.user import UserCreate, User
from app.persistence import user_crud


@pytest.fixture(scope="session")
def engine() -> Generator[Engine, None, None]:
    # Usamos un motor SQLite en memoria con check_same_thread=False para testing,
    # con StaticPool para evitar problemas de multi-threading
    engine = create_engine("sqlite:///:memory:", connect_args={"check_same_thread": False}, poolclass=StaticPool)
    SQLModel.metadata.create_all(engine)
    yield engine
    SQLModel.metadata.drop_all(engine)


@pytest.fixture(scope="function")
def session(engine) -> Generator[Session, None, None]:
    connection = engine.connect()
    transaction = connection.begin_nested()
    session = Session(bind=connection)
    yield session
    session.close()
    transaction.rollback()
    connection.close()


@pytest.fixture(scope="module")
def client() -> Generator[TestClient, None, None]:
    with TestClient(app) as c:
        yield c

# @pytest.fixture(scope="module")
# def user_token_headers(client: TestClient, session: Session) -> dict[str, str]:
#     email = "userpytest@userpytest.py"
#     password = "testpass"
#
#     user = session.execute(select(User).where(User.email == email)).first()
#     if not user:
#         user_data = UserCreate(email=email, password=password)
#         user = User(
#             email=user_data.email,
#             hashed_password="hashedpassword"
#         )
#         session.add(user)
#         session.commit()
#
#     login_data = {"username": email, "password": password}
#     response = client.post("/login", data=login_data)
#     response.raise_for_status()
#     tokens = response.json()
#     return {"Authorization": f"Bearer {tokens['access_token']}"}
