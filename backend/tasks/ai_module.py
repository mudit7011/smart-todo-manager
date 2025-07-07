import os
import requests
from dotenv import load_dotenv
from datetime import datetime, timedelta
import json
import re

load_dotenv()

GROQ_API_KEY = os.getenv("GROQ_API_KEY")

MOCK_CATEGORIES = [
    {"id": 3, "name": "Career"},
    {"id": 4, "name": "Personal"},
    {"id": 5, "name": "Health"},
    {"id": 6, "name": "Urgent"},
]

def map_ai_category_to_id(ai_suggested_category_name):
    if not ai_suggested_category_name:
        return None
    lower_ai_name = ai_suggested_category_name.lower().strip()
    for cat in MOCK_CATEGORIES:
        if cat["name"].lower() == lower_ai_name:
            return cat["id"]
    if "career" in lower_ai_name or "job" in lower_ai_name or "work" in lower_ai_name:
        for cat in MOCK_CATEGORIES:
            if cat["name"].lower() == "career": return cat["id"]
    elif "personal" in lower_ai_name or "life" in lower_ai_name or "hobby" in lower_ai_name:
        for cat in MOCK_CATEGORIES:
            if cat["name"].lower() == "personal": return cat["id"]
    elif "health" in lower_ai_name or "medical" in lower_ai_name or "fitness" in lower_ai_name:
        for cat in MOCK_CATEGORIES:
            if cat["name"].lower() == "health": return cat["id"]
    elif "urgent" in lower_ai_name or "priority" in lower_ai_name or "immediate" in lower_ai_name:
        for cat in MOCK_CATEGORIES:
            if cat["name"].lower() == "urgent": return cat["id"]
    for cat in MOCK_CATEGORIES:
        if cat["name"].lower() == "personal":
            return cat["id"]
    return None

