import re

NEGATION_PATTERNS = [
    r"never\s+(?:share|disclose|tell|give|send)\s+(?:your\s+)?(?:otp|pin|password|cvv|credentials)",
    r"(?:do\s+not|don'?t)\s+(?:share|disclose|give|tell|enter|send)\s+(?:your\s+)?(?:otp|pin|password|cvv)",
    r"will\s+never\s+ask\s+(?:you\s+)?for\s+(?:your\s+)?(?:otp|pin|password|cvv|credentials)",
    r"beware\s+of\s+(?:fraud|scam|fake)",
    r"strictly\s+confidential.*(?:do\s+not|never)\s+share",
    r"caution:?\s+(?:do\s+not|never)",
    r"neither\s+rbi\s+nor\s+(?:your\s+)?bank\s+will\s+ever\s+ask"
]

SCAM_RULES = {
    "otp_pin_demand": {
        "label": "Credential / OTP Harvesting",
        "severity": "CRITICAL",
        "patterns": [
            r"(?:share|tell|give|send|provide|read\s+out|enter)\s+(?:the\s+|your\s+)?(?:otp|one-time\s+password|verification\s+code|6-digit\s+code|4-digit\s+code|pin|cvv|password)",
            r"(?:what\s+is|what's)\s+(?:the\s+|your\s+)?(?:code|otp|pin|verification\s+number)",
            r"(?:forward|sms)\s+(?:the|that)\s+(?:code|message|otp)",
            r"read\s+me\s+the\s+(?:code|otp|message)"
        ],
        "action": "Immediate alert: Legitimate banks, RBI, and merchant platforms NEVER ask for your OTP, PIN, or CVV over call or SMS. Disconnect immediately."
    },
    "refund_advance_fee": {
        "label": "Advance Fee / Fake Refund Extortion",
        "severity": "CRITICAL",
        "patterns": [
            r"(?:pay|transfer|send|deposit)\s+(?:a\s+)?(?:small\s+fee|processing\s+fee|registration\s+charge|refundable\s+deposit|advance\s+amount|gst\s+charges)",
            r"(?:refund|cashback|lottery|prize|reward)\s+(?:can\s+only\s+be\s+released|will\s+be\s+processed)\s+(?:after|once\s+you\s+pay|by\s+paying)",
            r"(?:send|pay)\s+(?:rs\.?|inr|rupees)?\s*\d+\s*(?:to\s+claim|to\s+activate|to\s+unlock|to\s+receive)",
            r"(?:claim\s+your\s+refund\s+by\s+sending|send\s+money\s+to\s+get\s+refund)"
        ],
        "action": "No lawful refund requires you to send money first or scan a QR code. Any request to pay to receive money is an advance-fee fraud."
    },
    "authority_impersonation": {
        "label": "Fake Official / Authority Impersonation",
        "severity": "HIGH",
        "patterns": [
            r"(?:calling|this\s+is)\s+from\s+(?:the\s+)?(?:reserve\s+bank|rbi|cyber\s+crime|police\s+department|customs\s+office|income\s+tax|telecom\s+regulatory|trai|cbi|enforcement\s+directorate|ed)",
            r"(?:head\s+office|fraud\s+prevention\s+team|security\s+division)\s+of\s+(?:sbi|hdfc|icici|axis|punjab\s+national|bank\s+of\s+baroda|canara)",
            r"(?:digital\s+arrest|arrest\s+warrant|court\s+notice)\s+(?:issued|against\s+you|in\s+your\s+name)"
        ],
        "action": "No police official, CBI, RBI, or court in India conducts 'digital arrests' or resolves criminal cases over WhatsApp video calls."
    },
    "urgency_threat": {
        "label": "Coercive Urgency & Disconnection Threats",
        "severity": "HIGH",
        "patterns": [
            r"(?:account|sim|card|service|electricity|power)\s+(?:will\s+be|is)\s+(?:blocked|suspended|terminated|disconnected|deactivated)\s+(?:immediately|tonight|within\s+\d+\s+hours?|within\s+\d+\s+minutes?|right\s+now)",
            r"(?:act\s+fast|immediate\s+action\s+required|urgent\s+notice|last\s+warning|time\s+sensitive)",
            r"(?:before\s+it\s+is|before\s+it's)\s+too\s+late",
            r"(?:electricity\s+bill\s+unpaid|power\s+supply\s+will\s+be\s+disconnected\s+at\s+9:30\s+pm)"
        ],
        "action": "Urgency is engineered to bypass critical thinking. State DISCOMs and licensed banks give written statutory notices, not instant phone ultimatums."
    },
    "suspicious_links_apps": {
        "label": "Malicious Link / APK Sideloading",
        "severity": "HIGH",
        "patterns": [
            r"(?:download|install)\s+(?:this\s+)?(?:apk|app|file|software|utility)\s+(?:from|via)?",
            r"(?:click\s+on|visit|open)\s+(?:this\s+|the\s+)?(?:link|url|website|attachment)",
            r"(?:bit\.ly|tinyurl|t\.me|ngrok|\.xyz|\.top|\.club|\.site|\.apk|drive\.google\.com)",
            r"(?:update|re-verify)\s+your\s+(?:pan|aadhaar|kyc)\s+by\s+clicking"
        ],
        "action": "Never install APK files sent via WhatsApp/SMS or click shortlinks for KYC. Genuine bank apps are only downloaded from Google Play Store or Apple App Store."
    },
    "remote_access": {
        "label": "Remote Screen-Access Request",
        "severity": "CRITICAL",
        "patterns": [
            r"(?:download|install|open)\s+(?:anydesk|teamviewer|quicksupport|rustdesk|screen\s+share|zoho\s+assist)",
            r"share\s+(?:your\s+)?(?:screen|9-digit\s+code|session\s+id)\s+for\s+(?:verification|support|fixing|assistance)"
        ],
        "action": "Installing screen-sharing apps grants the scammer full remote control over your phone, banking apps, and SMS OTPs."
    },
    "verification_avoidance": {
        "label": "Verification Avoidance & Secrecy Pressure",
        "severity": "MEDIUM",
        "patterns": [
            r"(?:do\s+not|don'?t)\s+(?:disconnect|hang\s+up|cut\s+the\s+call)",
            r"(?:keep\s+this|stay)\s+(?:confidential|on\s+the\s+line)",
            r"(?:don'?t|do\s+not)\s+(?:tell|inform|discuss\s+with)\s+(?:anyone|your\s+family|bank\s+branch|friends)",
            r"(?:between\s+you\s+and\s+me|confidential\s+police\s+investigation)"
        ],
        "action": "Legitimate organizations always encourage you to verify their identity via official public helplines or in person."
    },
    "forced_upgrade_fee": {
        "label": "Forced Upgrade / Hidden Fees",
        "severity": "HIGH",
        "patterns": [
            r"mandatory.*(?:upgrade|subscription|tier).*\\$\\d+",
            r"automatic.*upgrade.*standard rate",
            r"additional.*fee.*increased.*rate",
            r"cancellation.*requires.*physical mail.*60 days",
            r"early termination fee"
        ],
        "action": "Verify subscription terms through official portal; do not accept automatic upgrades or fees without explicit consent."
    },

}

