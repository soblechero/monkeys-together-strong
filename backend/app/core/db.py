from sqlmodel import SQLModel, Session, create_engine, select

from app.core.config import settings
from app.models import User
from app.models.user import UserCreate
from app.persistence import user_crud

engine = create_engine(settings.DATABASE_URI)


# make sure all SQLModel models are imported (app.models) before initializing DB
# otherwise, SQLModel might fail to initialize relationships properly
# for more details: https://github.com/tiangolo/full-stack-fastapi-template/issues/28


def init_db(session: Session) -> None:
    # This works because the models are already imported and registered from app.models
    SQLModel.metadata.create_all(engine)

    user = session.exec(
        select(User).where(User.email == settings.FIRST_USER)
    ).first()
    if not user:
        user_in = UserCreate(
            email=settings.FIRST_USER,
            password=settings.FIRST_USER_PASSWORD,
        )
        user = user_crud.create_user(session=session, user_data=user_in)