def get_task_suggestions(title, description, category, context_list):
    today_date = datetime.now().strftime("%Y-%m-%d")
    current_year = datetime.now().year

    context_text = "\n".join([f"- {item}" for item in context_list]) 
    context_text_with_date = f"Current Date: {today_date}.\nUser's Relevant Context History:\n{context_text}"

    prompt = f"""
You are a highly intelligent and proactive task manager AI. Your primary goal is to provide insightful and comprehensive suggestions for a user's task by performing a deep and cross-referential analysis of their entire provided context history.

Based on the task title and the *entire* user's context history, return the following fields in JSON:
- enhanced_description: Rewrite the task description comprehensively, integrating details and insights from the task title AND the relevant parts of the context history.
- suggested_deadline: Recommend a realistic deadline in YYYY-MM-DD format. If the task title or context explicitly mentions a specific number of days/weeks, a relative term (e.g., "tomorrow", "next week"), or a specific date, calculate that as the primary deadline relative to the Current Date. Otherwise, suggest a reasonable future date, never in the past.
- priority_score: A number from 0 to 1 based on urgency (1 being most urgent, 0 least).
- suggested_category: Suggest a category based on task title and context. MUST be one of: "Career", "Personal", "Health", "Urgent". Do NOT suggest any other categories or variations.
- contextual_suggestions: A list of additional, actionable suggestions or sub-tasks directly derived from your *comprehensive analysis of the entire context history* that are relevant to the main task. These should be proactive and anticipate potential needs or connections across different context entries. If no relevant suggestions can be made from the context, return an empty list.

Here are some examples of desired output for priority_score, deadlines, and contextual_suggestions:

TASK TITLE: Call client ASAP
CONTEXT:
Current Date: {today_date}.
User's Relevant Context History:
- Client waiting for update.
- Sent previous report on Monday.
Return only JSON:
{{
  "enhanced_description": "Contact client immediately to provide the urgent update they are waiting for, and perhaps reference the previous report sent on Monday.",
  "suggested_deadline": "{datetime.now().strftime('%Y-%m-%d')}",
  "priority_score": 0.95,
  "suggested_category": "Career",
  "contextual_suggestions": [
    "Review the last report sent to the client on Monday before calling.",
    "Prepare a brief summary of the key changes since the last report."
  ]
}}

TASK TITLE: Prepare for SDE interview
CONTEXT:
Current Date: {today_date}.
User's Relevant Context History:
- You have a mock interview in 2 days.
- Your resume is pending update.
- Review System Design concepts tonight.
- Met with John (recruiter) last week.
Return only JSON:
{{
  "enhanced_description": "Prepare comprehensively for a Software Development Engineer (SDE) interview by reviewing coding concepts, practicing common interview questions, and incorporating feedback from the mock interview. This task is crucial for the interview.",
  "suggested_deadline": "{(datetime.now() + timedelta(days=2)).strftime('%Y-%m-%d')}",
  "priority_score": 0.85,
  "suggested_category": "Career",
  "contextual_suggestions": [
    "Update your resume with recent projects and skills.",
    "Review System Design concepts tonight as planned.",
    "Practice common interview questions related to data structures and algorithms.",
    "Follow up with John (recruiter) after the mock interview."
  ]
}}

TASK TITLE: Revised what topics should I covered in exam
CONTEXT:
Current Date: {today_date}.
User's Relevant Context History:
- Ready for class presentation.
- Need to study for upcoming math exam.
- Professor mentioned chapters 3-5 are key.
- Study group meeting on Friday.
Return only JSON:
{{
  "enhanced_description": "Review and revise all necessary topics for the upcoming math exam, focusing on key chapters and preparing for the study group.",
  "suggested_deadline": "{(datetime.now() + timedelta(days=3)).strftime('%Y-%m-%d')}",
  "priority_score": 0.7,
  "suggested_category": "Personal",
  "contextual_suggestions": [
    "Prioritize studying chapters 3-5 as highlighted by the professor.",
    "Prepare specific questions for the study group meeting on Friday.",
    "Allocate time for a quick review of class presentation material as well, if relevant to the exam."
  ]
}}

TASK TITLE: Research new hobby ideas
CONTEXT:
Current Date: {today_date}.
User's Relevant Context History:
- Free time next month.
- Interested in outdoor activities and crafts.
- Saw a great pottery class advertisement last week.
- Need to declutter the garage first.
Return only JSON:
{{
  "enhanced_description": "Explore and research various new hobby ideas, specifically focusing on outdoor activities and craft-related pursuits, considering upcoming free time and initial preparation tasks.",
  "suggested_deadline": "{(datetime.now() + timedelta(days=30)).strftime('%Y-%m-%d')}",
  "priority_score": 0.1,
  "suggested_category": "Personal",
  "contextual_suggestions": [
    "Look into the pottery class advertised last week.",
    "Start decluttering the garage to make space for new hobby materials.",
    "Search for beginner-friendly outdoor activity groups."
  ]
}}

---

TASK TITLE: {title}
CONTEXT:
{context_text_with_date}
Return only JSON:
{{
  "enhanced_description": "...",
  "suggested_deadline": "YYYY-MM-DD",
  "priority_score": 0.5,
  "suggested_category": "Career",
  "contextual_suggestions": []
}}
"""

    headers = {
        "Authorization": f"Bearer {GROQ_API_KEY}",
        "Content-Type": "application/json"
    }
    body = {
        "model": "llama3-8b-8192", # Adjust model as needed
        "messages": [
            {"role": "system", "content": "You are a highly intelligent and proactive task manager AI. Perform comprehensive cross-referential analysis of the user's entire context history to provide insightful and actionable suggestions. Always prioritize user's stated goals and implicit needs derived from context."},
            {"role": "user", "content": prompt}
        ],
        "temperature": 0.2,
        "max_tokens": 512,
        "stop": None
    }

    try:
        response = requests.post(
            "https://api.groq.com/openai/v1/chat/completions",
            headers=headers,
            json=body
        )
        response.raise_for_status()
        data = response.json()
        message = data['choices'][0]['message']['content'].strip()

        match = re.search(r'{.*}', message, re.DOTALL)
        if match:
            ai_suggestions = json.loads(match.group(0))

            ai_suggestions['contextual_suggestions'] = ai_suggestions.get('contextual_suggestions', [])
            if not isinstance(ai_suggestions['contextual_suggestions'], list):
                ai_suggestions['contextual_suggestions'] = []

            ai_suggested_category_name = ai_suggestions.get("suggested_category")
            if ai_suggested_category_name:
                mapped_category_id = map_ai_category_to_id(ai_suggested_category_name)
                ai_suggestions["suggested_category_id"] = mapped_category_id
            else:
                ai_suggestions["suggested_category_id"] = None

            ai_suggestions['enhanced_description'] = ai_suggestions.get('enhanced_description', title)

            suggested_deadline_str = ai_suggestions.get('suggested_deadline')
            if suggested_deadline_str:
                try:
                    parsed_date = datetime.strptime(suggested_deadline_str, "%Y-%m-%d").date()
                    if parsed_date < datetime.now().date():
                        temp_date = parsed_date.replace(year=datetime.now().year)
                        if temp_date < datetime.now().date():
                            parsed_date = temp_date.replace(year=datetime.now().year + 1)
                        else:
                            parsed_date = temp_date
                    ai_suggestions['suggested_deadline'] = parsed_date.strftime("%Y-%m-%d")
                except ValueError:
                    ai_suggestions['suggested_deadline'] = (datetime.now() + timedelta(days=7)).strftime("%Y-%m-%d")
            else:
                ai_suggestions['suggested_deadline'] = (datetime.now() + timedelta(days=7)).strftime("%Y-%m-%d")

            ai_suggestions['priority_score'] = ai_suggestions.get('priority_score', 0.5)
            try:
                ai_suggestions['priority_score'] = float(ai_suggestions['priority_score'])
                ai_suggestions['priority_score'] = max(0.0, min(1.0, ai_suggestions['priority_score']))
            except (ValueError, TypeError):
                ai_suggestions['priority_score'] = 0.5

            ai_suggestions['suggested_category'] = ai_suggestions.get('suggested_category', 'Personal')
            ai_suggestions['suggested_category_id'] = ai_suggestions.get('suggested_category_id', map_ai_category_to_id('Personal'))

            return ai_suggestions
        else:
            raise ValueError("No JSON found in Groq response.")
    except Exception as e:
        print(" Groq API Error:", e)
        print("Full Response Text:", response.text if 'response' in locals() else 'No response')
        return {
            "enhanced_description": title,
            "suggested_deadline": (datetime.now() + timedelta(days=7)).strftime("%Y-%m-%d"),
            "priority_score": 0.5,
            "suggested_category": "Personal",
            "suggested_category_id": map_ai_category_to_id('Personal'),
            "contextual_suggestions": []
        }