def redact_sensitive(text: str) -> str:
    """Mask OTPs, passwords, and 16-digit card formats to ensure zero sensitive credential storage."""
    # 4 to 6 digit standalone numbers preceded by otp/code
    redacted = re.sub(r'(?i)\b(otp|code|pin|password)[:\s-]*\b(\d{4,8})\b', r'\1: [REDACTED-NUMERIC]', text)
    # 16-digit card pattern
    redacted = re.sub(r'\b(?:\d{4}[ -]?){3}\d{4}\b', '[REDACTED-CARD-NUMBER]', redacted)
    return redacted

def analyze_communication(text: str) -> dict:
    raw_text = text.strip() if text else ""
    if len(raw_text) < 10:
        return {
            "risk_level": "INSUFFICIENT EVIDENCE",
            "risk_score": 10,
            "confidence": "Low",
            "categories": [],
            "evidence": ["Input text is too short (< 10 characters) to identify intent or linguistic deception patterns."],
            "recommended_actions": [
                "Provide a complete transcript excerpt, SMS text, or call dialogue to perform a valid threat audit.",
                "Ensure caller claims, requests, and instructions are clearly documented."
            ],
            "redacted_text": raw_text
        }

    lower_text = raw_text.lower()
    
    # 1. Check for genuine security advisory negation context
    is_negation_advisory = False
    for neg_pat in NEGATION_PATTERNS:
        if re.search(neg_pat, lower_text):
            is_negation_advisory = True
            break

    # 2. Match scam categories
    flagged_categories = []
    evidence_points = []
    critical_count = 0
    high_count = 0

    for cat_id, info in SCAM_RULES.items():
        matched = False
        for pat in info["patterns"]:
            match = re.search(pat, lower_text)
            if match:
                # If this rule is OTP demand but the text is an explicit advisory warning ("never share your OTP"), bypass
                if cat_id == "otp_pin_demand" and is_negation_advisory:
                    continue
                
                matched = True
                matched_snippet = raw_text[max(0, match.start() - 10): min(len(raw_text), match.end() + 10)]
                evidence_points.append(f"Flagged {info['label']}: Matched trigger phrasing near '...{matched_snippet.strip()}...'")
                break
        
        if matched:
            flagged_categories.append({
                "id": cat_id,
                "label": info["label"],
                "severity": info["severity"],
                "action": info["action"]
            })
            if info["severity"] == "CRITICAL":
                critical_count += 1
            elif info["severity"] == "HIGH":
                high_count += 1

    # 3. Determine Risk Level & Composite Heuristic Score
    if is_negation_advisory and len(flagged_categories) == 0:
        risk_level = "LOW"
        risk_score = 12
        confidence = "High"
        evidence_points = [
            "Analyzed text contains protective statutory warnings (e.g. 'Never share your OTP / Bank will not ask for PIN').",
            "No coercive extraction, link sideloading, or fraudulent advance-fee demands found."
        ]
        recommended_actions = [
            "This communication appears to be a legitimate banking advisory or standard security caution.",
            "Always follow the stated advice: Never share credentials, passwords, or one-time codes."
        ]
    elif len(flagged_categories) == 0:
        risk_level = "LOW"
        risk_score = 20
        confidence = "Moderate"
        evidence_points = ["No common deceptive triggers, credential harvesting, or extortion phrasing detected."]
        recommended_actions = [
            "Communication shows low threat indicators. Maintain standard digital hygiene.",
            "Verify any commercial offers or dispute resolutions through verified customer care channels."
        ]
    elif critical_count >= 1 or len(flagged_categories) >= 2 or (high_count >= 1 and len(raw_text) > 40):
        risk_level = "HIGH"
        risk_score = min(75 + (critical_count * 10) + (high_count * 5), 98)
        confidence = "High"
        recommended_actions = [
            cat["action"] for cat in flagged_categories
        ]
        recommended_actions.append("Freeze pending digital transfers immediately if credentials were leaked.")
        recommended_actions.append("Dial 1930 immediately or log an online complaint at cybercrime.gov.in.")
    else:
        risk_level = "MODERATE"
        risk_score = 52
        confidence = "Moderate"
        recommended_actions = [
            cat["action"] for cat in flagged_categories
        ]
        recommended_actions.append("Do not click links or make payments until identity is verified via an official portal.")

    redacted = redact_sensitive(raw_text)

    return {
        "risk_level": risk_level,
        "risk_score": risk_score,
        "confidence": confidence,
        "categories": [c["label"] for c in flagged_categories],
        "evidence": evidence_points,
        "recommended_actions": list(dict.fromkeys(recommended_actions)), # Unique actions
        "redacted_text": redacted
    }
