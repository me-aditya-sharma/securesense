from datetime import datetime

OFFICIAL_CHANNELS = [
    {
        "id": "nch",
        "name": "National Consumer Helpline (NCH)",
        "toll_free": "1915",
        "sms_number": "8800001915",
        "portal_url": "https://consumerhelpline.gov.in",
        "purpose": "First-line statutory grievance lodging against registered e-commerce merchants, airlines, banks, and telecom providers.",
        "badge": "Central Government Portal"
    },
    {
        "id": "ejagriti",
        "name": "e-Jagriti (e-Daakhil Portal)",
        "portal_url": "https://edaakhil.nic.in",
        "purpose": "Digital filing of formal legal complaints directly before District, State, and National Consumer Commissions without physical court presence.",
        "badge": "Digital Consumer Court"
    },
    {
        "id": "cybercrime",
        "name": "National Cyber Crime Reporting Portal",
        "toll_free": "1930",
        "portal_url": "https://cybercrime.gov.in",
        "purpose": "Immediate financial fraud reporting (Golden Hour helpline 1930) to freeze recipient mule bank accounts and UPI nodes.",
        "badge": "MHA Law Enforcement"
    }
]

def generate_complaint_draft(data: dict) -> dict:
    incident_type = data.get("incident_type", "Consumer Dispute / Cyber Fraud")
    complainant_name = data.get("complainant_name", "[Consumer Name]")
    complainant_phone = data.get("complainant_phone", "[Consumer Phone]")
    complainant_city = data.get("complainant_city", "[Consumer City/State]")
    opposite_party = data.get("opposite_party", "[Merchant / Entity / Caller Name]")
    transaction_ref = data.get("transaction_ref", "[UPI Ref / Transaction ID / Phone Number]")
    disputed_amount = data.get("disputed_amount", "0")
    incident_date = data.get("incident_date", datetime.now().strftime("%Y-%m-%d"))
    description = data.get("description", "")
    evidence_points = data.get("evidence_points", [])

    is_cybercrime = any(k in incident_type.lower() for k in ["otp", "phishing", "impersonation", "advance fee", "cyber", "screen share"])

    if is_cybercrime:
        primary_forum = "National Cyber Crime Reporting Portal (cybercrime.gov.in) & 1930 Helpline"
        statutory_act = "Section 66D Information Technology Act, 2000 (Cheating by personation using computer resource) & Section 318 Bharatiya Nyaya Sanhita, 2023"
        filing_channel = OFFICIAL_CHANNELS[2] # cybercrime
    else:
        primary_forum = "District Consumer Disputes Redressal Commission (DCDRC) via e-Jagriti / NCH 1915"
        statutory_act = "Section 2(47) (Unfair Trade Practice) & Section 35 Consumer Protection Act, 2019"
        filing_channel = OFFICIAL_CHANNELS[0] # NCH

    evidence_text = "\n".join([f"  - {e}" for e in evidence_points]) if evidence_points else "  - Digital communication logs and timestamps annexed."

    draft = f"""BEFORE THE COMPETENT STATUTORY AUTHORITY / GRIEVANCE FORUM

IN THE MATTER OF:
{complainant_name}
Resident of: {complainant_city}
Contact: {complainant_phone}
... COMPLAINANT / AGGRIEVED PARTY

VERSUS

{opposite_party}
... OPPOSITE PARTY / ACCUSED ENTITY

SUBJECT: FORMAL STATUTORY COMPLAINT REGARDING {incident_type.upper()} UNDER {statutory_act}

RESPECTFULLY SHEWETH:

1. PARTICULARS OF THE INCIDENT:
   - Date of Occurrence: {incident_date}
   - Reference / Transaction Identifier: {transaction_ref}
   - Disputed Financial Quantum: INR {disputed_amount}
   - Recommended Jurisdiction: {primary_forum}

2. BRIEF STATEMENT OF FACTS:
{description or 'The complainant was targeted by the Opposite Party through deceptive and fraudulent electronic representations without legitimate statutory authorization.'}

3. EVIDENCE OF UNFAIR PRACTICE / FORENSIC ANOMALY:
{evidence_text}

4. STATUTORY VIOLATIONS:
   The acts and omissions of the Opposite Party constitute a blatant violation of:
   - Consumer Protection Act, 2019 (Protection against Unfair Trade Practices & Right to Redressal)
   - Pertinent Reserve Bank of India (RBI) Circulars on Limited Customer Liability in Unauthorized Electronic Transactions (where applicable).

5. RELIEF SOUGHT:
   a) Direction to the Opposite Party / Recipient Intermediary to immediately reverse and refund the disputed sum of INR {disputed_amount} along with interest.
   b) Direction to freeze associated beneficiary accounts / illicit telephone identifiers.
   c) Compensation for mental agony, harassment, and legal expenses incurred.

VERIFICATION:
I, {complainant_name}, do hereby verify that the contents of paragraphs 1 to 5 are true and correct to the best of my knowledge and belief. No material facts have been concealed.

Date: {datetime.now().strftime("%d-%B-%Y")}
Place: {complainant_city}

_____________________________
Signature of Complainant
"""

    return {
        "status": "draft_created",
        "primary_forum": primary_forum,
        "statutory_act": statutory_act,
        "filing_channel": filing_channel,
        "official_channels": OFFICIAL_CHANNELS,
        "draft_text": draft.strip()
    }
