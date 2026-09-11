
from typing import List
from uuid import uuid4

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel


app = FastAPI(
    title="RailSahayata API",
    description="Railway maintenance task management backend",
    version="1.0.0",
)


# Allow frontend to communicate with backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class NewTask(BaseModel):
    department: str
    asset: str
    location: str
    defect: str
    criticality: str


class Task(NewTask):
    id: str
    priorityScore: int
    status: str


tasks: List[Task] = []


def calculate_priority(criticality: str) -> int:
    """
    Calculate priority score according to criticality.
    """

    scores = {
        "Critical": 100,
        "High": 75,
        "Medium": 50,
        "Low": 25,
    }

    return scores.get(criticality, 50)


@app.get("/")
def home():
    return {
        "message": "RailSahayata backend is running"
    }


@app.get("/health")
def health_check():
    return {
        "status": "healthy"
    }


@app.get("/api/tasks", response_model=List[Task])
def get_tasks():
    return tasks


@app.post("/api/tasks", response_model=Task)
def create_task(task_data: NewTask):
    new_task = Task(
        id=str(uuid4()),
        department=task_data.department,
        asset=task_data.asset,
        location=task_data.location,
        defect=task_data.defect,
        criticality=task_data.criticality,
        priorityScore=calculate_priority(
            task_data.criticality
        ),
        status="Pending",
    )

    tasks.append(new_task)

    return new_task