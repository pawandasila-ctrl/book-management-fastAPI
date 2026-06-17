from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from ..database import get_db
from ..models import Book
from ..schemas import BookCreate, BookUpdate, BookResponse
from ..auth import get_current_user_id

router = APIRouter()

@router.get("/", response_model=List[BookResponse])
def get_books(db: Session = Depends(get_db)):
    books = db.query(Book).all()
    return books

@router.post("/create", response_model=BookResponse, status_code=status.HTTP_201_CREATED)
def create_book(book_in: BookCreate, db: Session = Depends(get_db), current_user_id: int = Depends(get_current_user_id)):
    db_book = Book(
        publisher=book_in.publisher,
        name=book_in.name,
        date=book_in.date,
        Cost=book_in.Cost,
        owner_id=current_user_id
    )
    db.add(db_book)
    db.commit()
    db.refresh(db_book)
    return db_book

@router.put("/update/{book_id}", response_model=BookResponse)
def update_book(book_id: int, book_in: BookUpdate, db: Session = Depends(get_db), current_user_id: int = Depends(get_current_user_id)):
    db_book = db.query(Book).filter(Book.id == book_id).first()
    if not db_book:
        raise HTTPException(status_code=404, detail="Book not found")

    if db_book.owner_id != current_user_id:
        raise HTTPException(status_code=403, detail="You are not authorized to update this book")
    
    db_book.publisher = book_in.publisher
    db_book.name = book_in.name
    db_book.date = book_in.date
    db_book.Cost = book_in.Cost
    
    db.commit()
    db.refresh(db_book)
    return db_book

@router.delete("/delete/{book_id}")
def delete_book(book_id: int, db: Session = Depends(get_db), current_user_id: int = Depends(get_current_user_id)):
    db_book = db.query(Book).filter(Book.id == book_id).first()
    if not db_book:
        raise HTTPException(status_code=404, detail="Book not found")

    if db_book.owner_id != current_user_id:
        raise HTTPException(status_code=403, detail="You are not authorized to delete this book")
    
    db.delete(db_book)
    db.commit()
    return {"result": "Book deleted"}
