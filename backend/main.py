import json
import os
import shutil
from datetime import datetime
from typing import Optional, List
from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from pydantic import BaseModel

from backend.database import get_connection, init_db
from backend.services.nlp_engine import analyze_communication
from backend.services.rights_data import CONSUMER_RIGHTS_INDIA, DISPUTE_VS_CYBERCRIME
from backend.services.complaint_engine import generate_complaint_draft, OFFICIAL_CHANNELS
from backend.services.audio_service import analyze_audio_file

app = FastAPI(
    title="SecureSense 2.0 API",
    description="Consumer Rights & Communication Threat Diagnostics Engine (India)",
    version="2.0.0"
)

# CORS enabled
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

UPLOAD_DIR = os.path.join(os.path.dirname(__file__), "uploads")
AUDIO_DATA_DIR = os.path.join(os.path.dirname(__file__), "audio", "data")
os.makedirs(UPLOAD_DIR, exist_ok=True)
os.makedirs(AUDIO_DATA_DIR, exist_ok=True)

# 4 Real Sample Communication Scenarios
SAMPLE_SCENARIOS = [
    {
        "id": "sample_fake_refund",
        "title": "Advance-Fee Refund Scam",
        "badge": "E-Commerce / UPI Fraud",
        "category": "Fake Refund Fee",
        "text": "Dear Customer, your Flipkart refund of Rs 4,999 is stuck in escrow. To release the pending refund immediately, you must transfer a registration processing fee of Rs 499 to UPI id refunds-escrow@ybl within 15 minutes or your refund will be cancelled.",
        "description": "Simulates deceptive advance fees requested under the guise of processing pending consumer refunds."
    },
    {
        "id": "sample_otp_phishing",
        "title": "Urgent Bank KYC & OTP Harvesting",
        "badge": "Banking Impersonation",
        "category": "Credential Extraction",
        "text": "Calling from State Bank of India Security Head Office. Your savings account is suspended due to incomplete PAN-Aadhaar KYC update. Please share the 6-digit OTP code you just received on your mobile right now to unblock your account before 5 PM.",
        "description": "Demonstrates coercive urgency combined with direct requests to disclose one-time passwords."
    },
    {
        "id": "sample_legitimate_advisory",
        "title": "Legitimate Bank Security Caution",
        "badge": "Genuine Advisory",
        "category": "Safe Consumer Notice",
        "text": "Dear Customer, SBI will NEVER ask for your OTP, PIN, CVV, or net banking password over call, SMS, or email. Beware of fake lottery calls or remote access links. Always keep your credentials strictly confidential.",
        "description": "Tests context negation logic: proves that cautionary security advice containing 'OTP' is NOT falsely flagged."
    },
    {
        "id": "sample_electricity_threat",
        "title": "Power Disconnection Scam",
        "badge": "Utility Extortion",
        "category": "Coercive Threats & APK",
        "text": "Electricity Office Notice: Your power connection will be disconnected tonight at 9:30 PM due to unpaid electricity bill. Contact our power officer immediately at 9876543210 and install our quick bill pay APK utility to prevent disconnection.",
        "description": "Simulates common utility bill scareware directing users to sideload malicious APK applications."
    }
]

# Real Sample Audio Files from SIH Dataset
SAMPLE_AUDIO_FILES = [
    {
        "id": "audio_genuine_1",
        "title": "Genuine Consumer Dialogue 1",
        "filename": "user1_genuine_1.wav",
        "expected_label": "Genuine Sample Audio",
        "transcript": "Hello, I am calling to follow up on the status of my order delivery."
    },
    {
        "id": "audio_imposter_1",
        "title": "Imposter / Suspicious Voice Sample",
        "filename": "user2_imposter_1.wav",
        "expected_label": "Suspicious Acoustic Clip",
        "transcript": "Urgent security verification: Share your OTP immediately to avoid account suspension."
    }
]

class TextAnalyzeRequest(BaseModel):
    text: str
    title: Optional[str] = None

class ComplaintRequest(BaseModel):
    complainant_name: Optional[str] = "Aggrieved Consumer"
    complainant_phone: Optional[str] = ""
    complainant_city: Optional[str] = ""
    opposite_party: Optional[str] = ""
    incident_type: Optional[str] = "Consumer Dispute"
    transaction_ref: Optional[str] = ""
    disputed_amount: Optional[str] = "0"
    incident_date: Optional[str] = ""
    description: Optional[str] = ""
    evidence_points: Optional[List[str]] = []

@app.on_event("startup")
def startup_event():
    init_db()

@app.get("/api/health")
def health_check():
    return {
        "status": "healthy",
        "app": "SecureSense 2.0",
        "domain": "Consumer Rights & Fraud Prevention (India)",
        "timestamp": datetime.now().isoformat()
    }

@app.get("/api/samples")
def get_sample_scenarios():
    return SAMPLE_SCENARIOS

@app.get("/api/audio/samples")
def get_sample_audio_list():
    return SAMPLE_AUDIO_FILES

