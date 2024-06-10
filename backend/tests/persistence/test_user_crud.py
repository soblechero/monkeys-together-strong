import pytest
from sqlmodel import Session

from app.persistence.user_crud import create_user, get_user_by_email
from app.models.user import UserCreate, User


@pytest.fixture(scope="function")
def test_user(session: Session):
    user_in = UserCreate(email="test@example.com", password="securepassword")
    user = create_user(session=session, user_data=user_in)
    session.commit()
    return user


def test_create_user(session: Session):
    user_data = UserCreate(email="unique@example.com", password="securepassword")
    user = create_user(session=session, user_data=user_data)
    assert user.email == "unique@example.com"
    assert user.id is not None


def test_get_user_by_email(session: Session, test_user: User):
    user = get_user_by_email(session=session, email="test@example.com")
    assert user is not None
    assert user.email == "test@example.com"
