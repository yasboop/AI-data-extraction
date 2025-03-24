"""
Vercel serverless function entry point
"""
from api import app, handler

# Export the handler for Vercel
app = app  # FastAPI app instance
"""
Vercel will use the 'handler' variable directly
""" 