@app.get("/api/audio/stream/{filename}")
def stream_audio_file(filename: str):
    safe_name = os.path.basename(filename)
    path = os.path.join(AUDIO_DATA_DIR, safe_name)
    if not os.path.exists(path):
        # Also check uploads
        path = os.path.join(UPLOAD_DIR, safe_name)
    if not os.path.exists(path):
        raise HTTPException(status_code=404, detail="Audio file not found")
    return FileResponse(path, media_type="audio/wav")

@app.post("/api/analyze/sample-audio/{sample_id}")
def analyze_sample_audio(sample_id: str):
    target = next((s for s in SAMPLE_AUDIO_FILES if s["id"] == sample_id), None)
    if not target:
        raise HTTPException(status_code=404, detail="Sample audio not found")
    
    file_path = os.path.join(AUDIO_DATA_DIR, target["filename"])
    voice_result = analyze_audio_file(file_path)
    nlp_result = analyze_communication(target["transcript"])
    
    item_title = target["title"]
    created_at = datetime.now().isoformat()

    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("""
    INSERT INTO analyses (
        created_at, input_type, title, input_text, audio_filename,
        risk_level, risk_score, confidence, categories, evidence,
        recommended_actions, voice_result, redacted_preview
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, (
        created_at,
        "audio",
        item_title,
        target["transcript"],
        target["filename"],
        nlp_result["risk_level"],
        nlp_result["risk_score"],
        nlp_result["confidence"],
        json.dumps(nlp_result["categories"]),
        json.dumps(nlp_result["evidence"]),
        json.dumps(nlp_result["recommended_actions"]),
        json.dumps(voice_result),
        nlp_result["redacted_text"]
    ))
    record_id = cursor.lastrowid
    conn.commit()
    conn.close()

    return {
        "id": record_id,
        "created_at": created_at,
        "input_type": "audio",
        "title": item_title,
        "input_text": target["transcript"],
        "audio_filename": target["filename"],
        "risk_level": nlp_result["risk_level"],
        "risk_score": nlp_result["risk_score"],
        "confidence": nlp_result["confidence"],
        "categories": nlp_result["categories"],
        "evidence": nlp_result["evidence"],
        "recommended_actions": nlp_result["recommended_actions"],
        "voice_result": voice_result,
        "redacted_preview": nlp_result["redacted_text"]
    }

@app.post("/api/analyze")
async def analyze_endpoint(
    text: Optional[str] = Form(None),
    title: Optional[str] = Form(None),
    audio_file: Optional[UploadFile] = File(None)
):
    saved_audio_path = None
    input_type = "text"
    content_text = text or ""
    
    if audio_file and audio_file.filename:
        input_type = "audio"
        file_ext = os.path.splitext(audio_file.filename)[1]
        dest_filename = f"audio_{int(datetime.now().timestamp())}{file_ext}"
        saved_audio_path = os.path.join(UPLOAD_DIR, dest_filename)
        
        with open(saved_audio_path, "wb") as buffer:
            shutil.copyfileobj(audio_file.file, buffer)
            
        voice_result = analyze_audio_file(saved_audio_path)
        
        if not content_text.strip():
            content_text = f"Audio upload: {audio_file.filename} ({voice_result.get('duration_seconds', 0)}s). Telemetry: RMS {voice_result.get('rms_energy', 0)}."
    else:
        voice_result = analyze_audio_file(None)

    nlp_result = analyze_communication(content_text)
    
    item_title = title or (content_text[:40] + "..." if len(content_text) > 40 else content_text)
    if not item_title.strip():
        item_title = "Untitled Communication Analysis"

    created_at = datetime.now().isoformat()

    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("""
    INSERT INTO analyses (
        created_at, input_type, title, input_text, audio_filename,
        risk_level, risk_score, confidence, categories, evidence,
        recommended_actions, voice_result, redacted_preview
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, (
        created_at,
        input_type,
        item_title,
        content_text,
        dest_filename if saved_audio_path else None,
        nlp_result["risk_level"],
        nlp_result["risk_score"],
        nlp_result["confidence"],
        json.dumps(nlp_result["categories"]),
        json.dumps(nlp_result["evidence"]),
        json.dumps(nlp_result["recommended_actions"]),
        json.dumps(voice_result),
        nlp_result["redacted_text"]
    ))
    record_id = cursor.lastrowid
    conn.commit()
    conn.close()

    return {
        "id": record_id,
        "created_at": created_at,
        "input_type": input_type,
        "title": item_title,
        "input_text": content_text,
        "audio_filename": dest_filename if saved_audio_path else None,
        "risk_level": nlp_result["risk_level"],
        "risk_score": nlp_result["risk_score"],
        "confidence": nlp_result["confidence"],
        "categories": nlp_result["categories"],
        "evidence": nlp_result["evidence"],
        "recommended_actions": nlp_result["recommended_actions"],
        "voice_result": voice_result,
        "redacted_preview": nlp_result["redacted_text"]
    }

@app.post("/api/analyze/json")
def analyze_json_endpoint(payload: TextAnalyzeRequest):
    voice_result = analyze_audio_file(None)
    nlp_result = analyze_communication(payload.text)
    
    item_title = payload.title or (payload.text[:40] + "..." if len(payload.text) > 40 else payload.text)
    if not item_title.strip():
        item_title = "Untitled Communication Analysis"

    created_at = datetime.now().isoformat()

    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("""
    INSERT INTO analyses (
        created_at, input_type, title, input_text, audio_filename,
        risk_level, risk_score, confidence, categories, evidence,
        recommended_actions, voice_result, redacted_preview
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, (
        created_at,
        "text",
        item_title,
        payload.text,
        None,
        nlp_result["risk_level"],
        nlp_result["risk_score"],
        nlp_result["confidence"],
        json.dumps(nlp_result["categories"]),
        json.dumps(nlp_result["evidence"]),
        json.dumps(nlp_result["recommended_actions"]),
        json.dumps(voice_result),
        nlp_result["redacted_text"]
    ))
    record_id = cursor.lastrowid
    conn.commit()
    conn.close()

    return {
        "id": record_id,
        "created_at": created_at,
        "input_type": "text",
        "title": item_title,
        "input_text": payload.text,
        "risk_level": nlp_result["risk_level"],
        "risk_score": nlp_result["risk_score"],
        "confidence": nlp_result["confidence"],
        "categories": nlp_result["categories"],
        "evidence": nlp_result["evidence"],
        "recommended_actions": nlp_result["recommended_actions"],
        "voice_result": voice_result,
        "redacted_preview": nlp_result["redacted_text"]
    }

@app.get("/api/history")
def get_history():
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("""
    SELECT id, created_at, input_type, title, risk_level, risk_score, confidence, categories, redacted_preview
    FROM analyses
    ORDER BY id DESC
    """)
    rows = cursor.fetchall()
    conn.close()

    results = []
    for r in rows:
        results.append({
            "id": r["id"],
            "created_at": r["created_at"],
            "input_type": r["input_type"],
            "title": r["title"],
            "risk_level": r["risk_level"],
            "risk_score": r["risk_score"],
            "confidence": r["confidence"],
            "categories": json.loads(r["categories"]) if r["categories"] else [],
            "redacted_preview": r["redacted_preview"]
        })
    return results

@app.get("/api/history/{record_id}")
def get_history_detail(record_id: int):
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM analyses WHERE id = ?", (record_id,))
    row = cursor.fetchone()
    conn.close()

    if not row:
        raise HTTPException(status_code=404, detail="Analysis record not found")

    return {
        "id": row["id"],
        "created_at": row["created_at"],
        "input_type": row["input_type"],
        "title": row["title"],
        "input_text": row["input_text"],
        "audio_filename": row["audio_filename"],
        "risk_level": row["risk_level"],
        "risk_score": row["risk_score"],
        "confidence": row["confidence"],
        "categories": json.loads(row["categories"]) if row["categories"] else [],
        "evidence": json.loads(row["evidence"]) if row["evidence"] else [],
        "recommended_actions": json.loads(row["recommended_actions"]) if row["recommended_actions"] else [],
        "voice_result": json.loads(row["voice_result"]) if row["voice_result"] else {},
        "redacted_preview": row["redacted_preview"]
    }

@app.delete("/api/history/{record_id}")
def delete_history_item(record_id: int):
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM analyses WHERE id = ?", (record_id,))
    deleted = cursor.rowcount > 0
    conn.commit()
    conn.close()
    
    if not deleted:
        raise HTTPException(status_code=404, detail="Record not found")
    return {"status": "success", "message": f"Record {record_id} deleted"}

@app.get("/api/stats")
def get_stats():
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT COUNT(*) as count FROM analyses")
    total = cursor.fetchone()["count"]

    cursor.execute("SELECT risk_level, COUNT(*) as count FROM analyses GROUP BY risk_level")
    breakdown_rows = cursor.fetchall()
    
    breakdown = {"HIGH": 0, "MODERATE": 0, "LOW": 0, "INSUFFICIENT EVIDENCE": 0}
    for r in breakdown_rows:
        if r["risk_level"] in breakdown:
            breakdown[r["risk_level"]] = r["count"]

    cursor.execute("""
    SELECT id, created_at, input_type, title, risk_level, risk_score, categories
    FROM analyses
    ORDER BY id DESC LIMIT 5
    """)
    recent = []
    for r in cursor.fetchall():
        recent.append({
            "id": r["id"],
            "created_at": r["created_at"],
            "input_type": r["input_type"],
            "title": r["title"],
            "risk_level": r["risk_level"],
            "risk_score": r["risk_score"],
            "categories": json.loads(r["categories"]) if r["categories"] else []
        })

    conn.close()
    return {
        "total_analyzed": total,
        "breakdown": breakdown,
        "recent_analyses": recent
    }

@app.get("/api/rights")
def get_consumer_rights():
    return {
        "rights": CONSUMER_RIGHTS_INDIA,
        "dispute_vs_cybercrime": DISPUTE_VS_CYBERCRIME,
        "source": "Consumer Protection Act, 2019 & Central Consumer Protection Authority (CCPA)"
    }

@app.post("/api/complaints/draft")
def create_complaint_draft(payload: ComplaintRequest):
    return generate_complaint_draft(payload.dict())
