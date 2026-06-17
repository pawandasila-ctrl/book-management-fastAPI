from sqlalchemy import Column, Integer, String, Float, ForeignKey
from sqlalchemy.orm import relationship
from .database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(255), unique=True, index=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    
    books = relationship("Book", back_populates="owner_user")

class Book(Base):
    __tablename__ = "book"

    id = Column(Integer, primary_key=True, index=True)
    publisher = Column(String(255), nullable=False)
    name = Column(String(255), nullable=False)
    date = Column(String(255), nullable=False)
    Cost = Column(Float, nullable=False)

    owner_id = Column(Integer, ForeignKey("users.id"), nullable=False)

    owner_user = relationship("User", back_populates="books")

    @property
    def owner(self) -> str:
        return self.owner_user.username if self.owner_user else ""

