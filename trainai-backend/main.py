from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
import openai
from dotenv import load_dotenv
import os

load_dotenv()
api_key = os.getenv("OPENAI_API_KEY")
openai.api_key = api_key

app = FastAPI()

# Allow frontend to access backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {"message": "Workout AI backend is running"}

@app.post("/generate")
async def generate_workout(request: Request):
    data = await request.json()
    age = data.get("age")
    height = data.get("height")
    weight = data.get("weight")
    gender = data.get("gender")
    goal = data.get("goal")
    time = data.get("time")
    activity = data.get("activity")
    preference = data.get("preference")

    prompt = (
        f"Create a personalized 5-day workout plan for a {age}-year-old {gender} "
        f"who is {height} cm tall, weighs {weight} lbs, has {time} per day to train, "
        f"and prefers {preference} workouts. Their activity level is {activity}, and their goal is: {goal}.\n\n"
        f"Include warm-ups, cooldowns, rest days, and adjust intensity according to their goal.\n\n"
        f"Also, using the Mifflin-St Jeor Equation and the given details (age, height, weight, gender, and activity level), "
        f"calculate and list the estimated daily calorie intake for:\n"
        f"• Extreme Cut\n• Moderate Cut\n• Maintenance\n• Moderate Bulk\n• Extreme Bulk\n\n"
        f"Show the calorie targets clearly at the top before the workout plan."
    )

    response = openai.ChatCompletion.create(
        model="gpt-3.5-turbo",
        messages=[
            {"role": "system", "content": "You are an experienced fitness and nutrition coach."},
            {"role": "user", "content": prompt}
        ]
    )

    plan = response["choices"][0]["message"]["content"].strip()
    return {"plan": plan}
